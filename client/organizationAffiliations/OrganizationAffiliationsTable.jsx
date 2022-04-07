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


//===========================================================================
// SESSION VARIABLES

Session.setDefault('selectedAffiliationss', []);




function OrganizationAffiliationsTable(props){
  logger.info('Rendering the OrganizationAffiliationsTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.OrganizationAffiliationsTable');
  logger.data('OrganizationAffiliationsTable.props', {data: props}, {source: "OrganizationAffiliationsTable.jsx"});

  const classes = useStyles();

  let { 
    children, 
    id,

    data,
    organizationAffiliations,
    selectedOrganizationAffiliationId,
    query,
    paginationLimit,
    disablePagination,

    hideCheckbox,
    hideActionIcons,

    hideActive,
    hidePeriodStart,
    hidePeriodEnd,
    hideOrganization,
    hideParticipatingOrganization,
    hideNetwork,
    hideCode,
    hideSpecialty,
    hideLocation,
    hideHealthcareService,
    hideEmail,
    hidePhone,
    hideNumEndpoints,

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
        hideStatus = true;
        hideBarcode = true;
        hideActive = true;
        hidePeriodStart = true;
        hidePeriodEnd = true;
        hideOrganization = false;
        hideParticipatingOrganization = true;
        hideNetwork = false;
        hideCode = false;
        hideSpecialty = false;
        hideLocation = false;
        hideHealthcareService = false;
        hideEmail = true;
        hidePhone = true;
        hideNumEndpointse = true;
    
        break;
      case "tablet":
        hideStatus = true;
        hideBarcode = true;
        hideActive = true;
        hidePeriodStart = true;
        hidePeriodEnd = true;
        hideOrganization = false;
        hideParticipatingOrganization = true;
        hideNetwork = false;
        hideCode = false;
        hideSpecialty = false;
        hideLocation = false;
        hideHealthcareService = false;
        hideEmail = true;
        hidePhone = true;
        hideNumEndpointse = true;
        break;
      case "web":
        hideStatus = true;
        hideBarcode = true;
        hideActive = true;
        hidePeriodStart = true;
        hidePeriodEnd = true;
        hideOrganization = false;
        hideParticipatingOrganization = true;
        hideNetwork = false;
        hideCode = false;
        hideSpecialty = false;
        hideLocation = false;
        hideHealthcareService = false;
        hideEmail = true;
        hidePhone = true;
        hideNumEndpointse = true;
        break;
      case "desktop":
        hideStatus = true;
        hideBarcode = true;
        hideActive = true;
        hidePeriodStart = true;
        hidePeriodEnd = true;
        hideOrganization = false;
        hideParticipatingOrganization = true;
        hideNetwork = false;
        hideCode = false;
        hideSpecialty = false;
        hideLocation = false;
        hideHealthcareService = false;
        hideEmail = true;
        hidePhone = true;
        hideNumEndpointse = true;
        break;
      case "videowall":
        hideStatus = true;
        hideBarcode = true;
        hideActive = true;
        hidePeriodStart = true;
        hidePeriodEnd = true;
        hideOrganization = false;
        hideParticipatingOrganization = true;
        hideNetwork = false;
        hideCode = false;
        hideSpecialty = false;
        hideLocation = false;
        hideHealthcareService = false;
        hideEmail = true;
        hidePhone = true;
        hideNumEndpointse = true;
        break;            
    }
  }


  // //---------------------------------------------------------------------
  // // Pagination

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
    console.log('Remove organizationAffiliation ', _id)
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
  function renderActionIcons(organizationAffiliation ){
    if (!hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ onMetaClick.bind(organizationAffiliation)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(organizationAffiliation._id)} />   */}
        </TableCell>
      );
    }
  } 

  function renderActive(active){
    if (!hideActive) {
      return (
        <TableCell className='active'>{ active }</TableCell>
      );
    }
  }
  function renderActiveHeader(){
    if (!hideActive) {
      return (
        <TableCell className='active'>Active</TableCell>
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
        <TableCell className="identifier">{ identifier }</TableCell>
      );
    }
  }
  function renderIdentifierHeader(){
    if (!hideIdentifier) {
      return (
        <TableCell className="identifier">Identifier</TableCell>
      );
    }
  }
  function renderNetwork(network){
    if (!hideNetwork) {
      return (
        <TableCell className='network'>{ network }</TableCell>
      );
    }
  }
  function renderNetworkHeader(){
    if (!hideNetwork) {
      return (
        <TableCell className='network'>Network</TableCell>
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
  function renderParticipatingOrganization(participatingOrg){
    if (!hideParticipatingOrganization) {
      return (
        <TableCell className='participatingOrg'>{ participatingOrg }</TableCell>
      );
    }
  }
  function renderParticipatingOrganizationHeader(){
    if (!hideParticipatingOrganization) {
      return (
        <TableCell className='participatingOrg'>Participating Org</TableCell>
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

  // //---------------------------------------------------------------------
  // // Pagination

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
  let organizationAffiliationsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }


  if(organizationAffiliations){
    if(organizationAffiliations.length > 0){ 
      let count = 0;    

             
      organizationAffiliations.forEach(function(organizationAffiliation){
        if((count >= (page * rowsPerPage)) && (count < (page + 1) * rowsPerPage)){
          organizationAffiliationsToRender.push(FhirDehydrator.dehydrateOrganizationAffiliation(organizationAffiliation, internalDateFormat));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer', 
    height: '55px'
  }

  if(organizationAffiliationsToRender.length === 0){
    console.log('No organizationAffiliations to render');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < organizationAffiliationsToRender.length; i++) {

      let selected = false;
      if(organizationAffiliationsToRender[i].id === selectedOrganizationAffiliationId){
        selected = true;
      }
      if(get(organizationAffiliationsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }

      tableRows.push(
        <TableRow 
          className="organizationAffiliationRow" 
          key={i} 
          onClick={ handleRowClick.bind(this, organizationAffiliationsToRender[i].id)} 
          hover={true} 
          style={rowStyle} 
          selected={selected}
        >
          { renderCheckbox() }
          { renderActionIcons(organizationAffiliationsToRender[i]) }
          { renderStatus(organizationAffiliationsToRender[i].status) }

          {/* { renderPeriodStart(organizationAffiliationsToRender[i].periodStart) }
          { renderPeriodEnd(organizationAffiliationsToRender[i].periodEnd) } */}

          { renderActive(organizationAffiliationsToRender[i].active) }
          { renderOrganization(organizationAffiliationsToRender[i].organization) }
          { renderParticipatingOrganization(organizationAffiliationsToRender[i].participatingOrganization) }
          { renderNetwork(organizationAffiliationsToRender[i].network) }
          { renderCode(organizationAffiliationsToRender[i].code) }
          { renderSpecialty(organizationAffiliationsToRender[i].specialty) }
          { renderLocation(organizationAffiliationsToRender[i].location) }
          { renderHealthcareService(organizationAffiliationsToRender[i].healthcareService) }
          { renderEmail(organizationAffiliationsToRender[i].email) }
          { renderPhone(organizationAffiliationsToRender[i].phone) }
          { renderNumEndpoints(organizationAffiliationsToRender[i].numEndpoints) }

          { renderBarcode(organizationAffiliationsToRender[i].id)}
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
            { renderActiveHeader() }
            { renderOrganizationHeader() }
            { renderParticipatingOrganizationHeader() }
            { renderNetworkHeader() }
            { renderCodeHeader() }
            { renderSpecialtyHeader() }
            { renderLocationHeader() }
            { renderHealthcareServiceHeader() }
            { renderEmailHeader() }
            { renderPhoneHeader() }
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

OrganizationAffiliationsTable.propTypes = {
  barcodes: PropTypes.bool,
  organizationAffiliations: PropTypes.array,
  selectedOrganizationAffiliationId: PropTypes.string,

  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  showMinutes: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideBarcode: PropTypes.bool,

  hideActive: PropTypes.bool,
  hidePeriodStart: PropTypes.bool,
  hidePeriodEnd: PropTypes.bool,
  hideOrganization: PropTypes.bool,
  hideParticipatingOrganization: PropTypes.bool,
  hideNetwork: PropTypes.bool,
  hideCode: PropTypes.bool,
  hideSpecialty: PropTypes.bool,
  hideLocation: PropTypes.bool,
  hideHealthcareService: PropTypes.bool,
  hideEmail: PropTypes.bool,
  hidePhone: PropTypes.bool,
  hideNumEndpoints: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,
  tableRowSize: PropTypes.string,

  formFactorLayout: PropTypes.string,
  checklist: PropTypes.bool,

  size: PropTypes.string,
  
  page: PropTypes.number,
  count: PropTypes.number,
  multiline: PropTypes.bool,
};
OrganizationAffiliationsTable.defaultProps = {
  hideCheckbox: true,
  hideActionIcons: true,
  hideBarcode: true,

  hideActive: false,
  hidePeriodStart: false,
  hidePeriodEnd: false,
  hideOrganization: false,
  hideParticipatingOrganization: false,
  hideNetwork: false,
  hideCode: false,
  hideSpecialty: false,
  hideLocation: false,
  hideHealthcareService: false,
  hideEmail: false,
  hidePhone: false,
  hideNumEndpoints: false,

  checklist: true,
  selectedOrganizationAffiliationId: '',
  page: 0,
  rowsPerPage: 5,
  tableRowSize: 'medium',
  actionButtonLabel: 'Export'
}

export default OrganizationAffiliationsTable; 