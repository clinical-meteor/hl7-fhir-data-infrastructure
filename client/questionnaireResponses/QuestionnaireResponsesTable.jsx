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


import { HTTP } from 'meteor/http';
import { get } from 'lodash';
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

flattenQuestionnaireResponse = function(questionnaireResponse){
  let result = {
    _id: questionnaireResponse._id,
    title: '',
    identifier: '',
    questionnaire: '',
    status: '',
    subject: '',
    encounter: '',
    author: '',
    date: '',
    count: '0'
  };


  // there's an off-by-1 error between momment() and Date() that we want
  // to account for when converting back to a string
  result.date = moment(questionnaireResponse.authored).add(1, 'days').format("YYYY-MM-DD HH:mm")
  result.questionnaire = get(questionnaireResponse, 'questionnaire.reference', '');
  result.encounter = get(questionnaireResponse, 'encounter.reference', '');
  result.subject = get(questionnaireResponse, 'subject.display', '');
  result.author = get(questionnaireResponse, 'author.display', '');
  result.identifier = get(questionnaireResponse, 'identifier[0].value', '');
  result.status = get(questionnaireResponse, 'status', '');

  let items = get(questionnaireResponse, 'item', []);

  result.count = items.length;
  
  return result;
}

//===========================================================================
// MAIN COMPONENT 

function QuestionnaireResponsesTable(props){




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

  function onRowClick(responseId){
    if(typeof(this.props.onRowClick) === "function"){
      this.props.onRowClick(responseId);
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
  let responsesToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.internalDateFormat){
    internalDateFormat = props.dateFormat;
  }


  if(props.questionnaireResponses){
    if(props.questionnaireResponses.length > 0){              
      props.questionnaireResponses.forEach(function(questionnaireResponse){
        questionnaireResponsesToRender.push(flattenQuestionnaireResponse(questionnaireResponse, internalDateFormat));
      });  
    }
  }




  if(responsesToRender.length === 0){
    console.log('No questionnaire responses to render');
  } else {
    for (var i = 0; i < responsesToRender.length; i++) {
      tableRows.push(
        <TableRow key={i} className="patientRow" style={{cursor: "pointer"}} onClick={this.onRowClick.bind(this, responsesToRender[i]._id )} >
          { renderToggle(responsesToRender[i]) }
          { renderActionIcons(responsesToRender[i]) }

          {/* <td className='identifier' onClick={ rowClick.bind(this, responsesToRender[i]._id)} style={data.style.cell}>{responsesToRender[i].identifier }</td> */}
          {/* <td className='title' onClick={ rowClick.bind(this, responsesToRender[i]._id)} style={data.style.cell}>{responsesToRender[i].title }</td> */}
          <TableCell className='questionnaire' onClick={ onCellClick.bind(this, responsesToRender[i]._id)} style={data.style.cell}>{responsesToRender[i].questionnaire }</TableCell>
          <TableCell className='subject' onClick={ onCellClick.bind(this, responsesToRender[i]._id)} style={data.style.cell}>{responsesToRender[i].subject }</TableCell>
          <TableCell className='status' onClick={ onCellClick.bind(this, responsesToRender[i]._id)} style={data.style.cell}>{responsesToRender[i].status }</TableCell>
          <TableCell className='date' onClick={ onCellClick.bind(this, responsesToRender[i]._id)} style={{minWidth: '100px', paddingTop: '16px'}}>{responsesToRender[i].date }</TableCell>
          <TableCell className='count' onClick={ onCellClick.bind(this, responsesToRender[i]._id)} style={data.style.cell}>{responsesToRender[i].count }</TableCell>
          { renderIdentifier(responsesToRender[i]) }
        </TableRow>
      );
    }
  }
  


  return(
    <div>
      <Table id='questionnaireResponsesTable' hover >
        <TableHead>
          <TableRow>
            { renderToggleHeader() }
            { renderActionIconsHeader() }

            {/* <th className='identifier'>Identifier</th> */}
            {/* <th className='title'>Title</th> */}
            {/* <th className='author'>Author</th> */}
            {/* <th className='encounter'>Encounter</th> */}

            <TableCell className='questionnaire'>Questionnaire</TableCell>
            <TableCell className='subject'>Subject</TableCell>
            <TableCell className='status'>Status</TableCell>
            <TableCell className='date' style={{minWidth: '140px'}}>Date</TableCell>
            <TableCell className='count'>Count</TableCell>
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




QuestionnaireResponsesTable.propTypes = {
  questionnaireResponses: PropTypes.array,
  fhirVersion: PropTypes.string,
  query: PropTypes.object,
  sort: PropTypes.string,
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
  actionButtonLabel: PropTypes.string
};
export default QuestionnaireResponsesTable;