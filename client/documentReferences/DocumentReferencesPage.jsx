import React, { useState }  from 'react';
import { useTracker } from 'meteor/react-meteor-data';
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

// import DocumentReferenceDetail from './DocumentReferenceDetail';
import DocumentReferencesTable from './DocumentReferencesTable';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { get } from 'lodash';

import { StyledCard, PageCanvas } from 'fhir-starter';

import LayoutHelpers from '../../lib/LayoutHelpers';


//=============================================================================================================================================
// Session Variables

Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('selectedDocumentReferenceId', false);
Session.setDefault('DocumentReferencesPage.onePageLayout', true)
Session.setDefault('selectedDocumentReferenceId', '');
Session.setDefault('selectedDocumentReference', false);

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
// COMPONENTS

export function DocumentReferencesPage(props){
  if(process.env.NODE_ENV === "test") console.log('In DocumentReferencesPage render');

  let data = {
    selectedDocumentReferenceId: '',
    selectedDocumentReference: false,
    documentReferences: [],
    onePageLayout: false
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('DocumentReferencesPage.onePageLayout');
  }, [])
  data.selectedDocumentReferenceId = useTracker(function(){
    return Session.get('selectedDocumentReferenceId');
  }, [])
  data.selectedDocumentReference = useTracker(function(){
    return DocumentReferences.findOne({id: Session.get('selectedDocumentReferenceId')});
  }, [])
  data.documentReferences = useTracker(function(){
    return DocumentReferences.find().fetch()
  }, [])


  function handleRowClick(){

  }


  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
  
  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} >
      <CardHeader title={data.documentReferences.length + " Documents"} />
      <CardContent>

        <DocumentReferencesTable 
          documentReferences={ data.documentReferences }
          hideCheckbox={true} 
          hideActionIcons={true}
          hideIdentifier={true}           
          hideBarcode={false}
          paginationLimit={10}     
          onRowClick={ handleRowClick.bind(this) }
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          count={data.documentReferences.length}
          formFactorLayout={formFactor}
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.documentReferences.length + " Documents"} />
          <CardContent>
            <DocumentReferencesTable 
              documentReferences={ data.documentReferences }
              hideCheckbox={true} 
              hideActionIcons={true}
              hideIdentifier={true}           
              hideBarcode={false}
              paginationLimit={10}     
              onRowClick={ handleRowClick.bind(this) }
              rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
              count={data.documentReferences.length}
              formFactorLayout={formFactor}
            />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedMeasureId }</h1>
          {/* <CardHeader title={data.selectedMeasureId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <pre>
                { JSON.stringify(data.selectedTask, null, 2) }
              </pre>
            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  }

  
  return (
    <PageCanvas id="documentReferencesPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default DocumentReferencesPage;