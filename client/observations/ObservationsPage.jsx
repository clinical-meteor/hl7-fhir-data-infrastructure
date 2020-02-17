
import { 
  Grid, 
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
import { StyledCard, PageCanvas, DynamicSpacer } from 'material-fhir-ui';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import ObservationDetail from './ObservationDetail';
import ObservationsTable from './ObservationsTable';

import { get } from 'lodash';

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
// COMPONENT

Session.setDefault('observationPageTabIndex', 1);
Session.setDefault('observationSearchFilter', '');
Session.setDefault('selectedObservationId', false);
Session.setDefault('fhirVersion', 'v1.0.2');

export class ObservationsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      observationId: false,
      observation: {}
    }
  } 
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('observationPageTabIndex'),
      observationSearchFilter: Session.get('observationSearchFilter'),
      fhirVersion: Session.get('fhirVersion'),
      selectedObservationId: Session.get("selectedObservationId"),
      paginationLimit: 100,
      selectedObservation: false,
      selected: [],
      observations: [],
      observationsCount: 0
    };

    // number of items in the table should be set globally
    if (get(Meteor, 'settings.public.defaults.paginationLimit')) {
      data.paginationLimit = get(Meteor, 'settings.public.defaults.paginationLimit');
    }

    if (Session.get('selectedObservationId')){
      data.selectedObservation = Observations.findOne({_id: Session.get('selectedObservationId')});
      this.state.observation = Observations.findOne({_id: Session.get('selectedObservationId')});
      this.state.observationId = Session.get('selectedObservationId');
    } else {
      data.selectedObservation = false;
      this.state.observationId = false;
      this.state.observation = {}
    }

    data.observations = Observations.find().fetch();
    data.observationsCount = Observations.find().count();

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    if(get(Meteor, 'settings.public.logging') === "debug") console.log("ObservationsPage[data]", data);
    return data;
  }

  // this could be a mixin
  handleTabChange(index){
    Session.set('observationPageTabIndex', index);
  }
  handleActive(index){
  }
  // this could be a mixin
  onNewTab(){
    console.log("onNewTab; we should clear things...");

    Session.set('selectedObservationId', false);
    // Session.set('observationDetailState', {
    //   resourceType: 'Observation',
    //   status: 'preliminary',
    //   category: {
    //     text: ''
    //   },
    //   effectiveDateTime: '',
    //   subject: {
    //     display: '',
    //     reference: ''
    //   },
    //   performer: {
    //     display: '',
    //     reference: ''
    //   },
    //   device: {
    //     display: '',
    //     reference: ''
    //   },
    //   valueQuantity: {
    //     value: '',
    //     unit: '',
    //     system: 'http://unitsofmeasure.org'
    //   }
    // });
  }
  onCancelUpsertObservation(context){
    Session.set('observationPageTabIndex', 1);
  }
  onDeleteObservation(context){
    Observations._collection.remove({_id: get(context, 'state.observationId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('Observations.insert[error]', error);
        // Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedObservationId', false);
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: context.state.observationId});
        // Bert.alert('Observation removed!', 'success');
      }
    });
    Session.set('observationPageTabIndex', 1);
  }
  onUpsertObservation(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new Observation...', context.state)

    if(get(context, 'state.observation')){
      let self = context;
      let fhirObservationData = Object.assign({}, get(context, 'state.observation'));
  
      // if(process.env.NODE_ENV === "test") console.log('fhirObservationData', fhirObservationData);
  
      let observationValidator = ObservationSchema.newContext();
      // console.log('observationValidator', observationValidator)
      observationValidator.validate(fhirObservationData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', observationValidator.isValid())
        console.log('ValidationErrors: ', observationValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.observationId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating observation...");
        }

        delete fhirObservationData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirObservationData.resourceType = 'Observation';
  
        Observations._collection.update({_id: get(context, 'state.observationId')}, {$set: fhirObservationData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("Observations.insert[error]", error);
            // Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: context.state.observationId});
            Session.set('selectedObservationId', false);
            Session.set('observationPageTabIndex', 1);
            // Bert.alert('Observation added!', 'success');
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new observation...", fhirObservationData);
  
        fhirObservationData.effectiveDateTime = new Date();
        Observations._collection.insert(fhirObservationData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('Observations.insert[error]', error);
            // Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: context.state.observationId});
            Session.set('observationPageTabIndex', 1);
            Session.set('selectedObservationId', false);
            // Bert.alert('Observation added!', 'success');
          }
        });
      }
    } 
    Session.set('observationPageTabIndex', 1);
  }
  onTableRowClick(observationId){
    Session.set('selectedObservationId', observationId);
    Session.set('selectedPatient', Observations.findOne({_id: observationId}));
  }
  onTableCellClick(id){
    Session.set('observationsUpsert', false);
    Session.set('selectedObservationId', id);
    Session.set('observationPageTabIndex', 2);
  }
  tableActionButtonClick(_id){
    let observation = Observations.findOne({_id: _id});

    // console.log("ObservationTable.onSend()", observation);

    var httpEndpoint = "http://localhost:8080";
    if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
      httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    }
    HTTP.post(httpEndpoint + '/Observation', {
      data: observation
    }, function(error, result){
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("result", result);
      }
    });
  }
  onInsert(observationId){
    Session.set('selectedObservationId', false);
    Session.set('observationPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: observationId});
  }
  onUpdate(observationId){
    Session.set('selectedObservationId', false);
    Session.set('observationPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: observationId});
  }
  onRemove(observationId){
    Session.set('observationPageTabIndex', 1);
    Session.set('selectedObservationId', false);
    HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: observationId});
  }
  onCancel(){
    Session.set('observationPageTabIndex', 1);
  }
  render() {
    
    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader')){
      headerHeight = 128;
    }

    return (
      <div id="observationsPage">
        <StyledCard height="auto" scrollable={true} margin={20} headerHeight={headerHeight} >
            <CardHeader title="Observations" />
            <CardContent>
              <Tabs id="allergyIntolerancesPageTabs" value={this.data.tabIndex} onChange={this.handleTabChange } aria-label="simple tabs example">
                <Tab label="History" value={0} />
                <Tab label="New" value={1} />
              </Tabs>
              <TabPanel >
                <ObservationsTable 
                  displayBarcodes={false} 
                  multiline={false}
                  hideSubjects={true}
                  hideDevices={true}
                  multiline={false}                  
                  hideComparator={true}
                  hideValue={false}
                  noDataMessagePadding={100}
                  observations={ this.data.observations }
                  count={ this.data.observationsCount }
                  rowsPerPage={20}
                  actionButtonLabel="Send"
                  onRowClick={ this.onTableRowClick }
                  onCellClick={ this.onTableCellClick }
                  onActionButtonClick={this.tableActionButtonClick}
                  onRemoveRecord={ this.onDeleteObservation }
                  />
              </TabPanel >
              <TabPanel >
                <ObservationDetail 
                  id='observationDetails' 
                  displayDatePicker={true} 
                  displayBarcodes={false}
                  observation={ this.data.selectedObservation }
                  observationId={ this.data.selectedObservationId } 
                  showObservationInputs={true}
                  showHints={false}
                  onInsert={ this.onInsert }

                  onDelete={ this.onDeleteObservation }
                  onUpsert={ this.onUpsertObservation }
                  onCancel={ this.onCancelUpsertObservation } 
              />
              </TabPanel >
            </CardContent>            
        </StyledCard>
      </div>
    );
  }
}


ReactMixin(ObservationsPage.prototype, ReactMeteorData);
export default ObservationsPage;