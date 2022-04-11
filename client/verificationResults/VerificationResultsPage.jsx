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

import VerificationResultDetail from './VerificationResultDetail';
import VerificationResultsTable from './VerificationResultsTable';
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


Session.setDefault('verificationResultPageTabIndex', 0);
Session.setDefault('verificationResultSearchFilter', '');
Session.setDefault('selectedVerificationResultId', '');
Session.setDefault('selectedVerificationResult', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('verificationResultsArray', []);
Session.setDefault('VerificationResultsPage.onePageLayout', true)
Session.setDefault('VerificationResultsTable.hideCheckbox', true)

Session.setDefault('verificationResultChecklistMode', false)


//===========================================================================
// MAIN COMPONENT  


export function VerificationResultsPage(props){

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    verificationResults: [],
    onePageLayout: true,
    verificationResultSearchFilter: '',
    options: {
      sort: {
        'focus.display': -1,
        lastModified: -1
      }
    },
    verificationResultChecklistMode: false
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('VerificationResultsPage.onePageLayout');
  }, [])
  data.hideCheckbox = useTracker(function(){
    return Session.get('VerificationResultsTable.hideCheckbox');
  }, [])
  data.selectedVerificationResultId = useTracker(function(){
    return Session.get('selectedVerificationResultId');
  }, [])
  data.selectedVerificationResult = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedVerificationResultId'));
  }, [])
  data.verificationResults = useTracker(function(){
    let results = [];
    if(Session.get('verificationResultChecklistMode')){
      results = VerificationResults.find({
        'focus.display': "Patient Correction"
      }, {
        limit: 10,
        sort: {lastModified: -1}
      }).fetch();      
    } else {
      results = VerificationResults.find().fetch();
    }

    return results;
  }, [])
  data.verificationResultSearchFilter = useTracker(function(){
    return Session.get('verificationResultSearchFilter')
  }, [])
  data.verificationResultChecklistMode = useTracker(function(){
    return Session.get('verificationResultChecklistMode')
  }, [])

  function handleRowClick(verificationResultId){
    console.log('VerificationResultsPage.handleRowClick', verificationResultId)
    let verificationResult = VerificationResults.findOne({id: verificationResultId});

    if(verificationResult){
      Session.set('selectedVerificationResultId', get(verificationResult, 'id'));
      Session.set('selectedVerificationResult', verificationResult);
      Session.set('VerificationResult.Current', verificationResult);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "VerificationResultDetail");
        Session.set('mainAppDialogMaxWidth', "md");

        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit VerificationResult");
        } else {
          Session.set('mainAppDialogTitle', "View VerificationResult");
        }
      }      
    } else {
      console.log('No verificationResult found...')
    }
  }
  function handleChange(event, newValue) {
    Session.set('verificationResultPageTabIndex', newValue)
  }


  let [verificationResultsIndex, setVerificationResultsIndex] = setState(0);

  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} scrollable >
      <CardHeader title={data.verificationResults.length + " Verification Results"} />
      <CardContent>

        <VerificationResultsTable 
          formFactorLayout={formFactor}  
          verificationResults={ data.verificationResults }
          count={data.verificationResults.length}
          selectedVerificationResultId={ data.selectedVerificationResultId }
          hideCheckbox={data.hideCheckbox}
          hideStatus={false}
          hideName={false}
          hideTitle={false}
          hideVersion={false}
          hideExperimental={false}
          paginationLimit={10}     
          checklist={data.verificationResultChecklistMode}
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          onSetPage={function(index){
            setVerificationResultsIndex(index)
          }}    
          page={verificationResultsIndex}  
          onRowClick={ handleRowClick.bind(this) }
          size="small"
          
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.verificationResults.length + " Verification Results"} />
          <CardContent>
            <VerificationResultsTable 
              formFactorLayout={formFactor}  
              selectedVerificationResultId={ data.selectedVerificationResultId }
              verificationResults={ data.verificationResults }
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
              onSetPage={function(index){
                setVerificationResultsIndex(index)
              }}   
              page={verificationResultsIndex}         
              count={data.verificationResults.length}
              size="medium"
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedVerificationResultId }</h1>
          {/* <CardHeader title={data.selectedVerificationResultId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <VerificationResultDetail 
                id='verificationResultDetails'                 
                displayDatePicker={true} 
                displayBarcodes={false}
                verificationResult={ data.selectedVerificationResult }
                verificationResultId={ data.selectedVerificationResultId } 
                showVerificationResultInputs={true}
                showHints={false}

              />
            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  }

  return (
    <PageCanvas id="verificationResultsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default VerificationResultsPage;