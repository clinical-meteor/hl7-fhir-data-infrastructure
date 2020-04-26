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

import MeasureDetail from './MeasureDetail';
import MeasuresTable from './MeasuresTable';
import { StyledCard, PageCanvas } from 'material-fhir-ui';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

Session.setDefault('measurePageTabIndex', 0);
Session.setDefault('measureSearchFilter', '');
Session.setDefault('selectedMeasureId', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('measuresArray', []);

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




export class MeasuresPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      measureId: false,
      measure: {}
    }
  }
  getMeteorData() {
    let data = {
      tabIndex: Session.get('measurePageTabIndex'),
      measureSearchFilter: Session.get('measureSearchFilter'),
      fhirVersion: Session.get('fhirVersion'),
      selectedMeasureId: Session.get("selectedMeasureId"),
      selectedMeasure: false,
      selected: [],
      measures: [],
      query: {},
      options: {
        limit: get(Meteor, 'settings.public.defaults.paginationLimit', 5)
      },
      tabIndex: Session.get('measurePageTabIndex')
    };

    // if(Session.get('measuresTableQuery')){
    //   data.query = Session.get('measuresTableQuery')
    // }

    // if (Session.get('selectedMeasureId')){
    //   data.selectedMeasure = Measures.findOne({_id: Session.get('selectedMeasureId')});
    //   this.state.measure = Measures.findOne({_id: Session.get('selectedMeasureId')});
    //   this.state.measureId = Session.get('selectedMeasureId');
    // } else {
    //   data.selectedMeasure = false;
    //   this.state.measureId = false;
    //   this.state.measure = {};
    // }

    console.log('MeasuresPage.data.query', data.query)
    console.log('MeasuresPage.data.options', data.options)

    data.measures = Measures.find(data.query, data.options).fetch();
    data.measuresCount = Measures.find(data.query, data.options).count();


    // data.style = Glass.blur(data.style);
    // data.style.appbar = Glass.darkroom(data.style.appbar);
    // data.style.tab = Glass.darkroom(data.style.tab);

    // console.log("MeasuresPage[data]", data);
    return data;
  }

  // this could be a mixin
  handleTabChange(index){
    Session.set('measurePageTabIndex', index);
  }
  handleActive(index){
  }
  // this could be a mixin
  onNewTab(){
    console.log("onNewTab; we should clear things...");

    Session.set('selectedMeasureId', false);
  }
  onCancelUpsertMeasure(context){
    Session.set('measurePageTabIndex', 1);
  }
  onDeleteMeasure(context){
    Measures._collection.remove({_id: get(context, 'state.measureId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('Measures.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedMeasureId', false);
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Measures", recordId: context.state.measureId});
        Bert.alert('Measure removed!', 'success');
      }
    });
    Session.set('measurePageTabIndex', 1);
  }
  onUpsertMeasure(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new Measure...', context.state)

    if(get(context, 'state.measure')){
      let self = context;
      let fhirMeasureData = Object.assign({}, get(context, 'state.measure'));
  
      // if(process.env.NODE_ENV === "test") console.log('fhirMeasureData', fhirMeasureData);
  
      let measureValidator = MeasureSchema.newContext();
      // console.log('measureValidator', measureValidator)
      measureValidator.validate(fhirMeasureData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', measureValidator.isValid())
        console.log('ValidationErrors: ', measureValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.measureId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating measure...");
        }

        delete fhirMeasureData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirMeasureData.resourceType = 'Measure';
  
        Measures._collection.update({_id: get(context, 'state.measureId')}, {$set: fhirMeasureData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("Measures.insert[error]", error);
            Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Measures", recordId: context.state.measureId});
            Session.set('selectedMeasureId', false);
            Session.set('measurePageTabIndex', 1);
            Bert.alert('Measure added!', 'success');
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new measure...", fhirMeasureData);
  
        fhirMeasureData.effectiveDateTime = new Date();
        Measures._collection.insert(fhirMeasureData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('Measures.insert[error]', error);
            Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Measures", recordId: context.state.measureId});
            Session.set('measurePageTabIndex', 1);
            Session.set('selectedMeasureId', false);
            Bert.alert('Measure added!', 'success');
          }
        });
      }
    } 
    Session.set('measurePageTabIndex', 1);
  }
  onTableRowClick(measureId){
    Session.set('selectedMeasureId', measureId);
    Session.set('selectedPatient', Measures.findOne({_id: measureId}));
  }
  onTableCellClick(id){
    Session.set('measuresUpsert', false);
    Session.set('selectedMeasureId', id);
    Session.set('measurePageTabIndex', 2);
  }
  tableActionButtonClick(_id){
    let measure = Measures.findOne({_id: _id});

    // console.log("MeasuresTable.onSend()", measure);

    var httpEndpoint = "http://localhost:8080";
    if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
      httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    }
    HTTP.post(httpEndpoint + '/Measure', {
      data: measure
    }, function(error, result){
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("result", result);
      }
    });
  }
  onInsert(measureId){
    Session.set('selectedMeasureId', false);
    Session.set('measurePageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Measures", recordId: measureId});
  }
  onUpdate(measureId){
    Session.set('selectedMeasureId', false);
    Session.set('measurePageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Measures", recordId: measureId});
  }
  onRemove(measureId){
    Session.set('measurePageTabIndex', 1);
    Session.set('selectedMeasureId', false);
    HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Measures", recordId: measureId});
  }
  onCancel(){
    Session.set('measurePageTabIndex', 1);
  } 
  render() {
    // console.log('MeasuresPage.data', this.data)

    function handleChange(event, newValue) {
      Session.set('measurePageTabIndex', newValue)
    }

    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader', false)){
      headerHeight = 148;
    }

    return (
      <PageCanvas id="measuresPage" headerHeight={headerHeight}>
        <MuiThemeProvider theme={muiTheme} >
          <StyledCard height="auto">
            <CardHeader title={this.data.measuresCount + " Measures"} />
            <CardContent>

              <MeasuresTable 
                hideIdentifier={true} 
                hideCheckboxes={true} 
                hideSubjects={false}
                noDataMessagePadding={100}
                actionButtonLabel="Send"
                measures={ this.data.measures }
                paginationLimit={10}
                hideSubjects={true}
                hideClassCode={false}
                hideReasonCode={false}
                hideReason={false}
                hideHistory={false}
                />

              {/* <Tabs value={this.data.tabIndex} onChange={handleChange.bind(this)} aria-label="simple tabs example">
                <Tab label="History" />
                <Tab label="New" />
              </Tabs>
              <TabPanel value={this.data.tabIndex} index={0}>
                
              </TabPanel>
              <TabPanel value={this.data.tabIndex} index={1}>
                <MeasureDetail 
                  id='newMeasure' 
                  displayDatePicker={true} 
                  displayBarcodes={false}
                  showHints={true}
                  onInsert={ this.onInsert }
                  measure={ this.data.selectedMeasure }
                  measureId={ this.data.selectedMeasureId } 
                  onDelete={ this.onDeleteMeasure }
                  onUpsert={ this.onUpsertMeasure }
                  onCancel={ this.onCancelUpsertMeasure } 
                  />
              </TabPanel> */}

                {/* <Tabs id="measuresPageTabs" default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
                  <Tab className="newMeasureTab" label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0} >
                    <MeasureDetail 
                      id='newMeasure' 
                      displayDatePicker={true} 
                      displayBarcodes={false}
                      showHints={true}
                      onInsert={ this.onInsert }
                      measure={ this.data.selectedMeasure }
                      measureId={ this.data.selectedMeasureId } 

                      onDelete={ this.onDeleteMeasure }
                      onUpsert={ this.onUpsertMeasure }
                      onCancel={ this.onCancelUpsertMeasure } 

                      />
                  </Tab>
                  <Tab className="measureListTab" label='Measures' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                    <MeasuresTable 
                      hideIdentifier={true} 
                      hideSubjects={false}
                      noDataMessagePadding={100}
                      measures={ this.data.measures }
                      paginationLimit={ this.data.pagnationLimit }
                      appWidth={ Session.get('appWidth') }
                      actionButtonLabel="Send"
                      onRowClick={ this.onTableRowClick }
                      onCellClick={ this.onTableCellClick }
                      onActionButtonClick={this.tableActionButtonClick}
                      onRemoveRecord={ this.onDeleteMeasure }
                      query={this.data.measuresTableQuery}
                      />
                  </Tab>
                  <Tab className="measureDetailsTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                    <MeasureDetail 
                      id='measureDetails' 
                      displayDatePicker={true} 
                      displayBarcodes={false}
                      measure={ this.data.selectedMeasure }
                      measureId={ this.data.selectedMeasureId } 
                      showMeasureInputs={true}
                      showHints={false}
                      onInsert={ this.onInsert }

                      onDelete={ this.onDeleteMeasure }
                      onUpsert={ this.onUpsertMeasure }
                      onCancel={ this.onCancelUpsertMeasure } 
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

ReactMixin(MeasuresPage.prototype, ReactMeteorData);
export default MeasuresPage;