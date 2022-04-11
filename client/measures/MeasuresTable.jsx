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
// FLATTENING / MAPPING

// dehydrateMeasure = function(measure, internalDateFormat){
//   let result = {
//     _id: '',
//     meta: '',
//     identifier: '',
//     publisher: '',
//     status: '',
//     title: '',
//     date: '',
//     approvalDate: '',
//     lastReviewDate: '',
//     lastEdited: '',
//     author: '',
//     reviewer: '',
//     endorser: '',
//     scoring: '',
//     type: '',
//     riskAdjustment: '',
//     rateAggregation: '',
//     supplementalDataCount: '',
//     context: '', 
//     version: ''
//   };

//   if(!internalDateFormat){
//     internalDateFormat = get(Meteor, "settings.public.defaults.internalDateFormat", "YYYY-MM-DD");
//   }

//   result._id =  get(measure, 'id') ? get(measure, 'id') : get(measure, '_id');
//   result.id = get(measure, 'id', '');
//   result.identifier = get(measure, 'identifier[0].value', '');

//   if(get(measure, 'lastReviewDate')){
//     result.lastReviewDate = moment(get(measure, 'lastReviewDate', '')).format(internalDateFormat);
//   }
//   if(get(measure, 'approvalDate')){
//     result.approvalDate = moment(get(measure, 'approvalDate', '')).format(internalDateFormat);
//   }
//   if(get(measure, 'date')){
//     result.lastEdited = moment(get(measure, 'date', '')).format(internalDateFormat);
//   }

//   result.publisher = get(measure, 'publisher', '');
//   result.title = get(measure, 'title', '');
//   result.description = get(measure, 'description', '');
//   result.status = get(measure, 'status', '');
//   result.version = get(measure, 'version', '');

//   result.context = get(measure, 'useContext[0].valueCodeableConcept.text', '');

//   result.editor = get(measure, 'editor[0].name', '');
//   result.reviewer = get(measure, 'reviewer[0].name', '');
//   result.endorser = get(measure, 'endorser[0].name', '');

//   result.scoring = get(measure, 'scoring.coding[0].display', '');
//   result.type = get(measure, 'type[0].coding[0].display', '');

//   result.riskAdjustment = get(measure, 'riskAdjustment', '');
//   result.rateAggregation = get(measure, 'rateAggregation', '');
  
//   let supplementalData = get(measure, 'supplementalData', []);
//   result.supplementalDataCount = supplementalData.length;

//   let cohorts = get(measure, 'group[0].population', []);
//   result.cohortCount = cohorts.length;


//   return result;
// }





function MeasuresTable(props){
  logger.info('Rendering the MeasuresTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.MeasuresTable');
  logger.data('MeasuresTable.props', {data: props}, {source: "MeasuresTable.jsx"});

  const classes = useStyles();

  let { 
    children, 

    measures,
    selectedMeasureId,

    query,
    paginationLimit,
    disablePagination,
    tableRowSize,

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

    formFactorLayout,

    page,
    onSetPage,

    ...otherProps 
  } = props;


  // ------------------------------------------------------------------------
  // Helper Functions

  function handleRowClick(_id){
    // console.log('Clicking row ' + _id)
    if(props.onRowClick){
      props.onRowClick(_id);
    }
  }

  function removeRecord(_id){
    console.log('Remove measure ', _id)
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
  function renderActionIcons(measure ){
    if (!props.hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ onMetaClick.bind(measure)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(measure._id)} />   */}
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
  function renderName(name){
    if (!props.hideName) {
      return (
        <TableCell className='name'>{ name }</TableCell>
      );
    }
  }
  function renderNameHeader(){
    if (!props.hideName) {
      return (
        <TableCell className='name'>Name</TableCell>
      );
    }
  }
  function renderTitle(title){
    if (!props.hideTitle) {
      return (
        <TableCell className='title' style={{minWidth: '360px'}}>{ title }</TableCell>
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
  function renderIdentifier(identifier){
    if (!props.hideIdentifier) {
      return (
        <TableCell className='identifier'>{ identifier }</TableCell>
      );
    }
  }
  function renderIdentifierHeader(){
    if (!props.hideIdentifier) {
      return (
        <TableCell className='identifier' style={{minWidth: '140px'}}>Identifier</TableCell>
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
  // Table Rows



  let tableRows = [];
  let measuresToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }


  if(measures){
    if(measures.length > 0){              
      measures.forEach(function(measure){
        measuresToRender.push(FhirDehydrator.dehydrateMeasure(measure, internalDateFormat));
      });  
    }
  }


  let rowStyle = {
    cursor: 'pointer', 
    height: '52px'
  }
  if(measuresToRender.length === 0){
    console.log('No measures to render');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < measuresToRender.length; i++) {


      let selected = false;
      if(measuresToRender[i].id === selectedMeasureId){
        selected = true;
      }
      if(get(measuresToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }
      tableRows.push(
        <TableRow 
          className="measureRow" 
          key={i} 
          onClick={ handleRowClick.bind(this, measuresToRender[i]._id)} 
          hover={true} 
          style={rowStyle} 
          selected={selected}
        >
          { renderToggle() }
          { renderActionIcons(measuresToRender[i]) }
          { renderIdentifier(measuresToRender[i].identifier) }
          { renderName(measuresToRender[i].name) }          
          { renderTitle(measuresToRender[i].title) }          
          { renderDescription(measuresToRender[i].description) }          
          { renderVersion(measuresToRender[i].version) }
          { renderPublisher(measuresToRender[i].publisher) }
          { renderStatus(measuresToRender[i].status) }
          { renderAuthor(measuresToRender[i].author) }
          { renderEditor(measuresToRender[i].editor) }
          { renderLastEditedDate(measuresToRender[i].lastEdited) }                    
          { renderReviewer(measuresToRender[i].reviewer) }
          { renderLastReviewDate(measuresToRender[i].lastReviewDate) }                    
          { renderEndorser(measuresToRender[i].endorser) }
          { renderApprovalDate(measuresToRender[i].approvalDate) }
          { renderScoring(measuresToRender[i].scoring) }
          { renderType(measuresToRender[i].type) }
          { renderRiskAdjustment(measuresToRender[i].riskAdjustment) }
          { renderRateAggregation(measuresToRender[i].rateAggregation) }
          { renderSupplementalDataCount(measuresToRender[i].supplementalDataCount) }
          { renderContext(measuresToRender[i].context) }
          { renderPopulationCount(measuresToRender[i].cohortCount) }
          { renderBarcode(measuresToRender[i]._id)}
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
            { renderIdentifierHeader() }
            { renderNameHeader() }
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

MeasuresTable.propTypes = {
  barcodes: PropTypes.bool,
  measures: PropTypes.array,
  selectedMeasureId: PropTypes.string,

  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  showMinutes: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideApprovalDate: PropTypes.bool,
  hideVersion: PropTypes.bool,
  hideName: PropTypes.bool,
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
  onSetPage: PropTypes.func,

  page: PropTypes.number,
  actionButtonLabel: PropTypes.string,
  tableRowSize: PropTypes.string,

  formFactorLayout: PropTypes.string
};
MeasuresTable.defaultProps = {
  hideCheckbox: true,
  hideActionIcons: true,
  showMinutes: false,
  hideVersion: false,
  hideName: false,
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
  selectedMeasureId: '',
  rowsPerPage: 5,
  tableRowSize: 'medium'
}

export default MeasuresTable; 