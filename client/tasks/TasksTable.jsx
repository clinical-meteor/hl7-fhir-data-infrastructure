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

import TableNoData from 'fhir-starter';

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




function TasksTable(props){
  logger.info('Rendering the TasksTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.TasksTable');
  logger.data('TasksTable.props', {data: props}, {source: "TasksTable.jsx"});

  const classes = useStyles();

  let { 
    children, 

    tasks,
    selectedTaskId,

    query,
    paginationLimit,
    disablePagination,

    hideCheckbox,
    hideActionIcons,
    hideAuthoredOn,
    hideLastModified,
    hideDescription,
    hideFocus,
    hideFor,
    hideIntent,
    hideRequestor,
    hideStatus,
    hideBusinessStatus,
    hideCode,
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
    displayEnteredInError,

    formFactorLayout,
    checklist,
    count,
    tableRowSize,

    ...otherProps 
  } = props;

  // ------------------------------------------------------------------------
  // Form Factors

  if(formFactorLayout){
    switch (formFactorLayout) {
      case "phone":
        hideCheckbox = true;
        hideActionIcons = false;
        hideAuthoredOn = false;
        hideLastModified = true;
        hideDescription = true;
        hideFocus = false;
        hideFor = false;
        hideIntent = true;
        hideRequestor = false;
        hideStatus = false;
        hideBusinessStatus = false;
        hideCode = false;
        hideBarcode = true;
        break;
      case "tablet":
        hideCheckbox = true;
        hideActionIcons = false;
        hideAuthoredOn = false;
        hideLastModified = true;
        hideDescription = true;
        hideFocus = false;
        hideFor = false;
        hideIntent = true;
        hideRequestor = false;
        hideStatus = false;
        hideBusinessStatus = false;
        hideCode = false;
        hideBarcode = true;
        break;
      case "web":
        hideCheckbox = true;
        hideActionIcons = false;
        hideAuthoredOn = false;
        hideLastModified = true;
        hideDescription = true;
        hideFocus = false;
        hideFor = false;
        hideIntent = true;
        hideRequestor = true;
        hideStatus = false;
        hideBusinessStatus = false;
        hideCode = false;
        hideBarcode = true;
        break;
      case "desktop":
        hideCheckbox = true;
        hideActionIcons = false;
        hideAuthoredOn = false;
        hideLastModified = true;
        hideDescription = true;
        hideFocus = false;
        hideFor = false;
        hideIntent = true;
        hideRequestor = true;
        hideStatus = false;
        hideBusinessStatus = false;
        hideCode = false;
        hideBarcode = true;
        break;
      case "videowall":
        hideCheckbox = false;
        hideActionIcons = false;
        hideAuthoredOn = false;
        hideLastModified = false;
        hideDescription = false;
        hideFocus = false;
        hideFor = false;
        hideIntent = false;
        hideRequestor = false;
        hideStatus = false;
        hideBusinessStatus = false;
        hideCode = false;
        hideBarcode = true;
        break;            
    }
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
    console.log('Remove task ', _id)
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
  function renderActionIcons(task ){
    if (!hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ onMetaClick.bind(task)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(task._id)} />   */}
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
  function renderBusinessStatusHeader(){
    if (!hideBusinessStatus) {
      return (
        <TableCell className='businessStatus'>Business Status</TableCell>
      );
    }
  }
  function renderBusinessStatus(businessStatus){
    if (!hideBusinessStatus) {
      return (
        <TableCell className='businessStatus'>{ businessStatus }</TableCell>
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
  function renderDescription(description){
    if (!hideDescription) {
      return (
        <TableCell className='description'>{ description }</TableCell>
      );
    }
  }
  function renderDescriptionHeader(){
    if (!hideDescription) {
      return (
        <TableCell className='description'>Description</TableCell>
      );
    }
  }

  function renderAuthoredOn(approvalDate){
    if (!hideAuthoredOn) {
      return (
        <TableCell className='approvalDate'>{ approvalDate }</TableCell>
      );
    }
  }
  function renderAuthoredOnHeader(){
    if (!hideAuthoredOn) {
      return (
        <TableCell className='approvalDate' style={{minWidth: '140px'}}>Authored Date</TableCell>
      );
    }
  }
  function renderLastModified(lastModified){
    if (!hideLastModified) {
      return (
        <TableCell className='lastModified'>{ lastModified }</TableCell>
      );
    }
  }
  function renderLastModifiedHeader(){
    if (!hideLastModified) {
      return (
        <TableCell className='lastModified' style={{minWidth: '140px'}}>Last Modified</TableCell>
      );
    }
  }

  function renderFocus(focus){
    if (!hideFocus) {
      return (
        <TableCell className='focus'>{ focus }</TableCell>
      );
    }
  }
  function renderFocusHeader(){
    if (!hideFocus) {
      return (
        <TableCell className='focus'>Focus</TableCell>
      );
    }
  }
  function renderFor(text){
    if (!hideFor) {
      return (
        <TableCell className='for'>{ text }</TableCell>
      );
    }
  }
  function renderForHeader(){
    if (!hideFor) {
      return (
        <TableCell className='for'>For</TableCell>
      );
    }
  }
  function renderRequestor(requester){
    if (!hideRequestor) {
      return (
        <TableCell className='requester'>{ requester }</TableCell>
      );
    }
  }
  function renderRequestorHeader(){
    if (!hideRequestor) {
      return (
        <TableCell className='requester'>Requestor</TableCell>
      );
    }
  }

  function renderIntent(intent){
    if (!hideIntent) {
      return (
        <TableCell className='intent'>{ intent }</TableCell>
      );
    }
  }
  function renderIntentHeader(){
    if (!hideIntent) {
      return (
        <TableCell className='intent'>Intent</TableCell>
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
  function renderCodeHeader(){
    if (!hideCode) {
      return (
        <TableCell className='code'>Code</TableCell>
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
  let tasksToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }


  if(tasks){
    if(tasks.length > 0){              
      tasks.forEach(function(task){
        tasksToRender.push(FhirDehydrator.dehydrateTask(task, internalDateFormat));
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer', 
    height: '52px'
  }

  if(tasksToRender.length === 0){
    console.log('No tasks to render');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < tasksToRender.length; i++) {

      let selected = false;
      if(tasksToRender[i].id === selectedTaskId){
        selected = true;
      }
      if(get(tasksToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }

      tableRows.push(
        <TableRow 
          className="taskRow" 
          key={i} 
          onClick={ handleRowClick.bind(this, tasksToRender[i]._id)} 
          hover={true} 
          style={{cursor: 'pointer', height: '52px'}} 
          selected={selected}
        >
          { renderCheckbox() }
          { renderActionIcons(tasksToRender[i]) }
          { renderStatus(tasksToRender[i].status) }
          { renderBusinessStatus(tasksToRender[i].businessStatus) }
          { renderDescription(tasksToRender[i].description) }          
          { renderAuthoredOn(tasksToRender[i].authoredOn) }
          { renderLastModified(tasksToRender[i].lastModified) }
          { renderFocus(tasksToRender[i].focus) }
          { renderFor(tasksToRender[i].for) }
          { renderRequestor(tasksToRender[i].requester) }
          { renderCode(tasksToRender[i].code) }
          { renderIntent(tasksToRender[i].intent) }

          { renderBarcode(tasksToRender[i].id)}
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
            { renderBusinessStatusHeader() }
            { renderDescriptionHeader() }
            { renderAuthoredOnHeader() }
            { renderLastModifiedHeader() }
            { renderFocusHeader() }
            { renderForHeader() }
            { renderRequestorHeader() }
            { renderCodeHeader() }
            { renderIntentHeader() }
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

TasksTable.propTypes = {
  barcodes: PropTypes.bool,
  tasks: PropTypes.array,
  selectedTaskId: PropTypes.string,

  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  showMinutes: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideAuthoredOn: PropTypes.bool,
  hideLastModified: PropTypes.bool,
  hideDescription: PropTypes.bool,
  hideFocus: PropTypes.bool,
  hideFor: PropTypes.bool,
  hideIntent: PropTypes.bool,
  hideRequestor: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideBusinessStatus: PropTypes.bool,
  hideCode: PropTypes.bool,
  hideBarcode: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,
  tableRowSize: PropTypes.string,

  formFactorLayout: PropTypes.string,
  checklist: PropTypes.bool
};
TasksTable.defaultProps = {
  hideCheckbox: true,
  hideActionIcons: true,
  hideAuthoredOn: false,
  hideLastModified: true,
  hideDescription: true,
  hideFocus: false,
  hideFor: false,
  hideIntent: true,
  hideRequestor: true,
  hideStatus: false,
  hideBusinessStatus: false,
  hideCode: true,
  hideBarcode: true,

  checklist: true,
  selectedTaskId: '',
  rowsPerPage: 5,
  tableRowSize: 'medium'
}

export default TasksTable; 