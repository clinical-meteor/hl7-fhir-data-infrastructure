import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox
} from '@material-ui/core';

import moment from 'moment'
import { get, set } from 'lodash';

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
// SESSION VARIABLES

Session.setDefault('selectedParameters', []);

//===========================================================================
// MAIN COMPONENT


function SearchParametersTable(props){
  logger.info('Rendering the SearchParametersTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.SearchParametersTable');
  logger.data('SearchParametersTable.props', {data: props}, {source: "SearchParametersTable.jsx"});

  const classes = useStyles();

  let { 
    children, 
    id,
    data,

    searchParameters,
    selectedSearchParameterId,
    query,
    paginationLimit,
    disablePagination,

    hideCheckbox,
    hideActionIcons,

    hideVersion,
    hideName,
    hideTitle,
    hideStatus,
    hideExperimental,
    hideDate,
    hidePublisher,
    hideContact,
    hideDescription,
    hideBarcode,

    onCellClick,
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButtonClick,
    showActionButton,
    actionButtonLabel,
  
    rowsPerPage,
    tableRowSize,
    dateFormat,
    showMinutes,
    size,
    appHeight,
    formFactorLayout,

    page,
    onSetPage,

    count,
    multiline,
    checklist,

    ...otherProps 
  } = props;

  // ------------------------------------------------------------------------
  // Form Factors

  if(formFactorLayout){
    switch (formFactorLayout) {
      case "phone":
        hideActionIcons = false;

        hideVersion = false;
        hideName = false;
        hideTitle = false;
        hideStatus = false;
        hideExperimental = false;
        hideDate = false;
        hidePublisher = false;
        hideContact = false;
        hideDescription = false;
        
        hideBarcode = true;
        break;
      case "tablet":
        hideActionIcons = false;
        hideVersion = false;
        hideName = false;
        hideTitle = false;
        hideStatus = false;
        hideExperimental = false;
        hideDate = false;
        hidePublisher = false;
        hideContact = false;
        hideDescription = false;
        hideBarcode = true;
        break;
      case "web":
        hideActionIcons = false;
        hideVersion = false;
        hideName = false;
        hideTitle = false;
        hideStatus = false;
        hideExperimental = false;
        hideDate = false;
        hidePublisher = false;
        hideContact = false;
        hideDescription = false;
        hideBarcode = true;
        break;
      case "desktop":
        hideActionIcons = false;
        hideVersion = false;
        hideName = false;
        hideTitle = false;
        hideStatus = false;
        hideExperimental = false;
        hideDate = false;
        hidePublisher = false;
        hideContact = false;
        hideDescription = false;
        hideBarcode = true;
        break;
      case "videowall":
        hideActionIcons = false;
        hideVersion = false;
        hideName = false;
        hideTitle = false;
        hideStatus = false;
        hideExperimental = false;
        hideDate = false;
        hidePublisher = false;
        hideContact = false;
        hideDescription = false;
        hideBarcode = true;
        break;            
    }
  }

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


  // ------------------------------------------------------------------------
  // Helper Functions

  function handleRowClick(id){
    console.log('Clicking row ' + id)
    if(onRowClick){
      onRowClick(id);
    }
  }

  function removeRecord(_id){
    console.log('Remove searchParameter ', _id)
    if(onRemoveRecord){
      onRemoveRecord(_id);
    }
  }
  function handleActionButtonClick(id){
    if(typeof onActionButtonClick === "function"){
      onActionButtonClick(id);
    }
  }
  function cellClick(id){
    if(typeof onCellClick === "function"){
      onCellClick(id);
    }
  }
  function handleMetaClick(patient){
    let self = this;
    if(onMetaClick){
      onMetaClick(self, patient);
    }
  }

  // ------------------------------------------------------------------------
  // Column Rendering

  function renderCheckboxHeader(){
    if (!hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Toggle</TableCell>
      );
    }
  }
  function renderCheckbox(){
    if (!hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}}>
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
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(searchParameter ){
    if (!hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ onMetaClick.bind(searchParameter)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(searchParameter._id)} />   */}
        </TableCell>
      );
    }
  } 

  function renderStatus(status){
    if (!hideStatus) {
      return (
        <TableCell className='status'>{ status }</TableCell>
      );
    }
  }
  function renderStatusHeader(){
    if (!hideStatus) {
      return (
        <TableCell className='status'>Status</TableCell>
      );
    }
  }

  function renderVersion(version){
    if (!hideVersion) {
      return (
        <TableCell className='version'>{ version }</TableCell>
      );
    }
  }
  function renderVersionHeader(){
    if (!hideVersion) {
      return (
        <TableCell className='version'>Version</TableCell>
      );
    }
  }

  function renderName(name){
    if (!hideName) {
      return (
        <TableCell className='name'>{ name }</TableCell>
      );
    }
  }
  function renderNameHeader(){
    if (!hideName) {
      return (
        <TableCell className='name'>Name</TableCell>
      );
    }
  }

  function renderTitle(title){
    if (!hideTitle) {
      return (
        <TableCell className='title'>{ title }</TableCell>
      );
    }
  }
  function renderTitleHeader(){
    if (!hideTitle) {
      return (
        <TableCell className='title'>Title</TableCell>
      );
    }
  }

  function renderExperimental(experimental){
    if (!hideExperimental) {
      return (
        <TableCell className='experimental'>{ experimental }</TableCell>
      );
    }
  }
  function renderExperimentalHeader(){
    if (!hideExperimental) {
      return (
        <TableCell className='experimental'>Experimental</TableCell>
      );
    }
  }


  function renderDate(date){
    if (!hideDate) {
      return (
        <TableCell className='date'>{ date }</TableCell>
      );
    }
  }
  function renderDateHeader(){
    if (!hideDate) {
      return (
        <TableCell className='date'>Date</TableCell>
      );
    }
  }
  function renderPublisher(publisher){
    if (!hidePublisher) {
      return (
        <TableCell className='publisher'>{ publisher }</TableCell>
      );
    }
  }
  function renderPublisherHeader(){
    if (!hidePublisher) {
      return (
        <TableCell className='publisher'>Publisher</TableCell>
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


  
  
  //---------------------------------------------------------------------
  // Table Rows



  let tableRows = [];
  let searchParametersToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }


  if(searchParameters){
    if(searchParameters.length > 0){   
      let count = 0;               
      searchParameters.forEach(function(searchParameter){
        if((count >= (page * rowsPerPage)) && (count < (page + 1) * rowsPerPage)){
          searchParametersToRender.push(FhirDehydrator.dehydrateSearchParameter(searchParameter, internalDateFormat));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer', 
    height: '55px'
  }

  if(searchParametersToRender.length === 0){
    console.log('No searchParameters to render');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < searchParametersToRender.length; i++) {

      let selected = false;
      if(searchParametersToRender[i].id === selectedSearchParameterId){
        selected = true;
      }
      if(get(searchParametersToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }

      tableRows.push(
        <TableRow 
          className="searchParameterRow" 
          key={i} 
          onClick={ handleRowClick.bind(this, searchParametersToRender[i].id)} 
          hover={true} 
          style={rowStyle} 
          selected={selected}
        >
          { renderCheckbox() }
          { renderActionIcons(searchParametersToRender[i]) }
          { renderStatus(searchParametersToRender[i].status) }

          { renderVersion(searchParametersToRender[i].version) }
          { renderName(searchParametersToRender[i].name) }
          { renderTitle(searchParametersToRender[i].title) }
          { renderExperimental(searchParametersToRender[i].experimental) }
          { renderDate(searchParametersToRender[i].date) }
          { renderPublisher(searchParametersToRender[i].publisher) }

          { renderBarcode(searchParametersToRender[i].id)}
        </TableRow>
      );       
    }
  }

  return(
    <div>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            { renderCheckboxHeader() }
            { renderActionIconsHeader() }
            { renderStatusHeader() }
            
            { renderVersionHeader() }
            { renderNameHeader() }
            { renderTitleHeader() }
            { renderExperimentalHeader() }
            { renderDateHeader() }
            { renderPublisherHeader() }

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

SearchParametersTable.propTypes = {
  barcodes: PropTypes.bool,
  searchParameters: PropTypes.array,
  selectedSearchParameterId: PropTypes.string,

  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  showMinutes: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,

  hideVersion: PropTypes.bool,
  hideName: PropTypes.bool,
  hideTitle: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideExperimental: PropTypes.bool,
  hideDate: PropTypes.bool,
  hidePublisher: PropTypes.bool,
  hideContact: PropTypes.bool,
  hideDescription: PropTypes.bool,

  hideBarcode: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  onSetPage: PropTypes.func,

  page: PropTypes.number,
  actionButtonLabel: PropTypes.string,
  tableRowSize: PropTypes.string,

  formFactorLayout: PropTypes.string,
  checklist: PropTypes.bool,

  dateFormat: PropTypes.string
};
SearchParametersTable.defaultProps = {
  hideCheckbox: true,
  hideActionIcons: true,

  hideVersion: false,
  hideName: false,
  hideTitle: false,
  hideStatus: false,
  hideExperimental: false,
  hideDate: false,
  hidePublisher: false,
  hideContact: false,
  hideDescription: false,

  hideBarcode: true,

  checklist: true,
  selectedSearchParameterId: '',
  page: 0,
  rowsPerPage: 5,
  tableRowSize: 'medium',
  actionButtonLabel: 'Export',

  dateFormat: "YYYY-MM-DD"
}

export default SearchParametersTable; 