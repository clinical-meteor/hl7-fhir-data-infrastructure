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
import { get, set, has, findIndex } from 'lodash';

import FhirUtilities from '../../lib/FhirUtilities';
import { StyledCard, PageCanvas, TableNoData } from 'fhir-starter';
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

Session.setDefault('selectedLocations', []);



//===========================================================================
// MAIN COMPONENT




function LocationsTable(props){
  logger.debug('Rendering the LocationsTable');
  logger.verbose('clinical:hl7-resource-locations.client.LocationsTable');
  logger.data('LocationsTable.props', {data: props}, {source: "LocationsTable.jsx"});

  // console.log('LocationsTable', props)

  const classes = useStyles();

  let { 
    children, 
    id,

    data,
    locations,

    hideIdentifier,
    hideName,
    hideAddress,
    hideCity,
    hideState,
    hidePostalCode,
    hideCountry,
    hideType,
    hideExtensions,
    hideLatitude,
    hideLongitude,
    hideLatLng,
    hideActionIcons,

    simplifiedAddress,
    extensionUrl,
    extensionLabel,
    extensionUnit,

    query,
    paginationLimit,
    disablePagination,
    rowsPerPage,

    page,
    onSetPage,

    formFactorLayout,
    tableRowSize,

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
        break;
      case "tablet":
        hideActionIcons = true;
        break;
      case "web":
        hideActionIcons = true;
        break;
      case "desktop":
        hideActionIcons = true;
        break;
      case "videowall":
        hideActionIcons = true;
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
      style={{float: 'right', border: 'none'}}
    />
  }

  //---------------------------------------------------------------------
  // Methods


  function renderNameHeader(){
    if (!hideName) {
      return (
        <TableCell className="name">Name</TableCell>
      );
    }
  }
  function renderName(name, address, latitude, longitude){
    if (!hideName) {
      let cellContents = [];

      if(Number.isFinite(latitude)){
        latitude = latitude.toFixed(6);
      }
      if(Number.isFinite(longitude)){
        longitude = longitude.toFixed(6);
      }

      if(multiline){
        cellContents.push(<div key='location_name' className="location_name">{name}</div>)
        cellContents.push(<div key='location_address' className="location_address" style={{color: '#222222'}}>{address}</div>)
        cellContents.push(<div key='location_latlng' className="location_latlng" style={{color: 'cornflowerblue', fontSize: '80%'}}>{longitude}, {latitude}</div>)
      } else {
        cellContents.push(<div key='location_name' className="location_name">{name}</div>)
      }
      return (
        <TableCell className='name'>
          { cellContents }   
        </TableCell>
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
  function renderIdentifier(identifier){
    if (!hideIdentifier) {
      return (
        <TableCell className='identifier'>{ identifier }</TableCell>
      );  
    }
  }
  function renderAddressHeader(){
    if (!hideAddress) {
      return (
        <TableCell className="address">Address</TableCell>
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
  function renderCityHeader(){
    if (!hideCity) {
      return (
        <TableCell className="city">City</TableCell>
      );
    }
  }
  function renderCity(city){
    if (!hideCity) {
      return (
        <TableCell className='city'>{ city }</TableCell>
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
  function renderState(state){
    if (!hideState) {
      return (
        <TableCell className='state'>{ state }</TableCell>
      );  
    }
  }
  function renderPostalCodeHeader(){
    if (!hidePostalCode) {
      return (
        <TableCell className="postalCode">Postal Code</TableCell>
      );
    }
  }
  function renderPostalCode(postalCode){
    if (!hidePostalCode) {
      return (
        <TableCell className='postalCode'>{ postalCode }</TableCell>
      );  
    }
  }
  function renderCountryHeader(){
    if (!hideCountry) {
      return (
        <TableCell className="country">Country</TableCell>
      );
    }
  }
  function renderCountry(country){
    if (!hideCountry) {
      return (
        <TableCell className='country'>{ country }</TableCell>
      );  
    }
  }
  function renderTypeHeader(){
    if (!hideType) {
      return (
        <TableCell className="type">Type</TableCell>
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
  function renderLatitudeHeader(){
    if (!hideLatitude) {
      return (
        <TableCell className="latitude">Latitude</TableCell>
      );
    }
  }
  function renderLatitude(latitude){
    if (!hideLatitude) {
      return (
        <TableCell className='latitude'>{ latitude }</TableCell>
      );  
    }
  }
  function renderLatLngHeader(){
    if (!hideLatLng) {
      return (
        <TableCell className="latitude">Distance</TableCell>
      );
    }
  }
  function renderLatLng(latitude, longitude, distance){
    if (!hideLatLng) {
      let textStyle = {
        color: '#bbbbbb'
      }
      if(Number.isFinite(latitude)){
        latitude = latitude.toFixed(6);
      }
      if(Number.isFinite(longitude)){
        longitude = longitude.toFixed(6);
      }
      return (
        <TableCell className='latlng' style={{verticalAlign: 'top'}} >
          <div>{distance} miles</div>
          {/* <div style={{color: 'cornflowerblue', fontSize: '80%', marginRight: '10px'}}>{longitude}, {latitude}</div> */}
        </TableCell>
      );  
    }
  }
  function renderLongitudeHeader(){
    if (!hideLongitude) {
      return (
        <TableCell className="longitude">Longitude</TableCell>
      );
    }
  }
  function renderLongitude(longitude){
    if (!hideLongitude) {
      return (
        <TableCell className='longitude'>{ longitude }</TableCell>
      );  
    }
  }

  function renderExtensionsHeader(){
    if (!hideExtensions) {
      return (
        <TableCell className="extensions">{extensionLabel}</TableCell>
      );
    }
  }
  function renderExtensions(extensions){
    if (!hideExtensions) {
      let cellText = "";
      if(extensionUnit){
        cellText = extensions + " " + extensionUnit;
      } else {
        cellText = extensions;
      }
      return (
        <TableCell className='extensions'>{ cellText }</TableCell>
      );  
    }
  }

  //---------------------------------------------------------------------
  // Methods  

  function rowClick(id){
    // Session.set('selectedConditionId', id);
    // Session.set('locationPageTabIndex', 2);
  };

  //---------------------------------------------------------------------
  // Array Parsing  

  let tableRows = [];
  let locationsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }


  if(locations){
    if(locations.length > 0){     
      let count = 0;    

      locations.forEach(function(location){
        if((count >= (page * rowsPerPage)) && (count < (page + 1) * rowsPerPage)){
          locationsToRender.push(FhirDehydrator.dehydrateLocation(location, simplifiedAddress, extensionUrl));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer', 
    height: '55px'
  }

  if(locationsToRender.length === 0){
    // logger.trace('LocationsTable: No locations to render.');
    console.log('LocationsTable: No locations to render.');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < locationsToRender.length; i++) {
      logger.trace('locationsToRender[i]', locationsToRender[i])

      let selected = false;
      if(endpointsToRender[i].id === selectedEndpointId){
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
          className='locationRow' 
          key={i} 
          onClick={ rowClick.bind(this, get(locationsToRender[i], "_id")) } 
          hover={true} 
          selected={selected}
          style={rowStyle} >
           { renderIdentifier(get(locationsToRender[i], "identifier")) }
           { renderName(get(locationsToRender[i], "name"), get(locationsToRender[i], "address"), get(locationsToRender[i], "latitude"), get(locationsToRender[i], "longitude")) }
           { renderAddress(get(locationsToRender[i], "address")) }
           { renderCity(get(locationsToRender[i], "city")) }
           { renderState(get(locationsToRender[i], "state")) }
           { renderPostalCode(get(locationsToRender[i], "postalCode")) }
           { renderCountry(get(locationsToRender[i], "country")) }
           { renderType(get(locationsToRender[i], "type")) }
           { renderLatitude(get(locationsToRender[i], "latitude")) }
           { renderLongitude(get(locationsToRender[i], "longitude")) }
           { renderLatLng(get(locationsToRender[i], "latitude"), get(locationsToRender[i], "longitude"), get(locationsToRender[i], "distance")) }
           { renderExtensions(get(locationsToRender[i], "selectedExtension")) }
        </TableRow>
      );
    }
  }

  

  return(
    <div>
      <Table size="small" aria-label="a dense table" >
        <TableHead>
          <TableRow >
            {/* <TableCell className="cardinality hidden-on-phone">Cardinality</TableCell> */}
            { renderIdentifierHeader() }
            { renderNameHeader() }
            { renderAddressHeader() }
            { renderCityHeader() }
            { renderStateHeader() }
            { renderPostalCodeHeader() }
            { renderCountryHeader() }
            { renderTypeHeader() }
            { renderLatitudeHeader() }
            { renderLongitudeHeader() }
            { renderLatLngHeader() }
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


LocationsTable.propTypes = {
  locations: PropTypes.array,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,
  rowsPerPage: PropTypes.number,
  count: PropTypes.number,

  page: PropTypes.number,
  onSetPage: PropTypes.func,

  hideIdentifier: PropTypes.bool,
  hideName: PropTypes.bool,
  hideAddress: PropTypes.bool,
  hideCity: PropTypes.bool,
  hideState: PropTypes.bool,
  hidePostalCode: PropTypes.bool,
  hideCountry: PropTypes.bool,
  hideType: PropTypes.bool,
  hideExtensions: PropTypes.bool,
  hideLatLng: PropTypes.bool,
  hideLongitude: PropTypes.bool,
  hideLatLng: PropTypes.bool,
  simplifiedAddress: PropTypes.bool,
  extensionUrl: PropTypes.string,
  extensionLabel: PropTypes.string,
  extensionUnit: PropTypes.string,
  multiline: PropTypes.bool,

  formFactorLayout: PropTypes.string,
  tableRowSize: PropTypes.string
}

LocationsTable.defaultProps = {
  hideIdentifier: true,
  hideName: false,
  hideAddress: false,
  hideCity: false,
  hideState: false,
  hidePostalCode: false,
  hideType: false,
  hideCountry: false,
  hideExtensions: true,
  hideLongitude: false,
  hideLatLng: true,
  extensionUrl: '',
  extensionLabel: 'Extension',
  extensionUnit: '',
  simplifiedAddress: true,
  multiline: false,
  tableRowSize: 'medium',
  page: 0,
  rowsPerPage: 5,
  tableRowSize: 'medium'
}

export default LocationsTable;