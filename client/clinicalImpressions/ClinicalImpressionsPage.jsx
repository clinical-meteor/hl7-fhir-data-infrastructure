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

// import ClinicalImpressionDetail from './ClinicalImpressionDetail';
import ClinicalImpressionsTable from './ClinicalImpressionsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { ClinicalImpressions } from '../../lib/schemas/SimpleSchemas/ClinicalImpressions';


//---------------------------------------------------------------
// Session Variables


Session.setDefault('clinicalImpressionPageTabIndex', 0);
Session.setDefault('clinicalImpressionSearchFilter', '');
Session.setDefault('selectedClinicalImpressionId', '');
Session.setDefault('selectedClinicalImpression', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('clinicalImpressionsArray', []);
Session.setDefault('ClinicalImpressionsPage.onePageLayout', true)

//---------------------------------------------------------------
// Theming

const muiTheme = Theming.createMuiTheme();



//===========================================================================
// MAIN COMPONENT  

Session.setDefault('clinicalImpressionChecklistMode', false)

export function ClinicalImpressionsPage(props){

  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    clinicalImpressions: [],
    onePageLayout: true,
    clinicalImpressionSearchFilter: '',
    options: {
      sort: {
        'focus.display': -1,
        lastModified: -1
      }
    },
    clinicalImpressionChecklistMode: false
  };

  


  data.onePageLayout = useTracker(function(){
    return Session.get('ClinicalImpressionsPage.onePageLayout');
  }, [])
  data.selectedClinicalImpressionId = useTracker(function(){
    return Session.get('selectedClinicalImpressionId');
  }, [])
  data.selectedClinicalImpression = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedClinicalImpressionId'));
  }, [])
  data.clinicalImpressions = useTracker(function(){
    let results = [];
    if(Session.get('clinicalImpressionChecklistMode')){
      results = ClinicalImpressions.find({
        'focus.display': "Patient Correction"
      }, {
        limit: 10,
        sort: {lastModified: -1}
      }).fetch();      
    } else {
      results = ClinicalImpressions.find().fetch();
    }

    return results;
  }, [])
  data.clinicalImpressionSearchFilter = useTracker(function(){
    return Session.get('clinicalImpressionSearchFilter')
  }, [])
  data.clinicalImpressionChecklistMode = useTracker(function(){
    return Session.get('clinicalImpressionChecklistMode')
  }, [])


  function onCancelUpsertClinicalImpression(context){
    Session.set('clinicalImpressionPageTabIndex', 1);
  }
  function onDeleteClinicalImpression(context){
    ClinicalImpressions._collection.remove({_id: get(context, 'state.clinicalImpressionId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('ClinicalImpressions.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedClinicalImpressionId', '');
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "ClinicalImpressions", recordId: context.state.clinicalImpressionId});        
      }
    });
    Session.set('clinicalImpressionPageTabIndex', 1);
  }
  function onUpsertClinicalImpression(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new ClinicalImpression...', context.state)

    if(get(context, 'state.clinicalImpression')){
      let self = context;
      let fhirClinicalImpressionData = Object.assign({}, get(context, 'state.clinicalImpression'));
  
      // if(process.env.NODE_ENV === "test") console.log('fhirClinicalImpressionData', fhirClinicalImpressionData);
  
      let clinicalImpressionValidator = ClinicalImpressionSchema.newContext();
      // console.log('clinicalImpressionValidator', clinicalImpressionValidator)
      clinicalImpressionValidator.validate(fhirClinicalImpressionData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', clinicalImpressionValidator.isValid())
        console.log('ValidationErrors: ', clinicalImpressionValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.clinicalImpressionId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating clinicalImpression...");
        }

        delete fhirClinicalImpressionData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirClinicalImpressionData.resourceType = 'ClinicalImpression';
  
        ClinicalImpressions._collection.update({_id: get(context, 'state.clinicalImpressionId')}, {$set: fhirClinicalImpressionData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("ClinicalImpressions.insert[error]", error);
          
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "ClinicalImpressions", recordId: context.state.clinicalImpressionId});
            Session.set('selectedClinicalImpressionId', '');
            Session.set('clinicalImpressionPageTabIndex', 1);
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new clinicalImpression...", fhirClinicalImpressionData);
  
        fhirClinicalImpressionData.effectiveDateTime = new Date();
        ClinicalImpressions._collection.insert(fhirClinicalImpressionData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('ClinicalImpressions.insert[error]', error);           
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "ClinicalImpressions", recordId: context.state.clinicalImpressionId});
            Session.set('clinicalImpressionPageTabIndex', 1);
            Session.set('selectedClinicalImpressionId', '');
          }
        });
      }
    } 
    Session.set('clinicalImpressionPageTabIndex', 1);
  }
  function handleRowClick(clinicalImpressionId, foo, bar){
    console.log('ClinicalImpressionsPage.handleRowClick', clinicalImpressionId)
    let clinicalImpression = ClinicalImpressions.findOne({id: clinicalImpressionId});

    Session.set('selectedClinicalImpressionId', get(clinicalImpression, 'id'));
    Session.set('selectedClinicalImpression', clinicalImpression);
  }
  function onInsert(clinicalImpressionId){
    Session.set('selectedClinicalImpressionId', '');
    Session.set('clinicalImpressionPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "ClinicalImpressions", recordId: clinicalImpressionId});
  }
  function onCancel(){
    Session.set('clinicalImpressionPageTabIndex', 1);
  } 


  // console.log('ClinicalImpressionsPage.data', data)

  function handleChange(event, newValue) {
    Session.set('clinicalImpressionPageTabIndex', newValue)
  }

  let [clinicalImpressionsPageIndex, setClinicalImpressionsPageIndex] = setState(0);

  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} scrollable >
      <CardHeader title={data.clinicalImpressions.length + " Code Systems"} />
      <CardContent>

        <ClinicalImpressionsTable 
          clinicalImpressions={ data.clinicalImpressions }
          hideCheckbox={false}
          hideStatus={false}
          hideName={false}
          hideTitle={false}
          hideVersion={false}
          hideExperimental={false}
          paginationLimit={10}     
          checklist={data.clinicalImpressionChecklistMode}
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          count={data.clinicalImpressions.length}
          page={clinicalImpressionsPageIndex}
          onSetPage={function(index){
            setClinicalImpressionsPageIndex(index)
          }}  
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.clinicalImpressions.length + " Code Systems"} />
          <CardContent>
            <ClinicalImpressionsTable 
              clinicalImpressions={ data.clinicalImpressions }
              selectedClinicalImpressionId={ data.selectedClinicalImpressionId }
              hideIdentifier={true} 
              hideCheckbox={false}
              hideActionIcons={true}
              hideStatus={false}
              hideName={false}
              hideTitle={false}
              hideVersion={false}
              hideExperimental={false}    
              hideBarcode={true}
              onRowClick={ handleRowClick.bind(this) }
              rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
              count={data.clinicalImpressions.length}
              page={clinicalImpressionsPageIndex}
              onSetPage={function(index){
                setClinicalImpressionsPageIndex(index)
              }}  
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedClinicalImpressionId }</h1>
          {/* <CardHeader title={data.selectedClinicalImpressionId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <ClinicalImpressionDetail 
                id='clinicalImpressionDetails'                 
                displayDatePicker={true} 
                displayBarcodes={false}
                clinicalImpression={ data.selectedClinicalImpression }
                clinicalImpressionId={ data.selectedClinicalImpressionId } 
                showClinicalImpressionInputs={true}
                showHints={false}
                onSetPage={function(index){
                  setClinicalImpressionsPageIndex(index)
                }}    
              />
            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  }


  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  return (
    <PageCanvas id="clinicalImpressionsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default ClinicalImpressionsPage;