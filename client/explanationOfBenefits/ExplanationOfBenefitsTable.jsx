import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination
} from '@material-ui/core';

import TableNoData from 'fhir-starter';

import moment from 'moment'
import _ from 'lodash';
let get = _.get;
let set = _.set;

import FhirUtilities from '../../lib/FhirUtilities';
import { flattenExplanationOfBenefit } from '../../lib/FhirDehydrator';


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
getLength = function(field){
  if(Array.isArray(field)){
    return field.length;
  } else {
    return 0;
  }
}

flattenExplanationOfBenefit = function(explanationOfBenefit, internalDateFormat){
  let result = {
    _id: '',
    meta: '',
    identifier: '',
    status: '',
    type: '',
    use: '',
    patientDisplay: '',
    patientReference: '',
    billableStart: '',
    billableEnd: '',
    created: '',
    insurerDisplay: '',
    insurerReference: '',
    providerDisplay: '',
    providerReference: '',
    payeeType: '',
    payeeDisplay: '',
    payeeReference: '',
    outcome: '',
    paymentType: '',
    paymentAmount: '',
    paymentDate: '',
    relatedClaimsCount: 0,
    careTeamMembersCount: 0,
    supportingInfoCount: 0,
    diagnosisCount: 0,
    procedureCount: 0,
    insuranceCount: 0,
    accidentCount: 0,
    itemCount: 0,
    addItemCount: 0,
    detailCount: 0,
    processNoteCount: 0,
    benefitBalance: 0
  };

  if(!internalDateFormat){
    internalDateFormat = get(Meteor, "settings.public.defaults.internalDateFormat", "YYYY-MM-DD");
  }

  result._id =  get(explanationOfBenefit, 'id') ? get(explanationOfBenefit, 'id') : get(explanationOfBenefit, '_id');
  result.id = get(explanationOfBenefit, 'id', '');
  result.identifier = get(explanationOfBenefit, 'identifier[0].value', '');

  result.status = get(explanationOfBenefit, 'status', '');
  result.type = get(explanationOfBenefit, 'type.text', '');
  result.use = get(explanationOfBenefit, 'use', '');
  result.patientDisplay = get(explanationOfBenefit, 'patient.display', '');
  result.patientReference = get(explanationOfBenefit, 'patient.reference', '');
  result.billableStart = moment(get(explanationOfBenefit, 'billablePeriod.start', '')).format("YYYY-MM-DD");
  result.billableEnd = moment(get(explanationOfBenefit, 'billablePeriod.end', '')).format("YYYY-MM-DD");
  result.created = moment(get(explanationOfBenefit, 'created', '')).format("YYYY-MM-DD");
  result.insurerDisplay = get(explanationOfBenefit, 'insurer.display', '');
  result.insurerReference = get(explanationOfBenefit, 'insurer.reference', '');
  result.providerDisplay = get(explanationOfBenefit, 'provider.display', '');
  result.providerReference = get(explanationOfBenefit, 'provider.reference', '');
  result.payeeType = get(explanationOfBenefit, 'payee.type.text', '');
  result.payeeDisplay = get(explanationOfBenefit, 'payee.party.display', '');
  result.payeeReference = get(explanationOfBenefit, 'payee.party.reference', '');
  result.outcome = get(explanationOfBenefit, 'outcome', '');
  result.paymentType = get(explanationOfBenefit, 'payment.type.text', '');
  result.paymentAmount = get(explanationOfBenefit, 'payment.amount.value', '');
  result.paymentDate = moment(get(explanationOfBenefit, 'payment.date', '')).format("YYYY-MM-DD");

  result.relatedClaimsCount = getLength(explanationOfBenefit.related);
  result.careTeamMembersCount = getLength(explanationOfBenefit.careTeam);
  result.supportingInfoCount = getLength(explanationOfBenefit.supportingInfo);
  result.diagnosisCount = getLength(explanationOfBenefit.diagnosis);
  result.procedureCount = getLength(explanationOfBenefit.procedures);
  result.insuranceCount = getLength(explanationOfBenefit.insurance);
  result.accidentCount = getLength(explanationOfBenefit.accident);
  result.itemCount = getLength(explanationOfBenefit.item);
  result.addItemCount = getLength(explanationOfBenefit.addItem);
  result.detailCount = getLength(explanationOfBenefit.detailCount);
  result.processNoteCount = getLength(explanationOfBenefit.processNote);
  result.benefitBalance = getLength(explanationOfBenefit.benefit);

  console.log('ExplanationOfBenefitsTable.flattenExplanationOfBenefit', result)

  return result;
}



