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
import { get } from 'lodash';

// import { Icon } from 'react-icons-kit'
// import { tag } from 'react-icons-kit/fa/tag'
// import {iosTrashOutline} from 'react-icons-kit/ionicons/iosTrashOutline'

import { FhirUtilities } from '../../lib/FhirUtilities';

import { FhirDehydrator, StyledCard, PageCanvas } from 'fhir-starter';


//===========================================================================
// THEMING

import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  button: {
    background: theme.background,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: theme.buttonText,
    height: 48,
    padding: '0 30px',
  },
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
}));




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
    hideActionButton,
    actionButtonLabel,
  
    autoColumns,
    rowsPerPage,
    tableRowSize,
    dateFormat,
    showMinutes,
    hideEnteredInError,
    formFactorLayout,
    count,
    labels,

    defaultCheckboxValue,

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
        hideSnomedCode = true;
        hideSnomedDisplay = false;
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
        hideSnomedCode = false;
        hideSnomedDisplay = false;
        hidePatientName = false;
        hideVerification = true;
        hideSeverity = true;
        hideEvidence = false;
        hideDates = true;
        hideEndDate = false;
        hideBarcode = false;
        multiline = false;
        break;
      case "desktop":
        hideClinicalStatus = false;
        hidePatientName = false;
        hideSnomedCode = false;
        hideSnomedDisplay = false;
        hideVerification = true;
        hideSeverity = true;
        hideEvidence = false;
        hideDates = false;
        hideEndDate = true;
        hideBarcode = false;
        multiline = false;
        break;
      case "hdmi":
        hideClinicalStatus = false;
        hideSnomedCode = false;
        hideSnomedDisplay = false;
        hideVerification = false;
        hideSeverity = false;
        hideEvidence = false;
        hideDates = false;
        hideEndDate = false;
        hideBarcode = false;
        multiline = false;
        break;            
    }
  }



  //--------------------------------------------------------------------------------
  // Autocolumns  

    
  // if(Array.isArray(conditions)){
    // if(!hasInitializedAutoColumns){
    //   let columnHasData = {
    //     identifier: false,
    //     patientName: false,
    //     patientReference: false,
    //     asserterName: false,
    //     clinicalStatus: false,
    //     snomedCode: false,
    //     snomedDisplay: false,
    //     verification: false,
    //     serverity: false,
    //     evidence: false,
    //     dates: false,
    //     endDate: false,
    //     barcode: false
    //   }
      
    //   let flattenedCollection = conditions.map(function(record){
    //     return flattenCondition(record, "YYYY-MM-DD");
    //   });      
  
    //   flattenedCollection.forEach(function(row){
    //     if(get(row, 'id')){
    //       columnHasData.barcode = true;
    //     }
    //     if(get(row, 'identifier')){
    //       columnHasData.identifier = true;
    //     }
    //     if(get(row, 'clinicalStatus')){
    //       columnHasData.clinicalStatus = true;
    //     }
    //     if(get(row, 'verificationStatus')){
    //       columnHasData.barcode = true;
    //     }
    //     if(get(row, 'verificationStatus')){
    //       columnHasData.barcode = true;
    //     }
    //     if(get(row, 'patientDisplay')){
    //       columnHasData.patientName = true;
    //     }
    //     if(get(row, 'patientReference')){
    //       columnHasData.patientReference = true;
    //     }
    //     if(get(row, 'severity')){
    //       columnHasData.severity = true;
    //     }
    //     if(get(row, 'snomedCode')){
    //       columnHasData.snomedCode = true;
    //     }
    //     if(get(row, 'snomedDisplay')){
    //       columnHasData.snomedDisplay = true;
    //     }
    //     if(get(row, 'evidenceDisplay')){
    //       columnHasData.barcode = true;
    //     }
    //     if(get(row, 'evidence')){
    //       columnHasData.barcode = true;
    //     }
    //     if(get(row, 'onsetDateTime')){
    //       columnHasData.dates = true;
    //     }
    //     if(get(row, 'abatementDateTime')){
    //       columnHasData.endDate = true;
    //     }
    //   })
  
    //   setHasInitializedAutoColumns(true);
    //   setAutoColumns(columnHasData)
    // }
  //}


  //---------------------------------------------------------------------
  // Helper Functions

  function handleToggle(index){
    console.log('Toggling entry ' + index)
    if(props.onToggle){
      props.onToggle(index);
    }
  }

  function removeRecord(_id){
    console.log('removeRecord')
  }
  function handleRowClick(id){
    // logger.trace('ProceduresTable.rowClick', id);

    if(props && (typeof onRowClick === "function")){
      onRowClick(id);
    }
  }
  function handleActionButtonClick(_id){
    if(typeof onActionButtonClick === "function"){
      onActionButtonClick(_id);
    }
  }
  
  //---------------------------------------------------------------------
  // Column Rendering

  function renderCheckboxHeader(){
    if (!hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >{get(labels, 'checkbox', 'Checkbox')}</TableCell>
      );
    }
  }
  function renderCheckbox(index){
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
  function renderDateHeader(){
    if (!hideDates) {
      return (
        <TableCell className='date' style={{minWidth: '140px'}}>Start</TableCell>
      );
    }
  }
  function renderEndDateHeader(){
    if ((!hideDates && !hideEndDate)) {
      return (
        <TableCell className='date' style={{minWidth: '140px'}}>End</TableCell>
      );
    }
  }
  function renderStartDate(startDate ){
    if (!hideDates) {
      return (
        <TableCell className='date' style={{minWidth: '140px'}}>{ moment(startDate).format('YYYY-MM-DD') }</TableCell>
      );
    }
  }
  function renderEndDate(endDate ){
    if ((!hideDates && !hideEndDate)) {
      return (
        <TableCell className='date' style={{minWidth: '140px'}}>{ moment(endDate).format('YYYY-MM-DD') }</TableCell>
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
  function renderAsserterNameHeader(){
    if (!hideAsserterName) {
      return (
        <TableCell className='asserterDisplay'>Asserter</TableCell>
      );
    }
  }
  function renderAsserterName(asserterDisplay ){
    if (!hideAsserterName) {
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
    if (!hideEvidence) {
      return (
        <TableCell className='evidence'>Evidence</TableCell>
      );
    }
  }
  function renderEvidence(evidenceDisplay ){
    if (!hideEvidence) {
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
        <TableCell className='snomedCode' style={{width: '180px'}}>{ snomedCode }</TableCell>
      );
    }
  }
  function renderSnomedCodeHeader(){
    if (!hideSnomedCode) {
      return (
        <TableCell className='snomedCode' style={{width: '180px'}}>{get(labels, 'snomedCode', 'SNOMED Code')}</TableCell>
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
        <TableCell className='snomedDisplay'>{get(labels, 'snomedDisplay', 'SNOMED Display')}</TableCell>
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
    if (!hideActionButton) {
      return (
        <TableCell className='ActionButton' >Action</TableCell>
      );
    }
  }
  function renderActionButton(conditionId){
    if (!hideActionButton) {
      return (
        <TableCell className='ActionButton' >
          <Button onClick={ handleActionButtonClick.bind(this, conditionId)}>{ get(props, "actionButtonLabel", "") }</Button>
        </TableCell>
      );
    }
  }

  function rowClick(id){
    // Session.set('selectedConditionId', id);
    // Session.set('conditionPageTabIndex', 2);
  };


  //---------------------------------------------------------------------
  // Pagination

  let rows = [];
  const [page, setPage] = useState(0);
  const [rowsPerPageToRender, setRowsPerPage] = useState(rowsPerPage);


  let paginationCount = 101;
  if(count){
    paginationCount = count;
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
      // rowsPerPageOptions={[5, 10, 25, 100]}
      rowsPerPageOptions={['']}
      colSpan={3}
      count={paginationCount}
      rowsPerPage={rowsPerPageToRender}
      page={page}
      onChangePage={handleChangePage}
      style={{float: 'right', border: 'none'}}
    />
  }

  
  //---------------------------------------------------------------------
  // Table Rows

  let tableRows = [];
  let conditionsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }

  if(conditions){
    if(conditions.length > 0){     
      let count = 0;    

      conditions.forEach(function(condition){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          conditionsToRender.push(FhirDehydrator.flattenCondition(condition, internalDateFormat));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer',
    height: '52px'
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

      if(get(conditionsToRender[i], "resourceType") === "OperationOutcome"){
        tableRows.push(
          <TableRow 
          className="immunizationRow" 
          key={i} 
          style={rowStyle} 
          onClick={ handleRowClick.bind(this, conditionsToRender[i].id)} 
          hover={true} 
          style={{height: '53px', background: "repeating-linear-gradient( 45deg, rgba(253,184,19, 0.9), rgba(253,184,19, 0.9) 10px, rgba(253,184,19, 0.75) 10px, rgba(253,184,19, 0.75) 20px ), url(http://s3-us-west-2.amazonaws.com/s.cdpn.io/3/old_map_@2X.png)"}} >            
            <TableCell className='actionIcons' style={{width: '100%', whiteSpace: 'nowrap'}}>
              {get(conditionsToRender[i], 'issue[0].text', 'OperationOutcome: No data returned.')}
            </TableCell>
            <TableCell className='actionIcons' ></TableCell>
            <TableCell className='actionIcons' ></TableCell>           
          </TableRow>
        ); 
      } else {
        tableRows.push(
          <TableRow className="conditionRow" key={i} style={rowStyle} onClick={ handleRowClick.bind(this, conditionsToRender[i]._id)} style={rowStyle} hover={true} selected={selected} >            
            { renderCheckbox(i) }
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
            { renderActionButton(conditionsToRender[i]._id) }
          </TableRow>
        );   
      }

       
    }
  }

  

  //---------------------------------------------------------------------
  // Actual Render Method

  
  return(
    <div id={id} className="tableWithPagination">
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
  id: PropTypes.string,
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

  defaultCheckboxValue: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  hideActionButton: PropTypes.bool,
  actionButtonLabel: PropTypes.string,

  rowsPerPage: PropTypes.number,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,
  hideEnteredInError: PropTypes.bool,
  count: PropTypes.number,
  tableRowSize: PropTypes.string,
  formFactorLayout: PropTypes.string,

  labels: PropTypes.object
};

ConditionsTable.defaultProps = {
  tableRowSize: 'medium',
  rowsPerPage: 5,
  dateFormat: "YYYY-MM-DD hh:mm:ss",
  hideCheckbox: true,
  hideActionIcons: true,
  hideIdentifier: true,
  hidePatientName: false,
  hidePatientReference: true,
  hideAsserterName: true,
  hideClinicalStatus: true,
  hideSnomedCode: false,
  hideSnomedDisplay: false,
  hideVerification: true,
  hideSeverity: true,
  hideEvidence: false,
  hideDates: true,
  hideEndDate: true,
  hideBarcode: false,
  hideActionButton: true,
  disablePagination: false,
  conditions: [],
  labels: {
    checkbox: "Checkbox",
    snomedDisplay: "SNOMED Display",
    snomedCode: "SNOMED Code"
  },
  defaultCheckboxValue: false
}

export default ConditionsTable;
