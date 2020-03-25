
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Button,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  IconButton,
  FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPageIcon
} from '@material-ui/core';


import moment from 'moment'
import _ from 'lodash';
let get = _.get;
let set = _.set;

import { Icon } from 'react-icons-kit'
import { tag } from 'react-icons-kit/fa/tag'
import {iosTrashOutline} from 'react-icons-kit/ionicons/iosTrashOutline'

import FhirUtilities from '../../lib/FhirUtilities';

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


//===========================================================================
// FLATTENING / MAPPING

flattenProcedure = function(procedure, internalDateFormat){
  let result = {
    _id: '',
    id: '',
    meta: '',
    identifier: '',
    status: '',
    categoryDisplay: '',
    code: '',
    codeDisplay: '',
    subject: '',
    subjectReference: '',
    performerDisplay: '',
    performedStart: '',
    performedEnd: '',
    notesCount: '',
    bodySiteDisplay: ''
  };

  if(!internalDateFormat){
    internalDateFormat = "YYYY-MM-DD";
  }

  result._id =  get(procedure, 'id') ? get(procedure, 'id') : get(procedure, '_id');

  result.id = get(procedure, 'id', '');
  result.status = get(procedure, 'status', '');
  result.categoryDisplay = get(procedure, 'category.coding[0].display', '');
  result.identifier = get(procedure, 'identifier[0].value');
  result.code = get(procedure, 'code.coding[0].code');
  result.codeDisplay = get(procedure, 'code.coding[0].display');
  result.categoryDisplay = get(procedure, 'category.coding[0].display')    

  if(get(procedure, 'subject')){
    result.subject = get(procedure, 'subject.display', '');
    result.subjectReference = get(procedure, 'subject.reference', '');
  } else if(get(procedure, 'patient')){
    result.subject = get(procedure, 'patient.display', '');
    result.subjectReference = get(procedure, 'patient.reference', '');
  }

  result.performedStart = moment(get(procedure, 'performedDateTime')).format(internalDateFormat);      
  result.performerDisplay = moment(get(procedure, 'performer.display')).format(internalDateFormat);
  result.performerReference = get(procedure, 'performer.reference');
  result.bodySiteDisplay = get(procedure, 'bodySite.display');

  if(get(procedure, 'performedPeriod')){
    result.performedStart = moment(get(procedure, 'performedPeriod.start')).format(internalDateFormat);      
    result.performedEnd = moment(get(procedure, 'performedPeriod.end')).format(internalDateFormat);      
  }

  let notes = get(procedure, 'notes')
  if(notes && notes.length > 0){
    result.notesCount = notes.length;
  } else {
    result.notesCount = 0;
  }

  return result;
}


