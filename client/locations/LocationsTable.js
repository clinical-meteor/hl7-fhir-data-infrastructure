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
// FLATTENING / MAPPING

flattenLocation = function(location, simplifiedAddress, preferredExtensionUrl){
  

  let result = {
    _id: '',
    id: '',
    meta: '',
    identifier: '',
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    type: '',
    latitude: '',
    longitude: '',
    selectedExtension: ''
  };

  result.severity = get(location, 'severity.text', '');

  if (get(location, '_id')){
    result._id = get(location, '_id');
  }
  if (get(location, 'name')) {
    result.name = get(location, 'name');
  }
  if (get(location, 'address')) {
    if(simplifiedAddress){
      result.address = FhirUtilities.stringifyAddress(get(location, 'address'), {noPrefix: true});
    } else {
      result.address = get(location, 'address');
    }
  }
  if (get(location, 'address.city')) {
    result.city = get(location, 'address.city');
  }
  if (get(location, 'address.state')) {
    result.state = get(location, 'address.state');
  }
  if (get(location, 'address.postalCode')) {
    result.postalCode = get(location, 'address.postalCode');
  }
  if (get(location, 'address.country')) {
    result.country = get(location, 'address.country');
  }
  if (get(location, 'type[0].text')) {
    result.type = get(location, 'type[0].text');
  }
  if (get(location, 'position.latitude')) {
    result.latitude = get(location, 'position.latitude', null);
  }
  if (get(location, 'position.longitude')) {
    result.longitude = get(location, 'position.longitude', null);
  }

  if (Array.isArray(get(location, 'extension'))) {

    let extensionIndex = findIndex(location.extension, {'url': preferredExtensionUrl});
    console.log('flattenLocation', location, preferredExtensionUrl, extensionIndex);

    if(extensionIndex > -1){
      result.selectedExtension = location.extension[extensionIndex].valueDecimal.toString();
    }
  }

  return result;
}





// Session.setDefault('selectedLocations', []);

function LocationsTable(props){
  logger.info('Rendering the LocationsTable');
  logger.verbose('clinical:hl7-resource-locations.client.LocationsTable');
  logger.data('LocationsTable.props', {data: props}, {source: "LocationsTable.jsx"});

  console.log('LocationsTable', props)

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
    hideType,
    hideExtensions,
    
    simplifiedAddress,
    extensionUrl,
    extensionLabel,

    query,
    paginationLimit,
    disablePagination,
    rowsPerPage,

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
  function renderName(name){
    if (!props.hideName) {
      return (
        <TableCell className='name'>{ name }</TableCell>
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
      return (
        <TableCell className='extensions'>{ extensions }</TableCell>
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
          locationsToRender.push(flattenLocation(location, simplifiedAddress, extensionUrl));
        }
        count++;
      });  
    }
  }


  if(locationsToRender.length === 0){
    logger.trace('ConditionsTable: No locations to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < locationsToRender.length; i++) {
      logger.trace('locationsToRender[i]', locationsToRender[i])
      tableRows.push(
        <TableRow className='locationRow' key={i} onClick={ rowClick.bind(this, get(locationsToRender[i], "_id")) } hover={true} style={{height: '42px'}} >
           { renderIdentifier(get(locationsToRender[i], "identifier")) }
           { renderName(get(locationsToRender[i], "name")) }
           { renderAddress(get(locationsToRender[i], "address")) }
           { renderCity(get(locationsToRender[i], "city")) }
           { renderState(get(locationsToRender[i], "state")) }
           { renderPostalCode(get(locationsToRender[i], "postalCode")) }
           { renderCountry(get(locationsToRender[i], "country")) }
           { renderType(get(locationsToRender[i], "type")) }
           { renderLatitude(get(locationsToRender[i], "latitude")) }
           { renderLongitude(get(locationsToRender[i], "longitude")) }
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
      rowsPerPageOptions={[5, 10, 25, 100]}
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

  hideIdentifier: PropTypes.bool,
  hideName: PropTypes.bool,
  hideAddress: PropTypes.bool,
  hideCity: PropTypes.bool,
  hideState: PropTypes.bool,
  hidePostalCode: PropTypes.bool,
  hideType: PropTypes.bool,
  hideExtensions: PropTypes.bool,
  hideLatLng: PropTypes.bool,
  simplifiedAddress: PropTypes.bool,
  extensionUrl: PropTypes.string,
  extensionLabel: PropTypes.string,
}

LocationsTable.defaultProps = {
  hideIdentifier: true,
  hideName: false,
  hideAddress: false,
  hideCity: false,
  hideState: false,
  hidePostalCode: false,
  hideType: false,
  hideExtensions: true,
  extensionUrl: '',
  extensionLabel: 'Extension',
  simplifiedAddress: true,
  rowsPerPage: 5
}

export default LocationsTable;