import { 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography, 
  Box,
  Grid
} from '@material-ui/core';
import styled from 'styled-components';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React  from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import SearchParameterDetail from './SearchParameterDetail';
import SearchParametersTable from './SearchParametersTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

// import { SearchParameters } from '../../lib/schemas/SearchParameters';


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

//---------------------------------------------------------------
// Session Variables


Session.setDefault('searchParameterPageTabIndex', 0);
Session.setDefault('searchParameterSearchFilter', '');
Session.setDefault('selectedSearchParameterId', '');
Session.setDefault('selectedSearchParameter', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('searchParametersArray', []);
Session.setDefault('SearchParametersPage.onePageLayout', true)
Session.setDefault('SearchParametersTable.hideCheckbox', true)

Session.setDefault('searchParameterChecklistMode', false)


//===========================================================================
// MAIN COMPONENT  

export function SearchParametersPage(props){

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    searchParameters: [],
    onePageLayout: true,
    searchParameterSearchFilter: '',
    options: {
      sort: {
        'focus.display': -1,
        lastModified: -1
      }
    },
    searchParameterChecklistMode: false
  };

  


  data.onePageLayout = useTracker(function(){
    return Session.get('SearchParametersPage.onePageLayout');
  }, [])
  data.hideCheckbox = useTracker(function(){
    return Session.get('SearchParametersTable.hideCheckbox');
  }, [])
  data.selectedSearchParameterId = useTracker(function(){
    return Session.get('selectedSearchParameterId');
  }, [])
  data.selectedSearchParameter = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedSearchParameterId'));
  }, [])
  data.searchParameters = useTracker(function(){
    let results = [];
    if(Session.get('searchParameterChecklistMode')){
      results = SearchParameters.find({
        'focus.display': "Patient Correction"
      }, {
        limit: 10,
        sort: {lastModified: -1}
      }).fetch();      
    } else {
      results = SearchParameters.find().fetch();
    }

    return results;
  }, [])
  data.searchParameterSearchFilter = useTracker(function(){
    return Session.get('searchParameterSearchFilter')
  }, [])
  data.searchParameterChecklistMode = useTracker(function(){
    return Session.get('searchParameterChecklistMode')
  }, [])


  function onCancelUpsertSearchParameter(context){
    Session.set('searchParameterPageTabIndex', 1);
  }
  function onDeleteSearchParameter(context){
    SearchParameters._collection.remove({_id: get(context, 'state.searchParameterId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('SearchParameters.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedSearchParameterId', '');
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "SearchParameters", recordId: context.state.searchParameterId});        
      }
    });
    Session.set('searchParameterPageTabIndex', 1);
  }
  function onUpsertSearchParameter(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new SearchParameter...', context.state)

    if(get(context, 'state.searchParameter')){
      let self = context;
      let fhirSearchParameterData = Object.assign({}, get(context, 'state.searchParameter'));
  
      // if(process.env.NODE_ENV === "test") console.log('fhirSearchParameterData', fhirSearchParameterData);
  
      let searchParameterValidator = SearchParameterSchema.newContext();
      // console.log('searchParameterValidator', searchParameterValidator)
      searchParameterValidator.validate(fhirSearchParameterData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', searchParameterValidator.isValid())
        console.log('ValidationErrors: ', searchParameterValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.searchParameterId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating searchParameter...");
        }

        delete fhirSearchParameterData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirSearchParameterData.resourceType = 'SearchParameter';
  
        SearchParameters._collection.update({_id: get(context, 'state.searchParameterId')}, {$set: fhirSearchParameterData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("SearchParameters.insert[error]", error);
          
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "SearchParameters", recordId: context.state.searchParameterId});
            Session.set('selectedSearchParameterId', '');
            Session.set('searchParameterPageTabIndex', 1);
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new searchParameter...", fhirSearchParameterData);
  
        fhirSearchParameterData.effectiveDateTime = new Date();
        SearchParameters._collection.insert(fhirSearchParameterData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('SearchParameters.insert[error]', error);           
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "SearchParameters", recordId: context.state.searchParameterId});
            Session.set('searchParameterPageTabIndex', 1);
            Session.set('selectedSearchParameterId', '');
          }
        });
      }
    } 
    Session.set('searchParameterPageTabIndex', 1);
  }
  function handleRowClick(searchParameterId){
    console.log('SearchParametersPage.handleRowClick', searchParameterId)
    let searchParameter = SearchParameters.findOne({id: searchParameterId});

    if(searchParameter){
      Session.set('selectedSearchParameterId', get(searchParameter, 'id'));
      Session.set('selectedSearchParameter', searchParameter);
      Session.set('SearchParameter.Current', searchParameter);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "SearchParameterDetail");
        Session.set('mainAppDialogMaxWidth', "sm");

        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Search Parameter");
        } else {
          Session.set('mainAppDialogTitle', "View Search Parameter");
        }
      }      
    } else {
      console.log('No Search Parameter found...')
    }
  }
  function onInsert(searchParameterId){
    Session.set('selectedSearchParameterId', '');
    Session.set('searchParameterPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "SearchParameters", recordId: searchParameterId});
  }
  function onCancel(){
    Session.set('searchParameterPageTabIndex', 1);
  } 


  // console.log('SearchParametersPage.data', data)

  function handleChange(event, newValue) {
    Session.set('searchParameterPageTabIndex', newValue)
  }


  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} scrollable >
      <CardHeader title={data.searchParameters.length + " Search Parameters"} />
      <CardContent>

        <SearchParametersTable 
          formFactorLayout={formFactor}  
          searchParameters={ data.searchParameters }
          count={data.searchParameters.length}
          hideCheckbox={data.hideCheckbox}
          hideStatus={false}
          hideName={false}
          hideTitle={false}
          hideVersion={false}
          hideExperimental={false}
          paginationLimit={10}     
          checklist={data.searchParameterChecklistMode}
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          onRowClick={ handleRowClick.bind(this) }
          size="small"
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.searchParameters.length + " Search Parameters"} />
          <CardContent>
            <SearchParametersTable 
              searchParameters={ data.searchParameters }
              selectedSearchParameterId={ data.selectedSearchParameterId }
              count={data.searchParameters.length}
              hideCheckbox={data.hideCheckbox}
              hideIdentifier={true} 
              hideActionIcons={true}
              hideStatus={false}
              hideName={false}
              hideTitle={false}
              hideVersion={false}
              hideExperimental={false}    
              hideBarcode={true}
              onRowClick={ handleRowClick.bind(this) }
              rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
              size="medium"
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedSearchParameterId }</h1>
          {/* <CardHeader title={data.selectedSearchParameterId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <SearchParameterDetail 
                id='searchParameterDetails'                 
                displayDatePicker={true} 
                displayBarcodes={false}
                searchParameter={ data.selectedSearchParameter }
                searchParameterId={ data.selectedSearchParameterId } 
                showSearchParameterInputs={true}
                showHints={false}

              />
            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  }

  return (
    <PageCanvas id="searchParametersPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default SearchParametersPage;