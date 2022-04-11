import React from 'react';

import { 
  Card,
  CardHeader,
  CardContent,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';
import PropTypes from 'prop-types';


import { PatientsTable, PatientDetail, PageCanvas, StyledCard } from 'fhir-starter';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { useTracker } from 'meteor/react-meteor-data';

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
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('patientPageTabIndex', 0)

//===========================================================================
// MAIN COMPONENT  

export function PatientsPage(props){

  let data = {
    selectedPatientId: '',
    selectedPatient: null,
    patients: [],
    onePageLayout: true
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('PatientsPage.onePageLayout');
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

  // function onTableRowClick(patientId){
  //   console.log('onTableRowClick', patientId);

  //   Session.set('selectedPatientId', patientId);
  //   Session.set('selectedPatient', Patients.findOne({id: patientId}));

  //   if(has(Meteor, 'settings.public.modules.fhir.Patient.openUrlOnRowClick')){
  //     props.history.replace(get(Meteor, 'settings.public.modules.fhir.Patient.openUrlOnRowClick', '/'))
  //   }
  // }

  // Patients.find().forEach(function(patient){
  //   data.dataCursors.push({
  //     Patients: (typeof Patients !== "undefined") ? Patients.find({id: patient.id}).count() : 0,
  //     AllergyIntolerances: (typeof AllergyIntolerances !== "undefined") ? AllergyIntolerances.find({id: patient.id}).count() : 0,
  //     Conditions: (typeof Conditions !== "undefined") ? Conditions.find({id: patient.id}).count() : 0,
  //     CarePlans: (typeof CarePlans !== "undefined") ? CarePlans.find({id: patient.id}).count() : 0,
  //     Devices: (typeof Devices !== "undefined") ? Devices.find({id: patient.id}).count() : 0,
  //     Encounters: (typeof Encounters !== "undefined") ? Encounters.find({'patient.reference': 'Patient/' + patient.id}).count() : 0,
  //     Immunizations: (typeof Immunizations !== "undefined") ? Immunizations.find({id: patient.id}).count() : 0,
  //     Medications: (typeof Medications !== "undefined") ? Medications.find({id: patient.id}).count() : 0,
  //     MedicationOrders: (typeof MedicationOrders !== "undefined") ? MedicationOrders.find({id: patient.id}).count() : 0,
  //     MedicationStatements: (typeof MedicationStatements !== "undefined") ? MedicationStatements.find({id: patient.id}).count() : 0,
  //     Observations: (typeof Observations !== "undefined") ? Observations.find({'subject.reference': 'Patient/' + patient.id}).count() : 0,
  //     Organizations: (typeof Organizations !== "undefined") ? Organizations.find({id: patient.id}).count() : 0,
  //     Persons: (typeof Persons !== "undefined") ? Persons.find({id: patient.id}).count() : 0,
  //     Practitioners: (typeof Practitioners !== "undefined") ? Practitioners.find({id: patient.id}).count() : 0,
  //     RelatedPersons: (typeof RelatedPersons !== "undefined") ? RelatedPersons.find({id: patient.id}).count() : 0,
  //     Procedures: (typeof Procedures !== "undefined") ? Procedures.find({'subject.reference': 'Patient/' + patient.id}).count() : 0
  //   })
  // })

  // const rowsPerPage = get(Meteor, 'settings.public.defaults.rowsPerPage', 25);

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
  
  let cardWidth = window.innerWidth - paddingWidth;
  
  let [patientsIndex, setPatientsIndex] = setState(0);

  return (
    <PageCanvas id="patientsPageClass" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
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
              page={patientsIndex}
              formFactorLayout={formFactor}    
              rowsPerPage={LayoutHelpers.calcTableRows()}      
              logger={window.logger ? window.logger : null}
            />   
          </CardContent>
        </StyledCard>                

      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default PatientsPage;


