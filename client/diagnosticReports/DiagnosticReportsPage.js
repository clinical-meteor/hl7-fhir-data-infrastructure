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
import styled from 'styled-components';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

import DiagnosticReportDetail from './DiagnosticReportDetail';
import DiagnosticReportsTable from './DiagnosticReportsTable';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('selectedDiagnosticReportId', false);


// ==============================================================================================================
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

// ==============================================================================================================
// Tabs

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

// ==============================================================================================================
// React CLass Component

Session.setDefault('diagnosticReportPageTabIndex', 0);
export class DiagnosticReportsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('diagnosticReportPageTabIndex'),
      diagnosticReportSearchFilter: Session.get('diagnosticReportSearchFilter'),
      selectedDiagnosticReportId: Session.get('selectedDiagnosticReportId'),
      fhirVersion: Session.get('fhirVersion'),
      selectedDiagnosticReport: false,
      diagnosticReports: [],
      diagnosticReportCount: 0
    };

    if (Session.get('selectedDiagnosticReportId')){
      data.selectedDiagnosticReport = DiagnosticReports.findOne({_id: Session.get('selectedDiagnosticReportId')});
    } else {
      data.selectedDiagnosticReport = false;
    }

    data.diagnosticReports = DiagnosticReports.find().fetch();
    data.diagnosticReportCount = DiagnosticReports.find().count();


    // data.style = Glass.blur(data.style);
    // data.style.appbar = Glass.darkroom(data.style.appbar);
    // data.style.tab = Glass.darkroom(data.style.tab);

    return data;
  }

  handleTabChange(index){
    // Session.set('diagnosticReportPageTabIndex', index);
  }

  onNewTab(){
    // Session.set('selectedDiagnosticReportId', false);
    // Session.set('diagnosticReportUpsert', false);
  }

  render() {
    if(process.env.NODE_ENV === "test") console.log('In DiagnosticReportsPage render');

    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader', false)){
      headerHeight = 128;
    }

    return (
      <PageCanvas id="measuresPage" headerHeight={headerHeight}>
        <MuiThemeProvider theme={muiTheme}>
          <StyledCard height="auto" scrollable={true} margin={20} >
            <CardHeader title={this.data.diagnosticReportCount + ' Diagnostic Reports'} />
            <CardContent>
              <DiagnosticReportsTable 
                diagnosticReports={this.data.diagnosticReports}
                count={this.data.diagnosticReportCount}
                fhirVersion={ this.data.fhirVersion }/>
              {/* <Tabs id="diagnosticReportsPageTabs" value={ this.data.tabIndex} onChange={ this.handleTabChange.bind(this) }>
                <Tab id='reportHistoryTab' label='History' value={0} />
                <Tab id="viewReportTab" label='Report' value={1} />
              </Tabs>
              <TabPanel>
                <DiagnosticReportsTable 
                  diagnosticReports={this.data.diagnosticReports}
                  count={this.data.diagnosticReportCount}
                  fhirVersion={ this.data.fhirVersion }/>
              </TabPanel>
              <TabPanel>
                <DiagnosticReportDetail 
                  id='viewDiagnosticReport'
                  showDatePicker={ false }   
                  fhirVersion={  this.data.fhirVersion }
                  diagnosticReport={  this.data.selectedDiagnosticReport }
                  diagnosticReportId={  this.data.selectedDiagnosticReportId } 
                />  
              </TabPanel> */}
            </CardContent>
          </StyledCard>
        </MuiThemeProvider>
      </PageCanvas>
    );
  }
}

ReactMixin(DiagnosticReportsPage.prototype, ReactMeteorData);

export default DiagnosticReportsPage;