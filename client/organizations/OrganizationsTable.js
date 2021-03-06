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
import _ from 'lodash';
let get = _.get;
let set = _.set;

import FhirUtilities from '../../lib/FhirUtilities';
import { FhirDehydrator, StyledCard, PageCanvas } from 'fhir-starter';




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


  // //===========================================================================
  // // FLATTENING / MAPPING

  // flattenOrganization = function(organization){
  //   let result = {
  //     _id: '',
  //     id: '',
  //     meta: '',
  //     name: '',
  //     identifier: '',
  //     phone: '',
  //     addressLine: '',
  //     text: '',
  //     city: '',
  //     state: '',
  //     postalCode: '',
  //     extension: ''
  //   };

  //   result._id =  get(organization, 'id') ? get(organization, 'id') : get(organization, '_id');
  //   result.id = get(organization, 'id', '');
  //   result.identifier = get(organization, 'identifier[0].value', '');

  //   result.name = get(organization, 'name', '')

  //   result.phone = FhirUtilities.pluckPhone(get(organization, 'telecom'));
  //   result.email = FhirUtilities.pluckEmail(get(organization, 'telecom'));

  //   result.addressLine = get(organization, 'address[0].line[0]');
  //   result.state = get(organization, 'address[0].state');
  //   result.postalCode = get(organization, 'address[0].postalCode');
  //   result.country = get(organization, 'address[0].country');

  //   // S.A.N.E.R. Reporting Extensions
  //   if(Array.isArray(get(organization, 'extension'))){
  //     result.extension = get(organization, 'extension[0].valueQuantity');
  //   }

  //   return result;
  // }

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
  
    onCellClick,
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButtonClihandle,
    hideActionButton,
    hideBarcode,
    actionButtonLabel,
    hideExtensions,
  
    rowsPerPage,
    tableRowSize,
    dateFormat,
    showMinutes,
    size,

    appHeight,
    formFactorLayout,
    count,
    multiline,

    ...otherProps 
  } = props;

  // ------------------------------------------------------------------------
  // Form Factors

  if(formFactorLayout){
    logger.verbose('formFactorLayout', formFactorLayout + ' ' + window.innerWidth);
    switch (formFactorLayout) {
      case "phone":
        hideCheckbox = true;
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
        hideCheckbox = true;
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
        hideCheckbox = true;
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
        hideCheckbox = true;
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
        hideCheckbox = true;
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
  const [page, setPage] = useState(0);
  const [rowsPerPageToRender, setRowsPerPage] = useState(rowsPerPage);


  let paginationCount = 101;
  if(count){
    paginationCount = count;
  } else {
    paginationCount = rows.length;
  }

  function handleChangePage(event, newPage){
    setPage(newPage);
  }

  let paginationFooter;
  if(!disablePagination){
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
      return (
        <TableCell className="phone">{ phone }</TableCell>
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
        <TableCell className="email hidden-on-phone">{ email }</TableCell>
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
      return (
        <TableCell className="addressLine ">{ addressLine }</TableCell>
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
      return (
        <TableCell className="city ">{ city }</TableCell>
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
      return (
        <TableCell className="state">{ state }</TableCell>
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
      return (
        <TableCell className="postalCode hidden-on-phone">{ postalCode }</TableCell>
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

  
  if(organizations){
    if(organizations.length > 0){     
      let count = 0;    

      organizations.forEach(function(organization){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          organizationsToRender.push(FhirDehydrator.flattenOrganization(organization));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer'
  }
  if(organizationsToRender.length === 0){
    logger.trace('OrganizationsTable: No organizations to render.');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < organizationsToRender.length; i++) {
      let selected = false;
      if(organizationsToRender[i].id === selectedOrganizationId){
        selected = true;
      }
      if(get(organizationsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      logger.trace('organizationsToRender[i]', organizationsToRender[i])
      tableRows.push(
        <TableRow className="organizationRow" key={i} style={rowStyle} onClick={ handleRowClick.bind(this, organizationsToRender[i]._id)} style={{cursor: 'pointer'}} hover={true} selected={selected} >            
          { renderCheckbox() }
          { renderActionIcons(organizationsToRender[i]) }
          { renderIdentifier(organizationsToRender[i].identifier ) }

          {renderName(organizationsToRender[i].name, organizationsToRender[i].fullAddress)}
          {renderPhone(organizationsToRender[i].phone)}
          {renderEmail(organizationsToRender[i].email)}
          {renderAddressLine(organizationsToRender[i].addressLine)}
          {renderCity(organizationsToRender[i].city)}
          {renderState(organizationsToRender[i].state)}
          {renderPostalCode(organizationsToRender[i].postalCode)}

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

            { renderNameHeader() }
            { renderPhoneHeader() }
            { renderEmailHeader() }
            { renderAddressLineHeader() }
            { renderCityHeader() }
            { renderStateHeader() }
            { renderPostalCodeHeader() }
            
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
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  hideCheckbox:  PropTypes.bool,
  hideActionIcons:  PropTypes.bool,
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
  onActionButtonClihandle: PropTypes.func,
  hideActionButton: PropTypes.bool,
  hideBarcode: PropTypes.bool,
  actionButtonLabel: PropTypes.string,
  hideExtensions: PropTypes.bool,

  rowsPerPage: PropTypes.number,
  tableRowSize: PropTypes.string,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,
  size: PropTypes.string,
  count: PropTypes.number,
  multiline: PropTypes.bool,

  formFactorLayout: PropTypes.string
};

OrganizationsTable.defaultProps = {
  hideName: false,
  hideActionButton: true,
  hideCheckbox: true,
  hideBarcode: true,
  hideExtensions: true,
  multiline: false,
  rowsPerPage: 5,
  tableRowSize: 'medium'
}

export default OrganizationsTable;

