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

import TableNoData from 'material-fhir-ui';

import moment from 'moment'
import _ from 'lodash';
let get = _.get;
let set = _.set;

import FhirUtilities from '../../lib/FhirUtilities';
import { flattenTask } from '../../lib/FhirDehydrator';


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

flattenTask = function(task, internalDateFormat){
  let result = {
    _id: '',
    meta: '',
    identifier: '',
    publisher: '',
    status: '',
    title: '',
    authoredOn: '',
    focus: '',
    for: '',
    intent: '',
    code: '',
    requester: ''
  };

  if(!internalDateFormat){
    internalDateFormat = get(Meteor, "settings.public.defaults.internalDateFormat", "YYYY-MM-DD");
  }

  result._id =  get(task, 'id') ? get(task, 'id') : get(task, '_id');
  result.id = get(task, 'id', '');
  result.identifier = get(task, 'identifier[0].value', '');

  if(get(task, 'authoredOn')){
    result.authoredOn = moment(get(task, 'authoredOn', '')).format(internalDateFormat);
  }

  result.description = get(task, 'description', '');
  result.status = get(task, 'status', '');
  result.intent = get(task, 'intent', '');
  result.focus = get(task, 'focus.display', '');
  result.for = get(task, 'for.display', '');
  result.requester = get(task, 'requester.display', '');
  result.code = get(task, 'code.text', '');

  return result;
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
    hideVersion,
    hideStatus,
    hidePublisher,
    hideTitle,
    hideDescription,
    hideAuthoredOn,
    hideLastEditedDate,
    hideLastReviewed,
    hideAuthor,
    hideEditor,
    hideReviewer,
    hideEndorser,
    hideScoring,
    hideType,
    hideRiskAdjustment,
    hideRateAggregation,
    hideSupplementalData,
    hideContext,
    hidePopulationCount,
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
    console.log('Remove task ', _id)
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

  function renderCheckboxHeader(){
    if (!props.hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Toggle</TableCell>
      );
    }
  }
  function renderCheckbox(){
    if (!props.hideCheckbox) {
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
    if (!props.hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(task ){
    if (!props.hideActionIcons) {
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
  function renderDescription(description){
    if (!props.hideDescription) {
      return (
        <TableCell className='description'>{ description }</TableCell>
      );
    }
  }
  function renderDescriptionHeader(){
    if (!props.hideDescription) {
      return (
        <TableCell className='description'>Description</TableCell>
      );
    }
  }

  function renderAuthoredOn(approvalDate){
    if (!props.hideAuthoredOn) {
      return (
        <TableCell className='approvalDate'>{ approvalDate }</TableCell>
      );
    }
  }
  function renderAuthoredOnHeader(){
    if (!props.hideAuthoredOn) {
      return (
        <TableCell className='approvalDate' style={{minWidth: '140px'}}>Approval Date</TableCell>
      );
    }
  }
  function renderFocus(focus){
    if (!props.hideFocus) {
      return (
        <TableCell className='focus'>{ focus }</TableCell>
      );
    }
  }
  function renderFocusHeader(){
    if (!props.hideFocus) {
      return (
        <TableCell className='focus'>Focus</TableCell>
      );
    }
  }
  function renderFor(text){
    if (!props.hideFor) {
      return (
        <TableCell className='for'>{ text }</TableCell>
      );
    }
  }
  function renderForHeader(){
    if (!props.hideFor) {
      return (
        <TableCell className='for'>For</TableCell>
      );
    }
  }
  function renderRequestor(requester){
    if (!props.hideRequestor) {
      return (
        <TableCell className='requester'>{ requester }</TableCell>
      );
    }
  }
  function renderRequestorHeader(){
    if (!props.hideRequestor) {
      return (
        <TableCell className='requester'>Requestor</TableCell>
      );
    }
  }

  function renderIntent(intent){
    if (!props.hideIntent) {
      return (
        <TableCell className='intent'>{ intent }</TableCell>
      );
    }
  }
  function renderIntentHeader(){
    if (!props.hideIntent) {
      return (
        <TableCell className='intent'>Intent</TableCell>
      );
    }
  }
  function renderCode(code){
    if (!props.hideCode) {
      return (
        <TableCell className='code'>{ code }</TableCell>
      );
    }
  }
  function renderCodeHeader(){
    if (!props.hideCode) {
      return (
        <TableCell className='code'>Code</TableCell>
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
  let tasksToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.internalDateFormat){
    internalDateFormat = props.dateFormat;
  }


  if(props.tasks){
    if(props.tasks.length > 0){              
      props.tasks.forEach(function(task){
        tasksToRender.push(flattenTask(task, internalDateFormat));
      });  
    }
  }

  if(tasksToRender.length === 0){
    console.log('No tasks to render');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < tasksToRender.length; i++) {

      let selected = false;
      if(tasksToRender[i].id === selectedTaskId){
        selected = true;
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
          { renderDescription(tasksToRender[i].description) }          
          { renderAuthoredOn(tasksToRender[i].authoredOn) }
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
            { renderDescriptionHeader() }
            { renderAuthoredOnHeader() }
            { renderFocusHeader() }
            { renderFor() }
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
  hideDescription: PropTypes.bool,
  hideFocus: PropTypes.bool,
  hideFor: PropTypes.bool,
  hideIntent: PropTypes.bool,
  hideRequestor: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideCode: PropTypes.bool,
  hideBarcode: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string
};
TasksTable.defaultProps = {
  hideCheckbox: true,
  hideActionIcons: true,
  hideAuthoredOn: false,
  hideDescription: false,
  hideFocus: false,
  hideFor: false,
  hideIntent: false,
  hideRequestor: false,
  hideStatus: false,
  hideCode: false,
  hideBarcode: true,
  selectedTaskId: '',
  rowsPerPage: 5
}

export default TasksTable; 