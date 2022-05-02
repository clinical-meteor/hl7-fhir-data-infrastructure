import React, { useState } from 'react';
import PropTypes from 'prop-types';

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

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { StyledCard, PageCanvas } from 'fhir-starter';


// import CommunicationRequestDetail from './CommunicationRequestDetail';
import CommunicationRequestsTable from './CommunicationRequestsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { useTracker } from 'meteor/react-meteor-data';
import FhirDehydrator from '../../lib/FhirDehydrator';

import moment from 'moment';
import { get, set } from 'lodash';


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


//=============================================================================================================================================
// SESSION VARIABLES

let defaultCommunicationRequest = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};

Session.setDefault('communicationRequestFormData', defaultCommunicationRequest);
Session.setDefault('communicationRequestSearchFilter', '');
Session.setDefault('CommunicationRequestsTable.communicationRequestsPageIndex', 0)


//=============================================================================================================================================
// MAIN COMPONENT

export function CommunicationRequestPage(props){

  let data = {
    // communicationRequest: defaultCommunicationRequest,
    selectedCommunicationRequestId: '',
    currentCommunicationRequest: null,
    communicationRequests: [],
    communicationRequestsPageIndex: 0
  };

  if (Session.get('communicationRequestFormData')) {
    data.communicationRequest = Session.get('communicationRequestFormData');
  }
  if (Session.get('communicationRequestSearchFilter')) {
    data.communicationRequestSearchFilter = Session.get('communicationRequestSearchFilter');
  }
  if (Session.get("selectedCommunicationRequest")) {
    data.currentCommunicationRequest = Session.get("selectedCommunicationRequest");
  }

  data.selectedCommunicationRequestId = useTracker(function(){
    return Session.get('selectedCommunicationRequestId');
  }, [])
  data.selectedCommunicationRequest = useTracker(function(){
    return CommunicationRequests.findOne(Session.get('selectedCommunicationRequestId'));
  }, [])
  data.communicationRequests = useTracker(function(){
    return CommunicationRequests.find().fetch();
  }, [])
  data.communicationRequestsPageIndex = useTracker(function(){
    return Session.get('CommunicationRequestsTable.communicationRequestsPageIndex')
  }, [])


  function setCommunicationRequestsPageIndex(newIndex){
    Session.set('CommunicationRequestsTable.communicationRequestsPageIndex', newIndex)
  }

  function handleRowClick(communicationRequestId){
    console.log('CommunicationRequestsPage.handleRowClick', communicationRequestId)
    let communication = CommunicationRequests.findOne({id: communicationRequestId});

    if(communication){
      Session.set('selectedCommunicationRequestId', get(communication, 'id'));
      Session.set('selectedCommunicationRequest', communication);
      Session.set('CommunicationRequest.Current', communication);      

      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "CommunicationRequestDetail");
        Session.set('mainAppDialogMaxWidth', "sm");

        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Communication Request");
        } else {
          Session.set('mainAppDialogTitle', "View Communication Request");
        }

      }      
    } else {
      console.log('No communication found...')
    }
  }

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  // let [communicationRequestsPageIndex, setCommunicationRequestsPageIndex] = setState(0);

  return (
    <PageCanvas id="communicationRequestsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      {/* <CommunicationRequestDetail 
        id='newCommunicationRequest' /> */}

      <StyledCard height="auto" margin={20} >
        <CardHeader
          title={data.communicationRequests.length + " Communication Requests"}
        />
        <CardContent>
          <CommunicationRequestsTable 
            formFactorLayout={formFactor}  
            communicationRequests={data.communicationRequests}
            count={data.communicationRequests.length}
            selectedCommunicationRequestId={ data.selectedCommunicationRequestId }
            showBarcodes={true} 
            hideIdentifier={false}
            hideCheckbox={true}
            hideActionIcons={true}
            hideBarcode={false}                
            onRemoveRecord={function(recordId){
              CommunicationRequest.remove({_id: recordId})
            }}
            onSetPage={function(index){
              setCommunicationRequestsPageIndex(index)
            }}  
            onRowClick={ handleRowClick.bind(this) }
            actionButtonLabel="Enroll"
            rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
            page={data.communicationRequestsPageIndex}
            size="medium"
          />
        </CardContent>
      </StyledCard>
    </PageCanvas>
  );
}


export default CommunicationRequestPage;