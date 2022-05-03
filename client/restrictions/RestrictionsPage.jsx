import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

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


import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { StyledCard, PageCanvas } from 'fhir-starter';

import RestrictionDetail from './RestrictionDetail';
import RestrictionsTable from './RestrictionsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { get, cloneDeep } from 'lodash';



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


Session.setDefault('restrictionPageTabIndex', 0);
Session.setDefault('restrictionSearchFilter', '');
Session.setDefault('selectedRestrictionId', '');
Session.setDefault('selectedRestriction', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('restrictionsArray', []);
Session.setDefault('RestrictionsPage.onePageLayout', true)
Session.setDefault('RestrictionsPage.defaultQuery', {name: {$not: ""}})
Session.setDefault('RestrictionsTable.hideCheckbox', true)
Session.setDefault('RestrictionsTable.restrictionsIndex', 0)

Session.setDefault('restrictionChecklistMode', false)


//===========================================================================
// MAIN COMPONENT  


export function RestrictionsPage(props){

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();


  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    restrictions: [],
    onePageLayout: true,
    restrictionSearchFilter: '',
    options: {
      sort: {
        'focus.display': -1,
        lastModified: -1
      }
    },
    restrictionChecklistMode: false,
    restrictionsIndex: 0
  };

  


  data.onePageLayout = useTracker(function(){
    return Session.get('RestrictionsPage.onePageLayout');
  }, [])
  data.selectedRestrictionId = useTracker(function(){
    return Session.get('selectedRestrictionId');
  }, [])
  data.selectedRestriction = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedRestrictionId'));
  }, [])
  data.restrictions = useTracker(function(){
    let results = [];
    if(Session.get('restrictionChecklistMode')){
      results = Restrictions.find({
        'focus.display': "Patient Correction"
      }, {
        limit: 10,
        sort: {lastModified: -1}
      }).fetch();      
    } else {
      results = Restrictions.find().fetch();
    }

    return results;
  }, [])
  data.restrictionSearchFilter = useTracker(function(){
    return Session.get('restrictionSearchFilter')
  }, [])
  data.restrictionChecklistMode = useTracker(function(){
    return Session.get('restrictionChecklistMode')
  }, [])
  data.restrictionsIndex = useTracker(function(){
    return Session.get('RestrictionsTable.restrictionsIndex')
  }, [])


  function setRestrictionsIndex(newIndex){
    Session.set('RestrictionsTable.restrictionsIndex', newIndex)
  }

  function handleRowClick(restrictionId){
    console.log('RestrictionsPage.handleRowClick', restrictionId)
    let restriction = Restrictions.findOne({id: restrictionId});

    if(restriction){
      Session.set('selectedRestrictionId', get(restriction, 'id'));
      Session.set('selectedRestriction', restriction);
      Session.set('Restriction.Current', restriction);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "RestrictionDetail");
        Session.set('mainAppDialogMaxWidth', "md");

        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Restriction");
        } else {
          Session.set('mainAppDialogTitle', "View Restriction");
        }
      }      
    } else {
      console.log('No restriction found...')
    }
  }
  // function onInsert(restrictionId){
  //   Session.set('selectedRestrictionId', '');
  //   Session.set('restrictionPageTabIndex', 1);
  //   HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Restrictions", recordId: restrictionId});
  // }
  // function onCancel(){
  //   Session.set('restrictionPageTabIndex', 1);
  // } 


  // console.log('RestrictionsPage.data', data)

  function handleChange(event, newValue) {
    Session.set('restrictionPageTabIndex', newValue)
  }


  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} scrollable >
      <CardHeader title={data.restrictions.length + " Restrictions"} />
        <CardContent>
          <RestrictionsTable 
            formFactorLayout={formFactor}  
            restrictions={ data.restrictions }
            count={data.restrictions.length}
            selectedRestrictionId={ data.selectedRestrictionId }
            hideCheckbox={data.hideCheckbox}
            hideStatus={false}
            hideName={false}
            hideTitle={false}
            hideVersion={false}
            hideExperimental={false}
            paginationLimit={10}     
            checklist={data.restrictionChecklistMode}
            rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
            onRowClick={ handleRowClick.bind(this) }
            onSetPage={function(index){
              setRestrictionsIndex(index)
            }}     
            page={data.restrictionsIndex} 
            size="small"
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.restrictions.length + " Restrictions"} />
          <CardContent>
            <RestrictionsTable 
              formFactorLayout={formFactor}  
              restrictions={ data.restrictions }
              count={data.restrictions.length}
              selectedRestrictionId={ data.selectedRestrictionId }
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
              onSetPage={function(index){
                setRestrictionsIndex(index)
              }}  
              page={data.restrictionsIndex} 
              size="medium"
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedRestrictionId }</h1>
          {/* <CardHeader title={data.selectedRestrictionId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <RestrictionDetail 
                id='restrictionDetails'                 
                displayDatePicker={true} 
                displayBarcodes={false}
                restriction={ data.selectedRestriction }
                restrictionId={ data.selectedRestrictionId } 
                showRestrictionInputs={true}
                showHints={false}
              />
            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  }

  return (
    <PageCanvas id="restrictionsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default RestrictionsPage;