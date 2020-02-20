import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Button,
  Card,
  Checkbox,
  CardActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  IconButton,
  FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPageIcon
} from '@material-ui/core';


import moment from 'moment'
import _ from 'lodash';
let get = _.get;
let set = _.set;

import { Icon } from 'react-icons-kit'
import { tag } from 'react-icons-kit/fa/tag'
import {iosTrashOutline} from 'react-icons-kit/ionicons/iosTrashOutline'

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';


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

//===========================================================================
// FLATTENING / MAPPING

flattenCondition = function(condition, dateFormat){
  let result = {
    _id: '',
    id: '',
    meta: '',
    identifier: '',
    clinicalStatus: '',
    patientDisplay: '',
    patientReference: '',
    asserterDisplay: '',
    verificationStatus: '',
    severity: '',
    snomedCode: '',
    snomedDisplay: '',
    evidenceDisplay: '',
    barcode: '',
    onsetDateTime: '',
    abatementDateTime: ''
  };

  if(!dateFormat){
    dateFormat = get(Meteor, "settings.public.defaults.dateFormat", "YYYY-MM-DD");
  }

  result._id =  get(condition, 'id') ? get(condition, 'id') : get(condition, '_id');
  result.id = get(condition, 'id', '');
  result.identifier = get(condition, 'identifier[0].value', '');

  if(get(condition, 'patient')){
    result.patientDisplay = get(condition, 'patient.display', '');
    result.patientReference = get(condition, 'patient.reference', '');
  } else if (get(condition, 'subject')){
    result.patientDisplay = get(condition, 'subject.display', '');
    result.patientReference = get(condition, 'subject.reference', '');
  }
  result.asserterDisplay = get(condition, 'asserter.display', '');
  result.clinicalStatus = get(condition, 'clinicalStatus', '');
  result.verificationStatus = get(condition, 'verificationStatus', '');
  result.snomedCode = get(condition, 'code.coding[0].code', '');
  result.snomedDisplay = get(condition, 'code.coding[0].display', '');
  result.evidenceDisplay = get(condition, 'evidence[0].detail[0].display', '');
  result.barcode = get(condition, '_id', '');
  result.severity = get(condition, 'severity.text', '');
  result.onsetDateTime = moment(get(condition, 'onsetDateTime', '')).format("YYYY-MM-DD");
  result.abatementDateTime = moment(get(condition, 'abatementDateTime', '')).format("YYYY-MM-DD");

  return result;
}


