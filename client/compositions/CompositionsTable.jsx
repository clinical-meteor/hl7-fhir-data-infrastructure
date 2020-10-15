import React from 'react';
import PropTypes from 'prop-types';

import { 
  CssBaseline,
  Grid, 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Tab, 
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';

import TableNoData from 'material-fhir-ui';

import moment from 'moment'
import _ from 'lodash';
let get = _.get;
let set = _.set;

// import { FaTags, FaCode, FaPuzzlePiece, FaLock  } from 'react-icons/fa';
// import { GoTrashcan } from 'react-icons/go';

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


flattenComposition = function(composition){
  let result = {
    _id: '',
    meta: '',
    subject: '',
    subjectId: '',
    status: '',
    statusHistory: 0,
    periodStart: '',
    periodEnd: '',
    reasonCode: '', 
    reasonDisplay: '', 
    typeCode: '',
    typeDisplay: '',
    classCode: ''
  };

  result._id =  get(composition, 'id') ? get(composition, 'id') : get(composition, '_id');


  if(get(composition, 'subject.display', '')){
    result.subject = get(composition, 'subject.display', '');
  } else {
    result.subject = get(composition, 'subject.reference', '');
  }
  result.subjectId = get(composition, 'subject.reference', '');

  result.status = get(composition, 'status', '');
  result.periodStart = moment(get(composition, 'period.start', '')).format("YYYY-MM-DD hh:mm");
  result.periodEnd = moment(get(composition, 'period.end', '')).format("YYYY-MM-DD hh:ss");
  result.reasonCode = get(composition, 'reason[0].coding[0].code', '');
  result.reasonDisplay = get(composition, 'reason[0].coding[0].display', '');
  result.typeCode = get(composition, 'type[0].coding[0].code', '');
  result.typeDisplay = get(composition, 'type[0].coding[0].display', '');

  if(get(composition, 'class.code')){
    result.classCode = get(composition, 'class.code', '');
  } else if(get(composition, 'class')){
    result.classCode = get(composition, 'class', '');
  }

  let statusHistory = get(composition, 'statusHistory', []);

  result.statusHistory = statusHistory.length;

  return result;
}


// export class CompositionsTable extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       selected: [],
//       compositions: []
//     }
//   }
//   getMeteorData() {

//     // this should all be handled by props
//     // or a mixin!
//     let data = {
//       style: {
//         text: Glass.darkroom()
//       },
//       selected: [],
//       compositions: []
//     };

//     if(props.data){
//       console.log('props.data', props.data);

//       if(props.data.length > 0){              
//         props.data.forEach(function(composition){
//           data.compositions.push(flattenComposition(composition));
//         });  
//       }
//     } else {
//       let query = {};
//       if(props.query){
//         query = props.query
//       }
//       if(props.hideEnteredInError){
//         query['verificationStatus'] = {
//           $nin: ['entered-in-error']  // unconfirmed | provisional | differential | confirmed | refuted | entered-in-error
//         }
//       }

//       data.compositions = Compositions.find(query).map(function(composition){
//         return flattenComposition(composition);
//       });
//     }

//     if(process.env.NODE_ENV === "test") console.log("CompositionsTable[data]", data);
//     return data;
//   }




function CompositionsTable(props){
  console.log('CompositionsTable.props', props);
  // console.log('CompositionsTable.props.compositions', props.compositions);

  const classes = useStyles();

  function handleChange(row, key, value) {
    const source = this.state.source;
    source[row][key] = value;
    this.setState({source});
  }
  function displayOnMobile(width){
    let style = {};
    if(['iPhone'].includes(window.navigator.platform)){
      style.display = "none";
    }
    if(width){
      style.width = width;
    }
    return style;
  }
  function handleSelect(selected) {
    this.setState({selected});
  }
  function getDate(){
    return "YYYY/MM/DD";
  }
  function noChange(){
    return "";
  }
  function rowClick(id){
    Session.set("selectedCompositionId", id);
    Session.set('compositionPageTabIndex', 1);
    Session.set('compositionDetailState', false);
  }
  function renderActionIconsHeader(){
    if (!props.hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(composition ){
    if (!props.hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ onMetaClick.bind(composition)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(composition._id)} />   */}
        </TableCell>
      );
    }
  } 
  function removeRecord(_id){
    console.log('Remove composition ', _id)
    if(props.onRemoveRecord){
      props.onRemoveRecord(_id);
    }
  }
  function onActionButtonClick(id){
    if(typeof props.onActionButtonClick === "function"){
      props.onActionButtonClick(id);
    }
  }
  function cellClick(id){
    if(typeof props.onCellClick === "function"){
      props.onCellClick(id);
    }
  }

  function onMetaClick(patient){
    let self = this;
    if(props.onMetaClick){
      props.onMetaClick(self, patient);
    }
  }
  function renderBarcode(id){
    if (!props.hideIdentifier) {
      return (
        <TableCell><span className="barcode helvetica">{id}</span></TableCell>
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
  function renderSubject(id){
    if (!props.hideSubjects) {
      return (
        <TableCell className='name'>{ id }</TableCell>
      );
    }
  }
  function renderSubjectHeader(){
    if (!props.hideSubjects) {
      return (
        <TableCell className='name'>Subject</TableCell>
      );
    }
  }
  function renderStatus(valueString){
    if (!props.hideStatus) {
      return (
        <TableCell className='value'>{ valueString }</TableCell>
      );
    }
  }
  function renderStatusHeader(){
    if (!props.hideStatus) {
      return (
        <TableCell className='value'>Value</TableCell>
      );
    }
  }

  function renderHistory(valueString){
    if (!props.hideHistory) {
      return (
        <TableCell className='history'>{ valueString }</TableCell>
      );
    }
  }
  function renderHistoryHeader(){
    if (!props.hideHistory) {
      return (
        <TableCell className='history'>Value</TableCell>
      );
    }
  }

  function renderTypeCodeHeader(){
    if (!props.hideTypeCode) {
      return (
        <TableCell className='typecode'>TypeCode</TableCell>
      );
    }
  }
  function renderTypeCode(code){
    if (!props.hideTypeCode) {
      return (
        <TableCell className='typecode'>{ code }</TableCell>
      );  
    }
  }
  function renderClassCodeHeader(){
    if (!props.hideClassCode) {
      return (
        <TableCell className='classcode'>Class</TableCell>
      );
    }
  }
  function renderClassCode(code){
    if (!props.hideClassCode) {
      return (
        <TableCell className='classcode'>{ code }</TableCell>
      );  
    }
  }
  function renderReasonCodeHeader(){
    if (!props.hideReasonCode) {
      return (
        <TableCell className='reasoncode'>ReasonCode</TableCell>
      );
    }
  }
  function renderReasonCode(code){
    if (!props.hideReasonCode) {
      return (
        <TableCell className='reasoncode'>{ code }</TableCell>
      );  
    }
  }
  function renderReasonHeader(){
    if (!props.hideReason) {
      return (
        <TableCell className='reason'>Reason</TableCell>
      );
    }
  }
  function renderReason(code){
    if (!props.hideReason) {
      return (
        <TableCell className='reason'>{ code }</TableCell>
      );  
    }
  }
  function renderCategoryHeader(){
    if (props.multiline === false) {
      return (
        <TableCell className='category'>Category</TableCell>
      );
    }
  }
  function renderCategory(category){
    if (props.multiline === false) {
      return (
        <TableCell className='category'>{ category }</TableCell>
      );
    }
  }
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



  let tableRows = [];
  let compositionsToRender = [];
  if(props.compositions){
    if(props.compositions.length > 0){              
      props.compositions.forEach(function(composition){
        compositionsToRender.push(flattenComposition(composition));
      });  
    }
  }

  if(compositionsToRender.length === 0){
    logger.trace('CompositionsTable:  No compositions to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < compositionsToRender.length; i++) {
      if(props.multiline){
        tableRows.push(
          <TableRow className="compositionRow" key={i} onClick={ rowClick(compositionsToRender[i]._id)} >
            { renderToggle() }
            { renderActionIcons(compositionsToRender[i]) }
            { renderSubject(compositionsToRender[i].subject)}
            { renderClassCode(compositionsToRender[i].classCode) }
            { renderTypeCode(compositionsToRender[i].typeCode) }
            {/* <TableCell className='classCode' >{compositionsToRender[i].classCode }</TableCell> */}
            {/* <TableCell className='typeCode' >{compositionsToRender[i].typeCode }</TableCell> */}
            <TableCell className='typeDisplay' >{compositionsToRender[i].typeDisplay }</TableCell>
            { renderReasonCode(compositionsToRender[i].reasonCode)}
            { renderReason(compositionsToRender[i].reasonDisplay)}
            {/* <TableCell className='reasonCode' >{compositionsToRender[i].reasonCode }</TableCell>
            <TableCell className='reasonDisplay' >{compositionsToRender[i].reasonDisplay }</TableCell> */}

            { renderStatus(compositionsToRender[i].status)}
            { renderHistory(compositionsToRender[i].statusHistory)}

            {/* <TableCell className='status' >{compositionsToRender[i].status }</TableCell>
            <TableCell className='statusHistory' >{compositionsToRender[i].statusHistory }</TableCell> */}
            <TableCell className='periodStart' style={{minWidth: '140px'}}>{compositionsToRender[i].periodStart }</TableCell>
            <TableCell className='periodEnd' style={{minWidth: '140px'}}>{compositionsToRender[i].periodEnd }</TableCell>
            { renderBarcode(compositionsToRender[i]._id)}
          </TableRow>
        );    

      } else {
        tableRows.push(
          <TableRow className="compositionRow" key={i} onClick={ rowClick.bind(compositionsToRender[i]._id)} >            
            { renderToggle() }
            { renderActionIcons(compositionsToRender[i]) }
            { renderSubject(compositionsToRender[i].subject)}
            { renderClassCode(compositionsToRender[i].classCode) }
            { renderTypeCode(compositionsToRender[i].typeCode) }
            {/* <TableCell className='classCode' >{ compositionsToRender[i].classCode }</TableCell> */}
            {/* <TableCell className='typeCode' >{ compositionsToRender[i].typeCode }</TableCell> */}
            <TableCell className='typeDisplay' >{ compositionsToRender[i].typeDisplay }</TableCell>
            { renderReasonCode(compositionsToRender[i].reasonCode)}
            { renderReason(compositionsToRender[i].reasonDisplay)}
            {/* <TableCell className='reasonCode' >{ compositionsToRender[i].reasonCode }</TableCell>
            <TableCell className='reasonDisplay' >{ compositionsToRender[i].reasonDisplay }</TableCell> */}

            { renderStatus(compositionsToRender[i].status)}
            { renderHistory(compositionsToRender[i].statusHistory)}

            {/* <TableCell className='status' >{ compositionsToRender[i].status }</TableCell>
            <TableCell className='statusHistory' >{ compositionsToRender[i].statusHistory }</TableCell> */}
            <TableCell className='periodStart' style={{minWidth: '140px'}}>{ compositionsToRender[i].periodStart }</TableCell>
            <TableCell className='periodEnd' style={{minWidth: '140px'}}>{ compositionsToRender[i].periodEnd }</TableCell>
            { renderBarcode(compositionsToRender[i]._id)}
          </TableRow>
        );    
      }
    }
  }

  return(
    <Table size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          { renderToggleHeader() }
          { renderActionIconsHeader() }
          { renderSubjectHeader() }
          { renderClassCodeHeader() }
          { renderTypeCodeHeader() }
          {/* <TableCell className='classCode'>Class</TableCell> */}
          {/* <TableCell className='typeCode'>TypeCode</TableCell> */}
          <TableCell className='typeDisplay'>Type</TableCell>
          { renderReasonCodeHeader() }
          { renderReasonHeader() }
          {/* <TableCell className='reasonCode'>ReasonCode</TableCell>
          <TableCell className='reasonDisplay'>Reason</TableCell> */}

          { renderStatusHeader() }
          { renderHistoryHeader() }

          {/* <TableCell className='status'>Status</TableCell>
          <TableCell className='statusHistory'>History</TableCell> */}
          <TableCell className='start' style={{minWidth: '140px'}}>Start</TableCell>
          <TableCell className='end' style={{minWidth: '140px'}}>End</TableCell>
          { renderBarcodeHeader() }
        </TableRow>
      </TableHead>
      <TableBody>
        { tableRows }
      </TableBody>
    </Table>
  );
}

CompositionsTable.propTypes = {
  barcodes: PropTypes.bool,
  compositions: PropTypes.array,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  hideClassCode: PropTypes.bool,
  hideTypeCode: PropTypes.bool,
  hideReason: PropTypes.bool,
  hideReasonCode: PropTypes.bool,
  hideSubjects: PropTypes.bool,
  hideCheckboxes: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideHistory: PropTypes.bool,
  enteredInError: PropTypes.bool,
  multiline: PropTypes.bool,
  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,
  formFactorLayout: PropTypes.string
};


export default CompositionsTable; 