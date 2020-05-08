import { 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Box,
  Grid
} from '@material-ui/core';
import styled from 'styled-components';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import TaskDetail from './TaskDetail';
import TasksTable from './TasksTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { Tasks } from '../../lib/schemas/Tasks';

Session.setDefault('taskPageTabIndex', 0);
Session.setDefault('taskSearchFilter', '');
Session.setDefault('selectedTaskId', '');
Session.setDefault('selectedTask', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('tasksArray', []);
Session.setDefault('TasksPage.onePageLayout', true)

// Global Theming 
  // This is necessary for the Material UI component render layer
  let theme = {
    primaryColor: "rgb(108, 183, 110)",
    primaryText: "rgba(255, 255, 255, 1) !important",

    secondaryColor: "rgb(108, 183, 110)",
    secondaryText: "rgba(255, 255, 255, 1) !important",

    cardColor: "rgba(255, 255, 255, 1) !important",
    cardTextColor: "rgba(0, 0, 0, 1) !important",

    errorColor: "rgb(128,20,60) !important",
    errorText: "#ffffff !important",

    appBarColor: "#f5f5f5 !important",
    appBarTextColor: "rgba(0, 0, 0, 1) !important",

    paperColor: "#f5f5f5 !important",
    paperTextColor: "rgba(0, 0, 0, 1) !important",

    backgroundCanvas: "rgba(255, 255, 255, 1) !important",
    background: "linear-gradient(45deg, rgb(108, 183, 110) 30%, rgb(150, 202, 144) 90%)",

    nivoTheme: "greens"
  }

  // if we have a globally defined theme from a settings file
  if(get(Meteor, 'settings.public.theme.palette')){
    theme = Object.assign(theme, get(Meteor, 'settings.public.theme.palette'));
  }

  const muiTheme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        main: theme.primaryColor,
        contrastText: theme.primaryText
      },
      secondary: {
        main: theme.secondaryColor,
        contrastText: theme.errorText
      },
      appBar: {
        main: theme.appBarColor,
        contrastText: theme.appBarTextColor
      },
      cards: {
        main: theme.cardColor,
        contrastText: theme.cardTextColor
      },
      paper: {
        main: theme.paperColor,
        contrastText: theme.paperTextColor
      },
      error: {
        main: theme.errorColor,
        contrastText: theme.secondaryText
      },
      background: {
        default: theme.backgroundCanvas
      },
      contrastThreshold: 3,
      tonalOffset: 0.2
    }
  });

// const StyledCard = styled(Card)`
//   background: ` + theme.paperColor + `;
//   border-radius: 3px;
//   border: 0;
//   color: ` + theme.paperTextColor + `;
//   height: 48px;
//   padding: 0 30px;
//   box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
// `;


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}




