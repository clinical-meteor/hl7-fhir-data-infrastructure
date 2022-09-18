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

Session.setDefault('selectedRestrictions', []);


//===========================================================================
// MAIN COMPONENT


function RestrictionsTable(props){
  logger.info('Rendering the RestrictionsTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.RestrictionsTable');
  logger.data('RestrictionsTable.props', {data: props}, {source: "RestrictionsTable.jsx"});

  // const classes = useStyles();

  let { 
    children, 
    id,
    data,

    restrictions,
    selectedRestrictionId,
    query,
    paginationLimit,
    disablePagination,

    hideCheckbox,
    hideActionIcons,

    hideStatus,
    hideProvision,
    hideScope,
    hideActor,

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

    ...otherProps 
  } = props;

  // ------------------------------------------------------------------------
  // Form Factors

  if(formFactorLayout){
    switch (formFactorLayout) {
      case "phone":
        hideCheckbox = true;
        hideBarcode = true;
        break;
      case "tablet":
        hideCheckbox = true;
        hideBarcode = true;
        break;
      case "web":
        hideCheckbox = true;
        break;
      case "desktop":
        hideCheckbox = true;
        break;
      case "videowall":
        hideCheckbox = false;
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
    console.log('Remove restriction ', _id)
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
  function renderActionIcons(restriction ){
    if (!hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ onMetaClick.bind(restriction)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(restriction._id)} />   */}
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

  function renderProvision(provision){
    if (!hideProvision) {
      return (
        <TableCell className='provision'>{ provision }</TableCell>
      );
    }
  }
  function renderProvisionHeader(){
    if (!hideProvision) {
      return (
        <TableCell className='provision'>Provision</TableCell>
      );
    }
  }

  function renderScope(scope){
    if (!hideScope) {
      return (
        <TableCell className='scope'>{ scope }</TableCell>
      );
    }
  }
  function renderScopeHeader(){
    if (!hideScope) {
      return (
        <TableCell className='scope'>Scope</TableCell>
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
  function renderActor(name){
    if (!hideActor) {
      return (
        <TableCell><span className="actor">{name}</span></TableCell>
      );
    }
  }
  function renderActorHeader(){
    if (!hideActor) {
      return (
        <TableCell>Actor</TableCell>
      );
    }
  }

  
  //---------------------------------------------------------------------
  // Table Rows



  let tableRows = [];
  let restrictionsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }


  if(restrictions){
    if(restrictions.length > 0){      
      let count = 0;            
      restrictions.forEach(function(restriction){
        if((count >= (page * rowsPerPage)) && (count < (page + 1) * rowsPerPage)){
          restrictionsToRender.push(FhirDehydrator.dehydrateConsent(restriction, internalDateFormat));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer', 
    height: '55px'
  }

  if(restrictionsToRender.length === 0){
    console.log('No restrictions to render');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < restrictionsToRender.length; i++) {

      let selected = false;
      if(restrictionsToRender[i].id === selectedRestrictionId){
        selected = true;
      }
      if(get(restrictionsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }

      tableRows.push(
        <TableRow 
          className="restrictionRow" 
          key={i} 
          onClick={ handleRowClick.bind(this, restrictionsToRender[i].id)} 
          hover={true} 
          style={{cursor: 'pointer', height: '52px'}} 
          selected={selected}
        >
          { renderCheckbox() }
          { renderActionIcons(restrictionsToRender[i]) }
          { renderStatus(restrictionsToRender[i].status) }
          { renderScope(restrictionsToRender[i].scope) }

          { renderProvision(restrictionsToRender[i].provisionType) }
          { renderActor(restrictionsToRender[i].provisionActor) }

          { renderBarcode(restrictionsToRender[i]._id)}
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
            { renderScopeHeader() }

            { renderProvisionHeader() }
            { renderActorHeader() }

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

RestrictionsTable.propTypes = {
  barcodes: PropTypes.bool,
  restrictions: PropTypes.array,
  selectedRestrictionId: PropTypes.string,

  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  showMinutes: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideBarcode: PropTypes.bool,
  
  hideStatus: PropTypes.bool,
  hideProvision: PropTypes.bool,
  hideScope: PropTypes.bool,
  hideActor: PropTypes.bool,

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
  checklist: PropTypes.bool
};
RestrictionsTable.defaultProps = {
  hideCheckbox: true,
  hideActionIcons: true,
  hideBarcode: false,

  hideStatus: false,
  hideProvision: false,
  hideScope: false,
  hideActor: false,

  checklist: true,
  selectedRestrictionId: '',
  multiline: false,
  page: 0,
  rowsPerPage: 5,
  tableRowSize: 'medium',
  actionButtonLabel: 'Export'
}

export default RestrictionsTable; 