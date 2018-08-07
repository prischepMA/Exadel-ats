import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/es/FormControlLabel/FormControlLabel';
import RadioGroup from '@material-ui/core/es/RadioGroup/RadioGroup';
import Radio from '@material-ui/core/es/Radio/Radio';
import Paper from '@material-ui/core/es/Paper/Paper';
import FormControl from '@material-ui/core/es/FormControl/FormControl';
import Typography from '@material-ui/core/es/Typography/Typography';
import Select from '@material-ui/core/es/Select/Select';
import Input from '@material-ui/core/es/Input/Input';
import MenuItem from '@material-ui/core/es/MenuItem/MenuItem';
import CreateSingleAnswerTest from './CreateSingleAnswerTest';
import { getTestThemes, addTestQuestion } from '../../commands/teacherCreateTestQuestion';
import Spinner from '../../common/shared/spinner';

const styles = theme => ({
  outerWrapper: {
    margin: 'auto',
    width: 'fit-content',
    marginTop: '10px',
    marginBottom: '15px',
  },
  flexContainerHorizontal: {
    display: 'flex',
    flexDirection: 'row',
  },
  flexChildHorizontal: {
    width: 'fit-content',
  },
  content: {
    width: '100%',
  },
  select: {
    width: '500px',
    marginTop: '1.5rem',
    marginBottom: '2rem',
    margin: 'auto',
  },
  block: {
    display: 'block',
  },
});

class TeacherCreateTestQuestion extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedTestType: '',
      selectedTheme: '',
      isTraining: false,
      testDescription: '',
      testComplexity: undefined,
      testAnswerOptions: [],
      correctAnswer: [],
    };

    this.handleRadioBoxChange = this.handleRadioBoxChange.bind(this);
    this.handleSelectUpdate = this.handleSelectUpdate.bind(this);
    this.handleTrainingCheckbox = this.handleTrainingCheckbox.bind(this);
    this.addTestAnswerCallback = this.addTestAnswerCallback.bind(this);
    this.correctAnswerChangeCallback = this.correctAnswerChangeCallback.bind(this);
    this.submitQuestionFormCallback = this.submitQuestionFormCallback.bind(this);
    this.deleteTestAnswerCallback = this.deleteTestAnswerCallback.bind(this);
  }

  handleRadioBoxChange(event) {
    this.setState({
      selectedTestType: event.target.value,
    });
  }

  deleteTestAnswerCallback(event) {
    const index = Number.parseInt(event.currentTarget.id, 10);
    const arr = [...this.state.testAnswerOptions];
    arr.splice(index, 1);
    this.setState({
      testAnswerOptions: arr,
    });
  }

  addTestAnswerCallback(message) {
    if (message !== '') {
      this.state.testAnswerOptions.push(message);
      this.setState({
        testAnswerOptions: this.state.testAnswerOptions,
      });
    }
  }

  correctAnswerChangeCallback(event) {
    const arr = [event.target.value];
    this.setState({
      correctAnswer: arr,
    });
  }

  handleSelectUpdate(event) {
    this.setState({
      selectedTheme: event.target.value,
    });
  }

  handleTrainingCheckbox() {
    this.setState({
      isTraining: !this.state.isTraining,
    });
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  submitQuestionFormCallback() {
    const questionObject = {
      kind: this.state.selectedTestType,
      tags: [],
      correctAnswersIndexes: this.state.correctAnswer,
      answersVariants: this.state.testAnswerOptions,
      topicId: this.state.selectedTheme,
      description: this.state.testDescription,
      isTraining: this.state.isTraining,
      difficultyRate: this.state.testComplexity,
    };
    this.props.addTestQuestion(questionObject);
  }

  componentDidMount() {
    this.props.getTestThemes();
  }

  render() {
    const { classes } = this.props;
    let renderingComponent;
    switch (this.state.selectedTestType) {
      case 'one answer':
        renderingComponent = (
          <CreateSingleAnswerTest
            trainingTask={this.state.isTraining}
            trainingCheckboxCallback={this.handleTrainingCheckbox}
            dataChangeCallback={this.handleChange}
            testDescription={this.state.testDescription}
            testComplexity={this.state.testComplexity}
            testAnswerOptions={this.state.testAnswerOptions}
            correctAnswer={this.state.correctAnswer[0]}
            addTestAnswerCallback={this.addTestAnswerCallback}
            correctAnswerChangeCallback={this.correctAnswerChangeCallback}
            submitQuestionFormCallback={this.submitQuestionFormCallback}
            deleteTestAnswerCallback={this.deleteTestAnswerCallback}
          />
        );
        break;
      case 'multiple answers':
        renderingComponent = 'Hello World 2';
        break;
      case 'without answer option':
        renderingComponent = 'Hello World 3';
        break;
      case 'without answer with verification':
        renderingComponent = 'Hello World 4';
        break;
      default:
        renderingComponent = null;
    }

    return this.props.isLoading ? <Spinner /> : (
      <Paper className={classes.outerWrapper}>
        <FormControl>
          <Typography align="center">Выберите тему:</Typography>

          <Select
            className={classes.select}
            value={this.state.selectedTheme}
            onChange={this.handleSelectUpdate}
            input={<Input name="theme" id="task-theme" />}
          >
            {this.props.themesList && this.props.themesList.map(element => (<MenuItem value={element._id}>{element.name}</MenuItem>))}
          </Select>

          {this.state.selectedTheme === '' ? null : (
            <RadioGroup
              aria-label="Тип теста: "
              name="testType"
              className={classes.flexContainerHorizontal}
              value={this.state.selectedTestType}
              onChange={this.handleRadioBoxChange}
            >
              <FormControlLabel
                value="one answer"
                control={<Radio color="primary" />}
                label="С выбором одного варианта"
                labelPlacement="start"
                className={classes.flexChildHorizontal}
              />
              <FormControlLabel
                value="multiple answers"
                control={<Radio color="primary" />}
                label="Со множественным выбором"
                labelPlacement="start"
                className={classes.flexChildHorizontal}
              />
              <FormControlLabel
                value="without answer option"
                control={<Radio color="primary" />}
                label="Со словом - ответом"
                labelPlacement="start"
                className={classes.flexChildHorizontal}
              />
              <FormControlLabel
                value="without answer with verification"
                control={<Radio color="primary" />}
                label="С предложением - ответом"
                labelPlacement="start"
                className={classes.flexChildHorizontal}
              />
            </RadioGroup>
          )}
        </FormControl>
        <div className={classes.content}>
          {renderingComponent}
        </div>
      </Paper>
    );
  }
}

const styledComponent = withStyles(styles)(TeacherCreateTestQuestion);

const mapStateToProps = state => ({
  isLoading: state.teacherCreateTestQuestion.isLoading,
  themesList: state.teacherCreateTestQuestion.themesList,
});

const mapCommandsToProps = dispatch => ({
  getTestThemes: () => dispatch(getTestThemes()),
  addTestQuestion: questionObject => dispatch(addTestQuestion(questionObject)),
});

export default connect(mapStateToProps, mapCommandsToProps)(styledComponent);
