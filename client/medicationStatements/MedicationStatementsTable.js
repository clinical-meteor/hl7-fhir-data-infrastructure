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

import { get } from 'lodash';
import moment from 'moment'


// import { Icon } from 'react-icons-kit'
// import { tag } from 'react-icons-kit/fa/tag'
// import {iosTrashOutline} from 'react-icons-kit/ionicons/iosTrashOutline'

import FhirUtilities from '../../lib/FhirUtilities';
import { StyledCard, PageCanvas } from 'fhir-starter';
import { FhirDehydrator } from '../../lib/FhirDehydrator';


//===========================================================================
// THEMING

import { useTheme } from '@material-ui/styles';

import { ThemeProvider, makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
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
// MAIN COMPONENT

function MedicationStatementsTable(props){
  logger.info('Rendering the MedicationStatementsTable');
  logger.verbose('clinical:hl7-resource-encounter.client.MedicationStatementsTable');
  logger.data('MedicationStatementsTable.props', {data: props}, {source: "MedicationStatementsTable.jsx"});

  const classes = useStyles();

  let { 
    children, 
    fhirVersion,

    medicationStatements,
    query,
    paginationLimit,
    disablePagination,

    displayCheckbox,
    displayActionIcons,
    displayIdentifier,
    displaySubjectName,
    displaySubjectReference,
    displayStatus,
    displayMedicationReference,
    displayMedicationDisplay,
    displayMedicationCode,
    displayMedicationCodeDisplay,
    displayEffectiveDate,
    displayDateAsserted,
    displayCategory,
    displayReasonCodeDisplay,
    displayReason,
    displayAsNeeded,
    displayDosage,
    displayRxNorm,
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

    medicationsCursor,

    page,
    onSetPage,

    count, 
    ...otherProps 
  } = props;

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
  // Helper Functions
  
  function removeRecord(_id){
    console.log('Remove medication statement ', _id)

    // MedicationStatements._collection.remove({_id: _id})
  }
  function showSecurityDialog(medicationStatement){
    console.log('showSecurityDialog', medicationStatement)

    // Session.set('securityDialogResourceJson', MedicationStatements.findOne(get(medicationStatement, '_id')));
    // Session.set('securityDialogResourceType', 'MedicationStatement');
    // Session.set('securityDialogResourceId', get(medicationStatement, '_id'));
    // Session.set('securityDialogOpen', true);
  }
  function rowClick(id){
    // Session.set('medicationStatementsUpsert', false);
    // Session.set('selectedMedicationStatementId', id);
    // Session.set('medicationStatementPageTabIndex', 2);
  };


  //---------------------------------------------------------------------
  // Render Functions

  function renderCheckboxHeader(){
    if (props.displayCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Checkbox</TableCell>
      );
    }
  }
  function renderCheckbox(patientId ){
    if (props.displayCheckbox) {
      return (
        <TableCell className="toggle">
          <Checkbox
            defaultChecked={true}
          />
        </TableCell>
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
  function renderCategoryHeader(){
    if (props.displayCategory) {
      return (
        <TableCell className='category'>Category</TableCell>
      );
    }
  }
  function renderCategory(category ){
    if (props.displayCategory) {
      return (
        <TableCell className='category'>{ category }</TableCell>
      );
    }
  } 
  function renderSourceHeader(){
    if (props.displaySource) {
      return (
        <TableCell className='source'>Source</TableCell>
      );
    }
  }
  function renderSource(source ){
    if (props.displaySource) {
      return (
        <TableCell className='source'>{ source }</TableCell>
      );
    }
  } 
  function renderReasonHeader(){
    if (props.displayReason) {
      return (
        <TableCell className='reason'>Reason</TableCell>
      );
    }
  }
  function renderReason(reason ){
    if (props.displayReason) {
      return (
        <TableCell className='reason'>{ reason }</TableCell>
      );
    }
  } 
  function renderRxNormHeader(){
    if (props.displayRxNorm) {
      return (
        <TableCell className='rxnorm'>RxNorm Code</TableCell>
      );
    }
  }
  function renderRxNorm(rxnorm ){
    if (props.displayRxNorm) {
      return (
        <TableCell className='rxnorm'>{ rxnorm }</TableCell>
      );
    }
  } 

  function renderSubjectNameHeader(){
    if (props.displaySubjectName) {
      return (
        <TableCell className='subjectDisplay'>Subject</TableCell>
      );
    }
  }
  function renderSubjectName(subjectDisplay ){
    if (props.displaySubjectName) {
      return (
        <TableCell className='subjectDisplay' style={{minWidth: '140px'}}>{ subjectDisplay }</TableCell>
      );
    }
  }
  function renderSubjectReferenceHeader(){
    if (props.displaySubjectReference) {
      return (
        <TableCell className='subjectReference'>Subject Reference</TableCell>
      );
    }
  }
  function renderSubjectReference(subjectReference ){
    if (props.displaySubjectReference) {
      return (
        <TableCell className='subjectReference' style={{maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis',  whiteSpace: 'nowrap'}}>
          { subjectReference }
        </TableCell>
      );
    }
  }
  function renderMedicationReferenceHeader(){
    if (props.displayMedicationReference) {
      return (
        <TableCell className='medicationReference'>Medication Reference</TableCell>
      );
    }
  }
  function renderMedicationReference(medicationReference ){
    if (props.displayMedicationReference) {
      return (
        <TableCell className='medicationReference' style={{maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis',  whiteSpace: 'nowrap'}}>
          { medicationReference }
        </TableCell>
      );
    }
  }
  function renderMedicationDisplayHeader(){
    if (props.displayMedicationDisplay) {
      return (
        <TableCell className='medicationReference'>Medication</TableCell>
      );
    }
  }
  function renderMedicationDisplay(medicationDisplay ){
    if (props.displayMedicationDisplay) {
      return (
        <TableCell className='medicationDisplay'>
          { medicationDisplay }
        </TableCell>
      );
    }
  }
  function renderEffectiveDateHeader(){
    if (props.displayEffectiveDate) {
      return (
        <TableCell className='effectiveDate'>Effective Date</TableCell>
      );
    }
  }
  function renderEffectiveDate(effectiveDate){
    if (props.displayEffectiveDate) {
      return (
        <TableCell className='effectiveDate'>{ moment(effectiveDate).format('YYYY-MM-DD') }</TableCell>
      );
    }
  }
  function renderStatus(status){
    if (props.displayStatus) {
      return (
        <TableCell><span className="status">{status}</span></TableCell>
      );
    }
  }
  function renderStatusHeader(){
    if (props.displayStatus) {
      return (
        <TableCell>Status</TableCell>
      );
    }
  }
  function renderAsNeeded(asNeeded){
    if (props.displayAsNeeded) {
      return (
        <TableCell><span className="asNeeded">{asNeeded}</span></TableCell>
      );
    }
  }
  function renderAsNeededHeader(){
    if (props.displayAsNeeded) {
      return (
        <TableCell>As Needed</TableCell>
      );
    }
  }
  function renderDosage(dosage){
    if (props.displayDosage) {
      return (
        <TableCell><span className="dosage">{dosage}</span></TableCell>
      );
    }
  }
  function renderDosageHeader(){
    if (props.displayDosage) {
      return (
        <TableCell>Dosage</TableCell>
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


  //---------------------------------------------------------------------
  // Table Rows

  let tableRows = [];
  let medicationStatementsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.dateFormat){
    internalDateFormat = props.dateFormat;
  }

  if(props.medicationStatements){
    if(props.medicationStatements.length > 0){     
      let count = 0;    

      // if(props.displayEnteredInError){
      //   query.verificationStatus = {
      //     $nin: ["entered-in-error"]  // unconfirmed | provisional | differential | confirmed | refuted | entered-in-error
      //   }
      // }

      props.medicationStatements.forEach(function(medicationStatement){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          medicationStatementsToRender.push(FhirDehydrator.dehydrateMedicationStatement(medicationStatement, "R4", medicationsCursor));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer'
  }
  if(medicationStatementsToRender.length === 0){
    logger.trace('ConditionsTable: No medicationStatements to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < medicationStatementsToRender.length; i++) {
      if(get(medicationStatementsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      logger.trace('medicationStatementsToRender[i]', medicationStatementsToRender[i])
      tableRows.push(
        <TableRow className="medicationStatementRow" key={i} style={rowStyle} onClick={ rowClick.bind(this, medicationStatementsToRender[i]._id)} hover={true} >            
          { renderCheckbox() }
          { renderActionIcons(medicationStatementsToRender[i]) }
          { renderIdentifier(medicationStatementsToRender[i].identifier ) }
          { renderStatus(medicationStatementsToRender[i].status ) }
          { renderAsNeeded(medicationStatementsToRender[i].asNeeded ) }
          { renderSubjectName(medicationStatementsToRender[i].subjectDisplay ) } 
          { renderSubjectReference(medicationStatementsToRender[i].subjectReference ) }   
          { renderCategory(medicationStatementsToRender[i].category ) }
          { renderRxNorm(medicationStatementsToRender[i].rxnorm ) }   
          { renderMedicationReference(medicationStatementsToRender[i].medicationReference ) }   
          { renderMedicationDisplay(medicationStatementsToRender[i].medicationDisplay ) }   
          { renderSource(medicationStatementsToRender[i].informationSource) }
          { renderReason(medicationStatementsToRender[i].reasonCodeDisplay) }
          { renderEffectiveDate( medicationStatementsToRender[i].dateAsserted) }
          { renderDosage(medicationStatementsToRender[i].dosage ) }
          { renderBarcode(medicationStatementsToRender[i]._id)}
          { renderActionButton(medicationStatementsToRender[i]) }
        </TableRow>
      );    
    }
  }


  //---------------------------------------------------------------------
  // Actual Render Method

  return(
    <div>
      <Table className='medicationStatementsTable' size="small" aria-label="a dense table" { ...otherProps }>
        <TableHead>
          <TableRow>
            { renderCheckboxHeader() } 
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }
            { renderStatusHeader() }            
            { renderAsNeededHeader() }            
            { renderSubjectNameHeader() }
            { renderSubjectReferenceHeader() }
            { renderCategoryHeader() }
            { renderRxNormHeader() }
            { renderMedicationReferenceHeader() }
            { renderMedicationDisplayHeader() } 
            { renderSourceHeader() }
            { renderReasonHeader() }
            { renderEffectiveDateHeader() }     
            { renderDosageHeader() }
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


MedicationStatementsTable.propTypes = {
  fhirVersion: PropTypes.string,

  medicationStatements: PropTypes.array,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  displayCheckbox: PropTypes.bool,
  displayActionIcons: PropTypes.bool,
  displayIdentifier: PropTypes.bool,
  displayAsNeeded: PropTypes.bool,
  displaySubjectName: PropTypes.bool,
  displaySubjectReference: PropTypes.bool,
  displayStatus: PropTypes.bool,
  displayMedicationReference: PropTypes.bool,
  displayMedicationDisplay: PropTypes.bool,
  displayMedicationCode: PropTypes.bool,
  displayMedicationCodeDisplay: PropTypes.bool,
  displayEffectiveDate: PropTypes.bool,
  displayDateAsserted: PropTypes.bool,
  displayCategory: PropTypes.bool,
  displayReasonCodeDisplay: PropTypes.bool,
  displayReason: PropTypes.bool,
  displayDosage: PropTypes.bool,
  displayBarcode: PropTypes.bool,
  displayRxNorm: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  onSetPage: PropTypes.func,

  page: PropTypes.number,
  showActionButton: PropTypes.bool,
  actionButtonLabel: PropTypes.string,

  rowsPerPage: PropTypes.number,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,
  displayEnteredInError: PropTypes.bool,
  count: PropTypes.number,

  medicationsCursor: PropTypes.object,
  formFactorLayout: PropTypes.string
};

MedicationStatementsTable.defaultProps = {
  displaySubjectName: false,
  displaySubjectReference: true,
  displayCheckbox: false,
  displayActionIcons: false,
  displayAsNeeded: false,
  displayStatus: true,
  displayMedicationReference: true,
  displayMedicationDisplay: true,
  displayMedicationCode: true, 
  displayMedicationCodeDisplay: true,
  displayEffectiveDate: true,
  displayDateAsserted: true,
  displayCategory: false,
  displayReason: true,
  displayReasonCodeDisplay: true,
  displayBarcode: true,
  displayDosage: true,
  displayRxNorm: true,
  rowsPerPage: 5,
  fhirVersion: "R4",
  count: 0
}


export default MedicationStatementsTable;