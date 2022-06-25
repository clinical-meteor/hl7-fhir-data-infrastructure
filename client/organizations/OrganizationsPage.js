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
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { StyledCard, PageCanvas } from 'fhir-starter';

import OrganizationDetail from './OrganizationDetail';
import OrganizationsTable from './OrganizationsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

// import { Organizations } from '../../lib/schemas/Organizations';

import { get, set } from 'lodash';

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

Session.setDefault('organizationPageTabIndex', 1); 
Session.setDefault('organizationSearchFilter', ''); 
Session.setDefault('selectedOrganizationId', false);
Session.setDefault('selectedOrganization', false)
Session.setDefault('OrganizationsPage.onePageLayout', true)
Session.setDefault('OrganizationsPage.defaultQuery', {})
Session.setDefault('OrganizationsTable.hideCheckbox', true)
Session.setDefault('OrganizationsTable.organizationsIndex', 0)


//=============================================================================================================================================
// MAIN COMPONENT

export function OrganizationsPage(props){

  // Meteor Atmosphere packages is breaking Rule of Hooks
  // when we try to implement useState  
  // let [organizationsIndex, setOrganizationsIndex] = useState(0);

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let data = {
    selectedOrganizationId: '',
    selectedOrganization: null,
    organizations: [],
    onePageLayout: true,
    showSystemIds: false,
    showFhirIds: false,
    organizationsIndex: 0
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('OrganizationsPage.onePageLayout');
  }, [])
  data.hideCheckbox = useTracker(function(){
    return Session.get('OrganizationsTable.hideCheckbox');
  }, [])
  data.selectedOrganizationId = useTracker(function(){
    return Session.get('selectedOrganizationId');
  }, [])
  data.selectedOrganization = useTracker(function(){
    return Organizations.findOne(Session.get('selectedOrganizationId'));
  }, [])
  data.organizations = useTracker(function(){
    return Organizations.find(Session.get('OrganizationsPage.defaultQuery')).fetch();
  }, [])
  data.organizationsIndex = useTracker(function(){
    return Session.get('OrganizationsTable.organizationsIndex')
  }, [])
  data.showSystemIds = useTracker(function(){
    return Session.get('showSystemIds');
  }, [])
  data.showFhirIds = useTracker(function(){
    return Session.get('showFhirIds');
  }, [])

  


  function setOrganizationsIndex(newIndex){
    Session.set('OrganizationsTable.organizationsIndex', newIndex)
  }

  function handleRowClick(organizationId){
    console.log('OrganizationsPage.handleRowClick', organizationId)
    let organization = Organizations.findOne({id: organizationId});

    if(organization){
      Session.set('selectedOrganizationId', get(organization, 'id'));
      Session.set('selectedOrganization', organization);
      Session.set('Organization.Current', organization);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "OrganizationDetail");
        Session.set('mainAppDialogMaxWidth', "md");

        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Organization");
        } else {
          Session.set('mainAppDialogTitle', "View Organization");
        }
      }      
    } else {
      console.log('No organization found...')
    }
  }



  let cardWidth = window.innerWidth - paddingWidth;

  
  
  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <Grid container>
      <StyledCard height="auto" margin={20} width={cardWidth + 'px'}>
      <CardHeader title={data.organizations.length + " Organizations"} />
      <CardContent>
        <OrganizationsTable        
          // formFactorLayout={formFactor}  
          organizations={data.organizations}
          count={data.organizations.length}
          selectedOrganizationId={ data.selectedOrganizationId }
          hideCheckbox={data.hideCheckbox}
          hideActionIcons={true}
          hideNumEndpoints={false}
          hideIdentifier={true}
          hideBarcode={!data.showSystemIds}
          hideFhirId={!data.showFhirIds}
          onRowClick={ handleRowClick.bind(this) }
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          onSetPage={function(index){
            setOrganizationsIndex(index)
          }}
          page={data.organizationsIndex}
          size="small"
        />                                
        </CardContent> 
      </StyledCard>
    </Grid>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} width={cardWidth + 'px'}>
          <CardHeader title={data.organizations.length + " Organizations"} />
          <CardContent>
            <OrganizationsTable
              // formFactorLayout={formFactor}  
              organizations={data.organizations}
              count={data.organizations.length}
              hideCheckbox={data.hideCheckbox}
              hideBarcode={!data.showSystemIds}
              hidePhone={true}
              hideEmail={true}
              hideActionIcons={true}
              hideNumEndpoints={false}
              hideIdentifier={true}
              selectedOrganizationId={ data.selectedOrganizationId }
              onRowClick={ handleRowClick.bind(this) }
              onSetPage={function(index){
                setOrganizationsIndex(index)
              }}
              page={data.organizationsIndex}
              rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
              size="medium"
            />              
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable width={cardWidth + 'px'}>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedOrganizationId }</h1>
          <CardContent>
            <CardContent>
              <OrganizationDetail 
                organizationId={data.selectedOrganizationId}
                organization={data.selectedOrganization}
              />
            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  }
  
  return (
    <PageCanvas id="organizationsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}





export default OrganizationsPage;