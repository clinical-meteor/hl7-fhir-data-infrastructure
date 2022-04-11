import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Button,
} from '@material-ui/core';


import moment from 'moment'
import _ from 'lodash';
let get = _.get;
let set = _.set;
let has = _.has;

import FhirUtilities from '../../lib/FhirUtilities';
import { StyledCard, PageCanvas, TableNoData } from 'fhir-starter';
import { FhirDehydrator } from '../../lib/FhirDehydrator';

import { useTracker } from 'meteor/react-meteor-data';


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
// SESSION VARIABLES

Session.setDefault('selectedDocumentSource', '');


//===========================================================================
// MAIN COMPONENT

export function RiskAssessmentsTable(props){
  
  let { 
    riskAssessments,
    selectedRiskAssessmentId,

    rowsPerPage,
    count,
    disablePagination,
    showMinutes,
    dateFormat,
    tableRowSize,
    query,
    limit,
    sort,

    selectedPatientId,

    hideCheckbox,
    hideActionIcons,
    hideIdentifier,  
    hideSubjectReference,
    hideSubjectName,
    hidePerformerReference,
    hidePerformerName,
    hideOutcomeText,
    hideStatus,
    hideOccuranceDateTime,
    hideText,

    hideProbability,
    hideCategory,
    hideVerify,
    hideRevoke,
    hideBarcode,
    hideSource,

    onRevoke,

    noDataMessage,
    noDataMessagePadding,

    page,
    onSetPage,

  } = props;

  //------------------------------------------------------------------------------------
  // State

  let data = {
    style: {
      hideOnPhone: {
        visibility: 'visible',
        display: 'table'
      },
      cellHideOnPhone: {
        visibility: 'visible',
        display: 'table',
        paddingTop: '16px'
      },
      cell: {
        paddingTop: '16px'
      }
    },
    selected: [],
    riskAssessments: []
  };


  //------------------------------------------------------------------------------------
  // Table Query


  if(selectedPatientId){
    query['patient.reference'] = "Patient/" +selectedPatientId;
  }

  if(query){
    query = query;
  }

  let options = {};

  if(sort){

    switch (sort) {
      case "date":
        options.sort = { dateTime: -1 }
        break;
      case "periodStart":
        options.sort = { 'period.start': -1 }
        break;      
      default:
        break;
    }
  }

  // number of items in the table should be set globally
  if (get(Meteor, 'settings.public.defaults.paginationLimit')) {
    options.limit = get(Meteor, 'settings.public.defaults.paginationLimit');
  }

  // but can be over-ridden by props being more explicit
  if(limit){
    options.limit = limit;      
  }


  //------------------------------------------------------------------------------------
  // Trackers

  // data.riskAssessments = [];

  function dehydrateRiskAssessment(document){
      let result = {
        _id: document._id,
        id: get(document, 'id', ''),
        dateTime: moment(get(document, 'dateTime', null)).format("YYYY-MM-DD hh:mm:ss"),
        status: get(document, 'status', ''),
        patientReference: get(document, 'patient.reference', ''),
        patientName: get(document, 'patient.display', ''),
        // riskAssessmentingParty: get(document, 'riskAssessmentingParty[0].display', ''),
        performer: get(document, 'performer[0].display', ''),
        organization: get(document, 'organization[0].display', ''),
        policyAuthority: get(document, 'policy[0].authority', ''),
        policyUri: get(document, 'policy[0].uri', ''),
        policyRule: get(document, 'policyRule.text', ''),
        provisionType: get(document, 'provision[0].type', ''),
        provisionAction: get(document, 'provision[0].action[0].text', ''),
        provisionClass: get(document, 'provision[0].class', ''),
        start: '',
        end: '',
        sourceReference: get(document, 'sourceReference.reference', ''),
        category: '',
        scope: get(document, 'scope.coding[0].display')
      };

      if(has(document, 'patient.display')){
        result.patientName = get(document, 'patient.display')
      } else {
        result.patientName = get(document, 'patient.reference')
      }

      if(has(document, 'category[0].text')){
        result.category = get(document, 'category[0].text')
      } else {
        result.category = get(document, 'category[0].coding[0].display', '')
      }

      if(has(document, 'period.start')){
        result.start = moment(get(document, 'period.start', '')).format("YYYY-MM-DD hh:mm:ss");
      }
      if(has(document, 'period.end')){
        result.end = moment(get(document, 'period.end', '')).format("YYYY-MM-DD hh:mm:ss");
      }

  
      if(result.patientReference === ''){
        result.patientReference = get(document, 'patient.reference', '');
      }

      if(get(document, 'provision[0].class')){
        result.provisionClass = "";
        document.provision[0].class.forEach(function(provision){   
          if(result.provisionClass == ''){
            result.provisionClass = provision.code;
          }  else {
            result.provisionClass = result.provisionClass + ' - ' + provision.code;
          }      
        });
      }
      return result;
  }


  //------------------------------------------------------------------------------------
  // Helper Functions

  function rowClick(id){
    Session.set('riskAssessmentsUpsert', false);
    Session.set('selectedRiskAssessment', id);
    Session.set('riskAssessmentPageTabIndex', 2);
  }
  function handleRevoke(id){
    console.log('handleRevoke', id)

    if(typeof onRevoke === "function"){
      onRevoke(id);
    }  
  }
  function getDocumentReference(sourceReference){
    console.log('getDocumentReference...', sourceReference)

    Session.set('selectedDocumentSource', sourceReference);
  }
  function onPatientClick(id){
    if(onPatientClick){
      onPatientClick(id);
    } else {
      Session.set('riskAssessmentsUpsert', false);
      Session.set('selectedRiskAssessment', id);
      Session.set('riskAssessmentPageTabIndex', 2);  
    }
  }
  function onIdentifierClick(id){
    if(typeof onIdentifierClick === "function"){
      onIdentifierClick(id);
    } 
  }
  function handleToggle(index){
    console.log('Toggling entry ' + index)
    if(props.onToggle){
      props.onToggle(index);
    }
  }

  //------------------------------------------------------------------------------------
  // Render Functions


  function renderSelected(index){
    if (!hideCheckbox) {
      return (
        <TableCell className="toggle" style={{padding: '0px'}}>
          <Checkbox
            defaultChecked={defaultCheckboxValue}
            onChange={ handleToggle.bind(this, index)} 
          />
        </TableCell>
      );
    }
  }
  function renderSelectedHeader(){
    if (!hideCheckbox) {
      return (
        <TableCell className='selected'>Selected</TableCell>
      );
    }
  }
  function renderBarcode(id){
    if (!hideBarcode) {
      return (
        <TableCell className="id" onClick={ onIdentifierClick.bind(this, id)} ><span className="barcode helveticas">{id}</span></TableCell>
      );
    }
  }
  function renderBarcodeHeader(){
    if (!hideBarcode) {
      return (
        <TableCell className="id" >Id</TableCell>
      );
    }
  }
  function renderIdentifier(identifier){
    if (!hideIdentifier) {
      return (
        <TableCell className="identifier">{ identifier }</TableCell>
      );
    }
  }
  function renderIdentifierHeader(){
    if (!hideIdentifier) {
      let identiferClassName;

      if(hideBarcode){
        identiferClassName = "identifier"
      } else {
        identiferClassName = "identifier barcode"
      }
      return (
        <TableCell className={identiferClassName} >Identifier</TableCell>
      );
    }
  }
  function renderText(text){
    if (!hideText) {
      return (
        <TableCell className='text' style={data.style.cell} >{ text }</TableCell>
      );
    }
  }
  function renderTextHeader(){
    if (!hideText) {
      return (
        <TableCell className='type' >Text</TableCell>
      );
    }
  }
  function renderProbability(probabilityDecimal){
    if (!hideProbability) {
      return (
        <TableCell className='probabilityDecimal' style={data.style.cell} >{ probabilityDecimal }</TableCell>
      );
    }
  }
  function renderProbabilityHeader(){
    if (!hideProbability) {
      return (
        <TableCell className='class' >Probability</TableCell>
      );
    }
  }
  function renderCategory(category){
    if (!hideCategory) {
      return (
        <TableCell className='category' style={data.style.cell} >{ category }</TableCell>
      );
    }
  }
  function renderCategoryHeader(){
    if (!hideCategory) {
      return (
        <TableCell className='category' >Category</TableCell>
      );
    }
  }
  function renderDate(id, dateTime){
    if (!hideOccuranceDateTime) {
      return (
        <TableCell className='date' onClick={ rowClick.bind('this', id)} style={{minWidth: '160px', paddingTop: '16px'}}>{ moment(dateTime).format("YYYY-MM-DD") }</TableCell>
      );
    }
  }
  function renderDateHeader(){
    if (!hideOccuranceDateTime) {
      return (
        <TableCell className='date' style={{minWidth: '100px'}}>Date</TableCell>
      );
    }
  }
  function renderSource(sourceReference ){
    console.log('renderSource', sourceReference)
    if (!hideSource) {
      return (
        <TableCell className='sourceReference' onClick={ getDocumentReference.bind(this, sourceReference) } style={{minWidth: '100px', paddingTop: '16px'}}>{ sourceReference }</TableCell>
      );
    }
  }
  function renderSourceHeader(){
    if (!hideSource) {
      return (
        <TableCell className='sourceReference' style={{minWidth: '100px', marginLeft: '20px'}}> Source </TableCell>
      );
    }
  }
  function renderRevoke(rowId){
    if (!hideRevoke) {
      return (
        <TableCell className='revoke'>
          <Button onClick={handleRevoke.bind(this, rowId)} variant={revokeButtonType}>Revoke</Button>
        </TableCell>
      );
    }
  }
  function renderRevokeHeader(){
    if (!hideRevoke) {
      return (
        <TableCell className='end' style={{minWidth: '100px', marginLeft: '20px'}}> Revoke </TableCell>
      );
    }
  }

  function renderSubjectNameHeader(){
    if (!hideSubjectName) {
      return (
        <TableCell className='subjectDisplay'>Subject</TableCell>
      );
    }
  }
  function renderSubjectName(subjectDisplay ){
    if (!hideSubjectName) {
      return (
        <TableCell className='subjectDisplay' style={{minWidth: '140px'}}>{ subjectDisplay }</TableCell>
      );
    }
  }
  function renderSubjectReferenceHeader(){
    if (!hideSubjectReference) {
      return (
        <TableCell className='subjectReference'>Subject Reference</TableCell>
      );
    }
  }
  function renderSubjectReference(subjectReference ){
    if (!hideSubjectReference) {
      return (
        <TableCell className='subjectReference' style={{maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis',  whiteSpace: 'nowrap'}}>
          { FhirUtilities.pluckReferenceId(subjectReference) }
        </TableCell>
      );
    }
  }


  function renderPerformerNameHeader(){
    if (!hidePerformerName) {
      return (
        <TableCell className='performerDisplay'>Performer</TableCell>
      );
    }
  }
  function renderPerformerName(performerDisplay ){
    if (!hidePerformerName) {
      return (
        <TableCell className='performerDisplay' style={{minWidth: '140px'}}>{ performerDisplay }</TableCell>
      );
    }
  }
  function renderPerformerReferenceHeader(){
    if (!hidePerformerReference) {
      return (
        <TableCell className='performerReference'>Performer Reference</TableCell>
      );
    }
  }
  function renderPerformerReference(performerReference ){
    if (!hidePerformerReference) {
      return (
        <TableCell className='performerReference' style={{maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis',  whiteSpace: 'nowrap'}}>
          { FhirUtilities.pluckReferenceId(performerReference) }
        </TableCell>
      );
    }
  }


  function renderOutcomeTextHeader(){
    if (!hideOutcomeText) {
      return (
        <TableCell className='outcomeText'>Outcome Text</TableCell>
      );
    }
  }
  function renderOutcomeText(outcomeText ){
    if (!hideOutcomeText) {
      return (
        <TableCell className='outcomeText' style={{minWidth: '140px'}}>{ outcomeText }</TableCell>
      );
    }
  }
  function renderStatusHeader(){
    if (!hideStatus) {
      return (
        <TableCell className='status'>Status</TableCell>
      );
    }
  }
  function renderStatus(status){
    if (!hideStatus) {
      return (
        <TableCell className='status' >{ status }</TableCell>
      );
    }
  }
  function renderScopeHeader(){
    if (!hideScope) {
      return (
        <TableCell className='scope'>Scope</TableCell>
      );
    }
  }
  function renderScope(scope){
    if (!hideScope) {
      return (
        <TableCell className='scope' style={{minWidth: '140px'}}>{ scope }</TableCell>
      );
    }
  }

  
  //---------------------------------------------------------------------
  // Pagination

  let rows = [];

  let paginationCount = 101;
  if(count){
    paginationCount = count;
  } else {
    paginationCount = rows.length;
  }

  function handleChangePage(event, newPage){
    if(typeof onSetPage === "function"){
      onSetPage(newPage);
    }
  }

  let paginationFooter;
  if(!disablePagination){
    paginationFooter = <TablePagination
      component="div"
      // rowsPerPageOptions={[5, 10, 25, 100]}
      rowsPerPageOptions={['']}
      colSpan={3}
      count={paginationCount}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={handleChangePage}
      style={{float: 'right', border: 'none'}}
    />
  }




  //---------------------------------------------------------------------
  // Table Rows

  let tableRows = [];
  let riskAssessmentsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }

  if(riskAssessments){
    if(riskAssessments.length > 0){     
      let count = 0;    

      riskAssessments.forEach(function(condition){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          riskAssessmentsToRender.push(FhirDehydrator.dehydrateRiskAssessment(condition, internalDateFormat));
          // riskAssessmentsToRender.push(dehydrateRiskAssessment(condition, internalDateFormat));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer',
    height: '52px'
  }



  //------------------------------------------------------------------------------------
  // Rendertate

  if(riskAssessmentsToRender.length === 0){
    logger.trace('RiskAssessmentsTable: No riskAssessments to render.');

    if(noDataMessage){
      footer = <TableNoData noDataPadding={ noDataMessagePadding } />
    }
  } else {
    for (var i = 0; i < riskAssessmentsToRender.length; i++) {
      let selected = false;
      if(riskAssessmentsToRender[i].id === selectedRiskAssessmentId){
        selected = true;
      }
      if(get(riskAssessmentsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }
      logger.trace('riskAssessmentsToRender[i]', riskAssessmentsToRender[i])
      tableRows.push(
        <TableRow className="riskAssessmentRow" 
          key={i} style={rowStyle} 
          // onClick={ rowClick.bind(this, riskAssessmentsToRender[i]._id)} 
          style={rowStyle} 
          hover={true} 
          // selected={selected} 
          >            
          {renderSelected(get(riskAssessmentsToRender[i], '_id'))}
          {renderIdentifier(get(riskAssessmentsToRender[i], 'identifier', ''))}
          {renderDate(get(riskAssessmentsToRender[i], '_id'), get(riskAssessmentsToRender[i], 'occurrenceDateTime'))}
          {renderStatus(get(riskAssessmentsToRender[i], 'status'))}
          {renderSubjectName(get(riskAssessmentsToRender[i], 'subjectName')) }
          {renderSubjectReference(get(riskAssessmentsToRender[i], 'subjectReference')) }
          {renderPerformerName(get(riskAssessmentsToRender[i], 'performer')) }
          {renderPerformerReference(get(riskAssessmentsToRender[i], 'performerReference')) }

          {renderOutcomeText(get(riskAssessmentsToRender[i], 'outcomeText')) }
          {renderProbability( get(riskAssessmentsToRender[i], 'probabilityDecimal')) }
          {renderText( get(riskAssessmentsToRender[i], 'text')) }

          {renderBarcode(get(riskAssessmentsToRender[i], 'id', ''))}
        </TableRow>
      );    
    }
  }

  return(
    <div>
      <Table className='riskAssessmentsTable' size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {renderSelectedHeader() }
            {renderIdentifierHeader() }
            {renderDateHeader() }
            {renderStatusHeader() }
            {renderSubjectNameHeader() }
            {renderSubjectReferenceHeader() }
            {renderPerformerNameHeader() }
            {renderPerformerReferenceHeader() }

            {renderOutcomeTextHeader() }
            {renderProbabilityHeader() }
            {renderTextHeader() }

            {renderBarcodeHeader() }
          </TableRow>
        </TableHead>
        <TableBody>
          { tableRows }
        </TableBody>
      </Table>
    { paginationFooter }
    </div>
  );
}


RiskAssessmentsTable.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,

  riskAssessments: PropTypes.array,
  selectedRiskAssessmentId: PropTypes.string,

  count: PropTypes.number,
  limit: PropTypes.number,
  query: PropTypes.object,
  sort: PropTypes.string,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideIdentifier: PropTypes.bool,  
  hideSubjectReference: PropTypes.bool,
  hideSubjectName: PropTypes.bool,
  hidePerformerReference: PropTypes.bool,
  hidePerformerName: PropTypes.bool,
  hideOutcomeText: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideOccuranceDateTime: PropTypes.bool,
  hideText: PropTypes.bool,

  hideProbability: PropTypes.bool,
  hideCategory: PropTypes.bool,
  hideVerify: PropTypes.bool,
  hideRevoke: PropTypes.bool,
  hideBarcode: PropTypes.bool,
  hideSource: PropTypes.bool,

  onToggle: PropTypes.func,
  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onRevoke: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  onSetPage: PropTypes.func,

  page: PropTypes.number,
  actionButtonLabel: PropTypes.string,

  sourceReference: PropTypes.bool,
  selectedDocumentSource: PropTypes.string,
  onPatientClick: PropTypes.func,
  disablePagination: PropTypes.bool,

  tableRowSize: PropTypes.string,
  rowsPerPage: PropTypes.number,
  dateFormat: PropTypes.string,
  dateFormat: PropTypes.string,

  showMinutes: PropTypes.bool,
  noDataMessage: PropTypes.bool,
  noDataMessagePadding: PropTypes.number,

  labels: PropTypes.object,

  selectedPatientId: PropTypes.string
};
RiskAssessmentsTable.defaultProps = {
  tableRowSize: 'medium',
  rowsPerPage: 5,
  dateFormat: "YYYY-MM-DD hh:mm:ss",
  selectedRiskAssessmentId: '',

  hideCheckbox: true,
  hideActionIcons: true,
  hideStatus: false,
  hideSubjectName: false,
  hideSubjectReference: false,
  hideBarcode: true,
  hideProbability: false,
  hideText: false,
  hideOutcomeText: false,

  disablePagination: false,
  selectedListId: '',

  riskAssessments: [],
  query: {},
  selectedPatientId: '',
  sort: '',

  noDataMessage: true,
  noDataMessagePadding: 100
}

export default RiskAssessmentsTable;

