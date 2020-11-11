import React from 'react';
import PropTypes from 'prop-types';

import { 
  CssBaseline,
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
import { StyledCard, PageCanvas } from 'material-fhir-ui';

import { useTracker, DynamicSpacer, Bundles } from 'meteor/clinical:hl7-fhir-data-infrastructure';


import moment from 'moment';
import { get, has } from 'lodash';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

// import { Bundles } from '../lib/Bundles.js';

// import BundleDetail from './BundleDetail';
import BundlesTable from './BundlesTable';

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
// Session Variables  


let defaultBundle = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};
Session.setDefault('bundleFormData', defaultBundle);
Session.setDefault('bundleSearchFilter', '');
Session.setDefault('selectedBundleId', false);
Session.setDefault('fhirVersion', 'v1.0.2');



function BundlesPage(props){

  let bundles = [];

  bundles = useTracker(function(){
    return Bundles.find().fetch();
  }, [])

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();

  let paddingWidth = 84;
  if(Meteor.isCordova){
    paddingWidth = 20;
  }
  let cardWidth = window.innerWidth - paddingWidth;


  let bundleSummary = {};

  let selectedBundle = Session.get('selectedBundle');

  if(Array.isArray(get(selectedBundle, 'entry'))){
    selectedBundle.entry.forEach(function(entry){
      if(has(entry, 'resource.resourceType')){
        if(bundleSummary[entry.resource.resourceType]){
          bundleSummary[entry.resource.resourceType]++;
        } else {
          bundleSummary[entry.resource.resourceType] = 1
        }
      }
    })  
    // console.log('bundleSummary', bundleSummary)
  }
  
  let bundleOutput = [];

  Object.keys(bundleSummary).forEach(function(key){
    bundleOutput.push(<div><h4>{bundleSummary[key]} {key}</h4></div>)
  })


  return(
    <PageCanvas id="bundlesPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        <Grid container spacing={3}>
          <Grid item md={6}>
            <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
              <CardHeader
                title="Bundles"
              />
              <CardContent>
                <BundlesTable 
                  showBarcodes={true} 
                  showAvatars={true} 
                  noDataMessagePadding={100}
                  bundles={bundles}
                  onRowClick={function(bundelId){
                    console.log('Clicked on a row.  Bundle Id: ' + bundelId)
                    Session.set('selectedBundleId', bundelId)
                    Session.set('selectedBundle', Bundles.findOne({_id: bundelId}))
                  }}
                  formFactorLayout={formFactor}
                  />
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item md={6}>
            <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
              <CardHeader
                title="Bundle Contents"
              />
              <CardContent>
                {/* <code>{JSON.stringify(bundleSummary)}</code> */}
                { bundleOutput }
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
       
      </MuiThemeProvider> 
    </PageCanvas >
  )
}
export default BundlesPage;