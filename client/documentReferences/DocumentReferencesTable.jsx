
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

import { StyledCard, PageCanvas } from 'fhir-starter';
import { FhirDehydrator } from '../../lib/FhirDehydrator';



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
    hideActionIcons,
    hideMasterIdentifier,
    hideIdentifier,
    hideStatus,
    hideDocStatus,
    hideTypeCodingDisplay,
    hideTypeCode,
    hideCategory,
    hideSubjectReference,
    hideSubjectDisplay,
    hideDescription,
    hideDate,
    hideAuthor,
    hideAuthorReference,
    hideRelatesToCode,
    hideRelatesToReference,
    hideContentAttachment,
    hideContentFormat,
    hideContentCount,
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

    page,
    onSetPage,

    count,

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
        hideMasterIdentifier = true;
        hideIdentifier = false;
        hideStatus = false;
        hideDocStatus = true;
        hideTypeCodingDisplay = true;
        hideTypeCode = true;
        hideCategory = false;
        hideSubjectReference = true;
        hideSubjectDisplay = true;
        hideDescription = true;
        hideDate = true;
        hideAuthor = true;
        hideAuthorReference = true;
        hideRelatesToCode = true;
        hideRelatesToReference = true;
        hideContentAttachment = false;
        hideContentFormat = false;
        hideContentCount = false;
        hideBarcode = true;
        break;
      case "tablet":
        hideCheckbox = true;
        hideActionIcons = true;
        hideMasterIdentifier = true;
        hideIdentifier = true;
        hideStatus = false;
        hideDocStatus = true;
        hideTypeCodingDisplay = true;
        hideTypeCode = true;
        hideCategory = false;
        hideSubjectReference = true;
        hideSubjectDisplay = true;
        hideDescription = true;
        hideDate = false;
        hideAuthor = true;
        hideAuthorReference = true;
        hideRelatesToCode = true;
        hideRelatesToReference = true;
        hideContentAttachment = false;
        hideContentFormat = false;
        hideContentCount = false;
        hideBarcode = true;
        break;
      case "web":
        hideCheckbox = true;
        hideActionIcons = true;
        hideMasterIdentifier = false;
        hideIdentifier = true;
        hideStatus = false;
        hideDocStatus = false;
        hideTypeCodingDisplay = false;
        hideTypeCode = false;
        hideCategory = false;
        hideSubjectReference = true;
        hideSubjectDisplay = false;
        hideDescription = false;
        hideDate = false;
        hideAuthor = false;
        hideAuthorReference = true;
        hideRelatesToCode = false;
        hideRelatesToReference = false;
        hideContentAttachment = false;
        hideContentFormat = false;
        hideContentCount = false;
        hideBarcode = true;
        break;
      case "desktop":
        hideCheckbox = true;
        hideActionIcons = true;
        hideMasterIdentifier = false;
        hideIdentifier = true;
        hideStatus = false;
        hideDocStatus = false;
        hideTypeCodingDisplay = false;
        hideTypeCode = false;
        hideCategory = false;
        hideSubjectReference = true;
        hideSubjectDisplay = false;
        hideDescription = false;
        hideDate = false;
        hideAuthor = false;
        hideAuthorReference = true;
        hideRelatesToCode = false;
        hideRelatesToReference = false;
        hideContentAttachment = false;
        hideContentFormat = false;
        hideContentCount = false;
        hideBarcode = true;
        break;
      case "hdmi":
        hideCheckbox = true;
        hideActionIcons = true;
        hideMasterIdentifier = false;
        hideIdentifier = false;
        hideStatus = false;
        hideDocStatus = false;
        hideTypeCodingDisplay = false;
        hideTypeCode = false;
        hideCategory = false;
        hideSubjectReference = false;
        hideSubjectDisplay = false;
        hideDescription = false;
        hideDate = false;
        hideAuthor = false;
        hideAuthorReference = false;
        hideRelatesToCode = false;
        hideRelatesToReference = false;
        hideContentAttachment = false;
        hideContentFormat = false;
        hideContentCount = false;
        hideBarcode = false;
        break;            
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
  function renderMasterIdentifierHeader(){
    if (!hideMasterIdentifier) {
      return (
        <TableCell className='masterIdentifier'>Master Identifier</TableCell>
      );
    }
  }
  function renderMasterIdentifier(masterIdentifier ){
    if (!hideMasterIdentifier) {
      return (
        <TableCell className='masterIdentifier'>{ masterIdentifier }</TableCell>
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
  function renderTypeCode(typeCode){
    if (!hideTypeCode) {
      return (
        <TableCell className='typeCode'>{typeCode}</TableCell>
      );
    }
  }
  function renderTypeCodeHeader(){
    if (!hideTypeCode) {
      return (
        <TableCell className='typeCode'>Type Code</TableCell>
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
  function renderDescription(description){
    if (!hideDescription) {
      return (
        <TableCell className="description">{description}</TableCell>
      );
    }
  }
  function renderDescriptionHeader(){
    if (!hideDescription) {
      return (
        <TableCell className="description">Description</TableCell>
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
  function renderDate(date){
    if (!hideDate) {
      return (
        <TableCell className="date">{date}</TableCell>
      );
    }
  }
  function renderDateHeader(){
    if (!hideDate) {
      return (
        <TableCell className="date">Date</TableCell>
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
  function renderAuthorReference(authorReference){
    if (!hideAuthorReference) {
      return (
        <TableCell className="authorReference">{authorReference}</TableCell>
      );
    }
  }
  function renderAuthorReferenceHeader(){
    if (!hideAuthorReference) {
      return (
        <TableCell className="authorReference">Author Reference</TableCell>
      );
    }
  }

  function renderSubjectReference(subjectReference){
    if (!hideSubjectReference) {
      return (
        <TableCell className="subjectReference">{subjectReference}</TableCell>
      );
    }
  }
  function renderSubjectReferenceHeader(){
    if (!hideSubjectReference) {
      return (
        <TableCell className="subjectReference">Subject Reference</TableCell>
      );
    }
  }
  function renderSubjectDisplay(subjectDisplay){
    if (!hideSubjectDisplay) {
      return (
        <TableCell className="subjectDisplay">{subjectDisplay}</TableCell>
      );
    }
  }
  function renderSubjectDisplayHeader(){
    if (!hideSubjectDisplay) {
      return (
        <TableCell className="subjectDisplay">Subject</TableCell>
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


  function renderRelatesToCode(relatesToCode){
    if (!hideRelatesToCode) {
      return (
        <TableCell className="relatesToCode">{relatesToCode}</TableCell>
      );
    }
  }
  function renderRelatesToCodeHeader(){
    if (!hideRelatesToCode) {
      return (
        <TableCell className="relatesToCode">Relates To Code</TableCell>
      );
    }
  }
  function renderRelatesToReference(relatesToReference){
    if (!hideRelatesToReference) {
      return (
        <TableCell className="relatesToReference">{relatesToReference}</TableCell>
      );
    }
  }
  function renderRelatesToReferenceHeader(){
    if (!hideRelatesToReference) {
      return (
        <TableCell className="relatesToReference">Relates To Reference</TableCell>
      );
    }
  }


  function renderContentAttachment(contentAttachment){
    if (!hideContentAttachment) {
      return (
        <TableCell className="contentAttachment">{contentAttachment}</TableCell>
      );
    }
  }
  function renderContentAttachmentHeader(){
    if (!hideContentAttachment) {
      return (
        <TableCell className="contentAttachment">Content Attachment</TableCell>
      );
    }
  }

  function renderContentFormat(contentFormat){
    if (!hideContentFormat) {
      return (
        <TableCell className="contentFormat">{contentFormat}</TableCell>
      );
    }
  }
  function renderContentFormatHeader(){
    if (!hideContentFormat) {
      return (
        <TableCell className="contentFormat">Content Format</TableCell>
      );
    }
  }
  function renderContentCount(contentCount){
    if (!hideContentCount) {
      return (
        <TableCell className="contentCount">{contentCount}</TableCell>
      );
    }
  }
  function renderContentCountHeader(){
    if (!hideContentCount) {
      return (
        <TableCell className="contentCount">Content Count</TableCell>
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
  let documentReferencesToRender = [];
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
          documentReferencesToRender.push(FhirDehydrator.dehydrateDocumentReference(device, internalDateFormat));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer'
  }
  if(documentReferencesToRender.length === 0){
    logger.trace('ConditionsTable: No documentReferences to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < documentReferencesToRender.length; i++) {
      if(get(documentReferencesToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      logger.trace('documentReferencesToRender[i]', documentReferencesToRender[i])
      tableRows.push(
        <TableRow className="deviceRow" key={i} style={rowStyle} onClick={ rowClick.bind(this, documentReferencesToRender[i]._id)} style={{cursor: 'pointer'}} hover={true} >            
          { renderCheckbox() }  
          { renderActionIcons() }
          { renderMasterIdentifier(get(documentReferencesToRender[i], 'masterIdentifier')) }
          { renderIdentifier(get(documentReferencesToRender[i], 'identifier')) }
          { renderStatus(get(documentReferencesToRender[i], 'status')) }
          { renderDocStatus(get(documentReferencesToRender[i], 'docStatus')) }          
          { renderTypeDisplay(get(documentReferencesToRender[i], 'typeDisplay')) }
          { renderTypeCode(get(documentReferencesToRender[i], 'typeCode')) }
          { renderCategory(get(documentReferencesToRender[i], 'category'))}
          { renderSubjectReference(get(documentReferencesToRender[i], 'subjectReference')) }
          { renderSubjectDisplay(get(documentReferencesToRender[i], 'subjectDisplay')) }
          { renderDate(get(documentReferencesToRender[i], 'date')) }
          { renderDescription(get(documentReferencesToRender[i], 'description')) }
          { renderAuthor(get(documentReferencesToRender[i], 'author')) }
          { renderAuthorReference(get(documentReferencesToRender[i], 'authorReference')) }
          { renderRelatesToCode(get(documentReferencesToRender[i], 'relatesToCode')) }
          { renderRelatesToReference(get(documentReferencesToRender[i], 'relatesToReference')) }
          { renderContentAttachment(get(documentReferencesToRender[i], 'contentAttachment')) }
          { renderContentCount(get(documentReferencesToRender[i], 'contentCount')) } 
          {/* { renderContentFormat(get(documentReferencesToRender[i], 'contentFormat')) } */}
          {/*                     
          {/* { renderActionButton(documentReferencesToRender[i]) } */}
          { renderBarcode(get(documentReferencesToRender[i], 'id'))}
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
            { renderMasterIdentifierHeader() }
            { renderIdentifierHeader() }
            { renderStatusHeader() }
            { renderDocStatusHeader() }
            { renderTypeDisplayHeader() }
            { renderTypeCodeHeader() }
            { renderCategoryHeader() }
            { renderSubjectReferenceHeader() }
            { renderSubjectDisplayHeader() }
            { renderDateHeader() }
            { renderDescriptionHeader() }
            { renderAuthorHeader() }
            { renderAuthorReferenceHeader() }
            { renderRelatesToCodeHeader() }
            { renderRelatesToReferenceHeader() }
            { renderContentAttachmentHeader() }
            {/* { renderContentFormatHeader() } */}
            { renderContentCountHeader() } 
            {/* 
            {/* { renderActionButtonHeader() } */}
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




DocumentReferencesTable.propTypes = {
  id: PropTypes.string,

  data: PropTypes.array,
  documentReferences: PropTypes.array,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideMasterIdentifier: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideDocStatus: PropTypes.bool,
  hideTypeCodingDisplay: PropTypes.bool,
  hideTypeCode: PropTypes.bool,
  hideCategory: PropTypes.bool,
  hideSubjectReference: PropTypes.bool,
  hideSubjectDisplay: PropTypes.bool,
  hideDescription: PropTypes.bool,
  hideDate: PropTypes.bool,
  hideAuthor: PropTypes.bool,
  hideAuthorReference: PropTypes.bool,
  hideRelatesToCode: PropTypes.bool,
  hideRelatesToReference: PropTypes.bool,
  hideContentAttachment: PropTypes.bool,
  hideContentFormat: PropTypes.bool,
  hideContentCount: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  onSetPage: PropTypes.func,

  page: PropTypes.number,
  count: PropTypes.number,
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
  hideMasterIdentifier: false,
  hideIdentifier: false,
  hideStatus: false,
  hideDocStatus: false,
  hideTypeCodingDisplay: true,
  hideTypeCode: false,
  hideCategory: true,
  hideSubjectReference: false,
  hideSubjectDisplay: false,
  hideDescription: false,
  hideDate: false,
  hideAuthor: true,
  hideAuthorReference: true,
  hideRelatesToCode: false,
  hideRelatesToReference: false,
  hideContentAttachment: false,
  hideContentFormat: false,
  hideContentCount: false,
  
  hideBarcode: true,
  disablePagination: false,
  hideActionButton: true,
  rowsPerPage: 5,
  tableRowSize: 'medium',
  count: 0
}

export default DocumentReferencesTable;
