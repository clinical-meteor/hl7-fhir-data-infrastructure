import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
} from '@material-ui/core';


import moment from 'moment'
import _ from 'lodash';
let get = _.get;
let set = _.set;

// import { Icon } from 'react-icons-kit'
// import { tag } from 'react-icons-kit/fa/tag'
// import {iosTrashOutline} from 'react-icons-kit/ionicons/iosTrashOutline'

import FhirUtilities from '../../lib/FhirUtilities';


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

flattenCondition = function(condition, internalDateFormat){
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

  if(!internalDateFormat){
    internalDateFormat = "YYYY-MM-DD";
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


  if(get(condition, 'clinicalStatus.coding[0].code')){
    result.clinicalStatus = get(condition, 'clinicalStatus.coding[0].code', '');  //R4
  } else {
    result.clinicalStatus = get(condition, 'clinicalStatus', '');                 // DSTU2
  }

  if(get(condition, 'verificationStatus.coding[0].code')){
    result.verificationStatus = get(condition, 'verificationStatus.coding[0].code', '');  // R4
  } else {
    result.verificationStatus = get(condition, 'verificationStatus', '');                 // DSTU2
  }

  result.snomedCode = get(condition, 'code.coding[0].code', '');
  result.snomedDisplay = get(condition, 'code.coding[0].display', '');

  result.evidenceDisplay = get(condition, 'evidence[0].detail[0].display', '');
  result.barcode = get(condition, '_id', '');
  result.severity = get(condition, 'severity.text', '');

  result.onsetDateTime = moment(get(condition, 'onsetDateTime', '')).format("YYYY-MM-DD");
  result.abatementDateTime = moment(get(condition, 'abatementDateTime', '')).format("YYYY-MM-DD");

  // let momentStart = moment(get(encounter, 'period.start', ''))
  // if(get(encounter, 'period.start')){
  //   momentStart = moment(get(encounter, 'period.start', ''))
  // } else if(get(encounter, 'performedPeriod.start')){
  //   momentStart = moment(get(encounter, 'performedPeriod.start', ''))
  // }
  // if(momentStart){
  //   result.periodStart = momentStart.format(internalDateFormat);
  // } 


  // let momentEnd;
  // if(get(encounter, 'period.end')){
  //   momentEnd = moment(get(encounter, 'period.end', ''))
  // } else if(get(encounter, 'performedPeriod.end')){
  //   momentEnd = moment(get(encounter, 'performedPeriod.end', ''))
  // }
  // if(momentEnd){
  //   result.periodEnd = momentEnd.format(internalDateFormat);
  // } 

  // if(momentStart && momentEnd){
  //   result.duration = Math.abs(momentStart.diff(momentEnd, 'minutes', true))
  // }

  return result;
}


//===========================================================================
// MAIN COMPONENT

function ConditionsTable(props){
  logger.info('Rendering the ConditionsTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.ConditionsTable');
  logger.data('ConditionsTable.props', {data: props}, {source: "ConditionsTable.jsx"});

  const classes = useStyles();

  let { 
    children, 

    data,
    conditions,
    query,
    paginationLimit,
    disablePagination,
  
    displayCheckboxes,
    displayActionIcons,
    displayIdentifier,
    displayPatientName,
    displayPatientReference,
    displayAsserterName,
    displayClinicalStatus,
    displaySnomedCode,
    displaySnomedDisplay,
    displayVerification,
    displayServerity,
    displayEvidence,
    displayDates,
    displayEndDate,
    displayBarcode,
  
    onCellClick,
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButtonClick,
    showActionButton,
    actionButtonLabel,
  
    rowsPerPage,
    dateFormat,
    showMinutes,
    displayEnteredInError,

    ...otherProps 
  } = props;

  //---------------------------------------------------------------------
  // Pagination

  let rows = [];
  const [page, setPage] = useState(0);
  const [rowsPerPageToRender, setRowsPerPage] = useState(rowsPerPage);


  let paginationCount = 101;
  if(props.count){
    paginationCount = props.count;
  } else {
    paginationCount = rows.length;
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  let paginationFooter;
  if(!props.disablePagination){
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


  //---------------------------------------------------------------------
  // Helper Functions

  function removeRecord(_id){
    console.log('removeRecord')
  }
  function rowClick(id){
    console.log('rowClick')
  }
  function handleActionButtonClick(){
    console.log('handleActionButtonClick')
  }
  
  //---------------------------------------------------------------------
  // Column Rendering

  function renderCheckboxHeader(){
    if (props.displayCheckboxes) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Checkbox</TableCell>
      );
    }
  }
  function renderCheckbox(patientId ){
    if (props.displayCheckboxes) {
      return (
        <TableCell className="toggle">
          <Checkbox
            defaultChecked={true}
          />
        </TableCell>
      );
    }
  }
  function renderDateHeader(){
    if (props.displayDates) {
      return (
        <TableCell className='date' style={{minWidth: '100px'}}>Start</TableCell>
      );
    }
  }
  function renderEndDateHeader(){
    if (props.displayDates && props.displayEndDate) {
      return (
        <TableCell className='date' style={{minWidth: '100px'}}>End</TableCell>
      );
    }
  }
  function renderStartDate(startDate ){
    if (props.displayDates) {
      return (
        <TableCell className='date'>{ moment(startDate).format('YYYY-MM-DD') }</TableCell>
      );
    }
  }
  function renderEndDate(endDate ){
    if (props.displayDates && props.displayEndDate) {
      return (
        <TableCell className='date'>{ moment(endDate).format('YYYY-MM-DD') }</TableCell>
      );
    }
  }
  function renderPatientNameHeader(){
    if (props.displayPatientName) {
      return (
        <TableCell className='patientDisplay'>Patient</TableCell>
      );
    }
  }
  function renderPatientName(patientDisplay ){
    if (props.displayPatientName) {
      return (
        <TableCell className='patientDisplay' style={{minWidth: '140px'}}>{ patientDisplay }</TableCell>
      );
    }
  }
  function renderPatientReferenceHeader(){
    if (props.displayPatientReference) {
      return (
        <TableCell className='patientReference'>Patient Reference</TableCell>
      );
    }
  }
  function renderPatientReference(patientReference ){
    if (props.displayPatientReference) {
      return (
        <TableCell className='patientReference' style={{maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis',  whiteSpace: 'nowrap'}}>
          { FhirUtilities.pluckReferenceId(patientReference) }
        </TableCell>
      );
    }
  }
  function renderAsserterNameHeader(){
    if (props.displayAsserterName) {
      return (
        <TableCell className='asserterDisplay'>Asserter</TableCell>
      );
    }
  }
  function renderAsserterName(asserterDisplay ){
    if (props.displayAsserterName) {
      return (
        <TableCell className='asserterDisplay' style={{minWidth: '140px'}}>{ asserterDisplay }</TableCell>
      );
    }
  }  
  function renderSeverityHeader(){
    if (props.displaySeverity) {
      return (
        <TableCell className='renderSeverity'>Severity</TableCell>
      );
    }
  }
  function renderSeverity(severity ){
    if (props.displaySeverity) {
      return (
        <TableCell className='severity'>{ severity }</TableCell>
      );
    }
  } 
  function renderEvidenceHeader(){
    if (props.displayEvidence) {
      return (
        <TableCell className='evidence'>Evidence</TableCell>
      );
    }
  }
  function renderEvidence(evidenceDisplay ){
    if (props.displayEvidence) {
      return (
        <TableCell className='evidence'>{ evidenceDisplay }</TableCell>
      );
    }
  } 
  function renderIdentifierHeader(){
    if (props.displayIdentifier) {
      return (
        <TableCell className='identifier'>Identifier</TableCell>
      );
    }
  }
  function renderIdentifier(identifier ){
    if (props.displayIdentifier) {
      return (
        <TableCell className='identifier'>{ identifier }</TableCell>
      );
    }
  } 
  function renderClinicalStatus(clinicalStatus){
    if (props.displayClinicalStatus) {
      return (
        <TableCell className='clinicalStatus'>{ clinicalStatus }</TableCell>
      );
    }
  }
  function renderClinicalStatusHeader(){
    if (props.displayClinicalStatus) {
      return (
        <TableCell className='clinicalStatus'>Clinical Status</TableCell>
      );
    }
  }
  function renderSnomedCode(snomedCode){
    if (props.displaySnomedCode) {
      return (
        <TableCell className='snomedCode'>{ snomedCode }</TableCell>
      );
    }
  }
  function renderSnomedCodeHeader(){
    if (props.displaySnomedCode) {
      return (
        <TableCell className='snomedCode'>SNOMED Code</TableCell>
      );
    }
  }
  function renderSnomedDisplay(snomedDisplay){
    if (props.displaySnomedDisplay) {
      return (
        <TableCell className='snomedDisplay' style={{whiteSpace: 'nowrap'}} >{ snomedDisplay }</TableCell>
      );
    }
  }
  function renderSnomedDisplayHeader(){
    if (props.displaySnomedDisplay) {
      return (
        <TableCell className='snomedDisplay'>SNOMED Display</TableCell>
      );
    }
  }
  function renderVerification(verificationStatus){
    if (props.displayVerification) {
      return (
        <TableCell className='verificationStatus' >{ verificationStatus }</TableCell>
      );
    }
  }
  function renderVerificationHeader(){
    if (props.displayVerification) {
      return (
        <TableCell className='verificationStatus' >Verification</TableCell>
      );
    }
  }
  function renderActionIconsHeader(){
    if (props.displayActionIcons) {
      return (
        <TableCell className='actionIcons'>Actions</TableCell>
      );
    }
  }
  function renderActionIcons( condition ){
    if (props.displayActionIcons) {

      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{width: '120px'}}>
          {/* <Icon icon={tag} style={iconStyle} onClick={showSecurityDialog.bind(this, condition)} />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={removeRecord.bind(this, condition._id)} /> */}
        </TableCell>
      );
    }
  } 

  function renderBarcode(id){
    if (props.displayBarcode) {
      return (
        <TableCell><span className="barcode helveticas">{id}</span></TableCell>
      );
    }
  }
  function renderBarcodeHeader(){
    if (props.displayBarcode) {
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
    // Session.set('selectedConditionId', id);
    // Session.set('conditionPageTabIndex', 2);
  };



  //---------------------------------------------------------------------
  // Table Rows

  let tableRows = [];
  let conditionsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.dateFormat){
    internalDateFormat = props.dateFormat;
  }

  if(props.conditions){
    if(props.conditions.length > 0){     
      let count = 0;    

      // if(props.displayEnteredInError){
      //   query.verificationStatus = {
      //     $nin: ["entered-in-error"]  // unconfirmed | provisional | differential | confirmed | refuted | entered-in-error
      //   }
      // }

      props.conditions.forEach(function(condition){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          conditionsToRender.push(flattenCondition(condition, internalDateFormat));
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
      logger.trace('conditionsToRender[i]', conditionsToRender[i])
      tableRows.push(
        <TableRow className="conditionRow" key={i} style={rowStyle} onClick={ rowClick.bind(this, conditionsToRender[i]._id)} style={{cursor: 'pointer'}} hover={true} >            
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

  

  //---------------------------------------------------------------------
  // Actual Render Method

  return(
    <div>
      <Table className='conditionsTable' size="small" aria-label="a dense table" { ...otherProps }>
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
            { renderDateHeader() }
            { renderEndDateHeader() }
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

  displayCheckboxes: PropTypes.bool,
  displayActionIcons: PropTypes.bool,
  displayIdentifier: PropTypes.bool,
  displayPatientName: PropTypes.bool,
  displayPatientReference: PropTypes.bool,
  displayAsserterName: PropTypes.bool,
  displayClinicalStatus: PropTypes.bool,
  displaySnomedCode: PropTypes.bool,
  displaySnomedDisplay: PropTypes.bool,
  displayVerification: PropTypes.bool,
  displayServerity: PropTypes.bool,
  displayEvidence: PropTypes.bool,
  displayDates: PropTypes.bool,
  displayEndDate: PropTypes.bool,
  displayBarcode: PropTypes.bool,

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
  displayEnteredInError: PropTypes.bool,
  count: PropTypes.number
};

ConditionsTable.defaultProps = {
  displayCheckboxes: false,
  displayActionIcons: false,
  displayIdentifier: false,
  displayPatientName: true,
  displayPatientReference: true,
  displayAsserterName: true,
  displayClinicalStatus: true,
  displaySnomedCode: true,
  displaySnomedDisplay: true,
  displayVerification: true,
  displayServerity: true,
  displayEvidence: true,
  displayDates: true,
  displayEndDate: true,
  displayBarcode: false,
  disablePagination: false,
  rowsPerPage: 5
}

export default ConditionsTable;
