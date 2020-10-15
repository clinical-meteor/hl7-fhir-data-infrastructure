// import { CardActions, CardText } from 'material-ui/Card';

// import { Bert } from 'meteor/clinical:alert';
// import DatePicker from 'material-ui/DatePicker';
// import RaisedButton from 'material-ui/RaisedButton';
// import React from 'react';
// import { ReactMeteorData } from 'meteor/react-meteor-data';
// import ReactMixin from 'react-mixin';
// import TextField from 'material-ui/TextField';
// import { browserHistory } from 'react-router';
// import { get } from 'lodash';
// import PropTypes from 'prop-types';

// let defaultAuditEvent = {
//   'resourceType': 'AuditEvent',
//   'status': 'unknown',
//   'identifier': [{
//     'use': 'official',
//     'value': ''
//   }],
//   'code': {
//     'text': ''
//   }
// };


// Session.setDefault('auditEventUpsert', false);
// Session.setDefault('selectedAuditEvent', false);

// export class AuditEventDetail extends React.Component {
//   getMeteorData() {
//     let data = {
//       auditEventId: false,
//       auditEvent: defaultAuditEvent,
//       showDatePicker: false
//     };

//     if(this.props.showDatePicker){
//       data.showDatePicker = this.props.showDatePicker
//     }

//     if (Session.get('auditEventUpsert')) {
//       data.auditEvent = Session.get('auditEventUpsert');
//     } else {
//       // if (Session.get('selectedAuditEvent')) {
//       //   data.auditEventId = Session.get('selectedAuditEvent');
//         console.log("selectedAuditEvent", Session.get('selectedAuditEvent'));

//         let selectedAuditEvent = AuditEvents.findOne({_id: Session.get('selectedAuditEvent')});
//         console.log("selectedAuditEvent", selectedAuditEvent);

//         if (selectedAuditEvent) {
//           data.auditEvent = selectedAuditEvent;
//         }
//       // } else {
//       //   data.auditEvent = defaultAuditEvent;
//       // }
//     }

//     if (Session.get('selectedAuditEvent')) {
//       data.auditEventId = Session.get('selectedAuditEvent');
//     }      

//     return data;
//   }

//   renderDatePicker(showDatePicker, datePickerValue){
//     if (showDatePicker) {
//       return (
//         <DatePicker 
//           name='performedDateTime'
//           hintText="Performed Date/Time" 
//           container="inline" 
//           mode="landscape"
//           value={ datePickerValue ? datePickerValue : ''}    
//           onChange={ this.changeState.bind(this, 'performedDateTime')}      
//           />
//       );
//     }
//   }

//   render() {
//     return (
//       <div id={this.props.id} className="auditEventDetail">
//         <CardText>
//         <TextField
//             id='identifierInput'
//             ref='identifier'
//             name='identifier'
//             floatingLabelText='Identifier'
//             value={ get(this, 'data.auditEvent.identifier[0].value') ? get(this, 'data.auditEvent.identifier[0].value') : ''}
//             onChange={ this.changeState.bind(this, 'identifier')}
//             fullWidth
//             /><br/>
//           <TextField
//             id='codeInput'
//             ref='code'
//             name='code'
//             floatingLabelText='Code'
//             value={this.data.auditEvent.code ? this.data.auditEvent.code.text : ''}
//             onChange={ this.changeState.bind(this, 'code')}
//             fullWidth
//             /><br/>
//           <TextField
//             id='statusInput'
//             ref='status'
//             name='status'
//             floatingLabelText='Status'
//             value={this.data.auditEvent.status ? this.data.auditEvent.status : ''}
//             onChange={ this.changeState.bind(this, 'status')}
//             fullWidth
//             /><br/>


//             <br/>
//           { this.renderDatePicker(this.data.showDatePicker, get(this, 'data.auditEvent.performedDateTime') ) }
//           <br/>

//         </CardText>
//         <CardActions>
//           { this.determineButtons(this.data.auditEventId) }
//         </CardActions>
//       </div>
//     );
//   }


//   determineButtons(auditEventId){
//     if (auditEventId) {
//       return (
//         <div>
//           <RaisedButton id="saveAuditEventButton" label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}}  />
//           <RaisedButton id="deleteAuditEventButton" label="Delete" onClick={this.handleDeleteButton.bind(this)} />

