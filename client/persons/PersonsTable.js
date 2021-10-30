import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPageIcon
} from '@material-ui/core';


// import Icon from 'react-icons-kit'
// import { tag } from 'react-icons-kit/fa/tag'
// import {iosTrashOutline} from 'react-icons-kit/ionicons/iosTrashOutline'

// import TableNoData from '../components/TableNoData';

import { useTheme } from '@material-ui/styles';

import moment from 'moment';

import _ from 'lodash';
let get = _.get;
let set = _.set;

import { FhirDehydrator } from '../../lib/FhirDehydrator';


//===========================================================================
// THEMING

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
  },
  avatar: {
    backgroundColor: 'rgb(188, 188, 188)',
    userSelect: 'none',
    borderRadius: '2px',
    height: '40px',
    width: '40px'
  }
};

import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
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




//===========================================================================
// FLATTENING / MAPPING


function dehydratePerson(person, dateFormat){
  let result = {
    _id: get(person, '_id'),
    id: get(person, 'id'),
    meta: '',
    identifier: '',
    active: true,
    gender: get(person, 'gender'),
    name: '',
    mrn: '',
    birthDate: '',
    photo: "/thumbnail-blank.png",
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    maritalStatus: '',
    preferredLanguage: '',
    species: '',
    resourceCounts: '',
    deceased: false
  };

  result._id =  get(person, 'id') ? get(person, 'id') : get(person, '_id');
  result.id = get(person, 'id', '');
  result.identifier = get(person, 'identifier[0].value', '');

  result.identifier = get(person, 'identifier[0].value', '');
  result.active = get(person, 'active', true).toString();
  
  result.gender = get(person, 'gender', '');

  // person name has gone through a number of revisions, and we need to search a few different spots, and assemble as necessary  
  let resultingNameString = "";

  let nameText = get(person, 'name.text', '');
  if(nameText.length > 0){
    // some systems will store the name as it is to be displayed in the name[0].text field
    // if that's present, use it
    resultingNameString = get(person, 'name.text', '');    
  } else {
    // the majority of systems out there are SQL based and make a design choice to store as 'first' and 'last' name
    // critiques of that approach can be saved for a later time
    // but suffice it to say that we need to assemble the parts

    if(get(person, 'name[0].prefix[0]')){
      resultingNameString = get(person, 'name[0].prefix[0]')  + ' ';
    }

    if(get(person, 'name[0].given[0]')){
      resultingNameString = resultingNameString + get(person, 'name[0].given[0]')  + ' ';
    }

    if(get(person, 'name[0].family')){
      // R4 - droped the array of family names; one authoritative family name per person
      resultingNameString = resultingNameString + get(person, 'name[0].family')  + ' ';
    } else if (get(person, 'name[0].family[0]')){
      // DSTU2 and STU3 - allows an array of family names
      resultingNameString = resultingNameString + get(person, 'name[0].family[0]')  + ' ';
    }
    
    if(get(person, 'name[0].suffix[0]')){
      resultingNameString = resultingNameString + ' ' + get(person, 'name[0].suffix[0]');
    }
  }

  // remove any whitespace from the name
  result.name = resultingNameString.trim();

  // there's an off-by-1 error between momment() and Date() that we want
  // to account for when converting back to a string
  // which is why we run it through moment()

  result.birthDate = moment(get(person, "birthDate")).format(dateFormat)

  result.photo = get(person, 'photo[0].url', '');

  result.maritalStatus = get(person, 'maritalStatus[0].text', '');

  let communicationArray = [];
  if(get(person, 'communication') && Array.isArray(get(person, 'communication'))){
    communicationArray = get(person, 'communication');
    // first, we're going to try to loop through the communications array 
    // and find an authoritatively preferred language
    communicationArray.forEach(function(communication){
      if(get(communication, "preferred")){
        if(get(communication, "text")){
          // using the text field if possible
          result.preferredLanguage = get(communication, "text");
        } else if(get(communication, "language.text")){
          // using the text field if possible
          result.preferredLanguage = get(communication, "language.text");
        } else if(get(communication, "language.coding[0].display")){
          // using the text field if possible
          result.preferredLanguage = get(communication, "language.coding[0].display");
        } 
      }
    })
    // // if we didn't find any langauge that is marked as preferred 
    // if(result.preferredLanguage === ""){
    //   // then we try the same thing on the first language listed
    //   if(get(communicationArray[0], "text")){
    //     result.preferredLanguage = get(communicationArray[0], "text");
    //   } else if(get(communicationArray[0], "language.text")){
    //     result.preferredLanguage = get(communicationArray[0], "text");
    //   } else if(get(communicationArray[0], "language.coding[0].display")){
    //     result.preferredLanguage = get(communicationArray[0], "language.coding[0].display");
    //   } 

    // }
  }


  // is the person dead?  :(
  result.deceased = get(person, 'deceasedBoolean', '');

  // DSTU2 & STU3 
  result.species = get(person, 'animal.species.text', '');


  // address
  result.addressLine = get(person, 'address[0].line[0]')
  result.city = get(person, 'address[0].city')
  result.state = get(person, 'address[0].state')
  result.postalCode = get(person, 'address[0].postalCode')
  result.country = get(person, 'address[0].country')

  // console.log('dehydrateed', result)
  return result;
}


