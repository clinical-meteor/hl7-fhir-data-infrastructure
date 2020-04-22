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

flattenMeasure = function(measure, internalDateFormat){
  let result = {
    _id: '',
    meta: '',
    identifier: '',
    publisher: '',
    status: '',
    title: '',
    date: '',
    lastReviewDate: '',
    author: '',
    reviewer: '',
    scoring: '',
    type: '',
    riskAdjustment: '',
    rateAggregation: '',
    supplementalDataCount: '',
    context: ''
  };

  if(!internalDateFormat){
    internalDateFormat = get(Meteor, "settings.public.defaults.internalDateFormat", "YYYY-MM-DD");
  }

  result._id =  get(measure, 'id') ? get(measure, 'id') : get(measure, '_id');
  result.id = get(measure, 'id', '');
  result.identifier = get(measure, 'identifier[0].value', '');
  result.date = moment(get(measure, 'date', '')).format(internalDateFormat);
  result.lastReviewDate = moment(get(measure, 'lastReviewDate', '')).format(internalDateFormat);

  result.publisher = get(measure, 'publisher', '');
  result.title = get(measure, 'title', '');
  result.status = get(measure, 'status', '');

  result.context = get(measure, 'useContext[0].valueCodeableConcept.text', '');

  if(get(measure, 'author.display')){
    result.author = get(measure, 'author.display', '');
  } else {
    result.author = FhirUtilities.pluckReferenceId(get(measure, 'author.reference'));
  }

  if(get(measure, 'reviewer.display')){
    result.reviewer = get(measure, 'reviewer.display', '');
  } else {
    result.reviewer = FhirUtilities.pluckReferenceId(get(measure, 'reviewer.reference'));
  }

  result.scoring = get(measure, 'scoring.coding[0].display', '');
  result.type = get(measure, 'type.coding[0].display', '');

  result.riskAdjustment = get(measure, 'riskAdjustment', '');
  result.rateAggregation = get(measure, 'rateAggregation', '');
  
  let supplementalData = get(measure, 'supplementalData', []);
  result.supplementalDataCount = supplementalData.length;

  let cohorts = get(measure, 'group[0].population', []);
  result.cohortCount = cohorts.length;


  return result;
}





function MeasuresTable(props){
  logger.info('Rendering the MeasuresTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.MeasuresTable');
  logger.data('MeasuresTable.props', {data: props}, {source: "MeasuresTable.jsx"});

  const classes = useStyles();

  let { 
    children, 

    data,
    conditions,
    query,
    paginationLimit,
    disablePagination,

    hideStatus,
    hidePublisher,
    hideTitle,
    hideDescription,
    hideDate,
    hideLastReviewed,
    hideAuthor,
    hideReviewer,
    hideScoring,
    hideType,
    hideRiskAdjustment,
    hideRateAggregation,
    hideSupplementalData,
    hideContext,
    hidePopulationCount,

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

  function rowClick(id){
    console.log('Clicking row ' + id)
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
    if (!props.hideCheckboxes) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Toggle</TableCell>
      );
    }
  }
  function renderToggle(){
    if (!props.hideCheckboxes) {
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

  function renderDate(date){
    if (!props.hideDate) {
      return (
        <TableCell className='date'>{ date }</TableCell>
      );
    }
  }
  function renderDateHeader(){
    if (!props.hideDate) {
      return (
        <TableCell className='date'>Date</TableCell>
      );
    }
  }
  function renderLastReviewedDate(date){
    if (!props.hideLastReviewed) {
      return (
        <TableCell className='lastReviewed'>{ date }</TableCell>
      );
    }
  }
  function renderLastReviewedDateHeader(){
    if (!props.hideLastReviewed) {
      return (
        <TableCell className='lastReviewed'>Last Reviewed</TableCell>
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
        <TableCell className='author'>Author</TableCell>
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
        <TableCell className='publisher'>Publisher</TableCell>
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
        <TableCell className='reviewer'>Reviewer</TableCell>
      );
    }
  }
  function renderScoring(score){
    if (!props.hideScoring) {
      return (
        <TableCell className='scoring'>{ score }</TableCell>
      );
    }
  }
  function renderScoringHeader(){
    if (!props.hideScoring) {
      return (
        <TableCell className='scoring'>Reviewer</TableCell>
      );
    }
  }
  function renderTypeHeader(){
    if (!props.hideType) {
      return (
        <TableCell className='category'>Category</TableCell>
      );
    }
  }
  function renderType(category){
    if (!props.hideType) {
      return (
        <TableCell className='category'>{ category }</TableCell>
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
    if (!props.hideIdentifier) {
      return (
        <TableCell><span className="barcode">{id}</span></TableCell>
      );
    }
  }
  function renderBarcodeHeader(){
    if (!props.hideIdentifier) {
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
  let measuresToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.internalDateFormat){
    internalDateFormat = props.dateFormat;
  }


  if(props.measures){
    if(props.measures.length > 0){              
      props.measures.forEach(function(measure){
        measuresToRender.push(flattenMeasure(measure, internalDateFormat));
      });  
    }
  }

  if(measuresToRender.length === 0){
    console.log('No measures to render');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < measuresToRender.length; i++) {
      tableRows.push(
        <TableRow className="measureRow" key={i} onClick={ rowClick(measuresToRender[i]._id)} >
          { renderToggle() }
          { renderActionIcons(measuresToRender[i]) }
          { renderDate(measuresToRender[i].date) }

          { renderPublisher(measuresToRender[i].publisher) }
          { renderStatus(measuresToRender[i].status) }
          { renderTitle(measuresToRender[i].title) }
          { renderLastReviewedDate(measuresToRender[i].lastReviewedDate) }
          { renderAuthor(measuresToRender[i].author) }
          { renderReviewer(measuresToRender[i].reviewer) }
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
            { renderDateHeader() }

            { renderPublisherHeader() }
            { renderStatusHeader() }
            { renderTitleHeader() }
            { renderLastReviewedDateHeader() }
            { renderAuthorHeader() }
            { renderReviewerHeader() }
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
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  showMinutes: PropTypes.bool,

  hideDate: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideTitle: PropTypes.bool,
  hideDescription: PropTypes.bool,
  hideLastReviewed: PropTypes.bool,
  hidePublisher: PropTypes.bool,
  hideAuthor: PropTypes.bool,
  hideReviewer: PropTypes.bool,
  hideScoring: PropTypes.bool,
  hideType: PropTypes.bool,
  hideRiskAdjustment: PropTypes.bool,
  hideRateAggregation: PropTypes.bool,
  hideSupplementalData: PropTypes.bool,
  hideContext: PropTypes.bool,
  hidePopulationCount: PropTypes.bool,
  
  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string
};
MeasuresTable.defaultProps = {
  showMinutes: false,
  hideStatus: false,
  hideTitle: false,
  hideDate: false,
  hideDescription: true,
  hideLastReviewed: true,
  hidePublisher: false,
  hideAuthor: true,
  hideReviewer: true,
  hideScoring: true,
  hideType: true,
  hideRiskAdjustment: true,
  hideRateAggregation: true,
  hideSupplementalData: true,
  hideContext: true,
  hidePopulationCount: false,
  rowsPerPage: 5
}

export default MeasuresTable; 