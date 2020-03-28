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

flattenLocation = function(location){
  let result = {
    _id: '',
    id: '',
    meta: '',
    identifier: '',
    name: '',
    address: '',
    type: '',
    latitude: '',
    longitude: ''
  };

  result.severity = get(location, 'severity.text', '');

  if (get(location, '_id')){
    result._id = get(location, '_id');
  }
  if (get(location, 'name')) {
    result.name = get(location, 'name');
  }
  if (get(location, 'address')) {
    result.address = FhirUtilities.stringifyAddress(get(location, 'address'), {noPrefix: true});
  }
  if (get(location, 'type')) {
    result.name = get(location, 'type[0].text');
  }
  if (get(location, 'position.latitude')) {
    result.latitude = get(location, 'position.latitude', null);
  }
  if (get(location, 'position.longitude')) {
    result.longitude = get(location, 'position.longitude', null);
  }

  return result;
}






// Session.setDefault('selectedLocations', []);


function LocationsTable(props){
  logger.info('Rendering the LocationsTable');
  logger.verbose('clinical:hl7-resource-locations.client.LocationsTable');
  logger.data('LocationsTable.props', {data: props}, {source: "LocationsTable.jsx"});

  const classes = useStyles();

  let { 
    children, 

    locations,

    query,
    paginationLimit,
    disablePagination,
  
    displayName,
    displayLatLng,

    rowsPerPage,
    dateFormat,
    showMinutes,
    displayEnteredInError,

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
          locationsToRender.push(flattenLocation(location));
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
        <TableRow className='locationRow' key={i} onClick={ rowClick.bind(this, get(locationsToRender[i], "_id")) } hover={true} >
          {/* <TableCell className="cardinality">{(this.data.locations[i].cardinality) ? this.data.locations[i].cardinality : ''}</TableCell> */}
          <TableCell className="name">{ get(locationsToRender[i], "name") }</TableCell>
          <TableCell className="address">{ get(locationsToRender[i], "address") }</TableCell>
          <TableCell className="type">{ get(locationsToRender[i], "type") }</TableCell>
          <TableCell className="latitutude">{get(locationsToRender[i], "latitude")}</TableCell>
          <TableCell className="longitude">{get(locationsToRender[i], "longitude")}</TableCell>
          {/* <TableCell className="altitude">{get(locationsToRender[i], "altitute")}</TableCell> */}
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
          <TableRow>
            {/* <TableCell className="cardinality hidden-on-phone">Cardinality</TableCell> */}
            <TableCell className="name">Name</TableCell>
            <TableCell className="address">Address</TableCell>
            <TableCell className="type">Type</TableCell>
            <TableCell className="latitutude">Latitutude</TableCell>
            <TableCell className="longitude">Longitude</TableCell>
            {/* <TableCell className="altitude">Altitude</TableCell> */}
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

  displayName: PropTypes.bool,
  displayLatLng: PropTypes.bool
}

LocationsTable.defaultProps = {
  rowsPerPage: 5
}

export default LocationsTable;