function ConditionsTable(props){
  logger.info('Rendering the ConditionsTable');
  logger.verbose('clinical:hl7-resource-encounter.client.ConditionsTable');
  logger.data('ConditionsTable.props', {data: props}, {source: "ConditionsTable.jsx"});

  const classes = useStyles();

  //---------------------------------------------------------------------
  // Pagination

  let rows = [];
  let rowsPerPageToRender = 5;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  if(props.rowsPerPage){
    // if we receive an override as a prop, render that many rows
    // best to use rowsPerPage with disablePagination
    rowsPerPageToRender = props.rowsPerPage;
  } else {
    // otherwise default to the user selection
    rowsPerPageToRender = rowsPerPage;
  }

  let paginationCount = 101;
  if(props.count){
    paginationCount = props.count;
  } else {
    paginationCount = rows.length;
  }

  //---------------------------------------------------------------------
  // Helper Functions

  function removeRecord(_id){
    logger.info('Removing condition: ' + _id)
    Conditions._collection.remove({_id: _id})
  }
  function showSecurityDialog(condition){
    // logger.log('showSecurityDialog', condition)

    Session.set('securityDialogResourceJson', Conditions.findOne(get(condition, '_id')));
    Session.set('securityDialogResourceType', 'Condition');
    Session.set('securityDialogResourceId', get(condition, '_id'));
    Session.set('securityDialogOpen', true);
  }
  function displayOnMobile(width){
    let style = {};
    if(['iPhone'].includes(window.navigator.platform)){
      style.display = "none";
    }
    if(width){
      style.width = width;
    } else {
      style.minWidth = '140px'
    }
    return style;
  }
  function renderCheckboxHeader(){
    if (props.renderCheckboxes) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Checkbox</TableCell>
      );
    }
  }
  function renderCheckbox(patientId ){
    if (props.renderCheckboxes) {
      return (
        <TableCell className="toggle">
          <Checkbox
            defaultChecked={true}
          />
        </TableCell>
      );
    }
  }
  function renderDateHeader(header){
    if (props.renderDates) {
      return (
        <TableCell className='date' style={{minWidth: '100px'}}>{header}</TableCell>
      );
    }
  }
  function renderStartDate(startDate ){
    if (props.renderDates) {
      return (
        <TableCell className='date'>{ moment(startDate).format('YYYY-MM-DD') }</TableCell>
      );
    }
  }
  function renderEndDate(endDate ){
    if (props.renderDates) {
      return (
        <TableCell className='date'>{ moment(endDate).format('YYYY-MM-DD') }</TableCell>
      );
    }
  }
  function renderPatientNameHeader(){
    if (props.renderPatientName) {
      return (
        <TableCell className='patientDisplay'>Patient</TableCell>
      );
    }
  }
  function renderPatientName(patientDisplay ){
    if (props.renderPatientName) {
      return (
        <TableCell className='patientDisplay' style={{minWidth: '140px'}}>{ patientDisplay }</TableCell>
      );
    }
  }
  function renderPatientReferenceHeader(){
    if (props.renderPatientReference) {
      return (
        <TableCell className='patientReference'>Patient Reference</TableCell>
      );
    }
  }
  function renderPatientReference(patientReference ){
    if (props.renderPatientReference) {
      return (
        <TableCell className='patientReference' style={{minWidth: '140px'}}>{ patientReference }</TableCell>
      );
    }
  }
  function renderAsserterNameHeader(){
    if (props.renderAsserterName) {
      return (
        <TableCell className='asserterDisplay'>Asserter</TableCell>
      );
    }
  }
  function renderAsserterName(asserterDisplay ){
    if (props.renderAsserterName) {
      return (
        <TableCell className='asserterDisplay' style={{minWidth: '140px'}}>{ asserterDisplay }</TableCell>
      );
    }
  }  
  function renderSeverityHeader(){
    if (props.renderSeverity) {
      return (
        <TableCell className='renderSeverity'>Severity</TableCell>
      );
    }
  }
  function renderSeverity(severity ){
    if (props.renderSeverity) {
      return (
        <TableCell className='severity'>{ severity }</TableCell>
      );
    }
  } 
  function renderEvidenceHeader(){
    if (props.renderEvidence) {
      return (
        <TableCell className='evidence'>Evidence</TableCell>
      );
    }
  }
  function renderEvidence(evidenceDisplay ){
    if (props.renderEvidence) {
      return (
        <TableCell className='evidence'>{ evidenceDisplay }</TableCell>
      );
    }
  } 
  function renderIdentifierHeader(){
    if (props.renderIdentifier) {
      return (
        <TableCell className='identifier'>Identifier</TableCell>
      );
    }
  }
  function renderIdentifier(identifier ){
    if (props.renderIdentifier) {
      return (
        <TableCell className='identifier'>{ identifier }</TableCell>
      );
    }
  } 
  function renderClinicalStatus(clinicalStatus){
    if (props.renderClinicalStatus) {
      return (
        <TableCell className='clinicalStatus'>{ clinicalStatus }</TableCell>
      );
    }
  }
  function renderClinicalStatusHeader(){
    if (props.renderClinicalStatus) {
      return (
        <TableCell className='clinicalStatus'>Clinical Status</TableCell>
      );
    }
  }
  function renderSnomedCode(snomedCode){
    if (props.renderSnomedCode) {
      return (
        <TableCell className='snomedCode'>{ snomedCode }</TableCell>
      );
    }
  }
  function renderSnomedCodeHeader(){
    if (props.renderSnomedCode) {
      return (
        <TableCell className='snomedCode'>SNOMED Code</TableCell>
      );
    }
  }
  function renderSnomedDisplay(snomedDisplay){
    if (props.renderSnomedDisplay) {
      return (
        <TableCell className='snomedDisplay' style={{whiteSpace: 'nowrap'}} >{ snomedDisplay }</TableCell>
      );
    }
  }
  function renderSnomedDisplayHeader(){
    if (props.renderSnomedDisplay) {
      return (
        <TableCell className='snomedDisplay'>SNOMED Display</TableCell>
      );
    }
  }
  function renderVerification(verificationStatus){
    if (props.renderVerification) {
      return (
        <TableCell className='verificationStatus' style={ displayOnMobile()} >{ verificationStatus }</TableCell>
      );
    }
  }
  function renderVerificationHeader(){
    if (props.renderVerification) {
      return (
        <TableCell className='verificationStatus' style={ displayOnMobile('140px')} >Verification</TableCell>
      );
    }
  }
  function renderActionIconsHeader(){
    if (props.renderActionIcons) {
      return (
        <TableCell className='actionIcons'>Actions</TableCell>
      );
    }
  }
  function renderActionIcons( condition ){
    if (props.renderActionIcons) {

      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{width: '120px'}}>
          <Icon icon={tag} style={iconStyle} onClick={showSecurityDialog.bind(this, condition)} />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={removeRecord.bind(this, condition._id)} />
        </TableCell>
      );
    }
  } 

  function renderBarcode(id){
    if (!props.renderBarcode) {
      return (
        <TableCell><span className="barcode helveticas">{id}</span></TableCell>
      );
    }
  }
  function renderBarcodeHeader(){
    if (!props.renderBarcode) {
      return (
        <TableCell>System ID</TableCell>
      );
    }
  }
  function renderActionButtonHeader(){
    if (props.showActionButton === true) {
      return (
        <TableCell className='ActionButton' >Action</TableCell>
      );
    }
  }
  function renderActionButton(patient){
    if (props.showActionButton === true) {
      return (
        <TableCell className='ActionButton' >
          <Button onClick={ onActionButtonClick.bind(this, patient[i]._id)}>{ get(props, "actionButtonLabel", "") }</Button>
        </TableCell>
      );
    }
  }

  function rowClick(id){
    Session.set('selectedConditionId', id);
    Session.set('conditionPageTabIndex', 2);
  };


  let tableRows = [];
  let conditionsToRender = [];
  let dateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    dateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.dateFormat){
    dateFormat = props.dateFormat;
  }

  if(props.conditions){
    if(props.conditions.length > 0){     
      let count = 0;    

      // if(props.renderEnteredInError){
      //   query.verificationStatus = {
      //     $nin: ["entered-in-error"]  // unconfirmed | provisional | differential | confirmed | refuted | entered-in-error
      //   }
      // }

      props.conditions.forEach(function(condition){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          conditionsToRender.push(flattenCondition(condition, dateFormat));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer'
  }
  if(conditionsToRender.length === 0){
    logger.trace('ConditionsTable: No conditions to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < conditionsToRender.length; i++) {
      if(get(conditionsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      tableRows.push(
        <TableRow className="conditionRow" key={i} style={rowStyle} onClick={ rowClick.bind(this, conditionsToRender[i]._id)} style={{cursor: 'pointer'}} hover="true" >            
          { renderCheckbox() }
          { renderActionIcons(conditionsToRender[i]) }
          { renderIdentifier(conditionsToRender.identifier ) }
          { renderPatientName(conditionsToRender[i].patientDisplay ) } 
          { renderPatientReference(conditionsToRender[i].patientReference ) }           
          { renderAsserterName(conditionsToRender[i].asserterDisplay ) } 
          { renderClinicalStatus(conditionsToRender[i].clinicalStatus)}
          { renderSnomedCode(conditionsToRender[i].snomedCode)}
          { renderSnomedDisplay(conditionsToRender[i].snomedDisplay)}
          { renderVerification(conditionsToRender[i].verificationStatus ) } 
          { renderSeverity(conditionsToRender[i].severity) }
          { renderEvidence(conditionsToRender[i].evidenceDisplay) }
          { renderStartDate(conditionsToRender[i].onsetDateTime) }
          { renderEndDate(conditionsToRender[i].abatementDateTime) }
          { renderBarcode(conditionsToRender[i]._id)}
          { renderActionButton(conditionsToRender[i]) }
        </TableRow>
      );    
    }
  }

  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  let paginationFooter;
  if(props.disablePagination){
    paginationFooter = <TablePagination
      component="div"
      rowsPerPageOptions={[5, 10, 25, 100]}
      colSpan={3}
      count={paginationCount}
      rowsPerPage={rowsPerPageToRender}
      page={page}
      onChangePage={handleChangePage}
      style={{float: 'right', border: 'none'}}
    />
  }

  return(
    <div>
      <Table id='conditionsTable'>
        <TableHead>
          <TableRow>
            { renderCheckboxHeader() } 
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }
            { renderPatientNameHeader() }
            { renderPatientReferenceHeader() }
            { renderAsserterNameHeader() }
            { renderClinicalStatusHeader() }
            { renderSnomedCodeHeader() }
            { renderSnomedDisplayHeader() }          
            { renderVerificationHeader() }
            { renderSeverityHeader() }
            { renderEvidenceHeader() }
            { renderDateHeader('Start') }
            { renderDateHeader('End') }
            { renderBarcodeHeader() }
            { renderActionButtonHeader() }
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


ConditionsTable.propTypes = {
  data: PropTypes.array,
  conditions: PropTypes.array,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  renderCheckboxes: PropTypes.bool,
  renderActionIcons: PropTypes.bool,
  renderIdentifier: PropTypes.bool,
  renderPatientName: PropTypes.bool,
  renderPatientReference: PropTypes.bool,
  renderAsserterName: PropTypes.bool,
  renderClinicalStatus: PropTypes.bool,
  renderSnomedCode: PropTypes.bool,
  renderSnomedDisplay: PropTypes.bool,
  renderVerification: PropTypes.bool,
  renderServerity: PropTypes.bool,
  renderEvidence: PropTypes.bool,
  renderDates: PropTypes.bool,
  renderBarcode: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  showActionButton: PropTypes.bool,
  actionButtonLabel: PropTypes.string,

  rowsPerPage: PropTypes.number,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,
  renderEnteredInError: PropTypes.bool
};

ConditionsTable.defaultProps = {
  renderCheckboxes: false,
  renderActionIcons: false,
  renderIdentifier: false,
  renderPatientName: true,
  renderPatientReference: true,
  renderAsserterName: true,
  renderClinicalStatus: true,
  renderSnomedCode: true,
  renderSnomedDisplay: true,
  renderVerification: true,
  renderServerity: true,
  renderEvidence: true,
  renderDates: true,
  renderBarcode: false,
  disablePagination: false
}

export default ConditionsTable;
