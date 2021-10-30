import React  from 'react';

import { 
  CardHeader,
  CardContent,
  Grid
} from '@material-ui/core';
import styled from 'styled-components';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { useTracker } from 'meteor/react-meteor-data';

import EndpointsTable from './EndpointsTable';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import LayoutHelpers from '../../lib/LayoutHelpers';


//---------------------------------------------------------------
// Session Variables


Session.setDefault('endpointPageTabIndex', 0);
Session.setDefault('endpointSearchFilter', '');
Session.setDefault('selectedEndpointId', '');
Session.setDefault('selectedEndpoint', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('endpointsArray', []);
Session.setDefault('EndpointsPage.onePageLayout', true)

//---------------------------------------------------------------
// Theming

const muiTheme = Theming.createMuiTheme();



//===========================================================================
// MAIN COMPONENT  

Session.setDefault('endpointChecklistMode', false)

export function EndpointsPage(props){

  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    endpoints: [],
    onePageLayout: true,
    endpointSearchFilter: '',
    options: {
      sort: {
        'focus.display': -1,
        lastModified: -1
      }
    },
    endpointChecklistMode: false
  };

  


  data.onePageLayout = useTracker(function(){
    return Session.get('EndpointsPage.onePageLayout');
  }, [])
  data.selectedEndpointId = useTracker(function(){
    return Session.get('selectedEndpointId');
  }, [])
  data.selectedEndpoint = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedEndpointId'));
  }, [])
  data.endpoints = useTracker(function(){
    let results = [];
    if(Session.get('endpointChecklistMode')){
      results = Endpoints.find({
        'focus.display': "Patient Correction"
      }, {
        limit: 10,
        sort: {lastModified: -1}
      }).fetch();      
    } else {
      results = Endpoints.find().fetch();
    }

    return results;
  }, [])
  data.endpointSearchFilter = useTracker(function(){
    return Session.get('endpointSearchFilter')
  }, [])
  data.endpointChecklistMode = useTracker(function(){
    return Session.get('endpointChecklistMode')
  }, [])


  function onCancelUpsertEndpoint(context){
    Session.set('endpointPageTabIndex', 1);
  }
  function onDeleteEndpoint(context){
    Endpoints._collection.remove({_id: get(context, 'state.endpointId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('Endpoints.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedEndpointId', '');
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Endpoints", recordId: context.state.endpointId});        
      }
    });
    Session.set('endpointPageTabIndex', 1);
  }
  function onUpsertEndpoint(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new Endpoint...', context.state)

    if(get(context, 'state.endpoint')){
      let self = context;
      let fhirEndpointData = Object.assign({}, get(context, 'state.endpoint'));
  
      // if(process.env.NODE_ENV === "test") console.log('fhirEndpointData', fhirEndpointData);
  
      let endpointValidator = EndpointSchema.newContext();
      // console.log('endpointValidator', endpointValidator)
      endpointValidator.validate(fhirEndpointData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', endpointValidator.isValid())
        console.log('ValidationErrors: ', endpointValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.endpointId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating endpoint...");
        }

        delete fhirEndpointData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirEndpointData.resourceType = 'Endpoint';
  
        Endpoints._collection.update({_id: get(context, 'state.endpointId')}, {$set: fhirEndpointData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("Endpoints.insert[error]", error);
          
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Endpoints", recordId: context.state.endpointId});
            Session.set('selectedEndpointId', '');
            Session.set('endpointPageTabIndex', 1);
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new endpoint...", fhirEndpointData);
  
        fhirEndpointData.effectiveDateTime = new Date();
        Endpoints._collection.insert(fhirEndpointData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('Endpoints.insert[error]', error);           
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Endpoints", recordId: context.state.endpointId});
            Session.set('endpointPageTabIndex', 1);
            Session.set('selectedEndpointId', '');
          }
        });
      }
    } 
    Session.set('endpointPageTabIndex', 1);
  }
  function handleRowClick(endpointId, foo, bar){
    console.log('EndpointsPage.handleRowClick', endpointId)
    let endpoint = Endpoints.findOne({id: endpointId});

    Session.set('selectedEndpointId', get(endpoint, 'id'));
    Session.set('selectedEndpoint', endpoint);
  }
  function onInsert(endpointId){
    Session.set('selectedEndpointId', '');
    Session.set('endpointPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Endpoints", recordId: endpointId});
  }
  function onCancel(){
    Session.set('endpointPageTabIndex', 1);
  } 


  // console.log('EndpointsPage.data', data)

  function handleChange(event, newValue) {
    Session.set('endpointPageTabIndex', newValue)
  }


  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} scrollable >
      <CardHeader title={data.endpoints.length + " Endpoints"} />
      <CardContent>

        <EndpointsTable 
          endpoints={ data.endpoints }
          hideCheckbox={false}
          hideStatus={false}
          hideName={false}
          hideTitle={false}
          hideVersion={false}
          hideExperimental={false}
          paginationLimit={10}     
          checklist={data.endpointChecklistMode}
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          count={data.endpoints.length}
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.endpoints.length + " Code Systems"} />
          <CardContent>
            <EndpointsTable 
              endpoints={ data.endpoints }
              selectedEndpointId={ data.selectedEndpointId }
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
              count={data.endpoints.length}
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedEndpointId }</h1>
          {/* <CardHeader title={data.selectedEndpointId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <EndpointDetail 
                id='endpointDetails'                 
                displayDatePicker={true} 
                displayBarcodes={false}
                endpoint={ data.selectedEndpoint }
                endpointId={ data.selectedEndpointId } 
                showEndpointInputs={true}
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
    <PageCanvas id="endpointsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default EndpointsPage;