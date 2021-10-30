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

// import PractitionerRoleDetail from './PractitionerRoleDetail';
import PractitionerRolesTable from './PractitionerRolesTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';



//---------------------------------------------------------------
// Session Variables


Session.setDefault('practitionerRolePageTabIndex', 0);
Session.setDefault('practitionerRoleSearchFilter', '');
Session.setDefault('selectedPractitionerRoleId', '');
Session.setDefault('selectedPractitionerRole', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('practitionerRolesArray', []);
Session.setDefault('PractitionerRolesPage.onePageLayout', true)

//---------------------------------------------------------------
// Theming

const muiTheme = Theming.createMuiTheme();



//===========================================================================
// MAIN COMPONENT  

Session.setDefault('practitionerRoleChecklistMode', false)

export function PractitionerRolesPage(props){

  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    practitionerRoles: [],
    onePageLayout: true,
    practitionerRoleSearchFilter: '',
    options: {
      sort: {
        'focus.display': -1,
        lastModified: -1
      }
    },
    practitionerRoleChecklistMode: false
  };

  


  data.onePageLayout = useTracker(function(){
    return Session.get('PractitionerRolesPage.onePageLayout');
  }, [])
  data.selectedPractitionerRoleId = useTracker(function(){
    return Session.get('selectedPractitionerRoleId');
  }, [])
  data.selectedPractitionerRole = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedPractitionerRoleId'));
  }, [])
  data.practitionerRoles = useTracker(function(){
    let results = [];
    if(Session.get('practitionerRoleChecklistMode')){
      results = PractitionerRoles.find({
        'focus.display': "Patient Correction"
      }, {
        limit: 10,
        sort: {lastModified: -1}
      }).fetch();      
    } else {
      results = PractitionerRoles.find().fetch();
    }

    return results;
  }, [])
  data.practitionerRoleSearchFilter = useTracker(function(){
    return Session.get('practitionerRoleSearchFilter')
  }, [])
  data.practitionerRoleChecklistMode = useTracker(function(){
    return Session.get('practitionerRoleChecklistMode')
  }, [])


  function onCancelUpsertPractitionerRole(context){
    Session.set('practitionerRolePageTabIndex', 1);
  }
  function onDeletePractitionerRole(context){
    PractitionerRoles._collection.remove({_id: get(context, 'state.practitionerRoleId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('PractitionerRoles.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedPractitionerRoleId', '');
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "PractitionerRoles", recordId: context.state.practitionerRoleId});        
      }
    });
    Session.set('practitionerRolePageTabIndex', 1);
  }
  function onUpsertPractitionerRole(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new PractitionerRole...', context.state)

    if(get(context, 'state.practitionerRole')){
      let self = context;
      let fhirPractitionerRoleData = Object.assign({}, get(context, 'state.practitionerRole'));
  
      // if(process.env.NODE_ENV === "test") console.log('fhirPractitionerRoleData', fhirPractitionerRoleData);
  
      let practitionerRoleValidator = PractitionerRoleSchema.newContext();
      // console.log('practitionerRoleValidator', practitionerRoleValidator)
      practitionerRoleValidator.validate(fhirPractitionerRoleData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', practitionerRoleValidator.isValid())
        console.log('ValidationErrors: ', practitionerRoleValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.practitionerRoleId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating practitionerRole...");
        }

        delete fhirPractitionerRoleData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirPractitionerRoleData.resourceType = 'PractitionerRole';
  
        PractitionerRoles._collection.update({_id: get(context, 'state.practitionerRoleId')}, {$set: fhirPractitionerRoleData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("PractitionerRoles.insert[error]", error);
          
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "PractitionerRoles", recordId: context.state.practitionerRoleId});
            Session.set('selectedPractitionerRoleId', '');
            Session.set('practitionerRolePageTabIndex', 1);
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new practitionerRole...", fhirPractitionerRoleData);
  
        fhirPractitionerRoleData.effectiveDateTime = new Date();
        PractitionerRoles._collection.insert(fhirPractitionerRoleData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('PractitionerRoles.insert[error]', error);           
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "PractitionerRoles", recordId: context.state.practitionerRoleId});
            Session.set('practitionerRolePageTabIndex', 1);
            Session.set('selectedPractitionerRoleId', '');
          }
        });
      }
    } 
    Session.set('practitionerRolePageTabIndex', 1);
  }
  function handleRowClick(practitionerRoleId, foo, bar){
    console.log('PractitionerRolesPage.handleRowClick', practitionerRoleId)
    let practitionerRole = PractitionerRoles.findOne({id: practitionerRoleId});

    Session.set('selectedPractitionerRoleId', get(practitionerRole, 'id'));
    Session.set('selectedPractitionerRole', practitionerRole);
  }
  function onInsert(practitionerRoleId){
    Session.set('selectedPractitionerRoleId', '');
    Session.set('practitionerRolePageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "PractitionerRoles", recordId: practitionerRoleId});
  }
  function onCancel(){
    Session.set('practitionerRolePageTabIndex', 1);
  } 


  // console.log('PractitionerRolesPage.data', data)

  function handleChange(event, newValue) {
    Session.set('practitionerRolePageTabIndex', newValue)
  }


  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} scrollable >
      <CardHeader title={data.practitionerRoles.length + " Practitioner Roles"} />
      <CardContent>

        <PractitionerRolesTable 
          practitionerRoles={ data.practitionerRoles }
          hideCheckbox={false}
          hideStatus={false}
          hideName={false}
          hideTitle={false}
          hideVersion={false}
          hideExperimental={false}
          paginationLimit={10}     
          checklist={data.practitionerRoleChecklistMode}
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          count={data.practitionerRoles.length}
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.practitionerRoles.length + " Practitioner Roles"} />
          <CardContent>
            <PractitionerRolesTable 
              practitionerRoles={ data.practitionerRoles }
              selectedPractitionerRoleId={ data.selectedPractitionerRoleId }
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
              count={data.practitionerRoles.length}
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedPractitionerRoleId }</h1>
          {/* <CardHeader title={data.selectedPractitionerRoleId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <PractitionerRoleDetail 
                id='practitionerRoleDetails'                 
                displayDatePicker={true} 
                displayBarcodes={false}
                practitionerRole={ data.selectedPractitionerRole }
                practitionerRoleId={ data.selectedPractitionerRoleId } 
                showPractitionerRoleInputs={true}
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
    <PageCanvas id="practitionerRolesPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default PractitionerRolesPage;