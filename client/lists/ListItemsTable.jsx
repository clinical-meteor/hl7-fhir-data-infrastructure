import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination
} from '@material-ui/core';


import moment from 'moment'
import _ from 'lodash';
let get = _.get;
let set = _.set;

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
// MAIN COMPONENT

function ListItemsTable(props){
  logger.info('Rendering the ListItemsTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.ListItemsTable');
  logger.data('ListItemsTable.props', {data: props}, {source: "ListItemsTable.jsx"});

  const classes = useStyles();

  let { 
    children, 

    items,
    selectedItemId,

    hideCheckbox,
    hideActionIcons,


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

    ...otherProps 
  } = props;


  // ------------------------------------------------------------------------
  // Helper Functions

  function handleRowClick(id){
    console.log('Clicking row ' + id)
    if(props.onRowClick){
      props.onRowClick(id);
    }
  }

  function removeRecord(_id){
    console.log('Remove list ', _id)
    if(props.onRemoveRecord){
      props.onRemoveRecord(_id);
    }
  }
  function handleActionButtonClick(id){
    if(typeof props.onActionButtonClick === "function"){
      props.onActionButtonClick(id);
    }
  }


  // ------------------------------------------------------------------------
  // Column Rendering

  function renderDisplay(display){
    if (!props.hideDisplay) {
      return (
        <TableCell className='display'>{ display }</TableCell>
      );
    }
  }
  function renderDisplayHeader(){
    if (!props.hideDisplay) {
      return (
        <TableCell className='display'>Display</TableCell>
      );
    }
  }
  function renderReference(reference){
    if (!props.hideReference) {
      return (
        <TableCell className='reference'>{ reference }</TableCell>
      );
    }
  }
  function renderReferenceHeader(){
    if (!props.hideReference) {
      return (
        <TableCell className='reference'>Reference</TableCell>
      );
    }
  }
  


  function flattenListItem(listItem){
    let result = {};

    result.display = get(listItem, 'display')
    result.reference = get(listItem, 'reference')

    return result;
  }

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
  
  
  //---------------------------------------------------------------------
  // Table Rows



  let tableRows = [];
  let listsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.internalDateFormat){
    internalDateFormat = props.dateFormat;
  }


  if(props.items){
    if(props.items.length > 0){              
      props.items.forEach(function(list){
        listsToRender.push(flattenListItem(list, internalDateFormat));
      });  
    }
  }

  if(listsToRender.length === 0){
    console.log('No lists to render');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < listsToRender.length; i++) {

      let selected = false;
      if(listsToRender[i].id === selectedItemId){
        selected = true;
      }
      tableRows.push(
        <TableRow 
          className="listRow" 
          key={i} 
          onClick={ handleRowClick.bind(this, listsToRender[i]._id)} 
          hover={true} 
          style={{cursor: 'pointer', height: '52px'}} 
          selected={selected}
        >
          { renderDisplay(listsToRender[i].display) }
          { renderReference(listsToRender[i].reference) }
        </TableRow>
      );       
    }
  }

  return(
    <div>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            { renderDisplayHeader() }
            { renderReferenceHeader() }
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

ListItemsTable.propTypes = {
  barcodes: PropTypes.bool,
  items: PropTypes.array,
  selectedItemId: PropTypes.string,

  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  showMinutes: PropTypes.bool,

  hideDisplay: PropTypes.bool,
  hideReference: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,

  formFactorLayout: PropTypes.string
};
ListItemsTable.defaultProps = {
  items: [],
  hideDisplay: false,
  hideReference: false,
  selectedItemId: '',
  rowsPerPage: 5
}

export default ListItemsTable; 