const express = require('express');
const got = require('got');
const mongoose = require('mongoose');
const fs = require('fs');
const FormData = require('form-data');

const Task = require('../models/Task');
const Topic = require('../models/Topic');
const Language = require('../models/Language');
const Question = require('../models/Question');
const mapping = require('../utils/mapping/map');
const User = require('../models/User');
const dataFunctions = require('../utils/dataFunctions');
const uploadFiles = require('../utils/uploadFiles.js');
const fileSystemFunctions = require('../utils/fileSystemFunctions.js');


const router = express.Router();

router.use((req, res, next) => {
  if (req.user.status === 'teacher' || req.user.status === 'admin') {
    return next();
  }
  return res.status(403).end();
});

router.get('/tasks', (req, res) => {
  let hashSet = {};
  Task.find().populate('topicId', 'name').exec((err, tasks) => {
    if (err) res.status(500).end();
    tasks.forEach((task) => {
      const newTask = mapping.mapTaskToDto(task);
      if (!hashSet[task.topicId.name]) {
        hashSet[task.topicId.name] = {
          topicName: task.topicId.name,
          tasks: [newTask],
        };
        return;
      }
      hashSet[task.topicId.name].tasks.push(newTask);
    });
    hashSet = Object.keys(hashSet).map(key => hashSet[key]);
    res.send(hashSet);
  });
});

router.get('/task', async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(400).end();
    }
    const taskId = req.query.id;
    const result = await dataFunctions.getTaskInfo(taskId);
    return res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.get('/full/task', async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(400).end();
    }
    const taskId = req.query.id;
    const result = await dataFunctions.getFullTaskInfo(taskId);
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.post('/task/editing', async (req, res, next) => {
  if (!(await Task.findById(req.query.id))) {
    res.status(400).send('Invalid task id, there is no such task id in the data base');
  } else {
    next();
  }
});

// {
//   topicId: String;
//   tags: [String];
//   description: String;
//   name: String;
//   weight: Number;
//   language: String;
//   tests: [{
//     _id: String;
//     weight: Number;
//   }];
//   passResult: Number;
// }
router.put('/task/editing', uploadFiles.uploadTests.array('tests'), async (req, res) => {
  const dataBaseEdit = {};
  const testsEdit = [];
  const editObj = JSON.parse(req.body.taskInfo);
  try {
    await dataFunctions.checkEditTaskDataFunc(dataBaseEdit, testsEdit, editObj, req);
  } catch (error) {
    res.status(400).send(error.message);
    return;
  }
  try {
    try {
      await Task.findByIdAndUpdate(req.query.id, dataBaseEdit);
    } catch (error) {
      res.status(400).send(error.message);
      return;
    }
    for (let index = 0; index < testsEdit.length; index++) {
      await Task.updateOne({ _id: mongoose.Types.ObjectId(req.query.id), 'tests._id': mongoose.Types.ObjectId(testsEdit[index].id) }, {
        $set: { 'tests.$.weight': testsEdit[index].weight },
      });
      await Task.findByIdAndUpdate(req.query.id, { $addToSet: { tests: { _id: mongoose.Types.ObjectId(testsEdit[index].id), weight: testsEdit[index].weight } } });
    }
    for (let index = 0; index < editObj.testsIdsToDelete.length; index++) {
      await dataFunctions.deleteTaskFolderFunc(`${req.query.id}/${editObj.testsIdsToDelete[index]}`);
    }
    editObj.testsIdsToDelete = editObj.testsIdsToDelete.map((id) => {
      return mongoose.Types.ObjectId(id);
    });
    await Task.findByIdAndUpdate(req.query.id, { $pull: { tests: { _id: { $in: editObj.testsIdsToDelete } } } });
  } catch (error) {
    res.status(500).send('Critical saving error, some data might have not been saved into the data base');
    return;
  }
  res.status(200).send('Operation successful');
});

router.use(async (err, req, res, next) => {
  if (err.message === 'Invalid format of some files') {
    res.status(400).send(err.message);
  } else {
    throw (err);
  }
});

router.post('/task', (req, res, next) => {
  req.query.id = (new mongoose.Types.ObjectId()).toString();
  next();
});

