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

import HealthcareServicesTable from './HealthcareServicesTable';
import HealthcareServiceDetail from './HealthcareServiceDetail';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider } from '@material-ui/core/styles';
// import { HealthcareServices } from '../../lib/schemas/HealthcareServices';

//---------------------------------------------------------------
// Session Variables


Session.setDefault('healthcareServicePageTabIndex', 0);
Session.setDefault('healthcareServiceSearchFilter', '');
Session.setDefault('selectedHealthcareServiceId', '');
Session.setDefault('selectedHealthcareService', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('healthcareServicesArray', []);
Session.setDefault('HealthcareServicesPage.onePageLayout', true)
Session.setDefault('HealthcareServicesTable.hideCheckbox', true)

//---------------------------------------------------------------
// Theming

const muiTheme = Theming.createMuiTheme();



//===========================================================================
// MAIN COMPONENT  

Session.setDefault('healthcareServiceChecklistMode', false)

export function HealthcareServicesPage(props){

  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    healthcareServices: [],
    onePageLayout: true,
    hideCheckbox: true,
    healthcareServiceSearchFilter: '',
    options: {
      sort: {
        'focus.display': -1,
        lastModified: -1
      }
    },
    healthcareServiceChecklistMode: false
  };

  


  data.onePageLayout = useTracker(function(){
    return Session.get('HealthcareServicesPage.onePageLayout');
  }, [])
  data.hideCheckbox = useTracker(function(){
    return Session.get('HealthcareServicesTable.hideCheckbox');
  }, [])
  data.selectedHealthcareServiceId = useTracker(function(){
    return Session.get('selectedHealthcareServiceId');
  }, [])
  data.selectedHealthcareService = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedHealthcareServiceId'));
  }, [])
  data.healthcareServices = useTracker(function(){
    let results = [];
    if(Session.get('healthcareServiceChecklistMode')){
      results = HealthcareServices.find({
        'focus.display': "Patient Correction"
      }, {
        limit: 10,
        sort: {lastModified: -1}
      }).fetch();      
    } else {
      results = HealthcareServices.find().fetch();
    }

    return results;
  }, [])
  data.healthcareServiceSearchFilter = useTracker(function(){
    return Session.get('healthcareServiceSearchFilter')
  }, [])
  data.healthcareServiceChecklistMode = useTracker(function(){
    return Session.get('healthcareServiceChecklistMode')
  }, [])


  // function onCancelUpsertHealthcareService(context){
  //   Session.set('healthcareServicePageTabIndex', 1);
  // }
  // function onDeleteHealthcareService(context){
  //   HealthcareServices._collection.remove({_id: get(context, 'state.healthcareServiceId')}, function(error, result){
  //     if (error) {
  //       if(process.env.NODE_ENV === "test") console.log('HealthcareServices.insert[error]', error);
  //       Bert.alert(error.reason, 'danger');
  //     }
  //     if (result) {
  //       Session.set('selectedHealthcareServiceId', '');
  //       HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "HealthcareServices", recordId: context.state.healthcareServiceId});        
  //     }
  //   });
  //   Session.set('healthcareServicePageTabIndex', 1);
  // }
  // function onUpsertHealthcareService(context){
  //   //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
  //   console.log('Saving a new HealthcareService...', context.state)

  //   if(get(context, 'state.healthcareService')){
  //     let self = context;
  //     let fhirHealthcareServiceData = Object.assign({}, get(context, 'state.healthcareService'));
  
  //     // if(process.env.NODE_ENV === "test") console.log('fhirHealthcareServiceData', fhirHealthcareServiceData);
  
  //     let healthcareServiceValidator = HealthcareServiceSchema.newContext();
  //     // console.log('healthcareServiceValidator', healthcareServiceValidator)
  //     healthcareServiceValidator.validate(fhirHealthcareServiceData)
  
  //     if(process.env.NODE_ENV === "development"){
  //       console.log('IsValid: ', healthcareServiceValidator.isValid())
  //       console.log('ValidationErrors: ', healthcareServiceValidator.validationErrors());
  
  //     }
  
  //     console.log('Checking context.state again...', context.state)
  //     if (get(context, 'state.healthcareServiceId')) {
  //       if(process.env.NODE_ENV === "development") {
  //         console.log("Updating healthcareService...");
  //       }

  //       delete fhirHealthcareServiceData._id;
  
  //       // not sure why we're having to respecify this; fix for a bug elsewhere
  //       fhirHealthcareServiceData.resourceType = 'HealthcareService';
  
  //       HealthcareServices._collection.update({_id: get(context, 'state.healthcareServiceId')}, {$set: fhirHealthcareServiceData }, function(error, result){
  //         if (error) {
  //           if(process.env.NODE_ENV === "test") console.log("HealthcareServices.insert[error]", error);
          
  //         }
  //         if (result) {
  //           HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "HealthcareServices", recordId: context.state.healthcareServiceId});
  //           Session.set('selectedHealthcareServiceId', '');
  //           Session.set('healthcareServicePageTabIndex', 1);
  //         }
  //       });
  //     } else {
  //       // if(process.env.NODE_ENV === "test") 
  //       console.log("Creating a new healthcareService...", fhirHealthcareServiceData);
  
  //       fhirHealthcareServiceData.effectiveDateTime = new Date();
  //       HealthcareServices._collection.insert(fhirHealthcareServiceData, function(error, result) {
  //         if (error) {
  //           if(process.env.NODE_ENV === "test")  console.log('HealthcareServices.insert[error]', error);           
  //         }
  //         if (result) {
  //           HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "HealthcareServices", recordId: context.state.healthcareServiceId});
  //           Session.set('healthcareServicePageTabIndex', 1);
  //           Session.set('selectedHealthcareServiceId', '');
  //         }
  //       });
  //     }
  //   } 
  //   Session.set('healthcareServicePageTabIndex', 1);
  // }

  function handleRowClick(healthcareServiceId){
    console.log('HealthcareServicesPage.handleRowClick', healthcareServiceId)
    let healthcareService = HealthcareServices.findOne({id: healthcareServiceId});

    if(healthcareService){
      Session.set('selectedHealthcareServiceId', get(healthcareService, 'id'));
      Session.set('selectedHealthcareService', healthcareService);
      Session.set('HealthcareService.Current', healthcareService);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "HealthcareServiceDetail");
        Session.set('mainAppDialogMaxWidth', "sm");

        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Service");
        } else {
          Session.set('mainAppDialogTitle', "View Service");
        }
      }      
    }
  }
  function onInsert(healthcareServiceId){
    Session.set('selectedHealthcareServiceId', '');
    Session.set('healthcareServicePageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "HealthcareServices", recordId: healthcareServiceId});
  }
  function onCancel(){
    Session.set('healthcareServicePageTabIndex', 1);
  } 


  // console.log('HealthcareServicesPage.data', data)

  function handleChange(event, newValue) {
    Session.set('healthcareServicePageTabIndex', newValue)
  }


  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} scrollable >
      <CardHeader title={data.healthcareServices.length + " Healthcare Services"} />
      <CardContent>

        <HealthcareServicesTable 
          healthcareServices={ data.healthcareServices }
          hideCheckbox={data.hideCheckbox}
          hideStatus={false}
          hideName={false}
          hideTitle={false}
          hideVersion={false}
          hideExperimental={false}
          paginationLimit={10}     
          checklist={data.healthcareServiceChecklistMode}
          onRowClick={ handleRowClick.bind(this) }
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          count={data.healthcareServices.length}
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.healthcareServices.length + " Healthcare Services"} />
          <CardContent>
            <HealthcareServicesTable 
              healthcareServices={ data.healthcareServices }
              selectedHealthcareServiceId={ data.selectedHealthcareServiceId }
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
              count={data.healthcareServices.length}
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedHealthcareServiceId }</h1>
          {/* <CardHeader title={data.selectedHealthcareServiceId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <HealthcareServiceDetail 
                id='healthcareServiceDetails'                 
                displayDatePicker={true} 
                displayBarcodes={false}
                healthcareService={ data.selectedHealthcareService }
                healthcareServiceId={ data.selectedHealthcareServiceId } 
                showHealthcareServiceInputs={true}
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
    <PageCanvas id="healthcareServicesPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default HealthcareServicesPage;