function ProceduresTable(props){
  logger.info('Rendering the ProceduresTable');
  logger.verbose('clinical:hl7-resource-encounter.client.ProceduresTable');
  logger.data('ProceduresTable.props', {data: props}, {source: "ProceduresTable.jsx"});

  const { 
    children, 

    data,
    procedures,
    query,
    paginationLimit,
    disablePagination,
  
    hideCheckboxes,
    hideIdentifier,
    hideActionIcons,
    hideCategory,
    hideStatus,
    hideSubject,
    hideSubjectReference,
    hidePerformedDate,
    hidePerformedDateEnd,
    hidePerformer,
    hideBodySite,
    hideNotes,
    hideCode,
    hideCodeDisplay,
    hideBarcode,
    filterEnteredInError,
  
    onCellClick,
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButtonClick,
    hideActionButton,
    actionButtonLabel,
  
    rowsPerPage,
    dateFormat,
    showMinutes,
    
    ...otherProps 
  } = props;

  const classes = useStyles();

  //---------------------------------------------------------------------
  // Pagination

  let rows = [];
  const [page, setPage] = useState(0);
  const [rowsPerPageToRender, setRowsPerPage] = useState(rowsPerPage);

  // if(props.rowsPerPage){
  //   // if we receive an override as a prop, render that many rows
  //   // best to use rowsPerPageToRender with disablePagination
  //   setRowsPerPage(props.rowsPerPage)
  // } else {
  //   // otherwise default to the user selection
  //   setRowsPerPage(props.rowsPerPage)
  // }

  let paginationCount = 101;
  if(props.count){
    paginationCount = props.count;
  } else {
    paginationCount = rows.length;
  }

  //---------------------------------------------------------------------
  // Helper Functions

  function rowClick(id){
    // logger.info('ProceduresTable.rowClick', id);

    // Session.set("selectedProcedureId", id);
    // Session.set('procedurePageTabIndex', 1);
    // Session.set('procedureDetailState', false);

    if(props && (typeof props.onRowClick === "function")){
      props.onRowClick(id);
    }
  }
  function renderActionIconsHeader(){
    if (!props.hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(procedure ){
    if (!props.hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          <Icon icon={tag} style={iconStyle} onClick={ handleMetaClick.bind(procedure)} />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={ removeRecord.bind(procedure._id)} />
        </TableCell>
      );
    }
  } 
  function handleMetaClick(_id){
    logger.info('Opening metadata for procedure: ' + _id)
    if(props.onMetaClick){
      props.onMetaClick(_id);
    }
  }
  function removeRecord(_id){
    logger.info('Remove procedure: ' + _id)
    if(props.onRemoveRecord){
      props.onRemoveRecord(_id);
    }
  }
  function handleActionButtonClick(id){
    if(typeof props.onActionButtonClick === "function"){
      props.onActionButtonClick(id);
    }
  }

  function renderBarcode(id){
    if (!props.hideBarcode) {
      return (
        <TableCell><span className="barcode helvetica">{id}</span></TableCell>
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
  function renderSubject(name, type){
    if (!props.hideSubject) {
      let result;
      if(props.multiline){
        result = <TableCell className='name'>
          { name }<br/>
          { type }        
        </TableCell>;
      } else {
        result = <TableCell className='name'>{ name }</TableCell>;
      }
      return (result);
    }
  }
  function renderSubjectHeader(){
    if (!props.hideSubject) {
      return (
        <TableCell className='name'>Subject</TableCell>
      );
    }
  }
  function renderSubjectReference(referenceString){
    if (!props.hideSubjectReference) {
      return (
        <TableCell className='patientReference' style={{maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis',  whiteSpace: 'nowrap'}}>
          { FhirUtilities.pluckReferenceId(referenceString) }
        </TableCell>
      );
    }
  }
  function renderSubjectReferenceHeader(){
    if (!props.hideSubjectReference) {
      return (
        <TableCell className='subjectReference'>Subject Reference</TableCell>
      );
    }
  }
  function renderStatus(valueString){
    if (!props.hideStatus) {
      return (
        <TableCell className='status'>{ valueString }</TableCell>
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
  function renderCategoryHeader(){
    if (!props.hideCategory) {
      return (
        <TableCell className='category'>Category</TableCell>
      );
    }
  }
  function renderCategory(category){
    if (!props.hideCategory) {
      return (
        <TableCell className='category'>{ category }</TableCell>
      );
    }
  }
  function renderToggleHeader(){
    if (!props.hideCheckboxes) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Toggle</TableCell>
      );
    }
  }
  function renderToggle(){
    if (!props.hideCheckboxes) {
      return (
        <TableCell className="toggle" style={{width: '60px'}}>
            {/* <Checkbox
              defaultChecked={true}
            /> */}
        </TableCell>
      );
    }
  }
  function renderPerformedStartHeader(){
    if (!props.hidePerformedDate) {
      return (
        <TableCell className='performedStart' style={{minWidth: '140px'}}>Performed</TableCell>
      );
    }
  }
  function renderPerformedStart(performedStart){
    if (!props.hidePerformedDate) {
      return (
        <TableCell className='performedStart' style={{minWidth: '140px'}}>{ performedStart }</TableCell>
      );
    }
  }
  function renderPerformedEndHeader(){
    if (!props.hidePerformedDateEnd) {
      return (
        <TableCell className='performedEnd' style={{minWidth: '140px'}}>End</TableCell>
      );
    }
  }
  function renderPerformedEnd(performedEnd){
    if (!props.hidePerformedDateEnd) {
      return (
        <TableCell className='performedEnd' style={{minWidth: '140px'}}>{ performedEnd }</TableCell>
      );
    }
  }
  function renderActionButtonHeader(){
    if (!props.hideActionButton) {
      return (
        <TableCell className='ActionButton' >Action</TableCell>
      );
    }
  }
  function renderActionButton(procedure){
    if (!props.hideActionButton) {
      return (
        <TableCell className='ActionButton' >
          <Button onClick={ handleActionButtonClick.bind(this, get(procedure, "id"))}>{ get(props, "actionButtonLabel", "") }</Button>
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
  function renderCodeHeader(){
    if (!props.hideCode) {
      return (
        <TableCell className='code'>Code</TableCell>
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
  function renderCodeDisplayHeader(){
    if (!props.hideCodeDisplay) {
      return (
        <TableCell className='codeDisplay'>Display</TableCell>
      );
    }
  }
  function renderCodeDisplay(text){
    if (!props.hideCodeDisplay) {
      return (
        <TableCell className='codeDisplay'>{ text }</TableCell>
      );  
    }
  }
  function renderNotes(notesCount){
    if (!props.hideNotes) {
      return (
        <TableCell className='notes'>{ notesCount }</TableCell>
      );
    }
  }
  function renderNotesHeader(){
    if (!props.hideNotes) {
      return (
        <TableCell className='notes'>Notes</TableCell>
      );
    }
  }
  function renderPerformer(text){
    if (!props.hidePerformer) {
      return (
        <TableCell className='performer'>{ text }</TableCell>
      );
    }
  }
  function renderPerformerHeader(){
    if (!props.hidePerformer) {
      return (
        <TableCell className='performer'>Performer</TableCell>
      );
    }
  }
  function renderBodySite(text){
    if (!props.hideBodySite) {
      return (
        <TableCell className='bodysite'>{ text }</TableCell>
      );
    }
  }
  function renderBodySiteHeader(){
    if (!props.hideBodySite) {
      return (
        <TableCell className='bodysite'>Body Site</TableCell>
      );
    }
  }


  let tableRows = [];
  let proceduresToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.dateFormat){
    internalDateFormat = props.dateFormat;
  }

  if(props.procedures){
    if(props.procedures.length > 0){     
      let count = 0;    
      props.procedures.forEach(function(procedure){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          proceduresToRender.push(flattenProcedure(procedure, internalDateFormat));
        }
        count++;
      });  
    }
  }

  if(proceduresToRender.length === 0){
    logger.trace('ProceduresTable:  No procedures to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < proceduresToRender.length; i++) {
      tableRows.push(
        <TableRow className="procedureRow" key={i} onClick={ rowClick.bind(this, proceduresToRender[i]._id)} style={{cursor: 'pointer'}} hover="true" >            
          { renderToggle() }
          { renderActionIcons(proceduresToRender[i]) }
          { renderIdentifier(proceduresToRender.identifier ) }
          { renderStatus(proceduresToRender[i].status)}
          { renderCategory(proceduresToRender[i].categoryDisplay)}
          { renderCode(proceduresToRender[i].code)}
          { renderCodeDisplay(proceduresToRender[i].codeDisplay)}          
          { renderSubject(proceduresToRender[i].subject)}
          { renderSubjectReference(proceduresToRender[i].subjectReference)}
          { renderPerformer(proceduresToRender[i].performerDisplay)}
          { renderBodySite()}
          { renderPerformedStart(proceduresToRender[i].performedStart)}
          { renderPerformedEnd(proceduresToRender[i].performedEnd)}
          { renderNotes(proceduresToRender[i].notesCount)}
          { renderBarcode(proceduresToRender[i]._id)}
          { renderActionButton(proceduresToRender[i]) }
        </TableRow>
      );    
    }
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

  return(
    <div>
      <Table id="proceduresTable" size="small" aria-label="a dense table" { ...otherProps } >
        <TableHead>
          <TableRow>
            { renderToggleHeader() }
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }
            { renderStatusHeader() }
            { renderCategoryHeader() }
            { renderCodeHeader() }
            { renderCodeDisplayHeader() }
            { renderSubjectHeader() }
            { renderSubjectReferenceHeader() }
            { renderPerformerHeader() }
            { renderBodySiteHeader() }
            { renderPerformedStartHeader() }
            { renderPerformedEndHeader() }
            { renderNotesHeader() }
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

ProceduresTable.propTypes = {
  data: PropTypes.array,
  procedures: PropTypes.array,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  hideCheckboxes: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideCategory: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideSubject: PropTypes.bool,
  hideSubjectReference: PropTypes.bool,
  hidePerformedDate: PropTypes.bool,
  hidePerformedDateEnd: PropTypes.bool,
  hidePerformer: PropTypes.bool,
  hideBodySite: PropTypes.bool,
  hideNotes: PropTypes.bool,
  hideCode: PropTypes.bool,
  hideCodeDisplay: PropTypes.bool,
  hideBarcode: PropTypes.bool,
  filterEnteredInError: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  hideActionButton: PropTypes.bool,
  actionButtonLabel: PropTypes.string,

  rowsPerPageToRender: PropTypes.number,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool
};
ProceduresTable.defaultProps = {
  rowsPerPage: 5
}

export default ProceduresTable;