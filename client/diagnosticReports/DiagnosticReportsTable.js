import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  CssBaseline,
  Grid, 
  Container,
  Divider,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  CardMedia,
  Tab, 
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox
} from '@material-ui/core';


import { get } from 'lodash';
import moment from 'moment';

import FhirUtilities from '../../lib/FhirUtilities';
import FhirDehydrator from '../../lib/FhirDehydrator';


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

flattenDiagnosticReport = function(report, internalDateFormat){
  //console.log('report', report)
  
  var result = {
    _id: '',
    meta: '',
    identifier: '',
    subjectDisplay: '',
    subjectReference: '',
    reportCodeDisplay: '',
    reportCode: '',
    status: '',
    issued: '',
    performerDisplay: '',
    performerReference: '',
    identifier: '',
    category: '',
    effectiveDate: ''
  };
  
  if(!internalDateFormat){
    internalDateFormat = "YYYY-MM-DD";
  }

  result.id = get(report, 'id', '');
  result.identifier = get(report, 'identifier[0].value', '');

  if(get(report, 'patient')){
    result.subjectDisplay = get(report, 'patient.display', '');
    result.subjectReference = get(report, 'patient.reference', '');
  } else if (get(report, 'subject')){
    result.subjectDisplay = get(report, 'subject.display', '');
    result.subjectReference = get(report, 'subject.reference', '');
  }

  if(get(report, 'performer[0].actor')){
    result.performerDisplay = get(report, 'performer[0].actor.display');
    result.performerReference = get(report, 'performer[0].actor.reference');          
  } else if(get(report, 'performer[0]')){
    result.performerDisplay = get(report, 'performer[0].display');
    result.performerReference = get(report, 'performer[0].reference');
  } else if(get(report, 'performer')){
    result.performerDisplay = get(report, 'performer.display');
    result.performerReference = get(report, 'performer.reference');
  }      

  if(get(report, 'category.text')){
    result.category = get(report, 'category.text');
  } else if(get(report, 'category[0].coding[0].display')){
    result.category = get(report, 'category[0].coding[0].display');
  } else {
    result.category = get(report, 'category[0].coding[0].code');
  }

  if(get(report, 'code.text')){
    result.reportCodeDisplay = get(report, 'code.text');
  } else {
    result.reportCodeDisplay = get(report, 'code.coding[0].display');
  }
  result.reportCode = get(report, 'code.coding[0].code');

  result.identifier = get(report, 'identifier[0].value', '');
  result.status = get(report, 'status', '');
  result.effectiveDate = moment(get(report, 'effectiveDateTime')).format("YYYY-MM-DD");
  result.issued = moment(get(report, 'issued')).format("YYYY-MM-DD"); 

  return result;  
}


//===========================================================================
// MAIN COMPONENT

