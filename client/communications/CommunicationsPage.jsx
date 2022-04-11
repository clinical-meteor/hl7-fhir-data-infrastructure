import React, { useState }  from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { 
  Grid,
  CardHeader,
  CardContent
} from '@material-ui/core';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { StyledCard, PageCanvas } from 'fhir-starter';

import CommunicationDetail from './CommunicationDetail';
import CommunicationsTable from './CommunicationsTable';

import moment from 'moment';
import { get, cloneDeep } from 'lodash';

import LayoutHelpers from '../../lib/LayoutHelpers';




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
// STATIC DATA??

let defaultCommunication = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};

//=============================================================================================================================================
// SESSION VARIABLES


Session.setDefault('communicationSearchFilter', '');

Session.setDefault('communicationPageTabIndex', 0);
Session.setDefault('communicationSearchFilter', '');
Session.setDefault('selectedCommunicationId', '');
Session.setDefault('selectedCommunication', false);
Session.setDefault('CommunicationsPage.onePageLayout', true)
Session.setDefault('CommunicationsTable.hideCheckbox', true)



//=============================================================================================================================================
// MAIN COMPONENT

export function CommunicationsPage(props){

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();


  let data = {   
    onePageLayout: true,
    hideCheckbox: true,
    communication: defaultCommunication,
    selectedCommunication: null,
    selectedCommunicationId: ''
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('CommunicationsPage.onePageLayout');
  }, [])
  data.hideCheckbox = useTracker(function(){
    return Session.get('CommunicationsTable.hideCheckbox');
  }, [])
  data.selectedCommunicationId = useTracker(function(){
    return Session.get('selectedCommunicationId');
  }, [])
  data.selectedCommunication = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedCommunicationId'));
  }, [])
  data.communications = useTracker(function(){
    return Communications.find().fetch();
  }, [])

  function handleRowClick(communicationId){
    console.log('CommunicationsPage.handleRowClick', communicationId)
    let communication = Communications.findOne({id: communicationId});

    if(communication){
      Session.set('selectedCommunicationId', get(communication, 'id'));
      Session.set('selectedCommunication', communication);
      Session.set('Communication.Current', communication);      

      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "CommunicationDetail");
        Session.set('mainAppDialogMaxWidth', "sm");

        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Communication");
        } else {
          Session.set('mainAppDialogTitle', "View Communication");
        }
      }      
    } else {
      console.log('No communication found...')
    }
  }

  let [communicationsPageIndex, setCommunicationsPageIndex] = setState(0);

  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} >
      <CardHeader title={data.communications.length + " Communication Log Entries"} />
      <CardContent>
        <CommunicationsTable 
          formFactorLayout={formFactor}  
          communications={data.communications}
          count={data.communications.length}
          hideCheckbox={data.hideCheckbox}
          selectedCommunicationId={ data.selectedCommunicationId }
          hideIdentifier={true}
          hideActionIcons={true}
          hideBarcode={false} 
          onRemoveRecord={function(recordId){
            Communications.remove({_id: recordId})
          }}
          onSetPage={function(index){
            setCommunicationsPageIndex(index)
          }}    
          onRowClick={ handleRowClick.bind(this) }
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          page = {communicationsPageIndex}
          actionButtonLabel="Enroll"
          size="small"
        />
      </CardContent>
    </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.communications.length + " Communication Log Entries"} />
          <CardContent>
            <CommunicationsTable 
              formFactorLayout={formFactor}  
              communications={data.communications}
              count={data.communications.length}
              selectedCommunicationId={ data.selectedCommunicationId }
              hideCheckbox={data.hideCheckbox}
              hideIdentifier={true}
              hideActionIcons={true}
              hideBarcode={false} 
              onRemoveRecord={function(recordId){
                Communications.remove({_id: recordId})
              }}
              onSetPage={function(index){
                setCommunicationsPageIndex(index)
              }}    
              onRowClick={ handleRowClick.bind(this) }
              rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
              page = {communicationsPageIndex}
              actionButtonLabel="Enroll"
              size="medium"
            />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedCareTeamId }</h1>
          {/* <CardHeader title={data.selectedCareTeamId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <CommunicationDetail 
                id='communicationDetails'                 
                communication={ data.selectedCommunication }
                communicationId={ data.selectedCommunicationId } 
              />
            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  }
  return (
    <PageCanvas id="communicationsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider> 
    </PageCanvas>
  );
}



export default CommunicationsPage;