export class TasksPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskId: false,
      task: {}
    }
  }
  getMeteorData() {
    let data = {
      tabIndex: Session.get('taskPageTabIndex'),
      taskSearchFilter: Session.get('taskSearchFilter'),
      fhirVersion: Session.get('fhirVersion'),
      selectedTaskId: Session.get("selectedTaskId"),
      selectedTask: Session.get("selectedTask"),
      selected: [],
      tasks: [],
      query: {},
      options: {
        limit: get(Meteor, 'settings.public.defaults.paginationLimit', 5)
      },
      tabIndex: Session.get('taskPageTabIndex'),
      onePageLayout: true
    };

    data.onePageLayout = Session.get('TasksPage.onePageLayout');


    // if(Session.get('tasksTableQuery')){
    //   data.query = Session.get('tasksTableQuery')
    // }

    // if (Session.get('selectedTaskId')){
    //   data.selectedTask = Tasks.findOne({_id: Session.get('selectedTaskId')});
    //   this.state.task = Tasks.findOne({_id: Session.get('selectedTaskId')});
    //   this.state.taskId = Session.get('selectedTaskId');
    // } else {
    //   data.selectedTask = false;
    //   this.state.taskId = false;
    //   this.state.task = {};
    // }

    console.log('TasksPage.data.query', data.query)
    console.log('TasksPage.data.options', data.options)

    data.tasks = Tasks.find(data.query, data.options).fetch();
    data.tasksCount = Tasks.find(data.query, data.options).count();

    // console.log("TasksPage[data]", data);
    return data;
  }

  // this could be a mixin
  handleTabChange(index){
    Session.set('taskPageTabIndex', index);
  }
  handleActive(index){
  }
  onCancelUpsertTask(context){
    Session.set('taskPageTabIndex', 1);
  }
  onDeleteTask(context){
    Tasks._collection.remove({_id: get(context, 'state.taskId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('Tasks.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedTaskId', false);
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Tasks", recordId: context.state.taskId});
        Bert.alert('Task removed!', 'success');
      }
    });
    Session.set('taskPageTabIndex', 1);
  }
  onUpsertTask(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new Task...', context.state)

    if(get(context, 'state.task')){
      let self = context;
      let fhirTaskData = Object.assign({}, get(context, 'state.task'));
  
      // if(process.env.NODE_ENV === "test") console.log('fhirTaskData', fhirTaskData);
  
      let taskValidator = TaskSchema.newContext();
      // console.log('taskValidator', taskValidator)
      taskValidator.validate(fhirTaskData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', taskValidator.isValid())
        console.log('ValidationErrors: ', taskValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.taskId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating task...");
        }

        delete fhirTaskData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirTaskData.resourceType = 'Task';
  
        Tasks._collection.update({_id: get(context, 'state.taskId')}, {$set: fhirTaskData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("Tasks.insert[error]", error);
            Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Tasks", recordId: context.state.taskId});
            Session.set('selectedTaskId', false);
            Session.set('taskPageTabIndex', 1);
            Bert.alert('Task added!', 'success');
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new task...", fhirTaskData);
  
        fhirTaskData.effectiveDateTime = new Date();
        Tasks._collection.insert(fhirTaskData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('Tasks.insert[error]', error);
            Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Tasks", recordId: context.state.taskId});
            Session.set('taskPageTabIndex', 1);
            Session.set('selectedTaskId', false);
            Bert.alert('Task added!', 'success');
          }
        });
      }
    } 
    Session.set('taskPageTabIndex', 1);
  }
  handleRowClick(taskId, foo, bar){
    console.log('TasksPage.handleRowClick', taskId)
    let task = Tasks.findOne({id: taskId});

    Session.set('selectedTaskId', get(task, 'id'));
    Session.set('selectedTask', task);
  }
  onTableCellClick(id){
    Session.set('tasksUpsert', false);
    Session.set('selectedTaskId', id);
    Session.set('taskPageTabIndex', 2);
  }
  tableActionButtonClick(_id){
    let task = Tasks.findOne({_id: _id});

    // console.log("TasksTable.onSend()", task);

    var httpEndpoint = "http://localhost:8080";
    if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
      httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    }
    HTTP.post(httpEndpoint + '/Task', {
      data: task
    }, function(error, result){
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("result", result);
      }
    });
  }
  onInsert(taskId){
    Session.set('selectedTaskId', '');
    Session.set('taskPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Tasks", recordId: taskId});
  }
  onUpdate(taskId){
    Session.set('selectedTaskId', '');
    Session.set('taskPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Tasks", recordId: taskId});
  }
  onRemove(taskId){
    Session.set('taskPageTabIndex', 1);
    Session.set('selectedTaskId', '');
    HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Tasks", recordId: taskId});
  }
  onCancel(){
    Session.set('taskPageTabIndex', 1);
  } 
  render() {
    // console.log('TasksPage.data', this.data)

    function handleChange(event, newValue) {
      Session.set('taskPageTabIndex', newValue)
    }

    let headerHeight = LayoutHelpers.calcHeaderHeight();

    let layoutContents;
    if(this.data.onePageLayout){
      layoutContents = <StyledCard height="auto" margin={20} >
        <CardHeader title={this.data.tasksCount + " Tasks"} />
        <CardContent>

          <TasksTable 
            tasks={ this.data.tasks }
            hideCheckbox={true} 
            hideActionIcons={true}
            hideIdentifier={true} 
            hideTitle={false} 
            hideDescription={false} 
            hideApprovalDate={false}
            hideLastReviewed={false}
            hideVersion={false}
            hideStatus={false}
            hideAuthor={true}
            hidePublisher={false}
            hideReviewer={false}
            hideEditor={false}
            hideEndorser={false}
            hideType={false}
            hideRiskAdjustment={true}
            hideRateAggregation={true}
            hideScoring={false}
            paginationLimit={10}     
            />
          </CardContent>
        </StyledCard>
    } else {
      layoutContents = <Grid container spacing={3}>
        <Grid item lg={6}>
          <StyledCard height="auto" margin={20} >
            <CardHeader title={this.data.tasksCount + " Tasks"} />
            <CardContent>
              <TasksTable 
                tasks={ this.data.tasks }
                selectedTaskId={ this.data.selectedTaskId }
                hideIdentifier={true} 
                hideCheckbox={true} 
                hideApprovalDate={false}
                hideLastReviewed={false}
                hideVersion={false}
                hideStatus={false}
                hidePublisher={true}
                hideReviewer={true}
                hideScoring={true}
                hideEndorser={true}
                paginationLimit={10}            
                hideActionIcons={true}
                onRowClick={this.handleRowClick.bind(this) }
                count={this.data.tasksCount}
                />
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item lg={4}>
          <StyledCard height="auto" margin={20} scrollable>
            <h1 className="barcode" style={{fontWeight: 100}}>{this.data.selectedTaskId }</h1>
            {/* <CardHeader title={this.data.selectedTaskId } className="helveticas barcode" /> */}
            <CardContent>
              <CardContent>
                <TaskDetail 
                  id='taskDetails' 
                  displayDatePicker={true} 
                  displayBarcodes={false}
                  task={ this.data.selectedTask }
                  taskId={ this.data.selectedTaskId } 
                  showTaskInputs={true}
                  showHints={false}
                  // onInsert={ this.onInsert }
                  // onDelete={ this.onDeleteTask }
                  // onUpsert={ this.onUpsertTask }
                  // onCancel={ this.onCancelUpsertTask } 
                />
              </CardContent>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    }

    return (
      <PageCanvas id="tasksPage" headerHeight={headerHeight}>
        <MuiThemeProvider theme={muiTheme} >
          { layoutContents }
        </MuiThemeProvider>
      </PageCanvas>
    );
  }
}

ReactMixin(TasksPage.prototype, ReactMeteorData);
export default TasksPage;