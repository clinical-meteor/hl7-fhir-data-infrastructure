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

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import ProcedureDetail from './ProcedureDetail';
import ProceduresTable from './ProceduresTable';

import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

import { get, cloneDeep } from 'lodash';

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



Session.setDefault('selectedProcedureId', false);
Session.setDefault('fhirVersion', 'v1.0.2');

export class ProceduresPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('procedurePageTabIndex'),
      procedureSearchFilter: Session.get('procedureSearchFilter'),
      selectedProcedureId: Session.get('selectedProcedureId'),
      fhirVersion: Session.get('fhirVersion'),
      selectedProcedure: false,
      procedures: [],
      proceduresCount: 0
    };

    if (Session.get('selectedProcedureId')){
      data.selectedProcedure = Procedures.findOne({_id: Session.get('selectedProcedureId')});
    } else {
      data.selectedProcedure = false;
    }

    data.procedures = Procedures.find().fetch();
    data.proceduresCount = Procedures.find().count();

    return data;
  }
  onInsert(procedureId){
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Procedures", recordId: procedureId});
    Session.set('procedurePageTabIndex', 1);
    Session.set('selectedProcedureId', false);
  }
  onUpdate(procedureId){
    HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Procedures", recordId: procedureId});
    Session.set('procedurePageTabIndex', 1);
    Session.set('selectedProcedureId', false);
}
  onRemove(procedureId){
    HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Procedures", recordId: procedureId});
    Session.set('procedurePageTabIndex', 1);
    Session.set('selectedProcedureId', false);
  }
  onCancel(){
    Session.set('procedurePageTabIndex', 1);
  }

  handleTabChange(index){
    Session.set('procedurePageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedProcedureId', false);
    Session.set('procedureUpsert', false);
  }

  render() {
    if(process.env.NODE_ENV === "test") console.log('In ProceduresPage render');

    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader', false)){
      headerHeight = 128;
    }

    return (
      <PageCanvas id="proceduresPage" headerHeight={headerHeight} >
        <MuiThemeProvider theme={muiTheme} >
            <StyledCard height="auto" scrollable={true} margin={20} headerHeight={headerHeight} >
              <CardHeader title='Procedures' />
              <CardContent>
                <ProceduresTable 
                  procedures={this.data.procedures}
                  noDataMessagePadding={100}
                  displayDates={true} 
                  count={this.data.proceduresCount}
                  rowsPerPage={20}
                  hideCategory={true}
                  hideBodySite={true}
                  hideSubject={true}
                  showMinutes={true}
                  hideBarcode={true}
                  hideCheckboxes={true}
                  />
                {/* <Tabs id="proceduresPageTabs" default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
                <Tab className='newProcedureTab' label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0}>
                  <ProcedureDetail 
                    id='newProcedure' 
                    fhirVersion={ this.data.fhirVersion }
                    procedure={ this.data.selectedProcedure }
                    procedureId={ this.data.selectedProcedureId } 
                    showDatePicker={true} 
                    onInsert={ this.onInsert }
                  />
                </Tab>
                <Tab className="procedureListTab" label='Procedures' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                  <ProceduresTable 
                    noDataMessagePadding={100}
                    // hideIdentifier={true} 
                    displayDates={true} />
                </Tab>
                <Tab className="procedureDetailsTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                  <ProcedureDetail 
                    id='procedureDetails'
                    showDatePicker={true} 
                    fhirVersion={ this.data.fhirVersion }
                    procedure={ this.data.selectedProcedure }
                    procedureId={ this.data.selectedProcedureId } 
                    onInsert={ this.onInsert }
                    onUpdate={ this.onUpdate }
                    onRemove={ this.onRemove }
                    onCancel={ this.onCancel }
                    />  
                </Tab>
              </Tabs> */}
              </CardContent>
            </StyledCard>
        </MuiThemeProvider>
      </PageCanvas>
    );
  }
}

ReactMixin(ProceduresPage.prototype, ReactMeteorData);

export default ProceduresPage;