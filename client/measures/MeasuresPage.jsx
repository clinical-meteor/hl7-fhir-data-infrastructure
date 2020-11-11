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
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
<<<<<<< HEAD
import ReactMixin  from 'react-mixin';
=======
>>>>>>> 0d390686ceac348d71fca9fe76834a3a0977bba5

import MeasureDetail from './MeasureDetail';
import MeasuresTable from './MeasuresTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


//===========================================================================
// SESSION VARIABLES

Session.setDefault('measurePageTabIndex', 0);
Session.setDefault('measureSearchFilter', '');
Session.setDefault('selectedMeasureId', '');
Session.setDefault('selectedMeasure', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('measuresArray', []);
Session.setDefault('MeasuresPage.onePageLayout', true)


//===========================================================================
// THEMING

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


//===========================================================================
// MAIN COMPONENT  


export function MeasuresPage(props){

  let data = {
    selectedMeasureId: '',
    selectedMeasure: null,
    measures: [],
    onePageLayout: true
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('MeasuresPage.onePageLayout');
  }, [])
  data.selectedMeasureId = useTracker(function(){
    return Session.get('selectedMeasureId');
  }, [])
  data.selectedMeasure = useTracker(function(){
    return Measures.findOne(Session.get('selectedMeasureId'));
  }, [])
  data.measures = useTracker(function(){
    return Measures.find().fetch();
  }, [])


  function onCancelUpsertMeasure(context){
    Session.set('measurePageTabIndex', 1);
  }
  function onDeleteMeasure(context){
    Measures._collection.remove({_id: get(context, 'state.measureId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('Measures.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedMeasureId', '');
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Measures", recordId: context.state.measureId});
        Bert.alert('Measure removed!', 'success');
      }
    });
    Session.set('measurePageTabIndex', 1);
  }
  function onUpsertMeasure(context){
    console.log('Saving a new Measure...', context.state)

    if(get(context, 'state.measure')){
      let self = context;
      let fhirMeasureData = Object.assign({}, get(context, 'state.measure'));
  
      let measureValidator = MeasureSchema.newContext();
  
      measureValidator.validate(fhirMeasureData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', measureValidator.isValid())
        console.log('ValidationErrors: ', measureValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.measureId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating measure...");
        }

        delete fhirMeasureData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirMeasureData.resourceType = 'Measure';
  
        Measures._collection.update({_id: get(context, 'state.measureId')}, {$set: fhirMeasureData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("Measures.insert[error]", error);
            Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Measures", recordId: context.state.measureId});
            Session.set('selectedMeasureId', '');
            Session.set('measurePageTabIndex', 1);
            Bert.alert('Measure added!', 'success');
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new measure...", fhirMeasureData);
  
        fhirMeasureData.effectiveDateTime = new Date();
        Measures._collection.insert(fhirMeasureData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('Measures.insert[error]', error);
            Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Measures", recordId: context.state.measureId});
            Session.set('measurePageTabIndex', 1);
            Session.set('selectedMeasureId', '');
            Bert.alert('Measure added!', 'success');
          }
        });
      }
    } 
    Session.set('measurePageTabIndex', 1);
  }
  function handleRowClick(measureId, foo, bar){
    console.log('MeasuresPage.handleRowClick', measureId)
    let measure = Measures.findOne({_id: measureId});

    Session.set('selectedMeasureId', get(measure, '_id'));
    Session.set('selectedMeasure', measure);

    Session.set('currentSelectionId', 'Measure/' + get(measure, '_id'));
    Session.set('currentSelection', measure);
  }
  function onInsert(measureId){
    Session.set('selectedMeasureId', '');
    Session.set('measurePageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Measures", recordId: measureId});
  }
  function onCancel(){
    Session.set('measurePageTabIndex', 1);
  } 


  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();



  let layoutContents;
  if(this.data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} >
      <CardHeader title={this.data.measuresCount + " Measures"} />
      <CardContent>

        <MeasuresTable 
          measures={ this.data.measures }
          hideCheckbox={true} 
          hideActionIcons={true}
          hideIdentifier={true} 
          hideName={false} 
          hideTitle={false} 
          hideDescription={true} 
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
          hideBarcode={false}
          paginationLimit={10}     
          onRowClick={this.handleRowClick.bind(this) }
          rowsPerPage={ LayoutHelpers.calcTableRows("medium", this.props.appHeight) }
          count={this.data.measuresCount}
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={this.data.measuresCount + " Measures"} />
          <CardContent>
            <MeasuresTable 
              measures={ this.data.measures }
              selectedMeasureId={ this.data.selectedMeasureId }
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
              hideBarcode={true}
              onRowClick={this.handleRowClick.bind(this) }
              rowsPerPage={ LayoutHelpers.calcTableRows("medium", this.props.appHeight) }
              count={this.data.measuresCount}
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{this.data.selectedMeasureId }</h1>
          {/* <CardHeader title={this.data.selectedMeasureId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <MeasureDetail 
                id='measureDetails' 
                displayDatePicker={true} 
                displayBarcodes={false}
                measure={ this.data.selectedMeasure }
                measureId={ this.data.selectedMeasureId } 
                showMeasureInputs={true}
                showHints={false}
                // onInsert={ this.onInsert }
                // onDelete={ this.onDeleteMeasure }
                // onUpsert={ this.onUpsertMeasure }
                // onCancel={ this.onCancelUpsertMeasure } 
              />
            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  }

  return (
    <PageCanvas id="measuresPage" headerHeight={headerHeight}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default MeasuresPage;