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

// import ProvenanceDetail from './ProvenanceDetail';
import ProvenancesTable from './ProvenancesTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import React  from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

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
//=============================================================================================================================================



Session.setDefault('selectedProvenanceId', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('ProvenancesPage.onePageLayout', true)

export function ProvenancesPage(props){
  let data = {
    selectedProvenanceId: '',
    selectedProvenances: null,
    procedures: [],
    onePageLayout: true
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
  data.procedures = useTracker(function(){
    return Provenances.find().fetch();
  }, [])

  if(process.env.NODE_ENV === "test") console.log('In ProvenancesPage render');

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let cardWidth = window.innerWidth - paddingWidth;
  let proceduresTitle = data.procedures.length + " Provenances";

  return (
    <PageCanvas id="proceduresPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
          <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
            <CardHeader title={proceduresTitle} />
            <CardContent>
              <ProvenancesTable 
                procedures={data.procedures}
                count={data.procedures.length}
                rowsPerPage={25}
                tableRowSize="medium"
                formFactorLayout={formFactor}
                rowsPerPage={LayoutHelpers.calcTableRows()}
                />
            </CardContent>
          </StyledCard>
      </MuiThemeProvider>
    </PageCanvas>
  );
}

export default ProvenancesPage;