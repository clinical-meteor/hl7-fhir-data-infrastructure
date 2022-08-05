import React, { useState }  from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

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
// SESSION VARIABLES

Session.setDefault('documentReferencePageTabIndex', 1); 
Session.setDefault('documentReferenceSearchFilter', ''); 
Session.setDefault('selectedDocumentReferenceId', false);
Session.setDefault('selectedDocumentReference', false)
Session.setDefault('DocumentReferencesPage.onePageLayout', true)
Session.setDefault('DocumentReferencesPage.defaultQuery', {})
Session.setDefault('DocumentReferencesTable.hideCheckbox', true)
Session.setDefault('DocumentReferencesTable.documentReferencesIndex', 0)


//=============================================================================================================================================
// COMPONENTS

export function DocumentReferencesPage(props){
  if(process.env.NODE_ENV === "test") console.log('In DocumentReferencesPage render');

  let data = {
    selectedDocumentReferenceId: '',
    selectedDocumentReference: false,
    documentReferences: [],
    onePageLayout: false,
    showSystemIds: false,
    showFhirIds: false,
    documentReferencesIndex: 0,
    hasRestrictions: false

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
  data.documentReferencesIndex = useTracker(function(){
    return Session.get('DocumentReferencesTable.documentReferencesIndex')
  }, [])
  data.showSystemIds = useTracker(function(){
    return Session.get('showSystemIds');
  }, [])
  data.showFhirIds = useTracker(function(){
    return Session.get('showFhirIds');
  }, [])


  function handleRowClick(){

  }
  function setDocumentReferenceIndex(newIndex){
    Session.set('DocumentReferencesTable.documentReferencesIndex', newIndex)
  }

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
  let noDataImage = get(Meteor, 'settings.public.defaults.noData.noDataImagePath', "packages/clinical_hl7-fhir-data-infrastructure/assets/NoData.png");  
  

  let layoutContent;
  if(data.documentReferences.length > 0){
    if(data.onePageLayout){
      layoutContent = <StyledCard height="auto" margin={20} >
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
            onSetPage={function(index){
              setDocumentReferenceIndex(index)
            }}                
            page={data.documentReferencesIndex}
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
                onSetPage={function(index){
                  setDocumentReferenceIndex(index)
                }}           
                page={data.documentReferencesIndex}
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
    <PageCanvas id="documentReferencesPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContent }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default DocumentReferencesPage;