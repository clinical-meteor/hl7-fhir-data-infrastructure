import { get } from 'lodash';

import { Bert } from 'meteor/clinical:alert';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { CardActions, CardText, Card, TextField, RaisedButton } from 'material-ui';
import { Grid, Row, Col, Table } from 'react-bootstrap';

import { Session } from 'meteor/session';


let defaultCommunication = {
  "resourceType" : "Communication",
  "name" : [{
    "text" : "",
    "resourceType" : "HumanName"
  }],
  "active" : true,
  "gender" : "",
  "birthDate" : null,
  "photo" : [{
    url: ""
  }],
  "identifier": [{
    "use": "usual",
    "type": {
      "coding": [
        {
          "system": "http://hl7.org/fhir/v2/0203",
          "code": "MR"
        }
      ]
    },
    "value": ""
  }],
  "test" : false
};


Session.setDefault('communicationUpsert', false);
Session.setDefault('selectedCommunication', false);

export class CommunicationDetail extends React.Component {
  getMeteorData() {
    let data = {
      communicationId: false,
      communication: defaultCommunication
    };

    if (Session.get('communicationUpsert')) {
      data.communication = Session.get('communicationUpsert');
    } else {
      if (Session.get('selectedCommunication')) {
        data.communicationId = Session.get('selectedCommunication');
        console.log("selectedCommunication", Session.get('selectedCommunication'));

        let selectedCommunication = Communications.findOne({_id: Session.get('selectedCommunication')});
        console.log("selectedCommunication", selectedCommunication);

        if (selectedCommunication) {
          data.communication = selectedCommunication;

          if (typeof selectedCommunication.birthDate === "object") {
            data.communication.birthDate = moment(selectedCommunication.birthDate).add(1, 'day').format("YYYY-MM-DD");
          }
        }
      } else {
        data.communication = defaultCommunication;
      }
    }

    if(process.env.NODE_ENV === "test") console.log("CommunicationDetail[data]", data);
    return data;
  }

  render() {
    return (
      <div id={this.props.id} className="communicationDetail">
        <CardText>
            <Row>
              <Col md={2}>
                <TextField
                  id='categoryInput'
                  name='category'
                  floatingLabelText='category'
                  value={ get(this, 'data.communication.category[0].text') }
                  onChange={ this.changeState.bind(this, 'category')}
                  fullWidth
                  /><br/>
              </Col>
              <Col md={6}>
                <TextField
                  id='identifierInput'
                  name='identifier'
                  floatingLabelText='identifier'
                  value={ get(this, 'data.communication.identifier[0].url') }
                  onChange={ this.changeState.bind(this, 'photo')}
                  floatingLabelFixed={false}
                  fullWidth
                  /><br/>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Card zDepth={2} style={{padding: '20px', marginBottom: '20px'}}>
                  <TextField
                    id='subjectInput'
                    name='subject'
                    floatingLabelText='subject'
                    value={ get(this, 'data.communication.subject.display', '') }
                    onChange={ this.changeState.bind(this, 'name')}
                    fullWidth
                    /><br/>
                  <TextField
                    id='sentInput'
                    name='sent'
                    floatingLabelText='sent'
                    value={ moment(get(this, 'data.communication.sent')).format('YYYY-MM-DD hh:mm:ss') }
                    onChange={ this.changeState.bind(this, 'sent')}
                    fullWidth
                    /><br/>
                </Card>
              </Col>
              <Col md={4}>
                <Card zDepth={2} style={{padding: '20px', marginBottom: '20px'}}>
                  <TextField
                    id='definitionInput'
                    name='definition'
                    floatingLabelText='definition'
                    value={ get(this, 'data.communication.definition[0].text') }
                    onChange={ this.changeState.bind(this, 'definition')}
                    fullWidth
                    /><br/>
                  <TextField
                    id='payloadInput'
                    name='payload'
                    floatingLabelText='payload'
                    value={ get(this, 'data.communication.payload[0].contentString') }
                    onChange={ this.changeState.bind(this, 'payload')}
                    fullWidth
                    /><br/>
                </Card>
              
              </Col>
              <Col md={4}>
                <Card zDepth={2} style={{padding: '20px', marginBottom: '20px'}}>
                  <TextField
                    id='recipientInput'
                    name='recipient'
                    floatingLabelText='recipient'
                    onChange={ this.changeState.bind(this, 'recipient')}
                    value={ get(this, 'data.communication.recipient.display', '') }
                    fullWidth
                    /><br/>
                  <TextField
                    id='receivedInput'
                    name='received'
                    floatingLabelText='received'
                    value={ moment(get(this, 'data.communication.received')).format('YYYY-MM-DD hh:mm:ss') }
                    onChange={ this.changeState.bind(this, 'received')}
                    fullWidth
                    /><br/>
                </Card>
                {/* { this.determineButtons(this.data.communicationId) }   */}
              </Col>
            </Row>

        </CardText>
      </div>
    );
  }
  // determineButtons(communicationId){
  //   if (communicationId) {
  //     return (
  //       <div>
  //         <RaisedButton id='saveCommunicationButton' className='saveCommunicationButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} />
  //         <RaisedButton label="Delete" onClick={this.handleDeleteButton.bind(this)} />
  //       </div>
  //     );
  //   } else {
  //     return(
  //         <RaisedButton id='saveCommunicationButton'  className='saveCommunicationButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
  //     );
  //   }
  // }

