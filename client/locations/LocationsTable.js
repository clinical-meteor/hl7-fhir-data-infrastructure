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
import { get, has, findIndex } from 'lodash';

import FhirUtilities from '../../lib/FhirUtilities';
import { FhirDehydrator, StyledCard, PageCanvas, TableNoData } from 'fhir-starter';


//===========================================================================
// THEMING

import { ThemeProvider, makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  foo: {}
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
// MAIN COMPONENT




// Session.setDefault('selectedLocations', []);

function LocationsTable(props){
  logger.debug('Rendering the LocationsTable');
  logger.verbose('clinical:hl7-resource-locations.client.LocationsTable');
  logger.data('LocationsTable.props', {data: props}, {source: "LocationsTable.jsx"});

  // console.log('LocationsTable', props)

  const classes = useStyles();

  let { 
    children, 
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

    multiline,

    query,
    paginationLimit,
    disablePagination,
    rowsPerPage,
    count,

    formFactorLayout,
    tableRowSize,

    ...otherProps 
  } = props;

  //---------------------------------------------------------------------
  // Pagination

  let rows = [];
  const [page, setPage] = useState(0);
  const [rowsPerPageToRender, setRowsPerPage] = useState(rowsPerPage);


  let paginationCount = 101;
  if(props.count){
    paginationCount = props.count;
  } else {
    paginationCount = rows.length;
  }


  //---------------------------------------------------------------------
  // Methods


  function renderNameHeader(){
    if (!props.hideName) {
      return (
        <TableCell className="name">Name</TableCell>
      );
    }
  }
  function renderName(name, address, latitude, longitude){
    if (!props.hideName) {
      let cellContents = [];

      if(Number.isFinite(latitude)){
        latitude = latitude.toFixed(6);
      }
      if(Number.isFinite(longitude)){
        longitude = longitude.toFixed(6);
      }

      if(props.multiline){
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
    if (!props.hideIdentifier) {
      return (
        <TableCell className="identifier">Identifier</TableCell>
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
  function renderAddressHeader(){
    if (!props.hideAddress) {
      return (
        <TableCell className="address">Address</TableCell>
      );
    }
  }
  function renderAddress(address){
    if (!props.hideAddress) {
      return (
        <TableCell className='address'>{ address }</TableCell>
      );  
    }
  }
  function renderCityHeader(){
    if (!props.hideCity) {
      return (
        <TableCell className="city">City</TableCell>
      );
    }
  }
  function renderCity(city){
    if (!props.hideCity) {
      return (
        <TableCell className='city'>{ city }</TableCell>
      );  
    }
  }
  function renderStateHeader(){
    if (!props.hideState) {
      return (
        <TableCell className="state">State</TableCell>
      );
    }
  }
  function renderState(state){
    if (!props.hideState) {
      return (
        <TableCell className='state'>{ state }</TableCell>
      );  
    }
  }
  function renderPostalCodeHeader(){
    if (!props.hidePostalCode) {
      return (
        <TableCell className="postalCode">Postal Code</TableCell>
      );
    }
  }
  function renderPostalCode(postalCode){
    if (!props.hidePostalCode) {
      return (
        <TableCell className='postalCode'>{ postalCode }</TableCell>
      );  
    }
  }
  function renderCountryHeader(){
    if (!props.hideCountry) {
      return (
        <TableCell className="country">Country</TableCell>
      );
    }
  }
  function renderCountry(country){
    if (!props.hideCountry) {
      return (
        <TableCell className='country'>{ country }</TableCell>
      );  
    }
  }
  function renderTypeHeader(){
    if (!props.hideType) {
      return (
        <TableCell className="type">Type</TableCell>
      );
    }
  }
  function renderType(type){
    if (!props.hideType) {
      return (
        <TableCell className='type'>{ type }</TableCell>
      );  
    }
  }
  function renderLatitudeHeader(){
    if (!props.hideLatitude) {
      return (
        <TableCell className="latitude">Latitude</TableCell>
      );
    }
  }
  function renderLatitude(latitude){
    if (!props.hideLatitude) {
      return (
        <TableCell className='latitude'>{ latitude }</TableCell>
      );  
    }
  }
  function renderLatLngHeader(){
    if (!props.hideLatLng) {
      return (
        <TableCell className="latitude">Distance</TableCell>
      );
    }
  }
  function renderLatLng(latitude, longitude, distance){
    if (!props.hideLatLng) {
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
    if (!props.hideLongitude) {
      return (
        <TableCell className="longitude">Longitude</TableCell>
      );
    }
  }
  function renderLongitude(longitude){
    if (!props.hideLongitude) {
      return (
        <TableCell className='longitude'>{ longitude }</TableCell>
      );  
    }
  }

  function renderExtensionsHeader(){
    if (!props.hideExtensions) {
      return (
        <TableCell className="extensions">{props.extensionLabel}</TableCell>
      );
    }
  }
  function renderExtensions(extensions){
    if (!props.hideExtensions) {
      let cellText = "";
      if(props.extensionUnit){
        cellText = extensions + " " + props.extensionUnit;
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

  if(props.locations){
    if(props.locations.length > 0){     
      let count = 0;    

      props.locations.forEach(function(location){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          locationsToRender.push(FhirDehydrator.flattenLocation(location, simplifiedAddress, extensionUrl));
        }
        count++;
      });  
    }
  }

  // console.log('locationsToRender', locationsToRender)


  if(locationsToRender.length === 0){
    logger.trace('LocationsTable: No locations to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < locationsToRender.length; i++) {
      logger.trace('locationsToRender[i]', locationsToRender[i])
      tableRows.push(
        <TableRow className='locationRow' key={i} onClick={ rowClick.bind(this, get(locationsToRender[i], "_id")) } hover={true} style={{height: '42px'}} >
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

  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  let paginationFooter;
  if(!props.disablePagination){
    paginationFooter = <TablePagination
      component="div"
      // rowsPerPageOptions={[5, 10, 25, 100]}
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
      <Table size="small" aria-label="a dense table" { ...otherProps }>
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
  rowsPerPage: 5
}

export default LocationsTable;