router.post('/task', uploadFiles.uploadTests.array('tests'), async (req, res) => {
  const dataBaseAdd = { _id: mongoose.Types.ObjectId(req.query.id) };
  const addObj = JSON.parse(req.body.taskInfo);
  try {
    await dataFunctions.checkAddTaskDataFunc(dataBaseAdd, addObj, req);
  } catch (error) {
    res.status(400).send(error.message);
    dataFunctions.deleteTaskFolderFunc(req.query.id);
    return;
  }
  try {
    const newTask = new Task(dataBaseAdd);
    await newTask.save();
    res.status(200).send('Operation successful');
  } catch (error) {
    dataFunctions.deleteTaskFolderFunc(req.query.id);
    res.status(500).send(error.message);
  }
});

router.get('/questions', (req, res) => {
  let hashSet = {};
  Question.find().populate('topicId', 'name').exec((err, questions) => {
    if (err) res.status(500).end();
    questions.forEach((question) => {
      if (!hashSet[question.topicId.name]) {
        hashSet[question.topicId.name] = {
          topicName: question.topicId.name,
          questions: {},
          count: 0,
        };
      }
      if (!hashSet[question.topicId.name].questions[question.kind]) {
        hashSet[question.topicId.name].questions[question.kind] = {
          type: question.kind,
          typeQuestions: [question._id],
          count: 1,
        };
        hashSet[question.topicId.name].count++;
        return;
      }
      hashSet[question.topicId.name].questions[question.kind].typeQuestions.push(question._id);
      hashSet[question.topicId.name].questions[question.kind].count++;
      hashSet[question.topicId.name].count++;
    });
    hashSet = Object.keys(hashSet).map(key => hashSet[key]);
    hashSet.forEach((set) => {
      set.questions = Object.keys(set.questions).map(key => set.questions[key]);
    });
    res.send(hashSet);
  });
});

router.post('/question', (req, res) => {
  dataFunctions.addQuestion(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post('/group/students', (req, res) => {
  const groupID = req.query.groupID;
  const studentIDs = req.body;
  dataFunctions.addStudentsToGroup(groupID, studentIDs)
    .then(answer => res.send(answer))
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.delete('/group/students', (req, res) => {
  const groupID = req.query.groupID;
  const studentIDs = req.body;
  dataFunctions.deleteStudentsToGroup(groupID, studentIDs)
    .then(answer => res.send(answer))
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Возвращает группы, принадлежащие учителю с количеством людей в них
router.get('/group', (req, res) => {
  dataFunctions.getTeachersGroups(req.user._id)
    .then((answer) => {
      res.send(JSON.stringify(answer));
    })
    .catch(err => res.status(500).send(err));
});

router.get('/group/info', async (req, res) => {
  try {
    const groupID = req.query.groupID;
    const result = await dataFunctions.getGroupInfo(groupID);
    res.send(JSON.stringify(result));
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get('/students', async (req, res) => {
  try {
    const result = await dataFunctions.getStudents();
    res.status(200).send(JSON.stringify(result));
  } catch (err) {
    req.status(400).send(err);
  }
});

router.post('/group', async (req, res) => {
  const groupName = req.body.groupName;
  const teacherId = req.user.id;

  const studentArrayIds = req.body.studentsList;

  try {
    const saveGroup = await dataFunctions.createGroup(groupName, teacherId);
    const updateGroup = await dataFunctions.addStudentsToGroup(saveGroup.id, studentArrayIds);
    res.status(200).json({ id: updateGroup.id });
  } catch (err) {
    if (err.toString() === 'Error: Duplicate key') {
      res.status(409).send(err.toString());
    } else {
      res.status(400).send(err.toString());
    }
  }
});

router.use(async (err, req, res, next) => {
  res.status(500).send(err.message);
});

router.get('/all/topics', async (req, res) => {
  try {
    const result = await dataFunctions.getAllTopics();
    res.status(200).json(result);
  } catch (e) {
    res.status(400).send(e.toString());
  }
});

router.post('/new/question', async (req, res) => {
  try {
    await dataFunctions.createQuestion(req.user.id, req.body);
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e.toString());
  }
});

module.exports = router;
