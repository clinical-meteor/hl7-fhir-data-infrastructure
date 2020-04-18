import { 
  CardActions, 
  CardText, 
  CardTitle, 
  RaisedButton, 
  List,
  ListItem,
  TextField 
} from 'material-ui';
import { get, uniq, compact } from 'lodash';
import {render} from 'react-dom';

import { Bert } from 'meteor/clinical:alert';
import React, {Component} from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import { Questionnaires } from '../lib/Questionnaires';
import { Session } from 'meteor/session';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';


let defaultQuestionnaire = {
  "resourceType" : "Questionnaire"
};

import { IoIosRemoveCircleOutline, IoIosRemoveCircle  } from 'react-icons/io';
import { FaGripLines  } from 'react-icons/fa';



let sortableItemStyle = {
  fontSize: '18px', 
  width: '100%',
  listStyleType: 'none',
  padding: '10px',
  margin: '10px',
  borderBottom: '1px solid lightgray'
}



function ListItemSwitch({value, isSorting, linkId}){
    function selectedItem(linkId){
      console.log("Clicked and selected an item", linkId);

      let currentQuestionnaire = Questionnaires.findOne({_id: Session.get('selectedQuestionnaire')});
      console.log("currentQuestionnaire", currentQuestionnaire);

      let currentItem;
      if (get(currentQuestionnaire, 'item')) {
        currentQuestionnaire.item.forEach(function(item){
          if(item.linkId === linkId){
            currentItem = item;
          }
        });
      }
         
      Session.set('questionnaireDesignerCurrentQuestion', currentItem);
      Session.set('activeQuestionLinkId', linkId);     
    }
    function removeItemFromQuestionnaire(linkId){
      console.log("Removing item with linkId: ", linkId);   

      if (Session.get("selectedQuestionnaire")) {
        console.log("data.questionnaireId", Session.get('data.questionnaireId'));
  
        let currentQuestionnaire = Questionnaires.findOne({_id: Session.get('selectedQuestionnaire')});
        console.log("currentQuestionnaire", currentQuestionnaire);

        let newArray = [];
        if(currentQuestionnaire){
          if(Array.isArray(currentQuestionnaire.item)){
            currentQuestionnaire.item.forEach(function(item){
              if(item.linkId !== linkId){
                newArray.push(item);
              }
            })
          }
        }

        let count = 0;
        newArray.forEach(function(item){
          if(count === 0){
            item.linkId = 1;
          } else {
            item.linkId = Random.id()
          }
          count++;
        })
    
        console.log('newArray', newArray);

        Questionnaires.update({_id: Session.get('selectedQuestionnaire')}, {$set: {
          item: newArray   
        }});      
      }

      return; 
    }

    let rightIcon;

    console.log('ListItemSwitch.isSorting', isSorting)
    console.log('ListItemSwitch.linkId', linkId)

    if(isSorting){
      rightIcon = <FaGripLines style={{top: '15px', right: '15px'}} />;
    } else {
      rightIcon = <IoIosRemoveCircleOutline style={{top: '15px', right: '15px'}} onClick={ removeItemFromQuestionnaire.bind(this, linkId) } />;
    }
    

    switch (value) {
      case 'choice':
        result = <ListItem 
                  style={{padding: '5px', backgroundColor: 'cornflowerblue', borderRadius: '3px'}}
                  primaryText={<p>{value}</p>}
                  secondaryText={<p>{linkId}</p>}
                  rightIconButton={rightIcon}
                  onClick={ selectedItem.bind(this, linkId) }
                  />          
        break;
      case 'update':
        result = <ListItem 
                  style={{padding: '5px', backgroundColor: 'yellow', borderRadius: '3px'}}
                  primaryText={<p>{value}</p>}
                  secondaryText={<p>{linkId}</p>}
                  rightIconButton={rightIcon}
                  onClick={ selectedItem.bind(this, linkId) }
                  />
        break;
      case 'display':
        result = <ListItem 
                  style={{padding: '5px', backgroundColor: 'pink', borderRadius: '3px'}}
                  primaryText={<p>{value}</p>}
                  secondaryText={<p>{linkId}</p>}
                  rightIconButton={rightIcon}
                  onClick={ selectedItem.bind(this, linkId) }
                  />
        break;
      case 'decimal':
        result = <ListItem 
                  style={{padding: '5px', backgroundColor: 'lavender', borderRadius: '3px'}}
                  primaryText={<p>{value}</p>}
                  secondaryText={<p>{linkId}</p>}
                  rightIconButton={rightIcon}
                  onClick={ selectedItem.bind(this, linkId) }
                  />
        break;
      case 'response':
        result = <ListItem 
                  style={{padding: '5px', backgroundColor: 'lightgray', borderRadius: '3px'}}
                  primaryText={<p>{value}</p>}
                  secondaryText={<p>{linkId}</p>}
                  rightIconButton={rightIcon}
                  onClick={ selectedItem.bind(this, linkId) }
                  />
        break;  
      default:
        result = <ListItem 
                  style={sortableItemStyle}
                  primaryText={<p>{value}</p>}
                  secondaryText={<p>{linkId}</p>}
                  rightIconButton={rightIcon}                  
                  onClick={ selectedItem.bind(this, linkId) }
                  />          
        break;
    }  
  return result;
}
const SortableItem = SortableElement(ListItemSwitch);

