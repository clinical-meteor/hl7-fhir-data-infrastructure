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
import { useTracker } from 'meteor/react-meteor-data';

import InsurancePlanDetail from './InsurancePlanDetail';
import InsurancePlansTable from './InsurancePlansTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// import { InsurancePlans } from '../../lib/schemas/InsurancePlans';

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

//---------------------------------------------------------------
// Theming

const muiTheme = Theming.createMuiTheme();



//===========================================================================
// MAIN COMPONENT  

Session.setDefault('insurancePlanChecklistMode', false)

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
    insurancePlanChecklistMode: false
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
          insurancePlans={ data.insurancePlans }
          hideCheckbox={data.hideCheckbox}
          hideStatus={false}
          hideName={false}
          hideTitle={false}
          hideVersion={false}
          hideExperimental={false}
          paginationLimit={10}     
          checklist={data.insurancePlanChecklistMode}
          onRowClick={ handleRowClick.bind(this) }
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          formFactorLayout={formFactor}
          count={data.insurancePlans.length}
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
              selectedInsurancePlanId={ data.selectedInsurancePlanId }
              hideIdentifier={true} 
              hideCheckbox={data.hideCheckbox}
              hideActionIcons={true}
              hideStatus={false}
              hideName={false}
              hideTitle={false}
              hideVersion={false}
              hideExperimental={false}    
              hideBarcode={true}
              onRowClick={ handleRowClick.bind(this) }
              rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
              formFactorLayout={formFactor}
              count={data.insurancePlans.length}
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