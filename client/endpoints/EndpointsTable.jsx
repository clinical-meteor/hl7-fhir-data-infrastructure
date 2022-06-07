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
  TablePagination
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

Session.setDefault('selectedEndpoints', []);


//===========================================================================
// MAIN COMPONENT


function EndpointsTable(props){
  logger.info('Rendering the EndpointsTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.EndpointsTable');
  logger.data('EndpointsTable.props', {data: props}, {source: "EndpointsTable.jsx"});

  const classes = useStyles();

  let { 
    children, 
    id,

    data,
    endpoints,
    selectedEndpointId,
    query,
    paginationLimit,
    disablePagination,

    hideCheckbox,
    hideActionIcons,
    hideStatus,
    hideConnectionType,
    hideName,
    hideVersion,
    hideOrganization,
    hideAddress,
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
    displayEnteredInError, 

    checklist,

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
        hideActionIcons = false;
        hideStatus = false;
        hideConnectionType = false;
        hideName = false;
        hideOrganization = false;
        hideAddress = false;
        break;
      case "tablet":
        hideActionIcons = false;
        hideStatus = false;
        hideConnectionType = false;
        hideName = false;
        hideOrganization = false;
        hideAddress = false;
        break;
      case "web":
        hideActionIcons = false;
        hideStatus = false;
        hideConnectionType = false;
        hideName = false;
        hideOrganization = false;
        hideAddress = false;
        break;
      case "desktop":
        hideActionIcons = false;
        hideStatus = false;
        hideConnectionType = false;
        hideName = false;
        hideOrganization = false;
        hideAddress = false;
        break;
      case "videowall":
        hideActionIcons = false;
        hideStatus = false;
        hideConnectionType = false;
        hideName = false;
        hideOrganization = false;
        hideAddress = false;
        break;            
    }
  }

    // ------------------------------------------------------------------------
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
        style={{float: 'right', border: 'none', userSelect: 'none'}}
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
    console.log('Remove endpoint ', _id)
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
  function renderActionIcons(endpoint ){
    if (!hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ onMetaClick.bind(endpoint)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(endpoint._id)} />   */}
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

  function renderConnectionType(connectionType){
    if (!hideConnectionType) {
      return (
        <TableCell className='connectionType'>{ connectionType }</TableCell>
      );
    }
  }
  function renderConnectionTypeHeader(){
    if (!hideConnectionType) {
      return (
        <TableCell className='connectionType'>Connection Type</TableCell>
      );
    }
  }
  function renderOrganization(organization){
    if (!hideOrganization) {
      return (
        <TableCell className='organization'>{ organization }</TableCell>
      );
    }
  }
  function renderOrganizationHeader(){
    if (!hideOrganization) {
      return (
        <TableCell className='organization'>Organization</TableCell>
      );
    }
  }
  function renderAddress(address){
    if (!hideAddress) {
      return (
        <TableCell className='address'>{ address }</TableCell>
      );
    }
  }
  function renderAddressHeader(){
    if (!hideAddress) {
      return (
        <TableCell className='address'>Address</TableCell>
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

  // //---------------------------------------------------------------------
  // // Pagination

  // let rows = [];
  // // const [page, setPage] = useState(0);
  // const [rowsPerPageToRender, setRowsPerPage] = useState(rowsPerPage);


  // let paginationCount = 101;
  // if(count){
  //   paginationCount = count;
  // } else {
  //   paginationCount = rows.length;
  // }


  // function handleChangePage(event, newPage){
  //   if(typeof onSetPage === "function"){
  //     onSetPage(newPage);
  //   }
  // }

  // let paginationFooter;
  // if(!disablePagination){
  //   paginationFooter = <TablePagination
  //     component="div"
  //     // rowsPerPageOptions={[5, 10, 25, 100]}
  //     rowsPerPageOptions={['']}
  //     colSpan={3}
  //     count={paginationCount}
  //     rowsPerPage={rowsPerPageToRender}
  //     page={page}
  //     onChangePage={handleChangePage}
  //     style={{float: 'right', border: 'none'}}
  //   />
  // }
  
  
  //---------------------------------------------------------------------
  // Table Rows



  let tableRows = [];
  let endpointsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }


  if(endpoints){
    if(endpoints.length > 0){              
      let count = 0;

      endpoints.forEach(function(endpoint){
        if((count >= (page * rowsPerPage)) && (count < (page + 1) * rowsPerPage)){
          endpointsToRender.push(FhirDehydrator.dehydrateEndpoint(endpoint, internalDateFormat));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer', 
    height: '55px'
  }

  if(endpointsToRender.length === 0){
    console.log('EndpointsTable:  No endpoints to render');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < endpointsToRender.length; i++) {

      let selected = false;
      if(get(endpointsToRender[i], 'id') === selectedEndpointId){
        selected = true;
      }
      if(get(endpointsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }

      tableRows.push(
        <TableRow 
          className="endpointRow" 
          key={i} 
          onClick={ handleRowClick.bind(this, endpointsToRender[i].id)} 
          hover={true} 
          style={rowStyle} 
          selected={selected}
        >
          { renderCheckbox(endpointsToRender[i]) }
          { renderActionIcons(endpointsToRender[i]) }

          { renderStatus(endpointsToRender[i].status) }
          { renderConnectionType(endpointsToRender[i].connectionType) }
          { renderVersion(endpointsToRender[i].version) }
          { renderName(endpointsToRender[i].name) }
          { renderOrganization(endpointsToRender[i].managingOrganization) }
          { renderAddress(endpointsToRender[i].address) }

          { renderBarcode(endpointsToRender[i].id)}
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
            { renderConnectionTypeHeader() }
            { renderVersionHeader() }
            { renderNameHeader() }
            { renderOrganizationHeader() }
            { renderAddressHeader() }
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

EndpointsTable.propTypes = {
  barcodes: PropTypes.bool,
  endpoints: PropTypes.array,
  selectedEndpointId: PropTypes.string,

  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  showMinutes: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideBarcode: PropTypes.bool,

  hideStatus: PropTypes.bool,
  hideConnectionType: PropTypes.bool,
  hideVersion: PropTypes.bool,
  hideName: PropTypes.bool,
  hideOrganization: PropTypes.bool,
  hideAddress: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onSetPage: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  onSetPage: PropTypes.func,

  page: PropTypes.number,
  actionButtonLabel: PropTypes.string,
  tableRowSize: PropTypes.string,

  formFactorLayout: PropTypes.string,
  rowsPerPage: PropTypes.number,
  tableRowSize: PropTypes.string,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,
  size: PropTypes.string,

  page: PropTypes.number,
  count: PropTypes.number,
  multiline: PropTypes.bool
};
EndpointsTable.defaultProps = {
  hideCheckbox: true,
  hideActionIcons: true,
  hideBarcode: true,

  hideStatus: false,
  hideConnectionType: false,
  hideVersion: false,
  hideName: false,
  hideOrganization: false,
  hideAddress: false,

  checklist: true,
  selectedEndpointId: '',
  page: 0,
  rowsPerPage: 5,
  tableRowSize: 'medium',
  actionButtonLabel: 'Export'
}

export default EndpointsTable; 