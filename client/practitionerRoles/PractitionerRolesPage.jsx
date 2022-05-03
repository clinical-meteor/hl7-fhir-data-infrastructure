import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

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

import PractitionerRoleDetail from './PractitionerRoleDetail';
import PractitionerRolesTable from './PractitionerRolesTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

// import { PractitionerRoles } from '../../lib/schemas/PractitionerRoles';


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


Session.setDefault('practitionerRolePageTabIndex', 0);
Session.setDefault('practitionerRoleSearchFilter', '');
Session.setDefault('selectedPractitionerRoleId', '');
Session.setDefault('selectedPractitionerRole', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('practitionerRolesArray', []);
Session.setDefault('PractitionerRolesPage.onePageLayout', true)
Session.setDefault('PractitionerRolesPage.defaultQuery', {})
Session.setDefault('PractitionerRolesTable.hideCheckbox', true)
Session.setDefault('PractitionerRolesTable.rolesIndex', 0)

Session.setDefault('practitionerRoleChecklistMode', false)


//===========================================================================
// MAIN COMPONENT  


export function PractitionerRolesPage(props){

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

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
    practitionerRoleChecklistMode: false,
    rolesIndex: 0
  };

  


  data.onePageLayout = useTracker(function(){
    return Session.get('PractitionerRolesPage.onePageLayout');
  }, [])
  data.hideCheckbox = useTracker(function(){
    return Session.get('PractitionerRolesTable.hideCheckbox');
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

  data.rolesIndex = useTracker(function(){
    return Session.get('PractitionerRolesTable.rolesIndex')
  }, []);

  function setPractitionerRolesIndex(newIndex){
    Session.set('PractitionerRolesTable.rolesIndex', newIndex)
  }
  

  function handleRowClick(practitionerRoleId){
    console.log('PractitionerRolesPage.handleRowClick', practitionerRoleId)
    let practitionerRole = PractitionerRoles.findOne({id: practitionerRoleId});

    if(practitionerRole){
      Session.set('selectedPractitionerRoleId', get(practitionerRole, 'id'));
      Session.set('selectedPractitionerRole', practitionerRole);
      Session.set('PractitionerRole.Current', practitionerRole);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "PractitionerRoleDetail");
        Session.set('mainAppDialogMaxWidth', "sm");
        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Role");
        } else {
          Session.set('mainAppDialogTitle', "View Role");
        }
      }      
    } else {
      console.log('No PractitionerRole found...')
    }
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

  // let [practitionerRolesIndex, setPractitionerRolesIndex] = setPage(0);


  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} scrollable >
      <CardHeader title={data.practitionerRoles.length + " Practitioner Roles"} />
      <CardContent>

        <PractitionerRolesTable 
          formFactorLayout={formFactor}
          practitionerRoles={ data.practitionerRoles }
          count={data.practitionerRoles.length}
          selectedPractitionerRoleId={ data.selectedPractitionerRoleId }
          onRowClick={ handleRowClick.bind(this) }
          hideCheckbox={data.hideCheckbox}
          hideStatus={false}
          hideName={false}
          hideTitle={false}
          hideVersion={false}
          hideExperimental={false}
          paginationLimit={10}     
          checklist={data.practitionerRoleChecklistMode}
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          onSetPage={function(index){
            setPractitionerRolesIndex(index)
          }}  
          page={data.rolesIndex}
          size="small"
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
              count={data.practitionerRoles.length}
              selectedPractitionerRoleId={ data.selectedPractitionerRoleId }
              hideCheckbox={data.hideCheckbox}
              hideIdentifier={true} 
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
              onSetPage={function(index){
                setPractitionerRolesIndex(index)
              }}  
              page={data.rolesIndex}
              size="medium"              
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


  return (
    <PageCanvas id="practitionerRolesPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default PractitionerRolesPage;