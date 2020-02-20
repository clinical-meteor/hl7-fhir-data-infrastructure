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
import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import CompositionDetail from './CompositionDetail';
import CompositionsTable from './CompositionsTable';
import { StyledCard, PageCanvas } from 'material-fhir-ui';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

Session.setDefault('compositionPageTabIndex', 0);
Session.setDefault('compositionSearchFilter', '');
Session.setDefault('selectedCompositionId', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('compositionsArray', []);

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

// const StyledCard = styled(Card)`
//   background: ` + theme.paperColor + `;
//   border-radius: 3px;
//   border: 0;
//   color: ` + theme.paperTextColor + `;
//   height: 48px;
//   padding: 0 30px;
//   box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
// `;


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




export class CompositionsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      compositionId: false,
      composition: {}
    }
  }
  getMeteorData() {
    let data = {
      tabIndex: Session.get('compositionPageTabIndex'),
      compositionSearchFilter: Session.get('compositionSearchFilter'),
      fhirVersion: Session.get('fhirVersion'),
      selectedCompositionId: Session.get("selectedCompositionId"),
      selectedComposition: false,
      selected: [],
      compositions: [],
      query: {},
      options: {
        limit: get(Meteor, 'settings.public.defaults.paginationLimit', 5)
      },
      tabIndex: Session.get('compositionPageTabIndex')
    };

    // if(Session.get('compositionsTableQuery')){
    //   data.query = Session.get('compositionsTableQuery')
    // }

    // if (Session.get('selectedCompositionId')){
    //   data.selectedComposition = Compositions.findOne({_id: Session.get('selectedCompositionId')});
    //   this.state.composition = Compositions.findOne({_id: Session.get('selectedCompositionId')});
    //   this.state.compositionId = Session.get('selectedCompositionId');
    // } else {
    //   data.selectedComposition = false;
    //   this.state.compositionId = false;
    //   this.state.composition = {};
    // }

    console.log('CompositionsPage.data.query', data.query)
    console.log('CompositionsPage.data.options', data.options)

    data.compositions = Compositions.find(data.query, data.options).fetch();


    // data.style = Glass.blur(data.style);
    // data.style.appbar = Glass.darkroom(data.style.appbar);
    // data.style.tab = Glass.darkroom(data.style.tab);

    // console.log("CompositionsPage[data]", data);
    return data;
  }

  // this could be a mixin
  handleTabChange(index){
    Session.set('compositionPageTabIndex', index);
  }
  handleActive(index){
  }
  // this could be a mixin
  onNewTab(){
    console.log("onNewTab; we should clear things...");

    Session.set('selectedCompositionId', false);
  }
  onCancelUpsertComposition(context){
    Session.set('compositionPageTabIndex', 1);
  }
  onDeleteComposition(context){
    Compositions._collection.remove({_id: get(context, 'state.compositionId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('Compositions.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedCompositionId', false);
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Compositions", recordId: context.state.compositionId});
        Bert.alert('Composition removed!', 'success');
      }
    });
    Session.set('compositionPageTabIndex', 1);
  }
  onUpsertComposition(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new Composition...', context.state)

    if(get(context, 'state.composition')){
      let self = context;
      let fhirCompositionData = Object.assign({}, get(context, 'state.composition'));
  
      // if(process.env.NODE_ENV === "test") console.log('fhirCompositionData', fhirCompositionData);
  
      let compositionValidator = CompositionSchema.newContext();
      // console.log('compositionValidator', compositionValidator)
      compositionValidator.validate(fhirCompositionData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', compositionValidator.isValid())
        console.log('ValidationErrors: ', compositionValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.compositionId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating composition...");
        }

        delete fhirCompositionData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirCompositionData.resourceType = 'Composition';
  
        Compositions._collection.update({_id: get(context, 'state.compositionId')}, {$set: fhirCompositionData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("Compositions.insert[error]", error);
            Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Compositions", recordId: context.state.compositionId});
            Session.set('selectedCompositionId', false);
            Session.set('compositionPageTabIndex', 1);
            Bert.alert('Composition added!', 'success');
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new composition...", fhirCompositionData);
  
        fhirCompositionData.effectiveDateTime = new Date();
        Compositions._collection.insert(fhirCompositionData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('Compositions.insert[error]', error);
            Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Compositions", recordId: context.state.compositionId});
            Session.set('compositionPageTabIndex', 1);
            Session.set('selectedCompositionId', false);
            Bert.alert('Composition added!', 'success');
          }
        });
      }
    } 
    Session.set('compositionPageTabIndex', 1);
  }
  onTableRowClick(compositionId){
    Session.set('selectedCompositionId', compositionId);
    Session.set('selectedPatient', Compositions.findOne({_id: compositionId}));
  }
  onTableCellClick(id){
    Session.set('compositionsUpsert', false);
    Session.set('selectedCompositionId', id);
    Session.set('compositionPageTabIndex', 2);
  }
  tableActionButtonClick(_id){
    let composition = Compositions.findOne({_id: _id});

    // console.log("CompositionsTable.onSend()", composition);

    var httpEndpoint = "http://localhost:8080";
    if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
      httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    }
    HTTP.post(httpEndpoint + '/Composition', {
      data: composition
    }, function(error, result){
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("result", result);
      }
    });
  }
  onInsert(compositionId){
    Session.set('selectedCompositionId', false);
    Session.set('compositionPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Compositions", recordId: compositionId});
  }
  onUpdate(compositionId){
    Session.set('selectedCompositionId', false);
    Session.set('compositionPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Compositions", recordId: compositionId});
  }
  onRemove(compositionId){
    Session.set('compositionPageTabIndex', 1);
    Session.set('selectedCompositionId', false);
    HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Compositions", recordId: compositionId});
  }
  onCancel(){
    Session.set('compositionPageTabIndex', 1);
  } 
  render() {
    // console.log('CompositionsPage.data', this.data)

    function handleChange(event, newValue) {
      Session.set('compositionPageTabIndex', newValue)
    }

    return (
      <div id="compositionsPage" style={{paddingLeft: '100px', paddingRight: '100px', paddingBottom: '100px'}}>
        <MuiThemeProvider theme={muiTheme} >
          {/* <Container> */}
            <StyledCard>
              <CardHeader
                title="Compositions"
              />
              <CardContent>

                    <Tabs value={this.data.tabIndex} onChange={handleChange.bind(this)} aria-label="simple tabs example">
                      <Tab label="History" />
                      <Tab label="New" />
                    </Tabs>
                    <TabPanel value={this.data.tabIndex} index={0}>
                      <CompositionsTable 
                        hideIdentifier={true} 
                        hideCheckboxes={true} 
                        hideSubjects={false}
                        noDataMessagePadding={100}
                        actionButtonLabel="Send"
                        compositions={ this.data.compositions }
                        paginationLimit={10}
                        hideSubjects={true}
                        hideClassCode={false}
                        hideReasonCode={false}
                        hideReason={false}
                        hideHistory={false}
                        // appWidth={ Session.get('appWidth') }
                        // onRowClick={ this.onTableRowClick }
                        // onCellClick={ this.onTableCellClick }
                        // onActionButtonClick={this.tableActionButtonClick}
                        // onRemoveRecord={ this.onDeleteComposition }
                        // query={this.data.compositionsTableQuery}
                        />
                    </TabPanel>
                    <TabPanel value={this.data.tabIndex} index={1}>
                      {/* <CompositionDetail 
                        id='newComposition' 
                        displayDatePicker={true} 
                        displayBarcodes={false}
                        showHints={true}
                        // onInsert={ this.onInsert }
                        // composition={ this.data.selectedComposition }
                        // compositionId={ this.data.selectedCompositionId } 
                        // onDelete={ this.onDeleteComposition }
                        // onUpsert={ this.onUpsertComposition }
                        // onCancel={ this.onCancelUpsertComposition } 
                        /> */}
                    </TabPanel>

                {/* <Tabs id="compositionsPageTabs" default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
                  <Tab className="newCompositionTab" label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0} >
                    <CompositionDetail 
                      id='newComposition' 
                      displayDatePicker={true} 
                      displayBarcodes={false}
                      showHints={true}
                      onInsert={ this.onInsert }
                      composition={ this.data.selectedComposition }
                      compositionId={ this.data.selectedCompositionId } 

                      onDelete={ this.onDeleteComposition }
                      onUpsert={ this.onUpsertComposition }
                      onCancel={ this.onCancelUpsertComposition } 

                      />
                  </Tab>
                  <Tab className="compositionListTab" label='Compositions' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                    <CompositionsTable 
                      hideIdentifier={true} 
                      hideSubjects={false}
                      noDataMessagePadding={100}
                      compositions={ this.data.compositions }
                      paginationLimit={ this.data.pagnationLimit }
                      appWidth={ Session.get('appWidth') }
                      actionButtonLabel="Send"
                      onRowClick={ this.onTableRowClick }
                      onCellClick={ this.onTableCellClick }
                      onActionButtonClick={this.tableActionButtonClick}
                      onRemoveRecord={ this.onDeleteComposition }
                      query={this.data.compositionsTableQuery}
                      />
                  </Tab>
                  <Tab className="compositionDetailsTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                    <CompositionDetail 
                      id='compositionDetails' 
                      displayDatePicker={true} 
                      displayBarcodes={false}
                      composition={ this.data.selectedComposition }
                      compositionId={ this.data.selectedCompositionId } 
                      showCompositionInputs={true}
                      showHints={false}
                      onInsert={ this.onInsert }

                      onDelete={ this.onDeleteComposition }
                      onUpsert={ this.onUpsertComposition }
                      onCancel={ this.onCancelUpsertComposition } 
                  />
                  </Tab>
                </Tabs> */}
              </CardContent>
            </StyledCard>
          {/* </Container> */}
        </MuiThemeProvider>
      </div>
    );
  }
}

ReactMixin(CompositionsPage.prototype, ReactMeteorData);
export default CompositionsPage;