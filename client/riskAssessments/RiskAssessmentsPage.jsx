import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

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


// import RiskAssessmentDetail from './RiskAssessmentDetail';
import RiskAssessmentsTable from './RiskAssessmentsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, set } from 'lodash';


let defaultRiskAssessment = {
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


Session.setDefault('riskAssessmentFormData', defaultRiskAssessment);
Session.setDefault('riskAssessmentSearchFilter', '');
Session.setDefault('riskAssessmentSearchQuery', {});
Session.setDefault('riskAssessmentDialogOpen', false);
Session.setDefault('selectedRiskAssessmentId', false);
Session.setDefault('selectedRiskAssessment', false);
Session.setDefault('RiskAssessmentsPage.onePageLayout', true)
Session.setDefault('RiskAssessmentsPage.defaultQuery', {})
Session.setDefault('RiskAssessmentsTable.hideCheckbox', true)
Session.setDefault('RiskAssessmentsTable.riskAssessmentsIndex', 0)


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

export function RiskAssessmentsPage(props){


  //---------------------------------------------------------------------------------------------------------
  // State

  let data = {
    tabIndex: Session.get('riskAssessmentPageTabIndex'),
    riskAssessment: defaultRiskAssessment,
    riskAssessmentSearchFilter: '',
    currentRiskAssessment: null,
    riskAssessmentSearchQuery: {},
    dialogOpen: Session.get('riskAssessmentDialogOpen'), 
    selectedRiskAssessmentId: Session.get('selectedRiskAssessmentId'),
    selectedRiskAssessment: false,
    riskAssessments: []
  };


  //---------------------------------------------------------------------------------------------------------
  // Trackers

  data.riskAssessment = useTracker(function(){
    return Session.get('riskAssessmentFormData');
  })
  data.hideCheckbox = useTracker(function(){
    return Session.get('RiskAssessmentsTable.hideCheckbox');
  }, [])
  data.riskAssessmentSearchFilter = useTracker(function(){
    return Session.get('riskAssessmentSearchFilter');
  })
  data.riskAssessmentSearchFilter = useTracker(function(){
    return Session.get('riskAssessmentSearchFilter');
  })
  data.riskAssessmentSearchQuery = useTracker(function(){
    return Session.get('riskAssessmentSearchQuery');
  })
  data.selectedRiskAssessment = useTracker(function(){
    return Session.get('selectedRiskAssessment');
  })
  data.selectedRiskAssessmentId = useTracker(function(){
    return Session.get('selectedRiskAssessmentId');
  })

  data.riskAssessments = useTracker(function(){
    return RiskAssessments.find().fetch()
  })
  data.riskAssessmentsIndex = useTracker(function(){
    return Session.get('RiskAssessmentsTable.riskAssessmentsIndex')
  }, [])
  data.showSystemIds = useTracker(function(){
    return Session.get('showSystemIds');
  }, [])
  data.showFhirIds = useTracker(function(){
    return Session.get('showFhirIds');
  }, [])


  // ???????
  if(get(this, 'props.params.riskAssessmentId')){
    data.selectedRiskAssessment = RiskAssessments.findOne({id: get(this, 'props.params.riskAssessmentId')});
    Session.set('riskAssessmentPageTabIndex', 2);
  } else if (Session.get('selectedRiskAssessmentId')){
    data.selectedRiskAssessment = RiskAssessments.findOne({_id: Session.get('selectedRiskAssessmentId')});
  } else {
    data.selectedRiskAssessment = false;
  }




  //---------------------------------------------------------------------------------------------------------
  // Lifecycle


  function handleTabChange(index){
    Session.set('riskAssessmentPageTabIndex', index);
  }

  function onNewTab(){
    Session.set('selectedRiskAssessment', false);
    Session.set('riskAssessmentUpsert', false);
  }
  function handleClose(){
    Session.set('riskAssessmentDialogOpen', false);
  }
  function handleSearch(){
    console.log('handleSearch', get(this, 'state.searchForm'));

    Session.set('riskAssessmentSearchQuery', {
      "$and": [
        {"riskAssessmentingParty.display": {"$regex": get(this, 'state.searchForm.familyName')}}, 
        {"riskAssessmentingParty.display": {"$regex": get(this, 'state.searchForm.givenName')}}
      ]
    });
    handleClose();
  }

  function changeSelectedCategory(event, value){
    console.log('changeSelectedCategory', event, value)

    let searchForm = state.searchForm;
    searchForm.category = value;

    // setState({searchForm: searchForm})
  }
  function updateFormData(formData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("RiskAssessmentDetail.updateFormData", formData, field, textValue);

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
  function updateSearch(riskAssessmentData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("RiskAssessmentDetail.updateRiskAssessment", riskAssessmentData, field, textValue);

    // switch (field) {
    //   case "givenName":
    //     set(riskAssessmentData, 'givenName', textValue)
    //     break;
    //   case "familyName":
    //     set(riskAssessmentData, 'familyName', textValue)
    //     break;        
    //   case "category":
    //     set(riskAssessmentData, 'category.text', textValue)
    //     break;  
    // }
    return riskAssessmentData;
  }
  function changeState(field, event, textValue){
    if(process.env.NODE_ENV === "test") console.log("   ");
    if(process.env.NODE_ENV === "test") console.log("RiskAssessmentDetail.changeState", field, textValue);
    if(process.env.NODE_ENV === "test") console.log("state", state);

    let searchForm = Object.assign({}, state.searchForm);
    let searchQuery = Object.assign({}, state.searchQuery);

    searchForm = updateFormData(searchForm, field, textValue);
    searchQuery = updateSearch(searchQuery, field, textValue);

    if(process.env.NODE_ENV === "test") console.log("searchQuery", searchQuery);
    if(process.env.NODE_ENV === "test") console.log("searchForm", searchForm);

    // setState({searchQuery: searchQuery})
    // setState({searchForm: searchForm})
  }


  //=============================================================================================================================================
  // Renders
  console.log('React.version: ' + React.version);
  console.log('RiskAssessmentsPage.props', props);

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

  // let [riskAssessmentsIndex, setRiskAssessmentsIndex] = setState(0);

  let riskAssessmentPageContent;
  if(true){
    riskAssessmentPageContent = <RiskAssessmentsTable 
      showBarcodes={true} 
      hideIdentifier={true}
      hidePerformerReference={true}
      hidePerformerName={true}
      hideSubjectReference={true}
      hideText={true}
      riskAssessments={data.riskAssessments}
      noDataMessage={false}
      rowsPerPage={LayoutHelpers.calcTableRows()}
      onSetPage={function(index){
        setRiskAssessmentsIndex(index)
      }}  
      page={data.riskAssessmentsIndex}
      sort="authoredOn"
    />
  }

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let cardWidth = window.innerWidth - paddingWidth;
  let noDataImage = get(Meteor, 'settings.public.defaults.noData.noDataImagePath', "packages/clinical_hl7-fhir-data-infrastructure/assets/NoData.png");  

  let layoutContent;
  if(data.riskAssessments.length > 0){
    layoutContent = <StyledCard height="auto" width={cardWidth + 'px'} margin={20} >
      <CardHeader title={ data.riskAssessments.length + " RiskAssessments"} />
      <CardContent>
        { riskAssessmentPageContent }
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
      <PageCanvas id="riskAssessmentsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
        { layoutContent }        
      </PageCanvas>
  );

}



export default RiskAssessmentsPage;