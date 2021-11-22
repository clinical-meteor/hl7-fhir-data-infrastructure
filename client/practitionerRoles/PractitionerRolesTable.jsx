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




function PractitionerRolesTable(props){
  logger.info('Rendering the PractitionerRolesTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.PractitionerRolesTable');
  logger.data('PractitionerRolesTable.props', {data: props}, {source: "PractitionerRolesTable.jsx"});

  const classes = useStyles();

  let { 
    children, 

    practitionerRoles,
    selectedPractitionerRoleId,

    query,
    paginationLimit,
    disablePagination,

    hideCheckbox,
    hideActionIcons,

    hideIdentifier,
    hidePractitioner,
    hideOrganization,
    hideCode,
    hideSpecialty,
    hideLocation,
    hideHealthcareService,
    hidePhone,
    hideEmail,
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
        hideCheckbox = true;
        hideActionIcons = true;
        hideBarcode = true;

        hideIdentifier = true;
        hidePractitioner = true;
        hideOrganization = true;
        hideCode = false;
        hideSpecialty = false;
        hideLocation = true;
        hideHealthcareService = true;
        hidePhone = true;
        hideEmail = true;
        hideNumEndpoints = false;    
        break;
      case "tablet":
        hideCheckbox = true;
        hideActionIcons = true;
        hideBarcode = true;

        hideIdentifier = true;
        hidePractitioner = true;
        hideOrganization = true;
        hideCode = false;
        hideSpecialty = false;
        hideLocation = true;
        hideHealthcareService = true;
        hidePhone = true;
        hideEmail = true;
        hideNumEndpoints = false;
        break;
      case "web":
        hideCheckbox = true;
        hideActionIcons = true;
        hideBarcode = true;

        hideIdentifier = false;
        hidePractitioner = true;
        hideOrganization = true;
        hideCode = false;
        hideSpecialty = false;
        hideLocation = true;
        hideHealthcareService = true;
        hidePhone = true;
        hideEmail = true;
        hideNumEndpoints = false;
        break;
      case "desktop":
        hideCheckbox = true;
        hideActionIcons = true;
        hideBarcode = true;

        hideIdentifier = false;
        hidePractitioner = false;
        hideOrganization = false;
        hideCode = false;
        hideSpecialty = false;
        hideLocation = false;
        hideHealthcareService = false;
        hidePhone = true;
        hideEmail = true;
        hideNumEndpoints = false;
        break;
      case "videowall":
        hideCheckbox = false;
        hideActionIcons = true;
        hideBarcode = false;

        hideIdentifier = false;
        hidePractitioner = false;
        hideOrganization = false;
        hideCode = false;
        hideSpecialty = false;
        hideLocation = false;
        hideHealthcareService = false;
        hidePhone = false;
        hideEmail = false;
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
    console.log('Remove practitionerRole ', _id)
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
  function renderActionIcons(practitionerRole ){
    if (!hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ onMetaClick.bind(practitionerRole)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(practitionerRole._id)} />   */}
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

  function renderIdentifier(identifier){
    if (!hideIdentifier) {
      return (
        <TableCell className='identifier'>{ identifier }</TableCell>
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
  function renderPractitioner(practitioner){
    if (!hidePractitioner) {
      return (
        <TableCell className='practitioner'>{ practitioner }</TableCell>
      );
    }
  }
  function renderPractitionerHeader(){
    if (!hidePractitioner) {
      return (
        <TableCell className='practitioner'>Practitioner</TableCell>
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

  function renderLocation(location){
    if (!hideLocation) {
      return (
        <TableCell className='location'>{ location }</TableCell>
      );
    }
  }
  function renderLocationHeader(){
    if (!hideLocation) {
      return (
        <TableCell className='location'>Location</TableCell>
      );
    }
  }

  function renderHealthcareService(healthcareService){
    if (!hideHealthcareService) {
      return (
        <TableCell className='healthcareService'>{ healthcareService }</TableCell>
      );
    }
  }
  function renderHealthcareServiceHeader(){
    if (!hideHealthcareService) {
      return (
        <TableCell className='healthcareService'>Healthcare Service</TableCell>
      );
    }
  }
  function renderPhone(phone){
    if (!hidePhone) {
      return (
        <TableCell className='phone'>{ phone }</TableCell>
      );
    }
  }
  function renderPhoneHeader(){
    if (!hidePhone) {
      return (
        <TableCell className='phone'>Phone</TableCell>
      );
    }
  }
  function renderEmail(email){
    if (!hideEmail) {
      return (
        <TableCell className='email'>{ email }</TableCell>
      );
    }
  }
  function renderEmailHeader(){
    if (!hideEmail) {
      return (
        <TableCell className='email'>Email</TableCell>
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
  let practitionerRolesToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }


  if(practitionerRoles){
    if(practitionerRoles.length > 0){              
      practitionerRoles.forEach(function(practitionerRole){
        practitionerRolesToRender.push(FhirDehydrator.dehydratePractitionerRole(practitionerRole, internalDateFormat));
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer', 
    height: '52px'
  }

  if(practitionerRolesToRender.length === 0){
    console.log('No practitionerRoles to render');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < practitionerRolesToRender.length; i++) {

      let selected = false;
      if(practitionerRolesToRender[i].id === selectedPractitionerRoleId){
        selected = true;
      }
      if(get(practitionerRolesToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }

      tableRows.push(
        <TableRow 
          className="practitionerRoleRow" 
          key={i} 
          onClick={ handleRowClick.bind(this, practitionerRolesToRender[i]._id)} 
          hover={true} 
          style={{cursor: 'pointer', height: '52px'}} 
          selected={selected}
        >
          { renderCheckbox() }
          { renderActionIcons(practitionerRolesToRender[i]) }
          { renderStatus(practitionerRolesToRender[i].status) }
          { renderIdentifier(practitionerRolesToRender[i].identifier) }
          { renderPractitioner(practitionerRolesToRender[i].practitioner) }
          { renderOrganization(practitionerRolesToRender[i].organization) }
          { renderCode(practitionerRolesToRender[i].code) }
          { renderSpecialty(practitionerRolesToRender[i].specialty) }
          { renderLocation(practitionerRolesToRender[i].location) }
          { renderHealthcareService(practitionerRolesToRender[i].healthcareService) }
          { renderPhone(practitionerRolesToRender[i].phone) }
          { renderEmail(practitionerRolesToRender[i].email) }
          { renderNumEndpoints(practitionerRolesToRender[i].numEndpoints) }
          { renderBarcode(practitionerRolesToRender[i].id)}
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
            { renderIdentifierHeader() }
            { renderPractitionerHeader() }
            { renderOrganizationHeader() }
            { renderCodeHeader() }
            { renderSpecialtyHeader() }
            { renderLocationHeader() }
            { renderHealthcareServiceHeader() }
            { renderPhoneHeader() }
            { renderEmailHeader() }
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

PractitionerRolesTable.propTypes = {
  barcodes: PropTypes.bool,
  practitionerRoles: PropTypes.array,
  selectedPractitionerRoleId: PropTypes.string,

  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  showMinutes: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideBarcode: PropTypes.bool,

  hideIdentifier: PropTypes.bool,
  hidePractitioner: PropTypes.bool,
  hideOrganization: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideCode: PropTypes.bool,
  hideSpecialty: PropTypes.bool,
  hideLocation: PropTypes.bool,
  hideHealthcareService: PropTypes.bool,
  hidePhone: PropTypes.bool,
  hideEmail: PropTypes.bool,
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
PractitionerRolesTable.defaultProps = {
  hideCheckbox: true,
  hideActionIcons: true,
  hideBarcode: true,
  
  hideStatus: true,
  hideIdentifier: false,
  hidePractitioner: false,
  hideOrganization: false,
  hideCode: false,
  hideSpecialty: false,
  hideLocation: false,
  hideHealthcareService: false,
  hidePhone: false,
  hideEmail: false,
  hideNumEndpoints: false,

  checklist: true,
  selectedPractitionerRoleId: '',
  rowsPerPage: 5,
  tableRowSize: 'medium',
  actionButtonLabel: 'Export'
}

export default PractitionerRolesTable; 