import { CardText, CardTitle, CardActions, Tab, Tabs, TextField, Toggle, RaisedButton, FlatButton } from 'material-ui';
import { Glass, GlassCard, VerticalCanvas, FullPageCanvas, DynamicSpacer } from 'meteor/clinical:glass-ui';
import { Select, MenuItem } from '@material-ui/core';

import QuestionnaireDetail from './QuestionnaireDetail';
import QuestionnaireTable from './QuestionnaireTable';
import SortableQuestionnaire from './SortableQuestionnaire';


import PropTypes from 'prop-types';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Grid, Col, Row } from 'react-bootstrap';
import { get } from 'lodash';
import { Session } from 'meteor/session';
import { Random } from 'meteor/random';



let defaultQuestionnaire = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};
Session.setDefault('questionnaireFormData', defaultQuestionnaire);
Session.setDefault('questionnaireSearchFilter', '');
Session.setDefault('questionnairePageTabIndex', 0);
Session.setDefault('questionnaireDesignerCurrentQuestion', {
  linkId: 0,
  text: '',
  type: 'question',
  multiplicity: 1,
  multiline: false,
  numerical: false
});
Session.setDefault('questionnaireDesignerCurrentMultiChoice', {label: ''});
Session.setDefault('questionnaireIsSorting', false);

Session.setDefault('enableCurrentQuestionnaire', false);
Session.setDefault('activeQuestionnaireName', 'bar');
Session.setDefault('activeQuestionLinkId', false);