function DiagnosticReportsTable(props){
  logger.info('Rendering the DiagnosticReportsTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.DiagnosticReportsTable');
  logger.data('DiagnosticReportsTable.props', {data: props}, {source: "DiagnosticReportsTable.jsx"});

  const classes = useStyles();


  let { 
    children, 

    diagnosticReports,
    query,
    paginationLimit,
    disablePagination,
  
    onCellClick,
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButtonClick,
    hideCheckbox,
    hideActionButton,
    hideActionIcons,
    actionButtonLabel,
  
    rowsPerPage,
    dateFormat,
    showMinutes,
    fhirVersion,

    formFactorLayout,

    ...otherProps 
  } = props;


  //---------------------------------------------------------------------
  // Render Methods

  function rowClick(id){
    if(typeof this.props.onRowClick === "function"){
      this.props.onRowClick(id);
    }
  };

  function renderToggleHeader(){
    if (!hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Toggle</TableCell>
      );
    }
  }
  function renderToggle(){
    if (!hideCheckbox) {
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
    if (!hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(encounter ){
    if (!hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <Icon icon={tag} style={iconStyle} onClick={ onMetaClick.bind(encounter)}  />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={ removeRecord.bind(encounter._id)} /> */}
        </TableCell>
      );
    }
  } 
  function renderSubject(name){
    if (!hideSubjects) {
      return (<TableCell className='name'>{ name }</TableCell>);
    }
  }
  function renderSubjectHeader(){
    if (!hideSubjects) {
      return (
        <TableCell className='name'>Subject</TableCell>
      );
    }
  }
  function renderSubjectReference(subjectReference){
    if (!hideSubjectReference) {
      return (<TableCell className='subjectReference'>{ subjectReference }</TableCell>);
    }
  }
  function renderSubjectReferenceHeader(){
    if (!hideSubjectReference) {
      return (
        <TableCell className='subjectReference'>Subject Reference</TableCell>
      );
    }
  }
  function renderStatus(valueString){
    if (!hideStatus) {
      return (
        <TableCell className='value'>{ valueString }</TableCell>
      );
    }
  }
  function renderStatusHeader(){
    if (!hideStatus) {
      return (
        <TableCell className='value'>Status</TableCell>
      );
    }
  }
  function renderIssuedDateHeader(){
    if (!hideStartDateTime) {
      return (
        <TableCell className='start' style={{minWidth: '140px'}}>Start</TableCell>
      );
    }
  }
  function renderIssuedDate(periodStart){
    if (!hideStartDateTime) {
      return (
        <TableCell className='periodStart' style={{minWidth: '140px'}}>{ periodStart }</TableCell>
      );
    }
  }
  function renderBarcode(id){
    if (!hideBarcode) {
      return (
        <TableCell><span className="barcode helvetica">{id}</span></TableCell>
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
          <Button onClick={ handleActionButtonClick.bind(this, patient[i]._id)}>{ get(props, "actionButtonLabel", "") }</Button>
        </TableCell>
      );
    }
  }
  function renderIdentifier(identifier){
    if (!hideIdentifier) {
      return (
        <TableCell className='identifier'>{ identifier }</TableCell>
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
  function renderCodeHeader(){
    if (!hideCode) {
      return (
        <TableCell className='code'>Code</TableCell>
      );
    }
  }
  function renderCode(code){
    if (!hideCode) {
      return (
        <TableCell className='code'>{ code }</TableCell>
      );  
    }
  }
  function renderPerformer(text){
    if (!hidePerformer) {
      return (
        <TableCell className='performer'>{ text }</TableCell>
      );
    }
  }
  function renderPerformerHeader(){
    if (!hidePerformer) {
      return (
        <TableCell className='performer'>Performer</TableCell>
      );
    }
  }
  function renderCategoryHeader(){
    if (!hideCategory) {
      return (
        <TableCell className='category'>Category</TableCell>
      );
    }
  }
  function renderCategory(category){
    if (!hideCategory) {
      return (
        <TableCell className='category'>{ category }</TableCell>
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

  //---------------------------------------------------------------------
  // Table Rows

  let tableRows = [];
  let diagnosticReportsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";
  
  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.internalDateFormat){
    internalDateFormat = props.dateFormat;
  }

  if(props.diagnosticReports){
    if(props.diagnosticReports.length > 0){     
      let count = 0;    
      props.diagnosticReports.forEach(function(diagnosticReport){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          diagnosticReportsToRender.push(flattenDiagnosticReport(diagnosticReport, internalDateFormat));
        }
        count++;
      });  
    }
  }

  if(diagnosticReportsToRender.length === 0){
    logger.trace('DiagnosticReportsTable:  No reports to render.');
    
  } else {
    for (var i = 0; i < diagnosticReportsToRender.length; i++) {
      tableRows.push(
        <TableRow className="encounterRow" key={i} onClick={ rowClick.bind(this, diagnosticReportsToRender[i]._id)} style={{cursor: 'pointer'}} hover={true} >            
          { renderToggle() }
          { renderActionIcons(diagnosticReportsToRender[i]) }
          { renderSubject(diagnosticReportsToRender[i].subjectDisplay)}
          { renderSubjectReference(diagnosticReportsToRender[i].subjectReference)}
          { renderStatus(diagnosticReportsToRender[i].status)}
          { renderIssuedDate(diagnosticReportsToRender[i].issued)}  
          { renderPerformer(diagnosticReportsToRender[i].performerDisplay)}  
          { renderCategory(diagnosticReportsToRender[i].category)}  
          { renderCode(diagnosticReportsToRender[i].reportCodeDisplay)}  
          { renderIdentifierHeader(diagnosticReportsToRender[i].identifier)}
          { renderBarcode(diagnosticReportsToRender[i].id)}
          { renderActionButton(diagnosticReportsToRender[i]) }
        </TableRow>
      );
    }
  }
  return(
    <div>
      <Table className="diagnosticReportTable" size="small" aria-label="a dense table" { ...otherProps } >
        <TableHead>
          <TableRow>
            { renderToggleHeader() }
            { renderActionIconsHeader() }
            { renderSubjectHeader() }
            { renderSubjectReferenceHeader() }
            { renderStatusHeader() }
            { renderIssuedDateHeader() }
            { renderPerformerHeader() }
            { renderCategoryHeader() }
            { renderCodeHeader() }
            { renderIdentifierHeader()}
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



DiagnosticReportsTable.propTypes = {
  fhirVersion: PropTypes.string,
  diagnosticReports: PropTypes.array,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideCategory: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideSubject: PropTypes.bool,
  hideSubjectReference: PropTypes.bool,
  hideIssuedDate: PropTypes.bool,
  hidePerformer: PropTypes.bool,
  hideCode: PropTypes.bool,
  hideCodeDisplay: PropTypes.bool,
  hideBarcode: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  hideActionButton: PropTypes.bool,
  actionButtonLabel: PropTypes.string,

  rowsPerPageToRender: PropTypes.number,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,
  count: PropTypes.number,
  formFactorLayout: PropTypes.string
};
DiagnosticReportsTable.defaultProps = {
  rowsPerPage: 5,
  hideActionButton: true
}

export default DiagnosticReportsTable;