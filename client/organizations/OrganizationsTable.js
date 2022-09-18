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
  TablePagination,
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

Session.setDefault('selectedOrganizations', []);


//===========================================================================
// MAIN COMPONENT


function OrganizationsTable(props){
  logger.info('Rendering the OrganizationsTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.OrganizationsTable');
  logger.data('OrganizationsTable.props', {data: props}, {source: "OrganizationsTable.jsx"});

  const classes = useStyles();

  let { 
    children, 
    id,

    data,
    organizations,
    selectedOrganizationId,
    query,
    paginationLimit,
    disablePagination,
  
    hideCheckbox,
    hideActionIcons,
    hideIdentifier,
    hideName,
    hidePhone,
    hideEmail,
    hideAddressLine,
    hideCity,
    hideState,
    hidePostalCode,
    hideFhirId,
  
    onCellClick,
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButton,
    hideActionButton,
    hideBarcode,
    actionButtonLabel,
    hideExtensions,
    hideNumEndpoints,
  
    onActionButtonClick,
    showActionButton,

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

    hasRestrictions,
    primaryColor,

    ...otherProps 
  } = props;

  // ------------------------------------------------------------------------
  // Form Factors

  if(formFactorLayout){
    // logger.verbose('formFactorLayout', formFactorLayout + ' ' + window.innerWidth);
    switch (formFactorLayout) {
      case "phone":
        hideActionIcons = true;
        hideIdentifier = true;
        hideName = false;
        hidePhone = true;
        hideEmail = true;
        hideAddressLine = true;
        hideCity = true;
        hideState = true;
        hidePostalCode = true;
        hideBarcode = true;
        multiline = true;
        break;
      case "tablet":
        hideActionIcons = true;
        hideIdentifier = true;
        hideName = false;
        hidePhone = true;
        hideEmail = true;
        hideAddressLine = true;
        hideCity = false;
        hideState = false;
        hidePostalCode = false;
        hideBarcode = true;
        break;
      case "web":
        hideActionIcons = true;
        hideIdentifier = true;
        hideName = false;
        hidePhone = true;
        hideEmail = true;
        hideAddressLine = false;
        hideCity = false;
        hideState = false;
        hidePostalCode = false;
        hideBarcode = true;
        break;
      case "desktop":
        hideActionIcons = true;
        hideIdentifier = false;
        hideName = false;
        hidePhone = false;
        hideEmail = true;
        hideAddressLine = false;
        hideCity = false;
        hideState = false;
        hidePostalCode = false;
        hideBarcode = true;
        break;
      case "videowall":
        hideActionIcons = true;
        hideIdentifier = false;
        hideName = false;
        hidePhone = false;
        hideEmail = false;
        hideAddressLine = false;
        hideCity = false;
        hideState = false;
        hidePostalCode = false;
        hideBarcode = false;
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
        style={{float: 'right', border: 'none', userSelect: 'none'}}
      />
    }


  //---------------------------------------------------------------------
  // Helper Methods  


  function removeRecord(_id){
    console.log('removeRecord')
  }
  function handleRowClick(id){
    console.log('handleRowClick')
    if(typeof onRowClick === "function"){
      onRowClick(id);
    }
  }
  function handleActionButtonClick(){
    console.log('handleActionButtonClick')
  }



  //---------------------------------------------------------------------
  // Dynamic Styling

  let restrictionStyle = {};

  restrictionStyle.backgroundColor = "#ffffff";
  restrictionStyle.opacity = 0.8;
  restrictionStyle.backgroundSize = "18px 18px";
  restrictionStyle.backgroundImage = "radial-gradient(" + primaryColor + " 1.5px, rgba(0, 0, 0, 0) 1.5px)"



  //---------------------------------------------------------------------
  // Column Rendering

  function renderCheckboxHeader(){
    if (!hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Checkbox</TableCell>
      );
    }
  }
  function renderCheckbox(patientId ){
    if (!hideCheckbox) {
      return (
        <TableCell className="toggle">
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
        <TableCell className='actionIcons'>Actions</TableCell>
      );
    }
  }
  function renderActionIcons( organization ){
    if (!hideActionIcons) {

      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{width: '120px'}}>
          {/* <Icon icon={tag} style={iconStyle} onClick={showSecurityDialog.bind(this, organization)} />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={removeRecord.bind(this, organization._id)} /> */}
        </TableCell>
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
  function renderExtensions(extensions){
    if (!hideExtensions) {
      return (
        <TableCell className="extensions">{ extensions }</TableCell>
      );
    }
  }
  function renderExtensionsHeader(){
    if (!hideExtensions) {
      return (
        <TableCell className="extensions">Extensions</TableCell>
      );
    }
  }
  function renderName(name, fullAaddress){
    if (!hideName) {
      if(multiline){
        return (<TableCell className='multilineNameAndAddress'>
          <span className='name' style={{fontWeight: 400}}>{name }</span> <br />
          <span className='fullAddress' style={{color: 'gray'}}>{ fullAaddress }</span>
        </TableCell>)
  
      } else {
        return (
          <TableCell className="name">{ name }</TableCell>
        );  
      }
    }
  }
  function renderNameHeader(){
    if (!hideName) {
      return (
        <TableCell className="name">Name</TableCell>
      );
    }
  }
  function renderPhone(phone){
    if (!hidePhone) {
      let phoneString = phone
      if(phone.length === 10){
        phoneString = phone.substring(0,3) + "-" + phone.substring(3,6) + "-" + phone.substring(6,10)
      }

      return (
        <TableCell className="phone" style={{minWidth: '160px'}}>{ phoneString }</TableCell>
      );
    }
  }
  function renderPhoneHeader(){
    if (!hidePhone) {
      return (
        <TableCell className="phone">Phone</TableCell>
      );
    }
  }
  function renderEmail(email){
    if (!hideEmail) {
      return (
        <TableCell className="email hidden-on-phone" style={{maxWidth: '300px', overflowY: 'auto'}}>{ email }</TableCell>
      );
    }
  }
  function renderEmailHeader(){
    if (!hideEmail) {
      return (
        <TableCell className="email hidden-on-phone">Email</TableCell>
      );
    }
  }
  function renderAddressLine(addressLine){
    if (!hideAddressLine) {

      let addressLineStyle = {};
      if(hasRestrictions){
        addressLineStyle = restrictionStyle;
      }

      return (
        <TableCell className="addressLine" style={addressLineStyle}>{ addressLine }</TableCell>
      );
    }
  }
  function renderAddressLineHeader(){
    if (!hideAddressLine) {
      return (
        <TableCell className="addressLine"> Address</TableCell>
      );
    }
  }
  function renderCity(city){
    if (!hideCity) {

      let cityStyle = {};
      if(hasRestrictions){
        cityStyle = restrictionStyle;
      }

      return (
        <TableCell className="city" style={cityStyle}>{ city }</TableCell>
      );
    }
  }
  function renderCityHeader(){
    if (!hideCity) {
      return (
        <TableCell className="city">City</TableCell>
      );
    }
  }
  function renderState(state){
    if (!hideState) {
      
      let stateStyle = {};
      if(hasRestrictions){
        stateStyle = restrictionStyle;
      }

      return (
        <TableCell className="state" style={stateStyle}>{ state }</TableCell>
      );
    }
  }
  function renderStateHeader(){
    if (!hideState) {
      return (
        <TableCell className="state">State</TableCell>
      );
    }
  }
  function renderPostalCode(postalCode){
    if (!hidePostalCode) {
      let postalCodeString = ""

      if(postalCode){
        postalCodeString = postalCode
        if(postalCode.length === 9){
          postalCodeString = postalCode.substring(0,5) + "-" + postalCode.substring(5,9)
        }  
      }

      let postalCodeStyle = {
        minWidth: '140px'
      };
      if(hasRestrictions){
        postalCodeStyle = restrictionStyle;
      }

      return (
        <TableCell className="postalCode hidden-on-phone" style={postalCodeStyle}>{ postalCodeString }</TableCell>
      );
    }
  }
  function renderPostalCodeHeader(){
    if (!hidePostalCode) {
      return (
        <TableCell className="postalCode hidden-on-phone">Postal Code</TableCell>
      );
    }
  }
  function renderNumEndpoints(numEndpoints){
    if (!hideNumEndpoints) {
      return (
        <TableCell className='numEndpoints'>{numEndpoints}</TableCell>
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
  function renderActionButtonHeader(){
    if (!hideActionButton) {
      return (
        <TableCell className='ActionButton' >Action</TableCell>
      );
    }
  }
  function renderActionButton(patient){
    if (!hideActionButton) {
      return (
        <TableCell className='ActionButton' >
          <Button onClick={ handleActionButtonClick.bind(this, patient._id)}>{ get(props, "actionButtonLabel", "") }</Button>
        </TableCell>
      );
    }
  }

  //---------------------------------------------------------------------
  // Table Rows

  let tableRows = [];
  let organizationsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";
  
  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }


  if(Array.isArray(organizations)){
    console.log('OrganizationsTable: Parsing ' + organizations.length + " organizations.")
    if(organizations){
      if(organizations.length > 0){     
        let count = 0;    
  
        organizations.forEach(function(organization){
          if((count >= (page * rowsPerPage)) && (count < (page + 1) * rowsPerPage)){
            organizationsToRender.push(FhirDehydrator.dehydrateOrganization(organization, internalDateFormat));
          }
          count++;
        });  
      }
    }  
  } else {
    console.log('OrganizationsTable: Did not receive an array of organizations.');
  }

  let rowStyle = {
    cursor: 'pointer',
    height: '55px'
  }
  if(organizationsToRender.length === 0){
    // logger.trace('OrganizationsTable: No organizations to render.');
    console.log('OrganizationsTable: No organizations to render.');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < organizationsToRender.length; i++) {
      
      let selected = false;
      if(get(organizationsToRender[i], 'id') === selectedOrganizationId){
        selected = true;
      }
      if(get(organizationsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }

      // logger.trace('organizationsToRender[i]', organizationsToRender[i])
      tableRows.push(
        <TableRow 
          className="organizationRow" 
          key={i} 
          onClick={ handleRowClick.bind(this, organizationsToRender[i].id)} 
          hover={true} 
          style={rowStyle} 
          selected={selected} 
        >            
          { renderCheckbox() }
          { renderActionIcons(organizationsToRender[i]) }
          { renderIdentifier(organizationsToRender[i].identifier ) }
          { renderFhirId(get(organizationsToRender[i], "id")) }

          {renderName(organizationsToRender[i].name, organizationsToRender[i].fullAddress)}
          {renderPhone(organizationsToRender[i].phone)}
          {renderEmail(organizationsToRender[i].email)}
          {renderAddressLine(organizationsToRender[i].addressLine)}
          {renderCity(organizationsToRender[i].city)}
          {renderState(organizationsToRender[i].state)}
          {renderPostalCode(organizationsToRender[i].postalCode)}
          {renderNumEndpoints(organizationsToRender[i].numEndpoints)}

          { renderBarcode(organizationsToRender[i]._id)}
          { renderActionButton(organizationsToRender[i]) }
          { renderExtensions(organizationsToRender[i].extension) }
        </TableRow>
      );    
    }
  }


  //---------------------------------------------------------------------
  // Actual Render Method

  return(
    <div id={id} className="tableWithPagination">
      <Table className='organizationsTable' size={tableRowSize} aria-label="a size table" { ...otherProps }>
        <TableHead>
          <TableRow>
            { renderCheckboxHeader() } 
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }
            { renderFhirIdHeader() }

            { renderNameHeader() }
            { renderPhoneHeader() }
            { renderEmailHeader() }
            { renderAddressLineHeader() }
            { renderCityHeader() }
            { renderStateHeader() }
            { renderPostalCodeHeader() }
            { renderNumEndpointsHeader() }
            
            { renderBarcodeHeader() }
            { renderActionButtonHeader() }
            { renderExtensionsHeader() }
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


OrganizationsTable.propTypes = {
  id: PropTypes.string,

  data: PropTypes.array,
  organizations: PropTypes.array,
  selectedOrganizationId: PropTypes.string,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  hideCheckbox:  PropTypes.bool,
  hideActionIcons:  PropTypes.bool,
  hideFhirId: PropTypes.bool,
  hideIdentifier:  PropTypes.bool,
  hideName:  PropTypes.bool,
  hidePhone:  PropTypes.bool,
  hideEmail:  PropTypes.bool,
  hideAddressLine:  PropTypes.bool,
  hideCity:  PropTypes.bool,
  hideState:  PropTypes.bool,
  hidePostalCode:  PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButton: PropTypes.func,
  onSetPage: PropTypes.func,

  page: PropTypes.number,

  hideActionButton: PropTypes.bool,
  hideBarcode: PropTypes.bool,
  actionButtonLabel: PropTypes.string,
  hideExtensions: PropTypes.bool,
  hideNumEndpoints: PropTypes.bool,

  rowsPerPage: PropTypes.number,
  tableRowSize: PropTypes.string,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,
  size: PropTypes.string,
  
  page: PropTypes.number,
  count: PropTypes.number,
  multiline: PropTypes.bool,
  hasRestrictions: PropTypes.bool,

  formFactorLayout: PropTypes.string,
  primaryColor: PropTypes.string
};

OrganizationsTable.defaultProps = {
  selectedOrganizationId: '',
  organizations: [],
  hideFhirId: true,
  hideName: false,
  hideActionButton: true,
  hideCheckbox: true,
  hideBarcode: true,
  hideExtensions: true,
  hideNumEndpoints: true,
  multiline: false,
  page: 0,
  rowsPerPage: 5,
  hasRestrictions: false,
  tableRowSize: 'medium',
  actionButtonLabel: 'Export',
  dateFormat: "YYYY-MM-DD",
  tableRowSize: 'medium',
  primaryColor: "#E5537E"
}

export default OrganizationsTable;

