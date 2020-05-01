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

import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

import ConditionDetail from './ConditionDetail';
import ConditionsTable from './ConditionsTable';

import { get } from 'lodash';



//=============================================================================================================================================
// SESSION VARIABLES


Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('selectedConditionId', false);
Session.setDefault('conditionPageTabIndex', 1);


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

export class ConditionsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('conditionPageTabIndex'),
      conditionSearchFilter: Session.get('conditionSearchFilter'),
      currentConditionId: Session.get('selectedConditionId'),
      fhirVersion: Session.get('fhirVersion'),
      selectedCondition: false,
      conditions: [],
      conditionsCount: 0
    };

    data.conditions = Conditions.find().fetch();
    data.conditionsCount = Conditions.find().count();

    if (Session.get('selectedConditionId')){
      data.selectedCondition = Conditions.findOne({_id: Session.get('selectedConditionId')});
    } else {
      data.selectedCondition = false;
    }

    return data;
  }

  handleTabChange(index){
    Session.set('conditionPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedConditionId', false);
  }
  onInsert(conditionId){
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Conditions", recordId: conditionId});
    Session.set('conditionPageTabIndex', 1);
    Session.set('selectedConditionId', false);
  }
  onUpdate(conditionId){
    HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Conditions", recordId: conditionId});
    Session.set('conditionPageTabIndex', 1);
    Session.set('selectedConditionId', false);
}
  onRemove(conditionId){
    HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Conditions", recordId: conditionId});
    Session.set('conditionPageTabIndex', 1);
    Session.set('selectedConditionId', false);
  }
  onCancel(){
    Session.set('conditionPageTabIndex', 1);
  }
  render() {
    if(get(Meteor, 'settings.public.logging') === "debug") console.log('In ConditionsPage render');

    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader', false)){
      headerHeight = 128;
    }
    
    return (
      <PageCanvas id="conditionsPage" headerHeight={headerHeight} >
        <MuiThemeProvider theme={muiTheme} >
          <StyledCard height="auto" scrollable={true} margin={20} >
          <CardHeader title={ this.data.conditionsCount + " Conditions"} />
              <CardContent>

                <ConditionsTable 
                  conditions={this.data.conditions}
                  count={this.data.conditionsCount}  
                  autoColumns={true}
                  displayBarcode={true}
                />
              </CardContent>
          </StyledCard>
        </MuiThemeProvider>
      </PageCanvas>
    );
  }
}

ReactMixin(ConditionsPage.prototype, ReactMeteorData);

export default ConditionsPage;
