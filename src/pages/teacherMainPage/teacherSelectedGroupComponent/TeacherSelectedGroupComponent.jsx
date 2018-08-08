import React from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import blue from '@material-ui/core/colors/blue';
import StudentTemplate from '../studentTemplate/StudentTemplate.jsx';
import Button from '@material-ui/core/Button';

const styles = {
  groupsAlign: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  root: {
    color: blue[600],
    '&$checked': {
      color: blue[500],
    },
  },
  addStudentButton: {
    '&:hover': {
      backgroundColor: '#1b77c5',
    },
    transition: '.3s',
    width: 200,
    color: '#fff',
    backgroundColor: '#2196f3',
  },
  teacherButtonsHolder: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: 15,
    marginBottom: 10,
  },
  buttonCorrection: {
    paddingRight: 25,
  },
  noUnderline: {
    textDecoration: 'none',
    color: '#000',
  },
  checked: {},
  group: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  student: {
    padding: '4px 5px !important',
  },
};

class TeacherSelectedGroupComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      checked: false,
    };
  }

  handleChange = (e) => {
    this.setState({
      checked: e.target.checked,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.group}>
        <Typography className={classes.groupsAlign} align="center">
          <div>
            {this.props.groupName}
          </div>
          <div>
            студентов: {this.props.groupMembers.length}
          </div>
          <FormControlLabel
            control={(
              <Checkbox
                checked={this.state.checked}
                classes={{
                  root: classes.root,
                  checked: classes.checked,
                }}
                onChange={this.handleChange}
                icon={<CheckBoxOutlineBlankIcon className={classes.sizeIcon} />}
                checkedIcon={<CheckBoxIcon className={classes.sizeIcon} />}
                value="checkedI"
              />
            )}
          />
        </Typography>
        <List>
          {this.props.groupMembers.map((item, index) => (
            <ListItem className={classes.student} button key={`selectedgroup${index}`}>
              <StudentTemplate
                key={`stud${index}`}
                name={`${item.firstName} ${item.lastName}`}
                tasksComplete={item.amountOfTasks}
                testsComplete={item.amountOfTests}
                score={item.mediumMark}
                checkFlag={this.state.checked}
              />
            </ListItem>
          ))}
        </List>

        <div className={classes.teacherButtonsHolder}>
          <div className={classes.buttonCorrection}>
            <Button className={classes.addStudentButton} variant="contained">
              Добавить студента
            </Button>
          </div>
          <div className={classes.buttonCorrection}>
            <Button className={classes.addStudentButton} variant="contained">
              Назначить тест
            </Button>
          </div>
          <div className={classes.buttonCorrection}>
            <Button className={classes.addStudentButton} variant="contained">
              Назначить задачу
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(TeacherSelectedGroupComponent);
