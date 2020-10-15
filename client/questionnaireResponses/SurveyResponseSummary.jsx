import React, { useState, useEffect } from 'react';

import { 
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  FormControlLabel,
  Typography,
  Checkbox
} from '@material-ui/core';


import { get, has, uniq, compact } from 'lodash';
import moment from 'moment';

// import { ReactMeteorData } from 'meteor/react-meteor-data';
// import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import { Questionnaires } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import { Session } from 'meteor/session';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';

import  { useTracker } from '../../lib/Tracker';




let defaultQuestionnaire = {
  "resourceType" : "Questionnaire"
};

// icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { Icon } from 'react-icons-kit'
import { ic_reorder } from 'react-icons-kit/md/ic_reorder'


//===========================================================================
// THEMING

let sortableItemStyle = {
  fontSize: '18px', 
  width: '100%',
  listStyleType: 'none',
  padding: '10px',
  margin: '10px',
  borderBottom: '1px solid lightgray'
}



let responseTemplate = {
  "resourceType": "QuestionnaireResponse",
  "identifier": {
    "system": "https://www.symptomatic.io/fhir/Questionnaire/",
    "value": Session.get('selectedResponseId')
  },
  "questionnaire": "Questionnaire/" + Session.get('selectedResponseId'),
  "status": "completed",
  "subject": {
    "display": "Anonymous User",
    "reference": "Patient/Anonymous"
  },
  "authored": new Date(),
  "author": {
    "display": "Anonymous User",
    "reference": "Patient/Anonymous"
  },
  "source": {
    "display": "Symptomatic Gravity App",
    "reference": "https://gravity.symptomatic.healthcare"
  },
  "item": [] 
}

// ====================================================================================================================
// Session Variables  

Session.setDefault('selectedResponse', null);


// ====================================================================================================================
// Main Component  


function SurveyResponseSummary(props){

  let { 
    id,
    children, 
    selectedResponse,
    selectedResponseId,
    sortableItems,
    ...otherProps 
  } = props;


  // ================================================================================
  // Startup

  useEffect(function(){
    if(selectedResponse){

    }
  }, [props.lastUpdated])

  // ================================================================================
  // Trackers

  let lastUpdated = "";
  lastUpdated = useTracker(function(){
    return Session.get('lastUpdated');
  }, [])


  // ================================================================================
  // Styling

  let styles = {
    identifier: {
      fontWeight: 'bold'
    },
    description: {
      position: 'absolute',
      marginLeft: '120px'
    },
    expansionPanel: {
      marginRight: '40px'
    }
  }

  let questionAnswers = [];





  // we're going to get a question, along with the indices for where it exists in the hierarcy, up to two levels deep
  function parseAnswers(answer, answerIndex){
    console.log('Parsing answers', answer, answerIndex, selectedResponse)
    let stringToRender = ""    

    if(Array.isArray(answer)){
      stringToRender = get(answer[0], 'valueCoding.display');
    }
                    
    return stringToRender;
  }


  // do we have question items to display in expansion panels
  console.log('selectedResponse (pre main render)', selectedResponse)
  if(selectedResponse){
    // should be our sections
    if(Array.isArray(selectedResponse.item)){
      selectedResponse.item.forEach(function(renderItem, renderItemIndex){



        // should be the questions
        if(Array.isArray(renderItem.item)){
          questionAnswers.push(<h3 key={'section-' + renderItemIndex} style={{width: '100%', borderTop: '1px solid lightgray', marginTop: '10px'}}>{get(renderItem, 'text')}</h3>)
          renderItem.item.forEach(function(questionItem, questionItemIndex){

            questionAnswers.push(<p key={'question-' + renderItemIndex + '-' + questionItemIndex} >Q: {get(questionItem, 'text')}</p>)
            
            if(Array.isArray(questionItem.answer)){
              questionAnswers.push(<h4 key={'answer-' + renderItemIndex + '-' + questionItemIndex}>{parseAnswers(questionItem.answer)}</h4>)
            }     
          });
        } else {
          questionAnswers.push(<p key={'section-' + renderItemIndex} >Q: {get(renderItem, 'text')}</p>)
        }

        if(Array.isArray(renderItem.answer)){
          questionAnswers.push(<h4 key={'answer-' + renderItemIndex}>{parseAnswers(renderItem.answer)}</h4>)
        } 

      });  
    }  
  }  

  console.log('questionAnswers', questionAnswers)

  return (
    <div id={id} className="questionnaireResponseSummary">
      <div id='questionnaireResponseSummary'>
        { questionAnswers }
      </div>
    </div>
  );
}

SurveyResponseSummary.propTypes = {
  id: PropTypes.string,
  selectedResponse: PropTypes.object,
  selectedResponseId: PropTypes.string,
  sortableItems: PropTypes.array
};

SurveyResponseSummary.defaultProps = {
  selectedResponse: null
}

export default SurveyResponseSummary;