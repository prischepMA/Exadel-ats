import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import SelectWrapped from './selectWrapped/SelectWrapped';

const suggestions = [
  {
    label: 'Студент добавлен в группу',
    value: 'studentGroupAddition',
  },
  {
    label: 'Студент удален из группы',
    value: 'studentGroupRemove',
  },
  {
    label: 'Добавлена группа студентов',
    value: 'groupCreation',
  },
  {
    label: 'Назначена задача студенту',
    value: 'studentTaskAssignment',
  },
  {
    label: 'Назначена задача группе',
    value: 'groupTestAssignment',
  },
  {
    label: 'Назначен тест студенту',
    value: 'studentTestAssignment',
  },
  {
    label: 'Стуент отправил решение задачи',
    value: 'studentTaskSending',
  },
  {
    label: 'Студент прошел тест',
    value: 'studentTestComplete',
  },
  {
    label: 'Учитель проверил тест',
    value: 'teacherTestCheck',
  },
  {
    label: 'Студент пожаловался на вопрос',
    value: 'studentQuestionComplaint',
  },
  {
    label: 'Учитель создал вопрос',
    value: 'teacherQuestionCreation',
  },
  {
    label: 'adminQuestionCreation',
    value: 'Администратор создал вопрос',
  },
  {
    label: 'teacherTaskCreation',
    value: 'Учитель создал задачу',
  },
  {
    label: 'adminTaskCreation',
    value: 'Администратор создал задачу',
  },
  {
    label: 'teacherQuestionBlock',
    value: 'Учитель заблокировал вопрос',
  },
  {
    label: 'adminQuestionBlock',
    value: 'Администратор заблокировал вопрос',
  },
  {
    label: 'teacherRightsToStudentDelegation',
    value: 'Студенту переданы права учителя',
  },
  {
    label: 'adminRightsToStudentDelegation',
    value: 'Студенту переданы права администратора',
  },
  {
    label: 'adminRightsToTeacherDelegation',
    value: 'Учителю переданы права администратора',
  },
];

const ITEM_HEIGHT = 32;

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: '0px',
    padding: '10px',
  },
  '@global': {
    '.Select-control': {
      display: 'flex',
      alignItems: 'center',
      border: 0,
      height: 'auto',
      background: 'transparent',
      '&:hover': {
        boxShadow: 'none',
      },
    },
    '.Select-multi-value-wrapper': {
      flexGrow: 1,
      display: 'flex',
      flexWrap: 'wrap',
    },
    '.Select--multi .Select-input': {
      margin: 0,
      width: '200px',
    },
    '.Select.has-value.is-clearable.Select--single > .Select-control .Select-value': {
      padding: 0,
    },
    '.Select-noresults': {
      padding: theme.spacing.unit * 2,
    },
    '.Select-input': {
      display: 'inline-flex !important',
      maxWidth: '200px',
      height: 'auto',
    },
    '.Select-input input': {
      background: 'transparent',
      border: 0,
      padding: 0,
      cursor: 'default',
      display: 'inline-block',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      margin: 0,
      outline: 0,
    },
    '.Select-placeholder, .Select--single .Select-value': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(16),
      padding: 0,
    },
    '.Select-placeholder': {
      opacity: 0.42,
      color: theme.palette.common.black,
    },
    '.Select-menu-outer': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      position: 'absolute',
      left: 0,
      top: `calc(100% + ${theme.spacing.unit}px)`,
      width: 'fit-content',
      zIndex: 2,
      maxHeight: ITEM_HEIGHT * 4.5,
      borderRadius: '3px',
    },
    '.Select-menu-outer ::-webkit-scrollbar': {
      width: '0.6em',
      background: 'rgba(0, 0, 0, 0.05)',
    },
    '.Select-menu-outer ::-webkit-scrollbar-thumb:hover': {
      background: 'rgba(255, 0, 0, 0.8)',
    },
    '.Select-menu-outer ::-webkit-scrollbar-thumb': {
      width: '1em',
      background: 'rgba(255, 0, 0, 0.6)',
      borderRadius: '3px',
      '-webkit-transition': '.5s',
    },
    '.Select.is-focused:not(.is-open) > .Select-control': {
      boxShadow: 'none',
    },
    '.Select-menu': {
      maxHeight: ITEM_HEIGHT * 4.5,
      overflowY: 'auto',
    },
    '.Select-menu div': {
      boxSizing: 'content-box',
    },
    '.Select-arrow-zone, .Select-clear-zone': {
      color: theme.palette.action.active,
      cursor: 'pointer',
      height: 21,
      width: 21,
      zIndex: 1,
    },
    // Only for screen readers. We can't use display none.
    '.Select-aria-only': {
      position: 'absolute',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      height: 1,
      width: 1,
      margin: -1,
    },
  },
});

class InputWithSuggestions extends React.Component {
  constructor() {
    super();
    this.state = {
      single: null,
    };
  }

  handleChange = (value) => {
    this.setState({
      single: value,
    });
    this.props.onHandleChange('activityType', value);
  };

  render() {
    const { classes } = this.props;
    const { single } = this.state;
    return (
      <div className={classes.root}>
        <Input
          disableUnderline
          fullWidth
          inputComponent={SelectWrapped}
          value={single}
          onChange={this.handleChange}
          placeholder="Тип активности ..."
          id="react-select-single"
          inputProps={{
            onChange: this.handleChange,
            classes,
            name: 'react-select-single',
            instanceId: 'react-select-single',
            simpleValue: true,
            options: suggestions,
          }}
        />
      </div>
    );
  }
}

InputWithSuggestions.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InputWithSuggestions);
