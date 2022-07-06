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
import PropTypes from 'prop-types';


import { PatientsTable, PatientDetail, PageCanvas, StyledCard } from 'fhir-starter';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { get, has, set } from 'lodash';

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



  


import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';


let defaultPatient = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};

//===========================================================================
// SESSION VARIABLES

Session.setDefault('patientFormData', defaultPatient);
Session.setDefault('patientSearchFilter', '');
Session.setDefault('selectedPatientId', '');
Session.setDefault('selectedPatient', '');
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('patientPageTabIndex', 0)
Session.setDefault('PatientsPage.onePageLayout', true)
Session.setDefault('PatientsPage.defaultQuery', {})
Session.setDefault('PatientsTable.hideCheckbox', true)
Session.setDefault('PatientsTable.patientsIndex', 0)


//===========================================================================
// MAIN COMPONENT  

export function PatientsPage(props){

  let data = {
    selectedPatientId: '',
    selectedPatient: null,
    patients: [],
    onePageLayout: true,
    showSystemIds: false,
    showFhirIds: false,
    organizationsIndex: 0
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('PatientsPage.onePageLayout');
  }, [])
  data.hideCheckbox = useTracker(function(){
    return Session.get('PatientsTable.hideCheckbox');
  }, [])
  data.selectedPatientId = useTracker(function(){
    return Session.get('selectedPatientId');
  }, [])
  data.selectedPatient = useTracker(function(){
    return Patients.findOne({_id: Session.get('selectedPatientId')});
  }, [])
  data.patients = useTracker(function(){
    return Patients.find().fetch();
  }, [])
  data.patientsIndex = useTracker(function(){
    return Session.get('PatientsTable.patientsIndex')
  }, [])
  data.showSystemIds = useTracker(function(){
    return Session.get('showSystemIds');
  }, [])
  data.showFhirIds = useTracker(function(){
    return Session.get('showFhirIds');
  }, [])

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
  
  let cardWidth = window.innerWidth - paddingWidth;
  let noDataImage = get(Meteor, 'settings.public.defaults.noData.noDataImagePath', "packages/clinical_hl7-fhir-data-infrastructure/assets/NoData.png");  


  let layoutContent;
  if(data.patients.length > 0){
    layoutContent = <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
      <CardHeader title={data.patients.length + " Patients"} />
      <CardContent>
        <PatientsTable 
          noDataMessagePadding={100}
          patients={ data.patients }
          count={data.patients.length}
          rowClickMode="id"
          onRowClick={function(patientId){
            console.log('onTableRowClick', patientId);

            Session.set('selectedPatientId', patientId);
            Session.set('selectedPatient', Patients.findOne({id: patientId}));

            console.log('openUrlOnRowClick', get(Meteor, 'settings.public.modules.fhir.Patients.openUrlOnRowClick', ''))
            if(get(Meteor, 'settings.public.modules.fhir.Patients.openUrlOnRowClick')){
              props.history.replace(get(Meteor, 'settings.public.modules.fhir.Patients.openUrlOnRowClick', '/'))
            }
          }}
          onSetPage={function(index){
            setPatientsIndex(index)
          }}
          page={data.patientsIndex}
          formFactorLayout={formFactor}    
          rowsPerPage={LayoutHelpers.calcTableRows()}      
          logger={window.logger ? window.logger : null}
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
    <PageCanvas id="patientsPageClass" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContent }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default PatientsPage;


