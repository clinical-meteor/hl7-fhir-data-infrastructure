import React, { useState, useEffect } from 'react';
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
import FhirDehydrator, { flattenCondition } from '../../lib/FhirDehydrator';


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
    hide: 'table'
  },
  cellHideOnPhone: {
    visibility: 'visible',
    hide: 'table',
    paddingTop: '16px',
    maxWidth: '120px'
  },
  cell: {
    paddingTop: '16px'
  }
}



//===========================================================================
// MAIN COMPONENT

function ConditionsTable(props){
  logger.info('Rendering the ConditionsTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.ConditionsTable');
  logger.data('ConditionsTable.props', {data: props}, {source: "ConditionsTable.jsx"});

  const classes = useStyles();

  let { 
    id,
    children, 

    data,
    conditions,
    selectedConditionId,

    query,
    paginationLimit,
    disablePagination,
  
    hideCheckbox,
    hideActionIcons,
    hideIdentifier,
    hidePatientName,
    hidePatientReference,
    hideAsserterName,
    hideClinicalStatus,
    hideSnomedCode,
    hideSnomedDisplay,
    hideVerification,
    hideSeverity,
    hideEvidence,
    hideDates,
    hideEndDate,
    hideBarcode,
  
    onCellClick,
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButtonClick,
    showActionButton,
    actionButtonLabel,
  
    autoColumns,
    rowsPerPage,
    tableRowSize,
    dateFormat,
    showMinutes,
    hideEnteredInError,
    formFactorLayout,

    ...otherProps 
  } = props;


    // ------------------------------------------------------------------------
  // Form Factors

  if(formFactorLayout){
    logger.verbose('formFactorLayout', formFactorLayout + ' ' + window.innerWidth);
    switch (formFactorLayout) {
      case "phone":
        hideCheckbox = true;
        hideActionIcons = true;
        hidePatientName = true;
        hidePatientReference = true;
        hideClinicalStatus = true;
        hideSnomedCode = true;
        hideSnomedDisplay = false;
        hideVerification = false;
        hideSeverity = true;
        hideEvidence = true;
        hideDates = true;
        hideEndDate = true;
        hideBarcode = true;  
        multiline = true;
        break;
      case "tablet":
        hideCheckbox = true;
        hideActionIcons = true;
        hidePatientName = true;
        hidePatientReference = true;
        hideClinicalStatus = true;
        hideSnomedCode = false;
        hideSnomedDisplay = true;
        hideVerification = false;
        hideSeverity = true;
        hideEvidence = false;
        hideDates = true;
        hideEndDate = false;
        hideBarcode = false;   
        multiline = false;
        break;
      case "web":
        hideClinicalStatus = true;
        hideSnomedCode = true;
        hideSnomedDisplay = true;
        hideVerification = true;
        hideSeverity = true;
        hideEvidence = false;
        hideDates = true;
        hideEndDate = false;
        hideBarcode = false;
        multiline = false;
        break;
      case "desktop":
        hideClinicalStatus = true;
        hideSnomedCode = true;
        hideSnomedDisplay = true;
        hideVerification = true;
        hideSeverity = true;
        hideEvidence = false;
        hideDates = true;
        hideEndDate = true;
        hideBarcode = false;
        multiline = false;
        break;
      case "hdmi":
        hideClinicalStatus = true;
        hideSnomedCode = true;
        hideSnomedDisplay = true;
        hideVerification = true;
        hideSeverity = true;
        hideEvidence = true;
        hideDates = true;
        hideEndDate = true;
        hideBarcode = true;
        multiline = false;
        break;            
    }
  }


  //---------------------------------------------------------------------
  // Pagination

  
  let rows = [];
  const [hasInitializedAutoColumns, setHasInitializedAutoColumns] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPageToRender, setRowsPerPage] = useState(rowsPerPage);
  const [autoColumnState, setAutoColumns] = useState({
    checkboxes: false,
    actionIcons: false,
    identifier: false,
    patientName: false,
    patientReference: false,
    asserterName: false,
    clinicalStatus: false,
    snomedCode: false,
    snomedDisplay: false,
    verification: false,
    serverity: false,
    evidence: false,
    dates: false,
    endDate: false,
    hideBarcode: false
  });


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
  if(!disablePagination){
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

  //--------------------------------------------------------------------------------
  // Autocolumns  

    
  if(Array.isArray(conditions)){
    if(!hasInitializedAutoColumns){
      let columnHasData = {
        identifier: false,
        patientName: false,
        patientReference: false,
        asserterName: false,
        clinicalStatus: false,
        snomedCode: false,
        snomedDisplay: false,
        verification: false,
        serverity: false,
        evidence: false,
        dates: false,
        endDate: false,
        barcode: false
      }
      
      let flattenedCollection = conditions.map(function(record){
        return flattenCondition(record, "YYYY-MM-DD");
      });      
  
      flattenedCollection.forEach(function(row){
        if(get(row, 'id')){
          columnHasData.barcode = true;
        }
        if(get(row, 'identifier')){
          columnHasData.identifier = true;
        }
        if(get(row, 'clinicalStatus')){
          columnHasData.clinicalStatus = true;
        }
        if(get(row, 'verificationStatus')){
          columnHasData.barcode = true;
        }
        if(get(row, 'verificationStatus')){
          columnHasData.barcode = true;
        }
        if(get(row, 'patientDisplay')){
          columnHasData.patientName = true;
        }
        if(get(row, 'patientReference')){
          columnHasData.patientReference = true;
        }
        if(get(row, 'severity')){
          columnHasData.severity = true;
        }
        if(get(row, 'snomedCode')){
          columnHasData.snomedCode = true;
        }
        if(get(row, 'snomedDisplay')){
          columnHasData.snomedDisplay = true;
        }
        if(get(row, 'evidenceDisplay')){
          columnHasData.barcode = true;
        }
        if(get(row, 'evidence')){
          columnHasData.barcode = true;
        }
        if(get(row, 'onsetDateTime')){
          columnHasData.dates = true;
        }
        if(get(row, 'abatementDateTime')){
          columnHasData.endDate = true;
        }
      })
  
      setHasInitializedAutoColumns(true);
      setAutoColumns(columnHasData)
    }
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
    if (!hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Checkbox</TableCell>
      );
    }
  }
  function renderCheckbox(patientId ){
    if (!hideCheckbox) {
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
    if (!hideDates || (props.autoColumns && autoColumnState.dates)) {
      return (
        <TableCell className='date' style={{minWidth: '100px'}}>Start</TableCell>
      );
    }
  }
  function renderEndDateHeader(){
    if ((!hideDates && !hideEndDate) || (props.autoColumns && autoColumnState.endDate)) {
      return (
        <TableCell className='date' style={{minWidth: '100px'}}>End</TableCell>
      );
    }
  }
  function renderStartDate(startDate ){
    if (!hideDates || (props.autoColumns && autoColumnState.dates)) {
      return (
        <TableCell className='date'>{ moment(startDate).format('YYYY-MM-DD') }</TableCell>
      );
    }
  }
  function renderEndDate(endDate ){
    if ((!hideDates && !hideEndDate) || (props.autoColumns && autoColumnState.endDate)) {
      return (
        <TableCell className='date'>{ moment(endDate).format('YYYY-MM-DD') }</TableCell>
      );
    }
  }
  function renderPatientNameHeader(){
    if (!hidePatientName || (props.autoColumns && autoColumnState.patientName)) {
      return (
        <TableCell className='patientDisplay'>Patient</TableCell>
      );
    }
  }
  function renderPatientName(patientDisplay ){
    if (!hidePatientName || (props.autoColumns && autoColumnState.patientName)) {
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
  function renderAsserterNameHeader(){
    if (!hideAsserterName || (props.autoColumns && autoColumnState.asserterName)) {
      return (
        <TableCell className='asserterDisplay'>Asserter</TableCell>
      );
    }
  }
  function renderAsserterName(asserterDisplay ){
    if (!hideAsserterName || (props.autoColumns && autoColumnState.asserterName)) {
      return (
        <TableCell className='asserterDisplay' style={{minWidth: '140px'}}>{ asserterDisplay }</TableCell>
      );
    }
  }  
  function renderSeverityHeader(){
    if (!hideSeverity) {
      return (
        <TableCell className='renderSeverity'>Severity</TableCell>
      );
    }
  }
  function renderSeverity(severity ){
    if (!hideSeverity) {
      return (
        <TableCell className='severity'>{ severity }</TableCell>
      );
    }
  } 
  function renderEvidenceHeader(){
    if (!hideEvidence || (props.autoColumns && autoColumnState.evidence)) {
      return (
        <TableCell className='evidence'>Evidence</TableCell>
      );
    }
  }
  function renderEvidence(evidenceDisplay ){
    if (!hideEvidence || (props.autoColumns && autoColumnState.evidence)) {
      return (
        <TableCell className='evidence'>{ evidenceDisplay }</TableCell>
      );
    }
  } 
  function renderIdentifierHeader(){
    if (!hideIdentifier) {
      return (
        <TableCell className='identifier'>Identifier</TableCell>
      );
    }
  }
  function renderIdentifier(identifier ){
    if (!hideIdentifier) {
      return (
        <TableCell className='identifier'>{ identifier }</TableCell>
      );
    }
  } 
  function renderClinicalStatus(clinicalStatus){
    if (!hideClinicalStatus) {
      return (
        <TableCell className='clinicalStatus'>{ clinicalStatus }</TableCell>
      );
    }
  }
  function renderClinicalStatusHeader(){
    if (!hideClinicalStatus) {
      return (
        <TableCell className='clinicalStatus'>Clinical Status</TableCell>
      );
    }
  }
  function renderSnomedCode(snomedCode){
    if (!hideSnomedCode) {
      return (
        <TableCell className='snomedCode'>{ snomedCode }</TableCell>
      );
    }
  }
  function renderSnomedCodeHeader(){
    if (!hideSnomedCode) {
      return (
        <TableCell className='snomedCode'>SNOMED Code</TableCell>
      );
    }
  }
  function renderSnomedDisplay(snomedDisplay, snomedCode){
    if (!hideSnomedDisplay) {
      if(multiline){
        return (<TableCell className='snomedDisplay'>
          <span style={{fontWeight: 400}}>{snomedDisplay }</span> <br />
          <span style={{color: 'gray'}}>{ snomedCode }</span>
        </TableCell>)
      } else {
        return (
          <TableCell className='snomedDisplay' style={{whiteSpace: 'nowrap'}} >{ snomedDisplay }</TableCell>
        );  
      }
    }
  }
  function renderSnomedDisplayHeader(){
    if (!hideSnomedDisplay) {
      return (
        <TableCell className='snomedDisplay'>SNOMED Display</TableCell>
      );
    }
  }
  function renderVerification(verificationStatus){
    if (!hideVerification) {
      return (
        <TableCell className='verificationStatus' >{ verificationStatus }</TableCell>
      );
    }
  }
  function renderVerificationHeader(){
    if (!hideVerification) {
      return (
        <TableCell className='verificationStatus' >Verification</TableCell>
      );
    }
  }
  function renderActionIconsHeader(){
    if (!hideActionIcons) {
      return (
        <TableCell className='actionIcons'>Actions</TableCell>
      );
    }
  }
  function renderActionIcons( condition ){
    if (!hideActionIcons) {

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
    if (!hideBarcode) {
      return (
        <TableCell><span className="barcode helveticas">{id}</span></TableCell>
      );
    }
  }
  function renderBarcodeHeader(){
    if (!hideBarcode) {
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

      // if(!hideEnteredInError){
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
  } else {
    for (var i = 0; i < conditionsToRender.length; i++) {
      let selected = false;
      if(conditionsToRender[i].id === selectedConditionId){
        selected = true;
      }
      if(get(conditionsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }
      logger.trace('conditionsToRender[i]', conditionsToRender[i])
      tableRows.push(
        <TableRow className="conditionRow" key={i} style={rowStyle} onClick={ rowClick.bind(this, conditionsToRender[i]._id)} style={rowStyle} hover={true} selected={selected} >            
          { renderCheckbox() }
          { renderActionIcons(conditionsToRender[i]) }
          { renderIdentifier(conditionsToRender.identifier ) }
          { renderPatientName(conditionsToRender[i].patientDisplay ) } 
          { renderPatientReference(conditionsToRender[i].patientReference ) }           
          { renderAsserterName(conditionsToRender[i].asserterDisplay ) } 
          { renderClinicalStatus(conditionsToRender[i].clinicalStatus)}
          { renderSnomedCode(conditionsToRender[i].snomedCode)}
          { renderSnomedDisplay(conditionsToRender[i].snomedDisplay, conditionsToRender[i].snomedCode)}
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
      <Table className='conditionsTable' size={tableRowSize} aria-label="a dense table" { ...otherProps }>
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
  selectedConditionId: PropTypes.string,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hidePatientName: PropTypes.bool,
  hidePatientReference: PropTypes.bool,
  hideAsserterName: PropTypes.bool,
  hideClinicalStatus: PropTypes.bool,
  hideSnomedCode: PropTypes.bool,
  hideSnomedDisplay: PropTypes.bool,
  hideVerification: PropTypes.bool,
  hideSeverity: PropTypes.bool,
  hideEvidence: PropTypes.bool,
  hideDates: PropTypes.bool,
  hideEndDate: PropTypes.bool,
  hideBarcode: PropTypes.bool,

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
  hideEnteredInError: PropTypes.bool,
  count: PropTypes.number,
  tableRowSize: PropTypes.string,
  formFactorLayout: PropTypes.string
};

ConditionsTable.defaultProps = {
  hideCheckbox: true,
  hideActionIcons: true,
  hideIdentifier: true,
  hidePatientName: true,
  hidePatientReference: true,
  hideAsserterName: true,
  hideClinicalStatus: true,
  hideSnomedCode: true,
  hideSnomedDisplay: true,
  hideVerification: true,
  hideSeverity: true,
  hideEvidence: false,
  hideDates: true,
  hideEndDate: true,
  hideBarcode: false,
  disablePagination: false,

  autoColumns: false,
  rowsPerPage: 5,
  tableRowSize: "normal"  // small | normal
}

export default ConditionsTable;