export class QuestionnairesPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('questionnairePageTabIndex'),
      questionnaire: defaultQuestionnaire,
      questionnaireSearchFilter: '',
      currentQuestionnaire: null,
      questionnaireId: false,
      //sortableItems: ['Lorem ipsum?', 'Ipsum foo?', 'Dolar set et?'],
      enabled: Session.get('enableCurrentQuestionnaire'),
      chatbotInstalled: false,
      questionnaireName: '',
      questionnaireDesignerCurrentQuestion: {text: ''},
      questionnaireDesignerCurrentMultiChoice: {label: ''},
      isActive: false,
      isNumber: false,
      isSorting: Session.get('questionnaireIsSorting'),
      activeQuestionLinkId: Session.get('activeQuestionLinkId')
    };

    if (Session.get('questionnaireFormData')) {
      data.questionnaire = Session.get('questionnaireFormData');
    }
    if (Session.get('questionnaireSearchFilter')) {
      data.questionnaireSearchFilter = Session.get('questionnaireSearchFilter');
    }
    if (Session.get("selectedQuestionnaire")) {
      console.log("data.questionnaireId", Session.get('data.questionnaireId'));

        data.currentQuestionnaire = Questionnaires.findOne({_id: Session.get('selectedQuestionnaire')});
        console.log("data.currentQuestionnaire", data.currentQuestionnaire);

        // if (get(data, 'selectedQuestionnaire.item')) {
        //   data.sortableItems = [];
        //   data.currentQuestionnaire.item.forEach(function(item){
        //     console.log('item', item)
        //     data.sortableItems.push(get(item, 'text'));              
        //   });
        // }

        if(get(data, 'currentQuestionnaire.status') === "active"){
          data.isActive = true;
        } else {
          data.isActive = false;
        }

        if(get(data, 'currentQuestionnaire.title')){
          data.questionnaireName = get(data, 'currentQuestionnaire.title');
        } else {
          data.questionnaireName = '';
        }
    }

    if(Session.get('activeQuestionLinkId')){
      console.log('ActiveQuestionLinkId was updated. Checking if it exists in the current questionnaire items.')
      if (Array.isArray(get(data, 'currentQuestionnaire.item'))) {
        data.currentQuestionnaire.item.forEach(function(item){
          if(Session.equals('activeQuestionLinkId', get(item, 'linkId', ''))){      
            console.log('Found.  Updating the question being edited.')
            data.questionnaireDesignerCurrentQuestion = item;
          }  
        });
      } 
    } 

    if (Session.get('questionnaireDesignerCurrentQuestion')) {
      console.log('Selected question not found.  Using dirty state.')
      data.questionnaireDesignerCurrentQuestion = Session.get('questionnaireDesignerCurrentQuestion');
    }

    console.log("QuestionnairesPage[data]", data);
    return data;
  }
  toggleSortStatus(){
    if(Session.equals('questionnaireIsSorting', true)){
      this.saveSortedQuestionnaire();
      Session.set('questionnaireIsSorting', false);
    } else {
      Session.set('questionnaireIsSorting', true);
    }    
  }
  toggleActiveStatus(event, newValue){
    //Session.toggle('enableCurrentQuestionnaire');
    console.log('toggleActiveStatus', event, newValue)
    console.log('toggleActiveStatus currentQuestionnaire id', get(this, 'data.currentQuestionnaire._id'))

    let currentStatus =  get(this, 'data.currentQuestionnaire.status');

    console.log('currentStatus', currentStatus)

    if(currentStatus === 'inactive'){
      Questionnaires.update({_id: get(this, 'data.currentQuestionnaire._id')}, {$set: {
        'status': 'active'
      }});
    } else if (currentStatus === 'active'){
      Questionnaires.update({_id: get(this, 'data.currentQuestionnaire._id')}, {$set: {
        'status': 'inactive'
      }});
    }
  }

  handleTabChange(index){
    Session.set('questionnairePageTabIndex', index);
  }
  selectLanguage(){
    
  }
  onNewTab(){
    Session.set('selectedQuestionnaire', false);
    Session.set('questionnaireUpsert', false);
  }
  addChoice(){
    console.log('addChoice')
  }
  changeText(name, event, newValue){
    console.log('changeText', this, newValue)

    // Session.set('activeQuestionnaireName', newValue);
    // console.log('_id', get(this, 'data.currentQuestionnaire._id'))

    Questionnaires.update({_id: get(this, 'data.currentQuestionnaire._id')}, {$set: {
      'title': newValue
    }});
  }
  saveQuestion(event, activeQuestionLinkId){
    console.log('Saving question to Questionnaire/', get(this, 'data.currentQuestionnaire._id'))
    console.log(' ')
    console.log('Going to try to add the following item: ');
    console.log(Session.get('questionnaireDesignerCurrentQuestion'));
    console.log(' ')
    console.log('ActiveQuestionLinkId', this.data.activeQuestionLinkId);
    console.log(' ')

    let currentItemsArray = get(this, 'data.currentQuestionnaire.item', []);
    console.log('Current questionnaire items:', currentItemsArray)

    let newItems = [];
    if(Array.isArray(currentItemsArray)){
      console.log('Iterating through current items')
      currentItemsArray.forEach(function(item){
        if(Session.equals('activeQuestionLinkId', item.linkId)){
          console.log('Found a match.  Using dirty state.')
          newItems.push(Session.get('questionnaireDesignerCurrentQuestion'));
        } else {
          console.log('No match.  Using the original.')
          newItems.push(item);
        }
      });
    }

    console.log('New items.  Adding to questionnaire.', newItems)
    Questionnaires.update({_id: get(this, 'data.currentQuestionnaire._id')}, {$set: {
      'item': newItems
    }})  
  }
  addQuestion(event, bar, baz){
    console.log('Adding a question to Questionnaire/', get(this, 'data.currentQuestionnaire._id'))
    console.log(' ')
    console.log('Going to try to add the following item: ');
    console.log(Session.get('questionnaireDesignerCurrentQuestion'));
    console.log(' ')
    console.log('Output of current Questionnaire', get(this, 'data.currentQuestionnaire'))
    
    let itemsArray = get(this, 'data.currentQuestionnaire.item', []);
    let newItem = Session.get('questionnaireDesignerCurrentQuestion')
    
    if(itemsArray.length === 0){
      newItem.linkId = 1;
    } else {
      newItem.linkId = Random.id();
    }
    
    console.log(' ')
    console.log("This is the new item we've generated and will be attaching to the questionnaire: ", newItem)
    console.log(' ')

    Questionnaires.update({_id: get(this, 'data.currentQuestionnaire._id')}, {$addToSet: {
      'item': newItem
    }})    
  }
  returnCurrentlySelectedQuestionItem(event){
    console.log('Returning currently selected Question Item')
    return '';
  }
  updateQuestionText(event, newValue){
    // console.log('record id', get(this, 'data.currentQuestionnaire._id'))
    console.log('updateQuestionText', newValue)

    let newQuestionState = Session.get('questionnaireDesignerCurrentQuestion');
    newQuestionState.text = newValue;

    Session.set('questionnaireDesignerCurrentQuestion', newQuestionState);
    console.log('newQuestionState', newQuestionState)
  }
  saveSortedQuestionnaire(){
    // Session.set('editedQuestionnaire', {
    //   questionnaireId: Session.get('selectedQuestionnaire'),
    //   items: this.state.items
    // })

    let editedQuestionnaire = Session.get('editedQuestionnaire');
    let currentQuestionnaire = Questionnaires.findOne(get(editedQuestionnaire, 'questionnaireId'));

    let updatedItemArray = [];

    if(editedQuestionnaire){
      if(Array.isArray(editedQuestionnaire.items)){
        editedQuestionnaire.items.forEach(function(editedItem){
          console.log('editedItem', editedItem)
          
          currentQuestionnaire.item.forEach(function(currentItem){
            console.log('currentItem', currentItem)
            if(editedItem.text === currentItem.text){
              console.log('found match; pushing')
              updatedItemArray.push(currentItem);
            }        
          });
        });
      }
  
      console.log('Current  questionnaire item array: ', currentQuestionnaire.item);
      console.log('Proposed questionnaire item array: ', updatedItemArray);
  
      let count = 0;
      updatedItemArray.forEach(function(item){
        if(count === 0){
          item.linkId = 1;
        } else {
          item.linkId = Random.id()
        }
        count++;
      })  
  
      console.log('Renormalized linkIds: ', updatedItemArray);
  
      if(get(editedQuestionnaire, 'questionnaireId')){
        Questionnaires.update({_id: get(editedQuestionnaire, 'questionnaireId')}, {$set: {
          item: updatedItemArray
        }})
        Session.set('questionnaireIsSorting', false)
      }      
    }
  }
  render() {
    console.log('React.version: ' + React.version);

    let isActiveLabel = 'Active';

    if(this.data.isActive){
      isActiveLabel = 'Active';
    } else {
      isActiveLabel = 'Inactive';
    }

    return (
      <div id="questionnairesPage">
        <FullPageCanvas>
          <Col md={4} style={{position: 'sticky', top: '0px'}}>
            <GlassCard height="auto">
              <CardTitle
                title="Questionnaires"
              />
              <QuestionnaireTable 
                hideCheckboxes={true}
                hideIdentifier={true}
                onRemoveRecord={function(questionnaireId){
                  Questionnaires.remove({_id: questionnaireId})
                }}
              />
            </GlassCard>
          </Col>
          <Col md={4}>
            <CardTitle 
              title='Add Questions' 
              />

            <GlassCard >
              <CardTitle subtitle='Basic Question' />
              <CardText>
                <TextField
                  hintText="Lorem ipsum?"
                  errorText="Question text as it should be displayed."
                  type='text'
                  value={ get(this, 'data.questionnaireDesignerCurrentQuestion.text') }
                  onChange={ this.updateQuestionText.bind(this) }
                  fullWidth />
                <br />
                <TextField
                  errorText="Multiplicity"
                  defaultValue={1}
                  type='number'
                  />
                {/* <Toggle
                  label="Multiline Answer"
                  toggled={ this.data.isActive }
                />
                <Toggle
                  label="Numerical"
                  toggled={ this.data.isNumber }
                /> */}

              </CardText>
              <CardActions>
                <FlatButton id='multilineButton' primary={ this.data.isMultiline } >Multiline</FlatButton>
                <FlatButton id='numericalButton' primary={ this.data.isNumber } >Numerical</FlatButton>
                <FlatButton id='addQuestionButton' onClick={ this.addQuestion.bind(this)} style={{float: 'right'}} >Add</FlatButton>
                <FlatButton id='saveQuestionButton' onClick={ this.saveQuestion.bind(this, this.data.activeQuestionLinkId)} style={{float: 'right'}} >Save</FlatButton>
              </CardActions>
            </GlassCard>
            <DynamicSpacer />

            {/* <GlassCard >
              <CardText>
                <TextField
                  hintText="Lorem ipsum dolor set et..."
                  errorText="Multiline"
                  type='text'
                  multiLine={true}         
                  rows={3}         
                  fullWidth />
              </CardText>
            </GlassCard>
            <DynamicSpacer /> */}

            <GlassCard >
              <CardTitle subtitle='Multiple Choice Question' />
              <CardText>
                <TextField
                  id='multipleChoiceQuestionTitle'
                  hintText="Lorem ipsum...."
                  errorText="Multiple Choice Question"
                  type='text'
                  fullWidth />
                <TextField
                  hintText="Multiple Choice"
                  errorText="New Choice"
                  type='text'
                  style={{paddingLeft: '20px'}}
                  fullWidth />
                  <DynamicSpacer />
                <RaisedButton onClick={this.addChoice} style={{margin: '20px'}}>Add Choice</RaisedButton>
              </CardText>
              <CardActions>
                <FlatButton id='addMultipleChoice'>Add</FlatButton>
              </CardActions>
            </GlassCard>
            <DynamicSpacer />
            

            <GlassCard >
              <CardTitle subtitle='Question Response' />
              <CardText>
                <Toggle
                  label="Response Behavior"
                  toggled={ this.data.isActive }
                />
              </CardText>
              <CardActions>
                <FlatButton id='addMultipleChoice'>Add</FlatButton>
              </CardActions>
            </GlassCard>
            <DynamicSpacer />

            <GlassCard >
              <CardTitle subtitle='Display' />
              <CardText>
                <TextField
                  id='linkUrl'
                  hintText="http://bit.ly/12345"
                  errorText="Link URL"
                  type='text'
                  style={{paddingLeft: '20px'}}
                  fullWidth />
              </CardText>
              <CardActions>
                <FlatButton id='addMultipleChoice'>Add</FlatButton>
              </CardActions>
            </GlassCard>
            <DynamicSpacer />


          </Col>
          <Col md={4} style={{position: 'sticky', top: '0px'}}>
            <CardTitle 
              title='Preview' 
              />
            <GlassCard>
          {/* <CardTitle 
                id='questionnaireTitleInput' 
                title={get(this, 'data.currentQuestionnaire.title')} 
                /> */}
              <CardText>
                <TextField
                  hintText="Questionnaire - My Custom Name"
                  errorText="Please enter a title for your questionnaire."
                  type='text'
                  value={ get(this, 'data.questionnaireName') }
                  onChange={ this.changeText.bind(this, 'name')}
                  fullWidth />
                  <br />

                {/* <Select
                  value={ currentSelectIndex }
                  onChange={this.selectLanguage}
                  style={{
                    position: 'absolute',     
                    right: '20px',
                    top: '20px',
                    marginRight: '20px',
                    width: '240px',
                    fontSize: '150%'
                  }}
                  inputProps={{
                    name: 'age',
                    id: 'age-simple',
                  }}
                >
                  { menuItems }
                </Select> */}
              {/* <br />
              <Toggle
                label="Active"
                toggled={ this.data.isActive }
                onToggle={ this.toggleActiveStatus.bind(this) }
              /> */}
              </CardText>
              <CardActions>
                <FlatButton id='isActiveButton' onClick={this.toggleActiveStatus.bind(this)} primary={ this.data.isActive } >{isActiveLabel}</FlatButton>
                <FlatButton id='isSortingButton' onClick={this.toggleSortStatus.bind(this)} primary={ this.data.isSorting } >Sort</FlatButton>
              </CardActions>
            </GlassCard>
            <DynamicSpacer />

            <GlassCard>
              <CardText>
                <QuestionnaireDetail id='questionnaireDetails' currentQuestionnaire={this.data.currentQuestionnaire} />
              </CardText>
              {/* <CardActions>
                <FlatButton id='saveSortButton' onClick={this.saveSortedQuestionnaire.bind(this)} >Save Sort</FlatButton>
              </CardActions> */}
            </GlassCard>
          </Col>
          
        </FullPageCanvas>
      </div>
    );
  }
}


ReactMixin(QuestionnairesPage.prototype, ReactMeteorData);
export default QuestionnairesPage;