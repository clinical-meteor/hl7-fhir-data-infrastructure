import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

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

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { StyledCard, PageCanvas } from 'fhir-starter';

import TaskDetail from './TaskDetail';
import TasksTable from './TasksTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { get, cloneDeep } from 'lodash';

import { Tasks } from '../../lib/schemas/SimpleSchemas/Tasks';


//=============================================================================================================================================
// GLOBAL THEMING

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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

//---------------------------------------------------------------
// Session Variables


Session.setDefault('taskPageTabIndex', 0);
Session.setDefault('taskSearchFilter', '');
Session.setDefault('selectedTaskId', '');
Session.setDefault('selectedTask', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('tasksArray', []);

Session.setDefault('TasksPage.onePageLayout', true)
Session.setDefault('TasksPage.defaultQuery', {})
Session.setDefault('TasksTable.hideCheckbox', true)
Session.setDefault('TasksTable.tasksIndex', 0)

Session.setDefault('taskChecklistMode', false)


//===========================================================================
// MAIN COMPONENT  


export function TasksPage(props){

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    tasks: [],
    onePageLayout: true,
    taskSearchFilter: '',
    options: {
      sort: {
        'focus.display': -1,
        lastModified: -1
      }
    },
    taskChecklistMode: false,
    tasksIndex: 0
  };

  


  data.onePageLayout = useTracker(function(){
    return Session.get('TasksPage.onePageLayout');
  }, [])
  data.selectedTaskId = useTracker(function(){
    return Session.get('selectedTaskId');
  }, [])
  data.selectedTask = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedTaskId'));
  }, [])
  data.tasks = useTracker(function(){
    let results = [];
    if(Session.get('taskChecklistMode')){
      results = Tasks.find({
        'focus.display': "Patient Correction"
      }, {
        limit: 10,
        sort: {lastModified: -1}
      }).fetch();      
    } else {
      results = Tasks.find().fetch();
    }

    return results;
  }, [])
  data.taskSearchFilter = useTracker(function(){
    return Session.get('taskSearchFilter')
  }, [])
  data.taskChecklistMode = useTracker(function(){
    return Session.get('taskChecklistMode')
  }, [])

  data.tasksIndex = useTracker(function(){
    return Session.get('TasksTable.tasksIndex')
  }, [])

  function setTasksIndex(newIndex){
    Session.set('TasksTable.tasksIndex', newIndex)
  }

  
  function handleRowClick(taskId){
    console.log('TasksPage.handleRowClick', taskId)
    let task = Tasks.findOne({id: taskId});

    if(task){
      Session.set('selectedTaskId', get(task, 'id'));
      Session.set('selectedTask', task);
      Session.set('Task.Current', task);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "TaskDetail");
        Session.set('mainAppDialogMaxWidth', "md");

        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Task");
        } else {
          Session.set('mainAppDialogTitle', "View Task");
        }
      }      
    } else {
      console.log('No task found...')
    }
  }

  function handleChange(event, newValue) {
    Session.set('taskPageTabIndex', newValue)
  }

  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} scrollable >
      <CardHeader title={data.tasks.length + " Task History Records"} />
      <CardContent>

        <TasksTable 
          tasks={ data.tasks }
          hideCheckbox={false}
          count={data.tasks.length}
          selectedTaskId={ data.selectedTaskId }
          paginationLimit={10}     
          checklist={data.taskChecklistMode}
          onRowClick={ handleRowClick.bind(this) }
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          onSetPage={function(index){
            setTasksIndex(index)
          }}        
          page={data.tasksIndex}
          size="small"
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.tasks.length + " Tasks"} />
          <CardContent>
            <TasksTable 
              tasks={ data.tasks }
              count={data.tasks.length}
              selectedTaskId={ data.selectedTaskId }
              hideIdentifier={true} 
              hideCheckbox={false}
              hideActionIcons={true}
              hideBarcode={true}
              onRowClick={ handleRowClick.bind(this) }
              rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
              onSetPage={function(index){
                setTasksIndex(index)
              }}     
              page={data.tasksIndex} 
              size="medium"
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedTaskId }</h1>
          {/* <CardHeader title={data.selectedTaskId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <TaskDetail 
                id='taskDetails'                 
                displayDatePicker={true} 
                displayBarcodes={false}
                task={ data.selectedTask }
                taskId={ data.selectedTaskId } 
                showTaskInputs={true}
                showHints={false}
              />
            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  }


  return (
    <PageCanvas id="tasksPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default TasksPage;