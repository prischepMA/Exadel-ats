import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/es';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { saveAs } from 'file-saver';
import Common from '../../common/styles/Common';
import { getAdminTasks } from '../../commands/admin';
import SearchBox from './searchBox/SearchBox';
import ActivityListItems from './ActivityListItems/ActivityListItems';

const styles = {
  ...Common,
  marginLeft: {
    marginLeft: '5px',
    width: 'calc(100% - 310px)',
  },
  SearcBox: {
    minWidth: '300px',
  },
  menue: {
    margin: '10px',
  },
};

const mocks = [
  {
    name: 'История Беларуси',
    score: '10',
    language: 'С#',
  },
  {
    name: 'История Беларуси 2',
    score: '20',
    language: 'С#',
  },
];

class AdminTaskPage extends Component {
  constructor(props) { // eslint-disable-line
    super(props);
    this.state = {
      historyFilter: {
        name: '',
        role: '',
        activityType: '',
      },
    };
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {
    prevState.historyFilter == this.state.historyFilter
      || this.props.getAdminTasks(this.state.historyFilter);
  }

  downloadClickHandler = () => {
    fetch('/api/admin/statistics', {
      method: 'GET',
      headers: {
        'Content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Set-Cookie': 'true',
      },
      credentials: 'include',
    }).then(res => res.blob())
      .then((data) => {
        return new Blob([data]);
      }).then((blob) => {
        saveAs(blob, 'teacher-workbook.xlsx');
      })
      .catch(rej => console.log(`Rejected: ${rej}`));
  }

  handleHistoryFilter = (name, role, activityType) => {
    const newState = {
      historyFilter: { name, role, activityType },
    };
    this.setState(newState);
  };

  render() {
    const { classes, adminTasks } = this.props;
    if (!adminTasks) {
      return (
        <Button onClick={this.downloadClickHandler}>
          123
        </Button>
      );
    }

    if (adminTasks) {
      return (
        <Grid
          alignItems="stretch"
          justify="center"
          container
          flexDirection="row"
          className={[classes.centerScreen, classes.centerScreenMobile].join(' ')}
        >
          <Grid item className={classes.SearcBox}>
            <SearchBox handleHistoryFilter={this.handleHistoryFilter} />
          </Grid>
          <Grid
            item
            className={classes.marginLeft}
          >
            <List
              disablePadding="false"
              component="nav"
              className={classes.noMargin}
            >
              <ActivityListItems info={mocks} />
            </List>
          </Grid>
          <h1>Tasks</h1>
        </Grid>
      );
    }
    return null;
  }
}


const mapStateToProps = state => ({
  adminTasks: state.adminTasks.adminTasks,
});

const mapCommandsToProps = dispatch => ({
  getAdminTasks: param => dispatch(getAdminTasks(param)),
});

export default connect(mapStateToProps, mapCommandsToProps)(withStyles(styles)(AdminTaskPage));
