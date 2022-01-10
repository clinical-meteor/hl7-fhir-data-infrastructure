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

import StructureDefinitionDetail from './StructureDefinitionDetail';
import StructureDefinitionsTable from './StructureDefinitionsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';



//---------------------------------------------------------------
// Session Variables


Session.setDefault('structureDefinitionPageTabIndex', 0);
Session.setDefault('structureDefinitionSearchFilter', '');
Session.setDefault('selectedStructureDefinitionId', '');
Session.setDefault('selectedStructureDefinition', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('structureDefinitionsArray', []);
Session.setDefault('StructureDefinitionsPage.onePageLayout', true)
Session.setDefault('StructureDefinitionsTable.hideCheckbox', true)

//---------------------------------------------------------------
// Theming

const muiTheme = Theming.createMuiTheme();



//===========================================================================
// MAIN COMPONENT  

Session.setDefault('structureDefinitionChecklistMode', false)

export function StructureDefinitionsPage(props){

  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    structureDefinitions: [],
    onePageLayout: true,
    structureDefinitionSearchFilter: '',
    options: {
      sort: {
        'focus.display': -1,
        lastModified: -1
      }
    },
    structureDefinitionChecklistMode: false
  };

  


  data.onePageLayout = useTracker(function(){
    return Session.get('StructureDefinitionsPage.onePageLayout');
  }, [])
  data.hideCheckbox = useTracker(function(){
    return Session.get('StructureDefinitionsTable.hideCheckbox');
  }, [])
  data.selectedStructureDefinitionId = useTracker(function(){
    return Session.get('selectedStructureDefinitionId');
  }, [])
  data.selectedStructureDefinition = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedStructureDefinitionId'));
  }, [])
  data.structureDefinitions = useTracker(function(){
    let results = [];
    if(Session.get('structureDefinitionChecklistMode')){
      results = StructureDefinitions.find({
        'focus.display': "Patient Correction"
      }, {
        limit: 10,
        sort: {lastModified: -1}
      }).fetch();      
    } else {
      results = StructureDefinitions.find().fetch();
    }

    return results;
  }, [])
  data.structureDefinitionSearchFilter = useTracker(function(){
    return Session.get('structureDefinitionSearchFilter')
  }, [])
  data.structureDefinitionChecklistMode = useTracker(function(){
    return Session.get('structureDefinitionChecklistMode')
  }, [])


  function onCancelUpsertStructureDefinition(context){
    Session.set('structureDefinitionPageTabIndex', 1);
  }
  function onDeleteStructureDefinition(context){
    StructureDefinitions._collection.remove({_id: get(context, 'state.structureDefinitionId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('StructureDefinitions.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedStructureDefinitionId', '');
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "StructureDefinitions", recordId: context.state.structureDefinitionId});        
      }
    });
    Session.set('structureDefinitionPageTabIndex', 1);
  }
  function onUpsertStructureDefinition(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new StructureDefinition...', context.state)

    if(get(context, 'state.structureDefinition')){
      let self = context;
      let fhirStructureDefinitionData = Object.assign({}, get(context, 'state.structureDefinition'));
  
      // if(process.env.NODE_ENV === "test") console.log('fhirStructureDefinitionData', fhirStructureDefinitionData);
  
      let structureDefinitionValidator = StructureDefinitionSchema.newContext();
      // console.log('structureDefinitionValidator', structureDefinitionValidator)
      structureDefinitionValidator.validate(fhirStructureDefinitionData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', structureDefinitionValidator.isValid())
        console.log('ValidationErrors: ', structureDefinitionValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.structureDefinitionId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating structureDefinition...");
        }

        delete fhirStructureDefinitionData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirStructureDefinitionData.resourceType = 'StructureDefinition';
  
        StructureDefinitions._collection.update({_id: get(context, 'state.structureDefinitionId')}, {$set: fhirStructureDefinitionData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("StructureDefinitions.insert[error]", error);
          
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "StructureDefinitions", recordId: context.state.structureDefinitionId});
            Session.set('selectedStructureDefinitionId', '');
            Session.set('structureDefinitionPageTabIndex', 1);
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new structureDefinition...", fhirStructureDefinitionData);
  
        fhirStructureDefinitionData.effectiveDateTime = new Date();
        StructureDefinitions._collection.insert(fhirStructureDefinitionData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('StructureDefinitions.insert[error]', error);           
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "StructureDefinitions", recordId: context.state.structureDefinitionId});
            Session.set('structureDefinitionPageTabIndex', 1);
            Session.set('selectedStructureDefinitionId', '');
          }
        });
      }
    } 
    Session.set('structureDefinitionPageTabIndex', 1);
  }
  function handleRowClick(structureDefinitionId){
    console.log('StructureDefinitionsPage.handleRowClick', structureDefinitionId)
    let structureDefinition = StructureDefinitions.findOne({id: structureDefinitionId});

    if(structureDefinition){
      Session.set('selectedStructureDefinitionId', get(structureDefinition, 'id'));
      Session.set('selectedStructureDefinition', structureDefinition);
      Session.set('StructureDefinition.Current', structureDefinition);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "StructureDefinitionDetail");
        Session.set('mainAppDialogMaxWidth', "sm");

        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Definition");
        } else {
          Session.set('mainAppDialogTitle', "View Definition");
        }
      }      
    } else {
      console.log('No structureDefinition found...')
    }
  }
  function onInsert(structureDefinitionId){
    Session.set('selectedStructureDefinitionId', '');
    Session.set('structureDefinitionPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "StructureDefinitions", recordId: structureDefinitionId});
  }
  function onCancel(){
    Session.set('structureDefinitionPageTabIndex', 1);
  } 


  // console.log('StructureDefinitionsPage.data', data)

  function handleChange(event, newValue) {
    Session.set('structureDefinitionPageTabIndex', newValue)
  }


  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} scrollable >
      <CardHeader title={data.structureDefinitions.length + " Structure Definitions"} />
      <CardContent>

        <StructureDefinitionsTable 
          structureDefinitions={ data.structureDefinitions }
          hideCheckbox={data.hideCheckbox}
          hideStatus={false}
          hideName={false}
          hideTitle={false}
          hideVersion={false}
          hideExperimental={false}
          paginationLimit={10}     
          checklist={data.structureDefinitionChecklistMode}
          onRowClick={ handleRowClick.bind(this) }
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          count={data.structureDefinitions.length}
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.structureDefinitions.length + " StructureDefinitions"} />
          <CardContent>
            <StructureDefinitionsTable 
              structureDefinitions={ data.structureDefinitions }
              selectedStructureDefinitionId={ data.selectedStructureDefinitionId }
              hideIdentifier={true} 
              hideCheckbox={data.hideCheckbox}
              hideActionIcons={true}
              hideStatus={false}
              hideName={false}
              hideTitle={true}
              hideVersion={false}
              hideExperimental={true}    
              hideBarcode={true}
              onRowClick={ handleRowClick.bind(this) }
              rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
              count={data.structureDefinitions.length}
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedStructureDefinitionId }</h1>
          {/* <CardHeader title={data.selectedStructureDefinitionId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <StructureDefinitionDetail 
                id='structureDefinitionDetails'                 
                displayDatePicker={true} 
                displayBarcodes={false}
                structureDefinition={ data.selectedStructureDefinition }
                structureDefinitionId={ data.selectedStructureDefinitionId } 
                showStructureDefinitionInputs={true}
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
    <PageCanvas id="structureDefinitionsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default StructureDefinitionsPage;