import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { 
  Grid, 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Button,
  Tab, 
  Tabs,
  Typography,
  Box 
} from '@material-ui/core';
import styled from 'styled-components';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { StyledCard, PageCanvas } from 'fhir-starter';

import ProvenanceDetail from './ProvenanceDetail';
import ProvenancesTable from './ProvenancesTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

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


//=============================================================================================================================================
// SESSION VARIABLES

Session.setDefault('selectedProvenanceId', false);
Session.setDefault('fhirVersion', 'v1.0.2');

Session.setDefault('ProvenancesPage.onePageLayout', true)
Session.setDefault('ProvenancesPage.defaultQuery', {})
Session.setDefault('ProvenancesTable.hideCheckbox', true)
Session.setDefault('ProvenancesTable.provenancesIndex', 0)


//=============================================================================================================================================
// MAIN COMPONENT

export function ProvenancesPage(props){

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
  let noDataImage = get(Meteor, 'settings.public.defaults.noData.noDataImagePath', "packages/clinical_hl7-fhir-data-infrastructure/assets/NoData.png");  
  
  let data = {
    selectedProvenanceId: '',
    selectedProvenances: null,
    provenances: [],
    onePageLayout: true,
    provenancesIndex: 0
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('ProvenancesPage.onePageLayout');
  }, [])
  data.selectedProvenanceId = useTracker(function(){
    return Session.get('selectedProvenanceId');
  }, [])
  data.selectedProvenance = useTracker(function(){
    return Provenances.findOne(Session.get('selectedProvenanceId'));
  }, [])
  data.provenances = useTracker(function(){
    return Provenances.find().fetch();
  }, [])
  data.provenancesIndex = useTracker(function(){
    return Session.get('ProvenancesTable.provenancesIndex')
  }, [])

  if(process.env.NODE_ENV === "test") console.log('In ProvenancesPage render');

  function setProvenancesIndex(newIndex){
    Session.set('ProvenancesTable.provenancesIndex', newIndex)
  }
  

  function handleRowClick(provenanceId){
    console.log('ProvenancesPage.handleRowClick', provenanceId)
    let provenance = Provenances.findOne({id: provenanceId});

    if(provenance){
      Session.set('selectedProvenanceId', get(provenance, 'id'));
      Session.set('selectedProvenance', provenance);
      Session.set('Provenance.Current', provenance);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "ProvenanceDetail");
        Session.set('mainAppDialogMaxWidth', "sm");

        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Provenance");
        } else {
          Session.set('mainAppDialogTitle', "View Provenance");
        }
      }      
    } else {
      console.log('No provenance found...')
    }
  }


  let cardWidth = window.innerWidth - paddingWidth;
  let provenancesTitle = data.provenances.length + " Provenances";


  let layoutContent;
  if(data.provenances.length > 0){
    layoutContent = <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
      <CardHeader title={provenancesTitle} />
      <CardContent>
        <ProvenancesTable 
          formFactorLayout={formFactor}  
          provenances={data.provenances}
          count={data.provenances.length}
          selectedProvenanceId={ data.selectedProvenanceId }
          rowsPerPage={LayoutHelpers.calcTableRows()}
          onRowClick={ handleRowClick.bind(this) }
          tableRowSize="medium"
          hideCheckbox={data.hideCheckbox}
          onSetPage={function(index){
            setProvenancesIndex(index)
          }}  
          page={data.provenancesIndex}
        />
      </CardContent>
    </StyledCard>
  } else {
    layoutContent = <Container maxWidth="sm" style={{display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', height: '100%', justifyContent: 'center'}}>
      <img src={Meteor.absoluteUrl() + noDataImage} style={{width: '100%', marginTop: get(Meteor, 'settings.public.defaults.noData.marginTop', '-200px')}} />    
      <CardContent>
        <CardHeader 
          title={get(Meteor, 'settings.public.defaults.noData.defaultTitle', "No Data Available")} 
          subheader={get(Meteor, 'settings.public.defaults.noData.defaultMessage', "No records were found in the client data cursor.  To debug, check the data cursor in the client console, then check subscriptions and publications, and relevant search queries.  If the data is not loaded in, use a tool like Mongo Compass to load the records directly into the Mongo database, or use the FHIR API interfaces.")} 
        />
      </CardContent>
    </Container>
  }

  return (
    <PageCanvas id="provenancesPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContent }
      </MuiThemeProvider>
    </PageCanvas>
  );
}

export default ProvenancesPage;