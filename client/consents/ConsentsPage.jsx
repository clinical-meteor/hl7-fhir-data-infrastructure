import { 
  Grid, 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Button,
  Dialog,
  TextField
} from '@material-ui/core'; 



// import ConsentDetail from './ConsentDetail';
import ConsentsTable from './ConsentsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React, { useEffect, useState }  from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, set } from 'lodash';


let defaultConsent = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};


//=============================================================================================================================================
// SESSION VARIABLES


Session.setDefault('consentFormData', defaultConsent);
Session.setDefault('consentSearchFilter', '');
Session.setDefault('consentSearchQuery', {});
Session.setDefault('consentDialogOpen', false);
Session.setDefault('selectedConsentId', false);
Session.setDefault('fhirVersion', 'v1.0.2');




//===============================================================================================================
// Global Theming 
// This is necessary for the Material UI component render layer

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


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

export function ConsentsPage(props){


  //---------------------------------------------------------------------------------------------------------
  // State

  let data = {
    tabIndex: Session.get('consentPageTabIndex'),
    consent: defaultConsent,
    consentSearchFilter: '',
    currentConsent: null,
    consentSearchQuery: {},
    dialogOpen: Session.get('consentDialogOpen'), 
    selectedConsentId: Session.get('selectedConsentId'),
    selectedConsent: false,
    consents: []
  };


  //---------------------------------------------------------------------------------------------------------
  // Trackers

  data.consent = useTracker(function(){
    return Session.get('consentFormData');
  })
  data.consentSearchFilter = useTracker(function(){
    return Session.get('consentSearchFilter');
  })
  data.consentSearchFilter = useTracker(function(){
    return Session.get('consentSearchFilter');
  })
  data.consentSearchQuery = useTracker(function(){
    return Session.get('consentSearchQuery');
  })
  data.selectedConsent = useTracker(function(){
    return Session.get('selectedConsent');
  })
  data.selectedConsentId = useTracker(function(){
    return Session.get('selectedConsentId');
  })

  data.consents = useTracker(function(){
    return Consents.find().fetch()
  })


  // ???????
  if(get(this, 'props.params.consentId')){
    data.selectedConsent = Consents.findOne({id: get(this, 'props.params.consentId')});
    Session.set('consentPageTabIndex', 2);
  } else if (Session.get('selectedConsentId')){
    data.selectedConsent = Consents.findOne({_id: Session.get('selectedConsentId')});
  } else {
    data.selectedConsent = false;
  }




  //---------------------------------------------------------------------------------------------------------
  // Lifecycle

  useEffect(function(){
  //   if(get(this, 'props.params.consentId')){
  //     Session.set('selectedConsentId', get(this, 'props.params.consentId'))
  //     Session.set('consentPageTabIndex', 2);
  //   }
  }, [])

  function handleTabChange(index){
    Session.set('consentPageTabIndex', index);
  }

  function onNewTab(){
    Session.set('selectedConsent', false);
    Session.set('consentUpsert', false);
  }
  function handleClose(){
    Session.set('consentDialogOpen', false);
  }
  function handleSearch(){
    console.log('handleSearch', get(this, 'state.searchForm'));

    Session.set('consentSearchQuery', {
      "$and": [
        {"consentingParty.display": {"$regex": get(this, 'state.searchForm.familyName')}}, 
        {"consentingParty.display": {"$regex": get(this, 'state.searchForm.givenName')}}
      ]
    });
    handleClose();
  }

  function changeSelectedCategory(event, value){
    console.log('changeSelectedCategory', event, value)

    let searchForm = state.searchForm;
    searchForm.category = value;

    setState({searchForm: searchForm})
  }
  function updateFormData(formData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("ConsentDetail.updateFormData", formData, field, textValue);

    switch (field) {
      case "givenName":
        set(formData, 'givenName', textValue)
        break;
      case "familyName":
        set(formData, 'familyName', textValue)
        break;        
      case "category":
        set(formData, 'category', textValue)
        break;
    }

    if(process.env.NODE_ENV === "test") console.log("formData", formData);
    return formData;
  }
  function updateSearch(consentData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("ConsentDetail.updateConsent", consentData, field, textValue);

    // switch (field) {
    //   case "givenName":
    //     set(consentData, 'givenName', textValue)
    //     break;
    //   case "familyName":
    //     set(consentData, 'familyName', textValue)
    //     break;        
    //   case "category":
    //     set(consentData, 'category.text', textValue)
    //     break;  
    // }
    return consentData;
  }
  function changeState(field, event, textValue){
    if(process.env.NODE_ENV === "test") console.log("   ");
    if(process.env.NODE_ENV === "test") console.log("ConsentDetail.changeState", field, textValue);
    if(process.env.NODE_ENV === "test") console.log("state", state);

    let searchForm = Object.assign({}, state.searchForm);
    let searchQuery = Object.assign({}, state.searchQuery);

    searchForm = updateFormData(searchForm, field, textValue);
    searchQuery = updateSearch(searchQuery, field, textValue);

    if(process.env.NODE_ENV === "test") console.log("searchQuery", searchQuery);
    if(process.env.NODE_ENV === "test") console.log("searchForm", searchForm);

    setState({searchQuery: searchQuery})
    setState({searchForm: searchForm})
  }


  //=============================================================================================================================================
  // Renders
  console.log('React.version: ' + React.version);
  console.log('ConsentsPage.props', props);

  const actions = [
    <Button
      label="Cancel"
      color="primary"
      onClick={handleClose}
    />,
    <Button
      label="Search"
      color="primary"
      keyboardFocused={true}
      onClick={handleSearch.bind(this) }
    />,
  ];

  let consentPageContent;
  if(true){
    consentPageContent = <ConsentsTable 
      showBarcodes={true} 
      hideIdentifier={true}
      consents={data.consents}
      noDataMessage={false}
      // patient={ data.consentSearchFilter }
      // query={ data.consentSearchQuery }
      sort="periodStart"
    />
  }

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  return (
      <PageCanvas id="consentsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
        <StyledCard height="auto">
          <CardHeader
            title={ data.consents.length + " Consents"}
          />
          <CardContent>
            { consentPageContent }
          </CardContent>
        </StyledCard>
        
      </PageCanvas>
  );

}



export default ConsentsPage;