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
import React  from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

// import EncounterDetail from './EncounterDetail';
import EncountersTable from './EncountersTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';


//=============================================================================================================================================
// SESSION VARIABLES

Session.setDefault('encounterPageTabIndex', 0);
Session.setDefault('encounterSearchFilter', '');
Session.setDefault('selectedEncounterId', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('encountersArray', []);

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

export function EncountersPage(props){

  let data = {
    selectedEncounterId: '',
    selectedEncounter: null,
    encounters: []
  };

  data.selectedEncounterId = useTracker(function(){
    return Session.get('selectedEncounterId');
  }, [])
  data.selectedEncounter = useTracker(function(){
    return Encounters.findOne(Session.get('selectedEncounterId'));
  }, [])
  data.encounters = useTracker(function(){
    return Encounters.find().fetch();
  }, [])

  
  const rowsPerPage = get(Meteor, 'settings.public.defaults.rowsPerPage', 20);

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
  
  let cardWidth = window.innerWidth - paddingWidth;

  return (
    <PageCanvas id="encountersPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
            <CardHeader
              title={ data.encounters.length + " Encounters"}
            />
            <CardContent>
              <EncountersTable 
                hideIdentifier={true} 
                hideCheckboxes={true} 
                hideSubjects={false}
                actionButtonLabel="Send"
                hideSubjects={false}
                hideClassCode={false}
                hideReasonCode={false}
                hideReason={false}
                hideHistory={false}
                encounters={ data.encounters }
                rowsPerPage={rowsPerPage}
                count={data.encountersCount}      
                showMinutes={true}
                hideActionIcons={true}
                hideBarcode={false}
                rowsPerPage={LayoutHelpers.calcTableRows()}
                />
            </CardContent>
          </StyledCard>
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default EncountersPage;