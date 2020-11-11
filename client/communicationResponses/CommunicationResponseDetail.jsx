import React from 'react';

import { 
  Grid, 
  Container,
  Button,
  Typography,
  DatePicker,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  TextField,
  Card,
  CardContent
} from '@material-ui/core';

import { get } from 'lodash';
import moment from 'moment';

import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Session } from 'meteor/session';


let defaultCommunicationResponse = {
  "resourceType" : "CommunicationResponse",
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


Session.setDefault('communicationResponseUpsert', false);
Session.setDefault('selectedCommunicationResponse', false);

export class CommunicationResponseDetail extends React.Component {
  getMeteorData() {
    let data = {
      communicationResponseId: false,
      communicationResponse: defaultCommunicationResponse
    };

    if (Session.get('communicationResponseUpsert')) {
      data.communicationResponse = Session.get('communicationResponseUpsert');
    } else {
      if (Session.get('selectedCommunicationResponse')) {
        data.communicationResponseId = Session.get('selectedCommunicationResponse');
        console.log("selectedCommunicationResponse", Session.get('selectedCommunicationResponse'));

        let selectedCommunicationResponse = CommunicationResponses.findOne({_id: Session.get('selectedCommunicationResponse')});
        console.log("selectedCommunicationResponse", selectedCommunicationResponse);

        if (selectedCommunicationResponse) {
          data.communicationResponse = selectedCommunicationResponse;

          if (typeof selectedCommunicationResponse.birthDate === "object") {
            data.communicationResponse.birthDate = moment(selectedCommunicationResponse.birthDate).add(1, 'day').format("YYYY-MM-DD");
          }
        }
      } else {
        data.communicationResponse = defaultCommunicationResponse;
      }
    }

    if(process.env.NODE_ENV === "test") console.log("CommunicationResponseDetail[data]", data);
    return data;
  }

  render() {
    return (
      <div id={this.props.id} className="communicationResponseDetail">
        <CardContent>
            <Grid container>
              <Grid item md={2}>
                <TextField
                  id='categoryInput'
                  name='category'
                  floatingLabelText='category'
                  value={ get(this, 'data.communicationResponse.category[0].text') }
                  onChange={ this.changeState.bind(this, 'category')}
                  fullWidth
                  /><br/>
              </Grid>
              <Grid item md={6}>
                <TextField
                  id='identifierInput'
                  name='identifier'
                  floatingLabelText='identifier'
                  value={ get(this, 'data.communicationResponse.identifier[0].url') }
                  onChange={ this.changeState.bind(this, 'photo')}
                  floatingLabelFixed={false}
                  fullWidth
                  /><br/>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={4}>
                <Card zDepth={2} style={{padding: '20px', marginBottom: '20px'}}>
                  <TextField
                    id='subjectInput'
                    name='subject'
                    floatingLabelText='subject'
                    value={ get(this, 'data.communicationResponse.subject.display', '') }
                    onChange={ this.changeState.bind(this, 'name')}
                    fullWidth
                    /><br/>
                  <TextField
                    id='sentInput'
                    name='sent'
                    floatingLabelText='sent'
                    value={ moment(get(this, 'data.communicationResponse.sent')).format('YYYY-MM-DD hh:mm:ss') }
                    onChange={ this.changeState.bind(this, 'sent')}
                    fullWidth
                    /><br/>
                </Card>
              </Grid>
              <Grid item md={4}>
                <Card zDepth={2} style={{padding: '20px', marginBottom: '20px'}}>
                  <TextField
                    id='definitionInput'
                    name='definition'
                    floatingLabelText='definition'
                    value={ get(this, 'data.communicationResponse.definition[0].text') }
                    onChange={ this.changeState.bind(this, 'definition')}
                    fullWidth
                    /><br/>
                  <TextField
                    id='payloadInput'
                    name='payload'
                    floatingLabelText='payload'
                    value={ get(this, 'data.communicationResponse.payload[0].contentString') }
                    onChange={ this.changeState.bind(this, 'payload')}
                    fullWidth
                    /><br/>
                </Card>
              
              </Grid>
              <Grid item md={4}>
                <Card zDepth={2} style={{padding: '20px', marginBottom: '20px'}}>
                  <TextField
                    id='recipientInput'
                    name='recipient'
                    floatingLabelText='recipient'
                    onChange={ this.changeState.bind(this, 'recipient')}
                    value={ get(this, 'data.communicationResponse.recipient.display', '') }
                    fullWidth
                    /><br/>
                  <TextField
                    id='receivedInput'
                    name='received'
                    floatingLabelText='received'
                    value={ moment(get(this, 'data.communicationResponse.received')).format('YYYY-MM-DD hh:mm:ss') }
                    onChange={ this.changeState.bind(this, 'received')}
                    fullWidth
                    /><br/>
                </Card>
                {/* { this.determineButtons(this.data.communicationResponseId) }   */}
              </Grid>
            </Grid>

        </CardContent>
      </div>
    );
  }
  // determineButtons(communicationResponseId){
  //   if (communicationResponseId) {
  //     return (
  //       <div>
  //         <RaisedButton id='saveCommunicationResponseButton' className='saveCommunicationResponseButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} />
  //         <RaisedButton label="Delete" onClick={this.handleDeleteButton.bind(this)} />
  //       </div>
  //     );
  //   } else {
  //     return(
  //         <RaisedButton id='saveCommunicationResponseButton'  className='saveCommunicationResponseButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
  //     );
  //   }
  // }

  changeState(field, event, value){
    let communicationResponseUpdate;

    if(process.env.NODE_ENV === "test") console.log("communicationResponseDetail.changeState", field, event, value);

    // by default, assume there's no other data and we're creating a new communicationResponse
    if (Session.get('communicationResponseUpsert')) {
      communicationResponseUpdate = Session.get('communicationResponseUpsert');
    } else {
      communicationResponseUpdate = defaultCommunicationResponse;
    }



    // if there's an existing communicationResponse, use them
    if (Session.get('selectedCommunicationResponse')) {
      communicationResponseUpdate = this.data.communicationResponse;
    }

    switch (field) {
      case "subject":
        communicationResponseUpdate.name[0].text = value;
        break;
      case "recipient":
        communicationResponseUpdate.gender = value.toLowerCase();
        break;
      case "sent":
        communicationResponseUpdate.birthDate = value;
        break;
      case "definition":
        communicationResponseUpdate.photo[0].url = value;
        break;
      case "identifier":
        communicationResponseUpdate.identifier[0].value = value;
        break;
      case "category":
        communicationResponseUpdate.identifier[0].value = value;
        break;
        case "payload":
        communicationResponseUpdate.identifier[0].value = value;
        break;
      default:

    }
    // communicationResponseUpdate[field] = value;
    process.env.TRACE && console.log("communicationResponseUpdate", communicationResponseUpdate);

    Session.set('communicationResponseUpsert', communicationResponseUpdate);
  }


  // this could be a mixin
  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('handleSaveButton()');
    let communicationResponseUpdate = Session.get('communicationResponseUpsert', communicationResponseUpdate);


    if (communicationResponseUpdate.birthDate) {
      communicationResponseUpdate.birthDate = new Date(communicationResponseUpdate.birthDate);
    }
    if(process.env.NODE_ENV === "test") console.log("communicationResponseUpdate", communicationResponseUpdate);

    if (Session.get('selectedCommunicationResponse')) {
      if(process.env.NODE_ENV === "test") console.log("Updating communicationResponse...");

      delete communicationResponseUpdate._id;

      // not sure why we're having to respecify this; fix for a bug elsewhere
      communicationResponseUpdate.resourceType = 'CommunicationResponse';

      CommunicationResponses.update({_id: Session.get('selectedCommunicationResponse')}, {$set: communicationResponseUpdate }, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("CommunicationResponses.insert[error]", error);
          //Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "CommunicationResponses", recordId: Session.get('selectedCommunicationResponse')});
          Session.set('communicationResponseUpdate', defaultCommunicationResponse);
          Session.set('communicationResponseUpsert', defaultCommunicationResponse);
          Session.set('communicationResponsePageTabIndex', 1);
          //Bert.alert('CommunicationResponse added!', 'success');
        }
      });
    } else {
      if(process.env.NODE_ENV === "test") console.log("Creating a new communicationResponse...", communicationResponseUpdate);

      CommunicationResponses.insert(communicationResponseUpdate, function(error, result) {
        if (error) {
          if(process.env.NODE_ENV === "test")  console.log('CommunicationResponses.insert[error]', error);
          //Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "CommunicationResponses", recordId: result});
          Session.set('communicationResponsePageTabIndex', 1);
          Session.set('selectedCommunicationResponse', false);
          Session.set('communicationResponseUpsert', false);
          //Bert.alert('CommunicationResponse added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('communicationResponsePageTabIndex', 1);
  }

  handleDeleteButton(){
    CommunicationResponses.remove({_id: Session.get('selectedCommunicationResponse')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('CommunicationResponses.insert[error]', error);
        //Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "CommunicationResponses", recordId: Session.get('selectedCommunicationResponse')});
        Session.set('communicationResponseUpdate', defaultCommunicationResponse);
        Session.set('communicationResponseUpsert', defaultCommunicationResponse);
        Session.set('communicationResponsePageTabIndex', 1);
        //Bert.alert('CommunicationResponse removed!', 'success');
      }
    });
  }
}


ReactMixin(CommunicationResponseDetail.prototype, ReactMeteorData);

export default CommunicationResponseDetail;