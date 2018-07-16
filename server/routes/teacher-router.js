const express = require('express');
const Task = require('../models/Task');
const Topic = require('../models/Topic');
const Question = require('../models/Question');
const mapping = require('../utils/mapping/student');
const User = require('../models/User');
const dataFunctions = require('../dataFunctions');

const router = express.Router();

router.use((req, res, next) => {
  next();
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

router.post('/task', (req, res) => {
  dataFunctions.addTask(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => { res.status(500).send(err); });
});

router.post('/question', (req, res) => {
  dataFunctions.addQuestion(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => { res.status(500).send(err); });
});

router.post('/group/students', (req, res) => {
  const groupID = req.query.groupID;
  const studentIDs = req.body;
  dataFunctions.addStudentsToGroup(groupID, studentIDs)
    .then(answer => res.send(answer))
    .catch((err) => { res.status(500).send(err); });
});

router.delete('/group/students', (req, res) => {
  const groupID = req.query.groupID;
  const studentIDs = req.body;
  dataFunctions.deleteStudentsToGroup(groupID, studentIDs)
    .then(answer => res.send(answer))
    .catch((err) => { res.status(500).send(err); });
});

// Возвращает группы, принадлежащие учителю с количеством людей в них
router.get('/group', (req, res) => {
  const teacherID = req.query.teacherID;
  dataFunctions.getTeachersGroups(teacherID)
    .then((answer) => {
      res.send(JSON.stringify(answer));
    })
    .catch(err => res.status(500).send(err));
});

router.get('/group/info', (req, res, next) => {
  const groupID = req.query.groupID;
  // Ещё не готов
  dataFunctions.getGroupInfo(groupID);
});

module.exports = router;