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

import CodeSystemDetail from './CodeSystemDetail';
import CodeSystemsTable from './CodeSystemsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { CodeSystems } from '../../lib/schemas/CodeSystems';


//---------------------------------------------------------------
// Session Variables


Session.setDefault('codeSystemPageTabIndex', 0);
Session.setDefault('codeSystemSearchFilter', '');
Session.setDefault('selectedCodeSystemId', '');
Session.setDefault('selectedCodeSystem', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('codeSystemsArray', []);
Session.setDefault('CodeSystemsPage.onePageLayout', true)
Session.setDefault('CodeSystemsTable.hideCheckbox', true)
//---------------------------------------------------------------
// Theming

const muiTheme = Theming.createMuiTheme();



//===========================================================================
// MAIN COMPONENT  

Session.setDefault('codeSystemChecklistMode', false)

export function CodeSystemsPage(props){

  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    codeSystems: [],
    onePageLayout: true,
    codeSystemSearchFilter: '',
    hideCheckbox: true,
    options: {
      sort: {
        'focus.display': -1,
        lastModified: -1
      }
    },
    codeSystemChecklistMode: false
  };

  

  data.hideCheckbox = useTracker(function(){
    return Session.get('CodeSystemsTable.hideCheckbox');
  }, [])
  data.onePageLayout = useTracker(function(){
    return Session.get('CodeSystemsPage.onePageLayout');
  }, [])
  data.selectedCodeSystemId = useTracker(function(){
    return Session.get('selectedCodeSystemId');
  }, [])
  data.selectedCodeSystem = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedCodeSystemId'));
  }, [])
  data.codeSystems = useTracker(function(){
    let results = [];
    if(Session.get('codeSystemChecklistMode')){
      results = CodeSystems.find({
        'focus.display': "Patient Correction"
      }, {
        limit: 10,
        sort: {lastModified: -1}
      }).fetch();      
    } else {
      results = CodeSystems.find().fetch();
    }

    return results;
  }, [])
  data.codeSystemSearchFilter = useTracker(function(){
    return Session.get('codeSystemSearchFilter')
  }, [])
  data.codeSystemChecklistMode = useTracker(function(){
    return Session.get('codeSystemChecklistMode')
  }, [])


  function onCancelUpsertCodeSystem(context){
    Session.set('codeSystemPageTabIndex', 1);
  }
  function onDeleteCodeSystem(context){
    CodeSystems._collection.remove({_id: get(context, 'state.codeSystemId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('CodeSystems.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedCodeSystemId', '');
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "CodeSystems", recordId: context.state.codeSystemId});        
      }
    });
    Session.set('codeSystemPageTabIndex', 1);
  }
  function onUpsertCodeSystem(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new CodeSystem...', context.state)

    if(get(context, 'state.codeSystem')){
      let self = context;
      let fhirCodeSystemData = Object.assign({}, get(context, 'state.codeSystem'));
  
      // if(process.env.NODE_ENV === "test") console.log('fhirCodeSystemData', fhirCodeSystemData);
  
      let codeSystemValidator = CodeSystemSchema.newContext();
      // console.log('codeSystemValidator', codeSystemValidator)
      codeSystemValidator.validate(fhirCodeSystemData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', codeSystemValidator.isValid())
        console.log('ValidationErrors: ', codeSystemValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.codeSystemId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating codeSystem...");
        }

        delete fhirCodeSystemData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirCodeSystemData.resourceType = 'CodeSystem';
  
        CodeSystems._collection.update({_id: get(context, 'state.codeSystemId')}, {$set: fhirCodeSystemData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("CodeSystems.insert[error]", error);
          
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "CodeSystems", recordId: context.state.codeSystemId});
            Session.set('selectedCodeSystemId', '');
            Session.set('codeSystemPageTabIndex', 1);
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new codeSystem...", fhirCodeSystemData);
  
        fhirCodeSystemData.effectiveDateTime = new Date();
        CodeSystems._collection.insert(fhirCodeSystemData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('CodeSystems.insert[error]', error);           
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "CodeSystems", recordId: context.state.codeSystemId});
            Session.set('codeSystemPageTabIndex', 1);
            Session.set('selectedCodeSystemId', '');
          }
        });
      }
    } 
    Session.set('codeSystemPageTabIndex', 1);
  }
  function handleRowClick(codeSystemId, foo, bar){
    console.log('CodeSystemsPage.handleRowClick', codeSystemId)
    let codeSystem = CodeSystems.findOne({id: codeSystemId});

    if(codeSystem){
      Session.set('selectedCodeSystemId', get(codeSystem, 'id'));
      Session.set('selectedCodeSystem', codeSystem);
      Session.set('CodeSystem.Current', codeSystem);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "CodeSystemDetail");
        Session.set('mainAppDialogMaxWidth', "sm");
        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Code System");
        } else {
          Session.set('mainAppDialogTitle', "View Code System");
        }
      }      
    }
  }
  function onInsert(codeSystemId){
    Session.set('selectedCodeSystemId', '');
    Session.set('codeSystemPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "CodeSystems", recordId: codeSystemId});
  }
  function onCancel(){
    Session.set('codeSystemPageTabIndex', 1);
  } 


  // console.log('CodeSystemsPage.data', data)

  function handleChange(event, newValue) {
    Session.set('codeSystemPageTabIndex', newValue)
  }


  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} scrollable >
      <CardHeader title={data.codeSystems.length + " Code Systems"} />
      <CardContent>

        <CodeSystemsTable 
          codeSystems={ data.codeSystems }
          hideCheckbox={data.hideCheckbox}
          hideStatus={false}
          hideName={false}
          hideTitle={false}
          hideVersion={false}
          hideExperimental={false}
          paginationLimit={10}    
          onRowClick={ handleRowClick.bind(this) } 
          checklist={data.codeSystemChecklistMode}
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          count={data.codeSystems.length}
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.codeSystems.length + " Code Systems"} />
          <CardContent>
            <CodeSystemsTable 
              codeSystems={ data.codeSystems }
              selectedCodeSystemId={ data.selectedCodeSystemId }
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
              count={data.codeSystems.length}
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedCodeSystemId }</h1>
          {/* <CardHeader title={data.selectedCodeSystemId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <CodeSystemDetail 
                id='codeSystemDetails'                 
                displayDatePicker={true} 
                displayBarcodes={false}
                codeSystem={ data.selectedCodeSystem }
                codeSystemId={ data.selectedCodeSystemId } 
                showCodeSystemInputs={true}
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
    <PageCanvas id="codeSystemsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default CodeSystemsPage;