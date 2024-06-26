import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { 
  Card,
  CardHeader,
  CardContent, 
  Container,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';


import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { StyledCard, PageCanvas } from 'fhir-starter';

import RelatedPersonDetail from './RelatedPersonDetail';
import RelatedPersonsTable from './RelatedPersonsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { get } from 'lodash';


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

Session.setDefault('RelatedPersonsPage.onePageLayout', true)
Session.setDefault('RelatedPersonsPage.defaultQuery', {name: {$not: ""}})
Session.setDefault('RelatedPersonsTable.hideCheckbox', true)
Session.setDefault('RelatedPersonsTable.personsIndex', 0)


//=============================================================================================================================================
// COMPONENT

function RelatedPersonsPage(props){
  
  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
  let noDataImage = get(Meteor, 'settings.public.defaults.noData.noDataImagePath', "packages/clinical_hl7-fhir-data-infrastructure/assets/NoData.png");  

  let data = {    
    selectedCarePlanId: null,
    relatedPersons: [],
    relatedPersonsIndex: 0
  };

  data.selectedCarePlanId = useTracker(function(){
    return Session.get('selectedCarePlanId');
  }, [])
  data.relatedPersons = useTracker(function(){
    return RelatedPersons.find().fetch();
  }, [])
  data.relatedPersonsIndex = useTracker(function(){
    return Session.get('RelatedPersonsTable.relatedPersonsIndex')
  }, [])

  function setRelatedPersonsIndex(newIndex){
    Session.set('RelatedPersonsTable.relatedPersonsIndex', newIndex)
  }

  function handleRowClick(relatedPersonId){
    console.log('RelatedPersonsPage.handleRowClick', relatedPersonId)
    let relatedPerson = RelatedPersons.findOne({id: relatedPersonId});

    if(relatedPerson){
      Session.set('selectedRelatedPersonId', get(relatedPerson, 'id'));
      Session.set('selectedRelatedPerson', relatedPerson);
      Session.set('RelatedPerson.Current', relatedPerson);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "RelatedPersonDetail");
        Session.set('mainAppDialogMaxWidth', "sm");

        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Person");
        } else {
          Session.set('mainAppDialogTitle', "View Person");
        }
      }      
    } else {
      console.log('No related person found...')
    }
  }

  let cardWidth = window.innerWidth - paddingWidth;

  let layoutContent;
  if(data.relatedPersons.length > 0){
    layoutContent = <StyledCard height='auto' width={cardWidth + 'px'} margin={20} >
      <CardHeader title={ data.relatedPersons.length + ' Related Persons'} />
      <CardContent>
        <RelatedPersonsTable 
          formFactorLayout={formFactor}  
          relatedPersons={ data.relatedPersons}
          count={ data.relatedPersons.length}
          hideCheckbox={data.hideCheckbox}
          onRowClick={ handleRowClick.bind(this) }
          selectedRelatedPersonId={ data.selectedRelatedPersonId }
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          onSetPage={function(index){
            setRelatedPersonsIndex(index)
          }}  
          page={data.relatedPersonsIndex}
          size="medium"
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
    <PageCanvas id='relatedPersonsPage' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      { layoutContent }
    </PageCanvas>
  );
}


export default RelatedPersonsPage;