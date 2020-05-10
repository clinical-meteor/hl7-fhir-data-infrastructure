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
    if(props.onRemoveRecord){
      props.onRemoveRecord(_id);
    }
  }
  function onActionButtonClick(id){
    if(typeof props.onActionButtonClick === "function"){
      props.onActionButtonClick(id);
    }
  }
  function cellClick(id){
    if(typeof props.onCellClick === "function"){
      props.onCellClick(id);
    }
  }

  function onMetaClick(patient){
    let self = this;
    if(typeof props.onMetaClick === "function"){
      props.onMetaClick(self, patient);
    }
  }
  function selectQuestionnaireRow(questionnaireId){
    if(typeof props.onRowClick === "function"){
      props.onRowClick(questionnaireId);
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
        <TableRow key={i} className="questionnaireRow" style={{cursor: "pointer"}} onClick={ selectQuestionnaireRow.bind(this, questionnairesToRender[i].id )} hover={true} >
          { renderToggle(questionnairesToRender[i]) }
          { renderActionIcons(questionnairesToRender[i]) }
          { renderIdentifier(questionnairesToRender[i]) }
          <TableCell className='title' >{questionnairesToRender[i].title }</TableCell>
          <TableCell className='status' >{questionnairesToRender[i].status }</TableCell>
          <TableCell className='date' style={{minWidth: '140px'}}>{questionnairesToRender[i].date }</TableCell>
          <TableCell className='items' >{questionnairesToRender[i].items }</TableCell>
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
            { renderBarcodeHeader() }
            </TableRow>
          </TableHead>
          <TableBody>
            { tableRows }
          </TableBody>
        </Table>
      </div>
    );
}




QuestionnaireTable.propTypes = {
  data: PropTypes.array,
  questionnaires: PropTypes.array,
  selectedQuestionnaireId: PropTypes.string,
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