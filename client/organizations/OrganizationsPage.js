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
import OrganizationTable from './OrganizationsTable';

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
Session.setDefault('fhirVersion', 'v1.0.2');

//=============================================================================================================================================
// TABS



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}


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
      fhirVersion: Session.get('fhirVersion'),
      selectedOrganization: false
    };

    if (Session.get('selectedOrganizationId')){
      data.selectedOrganization = Organizations.findOne({_id: Session.get('selectedOrganizationId')});
    } else {
      data.selectedDevice = false;
    }

    if(process.env.NODE_ENV === "test") console.log("OrganizationsPage[data]", data);
    return data;
  }

  handleTabChange(index){
    Session.set('organizationPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedOrganizationId', false);
    Session.set('organizationUpsert', false);
  }

  render() {

    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader', false)){
      headerHeight = 128;
    }
    
    return (
      <PageCanvas id="organizationsPage" headerHeight={headerHeight} >
        <MuiThemeProvider theme={muiTheme} >
          <StyledCard height="auto" scrollable={true} margin={20} headerHeight={headerHeight} >
            <CardHeader
              title="Organizations"
            />
            <CardContent>
              <Tabs id="organizationsPageTabs" default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}> 
                {/* <Tab className="newOrganizationTab" label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0} >
                  <OrganizationDetail 
                    id='newOrganization' />
                </Tab> */}
                <Tab className="organizationListTab" label='Organizations' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                  <OrganizationTable />
                </Tab>
                <Tab className="organizationDetailsTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                  {/* <OrganizationDetail 
                    id='organizationDetails' 
                    organization={ this.data.selectedOrganization }
                    organizationId={ this.data.selectedOrganizationId } />   */}
                </Tab>
              </Tabs>
            </CardContent>
          </StyledCard>
        </MuiThemeProvider>
      </PageCanvas>
    );
  }
}

ReactMixin(OrganizationsPage.prototype, ReactMeteorData);
export default OrganizationsPage;