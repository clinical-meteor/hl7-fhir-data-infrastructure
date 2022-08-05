
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

// import MedicationOrderDetail from './MedicationOrderDetail';
import MedicationOrdersTable from './MedicationOrdersTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { get, cloneDeep } from 'lodash';

import { StyledCard, PageCanvas } from 'fhir-starter';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


//=============================================================================================================================================
//=============================================================================================================================================

  // Global Theming 
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

Session.setDefault('medicationOrderPageTabIndex', 1); 
Session.setDefault('medicationOrderSearchFilter', ''); 
Session.setDefault('selectedMedicationOrderId', false);
Session.setDefault('selectedMedicationOrder', false)
Session.setDefault('MedicationOrdersPage.onePageLayout', true)
Session.setDefault('MedicationOrdersPage.defaultQuery', {})
Session.setDefault('MedicationOrdersTable.hideCheckbox', true)
Session.setDefault('MedicationOrdersTable.medicationOrdersIndex', 0)



//=============================================================================================================================================
// MEDICATION ORDER PAGE


export function MedicationOrdersPage(props){

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
  let noDataImage = get(Meteor, 'settings.public.defaults.noData.noDataImagePath', "packages/clinical_hl7-fhir-data-infrastructure/assets/NoData.png");  

  
  let data = {
    selectedMedicationOrderId: '',
    selectedMedicationOrder: null,
    medicationOrders: [],
    onePageLayout: true,
    showSystemIds: false,
    showFhirIds: false,
    medicationOrdersIndex: 1
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('MedicationOrdersPage.onePageLayout');
  }, [])
  data.selectedMedicationOrderId = useTracker(function(){
    return Session.get('selectedMedicationOrderId');
  }, [])
  data.selectedMedicationOrder = useTracker(function(){
    return MedicationOrders.findOne(Session.get('selectedMedicationOrderId'));
  }, [])
  data.medicationOrders = useTracker(function(){
    return MedicationOrders.find().fetch();
  }, [])
  data.medicationOrdersIndex = useTracker(function(){
    return Session.get('MedicationOrdersTable.medicationOrdersIndex')
  }, [])
  data.showSystemIds = useTracker(function(){
    return Session.get('showSystemIds');
  }, [])
  data.showFhirIds = useTracker(function(){
    return Session.get('showFhirIds');
  }, [])

  if(process.env.NODE_ENV === "test") console.log('In MedicationOrdersPage render');


  function setMedicationOrdersIndex(newIndex){
    Session.set('MedicationOrdersTable.medicationOrdersIndex', newIndex)
  }


  let layoutContent;
  if(data.medicationOrders.length > 0){
    layoutContent = <StyledCard height="auto" scrollable={true} margin={20} >
      <CardHeader title={data.medicationOrdersCount + ' Medication Orders'} />
      <CardContent>
        <MedicationOrdersTable 
          medicationOrders={data.medicationOrders}
          rowsPerPage={20}
          hideBarcodes={true}
          hidePatient={true}
          hideActionIcons={false}
          hideCheckbox={true}
          count={data.medicationOrdersCount}
          onSetPage={function(index){
            setMedicationOrdersIndex(index)
          }}      
          page={data.medicationOrdersIndex}                        
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
    <PageCanvas id="medicationOrdersPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContent }
      </MuiThemeProvider>
    </PageCanvas>
  );
}




export default MedicationOrdersPage;