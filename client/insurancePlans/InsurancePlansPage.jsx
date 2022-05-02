import { 
  Grid, 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Box
} from '@material-ui/core';
// import styled from 'styled-components';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import InsurancePlanDetail from './InsurancePlanDetail';
import InsurancePlansTable from './InsurancePlansTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

// import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// // import { InsurancePlans } from '../../lib/schemas/InsurancePlans';

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


Session.setDefault('insurancePlanPageTabIndex', 0);
Session.setDefault('insurancePlanSearchFilter', '');
Session.setDefault('selectedInsurancePlanId', '');
Session.setDefault('selectedInsurancePlan', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('insurancePlansArray', []);
Session.setDefault('InsurancePlansPage.onePageLayout', true)
Session.setDefault('InsurancePlansTable.hideCheckbox', true)
Session.setDefault('InsurancePlansTable.insurancePlansPageIndex', 0)

Session.setDefault('insurancePlanChecklistMode', false)


//===========================================================================
// MAIN COMPONENT  


export function InsurancePlansPage(props){

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    insurancePlans: [],
    onePageLayout: true,
    hideCheckbox: true,
    insurancePlanSearchFilter: '',
    options: {
      sort: {
        'focus.display': -1,
        lastModified: -1
      }
    },
    insurancePlanChecklistMode: false,
    jinsurancePlansPageIndex: 0
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('InsurancePlansPage.onePageLayout');
  }, [])
  data.hideCheckbox = useTracker(function(){
    return Session.get('InsurancePlansTable.hideCheckbox');
  }, [])
  data.selectedInsurancePlanId = useTracker(function(){
    return Session.get('selectedInsurancePlanId');
  }, [])
  data.selectedInsurancePlan = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedInsurancePlanId'));
  }, [])
  data.insurancePlans = useTracker(function(){
    let results = [];
    if(Session.get('insurancePlanChecklistMode')){
      results = InsurancePlans.find({
        'focus.display': "Patient Correction"
      }, {
        limit: 10,
        sort: {lastModified: -1}
      }).fetch();      
    } else {
      results = InsurancePlans.find().fetch();
    }

    return results;
  }, [])
  data.insurancePlanSearchFilter = useTracker(function(){
    return Session.get('insurancePlanSearchFilter')
  }, [])
  data.insurancePlanChecklistMode = useTracker(function(){
    return Session.get('insurancePlanChecklistMode')
  }, [])
  data.insurancePlansPageIndex = useTracker(function(){
    return Session.get('InsurancePlansTable.insurancePlansPageIndex')
  }, [])


  function setInsurancePlansPageIndex(newIndex){
    Session.set('InsurancePlansTable.insurancePlansPageIndex', newIndex)
  }


  function onCancelUpsertInsurancePlan(context){
    Session.set('insurancePlanPageTabIndex', 1);
  }
  function onDeleteInsurancePlan(context){
    InsurancePlans._collection.remove({_id: get(context, 'state.insurancePlanId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('InsurancePlans.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedInsurancePlanId', '');
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "InsurancePlans", recordId: context.state.insurancePlanId});        
      }
    });
    Session.set('insurancePlanPageTabIndex', 1);
  }
  function onUpsertInsurancePlan(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new InsurancePlan...', context.state)

    if(get(context, 'state.insurancePlan')){
      let self = context;
      let fhirInsurancePlanData = Object.assign({}, get(context, 'state.insurancePlan'));
  
      // if(process.env.NODE_ENV === "test") console.log('fhirInsurancePlanData', fhirInsurancePlanData);
  
      let insurancePlanValidator = InsurancePlanSchema.newContext();
      // console.log('insurancePlanValidator', insurancePlanValidator)
      insurancePlanValidator.validate(fhirInsurancePlanData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', insurancePlanValidator.isValid())
        console.log('ValidationErrors: ', insurancePlanValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.insurancePlanId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating insurancePlan...");
        }

        delete fhirInsurancePlanData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirInsurancePlanData.resourceType = 'InsurancePlan';
  
        InsurancePlans._collection.update({_id: get(context, 'state.insurancePlanId')}, {$set: fhirInsurancePlanData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("InsurancePlans.insert[error]", error);
          
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "InsurancePlans", recordId: context.state.insurancePlanId});
            Session.set('selectedInsurancePlanId', '');
            Session.set('insurancePlanPageTabIndex', 1);
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new insurancePlan...", fhirInsurancePlanData);
  
        fhirInsurancePlanData.effectiveDateTime = new Date();
        InsurancePlans._collection.insert(fhirInsurancePlanData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('InsurancePlans.insert[error]', error);           
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "InsurancePlans", recordId: context.state.insurancePlanId});
            Session.set('insurancePlanPageTabIndex', 1);
            Session.set('selectedInsurancePlanId', '');
          }
        });
      }
    } 
    Session.set('insurancePlanPageTabIndex', 1);
  }

  function handleRowClick(insurancePlanId){
    console.log('InsurancePlansPage.handleRowClick', insurancePlanId)
    let insurancePlan = InsurancePlans.findOne({id: insurancePlanId});

    if(insurancePlan){
      Session.set('selectedInsurancePlanId', get(insurancePlan, 'id'));
      Session.set('selectedInsurancePlan', insurancePlan);
      Session.set('InsurancePlan.Current', insurancePlan);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "InsurancePlanDetail");
        Session.set('mainAppDialogMaxWidth', "sm");

        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Plan");
        } else {
          Session.set('mainAppDialogTitle', "View Plan");
        }
      }      
    }
  }
  function onInsert(insurancePlanId){
    Session.set('selectedInsurancePlanId', '');
    Session.set('insurancePlanPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "InsurancePlans", recordId: insurancePlanId});
  }
  function onCancel(){
    Session.set('insurancePlanPageTabIndex', 1);
  } 


  // console.log('InsurancePlansPage.data', data)

  function handleChange(event, newValue) {
    Session.set('insurancePlanPageTabIndex', newValue)
  }



  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} scrollable >
      <CardHeader title={data.insurancePlans.length + " Insurance Plans"} />
      <CardContent>

        <InsurancePlansTable 
          formFactorLayout={formFactor}
          insurancePlans={ data.insurancePlans }
          count={data.insurancePlans.length}
          selectedInsurancePlanId={ data.selectedInsurancePlanId }
          onRowClick={ handleRowClick.bind(this) }
          hideCheckbox={data.hideCheckbox}
          hideStatus={false}
          hideName={false}
          hideTitle={false}
          hideVersion={false}
          hideExperimental={false}
          paginationLimit={10}     
          checklist={data.insurancePlanChecklistMode}          
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          onSetPage={function(index){
            setInsurancePlansPageIndex(index)
          }}                 
          page={data.insurancePlansPageIndex}       
          size="small"
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.insurancePlans.length + " Insurance Plans"} />
          <CardContent>
            <InsurancePlansTable 
              insurancePlans={ data.insurancePlans }
              count={data.organizations.length}
              hideCheckbox={data.hideCheckbox}
              hideIdentifier={true} 
              hideActionIcons={true}
              hideStatus={false}
              hideName={false}
              hideTitle={false}
              hideVersion={false}
              hideExperimental={false}    
              hideBarcode={true}
              selectedInsurancePlanId={ data.selectedInsurancePlanId }
              onRowClick={ handleRowClick.bind(this) }
              rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
              onSetPage={function(index){
                setInsurancePlansPageIndex(index)
              }}                 
              page={data.insurancePlansPageIndex}       
              formFactorLayout={formFactor}
              size="medium"
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedInsurancePlanId }</h1>
          {/* <CardHeader title={data.selectedInsurancePlanId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <InsurancePlanDetail 
                id='insurancePlanDetails'                 
                displayDatePicker={true} 
                displayBarcodes={false}
                insurancePlan={ data.selectedInsurancePlan }
                insurancePlanId={ data.selectedInsurancePlanId } 
                showInsurancePlanInputs={true}
                showHints={false}
              />
            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  }

  return (
    <PageCanvas id="insurancePlansPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default InsurancePlansPage;