function ExplanationOfBenefitsTable(props){
  logger.info('Rendering the ExplanationOfBenefitsTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.ExplanationOfBenefitsTable');
  logger.data('ExplanationOfBenefitsTable.props', {data: props}, {source: "ExplanationOfBenefitsTable.jsx"});

  const classes = useStyles();

  let { 
    id,
    children, 

    explanationOfBenefits,
    selectedExplanationOfBenefitId,

    query,
    paginationLimit,
    disablePagination,

    hideCheckbox,
    hideActionIcons,
    hideStatus,
    hideIdentifier,    
    hideType,
    hideSubtype,
    hideUse,
    hidePatientDisplay,
    hidePatientReference,
    hideBillableStart,
    hideBillableEnd,
    hideCreated,
    hideInsurerDisplay,
    hideInsurerReference,
    hideProviderDisplay,
    hideProviderReference,
    hidePayeeType,
    hidePayeeDisplay,
    hidePayeeReference,
    hideOutcome,
    hidePaymentType,
    hidePaymentAmount,
    hidePaymentDate,
    hideBarcode,

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

    tableRowSize,
    formFactorLayout,

    ...otherProps 
  } = props;


  // ------------------------------------------------------------------------
  // Helper Functions

  function handleRowClick(id){
    console.log('Clicking row ' + id)
    if(props.onRowClick){
      props.onRowClick(id);
    }
  }

  function removeRecord(_id){
    console.log('Remove explanationOfBenefit ', _id)
    if(props.onRemoveRecord){
      props.onRemoveRecord(_id);
    }
  }
  function handleActionButtonClick(id){
    if(typeof props.onActionButtonClick === "function"){
      props.onActionButtonClick(id);
    }
  }
  function cellClick(id){
    if(typeof props.onCellClick === "function"){
      props.onCellClick(id);
    }
  }
  function handleMetaClick(patient){
    let self = this;
    if(props.onMetaClick){
      props.onMetaClick(self, patient);
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
  function renderActionIcons(explanationOfBenefit ){
    if (!props.hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ onMetaClick.bind(explanationOfBenefit)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(explanationOfBenefit._id)} />   */}
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

  function renderStatus(status){
    if (!props.hideStatus) {
      return (
        <TableCell className='status'>{ status }</TableCell>
      );
    }
  }
  function renderStatusHeader(){
    if (!props.hideStatus) {
      return (
        <TableCell className='status'>Status</TableCell>
      );
    }
  }
  function renderType(type){
    if (!props.hideType) {
      return (
        <TableCell className='type'>{ type }</TableCell>
      );
    }
  }
  function renderTypeHeader(){
    if (!props.hideType) {
      return (
        <TableCell className='type'>Type</TableCell>
      );
    }
  }
  function renderUse(use){
    if (!props.hideType) {
      return (
        <TableCell className='use'>{ use }</TableCell>
      );
    }
  }
  function renderUseHeader(){
    if (!props.hideType) {
      return (
        <TableCell className='use'>Use</TableCell>
      );
    }
  }
  function renderPatientDisplay(patientDisplay){
    if (!props.hidePatientDisplay) {
      return (
        <TableCell className='patientDisplay'>{ patientDisplay }</TableCell>
      );
    }
  }
  function renderPatientDisplayHeader(){
    if (!props.hidePatientDisplay) {
      return (
        <TableCell className='patientDisplay'>Patient Display</TableCell>
      );
    }
  }
  function renderPatientReference(patientReference){
    if (!props.hidePatientReference) {
      return (
        <TableCell className='patientReference'>{ patientReference }</TableCell>
      );
    }
  }
  function renderPatientReferenceHeader(){
    if (!props.hidePatientReference) {
      return (
        <TableCell className='patientReference'>Patient Reference</TableCell>
      );
    }
  }

  function renderBillableStart(billableStart){
    if (!props.hideBillableStart) {
      return (
        <TableCell className='billableStart' >{ billableStart }</TableCell>
      );
    }
  }
  function renderBillableStartHeader(){
    if (!props.hideBillableStart) {
      return (
        <TableCell className='billableStart' style={{minWidth: '140px'}}>Billable Start</TableCell>
      );
    }
  }
  function renderBillableEnd(billableEnd){
    if (!props.hideBillableEnd) {
      return (
        <TableCell className='billableEnd'>{ billableEnd }</TableCell>
      );
    }
  }
  function renderBillableEndHeader(){
    if (!props.hideBillableEnd) {
      return (
        <TableCell className='billableEnd' style={{minWidth: '140px'}}>Billable End</TableCell>
      );
    }
  }
  function renderCreated(created){
    if (!props.hideCreated) {
      return (
        <TableCell className='created'>{ created }</TableCell>
      );
    }
  }
  function renderCreatedHeader(){
    if (!props.hideCreated) {
      return (
        <TableCell className='created'>Created</TableCell>
      );
    }
  }
  
  function renderInsurerDisplay(insurerDisplay){
    if (!props.hideInsurerDisplay) {
      return (
        <TableCell className='insurerDisplay'>{ insurerDisplay }</TableCell>
      );
    }
  }
  function renderInsurerDisplayHeader(){
    if (!props.hideInsurerDisplay) {
      return (
        <TableCell className='insurerDisplay'>Insurer Display</TableCell>
      );
    }
  }
  function renderInsurerReference(insurerReference){
    if (!props.hideInsurerReference) {
      return (
        <TableCell className='insurerReference'>{ insurerReference }</TableCell>
      );
    }
  }
  function renderInsurerReferenceHeader(){
    if (!props.hideInsurerReference) {
      return (
        <TableCell className='insurerReference'>Insurer Reference</TableCell>
      );
    }
  }
  function renderProviderDisplay(providerDisplay){
    if (!props.hideProviderDisplay) {
      return (
        <TableCell className='providerDisplay'>{ providerDisplay }</TableCell>
      );
    }
  }
  function renderProviderDisplayHeader(){
    if (!props.hideProviderDisplay) {
      return (
        <TableCell className='providerDisplay'>Provider Display</TableCell>
      );
    }
  }
  function renderProviderReference(providerReference){
    if (!props.hideProviderReference) {
      return (
        <TableCell className='providerReference'>{ providerReference }</TableCell>
      );
    }
  }
  function renderProviderReferenceHeader(){
    if (!props.hideProviderReference) {
      return (
        <TableCell className='providerReference'>Provider Reference</TableCell>
      );
    }
  }
  function renderPayeeDisplay(payeeDisplay){
    if (!props.hidePayeeDisplay) {
      return (
        <TableCell className='payeeDisplay'>{ payeeDisplay }</TableCell>
      );
    }
  }
  function renderPayeeDisplayHeader(){
    if (!props.hidePayeeDisplay) {
      return (
        <TableCell className='payeeDisplay'>Payee Display</TableCell>
      );
    }
  }
  function renderPayeeReference(payeeReference){
    if (!props.hidePayeeReference) {
      return (
        <TableCell className='payeeReference'>{ payeeReference }</TableCell>
      );
    }
  }
  function renderPayeeReferenceHeader(){
    if (!props.hidePayeeReference) {
      return (
        <TableCell className='payeeReference'>Payee Reference</TableCell>
      );
    }
  }
  function renderPayeeType(payeeType){
    if (!props.hidePayeeType) {
      return (
        <TableCell className='payeeType'>{ payeeType }</TableCell>
      );
    }
  }
  function renderPayeeTypeHeader(){
    if (!props.hidePayeeType) {
      return (
        <TableCell className='payeeType'>Payee Type</TableCell>
      );
    }
  }


  function renderOutcome(outcome){
    if (!props.hideOutcome) {
      return (
        <TableCell className='outcome'>{ outcome }</TableCell>
      );
    }
  }
  function renderOutcomeHeader(){
    if (!props.hideOutcome) {
      return (
        <TableCell className='outcome'>Payee Type</TableCell>
      );
    }
  }


  function renderPaymentType(paymentType){
    if (!props.hidePaymentType) {
      return (
        <TableCell className='paymentType'>{ paymentType }</TableCell>
      );
    }
  }
  function renderPaymentTypeHeader(){
    if (!props.hidePaymentType) {
      return (
        <TableCell className='paymentType'>Payment Type</TableCell>
      );
    }
  }
  function renderPaymentAmount(paymentAmount){
    if (!props.hidePaymentAmount) {
      return (
        <TableCell className='paymentAmount'>{ paymentAmount }</TableCell>
      );
    }
  }
  function renderPaymentAmountHeader(){
    if (!props.hidePaymentAmount) {
      return (
        <TableCell className='paymentAmount'>Payment Amount</TableCell>
      );
    }
  }
  function renderPaymentDate(paymentDate){
    if (!props.hidePaymentDate) {
      return (
        <TableCell className='paymentDate'>{ paymentDate }</TableCell>
      );
    }
  }
  function renderPaymentDateHeader(){
    if (!props.hidePaymentDate) {
      return (
        <TableCell className='paymentDate'>Payment Date</TableCell>
      );
    }
  }

  

  function renderBarcode(id){
    if (!props.hideBarcode) {
      return (
        <TableCell><span className="barcode helveticas">{id}</span></TableCell>
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
      // rowsPerPageOptions={[5, 10, 25, 100]}
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
  let explanationOfBenefitsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.internalDateFormat){
    internalDateFormat = props.dateFormat;
  }


  if(props.explanationOfBenefits){
    if(props.explanationOfBenefits.length > 0){              
      props.explanationOfBenefits.forEach(function(explanationOfBenefit){
        explanationOfBenefitsToRender.push(flattenExplanationOfBenefit(explanationOfBenefit, internalDateFormat));
      });  
    }
  }

  if(explanationOfBenefitsToRender.length === 0){
    console.log('No explanationOfBenefits to render');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < explanationOfBenefitsToRender.length; i++) {

      let selected = false;
      if(explanationOfBenefitsToRender[i].id === selectedExplanationOfBenefitId){
        selected = true;
      }
      tableRows.push(
        <TableRow 
          className="explanationOfBenefitRow" 
          key={i} 
          onClick={ handleRowClick.bind(this, explanationOfBenefitsToRender[i]._id)} 
          hover={true} 
          style={{cursor: 'pointer', height: '52px'}} 
          selected={selected}
        >
          { renderToggle() }
          { renderActionIcons(explanationOfBenefitsToRender[i]) }

          { renderCreated(explanationOfBenefitsToRender[i].created) }
          { renderIdentifier(explanationOfBenefitsToRender[i].identifier) }          
          
          { renderStatus(explanationOfBenefitsToRender[i].status) }
          { renderType(explanationOfBenefitsToRender[i].type) }          
          { renderUse(explanationOfBenefitsToRender[i].use) }
          { renderPatientDisplay(explanationOfBenefitsToRender[i].patientDisplay) }
          { renderPatientReference(explanationOfBenefitsToRender[i].patientReference) }
          { renderBillableStart(explanationOfBenefitsToRender[i].billableStart) }
          { renderBillableEnd(explanationOfBenefitsToRender[i].billableEnd) }
          { renderInsurerDisplay(explanationOfBenefitsToRender[i].insurerDisplay) }
          { renderInsurerReference(explanationOfBenefitsToRender[i].insurerReference) }
          { renderProviderDisplay(explanationOfBenefitsToRender[i].providerDisplay) }
          { renderProviderReference(explanationOfBenefitsToRender[i].providerReference) }
          { renderPayeeType(explanationOfBenefitsToRender[i].payeeType) }
          { renderPayeeDisplay(explanationOfBenefitsToRender[i].payeeDisplay) }
          { renderPayeeReference(explanationOfBenefitsToRender[i].payeeReference) }
          { renderOutcome(explanationOfBenefitsToRender[i].outcome) }
          { renderPaymentType(explanationOfBenefitsToRender[i].paymentType) }
          { renderPaymentAmount(explanationOfBenefitsToRender[i].paymentAmount) }
          { renderPaymentDate(explanationOfBenefitsToRender[i].paymentDate) }
          {/* { renderCounts(explanationOfBenefitsToRender[i]) } */}

          { renderBarcode(explanationOfBenefitsToRender[i].id)}
        </TableRow>
      );       
    }
  }

  return(
    <div id={id} className="tableWithPagination">
      <Table size={tableRowSize} aria-label="a dense table">
        <TableHead>
          <TableRow>
            { renderToggleHeader() }
            { renderActionIconsHeader() }

            { renderCreatedHeader() }
            { renderIdentifierHeader() }

            { renderStatusHeader() }
            { renderTypeHeader() }
            { renderUseHeader() }
            { renderPatientDisplayHeader() }
            { renderPatientReferenceHeader() }
            { renderBillableStartHeader() }
            { renderBillableEndHeader() }
            { renderInsurerDisplayHeader() }
            { renderInsurerReferenceHeader() }
            { renderProviderDisplayHeader() }
            { renderProviderReferenceHeader() }
            { renderPayeeTypeHeader() }
            { renderPayeeDisplayHeader() }
            { renderPayeeReferenceHeader() }
            { renderOutcomeHeader() }
            { renderPaymentTypeHeader() }
            { renderPaymentAmountHeader() }
            { renderPaymentDateHeader() }
            {/* { renderCountsHeader() } */}
            
            { renderBarcodeHeader() }
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

ExplanationOfBenefitsTable.propTypes = {
  id: PropTypes.string,

  explanationOfBenefits: PropTypes.array,
  selectedExplanationOfBenefitId: PropTypes.string,

  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  showMinutes: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideType: PropTypes.bool,
  hideSubtype: PropTypes.bool,
  hideUse: PropTypes.bool,
  hidePatientDisplay: PropTypes.bool,
  hidePatientReference: PropTypes.bool,
  hideBillableStart: PropTypes.bool,
  hideBillableEnd: PropTypes.bool,
  hideCreated: PropTypes.bool,
  hideInsurerDisplay: PropTypes.bool,
  hideInsurerReference: PropTypes.bool,
  hideProviderDisplay: PropTypes.bool,
  hideProviderReference: PropTypes.bool,
  hidePayeeType: PropTypes.bool,
  hidePayeeDisplay: PropTypes.bool,
  hidePayeeReference: PropTypes.bool,
  hideOutcome: PropTypes.bool,
  hidePaymentType: PropTypes.bool,
  hidePaymentAmount: PropTypes.bool,
  hidePaymentDate: PropTypes.bool,
  hideBarcode: PropTypes.bool,  

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,

  formFactorLayout: PropTypes.string
};
ExplanationOfBenefitsTable.defaultProps = {
  hideCheckbox: true,
  hideActionIcons: true,
  hideIdentifier: true,
  hideStatus: false,
  hideType: false,
  hideSubtype: true,
  hideUse: false,
  hidePatientDisplay: false,
  hidePatientReference: false,
  hideBillableStart: true,
  hideBillableEnd: true,
  hideCreated: false,
  hideInsurerDisplay: false,
  hideInsurerReference: true,
  hideProviderDisplay: false,
  hideProviderReference: true,
  hidePayeeType: false,
  hidePayeeDisplay: false,
  hidePayeeReference: true,
  hideOutcome: false,
  hidePaymentType: false,
  hidePaymentAmount: false,
  hidePaymentDate: false,
  hideCounts: false,  
  hideBarcode: false,  
  selectedExplanationOfBenefitId: '',
  rowsPerPage: 5
}

export default ExplanationOfBenefitsTable; 