  changeState(field, event, value){
    let communicationUpdate;

    if(process.env.NODE_ENV === "test") console.log("communicationDetail.changeState", field, event, value);

    // by default, assume there's no other data and we're creating a new communication
    if (Session.get('communicationUpsert')) {
      communicationUpdate = Session.get('communicationUpsert');
    } else {
      communicationUpdate = defaultCommunication;
    }



    // if there's an existing communication, use them
    if (Session.get('selectedCommunication')) {
      communicationUpdate = this.data.communication;
    }

    switch (field) {
      case "subject":
        communicationUpdate.name[0].text = value;
        break;
      case "recipient":
        communicationUpdate.gender = value.toLowerCase();
        break;
      case "sent":
        communicationUpdate.birthDate = value;
        break;
      case "definition":
        communicationUpdate.photo[0].url = value;
        break;
      case "identifier":
        communicationUpdate.identifier[0].value = value;
        break;
      case "category":
        communicationUpdate.identifier[0].value = value;
        break;
        case "payload":
        communicationUpdate.identifier[0].value = value;
        break;
      default:

    }
    // communicationUpdate[field] = value;
    process.env.TRACE && console.log("communicationUpdate", communicationUpdate);

    Session.set('communicationUpsert', communicationUpdate);
  }


  // this could be a mixin
  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('handleSaveButton()');
    let communicationUpdate = Session.get('communicationUpsert', communicationUpdate);


    if (communicationUpdate.birthDate) {
      communicationUpdate.birthDate = new Date(communicationUpdate.birthDate);
    }
    if(process.env.NODE_ENV === "test") console.log("communicationUpdate", communicationUpdate);

    if (Session.get('selectedCommunication')) {
      if(process.env.NODE_ENV === "test") console.log("Updating communication...");

      delete communicationUpdate._id;

      // not sure why we're having to respecify this; fix for a bug elsewhere
      communicationUpdate.resourceType = 'Communication';

      Communications.update({_id: Session.get('selectedCommunication')}, {$set: communicationUpdate }, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("Communications.insert[error]", error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Communications", recordId: Session.get('selectedCommunication')});
          Session.set('communicationUpdate', defaultCommunication);
          Session.set('communicationUpsert', defaultCommunication);
          Session.set('communicationPageTabIndex', 1);
          Bert.alert('Communication added!', 'success');
        }
      });
    } else {
      if(process.env.NODE_ENV === "test") console.log("Creating a new communication...", communicationUpdate);

      Communications.insert(communicationUpdate, function(error, result) {
        if (error) {
          if(process.env.NODE_ENV === "test")  console.log('Communications.insert[error]', error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Communications", recordId: result});
          Session.set('communicationPageTabIndex', 1);
          Session.set('selectedCommunication', false);
          Session.set('communicationUpsert', false);
          Bert.alert('Communication added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('communicationPageTabIndex', 1);
  }

  handleDeleteButton(){
    Communications.remove({_id: Session.get('selectedCommunication')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('Communications.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Communications", recordId: Session.get('selectedCommunication')});
        Session.set('communicationUpdate', defaultCommunication);
        Session.set('communicationUpsert', defaultCommunication);
        Session.set('communicationPageTabIndex', 1);
        Bert.alert('Communication removed!', 'success');
      }
    });
  }
}


ReactMixin(CommunicationDetail.prototype, ReactMeteorData);

export default CommunicationDetail;