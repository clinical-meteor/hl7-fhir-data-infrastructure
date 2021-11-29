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




function HealthcareServicesTable(props){
  logger.info('Rendering the HealthcareServicesTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.HealthcareServicesTable');
  logger.data('HealthcareServicesTable.props', {data: props}, {source: "HealthcareServicesTable.jsx"});

  const classes = useStyles();

  let { 
    children, 

    healthcareServices,
    selectedHealthcareServiceId,

    query,
    paginationLimit,
    disablePagination,

    hideCheckbox,
    hideActionIcons,

    hideCategory,
    hideType,
    hideSpecialty,
    hideName,
    hideLocationDisplay,
    hideProvidedBy,
    hideNumEndpoints,
  
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
        hideActionIcons = false;
        hideBarcode = true;
        hideCategory = false;
        hideType = false;
        hideSpecialty = false;
        hideName = false;
        hideProvidedBy = false;
        hideLocationDisplay = false;
        hideNumEndpoints = false;    
        break;
      case "tablet":
        hideActionIcons = false;
        hideBarcode = true;
        hideCategory = false;
        hideType = false;
        hideSpecialty = false;
        hideName = false;
        hideProvidedBy = false;
        hideLocationDisplay = false;
        hideNumEndpoints = false;
        break;
      case "web":
        hideActionIcons = false;
        hideBarcode = true;
        hideCategory = false;
        hideType = false;
        hideSpecialty = false;
        hideName = false;
        hideProvidedBy = false;
        hideLocationDisplay = false;
        hideNumEndpoints = false;
        break;
      case "desktop":
        hideActionIcons = false;
        hideBarcode = true;
        hideCategory = false;
        hideType = false;
        hideSpecialty = false;
        hideName = false;
        hideProvidedBy = false;
        hideLocationDisplay = false;
        hideNumEndpoints = false;
        break;
      case "videowall":
        hideActionIcons = false;
        hideBarcode = true;
        hideCategory = false;
        hideType = false;
        hideSpecialty = false;
        hideName = false;
        hideProvidedBy = false;
        hideLocationDisplay = false;
        hideNumEndpoints = false;
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
    console.log('Remove healthcareService ', _id)
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
  function renderActionIcons(healthcareService ){
    if (!hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ onMetaClick.bind(healthcareService)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(healthcareService._id)} />   */}
        </TableCell>
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
  function renderCategoryHeader(){
    if (!hideCategory) {
      return (
        <TableCell className='category'>Category</TableCell>
      );
    }
  }
  function renderType(type){
    if (!hideType) {
      return (
        <TableCell className='type'>{ type }</TableCell>
      );
    }
  }
  function renderTypeHeader(){
    if (!hideType) {
      return (
        <TableCell className='type'>Type</TableCell>
      );
    }
  }
  function renderSpecialty(specialty){
    if (!hideSpecialty) {
      return (
        <TableCell className='specialty'>{ specialty }</TableCell>
      );
    }
  }
  function renderSpecialtyHeader(){
    if (!hideSpecialty) {
      return (
        <TableCell className='specialty'>Specialty</TableCell>
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
  function renderLocation(location){
    if (!hideLocationDisplay) {
      return (
        <TableCell className='location'>{ location }</TableCell>
      );
    }
  }
  function renderLocationHeader(){
    if (!hideLocationDisplay) {
      return (
        <TableCell className='location'>Location</TableCell>
      );
    }
  }
  function renderNumEndpoints(numEndpoints){
    if (!hideNumEndpoints) {
      return (
        <TableCell className='numEndpoints'>{ numEndpoints }</TableCell>
      );
    }
  }
  function renderNumEndpointsHeader(){
    if (!hideNumEndpoints) {
      return (
        <TableCell className='numEndpoints'># Endpoints</TableCell>
      );
    }
  }
  function renderProvidedBy(providedBy){
    if (!hideProvidedBy) {
      return (
        <TableCell className='providedBy'>{ providedBy }</TableCell>
      );
    }
  }
  function renderProvidedByHeader(){
    if (!hideProvidedBy) {
      return (
        <TableCell className='providedBy'>Provided By</TableCell>
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
  let healthcareServicesToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }


  if(healthcareServices){
    if(healthcareServices.length > 0){              
      healthcareServices.forEach(function(healthcareService){
        healthcareServicesToRender.push(FhirDehydrator.dehydrateHealthcareService(healthcareService, internalDateFormat));
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer', 
    height: '55px'
  }

  if(healthcareServicesToRender.length === 0){
    console.log('No healthcareServices to render');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < healthcareServicesToRender.length; i++) {

      let selected = false;
      if(healthcareServicesToRender[i].id === selectedHealthcareServiceId){
        selected = true;
      }
      if(get(healthcareServicesToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }

      tableRows.push(
        <TableRow 
          className="healthcareServiceRow" 
          key={i} 
          onClick={ handleRowClick.bind(this, healthcareServicesToRender[i].id)} 
          hover={true} 
          style={rowStyle} 
          selected={selected}
        >
          { renderCheckbox() }
          { renderActionIcons(healthcareServicesToRender[i]) }
          { renderCategory(healthcareServicesToRender[i].category) }
          { renderType(healthcareServicesToRender[i].type) }
          { renderSpecialty(healthcareServicesToRender[i].specialty) }
          { renderName(healthcareServicesToRender[i].name) }
          { renderLocation(healthcareServicesToRender[i].locationDisplay) }
          { renderProvidedBy(healthcareServicesToRender[i].providedBy) }
          { renderNumEndpoints(healthcareServicesToRender[i].numEndpoints) }
          { renderBarcode(healthcareServicesToRender[i].id)}
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
            { renderCategoryHeader() }
            { renderTypeHeader() }
            { renderSpecialtyHeader() }
            { renderNameHeader() }
            { renderLocationHeader() }
            { renderProvidedByHeader() }
            { renderNumEndpointsHeader() }
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

HealthcareServicesTable.propTypes = {
  barcodes: PropTypes.bool,
  healthcareServices: PropTypes.array,
  selectedHealthcareServiceId: PropTypes.string,

  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  showMinutes: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideBarcode: PropTypes.bool,

  hideCategory: PropTypes.bool,
  hideType: PropTypes.bool,
  hideSpecialty: PropTypes.bool,
  hideName: PropTypes.bool,
  hideLocationDisplay: PropTypes.bool,
  hideProvidedBy: PropTypes.bool,
  hideNumEndpoints: PropTypes.bool,

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
HealthcareServicesTable.defaultProps = {
  hideCheckbox: true,
  hideActionIcons: true,
  hideBarcode: true,

  hideCategory: false,
  hideType: false,
  hideSpecialty: false,
  hideName: false,
  hideLocationDisplay: false,
  hideProvidedBy: false,
  hideNumEndpoints: false,

  checklist: true,
  selectedHealthcareServiceId: '',
  rowsPerPage: 5,
  tableRowSize: 'medium',
  actionButtonLabel: 'Export'
}

export default HealthcareServicesTable; 