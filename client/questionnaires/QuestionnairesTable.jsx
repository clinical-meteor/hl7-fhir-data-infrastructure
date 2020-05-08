import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Button  
} from '@material-ui/core';


import { has, get } from 'lodash';
import moment from 'moment'

import { FhirUtilities } from '../../lib/FhirUtilities';


//===========================================================================
// THEMING

import { ThemeProvider, makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  button: {
    background: theme.background,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: theme.buttonText,
    height: 48,
    padding: '0 30px',
  }
}));

let styles = {
  hideOnPhone: {
    visibility: 'visible',
    display: 'table'
  },
  cellHideOnPhone: {
    visibility: 'visible',
    display: 'table',
    paddingTop: '16px',
    maxWidth: '120px'
  },
  cell: {
    paddingTop: '16px'
  }
}

//===========================================================================
// FLATTENING / MAPPING

flattenQuestionnaire = function(questionnaire){
  let result = {
    _id: questionnaire._id,
    id: '',
    title: '',
    state: '',
    date: '',
    items: 0
  };

  result.id = get(questionnaire, 'id', '');

  result.date = moment(questionnaire.date).add(1, 'days').format("YYYY-MM-DD")
  result.title = get(questionnaire, 'title', '');
  result.status = get(questionnaire, 'status', '');
  result.items = get(questionnaire, 'item', []).length;
  
  return result;
}

//===========================================================================
// MAIN COMPONENT  


function QuestionnaireTable(props){



  // ------------------------------------------------------------------------
  // CRUD Methods

  function removeRecord(_id){
    console.log('Remove questionnaire ', _id)
    if(this.props.onRemoveRecord){
      this.props.onRemoveRecord(_id);
    }
  }
  function onActionButtonClick(id){
    if(typeof this.props.onActionButtonClick === "function"){
      this.props.onActionButtonClick(id);
    }
  }
  function cellClick(id){
    if(typeof this.props.onCellClick === "function"){
      this.props.onCellClick(id);
    }
  }

  function onMetaClick(patient){
    let self = this;
    if(this.props.onMetaClick){
      this.props.onMetaClick(self, patient);
    }
  }

  // ------------------------------------------------------------------------
  // Column Rendering

  function renderToggleHeader(){
    if (!props.hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Toggle</TableCell>
      );
    }
  }
  function renderToggle(){
    if (!props.hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}}>
            {/* <Checkbox
              defaultChecked={true}
            /> */}
        </TableCell>
      );
    }
  }
  function renderActionIconsHeader(){
    if (!props.hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(measureReport ){
    if (!props.hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ onMetaClick.bind(measureReport)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(measureReport._id)} />   */}
        </TableCell>
      );
    }
  } 
  function renderIdentifier(identifier){
    if (!props.hideIdentifier) {
      return (
        <TableCell className='identifier'>{ identifier }</TableCell>
      );
    }
  }
  function renderIdentifierHeader(){
    if (!props.hideIdentifier) {
      return (
        <TableCell className='identifier'>Identifier</TableCell>
      );
    }
  }
      

  function renderBarcode(id){
    if (!props.hideBarcode) {
      return (
        <TableCell><span className="barcode">{id}</span></TableCell>
      );
    }
  }
  function renderBarcodeHeader(){
    if (!props.hideBarcode) {
      return (
        <TableCell>System ID</TableCell>
      );
    }
  }

  function renderActionButtonHeader(){
    if (!props.hideActionButton) {
      return (
        <TableCell className='ActionButton' >Action</TableCell>
      );
    }
  }
  function renderActionButton(patient){
    if (!props.hideActionButton) {
      return (
        <TableCell className='ActionButton' >
          <Button onClick={ onActionButtonClick.bind(this, patient[i]._id)}>{ get(props, "actionButtonLabel", "") }</Button>
        </TableCell>
      );
    }
  }

  // ------------------------------------------------------------------------
  // Table Row Rendering

  let tableRows = [];
  let questionnairesToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.internalDateFormat){
    internalDateFormat = props.dateFormat;
  }

  if(props.questionnaires){
    if(props.questionnaires.length > 0){              
      props.questionnaires.forEach(function(questionnaire){
        questionnairesToRender.push(flattenQuestionnaire(questionnaire, internalDateFormat));
      });  
    }
  }


  if(questionnairesToRender.length === 0){
    console.log('No questionnaires to render');
  } else {
    for (var i = 0; i < questionnairesToRender.length; i++) {
      tableRows.push(
        <TableRow key={i} className="questionnaireRow" style={{cursor: "pointer"}} onClick={this.selectQuestionnaireRow.bind(this, questionnairesToRender[i].id )} hover={true} >
          { renderToggle(questionnairesToRender[i]) }
          { renderActionIcons(questionnairesToRender[i]) }
          { renderIdentifier(questionnairesToRender[i]) }
          <TableCell className='title' onClick={ rowClick.bind('this', questionnairesToRender[i]._id)} style={data.style.cell}>{questionnairesToRender[i].title }</TableCell>
          <TableCell className='status' onClick={ rowClick.bind('this', questionnairesToRender[i]._id)} style={data.style.cell}>{questionnairesToRender[i].status }</TableCell>
          <TableCell className='date' onClick={ rowClick.bind('this', questionnairesToRender[i]._id)} style={{minWidth: '100px', paddingTop: '16px'}}>{questionnairesToRender[i].date }</TableCell>
          <TableCell className='items' onClick={ rowClick.bind('this', questionnairesToRender[i]._id)} style={data.style.cell}>{questionnairesToRender[i].items }</TableCell>
          { renderBarcode(questionnairesToRender[i].id) }
        </TableRow>
      );
    }
  }
    


    return(
      <div>
        <Table id='questionnairesTable' >
          <TableHead>
            <TableRow>
            { renderToggleHeader() }
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }
              <TableCell className='title'>Title</TableCell>
              <TableCell className='status'>Status</TableCell>
              <TableCell className='date' style={{minWidth: '140px'}}>Date</TableCell>
              <TableCell className='items'>Items</TableCell>
              { renderIdentifierHeader() }
            </TableRow>
          </TableHead>
          <TableBody>
            { tableRows }
          </TableBody>
        </Table>
      </div>
    );
}



