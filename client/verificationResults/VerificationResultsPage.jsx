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
import ReactMixin  from 'react-mixin';

// import VerificationResultDetail from './VerificationResultDetail';
import VerificationResultsTable from './VerificationResultsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';



//---------------------------------------------------------------
// Session Variables


Session.setDefault('verificationResultPageTabIndex', 0);
Session.setDefault('verificationResultSearchFilter', '');
Session.setDefault('selectedVerificationResultId', '');
Session.setDefault('selectedVerificationResult', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('verificationResultsArray', []);
Session.setDefault('VerificationResultsPage.onePageLayout', true)

//---------------------------------------------------------------
// Theming

const muiTheme = Theming.createMuiTheme();



//===========================================================================
// MAIN COMPONENT  

Session.setDefault('verificationResultChecklistMode', false)

export function VerificationResultsPage(props){

  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    verificationResults: [],
    onePageLayout: true,
    verificationResultSearchFilter: '',
    options: {
      sort: {
        'focus.display': -1,
        lastModified: -1
      }
    },
    verificationResultChecklistMode: false
  };

  


  data.onePageLayout = useTracker(function(){
    return Session.get('VerificationResultsPage.onePageLayout');
  }, [])
  data.selectedVerificationResultId = useTracker(function(){
    return Session.get('selectedVerificationResultId');
  }, [])
  data.selectedVerificationResult = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedVerificationResultId'));
  }, [])
  data.verificationResults = useTracker(function(){
    let results = [];
    if(Session.get('verificationResultChecklistMode')){
      results = VerificationResults.find({
        'focus.display': "Patient Correction"
      }, {
        limit: 10,
        sort: {lastModified: -1}
      }).fetch();      
    } else {
      results = VerificationResults.find().fetch();
    }

    return results;
  }, [])
  data.verificationResultSearchFilter = useTracker(function(){
    return Session.get('verificationResultSearchFilter')
  }, [])
  data.verificationResultChecklistMode = useTracker(function(){
    return Session.get('verificationResultChecklistMode')
  }, [])


  function onCancelUpsertVerificationResult(context){
    Session.set('verificationResultPageTabIndex', 1);
  }
  function onDeleteVerificationResult(context){
    VerificationResults._collection.remove({_id: get(context, 'state.verificationResultId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('VerificationResults.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedVerificationResultId', '');
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "VerificationResults", recordId: context.state.verificationResultId});        
      }
    });
    Session.set('verificationResultPageTabIndex', 1);
  }
  function onUpsertVerificationResult(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new VerificationResult...', context.state)

    if(get(context, 'state.verificationResult')){
      let self = context;
      let fhirVerificationResultData = Object.assign({}, get(context, 'state.verificationResult'));
  
      // if(process.env.NODE_ENV === "test") console.log('fhirVerificationResultData', fhirVerificationResultData);
  
      let verificationResultValidator = VerificationResultSchema.newContext();
      // console.log('verificationResultValidator', verificationResultValidator)
      verificationResultValidator.validate(fhirVerificationResultData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', verificationResultValidator.isValid())
        console.log('VerificationResultErrors: ', verificationResultValidator.verificationResultErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.verificationResultId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating verificationResult...");
        }

        delete fhirVerificationResultData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirVerificationResultData.resourceType = 'VerificationResult';
  
        VerificationResults._collection.update({_id: get(context, 'state.verificationResultId')}, {$set: fhirVerificationResultData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("VerificationResults.insert[error]", error);
          
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "VerificationResults", recordId: context.state.verificationResultId});
            Session.set('selectedVerificationResultId', '');
            Session.set('verificationResultPageTabIndex', 1);
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new verificationResult...", fhirVerificationResultData);
  
        fhirVerificationResultData.effectiveDateTime = new Date();
        VerificationResults._collection.insert(fhirVerificationResultData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('VerificationResults.insert[error]', error);           
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "VerificationResults", recordId: context.state.verificationResultId});
            Session.set('verificationResultPageTabIndex', 1);
            Session.set('selectedVerificationResultId', '');
          }
        });
      }
    } 
    Session.set('verificationResultPageTabIndex', 1);
  }
  function handleRowClick(verificationResultId, foo, bar){
    console.log('VerificationResultsPage.handleRowClick', verificationResultId)
    let verificationResult = VerificationResults.findOne({id: verificationResultId});

    Session.set('selectedVerificationResultId', get(verificationResult, 'id'));
    Session.set('selectedVerificationResult', verificationResult);
  }
  function onInsert(verificationResultId){
    Session.set('selectedVerificationResultId', '');
    Session.set('verificationResultPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "VerificationResults", recordId: verificationResultId});
  }
  function onCancel(){
    Session.set('verificationResultPageTabIndex', 1);
  } 


  // console.log('VerificationResultsPage.data', data)

  function handleChange(event, newValue) {
    Session.set('verificationResultPageTabIndex', newValue)
  }


  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} scrollable >
      <CardHeader title={data.verificationResults.length + " Verification Results"} />
      <CardContent>

        <VerificationResultsTable 
          verificationResults={ data.verificationResults }
          hideCheckbox={false}
          hideStatus={false}
          hideName={false}
          hideTitle={false}
          hideVersion={false}
          hideExperimental={false}
          paginationLimit={10}     
          checklist={data.verificationResultChecklistMode}
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          count={data.verificationResults.length}
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.verificationResults.length + " Verification Results"} />
          <CardContent>
            <VerificationResultsTable 
              verificationResults={ data.verificationResults }
              selectedVerificationResultId={ data.selectedVerificationResultId }
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
              count={data.verificationResults.length}
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedVerificationResultId }</h1>
          {/* <CardHeader title={data.selectedVerificationResultId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <VerificationResultDetail 
                id='verificationResultDetails'                 
                displayDatePicker={true} 
                displayBarcodes={false}
                verificationResult={ data.selectedVerificationResult }
                verificationResultId={ data.selectedVerificationResultId } 
                showVerificationResultInputs={true}
                showHints={false}

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
    <PageCanvas id="verificationResultsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default VerificationResultsPage;