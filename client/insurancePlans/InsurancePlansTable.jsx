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

Session.setDefault('selectedInsurancePlans', []);



function InsurancePlansTable(props){
  // logger.info('Rendering the InsurancePlansTable');
  // logger.verbose('clinical:hl7-fhir-data-infrastructure.client.InsurancePlansTable');
  // logger.data('InsurancePlansTable.props', {data: props}, {source: "InsurancePlansTable.jsx"});

  console.info('Rendering the InsurancePlansTable');
  console.debug('clinical:hl7-fhir-data-infrastructure.client.InsurancePlansTable');
  // console.data('InsurancePlansTable.props', {data: props}, {source: "InsurancePlansTable.jsx"});

  const classes = useStyles();

  let { 
    children, 
    id,

    data,
    insurancePlans,
    selectedInsurancePlanId,
    query,
    paginationLimit,
    disablePagination,

    hideCheckbox,
    hideActionIcons,
    hideStatus,
    hideType,
    hideName,
    hideAlias,
    hideOwnedBy,
    hideAdministeredBy,
    hideCoverageArea,
    hideCoverageType,
    hideCoverageBenefitType,
    hideNumEndpoints,
    hideFhirId,
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

    page,
    onSetPage,

    checklist,
    count,
    multiline,

    ...otherProps 
  } = props;

  // ------------------------------------------------------------------------
  // Form Factors

  if(formFactorLayout){
    switch (formFactorLayout) {
      case "phone":
        hideActionIcons = true;
        // hideBarcode = true;
        hideStatus = false;
        hideType = false;
        hideName = false;
        hideAlias = true;
        hideOwnedBy = false;
        hideAdministeredBy = false;
        hideCoverageArea = false;
        hideCoverageType = true;
        hideCoverageBenefitType = true;    
        hideNumEndpoints = false;
        break;
      case "tablet":
        hideActionIcons = true;
        // hideBarcode = true;
        hideStatus = false;
        hideType = false;
        hideName = false;
        hideAlias = true;
        hideOwnedBy = false;
        hideAdministeredBy = false;
        hideCoverageArea = false;
        hideCoverageType = true;
        hideCoverageBenefitType = true;
        hideNumEndpoints = false;
        break;
      case "web":
        hideActionIcons = false;
        // hideBarcode = true;
        hideStatus = false;
        hideType = false;
        hideName = false;
        hideAlias = true;
        hideOwnedBy = false;
        hideAdministeredBy = false;
        hideCoverageArea = false;
        hideCoverageType = true;
        hideCoverageBenefitType = true;
        hideNumEndpoints = false;
        break;
      case "desktop":
        hideActionIcons = true;
        // hideBarcode = true;
        hideStatus = false;
        hideType = false;
        hideName = false;
        hideAlias = true;
        hideOwnedBy = false;
        hideAdministeredBy = false;
        hideCoverageArea = false;
        hideCoverageType = false;
        hideCoverageBenefitType = true;
        hideNumEndpoints = false;
        break;
      case "videowall":
        hideActionIcons = true;
        // hideBarcode = true;
        hideStatus = false;
        hideType = false;
        hideName = false;
        hideAlias = false;
        hideOwnedBy = false;
        hideAdministeredBy = false;
        hideCoverageArea = false;
        hideCoverageType = false;
        hideCoverageBenefitType = false;
        hideNumEndpoints = false;
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
    console.log('Remove insurancePlan ', _id)
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

  function renderFhirId(fhirId){
    if (!hideFhirId) {
      return (
        <TableCell className='fhirId'>{ fhirId }</TableCell>
      );
    }
  }
  function renderFhirIdHeader(){
    if (!hideFhirId) {
      return (
        <TableCell className='fhirId'>FHIR ID</TableCell>
      );
    }
  }
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
  function renderActionIcons(insurancePlan ){
    if (!hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ onMetaClick.bind(insurancePlan)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(insurancePlan._id)} />   */}
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

  function renderAlias(alias){
    if (!hideAlias) {
      return (
        <TableCell className='alias'>{ alias }</TableCell>
      );
    }
  }
  function renderAliasHeader(){
    if (!hideAlias) {
      return (
        <TableCell className='alias'>Alias</TableCell>
      );
    }
  }
  function renderOwnedBy(ownedBy){
    if (!hideOwnedBy) {
      return (
        <TableCell className='ownedBy'>{ ownedBy }</TableCell>
      );
    }
  }
  function renderOwnedByHeader(){
    if (!hideOwnedBy) {
      return (
        <TableCell className='ownedBy'>Owned By</TableCell>
      );
    }
  }
  function renderAdministeredBy(administeredBy){
    if (!hideAdministeredBy) {
      return (
        <TableCell className='administeredBy'>{ administeredBy }</TableCell>
      );
    }
  }
  function renderAdministeredByHeader(){
    if (!hideAdministeredBy) {
      return (
        <TableCell className='administeredBy'>Administered By</TableCell>
      );
    }
  }
  function renderCoverageArea(coverageArea){
    if (!hideCoverageArea) {
      return (
        <TableCell className='coverageArea'>{ coverageArea }</TableCell>
      );
    }
  }
  function renderCoverageAreaHeader(){
    if (!hideCoverageArea) {
      return (
        <TableCell className='coverageArea'>Coverage Area</TableCell>
      );
    }
  }
  function renderCoverageType(coverageType){
    if (!hideCoverageType) {
      return (
        <TableCell className='coverageType'>{ coverageType }</TableCell>
      );
    }
  }
  function renderCoverageTypeHeader(){
    if (!hideCoverageType) {
      return (
        <TableCell className='coverageType'>Coverage Type</TableCell>
      );
    }
  }
  function renderCoverageBenefitType(coverageBenefit){
    if (!hideCoverageBenefitType) {
      return (
        <TableCell className='coverageBenefit'>{ coverageBenefit }</TableCell>
      );
    }
  }
  function renderCoverageBenefitTypeHeader(){
    if (!hideCoverageBenefitType) {
      return (
        <TableCell className='coverageBenefit'>Coverage Benefit</TableCell>
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

  // let rows = [];
  // const [page, setPage] = useState(0);
  // const [rowsPerPageToRender, setRowsPerPage] = useState(rowsPerPage);


  // let paginationCount = 101;
  // if(count){
  //   paginationCount = count;
  // } else {
  //   paginationCount = rows.length;
  // }

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

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
  let insurancePlansToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }


  if(insurancePlans){
    if(insurancePlans.length > 0){       
      let count = 0;           
      insurancePlans.forEach(function(insurancePlan){
        if((count >= (page * rowsPerPage)) && (count < (page + 1) * rowsPerPage)){
          insurancePlansToRender.push(FhirDehydrator.dehydrateInsurancePlan(insurancePlan, internalDateFormat));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer', 
    height: '55px'
  }

  if(insurancePlansToRender.length === 0){
    console.log('No insurancePlans to render');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < insurancePlansToRender.length; i++) {

      let selected = false;
      if(insurancePlansToRender[i].id === selectedInsurancePlanId){
        selected = true;
      }
      if(get(insurancePlansToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }

      tableRows.push(
        <TableRow 
          className="insurancePlanRow" 
          key={i} 
          onClick={ handleRowClick.bind(this, insurancePlansToRender[i].id)} 
          hover={true} 
          style={rowStyle} 
          selected={selected}
        >
          { renderCheckbox() }
          { renderActionIcons(insurancePlansToRender[i]) }
          { renderStatus(insurancePlansToRender[i].status) }
          { renderFhirId(insurancePlansToRender[i].id) }
          { renderType(insurancePlansToRender[i].type) }
          { renderName(insurancePlansToRender[i].name) }
          { renderAlias(insurancePlansToRender[i].alias) }
          { renderOwnedBy(insurancePlansToRender[i].ownedBy) }
          { renderAdministeredBy(insurancePlansToRender[i].administeredBy) }
          { renderCoverageArea(insurancePlansToRender[i].coverageArea) }
          { renderCoverageType(insurancePlansToRender[i].coverageType) }
          { renderCoverageBenefitType(insurancePlansToRender[i].coverageBenefitType) }

          { renderBarcode(insurancePlansToRender[i].id)}
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
            { renderFhirIdHeader() }
            { renderTypeHeader() }
            { renderNameHeader() }
            { renderAliasHeader() }
            { renderOwnedByHeader() }
            { renderAdministeredByHeader() }
            { renderCoverageAreaHeader() }
            { renderCoverageTypeHeader() }
            { renderCoverageBenefitTypeHeader() }
            
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

InsurancePlansTable.propTypes = {
  barcodes: PropTypes.bool,
  insurancePlans: PropTypes.array,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,
  selectedInsurancePlanId: PropTypes.string,


  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideBarcode: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideType: PropTypes.bool,
  hideName: PropTypes.bool,
  hideAlias: PropTypes.bool,
  hideOwnedBy: PropTypes.bool,
  hideAdministeredBy: PropTypes.bool,
  hideCoverageArea: PropTypes.bool,
  hideCoverageType: PropTypes.bool,
  hideCoverageBenefitType: PropTypes.bool,
  hideNumEndpoints: PropTypes.bool,
  hideFhirId: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  onSetPage: PropTypes.func,

  page: PropTypes.number,
  actionButtonLabel: PropTypes.string,
  hideExtensions: PropTypes.bool,

  rowsPerPage: PropTypes.number,
  tableRowSize: PropTypes.string,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,
  size: PropTypes.string,

  page: PropTypes.number,
  count: PropTypes.number,
  multiline: PropTypes.bool,

  formFactorLayout: PropTypes.string,
  checklist: PropTypes.bool
};
InsurancePlansTable.defaultProps = {
  hideCheckbox: true,
  hideActionIcons: true,
  hideBarcode: true,
  hideStatus: false,
  hideType: false,
  hideName: false,
  hideAlias: false,
  hideOwnedBy: false,
  hideAdministeredBy: false,
  hideCoverageArea: false,
  hideCoverageType: false,
  hideCoverageBenefitType: false,
  hideNumEndpoints: false,
  hideFhirId: true,

  checklist: true,
  selectedInsurancePlanId: '',
  multiline: false,
  page: 0,
  rowsPerPage: 5,
  tableRowSize: 'medium',
  actionButtonLabel: 'Export'
}

export default InsurancePlansTable; 