// export class QuestionnaireTable extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   getMeteorData() {

//     if(this.props.data){
//       // console.log('this.props.data', this.props.data);

//       if(this.props.data.length > 0){              
//         this.props.data.forEach(function(questionnaire){
//           data.questionnaires.push(flattenQuestionnaire(questionnaire));
//         });  
//       }
//     } else {
//       data.questionnaires = Questionnaires.find().map(function(questionnaire){
//         return flattenQuestionnaire(questionnaire);
//       });
//     }


//     console.log("QuestionnaireTable[data]", data);
//     return data;
//   }

//   rowClick(id){
//     Session.set('questionnairesUpsert', false);
//     Session.set('selectedQuestionnaire', id);
//     // Session.set('questionnairePageTabIndex', 2);
//   }

//   renderSendButtonHeader(){
//     if (this.props.showSendButton === true) {
//       return (
//         <th className='sendButton' style={this.data.style.hideOnPhone}></th>
//       );
//     }
//   }
//   renderSendButton(questionnaire, avatarStyle){
//     if (this.props.showSendButton === true) {
//       return (
//         <td className='sendButton' style={this.data.style.hideOnPhone}>
//           <Button onClick={this.onSend.bind('this', this.data.questionnaires[i]._id)}>Send</Button>
//         </td>
//       );
//     }
//   }
//   onSend(id){
//     let questionnaire = Questionnaires.findOne({_id: id});

//     console.log("QuestionnaireTable.onSend()", questionnaire);

//     var httpEndpoint = "http://localhost:8080";
//     if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
//       httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
//     }
//     HTTP.post(httpEndpoint + '/Questionnaire', {
//       data: questionnaire
//     }, function(error, result){
//       if (error) {
//         console.log("error", error);
//       }
//       if (result) {
//         console.log("result", result);
//       }
//     });
//   }
//   selectQuestionnaireRow(questionnaireId){
//     if(typeof(this.props.onRowClick) === "function"){
//       this.props.onRowClick(questionnaireId);
//     }
//   }
//   renderCheckboxHeader(){
//     if (!this.props.hideCheckbox) {
//       return (
//         <th className="toggle"></th>
//       );
//     }
//   }
//   onRowChecked(questionnaire, event, toggle){
//     console.log('onRowChecked', questionnaire, toggle);
//     let newStatus = 'draft';

//     if(toggle){
//       newStatus = 'active';
//     } else {
//       newStatus = 'draft';
//     }

//     Questionnaires._collection.update({_id: questionnaire._id}, {$set: {
//       'status': newStatus
//     }}, function(error, result){
//       if(error){
//         console.error('Questionnaire Error', error);
//       }
//     });
//   }
// }

QuestionnaireTable.propTypes = {
  data: PropTypes.array,
  fhirVersion: PropTypes.string,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  hideIdentifier: PropTypes.bool,
  hideCheckbox: PropTypes.bool,
  hideBarcodes: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  onCheck: PropTypes.func,
  actionButtonLabel: PropTypes.string,

  hideActionButton: PropTypes.bool
};

export default QuestionnaireTable;