//         </div>
//       );
//     } else {
//       return(
//         <RaisedButton id="saveAuditEventButton" label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
//       );
//     }
//   }



//   // this could be a mixin
//   changeState(field, event, value){
//     let auditEventUpdate;

//     if(process.env.NODE_ENV === "test") console.log("AuditEventDetail.changeState", field, event, value);

//     // by default, assume there's no other data and we're creating a new auditEvent
//     if (Session.get('auditEventUpsert')) {
//       auditEventUpdate = Session.get('auditEventUpsert');
//     } else {
//       auditEventUpdate = defaultAuditEvent;
//     }



//     // if there's an existing auditEvent, use them
//     if (Session.get('selectedAuditEvent')) {
//       auditEventUpdate = this.data.auditEvent;
//     }

//     switch (field) {
//       case "identifier":
//         auditEventUpdate.identifier = [{
//           use: 'official',
//           value: value
//         }];
//         break;
//       case "code":
//         auditEventUpdate.code.text = value;
//         break;
//       case "status":
//         auditEventUpdate.status = value;
//         break;
//       case "performedDateTime":
//         auditEventUpdate.performedDateTime = value;
//         break;

//       default:
//     }

//     if(process.env.NODE_ENV === "test") console.log("auditEventUpdate", auditEventUpdate);
//     Session.set('auditEventUpsert', auditEventUpdate);
//   }

//   handleSaveButton(){
//     let auditEventUpdate = Session.get('auditEventUpsert', auditEventUpdate);

//     if(process.env.NODE_ENV === "test") console.log("auditEventUpdate", auditEventUpdate);


//     if (Session.get('selectedAuditEvent')) {
//       if(process.env.NODE_ENV === "test") console.log("Updating auditEvent...");
//       delete auditEventUpdate._id;

//       // not sure why we're having to respecify this; fix for a bug elsewhere
//       auditEventUpdate.resourceType = 'AuditEvent';

//       AuditEvents.update(
//         {_id: Session.get('selectedAuditEvent')}, {$set: auditEventUpdate }, function(error, result) {
//           if (error) {
//             console.log("error", error);

//             Bert.alert(error.reason, 'danger');
//           }
//           if (result) {
//             HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "AuditEvents", recordId: Session.get('selectedAuditEvent')});
//             Session.set('auditEventPageTabIndex', 1);
//             Session.set('selectedAuditEvent', false);
//             Session.set('auditEventUpsert', false);
//             Bert.alert('AuditEvent updated!', 'success');
//           }
//         });
//     } else {

//       if(process.env.NODE_ENV === "test") console.log("create a new auditEvent", auditEventUpdate);

//       AuditEvents.insert(auditEventUpdate, function(error, result) {
//         if (error) {
//           console.log("error", error);
//           Bert.alert(error.reason, 'danger');
//         }
//         if (result) {
//           HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "AuditEvents", recordId: result});
//           Session.set('auditEventPageTabIndex', 1);
//           Session.set('selectedAuditEvent', false);
//           Session.set('auditEventUpsert', false);
//           Bert.alert('AuditEvent added!', 'success');
//         }
//       });
//     }
//   }

//   handleCancelButton(){
//     Session.set('auditEventPageTabIndex', 1);
//   }

//   handleDeleteButton(){
//     AuditEvent.remove({_id: Session.get('selectedAuditEvent')}, function(error, result){
//       if (error) {
//         Bert.alert(error.reason, 'danger');
//       }
//       if (result) {
//         HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "AuditEvents", recordId: Session.get('selectedAuditEvent')});
//         Session.set('auditEventPageTabIndex', 1);
//         Session.set('selectedAuditEvent', false);
//         Session.set('auditEventUpsert', false);
//         Bert.alert('AuditEvent removed!', 'success');
//       }
//     });
//   }
// }


// AuditEventDetail.propTypes = {
//   id: PropTypes.string,
//   fhirVersion: PropTypes.string,
//   auditEventId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
//   auditEvent: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
// };
// ReactMixin(AuditEventDetail.prototype, ReactMeteorData);
// export default AuditEventDetail;