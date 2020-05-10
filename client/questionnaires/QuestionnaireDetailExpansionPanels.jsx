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


import { get, uniq, compact } from 'lodash';
import moment from 'moment';

// import { ReactMeteorData } from 'meteor/react-meteor-data';
// import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import { Questionnaires } from '../../lib/schemas/Questionnaires';

import { Session } from 'meteor/session';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';


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


// ====================================================================================================================
// Session Variables  
Session.setDefault('questionnaireUpsert', false);
Session.setDefault('selectedQuestionnaire', false);
Session.setDefault('sortableItems', []);


// ====================================================================================================================
// Main Component  


function QuestionnaireDetailExpansionPanels(props){

  let { 
    children, 
    selectedQuestionnaire,
    selectedQuestionnaireId,
    sortableItems,
    ...otherProps 
  } = props;

  // console.log('QuestionnaireDetailExpansionPanels.selectedQuestionnaireId', selectedQuestionnaireId);
  // console.log('QuestionnaireDetailExpansionPanels.selectedQuestionnaire', selectedQuestionnaire);

  const [isSorting, setIsSorting] = useState(false);
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState(selectedQuestionnaire);


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

  let questionnaireDocument;
  let questions = [];

  let questionPanels = [];

  function handleToggleItem(event, foo){
    console.log('handleToggleItem', event, foo)
  }

  if(get(selectedQuestionnaire, 'item')){
    if(Array.isArray(get(selectedQuestionnaire, 'item'))){
      selectedQuestionnaire.item.forEach(function(item){

        let answerChoices = [];

        if(get(item, 'answerOption')){
          if(Array.isArray(get(item, 'answerOption'))){
            let answerOptions = get(item, 'answerOption');
            answerOptions.forEach(function(option){
              answerChoices.push(<ListItem style={{paddingLeft: '120px'}}>
                <ListItemIcon>
                  <Checkbox name="checkedDateRangeEnabled" />
                </ListItemIcon>
                <ListItemText>
                  { get(option, 'valueCoding.display') }
                </ListItemText>
              </ListItem>);
            })
          }
        }

        questionPanels.push(<ExpansionPanel style={styles.expansionPanel}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-m2-content" id="panel-m2-header" >
            <Typography className="measure-identifier" style={styles.identifier}>{get(item, 'code.code')}</Typography>
            {/* <Typography id="panel-m2-measure-score" className="measure-score" style={styles.score}>{get(item, 'type')}</Typography>             */}
            <Typography className="measure-description" style={styles.description}>
              {get(item, 'text')}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className="measure-details" style={{display: 'block'}}>
            <List>
              { answerChoices }
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>)   
      });  
    }
  }


  

  return (
    <div id={ get(this, 'props.id', '')} className="questionnaireDetail">
      <div id='questionnaireDocument'>
        { questionPanels }
      </div>
    </div>
  );
}

QuestionnaireDetailExpansionPanels.propTypes = {
  selectedQuestionnaire: PropTypes.object,
  selectedQuestionnaireId: PropTypes.string,
  sortableItems: PropTypes.array
};

QuestionnaireDetailExpansionPanels.defaultProps = {
  sortableItems: [{
    text: 'Sample Item 1',
    linkId: 1
  }, {
    text: 'Sample Item 2',
    linkId: 2
  }, {
    text: 'Sample Item 3',
    linkId: 3
  }, {
    text: 'Sample Item 4',
    linkId: 4
  }, {
    text: 'Sample Item 5',
    linkId: 5
  }, {
    text: 'Sample Item 6',
    linkId: 6
  }]
}

export default QuestionnaireDetailExpansionPanels;