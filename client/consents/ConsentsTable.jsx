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

export function ConsentsTable(props){
  
  let { 
    consents,
    selectedConsentId,

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
    hidePatientName,
    hidePatientReference,
    hideOrganization,
    hideStatus,
    hideDateTime,
    hidePeriodStart,
    hidePeriodEnd,
    hideCategory,
    hideVerify,
    hideRevoke,
    hideBarcode,
    hideScope,
    hideClass,
    hideType,
    hideSource,
    revokeButtonType,
    revokeColor,

    onRevoke,

    page, 
    onSetPage,

    noDataMessage,
    noDataMessagePadding,

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
    consents: []
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

  // data.consents = [];

  // function dehydrateConsent(document){
  //     let result = {
  //       _id: document._id,
  //       id: get(document, 'id', ''),
  //       dateTime: moment(get(document, 'dateTime', null)).format("YYYY-MM-DD hh:mm:ss"),
  //       status: get(document, 'status', ''),
  //       patientReference: get(document, 'patient.reference', ''),
  //       patientName: get(document, 'patient.display', ''),
  //       // consentingParty: get(document, 'consentingParty[0].display', ''),
  //       performer: get(document, 'performer[0].display', ''),
  //       organization: get(document, 'organization[0].display', ''),
  //       policyAuthority: get(document, 'policy[0].authority', ''),
  //       policyUri: get(document, 'policy[0].uri', ''),
  //       policyRule: get(document, 'policyRule.text', ''),
  //       provisionType: get(document, 'provision[0].type', ''),
  //       provisionAction: get(document, 'provision[0].action[0].text', ''),
  //       provisionClass: get(document, 'provision[0].class', ''),
  //       start: '',
  //       end: '',
  //       sourceReference: get(document, 'sourceReference.reference', ''),
  //       category: '',
  //       scope: get(document, 'scope.coding[0].display')
  //     };

  //     if(has(document, 'patient.display')){
  //       result.patientName = get(document, 'patient.display')
  //     } else {
  //       result.patientName = get(document, 'patient.reference')
  //     }

  //     if(has(document, 'category[0].text')){
  //       result.category = get(document, 'category[0].text')
  //     } else {
  //       result.category = get(document, 'category[0].coding[0].display', '')
  //     }

  //     if(has(document, 'period.start')){
  //       result.start = moment(get(document, 'period.start', '')).format("YYYY-MM-DD hh:mm:ss");
  //     }
  //     if(has(document, 'period.end')){
  //       result.end = moment(get(document, 'period.end', '')).format("YYYY-MM-DD hh:mm:ss");
  //     }

  
  //     if(result.patientReference === ''){
  //       result.patientReference = get(document, 'patient.reference', '');
  //     }

  //     if(get(document, 'provision[0].class')){
  //       result.provisionClass = "";
  //       document.provision[0].class.forEach(function(provision){   
  //         if(result.provisionClass == ''){
  //           result.provisionClass = provision.code;
  //         }  else {
  //           result.provisionClass = result.provisionClass + ' - ' + provision.code;
  //         }      
  //       });
  //     }
  //     return result;
  // }


  //------------------------------------------------------------------------------------
  // Helper Functions

  function rowClick(id){
    Session.set('consentsUpsert', false);
    Session.set('selectedConsent', id);
    Session.set('consentPageTabIndex', 2);
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
      Session.set('consentsUpsert', false);
      Session.set('selectedConsent', id);
      Session.set('consentPageTabIndex', 2);  
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
    if (!hideBarcode) {
      return (
        <TableCell className="identifier">{ identifier }</TableCell>
      );
    }
  }
  function renderIdentifierHeader(){
    if (!hideBarcode) {
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
  function renderType(provisionType){
    if (!hideType) {
      return (
        <TableCell className='provisionType' style={data.style.cell} >{ provisionType }</TableCell>
      );
    }
  }
  function renderTypeHeader(){
    if (!hideType) {
      return (
        <TableCell className='type' >Type</TableCell>
      );
    }
  }
  function renderClass(provisionClass){
    if (!hideClass) {
      return (
        <TableCell className='provisionClass' style={data.style.cell} >{ provisionClass }</TableCell>
      );
    }
  }
  function renderClassHeader(){
    if (!hideClass) {
      return (
        <TableCell className='class' >Class</TableCell>
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
    if (!hideDateTime) {
      return (
        <TableCell className='date' onClick={ rowClick.bind('this', id)} style={{minWidth: '160px', paddingTop: '16px'}}>{ moment(dateTime).format("YYYY-MM-DD") }</TableCell>
      );
    }
  }
  function renderDateHeader(){
    if (!hideDateTime) {
      return (
        <TableCell className='date' style={{minWidth: '100px'}}>Date</TableCell>
      );
    }
  }
  function renderPeriodStart(id, periodStart){
    if (!hidePeriodStart) {
      return (
        <TableCell className='start' onClick={ rowClick.bind('this', id)} style={{minWidth: '100px', paddingTop: '16px'}}>{ periodStart }</TableCell>
      );
    }
  }
  function renderPeriodStartHeader(){
    if (!hidePeriodStart) {
      return (
        <TableCell className='start' style={{minWidth: '100px'}}>Start</TableCell>
      );
    }
  }
  function renderPeriodEnd(id, periodEnd){
    if (!hidePeriodEnd) {
      return (
        <TableCell className='end' onClick={ rowClick.bind('this', id)} style={{minWidth: '100px', paddingTop: '16px'}}>{ periodEnd }</TableCell>
      );
    }
  }
  function renderPeriodEndHeader(){
    if (!hidePeriodEnd) {
      return (
        <TableCell className='end' style={{minWidth: '100px'}}>End</TableCell>
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

  function renderPatientNameHeader(){
    if (!hidePatientName) {
      return (
        <TableCell className='patientDisplay'>Patient</TableCell>
      );
    }
  }
  function renderPatientName(patientDisplay ){
    if (!hidePatientName) {
      return (
        <TableCell className='patientDisplay' style={{minWidth: '140px'}}>{ patientDisplay }</TableCell>
      );
    }
  }
  function renderPatientReferenceHeader(){
    if (!hidePatientReference) {
      return (
        <TableCell className='patientReference'>Patient Reference</TableCell>
      );
    }
  }
  function renderPatientReference(patientReference ){
    if (!hidePatientReference) {
      return (
        <TableCell className='patientReference' style={{maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis',  whiteSpace: 'nowrap'}}>
          { FhirUtilities.pluckReferenceId(patientReference) }
        </TableCell>
      );
    }
  }
  function renderOrganizationHeader(){
    if (!hideOrganization) {
      return (
        <TableCell className='organization'>Organization</TableCell>
      );
    }
  }
  function renderOrganization(organization ){
    if (!hideOrganization) {
      return (
        <TableCell className='organization' style={{minWidth: '140px'}}>{ organization }</TableCell>
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
  let consentsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }

  if(consents){
    if(consents.length > 0){     
      let count = 0;    

      consents.forEach(function(condition){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          // consentsToRender.push(FhirDehydrator.dehydrateConsent(condition, internalDateFormat));
          consentsToRender.push(FhirDehydrator.dehydrateConsent(condition, internalDateFormat));
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

  if(consentsToRender.length === 0){
    logger.trace('ConsentsTable: No consents to render.');

    if(noDataMessage){
      footer = <TableNoData noDataPadding={ noDataMessagePadding } />
    }
  } else {
    for (var i = 0; i < consentsToRender.length; i++) {
      let selected = false;
      if(consentsToRender[i].id === selectedConsentId){
        selected = true;
      }
      if(get(consentsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }
      logger.trace('consentsToRender[i]', consentsToRender[i])
      tableRows.push(
        <TableRow className="consentRow" 
          key={i} style={rowStyle} 
          // onClick={ rowClick.bind(this, consentsToRender[i]._id)} 
          style={rowStyle} 
          hover={true} 
          // selected={selected} 
          >            
          {renderSelected(get(consentsToRender[i], '_id'))}
          {renderIdentifier(get(consentsToRender[i], 'identifier', ''))}
          {renderDate(get(consentsToRender[i], '_id'), get(consentsToRender[i], 'dateTime'))}
          {renderPeriodStart(get(consentsToRender[i], '_id'), get(consentsToRender[i], 'start'))}
          {renderPeriodEnd(get(consentsToRender[i], '_id'), get(consentsToRender[i], 'end'))}
          {renderStatus(get(consentsToRender[i], 'status'))}
          {renderPatientName(get(consentsToRender[i], 'patientName')) }
          {renderOrganization(get(consentsToRender[i], 'organization')) }
          {renderType( get(consentsToRender[i], 'provisionType')) }
          {renderClass( get(consentsToRender[i], 'provisionClass')) }
          {renderCategory( get(consentsToRender[i], 'category')) }
          {renderScope( get(consentsToRender[i], 'scope')) }

          {renderSource(get(consentsToRender[i], 'sourceReference')) }
          {renderRevoke(get(consentsToRender[i], '_id'))}

          {renderBarcode(get(consentsToRender[i], 'id', ''))}
        </TableRow>
      );    
    }
  }

  return(
    <div>
      <Table className='consentsTable' size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {renderSelectedHeader() }
            {renderIdentifierHeader() }
            {renderDateHeader() }
            {renderPeriodStartHeader() }
            {renderPeriodEndHeader() }
            {renderStatusHeader() }
            {renderPatientNameHeader() }
            {renderOrganizationHeader() }
            {renderTypeHeader() }
            {renderClassHeader() }
            {renderCategoryHeader() }
            {renderScopeHeader() }
 
            {renderSourceHeader() }
            {renderRevokeHeader() }

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


ConsentsTable.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,

  consents: PropTypes.array,
  selectedConsentId: PropTypes.string,

  count: PropTypes.number,
  limit: PropTypes.number,
  query: PropTypes.object,
  sort: PropTypes.string,


  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideBarcode: PropTypes.bool,
  hidePatientReference: PropTypes.bool,
  hidePatientName: PropTypes.bool,
  hideOrganization: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideScope: PropTypes.bool,
  hideDateTime: PropTypes.bool,
  hidePeriodStart: PropTypes.bool,
  hidePeriodEnd: PropTypes.bool,
  hideType: PropTypes.bool,
  hideClass: PropTypes.bool,
  hideCategory: PropTypes.bool,
  hideVerify: PropTypes.bool,
  hideRevoke: PropTypes.bool,
  hideBarcode: PropTypes.bool,
  hideSource: PropTypes.bool,

  revokeButtonType: PropTypes.string,
  revokeColor: PropTypes.string,

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
ConsentsTable.defaultProps = {
  tableRowSize: 'medium',
  rowsPerPage: 5,
  dateFormat: "YYYY-MM-DD hh:mm:ss",
  selectedConsentId: '',

  hideCheckbox: true,
  hideActionIcons: true,
  hideStatus: false,
  hideTitle: false,
  hideItemCount: false,
  hidePatientName: false,
  hidePatientReference: false,
  hideBarcode: true,
  hideScope: false,
  hideClass: true,
  hideType: true,
  hideSource: true,
  hideRevoke: true,

  disablePagination: false,
  selectedListId: '',

  consents: [],
  query: {},
  selectedPatientId: '',
  sort: '',
  revokeButtonType: 'text',
  revokeColor: '',

  noDataMessage: true,
  noDataMessagePadding: 100
}

export default ConsentsTable;

