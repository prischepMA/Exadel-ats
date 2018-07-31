import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/es';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Common from '../../common/styles/Common';
import { getAdminGroups } from '../../commands/admin';
import SearchBox from './searchBox/SearchBox.jsx';
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
    groupName: 'Dima2018Summer',
    teacherName: 'Dmitriy Dmirievich Kotusev',
    studentsCount: '777',
  },
  {
    groupName: 'Dima2018Winter',
    teacherName: 'Dmitriy Dmirievich Kotusev',
    studentsCount: '776',
  },
];

class AdminGroupPage extends Component {
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

  componentDidMount() { // eslint-disable-next-line
    this.props.getAdminGroups(this.state.historyFilter);
  }

  componentDidUpdate(prevProps, prevState) {
    prevState.historyFilter == this.state.historyFilter
      || this.props.getAdminGroups(this.state.historyFilter);
  }

  handleHistoryFilter = (name, role, activityType) => {
    const newState = {
      historyFilter: { name, role, activityType },
    };
    this.setState(newState);
  };

  render() {
    const { classes, adminGroups } = this.props;
    if (adminGroups) {
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
          <h1>Groups</h1>
        </Grid>
      );
    }
    return null;
  }
}


const mapStateToProps = state => ({
  adminGroups: state.adminGroups.adminGroups,
});

const mapCommandsToProps = dispatch => ({
  getAdminGroups: param => dispatch(getAdminGroups(param)),
});

export default connect(mapStateToProps, mapCommandsToProps)(withStyles(styles)(AdminGroupPage));
