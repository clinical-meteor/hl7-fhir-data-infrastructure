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

import React  from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';


import { get } from 'lodash';

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
Session.setDefault('selectedOrganization', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('OrganizationsPage.onePageLayout', true)




//=============================================================================================================================================
// MAIN COMPONENT

export function OrganizationsPage(props){

  let data = {
    selectedOrganizationId: '',
    selectedOrganization: null,
    organizations: [],
    onePageLayout: true
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('OrganizationsPage.onePageLayout');
  }, [])
  data.selectedOrganizationId = useTracker(function(){
    return Session.get('selectedOrganizationId');
  }, [])
  data.selectedOrganization = useTracker(function(){
    return Organizations.findOne(Session.get('selectedOrganizationId'));
  }, [])
  data.organizations = useTracker(function(){
    return Organizations.find().fetch();
  }, [])



  function handleRowClick(organizationId){
    // logger.info('OrganizationsPage.handleRowClick', organizationId)
    let organization = Organizations.findOne({id: organizationId});

    Session.set('selectedOrganizationId', get(organization, 'id'));
    Session.set('selectedOrganization', Organizations.findOne({id: get(organization, 'id')}));

    Session.set('currentSelectionId', 'Organization/' + get(organization, '_id'));
    Session.set('currentSelection', organization);
  }


  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let cardWidth = window.innerWidth - paddingWidth;
  
  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <Grid container>
      <StyledCard height="auto" margin={20} width={cardWidth + 'px'}>
      <CardHeader title={data.organizations.length + " Organizations"} />
      <CardContent>
        <OrganizationsTable        
          formFactorLayout={formFactor}  
          organizations={data.organizations}
          count={data.organizations.length}
          selectedOrganizationId={ data.selectedOrganizationId }
          onRowClick={ handleRowClick.bind(this) }
          hideCheckbox={true}
          hideBarcode={false}
          hideActionIcons={true}
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
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
              organizations={data.organizations}
              count={data.organizations.length}
              hideCheckbox={true}
              hideBarcode={true}
              hidePhone={true}
              hideEmail={true}
              hideActionIcons={true}
              selectedOrganizationId={ data.selectedOrganizationId }
              onRowClick={ handleRowClick.bind(this) }
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