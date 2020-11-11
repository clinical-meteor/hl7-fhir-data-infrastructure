
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
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

// import ObservationDetail from './ObservationDetail';
import ObservationsTable from './ObservationsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { get } from 'lodash';


//=============================================================================================================================================
// COMPONENT

Session.setDefault('observationPageTabIndex', 1);
Session.setDefault('observationSearchFilter', '');
Session.setDefault('selectedObservationId', false);
Session.setDefault('fhirVersion', 'v1.0.2');

export function ObservationsPage(props){

  let data = {
    selectedObservationId: '',
    selectedObservation: null,
    observations: [],
    onePageLayout: true
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('ObservationsPage.onePageLayout');
  }, [])
  data.selectedObservationId = useTracker(function(){
    return Session.get('selectedObservationId');
  }, [])
  data.selectedObservation = useTracker(function(){
    return Observations.findOne({_id: Session.get('selectedObservationId')});
  }, [])
  data.observations = useTracker(function(){
    return Observations.find().fetch();
  }, [])


  function onDeleteObservation(context){
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
  function onUpsertObservation(context){
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
  function onTableRowClick(observationId){
    Session.set('selectedObservationId', observationId);
    Session.set('selectedPatient', Observations.findOne({_id: observationId}));
  }
  function onTableCellClick(id){
    Session.set('observationsUpsert', false);
    Session.set('selectedObservationId', id);
    Session.set('observationPageTabIndex', 2);
  }
  function tableActionButtonClick(_id){
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
  function onRemove(observationId){
    Session.set('observationPageTabIndex', 1);
    Session.set('selectedObservationId', false);
    HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: observationId});
  }

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
  
  let cardWidth = window.innerWidth - paddingWidth;

  return (
    <PageCanvas id="observationsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
          <CardHeader title={this.data.observationsCount + " Observations"} />
          <CardContent>
            <ObservationsTable 
              formFactorLayout={formFactor}
              observations={ this.data.observations }
              count={ this.data.observationsCount }
              rowsPerPage={LayoutHelpers.calcTableRows()}
              actionButtonLabel="Send"
              onRowClick={ this.onTableRowClick }
              onCellClick={ this.onTableCellClick }
              onActionButtonClick={this.tableActionButtonClick}
              onRemoveRecord={ this.onDeleteObservation }
              tableRowSize="medium"
            />
          </CardContent>            
      </StyledCard>
    </PageCanvas>
  );
}


export default ObservationsPage;