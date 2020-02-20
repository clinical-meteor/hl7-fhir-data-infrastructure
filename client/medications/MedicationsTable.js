
import { 
  Checkbox, 
  Table, 
  TableRow, 
  TableCell,
  TableBody
} from '@material-ui/core';

import React from 'react';
import ReactMixin from 'react-mixin';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { get } from 'lodash';
import PropTypes from 'prop-types';

import { FaTags, FaCode, FaPuzzlePiece, FaLock  } from 'react-icons/fa';
import { GoTrashcan } from 'react-icons/go'

Session.setDefault('selectedMedications', []);

export class MedicationsTable extends React.Component {
  getMeteorData() {
    let self = this;

    // this should all be handled by props
    // or a mixin!
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        block: {
          maxWidth: 250
        },
        checkbox: {
          //marginBottom: 16
        },
        // rowText: Glass.darkroom({cursor: 'pointer'})
      },
      selected: [],
      medications: Medications.find().map(function(medication){
        let result = {
          _id: '',
          name: '',
          manufacturer: '',
          activeIngredient: '',
          form: '',
          amount: '',
          activeIngredient: ''
        };

        result._id = get(medication, '_id');
        result.code = get(medication, 'code.coding[0].code');
        result.code = get(medication, 'code.text');
        result.name = get(medication, 'code.coding[0].display');
        result.form = get(medication, 'product.form.coding[0].display');
        result.activeIngredient = get(medication, 'product.ingredient[0].item.display');
        result.amount = get(medication, 'package.content[0].amount.value');
        result.manufacturer = get(medication, 'manufacturer.display');

        // if we get a specific fhirVersion, be explicit about where to get the value
        switch (self.props.fhirVersion) {
          case '1.0.2':
            result.activeIngredient = get(medication, 'product.ingredient[0].item.display');            
            break;      
          case '3.0.1':
            result.activeIngredient = get(medication, 'product.ingredient[0].itemReference.display');            
            break;      
          default:
            // otherwise, walk through the likely steps, if possible
            // may be worth extracting to Medication.prototype.getPrimaryIngredient()
            if(get(medication, 'product.ingredient[0].item.display')){
              result.activeIngredient = get(medication, 'product.ingredient[0].item.display');            
            } else if(get(medication, 'product.ingredient[0].itemReference.display')){
              result.activeIngredient = get(medication, 'product.ingredient[0].itemReference.display');
            }
            break;
        }

        return result;
      })
    };


    return data;
  }
  renderCheckboxHeader(){
    if (!this.props.hideCheckbox) {
      return (
        <TableCell className="toggle"></TableCell>
      );
    }
  }
  renderCheckbox(patientId ){
    if (!this.props.hideCheckbox) {
      return (
        <TableCell className="toggle">
            <Checkbox
              defaultChecked={true}
            />
          </TableCell>
      );
    }
  }
  renderIdentifierHeader(){
    if (!this.props.hideIdentifier) {
      return (
        <TableCell className="identifier">Identifier</TableCell>
      );
    }
  }
  renderIdentifier(medication ){
    if (!this.props.hideIdentifier) {
      let classNames = 'identifier';
      if(this.props.barcodes){
        classNames = 'barcode identifier'
      }
      return (
        <TableCell className={classNames}>{ get(medication, 'identifier[0].value') }</TableCell>       );
    }
  }
  renderActionIconsHeader(){
    if (!this.props.hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>Actions</TableCell>
      );
    }
  }
  renderActionIcons( medication ){
    if (!this.props.hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          <FaTags style={iconStyle} onClick={this.showSecurityDialog.bind(this, medication)} />
          <GoTrashcan style={iconStyle} onClick={this.removeRecord.bind(this, medication._id)} />  
        </TableCell>
      );
    }
  } 
  removeRecord(_id){
    console.log('Remove medication ', _id)
    Medications._collection.remove({_id: _id})
  }
  showSecurityDialog(medication){
    console.log('showSecurityDialog', medication)

    Session.set('securityDialogResourceJson', Medications.findOne(get(medication, '_id')));
    Session.set('securityDialogResourceType', 'Medication');
    Session.set('securityDialogResourceId', get(medication, '_id'));
    Session.set('securityDialogOpen', true);
  }
  rowClick(id){
    Session.set('medicationUpsert', false);
    Session.set('selectedMedicationId', id);
    Session.set('medicationPageTabIndex', 2);
  }
  render () {
    if(process.env.NODE_ENV === "test") console.log("MedicationTable.render()");

    let tableRows = [];
    for (var i = 0; i < this.data.medications.length; i++) {
      tableRows.push(
      <TableRow className='medicationRow' ref='med-{i}' key={i} style={this.data.style.rowText} onClick={ this.rowClick.bind('this', this.data.medications[i]._id) }>
        { this.renderCheckbox(this.data.medications[i]) }
        { this.renderActionIcons(this.data.medications[i]) }
        <TableCell className="code hidden-on-phone">{this.data.medications[i].code}</TableCell>
        <TableCell className="name hidden-on-phone">{this.data.medications[i].name}</TableCell>
        <TableCell className="manufacturer hidden-on-phone">{this.data.medications[i].manufacturer}</TableCell>
        <TableCell className="amount">{this.data.medications[i].amount}</TableCell>
        <TableCell className="form">{this.data.medications[i].form}</TableCell>
        <TableCell className="activeIngredient">{this.data.medications[i].activeIngredient}</TableCell>
        { this.renderIdentifier(this.data.medications[i]) }
      </TableRow>);
    }


    return(
      <Table id="medicationsTable" ref='medicationsTable' hover >
        <TableHead>
          <TableRow>
            { this.renderCheckboxHeader() }
            { this.renderActionIconsHeader() }
            <TableCell className="code hidden-on-phone">Code</TableCell>
            <TableCell className="name hidden-on-phone">Name</TableCell>
            <TableCell className="manufacturer hidden-on-phone">Manufacturer</TableCell>
            <TableCell className="amount">Amount</TableCell>
            <TableCell className="form">Form</TableCell>
            <TableCell className="activeIngredient">Active ingredient</TableCell>
            { this.renderIdentifierHeader() }
          </TableRow>
        </TableHead>
        <TableBody>
          { tableRows }
        </TableBody>
      </Table>
    );
  }
}


MedicationsTable.propTypes = {
  data: PropTypes.array,
  fhirVersion: PropTypes.string,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  hideIdentifier: PropTypes.bool,
  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  barcodes: PropTypes.bool,
  onRowClick: PropTypes.func
};
ReactMixin(MedicationsTable.prototype, ReactMeteorData);
export default MedicationsTable;