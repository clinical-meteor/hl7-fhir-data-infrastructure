import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';


import { 
  CardHeader,
  CardContent,
  Grid
} from '@material-ui/core';
// import styled from 'styled-components';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import EndpointDetail from './EndpointDetail';
import EndpointsTable from './EndpointsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';



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


Session.setDefault('endpointPageTabIndex', 0);
Session.setDefault('endpointSearchFilter', '');
Session.setDefault('selectedEndpointId', '');
Session.setDefault('selectedEndpoint', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('endpointsArray', []);
Session.setDefault('EndpointsPage.onePageLayout', true)
Session.setDefault('EndpointsTable.hideCheckbox', true)
Session.setDefault('EndpointsTable.endpointsPageIndex', 0)

Session.setDefault('endpointChecklistMode', false)


//===========================================================================
// MAIN COMPONENT  


export function EndpointsPage(props){

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();


  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    endpoints: [],
    onePageLayout: true,
    hideCheckbox: true,
    endpointSearchFilter: '',
    options: {
      sort: {
        'focus.display': -1,
        lastModified: -1
      }
    },
    endpointChecklistMode: false,
    endpointsPageIndex: 0
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('EndpointsPage.onePageLayout');
  }, [])
  data.hideCheckbox = useTracker(function(){
    return Session.get('EndpointsTable.hideCheckbox');
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
  data.endpointsPageIndex = useTracker(function(){
    return Session.get('OrganizationsTable.endpointsPageIndex')
  }, [])


  function setEndpointsPageIndex(newIndex){
    Session.set('OrganizationsTable.endpointsPageIndex', newIndex)
  }

  
  function handleRowClick(endpointId){
    console.log('EndpointsPage.handleRowClick', endpointId)
    let endpoint = Endpoints.findOne({id: endpointId});

    if(endpoint){
      Session.set('selectedEndpointId', get(endpoint, 'id'));
      Session.set('selectedEndpoint', endpoint);
      Session.set('Endpoint.Current', endpoint);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "EndpointDetail");
        Session.set('mainAppDialogMaxWidth', "sm");

        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Endpoint");
        } else {
          Session.set('mainAppDialogTitle', "View Endpoint");
        }
      }      
    } else {
      console.log('No endpoint found...')
    }
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
          count={data.endpoints.length}
          hideCheckbox={data.hideCheckbox}
          selectedEndpointId={ data.selectedEndpointId }
          hideStatus={false}
          hideName={false}
          hideConnectionType={false}
          hideOrganization={false}
          hideAddress={false}    
          paginationLimit={10}     
          checklist={data.endpointChecklistMode}
          onRowClick={ handleRowClick.bind(this) }
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          onSetPage={function(index){
            setEndpointsPageIndex(index)
          }}                  
          page={data.endpointsPageIndex}
          size="small"
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
              count={data.endpoints.length}
              selectedEndpointId={ data.selectedEndpointId }
              hideIdentifier={true} 
              hideCheckbox={data.hideCheckbox}
              hideActionIcons={true}
              hideStatus={false}
              hideName={false}
              hideConnectionType={false}
              hideOrganization={false}
              hideAddress={false}    
              onRowClick={ handleRowClick.bind(this) }
              onSetPage={function(index){
                setEndpointsPageIndex(index)
              }}     
              page={data.endpointsPageIndex}                 
              rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
              size="medium"
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

  return (
    <PageCanvas id="endpointsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default EndpointsPage;