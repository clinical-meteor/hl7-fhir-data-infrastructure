import { 
  Divider,
  Card,
  Checkbox,
  CardHeader,
  CardContent,
  Button,
  Tab, 
  Tabs,
  Typography,
  Box,
  Grid
} from '@material-ui/core';

import { StyledCard, PageCanvas } from 'fhir-starter';

import LocationDetail from './LocationDetail';
import LocationsTable from './LocationsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
// import { Locations } from '../../lib/schemas/Locations';

import { get } from 'lodash';

//=============================================================================================================================================
// Session Variables

Session.setDefault('locationPageTabIndex', 1); 
Session.setDefault('locationSearchFilter', ''); 
Session.setDefault('shapefileDataLayer', false);
Session.setDefault('tspRoute', []);
Session.setDefault('mortalityLayer', true);
Session.setDefault('proximityDistance', '5000');
Session.setDefault('priximityLocations', false);

Session.setDefault('selectedLocation', null);
Session.setDefault('selectedLocationId', false);
Session.setDefault('LocationsPage.onePageLayout', true)
Session.setDefault('LocationsTable.hideCheckbox', true)
Session.setDefault('LocationsTable.locationsPageIndex', 0)




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
// MAIN COMPONENT

export function LocationsPage(props){
  let data = {
    style: {
      page: {
        position: 'fixed',
        top: '0px',
        left: '0px',
        height: Session.get('appHeight'),
        width: Session.get('appWidth')
      },
      canvas: {
        left: '0px',
        top: '0px',
        position: 'fixed'
      }
    },
    selectedLocationId: '',
    selectedLocation: null,
    locations: [],
    onePageLayout: false,
    locationsPageIndex: 0
  };

  data.style.page.height = useTracker(function(){
    return Session.get('appHeight');
  }, [])
  data.style.page.width = useTracker(function(){
    return Session.get('appWidth');
  }, [])

  data.onePageLayout = useTracker(function(){
    return Session.get('LocationsPage.onePageLayout');
  }, [])
  data.hideCheckbox = useTracker(function(){
    return Session.get('LocationsTable.hideCheckbox');
  }, [])
  data.selectedLocationId = useTracker(function(){
    return Session.get('selectedLocationId');
  }, [])
  data.selectedLocation = useTracker(function(){
    return Locations.findOne(Session.get('selectedLocationId'));
  }, [])
  data.locations = useTracker(function(){
    return Locations.find().fetch();
  }, [])
  data.locationsPageIndex = useTracker(function(){
    return Session.get('LocationsTable.locationsPageIndex')
  }, [])

  function setLocationsPageIndex(newIndex){
    Session.set('LocationsTable.locationsPageIndex', newIndex)
  }


  function handleRowClick(locationId){
    console.log('LocationsPage.handleRowClick', locationId)
    let location = Locations.findOne({id: locationId});

    if(location){
      Session.set('selectedLocationId', get(location, 'id'));
      Session.set('selectedLocation', location);
      Session.set('Location.Current', location);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "LocationDetail");
        Session.set('mainAppDialogTitle', "Edit Location");
        Session.set('mainAppDialogMaxWidth', "sm");
      }      
    }
  }


  let self = this;
  let markers = [];

  const rowsPerPage = get(Meteor, 'settings.public.defaults.rowsPerPage', 20);

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();



  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" scrollable={true} margin={20}  >
      <CardHeader
        title="Locations"
      />
      <CardContent>
        <LocationsTable 
          locations={data.locations}
          rowsPerPage={ LayoutHelpers.calcTableRows("medium", data.style.page.height) }
          tableRowSize="medium"
          hideCheckbox={data.hideCheckbox}
          count={data.locations.length}  
          onRowClick={ handleRowClick.bind(this) }    
          onSetPage={function(index){
            setLocationsPageIndex(index)
          }}     
          page={data.locationsPageIndex}                   
        />
      </CardContent>
    </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" scrollable={true} margin={20} >
          <CardHeader
            title="Locations"
          />
          <CardContent>
            <LocationsTable 
              locations={data.locations}
              rowsPerPage={ LayoutHelpers.calcTableRows("medium", data.style.page.height) }
              hideCheckbox={data.hideCheckbox}
              onSetPage={function(index){
                setLocationsPageIndex(index)
              }}          
              page={data.locationsPageIndex}                                     
              count={data.locations.length}   
              onRowClick={ handleRowClick.bind(this) }    
            />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20}  scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedMeasureReportId }</h1>
          <CardContent>
            <CardContent>
              {/* <LocationDetail 

              />                 */}
            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  }

        
  return (
    <PageCanvas id="locationsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}



export default LocationsPage;