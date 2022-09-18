// =======================================================================
// Using DSTU2  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// https://www.hl7.org/fhir/DSTU2/allergyintolerance.html
//
//
// =======================================================================

import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { 
  Grid, 
  Container,
  CardHeader,
  CardContent,
  Button,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';
import { StyledCard, PageCanvas } from 'fhir-starter';

// import AllergyIntoleranceDetail from './AllergyIntoleranceDetail';
import AllergyIntolerancesTable from './AllergyIntolerancesTable';

import LayoutHelpers from '../../lib/LayoutHelpers';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import FhirDehydrator from '../../lib/FhirDehydrator';


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
// Session Variables

Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('selectedAllergyIntoleranceId', false);
Session.setDefault('selectedAllergyIntolerance', false);
Session.setDefault('allergyIntolerancePageTabIndex', 1); 
Session.setDefault('allergyIntoleranceSearchFilter', ''); 
Session.setDefault('AllergyIntolerancesPage.onePageLayout', true)
Session.setDefault('AllergyIntolerancesPage.defaultQuery', {})
Session.setDefault('AllergyIntolerancesTable.hideCheckbox', true)
Session.setDefault('DevicesTable.allergyIntolerancesIndex', 0)

//=============================================================================================================================================
// MAIN COMPONENT

export function AllergyIntolerancesPage(props){

  
  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
  let noDataImage = get(Meteor, 'settings.public.defaults.noData.noDataImagePath', "packages/clinical_hl7-fhir-data-infrastructure/assets/NoData.png");  
  
  let data = {
    allergyIntoleranceId: '',
    selectedAllergy: null,
    allergyIntolerances: [],
    onePageLayout: true,
    showSystemIds: false,
    showFhirIds: false,
    organizationsIndex: 0
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('AllergyIntolerancesPage.onePageLayout');
  }, [])
  data.hideCheckbox = useTracker(function(){
    return Session.get('AllergyIntolerancesTable.hideCheckbox');
  }, [])
  data.selectedAllergyIntoleranceId = useTracker(function(){
    return Session.get('selectedAllergyIntoleranceId');
  }, [])
  data.selectedAllergyIntolerance = useTracker(function(){
    return AllergyIntolerances.findOne({_id: Session.get('selectedAllergyIntoleranceId')});
  }, [])
  data.allergyIntolerances = useTracker(function(){
    return AllergyIntolerances.find().fetch();     
  }, [])
  data.allergyIntolerancesIndex = useTracker(function(){
    return Session.get('AllergyIntolerancesTable.allergyIntolerancesIndex')
  }, [])
  data.showSystemIds = useTracker(function(){
    return Session.get('showSystemIds');
  }, [])
  data.showFhirIds = useTracker(function(){
    return Session.get('showFhirIds');
  }, [])


  if(process.env.NODE_ENV === "test") console.log('In AllergyIntolerancesPage render');
  
  let cardWidth = window.innerWidth - paddingWidth;
  
  let layoutContent;
  if(data.allergyIntolerances.length > 0){
    layoutContent = <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
        <CardHeader title='Allergy Intolerances' />
        <CardContent>
          <AllergyIntolerancesTable 
            id='allergyIntolerancesTable' 
            fhirVersion={ data.fhirVersion } 
            allergyIntolerances={data.allergyIntolerances}
            count={data.allergyIntolerances.length}
            formFactorLayout={formFactor}
            page={data.allergyIntoleranceIndex}
            onSetPage={function(index){
              setAllergyIntolerancePageIndex(index)
            }}
            rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
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
    <PageCanvas id="allergyIntolerancesPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      { layoutContent }      
    </PageCanvas>
  );
}


export default AllergyIntolerancesPage;