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

import MeasureReportDetail from './MeasureReportDetail';
import MeasureReportsTable from './MeasureReportsTable';
import { StyledCard, PageCanvas } from 'material-fhir-ui';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

Session.setDefault('measureReportPageTabIndex', 0);
Session.setDefault('measureReportSearchFilter', '');
Session.setDefault('selectedMeasureReport', false);
Session.setDefault('selectedMeasureReportId', '');
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('measureReportsArray', []);

Session.setDefault('MeasureReportsPage.onePageLayout', true)

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




export class MeasureReportsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      measureReportId: false,
      measureReport: {}
    }
  }
  getMeteorData() {
    let data = {
      tabIndex: Session.get('measureReportPageTabIndex'),
      measureReportSearchFilter: Session.get('measureReportSearchFilter'),
      fhirVersion: Session.get('fhirVersion'),
      selectedMeasureReportId: Session.get("selectedMeasureReportId"),
      selectedMeasureReport: Session.get("selectedMeasureReport"),
      selected: [],
      measureReports: [],
      query: {},
      options: {
        limit: get(Meteor, 'settings.public.defaults.paginationLimit', 5)
      },
      tabIndex: Session.get('measureReportPageTabIndex'),
      onePageLayout: true
    };

    data.onePageLayout = Session.get('MeasureReportsPage.onePageLayout');

    // if(Session.get('measureReportsTableQuery')){
    //   data.query = Session.get('measureReportsTableQuery')
    // }

    // if (Session.get('selectedMeasureReportId')){
    //   data.selectedMeasureReport = MeasureReports.findOne({_id: Session.get('selectedMeasureReportId')});
    //   this.state.measureReport = MeasureReports.findOne({_id: Session.get('selectedMeasureReportId')});
    //   this.state.measureReportId = Session.get('selectedMeasureReportId');
    // } else {
    //   data.selectedMeasureReport = false;
    //   this.state.measureReportId = false;
    //   this.state.measureReport = {};
    // }

    console.log('MeasureReportsPage.data.query', data.query)
    console.log('MeasureReportsPage.data.options', data.options)

    data.measureReports = MeasureReports.find(data.query, data.options).fetch();
    data.measureReportsCount = MeasureReports.find(data.query, data.options).count();

    // console.log("MeasureReportsPage[data]", data);
    return data;
  }


  onCancelUpsertMeasureReport(context){
    Session.set('measureReportPageTabIndex', 1);
  }
  onDeleteMeasureReport(context){
    MeasureReports._collection.remove({_id: get(context, 'state.measureReportId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('MeasureReports.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedMeasureReportId', '');
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MeasureReports", recordId: context.state.measureReportId});
        Bert.alert('MeasureReport removed!', 'success');
      }
    });
    Session.set('measureReportPageTabIndex', 1);
  }
  onUpsertMeasureReport(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new MeasureReport...', context.state)

    if(get(context, 'state.measureReport')){
      let self = context;
      let fhirMeasureReportData = Object.assign({}, get(context, 'state.measureReport'));
  
      // if(process.env.NODE_ENV === "test") console.log('fhirMeasureReportData', fhirMeasureReportData);
  
      let measureReportValidator = MeasureReportSchema.newContext();
      // console.log('measureReportValidator', measureReportValidator)
      measureReportValidator.validate(fhirMeasureReportData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', measureReportValidator.isValid())
        console.log('ValidationErrors: ', measureReportValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.measureReportId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating measureReport...");
        }

        delete fhirMeasureReportData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirMeasureReportData.resourceType = 'MeasureReport';
  
        MeasureReports._collection.update({_id: get(context, 'state.measureReportId')}, {$set: fhirMeasureReportData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("MeasureReports.insert[error]", error);
            Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MeasureReports", recordId: context.state.measureReportId});
            Session.set('selectedMeasureReportId', '');
            Session.set('measureReportPageTabIndex', 1);
            Bert.alert('MeasureReport added!', 'success');
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new measureReport...", fhirMeasureReportData);
  
        fhirMeasureReportData.effectiveDateTime = new Date();
        MeasureReports._collection.insert(fhirMeasureReportData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('MeasureReports.insert[error]', error);
            Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MeasureReports", recordId: context.state.measureReportId});
            Session.set('measureReportPageTabIndex', 1);
            Session.set('selectedMeasureReportId', '');
            Bert.alert('MeasureReport added!', 'success');
          }
        });
      }
    } 
    Session.set('measureReportPageTabIndex', 1);
  }
  onTableRowClick(selectedMeasureReportId){
    Session.set('selectedMeasureReportId', selectedMeasureReportId);
    Session.set('selectedMeasureReport', MeasureReports.findOne({id: selectedMeasureReportId}));
  }
  onTableCellClick(id){
    Session.set('measureReportsUpsert', false);
    Session.set('selectedMeasureReportId', id);
    Session.set('measureReportPageTabIndex', 2);
  }
  tableActionButtonClick(_id){
    let measureReport = MeasureReports.findOne({_id: _id});

    // console.log("MeasureReportsTable.onSend()", measureReport);

    var httpEndpoint = "http://localhost:8080";
    if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
      httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    }
    HTTP.post(httpEndpoint + '/MeasureReport', {
      data: measureReport
    }, function(error, result){
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("result", result);
      }
    });
  }
  onInsert(measureReportId){
    Session.set('selectedMeasureReportId', '');
    Session.set('measureReportPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MeasureReports", recordId: measureReportId});
  }
  onUpdate(measureReportId){
    Session.set('selectedMeasureReportId', '');
    Session.set('measureReportPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MeasureReports", recordId: measureReportId});
  }
  onRemove(measureReportId){
    Session.set('measureReportPageTabIndex', 1);
    Session.set('selectedMeasureReportId', '');
    HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MeasureReports", recordId: measureReportId});
  }
  onCancel(){
    Session.set('measureReportPageTabIndex', 1);
  } 
  handleRowClick(measureReportId){
    console.log('MeasureReportsPage.handleRowClick', measureReportId)
    let measureReport = MeasureReports.findOne({id: measureReportId});

    Session.set('selectedMeasureReportId', get(measureReport, 'id'));
    Session.set('selectedMeasureReport', measureReport);
  }

  render() {
    // console.log('MeasureReportsPage.data', this.data)

    function handleChange(event, newValue) {
      Session.set('measureReportPageTabIndex', newValue)
    }

    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader', false)){
      headerHeight = 148;
    }

    let layoutContents;
    if(this.data.onePageLayout){
      layoutContents = <StyledCard height="auto">
        <CardHeader title={this.data.measureReportsCount + " Measure Reports"} />
        <CardContent>
          <MeasureReportsTable 
            hideIdentifier={true} 
            hideCheckboxes={true} 
            hideSubjects={false}
            noDataMessagePadding={100}
            actionButtonLabel="Send"
            measureReports={ this.data.measureReports }
            count={ this.data.measureReportsCount }
            paginationLimit={10}
            hideSubjects={true}
            hideClassCode={false}
            hideReasonCode={false}
            hideReason={false}
            hideHistory={false}
            />
          </CardContent>
        </StyledCard>
    } else {
      layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto">
          <CardHeader title={this.data.measureReportsCount + " Measure Reports"} />
          <CardContent>
            <MeasureReportsTable 
              hideIdentifier={true} 
              hideCheckboxes={true} 
              hideSubjects={false}
              noDataMessagePadding={100}
              actionButtonLabel="Send"
              measureReports={ this.data.measureReports }
              count={ this.data.measureReportsCount }
              selectedMeasureReportId={ this.data.selectedMeasureReportId }
              paginationLimit={10}
              hideSubjects={true}
              hideClassCode={false}
              hideReasonCode={false}
              hideReason={false}
              hideHistory={false}
              onRowClick={this.handleRowClick.bind(this) }
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{this.data.selectedMeasureReportId }</h1>
          <CardContent>
            <CardContent>
              <MeasureReportDetail 
                id='measureReportDetails' 
                displayDatePicker={true} 
                displayBarcodes={false}
                measureReport={ this.data.selectedMeasureReport }
                measureReportId={ this.data.selectedMeasureReportId } 
                showMeasureReportInputs={true}
                showHints={false}
                // onInsert={ this.onInsert }
                // onDelete={ this.onDeleteMeasureReport }
                // onUpsert={ this.onUpsertMeasureReport }
                // onCancel={ this.onCancelUpsertMeasureReport } 
              />
              
            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
    }

    return (
      <PageCanvas id="measureReportsPage" headerHeight={headerHeight}>
        <MuiThemeProvider theme={muiTheme} >
          { layoutContents }
        </MuiThemeProvider>
      </PageCanvas>
    );
  }
}

ReactMixin(MeasureReportsPage.prototype, ReactMeteorData);
export default MeasureReportsPage;