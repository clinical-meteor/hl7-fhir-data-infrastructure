
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

import MedicationRequestDetail from './MedicationRequestDetail';
import MedicationRequestsTable from './MedicationRequestsTable';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import { get, cloneDeep } from 'lodash';

import { StyledCard, PageCanvas } from 'material-fhir-ui';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


//=============================================================================================================================================
//=============================================================================================================================================

  // Global Theming 
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
//=============================================================================================================================================
// TAB PANEL

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
//=============================================================================================================================================
// MEDICATION ORDER PAGE

Session.setDefault('medicationRequestPageTabIndex', 0)
export class MedicationRequestsPage extends React.Component {
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
      tabIndex: Session.get('medicationRequestPageTabIndex'),
      medicationRequestSearchFilter: Session.get('medicationRequestSearchFilter'),
      currentMedicationRequest: Session.get('selectedMedicationRequest'),
      medicationRequests: [],
      medicationRequestsCount: 0
    };
    
    data.medicationRequests = MedicationRequests.find().fetch();
    data.medicationRequestsCount = MedicationRequests.find().count();

    if (Meteor.user()) {
      data.state.isLoggedIn = true;
    }

    return data;
  }

  handleTabChange(index){
    Session.set('medicationRequestPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedMedicationRequest', false);
    Session.set('medicationRequestUpsert', false);
  }

  render() {
    if(process.env.NODE_ENV === "test") console.log('In MedicationRequestsPage render');

    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader', false)){
      headerHeight = 128;
    }

    return (
      <PageCanvas id="medicationRequestsPage" headerHeight={headerHeight} >
        <MuiThemeProvider theme={muiTheme} >
          <StyledCard height="auto" scrollable={true} margin={20} >
            <CardHeader title='Medication Requests' />
            <CardContent>
              <div id="medicationRequestsPageTabs">
                <Tabs value={this.data.tabIndex} onChange={this.handleTabChange.bind(this)} aria-label="simple tabs example">
                  <Tab label="Prescription History" value={0} />
                  <Tab label="New" value={1} />
                </Tabs>
                <TabPanel >
                  <MedicationRequestsTable 
                    medicationRequests={this.data.medicationRequests}
                    rowsPerPage={20}
                    hideBarcodes={true}
                    hidePatient={true}
                    count={this.data.medicationRequestsCount}
                  />
                </TabPanel >
                <TabPanel >
                  <MedicationRequestDetail id='newMedicationRequest' />
                </TabPanel >
              </div>
            </CardContent>
          </StyledCard>
        </MuiThemeProvider>
      </PageCanvas>
    );
  }
}

ReactMixin(MedicationRequestsPage.prototype, ReactMeteorData);
export default MedicationRequestsPage;