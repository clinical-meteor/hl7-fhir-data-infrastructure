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




function StructureDefinitionsTable(props){
  logger.info('Rendering the StructureDefinitionsTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.StructureDefinitionsTable');
  logger.data('StructureDefinitionsTable.props', {data: props}, {source: "StructureDefinitionsTable.jsx"});

  const classes = useStyles();

  let { 
    children, 

    structureDefinitions,
    selectedStructureDefinitionId,

    query,
    paginationLimit,
    disablePagination,

    hideCheckbox,
    hideActionIcons,

    hideVersion,
    hideName,
    hideTitle,
    hideStatus,
    hideExperimental,

    hideBarcode,

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
        hideActionIcons = false;

        hideVersion = false;
        hideName = false;
        hideTitle = false;
        hideStatus = false;
        hideExperimental = false;

        hideBarcode = true;
        break;
      case "tablet":
        hideCheckbox = true;
        hideActionIcons = false;
        hideVersion = false;
        hideName = false;
        hideTitle = false;
        hideStatus = false;
        hideExperimental = false;
        hideBarcode = true;
        break;
      case "web":
        hideCheckbox = true;
        hideActionIcons = false;
        hideVersion = false;
        hideName = false;
        hideTitle = false;
        hideStatus = false;
        hideExperimental = false;
        hideBarcode = true;
        break;
      case "desktop":
        hideCheckbox = true;
        hideActionIcons = false;
        hideVersion = false;
        hideName = false;
        hideTitle = false;
        hideStatus = false;
        hideExperimental = false;
        hideBarcode = true;
        break;
      case "videowall":
        hideCheckbox = false;
        hideActionIcons = false;
        hideVersion = false;
        hideName = false;
        hideTitle = false;
        hideStatus = false;
        hideExperimental = false;
        hideBarcode = true;
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
    console.log('Remove structureDefinition ', _id)
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
  function renderActionIcons(structureDefinition ){
    if (!hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ onMetaClick.bind(structureDefinition)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(structureDefinition._id)} />   */}
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

  function renderVersion(version){
    if (!hideVersion) {
      return (
        <TableCell className='version'>{ version }</TableCell>
      );
    }
  }
  function renderVersionHeader(){
    if (!hideVersion) {
      return (
        <TableCell className='version'>Version</TableCell>
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

  function renderTitle(title){
    if (!hideTitle) {
      return (
        <TableCell className='title'>{ title }</TableCell>
      );
    }
  }
  function renderTitleHeader(){
    if (!hideTitle) {
      return (
        <TableCell className='title'>Title</TableCell>
      );
    }
  }

  function renderExperimental(experimental){
    if (!hideExperimental) {
      return (
        <TableCell className='experimental'>{ experimental }</TableCell>
      );
    }
  }
  function renderExperimentalHeader(){
    if (!hideExperimental) {
      return (
        <TableCell className='experimental'>Experimental</TableCell>
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
  let structureDefinitionsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }


  if(structureDefinitions){
    if(structureDefinitions.length > 0){              
      structureDefinitions.forEach(function(structureDefinition){
        structureDefinitionsToRender.push(FhirDehydrator.flattenStructureDefinition(structureDefinition, internalDateFormat));
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer', 
    height: '52px'
  }

  if(structureDefinitionsToRender.length === 0){
    console.log('No structureDefinitions to render');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < structureDefinitionsToRender.length; i++) {

      let selected = false;
      if(structureDefinitionsToRender[i].id === selectedStructureDefinitionId){
        selected = true;
      }
      if(get(structureDefinitionsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }

      tableRows.push(
        <TableRow 
          className="structureDefinitionRow" 
          key={i} 
          onClick={ handleRowClick.bind(this, structureDefinitionsToRender[i]._id)} 
          hover={true} 
          style={{cursor: 'pointer', height: '52px'}} 
          selected={selected}
        >
          { renderCheckbox() }
          { renderActionIcons(structureDefinitionsToRender[i]) }
          { renderStatus(structureDefinitionsToRender[i].status) }

          { renderVersion(structureDefinitionsToRender[i].version) }
          { renderName(structureDefinitionsToRender[i].name) }
          { renderTitle(structureDefinitionsToRender[i].title) }
          { renderExperimental(structureDefinitionsToRender[i].experimental) }

          { renderBarcode(structureDefinitionsToRender[i].id)}
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
            
            { renderVersionHeader() }
            { renderNameHeader() }
            { renderTitleHeader() }
            { renderExperimentalHeader() }

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

StructureDefinitionsTable.propTypes = {
  barcodes: PropTypes.bool,
  structureDefinitions: PropTypes.array,
  selectedStructureDefinitionId: PropTypes.string,

  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  showMinutes: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,

  hideVersion: PropTypes.bool,
  hideName: PropTypes.bool,
  hideTitle: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideExperimental: PropTypes.bool,

  hideBarcode: PropTypes.bool,

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
StructureDefinitionsTable.defaultProps = {
  hideCheckbox: true,
  hideActionIcons: true,

  hideVersion: false,
  hideName: false,
  hideTitle: false,
  hideStatus: false,
  hideExperimental: false,

  hideBarcode: true,

  checklist: true,
  selectedStructureDefinitionId: '',
  rowsPerPage: 5,
  tableRowSize: 'medium',
  actionButtonLabel: 'Export'
}

export default StructureDefinitionsTable; 