import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { Paper } from '@material-ui/core';
import Spinner from '../shared/spinner/index';
import Link from 'react-router-dom/es/Link';
import TabComponent from '../tabComponent/TabComponent.jsx';
import Common from '../styles/Common';
import AttemptCode from './AttemptCode';
import { getAttemptCode } from '../../commands/attemptCode';


const styles = theme => ({
  ...Common,
  fullWidth: {
    width: '100%',
  },
  margin: {
    margin: '20px auto',
    marginLeft: '5%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  buttonBack: {
    margin: '20px',
    color: '#fff',
    backgroundColor: '#2196f3',
    '&:hover': {
      backgroundColor: '#1b77c5',
    },
  },
  noUnderline: {
    textDecoration: 'none',
  },
});


class AttemptFiles extends Component {
  componentDidMount() {
    this.props.getAttemptCode({
      taskId: this.props.match.params.taskId,
      attemptNumber: this.props.match.params.attemptNumber,
    });
  }

  render() {
    const { classes, attemptCode } = this.props;
    console.log(this.props.match.params);
    const TabHeaders = [];
    if (attemptCode) {
      return (
        <div className={[classes.row, classes.fullWidth].join(' ')}>
          <div className={[classes.flex, classes.centerScreen, classes.margin].join(' ')}>
            {

            attemptCode.forEach((code) => {
              TabHeaders.push({
                tabName: `${code.name}${code.extension}`,
                component: <AttemptCode codeString={code.fileContents} lang={code.extension} />,
              });
            })
          }
            <TabComponent
              tabHeaders={TabHeaders}
            />
          </div>
          <Link to={`/studentMenu/${this.props.match.params.groupId}`} className={classes.noUnderline}>
            <Button variant="contained" color="primary" className={[classes.flex, classes.buttonBack].join(' ')}>
            Назад
            </Button>
          </Link>
        </div>
      );
    }
    return (
        <Spinner />
    );
  }
}

const mapStateToProps = state => ({
  // isLoading: state.tasksList.isLoading,
  attemptCode: state.attemptCode.attemptCode,
});

const mapCommandsToProps = dispatch => ({
  getAttemptCode: param => dispatch(getAttemptCode(param)),
});

const styled = withStyles(styles)(AttemptFiles);

export default connect(mapStateToProps, mapCommandsToProps)(styled);
