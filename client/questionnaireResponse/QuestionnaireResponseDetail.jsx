import { CardActions, CardText, RaisedButton, TextField } from 'material-ui';
import { get, find } from 'lodash';

import { Bert } from 'meteor/clinical:alert';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Session } from 'meteor/session';
import { copyFileSync } from 'fs';




Session.setDefault('questionnaireResponseUpsert', false);
Session.setDefault('selectedQuestionnaireResponse', false);

export class QuestionnaireResponseDetail extends React.Component {
  getMeteorData() {
    let data = {
      questionnaireResponseId: false,
      questionnaireResponse: null,
      originalQuestionnaire: null,
      originalQuestionnaireId: false
    };

    if(this.props.currentQuestionnaireResponse){
      data.questionnaireResponse = this.props.currentQuestionnaireResponse;

      if(get(this, 'props.currentQuestionnaireResponse.questionnaire.reference')){
        data.originalQuestionnaireId = get(this, 'props.currentQuestionnaireResponse.questionnaire.reference');
        data.originalQuestionnaireId = data.originalQuestionnaireId.split('/')[1];
        data.originalQuestionnaire = Questionnaires.findOne({id: data.originalQuestionnaireId});
      }
    }

    if(process.env.NODE_ENV === "test") console.log("QuestionnaireResponseDetail[data]", data);
    return data;
  }

  render() {

    console.log('QuestionnaireResponseDetail.this.data', this.data);

    let inputs = [];    
    let items = get(this, 'data.questionnaireResponse.item', []);

    console.log('QuestionnaireResponseDetail.items', items);

    items.forEach(function(item){
      console.log('item', item)
      console.log('item.linkId', item.linkId)

      inputs.push(<TextField
        id={ get(item, 'linkId') + '_question'}
        key={ get(item, 'linkId') + '_key'}
        name={ get(item, 'linkId') + '_name'}
        value={ get(item, 'answer[0].valueCoding.code', '')}
        floatingLabelText={ get(item, 'text') + '_key'}
        //onChange={ this.changeState.bind(this, 'name')}
        fullWidth
      />)        
  })
    
    return (
      <div id={this.props.id} key={this.props.id} className="questionnaireResponseDetail">
        <CardText>
          { inputs }
        </CardText>
        <CardActions>
          { this.determineButtons(this.data.questionnaireResponseId) }
        </CardActions>
      </div>
    );
  }
  determineButtons(questionnaireResponseId){
    if (questionnaireResponseId) {
      return (
        <div>
          <RaisedButton id='saveQuestionnaireResponseButton' className='saveQuestionnaireResponseButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} />
          <RaisedButton label="Delete" onClick={this.handleDeleteButton.bind(this)} />
        </div>
      );
    } else {
      return(
        <RaisedButton id='saveQuestionnaireResponseButton'  className='saveQuestionnaireResponseButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
      );
    }
  }

  changeState(field, event, value){
    console.log("questionnaireResponseDetail.changeState", field, event, value);
  }


  // this could be a mixin
  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('handleSaveButton()');
    let questionnaireResponseUpdate = Session.get('questionnaireResponseUpsert', questionnaireResponseUpdate);


    if (questionnaireResponseUpdate.birthDate) {
      questionnaireResponseUpdate.birthDate = new Date(questionnaireResponseUpdate.birthDate);
    }
    if(process.env.NODE_ENV === "test") console.log("questionnaireResponseUpdate", questionnaireResponseUpdate);

    if (Session.get('selectedQuestionnaireResponse')) {
      if(process.env.NODE_ENV === "test") console.log("Updating questionnaireResponse...");

      delete questionnaireResponseUpdate._id;

      // not sure why we're having to respecify this; fix for a bug elsewhere
      questionnaireResponseUpdate.resourceType = 'QuestionnaireResponse';

      QuestionnaireResponses.update({_id: Session.get('selectedQuestionnaireResponse')}, {$set: questionnaireResponseUpdate }, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("QuestionnaireResponses.insert[error]", error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "QuestionnaireResponses", recordId: Session.get('selectedQuestionnaireResponse')});
          // Session.set('questionnaireResponseUpdate', defaultQuestionnaireResponse);
          Session.set('questionnaireResponseUpsert', false);
          Session.set('selectedQuestionnaireResponse', false);
          Session.set('questionnaireResponsePageTabIndex', 1);
          Bert.alert('QuestionnaireResponse added!', 'success');
        }
      });
    } else {
      if(process.env.NODE_ENV === "test") console.log("Creating a new questionnaireResponse...", questionnaireResponseUpdate);

      QuestionnaireResponses.insert(questionnaireResponseUpdate, function(error, result) {
        if (error) {
          if(process.env.NODE_ENV === "test")  console.log('QuestionnaireResponses.insert[error]', error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "QuestionnaireResponses", recordId: result});
          Session.set('questionnaireResponsePageTabIndex', 1);
          Session.set('selectedQuestionnaireResponse', false);
          Session.set('questionnaireResponseUpsert', false);
          Bert.alert('QuestionnaireResponse added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('questionnaireResponsePageTabIndex', 1);
  }

  handleDeleteButton(){
    QuestionnaireResponses.remove({_id: Session.get('selectedQuestionnaireResponse')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('QuestionnaireResponses.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "QuestionnaireResponses", recordId: Session.get('selectedQuestionnaireResponse')});
        // Session.set('questionnaireResponseUpdate', defaultQuestionnaireResponse);
        Session.set('questionnaireResponseUpsert', false);
        Session.set('questionnaireResponsePageTabIndex', 1);
        Session.set('selectedQuestionnaireResponse', false);
        Bert.alert('QuestionnaireResponse removed!', 'success');
      }
    });
  }
}


ReactMixin(QuestionnaireResponseDetail.prototype, ReactMeteorData);
export default QuestionnaireResponseDetail;