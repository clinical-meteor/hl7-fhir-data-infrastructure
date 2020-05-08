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

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { StyledCard, PageCanvas } from 'material-fhir-ui';


import OrganizationDetail from './OrganizationDetail';
import OrganizationsTable from './OrganizationsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
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

export class OrganizationsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      state: {
        isLoggedIn: false
      },
      tabIndex: Session.get('organizationPageTabIndex'),
      organizationSearchFilter: Session.get('organizationSearchFilter'),
      selectedOrganizationId: Session.get('selectedOrganizationId'),
      selectedOrganization: Session.get('selectedOrganization'),
      fhirVersion: Session.get('fhirVersion'),
      selectedOrganization: false,
      onePageLayout: true,
      organizations: [],
      organizationsCount: 0
    };

    data.organizations = Organizations.find().fetch();
    data.organizationsCount = Organizations.find().count();


    data.onePageLayout = Session.get('OrganizationsPage.onePageLayout');
    data.selectedOrganization = Session.get('selectedOrganization');

    // if (Session.get('selectedOrganizationId')){
    //   data.selectedOrganization = Organizations.findOne({_id: Session.get('selectedOrganizationId')});
    // } else {
    //   data.selectedOrganization = false;
    // }

    if(process.env.NODE_ENV === "test") console.log("OrganizationsPage[data]", data);
    return data;
  }


  handleRowClick(organizationId){
    console.log('OrganizationsPage.handleRowClick', organizationId)
    let organization = Organizations.findOne({id: organizationId});

    Session.set('selectedOrganizationId', get(organization, 'id'));
    Session.set('selectedOrganization', Organizations.findOne({id: get(organization, 'id')}));
  }

  render() {

    let headerHeight = LayoutHelpers.calcHeaderHeight();

    let layoutContents;
    if(this.data.onePageLayout){
      layoutContents = <Grid container>
        <StyledCard height="auto" margin={20} >
        <CardHeader title={this.data.organizationsCount + " Organizations"} />
        <CardContent>
          <OrganizationsTable          
            organizations={this.data.organizations}
            count={this.data.organizationsCount}
            selectedOrganizationId={ this.data.selectedOrganizationId }
            onRowClick={this.handleRowClick.bind(this) }
            hideCheckbox={true}
            hideBarcode={false}
            size="small"
          />                                
          </CardContent>
        </StyledCard>
      </Grid>
    } else {
      layoutContents = <Grid container spacing={3}>
        <Grid item lg={6}>
          <StyledCard height="auto" margin={20} >
            <CardHeader title={this.data.organizationsCount + " Organizations"} />
            <CardContent>
              <OrganizationsTable
                organizations={this.data.organizations}
                count={this.data.organizationsCount}
                hideCheckbox={true}
                hideBarcode={true}
                hidePhone={true}
                hideEmail={true}
                hideActionIcons={true}
                selectedOrganizationId={ this.data.selectedOrganizationId }
                onRowClick={this.handleRowClick.bind(this) }
                rowsPerPage={ LayoutHelpers.calcTableRows("small") }
                size="small"
              />              
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item lg={4}>
          <StyledCard height="auto" margin={20} scrollable>
            <h1 className="barcode" style={{fontWeight: 100}}>{this.data.selectedOrganizationId }</h1>
            <CardContent>
              <CardContent>
                <OrganizationDetail 
                  organizationId={this.data.selectedOrganizationId}
                  organization={this.data.selectedOrganization}
                />
              </CardContent>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    }
    
    return (
      <PageCanvas id="organizationsPage" headerHeight={headerHeight} >
        <MuiThemeProvider theme={muiTheme} >
          { layoutContents }
        </MuiThemeProvider>
      </PageCanvas>
    );
  }
}

ReactMixin(OrganizationsPage.prototype, ReactMeteorData);
export default OrganizationsPage;