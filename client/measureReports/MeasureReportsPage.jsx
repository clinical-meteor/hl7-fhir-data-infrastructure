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

import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import MeasureReportDetail from './MeasureReportDetail';
import MeasureReportsTable from './MeasureReportsTable';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import LayoutHelpers from '../../lib/LayoutHelpers';

//=============================================================================================================================================
// Session Variables

Session.setDefault('measureReportPageTabIndex', 0);
Session.setDefault('measureReportSearchFilter', '');
Session.setDefault('selectedMeasureReport', false);
Session.setDefault('selectedMeasureReportId', '');
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('measureReportsArray', []);

Session.setDefault('MeasureReportsPage.onePageLayout', true)
Session.setDefault('MeasureReportsPage.defaultQuery', {})
Session.setDefault('MeasureReportsTable.hideCheckbox', true)
Session.setDefault('MeasureReportsTable.organizationsIndex', 0)


//=============================================================================================================================================
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



export function MeasureReportsPage(props){
  let data = {
    selectedMeasureReportId: '',
    selectedMeasureReport: null,
    measureReports: [],
    onePageLayout: true,
    showSystemIds: false,
    showFhirIds: false,
    measureReportsIndex: 0
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('MeasureReportsPage.onePageLayout');
  }, [])
  data.selectedMeasureReportId = useTracker(function(){
    return Session.get('selectedMeasureReportId');
  }, [])
  data.selectedMeasureReport = useTracker(function(){
    return MeasureReports.findOne(Session.get('selectedMeasureReportId'));
  }, [])
  data.measureReports = useTracker(function(){
    return MeasureReports.find().fetch();
  }, [])

  data.measureReportsIndex = useTracker(function(){
    return Session.get('MeasureReportsTable.measureReportsIndex')
  }, [])
  data.showSystemIds = useTracker(function(){
    return Session.get('showSystemIds');
  }, [])
  data.showFhirIds = useTracker(function(){
    return Session.get('showFhirIds');
  }, [])


  function onDeleteMeasureReport(context){
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
    
  }
  function onUpsertMeasureReport(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new MeasureReport...', context.state)

    if(get(context, 'state.measureReport')){
      let self = context;
      let fhirMeasureReportData = Object.assign({}, get(context, 'state.measureReport'));
    
      let measureReportValidator = MeasureReportSchema.newContext();
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
            Session.set('selectedMeasureReportId', '');
            Bert.alert('MeasureReport added!', 'success');
          }
        });
      }
    } 
  }
  function onInsert(measureReportId){
    Session.set('selectedMeasureReportId', '');
    Session.set('measureReportPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MeasureReports", recordId: measureReportId});
  }
  function onCancel(){
    Session.set('measureReportPageTabIndex', 1);
  } 
  function handleRowClick(measureReportId){
    console.log('MeasureReportsPage.handleRowClick', measureReportId)
    let measureReport = MeasureReports.findOne({_id: measureReportId});

    Session.set('selectedMeasureReportId', get(measureReport, '_id'));
    Session.set('selectedMeasureReport', measureReport);

    Session.set('currentSelectionId', 'MeasureReport/' + get(measureReport, '_id'));
    Session.set('currentSelection', measureReport);
  }
  function setMeasureReportsPageIndex(newIndex){
    console.log('setMeasureReportsPageIndex', newIndex)
    Session.set('MeasureReportsTable.measureReportsIndex', newIndex)
  }

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
  let noDataImage = get(Meteor, 'settings.public.defaults.noData.noDataImagePath', "packages/clinical_hl7-fhir-data-infrastructure/assets/NoData.png");  
  

  let layoutContent;
  
  if(data.measureReports.length > 0){
    if(data.onePageLayout){
      layoutContent = <StyledCard height="auto" margin={20} >
        <CardHeader title={data.measureReports.length + " Measure Reports"} />
        <CardContent>
          <MeasureReportsTable 
            hideIdentifier={true} 
            hideCheckboxes={true} 
            hideSubjects={false}
            noDataMessagePadding={100}
            actionButtonLabel="Send"
            measureReports={ data.measureReports }
            count={ data.measureReports.length }
            selectedMeasureReportId={ data.selectedMeasureReportId }
            hideMeasureUrl={false}
            paginationLimit={10}
            hideClassCode={false}
            hideReasonCode={false}
            hideReason={false}
            hideHistory={false}
            onRowClick={ handleRowClick.bind(this) }
            rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
            onSetPage={function(index){
              setMeasureReportsPageIndex(index)
            }}           
            page={data.measureReportsIndex}               
            tableRowSize="medium"
          />
          </CardContent>
        </StyledCard>
    } else {
      layoutContent = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.measureReports.length + " Measure Reports"} />
          <CardContent>
            <MeasureReportsTable 
              hideIdentifier={true} 
              hideCheckboxes={true} 
              hideSubjects={false}
              noDataMessagePadding={100}
              actionButtonLabel="Send"
              measureReports={ data.measureReports }
              count={ data.measureReports.length }
              selectedMeasureReportId={ data.selectedMeasureReportId }
              paginationLimit={10}
              hideMeasureUrl={false}
              hideSubjects={true}
              hideClassCode={false}
              hideReasonCode={false}
              hideReason={false}
              hideHistory={false}
              hideBarcode={true}
              hideNumerator={true}
              hideDenominator={true}
              onRowClick={ handleRowClick.bind(this) }
              rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
              onSetPage={function(index){
                setMeasureReportsPageIndex(index)
              }}          
              page={data.measureReportsIndex}                               
              tableRowSize="medium"
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20}  scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedMeasureReportId }</h1>
          <CardContent>
            <CardContent>
              <MeasureReportDetail 
                id='measureReportDetails' 
                displayDatePicker={true} 
                displayBarcodes={false}
                measureReport={ data.selectedMeasureReport }
                measureReportId={ data.selectedMeasureReportId } 
                showMeasureReportInputs={true}
                showHints={false}
                showPopulationCode={false}
                // onInsert={  onInsert }
                // onDelete={  onDeleteMeasureReport }
                // onUpsert={  onUpsertMeasureReport }
                // onCancel={  onCancelUpsertMeasureReport } 
              />
              
            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
    }
  } else {
    layoutContent = <Container maxWidth="sm" style={{display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', height: '100%', justifyContent: 'center'}}>
      <img src={Meteor.absoluteUrl() + noDataImage} style={{width: '100%', marginTop: get(Meteor, 'settings.public.defaults.noData.marginTop', '-200px')}} />
      <CardContent>
        <CardHeader 
          title={get(Meteor, 'settings.public.defaults.noData.defaultTitle', "No Data Available")} 
          subheader={get(Meteor, 'settings.public.defaults.noData.defaultMessage', "No records were found in the client data cursor.  To debug, check the data cursor in the client console, then check subscriptions and publications, and relevant search queries.  If the data is not loaded in, use a tool like Mongo Compass to load the records directly into the Mongo database, or use the FHIR API interfaces.")} 
        />
      </CardContent>
    </Container>
  }


  return (
    <PageCanvas id="measureReportsPage" headerHeight={headerHeight}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContent }
      </MuiThemeProvider>
    </PageCanvas>
  );
}




export default MeasureReportsPage;