//===========================================================================
// PAGINATION  

function TablePaginationActions(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = event => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = event => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = event => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = event => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};



//===========================================================================
// MAIN COMPONENT  

function PersonsTable(props){
  // console.log('PersonsTable', props)

  let { 
    children, 

    id,
    fhirVersion,
    persons,
    selectedPersonId,

    hideCheckbox,
    hideActionIcons,
    hideIdentifier,
    hideActive,
    hideName,
    hideGender,
    hideBirthDate,
    hideMaritalStatus,
    hideLanguage,
    hideSpecies,
    hideAddress,
    hideCity,
    hideState,
    hidePostalCode,
    hideCountry,
    hideSystemBarcode,
    hideFhirBarcode,
    showActionButton,
    
    noDataMessagePadding,
    rowsPerPage,
    onCellClick,
    onRowClick,
    onMetaClick, 
    onActionButtonClick,
    actionButtonLabel,

    defaultAvatar,
    disablePagination,
    paginationLimit,
    paginationCount,
    dateFormat,
    hideCounts,
    cursors, 
    font3of9,

    formFactorLayout,
    multiline,

    count,
    tableRowSize,

    ...otherProps 
  } = props;



  // ------------------------------------------------------------------------
  // Form Factors

  if(formFactorLayout){
    logger.verbose('formFactorLayout', formFactorLayout + ' ' + window.innerWidth);

    switch (formFactorLayout) {
      case "phone":
        hideActionIcons = true;
        hideName = false;
        hideGender = false;
        hideBirthDate = false;
        hideMaritalStatus = true;
        hideLanguage = true;
        hideSpecies = true;
        hideAddress = true;
        hideCity = true;
        hideState = true;
        hidePostalCode = true;
        hideCountry = true;
        hideCounts = true;
        hideSystemBarcode = true;
        hideFhirBarcode = true;
        hideIdentifier = true;
        hideActive = true;
        break;
      case "tablet":
        hideActionIcons = true;
        hideName = false;
        hideGender = false;
        hideBirthDate = false;
        hideMaritalStatus = true;
        hideLanguage = true;
        hideSpecies = true;
        hideAddress = true;
        hideCity = true;
        hideState = true;
        hidePostalCode = true;
        hideCountry = true;
        hideCounts = true;
        hideSystemBarcode = true;
        hideFhirBarcode = true;
        break;
      case "web":
        hideActionIcons = true;
        hideName = false;
        hideGender = false;
        hideBirthDate = false;
        hideMaritalStatus = false;
        hideLanguage = false;
        hideSpecies = true;
        hideAddress = true;
        hideCity = false;
        hideState = false;
        hidePostalCode = false;
        hideCountry = true;
        hideCounts = true;
        hideSystemBarcode = true;
        hideFhirBarcode = true;
        break;
      case "desktop":
        hideActionIcons = true;
        hideName = false;
        hideGender = false;
        hideBirthDate = false;
        hideMaritalStatus = false;
        hideLanguage = false;
        hideSpecies = true;
        hideAddress = true;
        hideCity = false;
        hideState = false;
        hidePostalCode = false;
        hideCountry = false;
        hideCounts = true;
        hideSystemBarcode = true;
        hideFhirBarcode = true;
        break;
      case "hdmi":
        hideActionIcons = true;
        hideName = false;
        hideGender = false;
        hideBirthDate = false;
        hideMaritalStatus = false;
        hideLanguage = false;
        hideSpecies = true;
        hideAddress = true;
        hideCity = false;
        hideState = false;
        hidePostalCode = false;
        hideCountry = false;
        hideCounts = true;
        hideSystemBarcode = true;
        hideFhirBarcode = false;
        break;            
    }
  }


    //---------------------------------------------------------------------
  // Table Rows

  let tableRows = [];
  let footer;

  const [page, setPage] = useState(0);
  const [rowsPerPageToRender, setRowsPerPageToRender] = useState(rowsPerPage);
  const [rows, setRows] = useState([]);

  const emptyRows = rowsPerPageToRender - Math.min(rowsPerPageToRender, rows.length - page * rowsPerPageToRender);


  if(paginationCount){
    paginationCount = paginationCount;
  } else {
    paginationCount = rows.length;
  }


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPageToRender(parseInt(event.target.value, 10));
    setPage(0);
  };


  //================================================================
  // Render Methods


  function renderRowAvatarHeader(){
    if (get(this, 'defaultAvatar') && (showAvatars === true)) {
      return (
        <TableCell className='avatar'>photo</TableCell>
      );
    }
  }
  function renderRowAvatar(person, avatarStyle){
    //console.log('renderRowAvatar', person, avatarStyle)
    
    if (get(this, 'defaultAvatar') && (showAvatars === true)) {
      return (
        <TableCell className='avatar'>
          <img 
            src={person.photo} 
            onError={(e)=>{e.target.onerror = null; e.target.src = get(this, 'defaultAvatar')}}
            style={avatarStyle}
          />
        </TableCell>
      );
    }
  }
  function renderIdentifier(identifier){
    if (!hideIdentifier) {
      return (
        <TableCell className="identifier hidden-on-phone">{ identifier }</TableCell>
      );
    }
  }
  function renderIdentifierHeader(){
    if (!hideIdentifier) {
      return (
        <TableCell className="identifier hidden-on-phone">Identifier</TableCell>
      );
    }
  }

  function renderSpeciesHeader(){
    if(!hideSpecies || (fhirVersion === "R4")){
      return (
        <TableCell className='species'>Species</TableCell>
      );
    }
  }
  function renderSpecies(person){
    if(!hideSpecies || (fhirVersion === "R4")){
      return (
        <TableCell className='species' style={styles.cellHideOnPhone}>
          {person.species}
        </TableCell>
      );
    }
  }
  function renderActionButtonHeader(){
    if (showActionButton === true) {
      return (
        <TableCell className='ActionButton' >Action</TableCell>
      );
    }
  }
  function renderActionButton(person, avatarStyle){
    if (showActionButton === true) {
      return (
        <TableCell className='ActionButton' >
          <Button onClick={ handleActionButtonClick.bind('this', personsToRender[i]._id)}>{ get(props, "actionButtonLabel", "") }</Button>
        </TableCell>
      );
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
  function selectPersonRow(personId){
    console.log('Selecting a new Person...');
    if(typeof onRowClick  === "function"){
      onRowClick(personId);
    }
  }
  function renderActionIconsHeader(){
    if (!hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>Actions</TableCell>
      );
    }
  }
  function removeRecord(_id){
    console.log('Remove person ', _id)
    if(onRemoveRecord){
      onRemoveRecord(_id);
    }
    // Persons._collection.remove({_id: _id})
  }
  function renderActionIcons(person ){
    if (!hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ handleMetaClick.bind(this, person)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(this, person._id)} />   */}
          {/* <Icon icon={iosTrashOutline} style={iconStyle} onClick={ removeRecord.bind(this, person._id)} /> */}
        </TableCell>
      );
    }
  } 

  function renderAddressHeader(){
    if (!hideAddress) {
      return (
        <TableCell className="streetAddress">Address</TableCell>
      );
    }
  }
  function renderAddress(streetAddress){
    if (!hideAddress) {
      return (
        <TableCell className='streetAddress'>{streetAddress}</TableCell>
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
        <TableCell className='city'>{city}</TableCell>
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
        <TableCell className='state'>{state}</TableCell>
      );
    }
  }
  function renderZipCodeHeader(){
    if (!hidePostalCode) {
      return (
        <TableCell className="zipCode">Zip Code</TableCell>
      );
    }
  }
  function renderZipCode(zipCode){
    if (!hidePostalCode) {
      return (
        <TableCell className='zipCode'>{zipCode}</TableCell>
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
        <TableCell className='country'>{country}</TableCell>
      );
    }
  }


  function renderMaritalStatusHeader(){
    if (!hideMaritalStatus) {
      return (
        <TableCell className="maritalStatus">Marital Status</TableCell>
      );
    }
  }
  function renderMaritalStatus(maritalStatus){
    if (!hideMaritalStatus) {
      return (
        <TableCell className='maritalStatus'>{maritalStatus}</TableCell>
      );
    }
  }

  function renderLanguageHeader(){
    if (!hideLanguage) {
      return (
        <TableCell className="language">Language</TableCell>
      );
    }
  }
  function renderLanguage(language){
    if (!hideLanguage) {
      return (
        <TableCell className='language'>{language}</TableCell>
      );
    }
  }
  function renderIsActiveHeader(){
    if (!hideActive) {
      return (
        <TableCell className="isActive">Active</TableCell>
      );
    }
  }
  function renderIsActive(isActive){
    if (!hideActive) {
      return (
        <TableCell className='isActive'>{isActive}</TableCell>
      );
    }
  }


  function renderNameHeader(){
    if (!hideName) {
      return (
        <TableCell className="fullName">Full Name</TableCell>
      );
    }
  }
  function renderName(fullName, _id){
    if (!hideName) {
      return (
        <TableCell className='name' onClick={ cellClick.bind(this, _id)} >{fullName}</TableCell>
      );
    }
  }

  function renderGenderHeader(){
    if (!hideGender) {
      return (
        <TableCell className="gender">Gender</TableCell>
      );
    }
  }
  function renderGender(gender, _id){
    if (!hideGender) {
      return (
        <TableCell className='gender' onClick={ cellClick.bind(this, _id)} >{gender}</TableCell>
      );
    }
  }

  function renderBirthDateHeader(){
    if (!hideBirthDate) {
      
      return (
        <TableCell className="birthDate">Birth Date</TableCell>
      );
    }
  }
  function renderBirthDate(birthDate, _id){
    if (!hideBirthDate) {
      return (
        <TableCell className='birthDate' onClick={ cellClick.bind(this, _id)} style={{minWidth: '100px'}}>{birthDate}</TableCell> 
      );
    }
  }
  function renderBarcode(id){
    if (!hideFhirBarcode) {

      let barcodeClasses = "helvetica";

      if(font3of9){
        barcodeClasses = "barcode helvetica";
      }

      return (
        <TableCell><span className={barcodeClasses}>{id}</span></TableCell>
      );
    }
  }
  function renderBarcodeHeader(){
    if (!hideFhirBarcode) {
      return (
        <TableCell>FHIR ID</TableCell>
      );
    }
  }

  function renderSystemBarcode(id){
    if (!hideSystemBarcode) {

      let barcodeClasses = "helvetica";

      if(font3of9){
        barcodeClasses = "barcode helvetica";
      }

      return (
        <TableCell><span className={barcodeClasses}>{id}</span></TableCell>
      );
    }
  }
  function renderSystemBarcodeHeader(){
    if (!hideSystemBarcode) {
      return (
        <TableCell>System ID</TableCell>
      );
    }
  }

  function renderCountsHeader(){
    if (!hideCounts) {
      return (
        <TableCell className="counts">Counts</TableCell>
      );
    }
  }

  function handleMetaClick(person){
    if(onMetaClick){
      onMetaClick(person);
    }
  }

  // the idea behind this function is that we want a column in the table
  // that displays the counts of all the cursors that are associated with the Person object
  // usually, this involves the $everything operation
  // where the entire person chart is returned in a Bundle
  // the different resources in the Bundle are parsed, and stored in cursors
  // to get a summary of all that data into a column
  // we need to serialize it into a string
  // so we use a bitmask type operation to create the string
  // this is inspired by old school Morse code and TCP/IP network addresses
  // and pipe deliminated messaging

  

  function renderCounts(cursors, index){
    let serializedCounts = "";
    // console.log('renderCounts', cursors)

    function serializeCounts(cursors){
      let counts = "";

      if(cursors){
        
        // Pa-AI-B-CP-Co-Cl-D-E-G-I-M-MS-MO-Ob-Or-Pe-Pra-RP-Pro

        if(typeof cursors.Persons !== "undefined"){
          counts = cursors.Persons;
        }
    
        if(typeof cursors.AllergyIntolerances !== "undefined"){
          counts = counts + " " + (cursors.AllergyIntolerances ? cursors.AllergyIntolerances : "-");
        }
        if(typeof cursors.Bundles !== "undefined"){
          counts = counts + " " + (cursors.Bundles ? cursors.Bundles : "-");
        }
        if(typeof cursors.CarePlans !== "undefined"){
          counts = counts + " " + (cursors.CarePlans ? cursors.CarePlans : "-");
        }
        if(typeof cursors.Conditions !== "undefined"){
          counts = counts + " " + (cursors.Conditions ? cursors.Conditions : "-");
        }
        if(typeof cursors.Claims !== "undefined"){
          counts = counts + " " + (cursors.Claims ? cursors.Claims : "-");
        }
        if(typeof cursors.Devices !== "undefined"){
          counts = counts + " " + (cursors.Devices ? cursors.Devices : "-");
        }
        if(typeof cursors.Encounters !== "undefined"){
          counts = counts + " " + (cursors.Encounters ? cursors.Encounters : "-");
        }
        if(typeof cursors.Goals !== "undefined"){
          counts = counts + " " + (cursors.Goals ? cursors.Goals : "-");
        }
        if(typeof cursors.Immunizations !== "undefined"){
          counts = counts + " " + (cursors.Immunizations ? cursors.Immunizations : "-");
        }
        if(typeof cursors.Medications !== "undefined"){
          counts = counts + " " + (cursors.Medications ? cursors.Medications : "-");
        }
        if(typeof cursors.MedicationStatements !== "undefined"){
          counts = counts + " " + (cursors.MedicationStatements ? cursors.MedicationStatements : "-");
        }
        if(typeof cursors.MedicationOrders !== "undefined"){
          counts = counts + " " + (cursors.MedicationOrders ? cursors.MedicationOrders : "-");
        }
        if(typeof cursors.Observations !== "undefined"){
          counts = counts + " " + (cursors.Observations ? cursors.Observations : "-");
        }
        if(typeof cursors.Organizations !== "undefined"){
          counts = counts + " " + (cursors.Organizations ? cursors.Organizations : "-");
        }
        if(typeof cursors.Persons !== "undefined"){
          counts = counts + " " + (cursors.Persons ? cursors.Persons : "-");
        }
        if(typeof cursors.Practitioners !== "undefined"){
          counts = counts + " " + (cursors.Practitioners ? cursors.Practitioners : "-");
        }
        if(typeof cursors.RelatedPersons !== "undefined"){
          counts = counts + " " + (cursors.RelatedPersons ? cursors.RelatedPersons : "-");
        }
        if(typeof cursors.Procedures !== "undefined"){
          counts = counts + " " + (cursors.Procedures ? cursors.Procedures : "-");
        }
      }

      return counts;
    }
    
    if(Array.isArray(cursors)){
      let paginatedIndex = (page * rowsPerPageToRender) + index + 1;

      serializedCounts = serializeCounts(cursors[paginatedIndex])
      // console.log('PersonsTable.serializedCounts.array', serializedCounts, index, cursors[index])
    } else {
      serializedCounts = serializeCounts(cursors)
      // console.log('PersonsTable.serializedCounts', serializedCounts)
    }

    if (!hideCounts) {
      return (
        <TableCell className='counts'>
          {serializedCounts}
        </TableCell>
      );
    }
  }

  //================================================================
  // Table
  const classes = useStyles();

  let personsToRender = [];
  if(persons){
    if(persons.length > 0){            
      let count = 0;  
      persons.forEach(function(person){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          personsToRender.push(dehydratePerson(person, dateFormat));
        }
        count++;
      });  
    }
  }

  if(personsToRender.length === 0){
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < personsToRender.length; i++) {
      let selected = false;
      if(personsToRender[i].id === selectedPersonId){
        selected = true;
      }

      let rowStyle = {
        cursor: 'pointer', 
        height: '52px'
      }
      if(get(personsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }

      tableRows.push(
        <TableRow key={i} className="personRow" hover={true} style={rowStyle} selected={selected} onClick={ selectPersonRow.bind(this, personsToRender[i]._id )} >
          { renderActionIcons(personsToRender[i]) }
          { renderRowAvatar(personsToRender[i], styles.avatar) }
          { renderIdentifier(personsToRender[i].identifier)}

          { renderName(get(personsToRender[i], "name"), get(personsToRender[i], "_id"))}
          { renderGender(get(personsToRender[i], "gender"), get(personsToRender[i], "_id"))}
          { renderBirthDate(get(personsToRender[i], "birthDate"), get(personsToRender[i], "_id"))}

          { renderAddress(get(personsToRender[i], 'addressLine') ) }
          { renderCity(get(personsToRender[i], 'city')) }
          { renderState(get(personsToRender[i], 'state')) }
          { renderZipCode(get(personsToRender[i], 'postalCode')) }
          { renderCountry(get(personsToRender[i], 'country')) }

          {/* { renderLanguage(get(personsToRender[i], "preferredLanguage")) } */}
          { renderIsActive(get(personsToRender[i], "active")) }

          { renderCounts(cursors, i) }
          { renderActionButton(personsToRender[i], styles.avatar) }

          { renderSystemBarcode(personsToRender[i]._id)}
          { renderBarcode(personsToRender[i].id)}
        </TableRow>
      );
    }
  }




  let paginationFooter;
  if(!disablePagination){
    paginationFooter = <TablePagination
      component="div"
      rowsPerPageOptions={[5, 10, 25, 100]}
      colSpan={3}
      count={paginationCount}
      rowsPerPage={rowsPerPageToRender}
      page={page}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      style={{float: 'right', border: 'none'}}
    />
  }

  return(
    <div>
      <Table size="small" aria-label="a dense table" { ...otherProps } >
        <TableHead>
          <TableRow>
            { renderActionIconsHeader() }
            { renderRowAvatarHeader() }
            { renderIdentifierHeader() }

            { renderNameHeader() }
            { renderGenderHeader() }
            { renderBirthDateHeader() }

            { renderAddressHeader() }
            { renderCityHeader() }
            { renderStateHeader() }
            { renderZipCodeHeader() }
            { renderCountryHeader() }

            {/* { renderLanguageHeader() }               */}
            { renderIsActiveHeader() }

            { renderCountsHeader() }
            { renderActionButtonHeader() }

            { renderSystemBarcodeHeader() }
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


PersonsTable.propTypes = {
  fhirVersion: PropTypes.string,

  id: PropTypes.string,
  persons: PropTypes.array,
  selectedPersonId: PropTypes.string,

  showActionButton: PropTypes.bool,
  onRowClick: PropTypes.func,
  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideActive: PropTypes.bool,

  hideName: PropTypes.bool,
  hideGender: PropTypes.bool,
  hideBirthDate: PropTypes.bool,
  
  hideMaritalStatus: PropTypes.bool,
  hideLanguage: PropTypes.bool,
  hideSpecies: PropTypes.bool,
  hideAddress: PropTypes.bool,
  hideCity: PropTypes.bool,
  hideState: PropTypes.bool,
  hidePostalCode: PropTypes.bool,
  hideCountry: PropTypes.bool,
  hideFhirBarcode: PropTypes.bool,
  hideSystemBarcode: PropTypes.bool,
  hideCounts: PropTypes.bool,
  
  noDataMessagePadding: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func, 
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,
  defaultAvatar: PropTypes.string,
  disablePagination: PropTypes.bool,
  paginationLimit: PropTypes.number,
  paginationCount: PropTypes.number,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,
  
  cursors: PropTypes.array,
  font3of9: PropTypes.bool,

  count: PropTypes.number,
  tableRowSize: PropTypes.string,
  formFactorLayout: PropTypes.string
};
PersonsTable.defaultProps = {
  tableRowSize: 'medium',
  rowsPerPage: 5,
  dateFormat: "YYYY-MM-DD",
  paginationCount: 100,
  hideName: false,
  hideGender: true,
  hideBirthDate: false,

  hideMaritalStatus: false,
  hideLanguage: false,
  hideSpecies: true,
  hideAddress: false,
  hideCity: false,
  hideState: false,
  hidePostalCode: false,
  hideCountry: false,
  hideFhirBarcode: false,
  hideSystemBarcode: false,
  hideCounts: true,

  font3of9: true,
  hideFhirBarcode: false,
  multiline: false
}

export default PersonsTable;