// const SortableItem = SortableElement(function(value){
//   let result;
//   switch (value) {
//     case 'choice':
//       result = <li style={{padding: '5px', backgroundColor: 'cornflowerblue', borderRadius: '3px'}}>
//         <p>{value}</p>
//       </li>
//       break;
//     case 'update':
//       result = <li style={{padding: '5px', backgroundColor: 'yellow', borderRadius: '3px'}}>
//         <p>{value}</p>
//       </li>
//       break;
//     case 'display':
//       result = <li style={{padding: '5px', backgroundColor: 'pink', borderRadius: '3px'}}>
//         <p>{value}</p>
//       </li>
//       break;
//     case 'decimal':
//       result = <li style={{padding: '5px', backgroundColor: 'lavender', borderRadius: '3px'}}>
//         <p>{value}</p>
//       </li>
//       break;
//     case 'response':
//       result = <li style={{padding: '5px', backgroundColor: 'lightgray', borderRadius: '3px'}}>
//         <p>{value}</p>
//       </li>
//       break;  
//     default:
//       result = <li style={sortableItemStyle}>
//         <p>{value}</p>
//       </li>
//       break;
//   }  
//   return result;
// });

const SortableList = SortableContainer(({items, isSorting}) => {
  return (
    <List style={{cursor: 'pointer', listStyleType: 'none'}}>
      {items.map(function(value, index){
        console.log('SortableList.value', value);
        let displayedText = '';

        if(typeof value === "string"){
          displayedText = value;
        } else if(typeof value === "object"){
          displayedText = get(value, 'text', "");
        }

        console.log('SortableList.sSorting', isSorting)

        let result;
        if(isSorting){
          result = <SortableItem key={`item-${index}`} index={index} value={ displayedText } isSorting={isSorting} linkId={get(value, 'linkId', "")} />
        } else {
          result = <ListItemSwitch key={`item-${index}`} index={index} value={ displayedText } isSorting={isSorting} linkId={get(value, 'linkId', "")} />
        }

        return result;
      })}
    </List>
  );
});



// export class SortableQuestionnaire extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//     state = {
//         items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
//     };
//     componentDidMount() {
//       if(this.props.items){
//         this.setState({items: this.props.items});
//       }
//     };
//     onSortEnd = ({oldIndex, newIndex}) => {
//         this.setState(({items}) => ({
//           items: arrayMove(items, oldIndex, newIndex),
//         }));
//     };
//     render() {
//         console.log('SortableQuestionnaire', this.state)
//         return <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />;
//     }
// }


Session.setDefault('questionnaireUpsert', false);
Session.setDefault('selectedQuestionnaire', false);
Session.setDefault('sortableItems', []);

