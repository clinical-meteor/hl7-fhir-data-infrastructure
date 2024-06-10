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

// import BodyStructureDetail from './BodyStructureDetail';
import BodyStructuresTable from './BodyStructuresTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { BodyStructures } from '../../lib/schemas/SimpleSchemas/BodyStructures';


//---------------------------------------------------------------
// Session Variables


Session.setDefault('bodyStructurePageTabIndex', 0);
Session.setDefault('bodyStructureSearchFilter', '');
Session.setDefault('selectedBodyStructureId', '');
Session.setDefault('selectedBodyStructure', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('bodyStructuresArray', []);
Session.setDefault('BodyStructuresPage.onePageLayout', true)

//---------------------------------------------------------------
// Theming

const muiTheme = Theming.createMuiTheme();



//===========================================================================
// MAIN COMPONENT  

Session.setDefault('bodyStructureChecklistMode', false)

export function BodyStructuresPage(props){

  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    bodyStructures: [],
    onePageLayout: true,
    bodyStructureSearchFilter: '',
    options: {
      sort: {
        'focus.display': -1,
        lastModified: -1
      }
    },
    bodyStructureChecklistMode: false
  };

  


  data.onePageLayout = useTracker(function(){
    return Session.get('BodyStructuresPage.onePageLayout');
  }, [])
  data.selectedBodyStructureId = useTracker(function(){
    return Session.get('selectedBodyStructureId');
  }, [])
  data.selectedBodyStructure = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedBodyStructureId'));
  }, [])
  data.bodyStructures = useTracker(function(){
    let results = [];
    if(Session.get('bodyStructureChecklistMode')){
      results = BodyStructures.find({
        'focus.display': "Patient Correction"
      }, {
        limit: 10,
        sort: {lastModified: -1}
      }).fetch();      
    } else {
      results = BodyStructures.find().fetch();
    }

    return results;
  }, [])
  data.bodyStructureSearchFilter = useTracker(function(){
    return Session.get('bodyStructureSearchFilter')
  }, [])
  data.bodyStructureChecklistMode = useTracker(function(){
    return Session.get('bodyStructureChecklistMode')
  }, [])


  function onCancelUpsertBodyStructure(context){
    Session.set('bodyStructurePageTabIndex', 1);
  }
  function onDeleteBodyStructure(context){
    BodyStructures._collection.remove({_id: get(context, 'state.bodyStructureId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('BodyStructures.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedBodyStructureId', '');
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "BodyStructures", recordId: context.state.bodyStructureId});        
      }
    });
    Session.set('bodyStructurePageTabIndex', 1);
  }
  function onUpsertBodyStructure(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new BodyStructure...', context.state)

    if(get(context, 'state.bodyStructure')){
      let self = context;
      let fhirBodyStructureData = Object.assign({}, get(context, 'state.bodyStructure'));
  
      // if(process.env.NODE_ENV === "test") console.log('fhirBodyStructureData', fhirBodyStructureData);
  
      let bodyStructureValidator = BodyStructureSchema.newContext();
      // console.log('bodyStructureValidator', bodyStructureValidator)
      bodyStructureValidator.validate(fhirBodyStructureData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', bodyStructureValidator.isValid())
        console.log('ValidationErrors: ', bodyStructureValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.bodyStructureId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating bodyStructure...");
        }

        delete fhirBodyStructureData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirBodyStructureData.resourceType = 'BodyStructure';
  
        BodyStructures._collection.update({_id: get(context, 'state.bodyStructureId')}, {$set: fhirBodyStructureData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("BodyStructures.insert[error]", error);
          
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "BodyStructures", recordId: context.state.bodyStructureId});
            Session.set('selectedBodyStructureId', '');
            Session.set('bodyStructurePageTabIndex', 1);
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new bodyStructure...", fhirBodyStructureData);
  
        fhirBodyStructureData.effectiveDateTime = new Date();
        BodyStructures._collection.insert(fhirBodyStructureData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('BodyStructures.insert[error]', error);           
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "BodyStructures", recordId: context.state.bodyStructureId});
            Session.set('bodyStructurePageTabIndex', 1);
            Session.set('selectedBodyStructureId', '');
          }
        });
      }
    } 
    Session.set('bodyStructurePageTabIndex', 1);
  }
  function handleRowClick(bodyStructureId, foo, bar){
    console.log('BodyStructuresPage.handleRowClick', bodyStructureId)
    let bodyStructure = BodyStructures.findOne({id: bodyStructureId});

    Session.set('selectedBodyStructureId', get(bodyStructure, 'id'));
    Session.set('selectedBodyStructure', bodyStructure);
  }
  function onInsert(bodyStructureId){
    Session.set('selectedBodyStructureId', '');
    Session.set('bodyStructurePageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "BodyStructures", recordId: bodyStructureId});
  }
  function onCancel(){
    Session.set('bodyStructurePageTabIndex', 1);
  } 


  // console.log('BodyStructuresPage.data', data)

  function handleChange(event, newValue) {
    Session.set('bodyStructurePageTabIndex', newValue)
  }

  let [bodyStructuresPageIndex, setBodyStructuresPageIndex] = setState(0);

  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} scrollable >
      <CardHeader title={data.bodyStructures.length + " Code Systems"} />
      <CardContent>

        <BodyStructuresTable 
          bodyStructures={ data.bodyStructures }
          hideCheckbox={false}
          hideStatus={false}
          hideName={false}
          hideTitle={false}
          hideVersion={false}
          hideExperimental={false}
          paginationLimit={10}     
          checklist={data.bodyStructureChecklistMode}
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          count={data.bodyStructures.length}
          page={bodyStructuresPageIndex}
          onSetPage={function(index){
            setBodyStructuresPageIndex(index)
          }}  
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.bodyStructures.length + " Code Systems"} />
          <CardContent>
            <BodyStructuresTable 
              bodyStructures={ data.bodyStructures }
              selectedBodyStructureId={ data.selectedBodyStructureId }
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
              count={data.bodyStructures.length}
              page={bodyStructuresPageIndex}
              onSetPage={function(index){
                setBodyStructuresPageIndex(index)
              }}  
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedBodyStructureId }</h1>
          {/* <CardHeader title={data.selectedBodyStructureId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <BodyStructureDetail 
                id='bodyStructureDetails'                 
                displayDatePicker={true} 
                displayBarcodes={false}
                bodyStructure={ data.selectedBodyStructure }
                bodyStructureId={ data.selectedBodyStructureId } 
                showBodyStructureInputs={true}
                showHints={false}
                onSetPage={function(index){
                  setBodyStructuresPageIndex(index)
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
    <PageCanvas id="bodyStructuresPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default BodyStructuresPage;