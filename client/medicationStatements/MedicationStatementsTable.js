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
// FLATTENING / MAPPING


flattenMedicationStatement = function(statement, fhirVersion){
  console.log('flattenMedicationStatement', statement)

  var result = {
    '_id': statement._id,
    'status': '',
    'category': '',
    'medication': '',
    'medicationReference': '',
    'medicationDisplay': '',
    'reasonCodeCode': '',
    'reasonCodeDisplay': '',
    'basedOn': '',
    'effectiveDateTime': '',
    'dateAsserted': null,
    'informationSource': '',
    'subjectDisplay': '',
    'subjectReference': '',
    'taken': '',
    'reasonCodeDisplay': '',
    'reasonReference': '',
    'dosage': '',
  };

  if(get(statement, 'patient')){
    result.subjectDisplay = get(statement, 'patient.display');
  } else if(get(statement, 'subject')){
    result.subjectDisplay = get(statement, 'subject.display');
  }

  if(get(statement, 'patient')){
    result.subjectReference = get(statement, 'patient.reference');
  } else if(get(statement, 'subject')){
    result.subjectReference = get(statement, 'subject.reference');
  }
  
  // DSTU2
  if(["v1.0.2", "DSTU2"].includes(fhirVersion)){
    result.medicationReference = get(statement, 'medicationReference.reference');
    result.medicationDisplay = get(statement, 'medicationReference.display');
    result.reasonCode = get(statement, 'reasonForUseCodeableConcept.coding[0].code');
    result.reasonCodeDisplay = get(statement, 'reasonForUseCodeableConcept.coding[0].display');
    result.identifier = get(statement, 'identifier[0].value');
    result.effectiveDateTime = moment(get(statement, 'effectiveDateTime')).format("YYYY-MM-DD");
    result.dateAsserted = moment(get(statement, 'dateAsserted')).format("YYYY-MM-DD");
    result.informationSource = get(statement, 'supportingInformation[0].display');
    result.reasonCodeDisplay = get(statement, 'reasonForUseCodeableConcept.coding[0].display');  
  }

  // STU3
  if(["v3.0.1", "STU3"].includes(fhirVersion)){
    result.medicationReference = get(statement, 'medicationReference.reference');
    result.medicationDisplay = get(statement, 'medicationReference.display');
    result.medicationCodeDisplay = get(statement, 'medicationCodeableConcept.coding[0].display');
    result.medicationCode = get(statement, 'medicationCodeableConcept.coding[0].code');
    result.identifier = get(statement, 'identifier[0].value');
    result.effectiveDateTime = moment(get(statement, 'effectiveDateTime')).format("YYYY-MM-DD");
    result.dateAsserted = moment(get(statement, 'dateAsserted')).format("YYYY-MM-DD");
    result.informationSource = get(statement, 'informationSource.display');
    result.taken = get(statement, 'taken');
    result.reasonCodeDisplay = get(statement, 'reasonCode[0].coding[0].display');  
  }

  // R4
  if(["v4.0.1", "R4"].includes(fhirVersion)){
    result.status = get(statement, 'status');
    result.medicationReference = get(statement, 'medicationReference.reference');
    result.medicationDisplay = get(statement, 'medicationReference.display');
    result.medicationCodeDisplay = get(statement, 'medicationCodeableConcept.coding[0].display');
    result.medicationCode = get(statement, 'medicationCodeableConcept.coding[0].code');
    result.identifier = get(statement, 'identifier[0].value');
    result.effectiveDateTime = moment(get(statement, 'effectiveDateTime')).format("YYYY-MM-DD");
    result.dateAsserted = moment(get(statement, 'dateAsserted')).format("YYYY-MM-DD");
    result.informationSource = get(statement, 'informationSource.display');
    result.reasonReference = get(statement, 'reasonReference[0].reference');  
    result.category = get(statement, 'category.text');  
    if(get(statement, 'reasonCode[0].text')){
      result.reasonCodeDisplay = get(statement, 'reasonCode[0].text');  
    } else {
      result.reasonCodeDisplay = get(statement, 'reasonCode[0].coding[0].display');  
    }
  }



  return result;
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

    displayCheckboxes,
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

  function handleChangePage(event, newPage){
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
          { FhirUtilities.pluckReferenceId(subjectReference) }
        </TableCell>
      );
    }
  }
  function renderMedicationReferenceHeader(){
    if (props.displayMedicationReference) {
      return (
        <TableCell className='medicationReference'>Medication</TableCell>
      );
    }
  }
  function renderMedicationReference(medicationReference ){
    if (props.displayMedicationReference) {
      return (
        <TableCell className='medicationReference' style={{maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis',  whiteSpace: 'nowrap'}}>
          { FhirUtilities.pluckReferenceId(medicationReference) }
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
          medicationStatementsToRender.push(flattenMedicationStatement(medicationStatement, "R4"));
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
          { renderIdentifier(medicationStatementsToRender.identifier ) }
          { renderSubjectName(medicationStatementsToRender[i].subjectDisplay ) } 
          { renderSubjectReference(medicationStatementsToRender[i].subjectReference ) }   
          { renderCategory(medicationStatementsToRender.category ) }
          { renderMedicationReference(medicationStatementsToRender[i].medicationReference ) }   
          { renderSource(medicationStatementsToRender[i].informationSource) }
          { renderReason(medicationStatementsToRender[i].reasonCodeDisplay) }
          { renderEffectiveDate( medicationStatementsToRender[i].dateAsserted) }
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
            { renderSubjectNameHeader() }
            { renderSubjectReferenceHeader() }
            { renderCategoryHeader() }
            { renderMedicationReferenceHeader() }
            { renderSourceHeader() }
            { renderReasonHeader() }
            { renderEffectiveDateHeader() }     
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

  displayCheckboxes: PropTypes.bool,
  displayActionIcons: PropTypes.bool,
  displayIdentifier: PropTypes.bool,
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

MedicationStatementsTable.defaultProps = {
  displayReason: true,
  displaySubjectReference: true,
  rowsPerPage: 5
}



export default MedicationStatementsTable;