export class QuestionnaireDetail extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
      items: [{
        text: 'Item 1',
        linkId: 1
      }, {
        text: 'Item 2',
        linkId: 2
      }, {
        text: 'Item 3',
        linkId: 3
      }, {
        text: 'Item 4',
        linkId: 4
      }, {
        text: 'Item 5',
        linkId: 5
      }, {
        text: 'Item 6',
        linkId: 6
      }],
      currentQuestionnaire: false
  };
  // componentDidMount() {
  //   console.log('componentDidMount')
  //   if(this.props.items){
  //     let displayText = [];
  //     this.props.items.forEach(function(item){
  //       console.log('item', item)
  //       displayText.push(get(item, 'text'));              
  //     });

  //     this.setState({items: uniq(displayText)});
  //     console.log('this.state', this.state)
  //   }
  // };
  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.currentQuestionnaire !== this.state.currentQuestionnaire) {
      console.log('Received a questionnaire as a property.', nextProps.currentQuestionnaire)

      let questionnaireItems = [];
      if (get(nextProps, 'currentQuestionnaire.item')) {
        console.log('Iterating through items...')
        nextProps.currentQuestionnaire.item.forEach(function(item){
          console.log('item', item)
          if(get(item, 'text')){
            questionnaireItems.push(get(item, 'text'));              
          } else {
            questionnaireItems.push(get(item, 'type'));              
          }
        });
        console.log('uniq(questionnaireItems)', uniq(compact(questionnaireItems)))
        // this.state.items = uniq(questionnaireItems);
        // this.state.items = get(nextProps, 'currentQuestionnaire.item');
        // this.setState({ items: questionnaireItems });
        this.setState({ items: get(nextProps, 'currentQuestionnaire.item') });
        this.setState({ currentQuestionnaire: nextProps.currentQuestionnaire });
      }

      console.log('this.state', this.state)
    }
  }
  getMeteorData() {
    let data = {
      questionnaireId: false,
      currentQuestionnaire: false,
      isSorting: Session.get('questionnaireIsSorting')
    };

    console.log("QuestionnaireDetail[data]", data);
    return data;
  }
  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({items}) => ({
      items: arrayMove(items, oldIndex, newIndex),
    }));

    Session.set('editedQuestionnaire', {
      questionnaireId: Session.get('selectedQuestionnaire'),
      items: this.state.items
    })
  }
  
  render() {

    let questionnaireDocument;
    let questions = [];

    console.log('QuestionnaireDetail.state', this.state);
    return (
      <div id={ get(this, 'props.id', '')} className="questionnaireDetail">
        <div id='questionnaireDocument'>
          <SortableList items={this.state.items} onSortEnd={this.onSortEnd} isSorting={this.data.isSorting}  />
        </div>
      </div>
    );
  }
  determineButtons(questionnaireId){
    if (questionnaireId) {
      return (
        <div>
          <RaisedButton id='saveQuestionnaireButton' className='saveQuestionnaireButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} />
          <RaisedButton label="Delete" onClick={this.handleDeleteButton.bind(this)} />
        </div>
      );
    } else {
      return(
        <RaisedButton id='saveQuestionnaireButton'  className='saveQuestionnaireButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
      );
    }
  }


  // this could be a mixin
  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('handleSaveButton()');
    let questionnaireUpdate = Session.get('questionnaireUpsert', questionnaireUpdate);


    if (questionnaireUpdate.birthDate) {
      questionnaireUpdate.birthDate = new Date(questionnaireUpdate.birthDate);
    }
    if(process.env.NODE_ENV === "test") console.log("questionnaireUpdate", questionnaireUpdate);

    if (Session.get('selectedQuestionnaire')) {
      if(process.env.NODE_ENV === "test") console.log("Updating questionnaire...");

      delete questionnaireUpdate._id;

      // not sure why we're having to respecify this; fix for a bug elsewhere
      questionnaireUpdate.resourceType = 'Questionnaire';

      Questionnaires.update({_id: Session.get('selectedQuestionnaire')}, {$set: questionnaireUpdate }, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("Questionnaires.insert[error]", error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Questionnaires", recordId: Session.get('selectedQuestionnaire')});
          // Session.set('questionnaireUpdate', defaultQuestionnaire);
          Session.set('questionnaireUpsert', false);
          Session.set('selectedQuestionnaire', false);
          Session.set('questionnairePageTabIndex', 1);
          Bert.alert('Questionnaire added!', 'success');
        }
      });
    } else {
      if(process.env.NODE_ENV === "test") console.log("Creating a new questionnaire...", questionnaireUpdate);

      Questionnaires.insert(questionnaireUpdate, function(error, result) {
        if (error) {
          if(process.env.NODE_ENV === "test")  console.log('Questionnaires.insert[error]', error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Questionnaires", recordId: result});
          Session.set('questionnairePageTabIndex', 1);
          Session.set('selectedQuestionnaire', false);
          Session.set('questionnaireUpsert', false);
          Bert.alert('Questionnaire added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('questionnairePageTabIndex', 1);
  }

  handleDeleteButton(){
    Questionnaires.remove({_id: Session.get('selectedQuestionnaire')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('Questionnaires.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Questionnaires", recordId: Session.get('selectedQuestionnaire')});
        // Session.set('questionnaireUpdate', defaultQuestionnaire);
        Session.set('questionnaireUpsert', false);
        Session.set('questionnairePageTabIndex', 1);
        Session.set('selectedQuestionnaire', false);
        Bert.alert('Questionnaire removed!', 'success');
      }
    });
  }
}

QuestionnaireDetail.propTypes = {
  currentQuestionnaire: PropTypes.object
};
ReactMixin(QuestionnaireDetail.prototype, ReactMeteorData);
export default QuestionnaireDetail;