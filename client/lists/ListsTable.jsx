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

import TableNoData from 'material-fhir-ui';

import moment from 'moment'
import _ from 'lodash';
let get = _.get;
let set = _.set;

import FhirUtilities from '../../lib/FhirUtilities';
import { flattenList } from '../../lib/FhirDehydrator';


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
// FLATTENING / MAPPING

flattenList = function(list, internalDateFormat){
  let result = {
    _id: '',
    meta: '',
    identifier: '',
  };

  if(!internalDateFormat){
    internalDateFormat = get(Meteor, "settings.public.defaults.internalDateFormat", "YYYY-MM-DD");
  }

  result._id =  get(list, 'id') ? get(list, 'id') : get(list, '_id');
  result.id = get(list, 'id', '');
  result.identifier = get(list, 'identifier[0].value', '');

  if(get(list, 'lastReviewDate')){
    result.lastReviewDate = moment(get(list, 'lastReviewDate', '')).format(internalDateFormat);
  }

  result.publisher = get(list, 'publisher', '');
  result.title = get(list, 'title', '');
  result.description = get(list, 'description', '');
  result.status = get(list, 'status', '');
  result.version = get(list, 'version', '');

  return result;
}



function ListsTable(props){
  logger.info('Rendering the ListsTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.ListsTable');
  logger.data('ListsTable.props', {data: props}, {source: "ListsTable.jsx"});

  const classes = useStyles();

  let { 
    children, 

    lists,
    selectedListId,

    query,
    paginationLimit,
    disablePagination,

    hideCheckbox,
    hideActionIcons,
    hideVersion,
    hideStatus,
    hidePublisher,
    hideTitle,
    hideDescription,
    hideApprovalDate,
    hideLastEditedDate,
    hideLastReviewed,
    hideAuthor,
    hideEditor,
    hideReviewer,
    hideEndorser,
    hideScoring,
    hideType,
    hideRiskAdjustment,
    hideRateAggregation,
    hideSupplementalData,
    hideContext,
    hidePopulationCount,
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
  function cellClick(id){
    if(typeof props.onCellClick === "function"){
      props.onCellClick(id);
    }
  }
  function handleMetaClick(patient){
    let self = this;
    if(props.onMetaClick){
      props.onMetaClick(self, patient);
    }
  }

  // ------------------------------------------------------------------------
  // Column Rendering

  function renderToggleHeader(){
    if (!props.hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Toggle</TableCell>
      );
    }
  }
  function renderToggle(){
    if (!props.hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}}>
            {/* <Checkbox
              defaultChecked={true}
            /> */}
        </TableCell>
      );
    }
  }
  function renderActionIconsHeader(){
    if (!props.hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(list ){
    if (!props.hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ onMetaClick.bind(list)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(list._id)} />   */}
        </TableCell>
      );
    }
  } 

  function renderVersion(version){
    if (!props.hideVersion) {
      return (
        <TableCell className='version'>{ version }</TableCell>
      );
    }
  }
  function renderVersionHeader(){
    if (!props.hideVersion) {
      return (
        <TableCell className='version'>Version</TableCell>
      );
    }
  }
  function renderStatus(status){
    if (!props.hideStatus) {
      return (
        <TableCell className='status'>{ status }</TableCell>
      );
    }
  }
  function renderStatusHeader(){
    if (!props.hideStatus) {
      return (
        <TableCell className='status'>Status</TableCell>
      );
    }
  }
  function renderTitle(title){
    if (!props.hideTitle) {
      return (
        <TableCell className='title'>{ title }</TableCell>
      );
    }
  }
  function renderTitleHeader(){
    if (!props.hideTitle) {
      return (
        <TableCell className='title'>Title</TableCell>
      );
    }
  }
  function renderDescription(description){
    if (!props.hideDescription) {
      return (
        <TableCell className='description'>{ description }</TableCell>
      );
    }
  }
  function renderDescriptionHeader(){
    if (!props.hideDescription) {
      return (
        <TableCell className='description'>Description</TableCell>
      );
    }
  }

  function renderApprovalDate(approvalDate){
    if (!props.hideApprovalDate) {
      return (
        <TableCell className='approvalDate'>{ approvalDate }</TableCell>
      );
    }
  }
  function renderApprovalDateHeader(){
    if (!props.hideApprovalDate) {
      return (
        <TableCell className='approvalDate' style={{minWidth: '140px'}}>Approval Date</TableCell>
      );
    }
  }
  function renderLastReviewDate(lastReview){
    if (!props.hideLastReviewDate) {
      return (
        <TableCell className='lastReview'>{ lastReview }</TableCell>
      );
    }
  }
  function renderLastReviewDateHeader(){
    if (!props.hideLastReviewDate) {
      return (
        <TableCell className='lastReview' style={{minWidth: '140px'}}>Last Review</TableCell>
      );
    }
  }
  function renderLastEditedDate(lastEdited){
    if (!props.hideLastEditedDate) {
      return (
        <TableCell className='lastEdited'>{ lastEdited }</TableCell>
      );
    }
  }
  function renderLastEditedDateHeader(){
    if (!props.hideLastEditedDate) {
      return (
        <TableCell className='lastEdited' style={{minWidth: '140px'}}>Last Edited</TableCell>
      );
    }
  }

  function renderAuthor(name){
    if (!props.hideAuthor) {
      return (
        <TableCell className='author'>{ name }</TableCell>
      );
    }
  }
  function renderAuthorHeader(){
    if (!props.hideAuthor) {
      return (
        <TableCell className='author' style={{minWidth: '140px'}}>Author</TableCell>
      );
    }
  }
  function renderPublisher(name){
    if (!props.hidePublisher) {
      return (
        <TableCell className='publisher'>{ name }</TableCell>
      );
    }
  }
  function renderPublisherHeader(){
    if (!props.hidePublisher) {
      return (
        <TableCell className='publisher' style={{minWidth: '200px'}}>Publisher</TableCell>
      );
    }
  }
  function renderEditor(name){
    if (!props.hideEditor) {
      return (
        <TableCell className='editor'>{ name }</TableCell>
      );
    }
  }
  function renderEditorHeader(){
    if (!props.hideEditor) {
      return (
        <TableCell className='editor' style={{minWidth: '140px'}}>Editor</TableCell>
      );
    }
  }
  function renderReviewer(name){
    if (!props.hideReviewer) {
      return (
        <TableCell className='reviewer'>{ name }</TableCell>
      );
    }
  }
  function renderReviewerHeader(){
    if (!props.hideReviewer) {
      return (
        <TableCell className='reviewer' style={{minWidth: '140px'}}>Reviewer</TableCell>
      );
    }
  }
  function renderEndorser(name){
    if (!props.hideEndorser) {
      return (
        <TableCell className='endorser'>{ name }</TableCell>
      );
    }
  }
  function renderEndorserHeader(){
    if (!props.hideEndorser) {
      return (
        <TableCell className='endorser' style={{minWidth: '140px'}}>Endorser</TableCell>
      );
    }
  }
  function renderScoring(score){
    if (!props.hideScoring) {
      return (
        <TableCell className='scoring' style={{minWidth: '180px'}}>{ score }</TableCell>
      );
    }
  }
  function renderScoringHeader(){
    if (!props.hideScoring) {
      return (
        <TableCell className='scoring'>Scoring</TableCell>
      );
    }
  }
  function renderTypeHeader(){
    if (!props.hideType) {
      return (
        <TableCell className='type'>Type</TableCell>
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
  function renderRiskAdjustmentHeader(){
    if (!props.hideRiskAdjustment) {
      return (
        <TableCell className='riskAdjustment'>Risk Adjustment</TableCell>
      );
    }
  }
  function renderRiskAdjustment(riskAdjustment){
    if (!props.hideRiskAdjustment) {
      return (
        <TableCell className='riskAdjustment'>{ riskAdjustment }</TableCell>
      );
    }
  }
  function renderRateAggregationHeader(){
    if (!props.hideRateAggregation) {
      return (
        <TableCell className='rateAggregation'>Rate Aggregation</TableCell>
      );
    }
  }
  function renderRateAggregation(rateAggregation){
    if (!props.hideRateAggregation) {
      return (
        <TableCell className='rateAggregation'>{ rateAggregation }</TableCell>
      );
    }
  }
  function renderSupplementalDataCountHeader(){
    if (!props.hideSupplementalData) {
      return (
        <TableCell className='rateAggregation'>Rate Aggregation</TableCell>
      );
    }
  }
  function renderSupplementalDataCount(rateAggregation){
    if (!props.hideSupplementalData) {
      return (
        <TableCell className='rateAggregation'>{ rateAggregation }</TableCell>
      );
    }
  }
  function renderContextHeader(){
    if (!props.hideContext) {
      return (
        <TableCell className='context'>Context</TableCell>
      );
    }
  }
  function renderContext(context){
    if (!props.hideContext) {
      return (
        <TableCell className='context'>{ context }</TableCell>
      );
    }
  }
  function renderPopulationCountHeader(){
    if (!props.hidePopulationCount) {
      return (
        <TableCell className='cohortCount'>Populations</TableCell>
      );
    }
  }
  function renderPopulationCount(cohortCount){
    if (!props.hidePopulationCount) {
      return (
        <TableCell className='cohortCount'>{ cohortCount }</TableCell>
      );
    }
  }

  function renderBarcode(id){
    if (!props.hideBarcode) {
      return (
        <TableCell><span className="barcode helveticas">{id}</span></TableCell>
      );
    }
  }
  function renderBarcodeHeader(){
    if (!props.hideBarcode) {
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


  if(props.lists){
    if(props.lists.length > 0){              
      props.lists.forEach(function(list){
        listsToRender.push(flattenList(list, internalDateFormat));
      });  
    }
  }

  if(listsToRender.length === 0){
    console.log('No lists to render');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < listsToRender.length; i++) {

      let selected = false;
      if(listsToRender[i].id === selectedListId){
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
          { renderToggle() }
          { renderActionIcons(listsToRender[i]) }
          { renderTitle(listsToRender[i].title) }          
          { renderDescription(listsToRender[i].description) }          
          { renderVersion(listsToRender[i].version) }
          { renderPublisher(listsToRender[i].publisher) }
          { renderStatus(listsToRender[i].status) }
          { renderAuthor(listsToRender[i].author) }
          { renderEditor(listsToRender[i].editor) }
          { renderLastEditedDate(listsToRender[i].lastEdited) }                    
          { renderReviewer(listsToRender[i].reviewer) }
          { renderLastReviewDate(listsToRender[i].lastReviewDate) }                    
          { renderEndorser(listsToRender[i].endorser) }
          { renderApprovalDate(listsToRender[i].approvalDate) }
          { renderScoring(listsToRender[i].scoring) }
          { renderType(listsToRender[i].type) }
          { renderRiskAdjustment(listsToRender[i].riskAdjustment) }
          { renderRateAggregation(listsToRender[i].rateAggregation) }
          { renderSupplementalDataCount(listsToRender[i].supplementalDataCount) }
          { renderContext(listsToRender[i].context) }
          { renderPopulationCount(listsToRender[i].cohortCount) }
          { renderBarcode(listsToRender[i].id)}
        </TableRow>
      );       
    }
  }

  return(
    <div>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            { renderToggleHeader() }
            { renderActionIconsHeader() }
            { renderTitleHeader() }
            { renderDescriptionHeader() }
            { renderVersionHeader() }
            { renderPublisherHeader() }
            { renderStatusHeader() }
            { renderAuthorHeader() }
            { renderEditorHeader() }
            { renderLastEditedDateHeader() }
            { renderReviewerHeader() }
            { renderLastReviewDateHeader() }
            { renderEndorserHeader() }
            { renderApprovalDateHeader() }
            { renderScoringHeader() }
            { renderTypeHeader() }
            { renderRiskAdjustmentHeader() }
            { renderRateAggregationHeader() }
            { renderSupplementalDataCountHeader() }
            { renderContextHeader() }
            { renderPopulationCountHeader() }
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

ListsTable.propTypes = {
  barcodes: PropTypes.bool,
  lists: PropTypes.array,
  selectedListId: PropTypes.string,

  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  showMinutes: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideApprovalDate: PropTypes.bool,
  hideVersion: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideTitle: PropTypes.bool,
  hideDescription: PropTypes.bool,
  hideLastEditedDate: PropTypes.bool,
  hideLastReviewed: PropTypes.bool,
  hidePublisher: PropTypes.bool,
  hideAuthor: PropTypes.bool,
  hideEditor: PropTypes.bool,
  hideReviewer: PropTypes.bool,
  hideEndorser: PropTypes.bool,
  hideScoring: PropTypes.bool,
  hideType: PropTypes.bool,
  hideRiskAdjustment: PropTypes.bool,
  hideRateAggregation: PropTypes.bool,
  hideSupplementalData: PropTypes.bool,
  hideContext: PropTypes.bool,
  hidePopulationCount: PropTypes.bool,
  hideBarcode: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string
};
ListsTable.defaultProps = {
  hideCheckbox: true,
  hideActionIcons: true,
  showMinutes: false,
  hideVersion: false,
  hideStatus: false,
  hideTitle: false,
  hideApprovalDate: false,
  hideDescription: true,
  hideLastEditedDate: false,
  hideLastReviewed: false,
  hidePublisher: false,
  hideAuthor: true,
  hideEditor: false,
  hideReviewer: false,
  hideEndorser: false,
  hideScoring: true,
  hideType: true,
  hideRiskAdjustment: true,
  hideRateAggregation: true,
  hideSupplementalData: true,
  hideContext: true,
  hidePopulationCount: false,
  hideBarcode: true,
  selectedListId: false,
  rowsPerPage: 5
}

export default ListsTable; 