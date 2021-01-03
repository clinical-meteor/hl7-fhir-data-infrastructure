
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

import FhirUtilities from '../../lib/FhirUtilities';

import { FhirDehydrator, StyledCard, PageCanvas } from 'fhir-starter';



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

function DocumentReferencesTable(props){
  logger.info('Rendering the DocumentReferencesTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.DocumentReferencesTable');
  logger.data('DocumentReferencesTable.props', {data: props}, {source: "DocumentReferencesTable.jsx"});

  const classes = useStyles();

  let { 
    children, 
    id,

    data,
    documentReferences,
    query,
    paginationLimit,
    disablePagination,
  
    hideCheckbox,
    hideIdentifier,
    hideActionIcons,
    hideDocumentReferenceName,
    hideStatus,
    hideMake,
    hideDocStatus,
    hideAuthor,
    hideSerialNumber,
    hideTypeCodingDisplay,
    hideCategory,
    hideBarcode,

    onCellClick,
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButtonClick,
    hideActionButton,
    actionButtonLabel,
  
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
        hideIdentifier = true;
        hideActionIcons = true;
        hideDocumentReferenceName = false;
        hideStatus = false;
        hideMake = true;
        hideDocStatus = true;
        hideAuthor = true;
        hideSerialNumber = true;
        hideTypeCodingDisplay = true;
        hideCategory = true;
        hideBarcode = true;
        break;
      case "tablet":
        hideCheckbox = true;
        hideIdentifier = true;
        hideActionIcons = true;
        hideDocumentReferenceName = false;
        hideStatus = false;
        hideMake = true;
        hideDocStatus = false;
        hideAuthor = true;
        hideSerialNumber = true;
        hideTypeCodingDisplay = true;
        hideCategory = true;
        hideBarcode = true;
        break;
      case "web":
        hideCheckbox = true;
        hideIdentifier = true;
        hideActionIcons = true;
        hideDocumentReferenceName = false;
        hideMake = true;
        hideDocStatus = false;
        hideAuthor = false;
        hideSerialNumber = false;
        hideTypeCodingDisplay = false;
        hideCategory = true;
        hideBarcode = true;
        break;
      case "desktop":
        hideCheckbox = true;
        hideIdentifier = true;
        hideActionIcons = true;
        hideDocumentReferenceName = false;
        hideMake = true;
        hideDocStatus = false;
        hideAuthor = false;
        hideSerialNumber = false;
        hideTypeCodingDisplay = false;
        hideCategory = true;
        hideBarcode = false;
        break;
      case "hdmi":
        hideCheckbox = true;
        hideActionIcons = true;
        hideIdentifier = false;
        hideDocumentReferenceName = false;
        hideMake = false;
        hideDocStatus = false;
        hideAuthor = false;
        hideSerialNumber = false;
        hideTypeCodingDisplay = false;
        hideCategory = false;
        hideBarcode = false;
        break;            
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
  function renderActionIconsHeader(){
    if (!hideActionIcons) {
      return (
        <TableCell className='actionIcons'>Actions</TableCell>
      );
    }
  }
  function renderActionIcons( device ){
    if (!hideActionIcons) {

      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{width: '120px'}}>
          {/* <Icon icon={tag} style={iconStyle} onClick={showSecurityDialog.bind(this, device)} />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={removeRecord.bind(this, device._id)} /> */}
        </TableCell>
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
  function renderTypeDisplay(type){
    if (!hideTypeCodingDisplay) {
      return (
        <TableCell className='type'>{type}</TableCell>
      );
    }
  }
  function renderTypeDisplayHeader(){
    if (!hideTypeCodingDisplay) {
      return (
        <TableCell className='type'>Type</TableCell>
      );
    }
  }
  function renderCategory(category){
    if (!hideCategory) {
      return (
        <TableCell className="category">{category}</TableCell>
      );
    }
  }
  function renderCategoryHeader(){
    if (!hideCategory) {
      return (
        <TableCell className="category">Category</TableCell>
      );
    }
  }
  function renderStatus(status){
    if (!hideStatus) {
      return (
        <TableCell className="status">{status}</TableCell>
      );
    }
  }
  function renderStatusHeader(){
    if (!hideStatus) {
      return (
        <TableCell className="status">Status</TableCell>
      );
    }
  }
  function renderAuthor(author){
    if (!hideAuthor) {
      return (
        <TableCell className="author">{author}</TableCell>
      );
    }
  }
  function renderAuthorHeader(){
    if (!hideAuthor) {
      return (
        <TableCell className="author">Author</TableCell>
      );
    }
  }

  function renderDocStatus(docStatus){
    if (!hideDocStatus) {
      return (
        <TableCell className="docStatus">{docStatus}</TableCell>
      );
    }
  }
  function renderDocStatusHeader(){
    if (!hideDocStatus) {
      return (
        <TableCell className="docStatus">Doc Status</TableCell>
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
  function renderActionButton(device){
    if (!hideActionButton) {
      return (
        <TableCell className='ActionButton' >
          <Button onClick={ handleActionButtonClick.bind(this, device._id)}>{ get(props, "actionButtonLabel", "") }</Button>
        </TableCell>
      );
    }
  }

  //---------------------------------------------------------------------
  // Table Rows

  let tableRows = [];
  let devicesToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.dateFormat){
    internalDateFormat = props.dateFormat;
  }

  if(props.documentReferences){
    if(props.documentReferences.length > 0){     
      let count = 0;    

      props.documentReferences.forEach(function(device){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          devicesToRender.push(FhirDehydrator.flattenDocumentReference(device, internalDateFormat));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer'
  }
  if(devicesToRender.length === 0){
    logger.trace('ConditionsTable: No documentReferences to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < devicesToRender.length; i++) {
      if(get(devicesToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      logger.trace('devicesToRender[i]', devicesToRender[i])
      tableRows.push(
        <TableRow className="deviceRow" key={i} style={rowStyle} onClick={ rowClick.bind(this, devicesToRender[i]._id)} style={{cursor: 'pointer'}} hover={true} >            
          { renderCheckbox() }  
          { renderActionIcons() }
          { renderIdentifier(get(devicesToRender[i], 'identifier')) }
          { renderTypeDisplay(get(devicesToRender[i], 'type')) }

          { renderStatus(get(devicesToRender[i], 'status')) }
          { renderAuthor(get(devicesToRender[i], 'author')) }
          { renderDocStatus(get(devicesToRender[i], 'docStatus')) }

          { renderCategory(get(devicesToRender[i], 'category'))}
          { renderBarcode(devicesToRender[i].id)}
          { renderActionButton(devicesToRender[i]) }
        </TableRow>
      );    
    }
  }



  //---------------------------------------------------------------------
  // Actual Render Method

  return(
    <div id={id} className="tableWithPagination">
      <Table className='devicesTable' size={tableRowSize} aria-label="a dense table" { ...otherProps }>
        <TableHead>
          <TableRow>
            { renderCheckboxHeader() }  
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }
            { renderTypeDisplayHeader() }
            { renderStatusHeader() }
            { renderAuthorHeader() }
            { renderDocStatusHeader() }
            { renderCategoryHeader() }
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




DocumentReferencesTable.propTypes = {
  id: PropTypes.string,

  data: PropTypes.array,
  documentReferences: PropTypes.array,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideDocumentReferenceName: PropTypes.bool,
  hideMake: PropTypes.bool,
  hideDocStatus: PropTypes.bool,
  hideAuthor: PropTypes.bool,
  hideSerialNumber: PropTypes.bool,
  hideTypeCodingDisplay: PropTypes.bool,
  hideCategory: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  hideActionButton: PropTypes.bool,
  actionButtonLabel: PropTypes.string,

  rowsPerPage: PropTypes.number,
  tableRowSize: PropTypes.string,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,
  hideEnteredInError: PropTypes.bool,
  formFactorLayout: PropTypes.string
};

DocumentReferencesTable.defaultProps = {
  hideCheckbox: true,
  hideActionIcons: true,
  hideIdentifier: true,
  hideDocumentReferenceName: false,
  hideStatus: false,
  hideMake: true,
  hideDocStatus: true,
  hideAuthor: true,
  hideSerialNumber: false,
  hideTypeCodingDisplay: true,
  hideCategory: true,
  hideBarcode: true,
  disablePagination: false,
  hideActionButton: true,
  rowsPerPage: 5,
  tableRowSize: 'medium'
}

export default DocumentReferencesTable;
