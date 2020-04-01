import { 
  Checkbox, 
  Table, 
  TableRow, 
  TableCell,
  TableBody,
  TableHead
} from '@material-ui/core';

import { get } from 'lodash';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

// import { Icon } from 'react-icons-kit'
// import { tag } from 'react-icons-kit/fa/tag'
// import {iosTrashOutline} from 'react-icons-kit/ionicons/iosTrashOutline'




flattenMedicationStatement = function(statement, fhirVersion){
  console.log('flattenMedicationStatement', statement)

  var newRow = {
    '_id': statement._id,
    'medication': '',
    'medicationReference': '',
    'medicationDisplay': '',
    'reasonCodeCode': '',
    'reasonCodeDisplay': '',
    'basedOn': '',
    'effectiveDateTime': '',
    'dateAsserted': null,
    'informationSource': '',
    'subjectDisplay': '',
    'taken': '',
    'reasonCodeDisplay': '',
    'dosage': '',
  };

  // STU3
  if(fhirVersion === "v3.0.1"){
    newRow.subjectDisplay = get(statement, 'subject.display');
    newRow.medication = get(statement, 'medicationReference.reference');
    newRow.medication = get(statement, 'medicationReference.display');
    newRow.medication = get(statement, 'medicationCodeableConcept.coding[0].display');
    newRow.identifier = get(statement, 'identifier[0].value');
    newRow.effectiveDateTime = moment(get(statement, 'effectiveDateTime')).format("YYYY-MM-DD");
    newRow.dateAsserted = moment(get(statement, 'dateAsserted')).format("YYYY-MM-DD");
    newRow.informationSource = get(statement, 'informationSource.display');
    newRow.taken = get(statement, 'taken');
    newRow.reasonCodeDisplay = get(statement, 'reasonCode[0].coding[0].display');  
  }

  // DSTU2
  if(fhirVersion === "v1.0.2"){
    newRow.subjectDisplay = get(statement, 'patient.display');
    newRow.medicationReference = get(statement, 'medicationReference.reference');
    newRow.medicationDisplay = get(statement, 'medicationReference.display');
    newRow.medication = get(statement, 'medicationReference.display');
    newRow.reasonCode = get(statement, 'reasonForUseCodeableConcept.coding[0].code');
    newRow.reasonCodeDisplay = get(statement, 'reasonForUseCodeableConcept.coding[0].display');
    newRow.identifier = get(statement, 'identifier[0].value');
    newRow.effectiveDateTime = moment(get(statement, 'effectiveDateTime')).format("YYYY-MM-DD");
    newRow.dateAsserted = moment(get(statement, 'dateAsserted')).format("YYYY-MM-DD");
    newRow.informationSource = get(statement, 'supportingInformation[0].display');
    newRow.reasonCodeDisplay = get(statement, 'reasonForUseCodeableConcept.coding[0].display');  
  }


  return newRow;
}

export class MedicationStatementsTable extends React.Component {

  getMeteorData() {

    // this should all be handled by props
    // or a mixin!
    let data = {
      style: {
        opacity: Session.get('globalOpacity')
      },
      selected: [],
      medicationStatements: [],
      displayToggle: false,
      displayDates: true,
      fhirVersion: 'v1.0.2'
    }

    if(this.props.fhirVersion){
      data.fhirVersion = this.props.fhirVersion;
    }
    
    if(this.props.displayToggles){
      data.displayToggle = this.props.displayToggles;
    }
    if(this.props.displayDates){
      data.displayDates = this.props.displayDates;
    }
    if(this.props.data){
      this.props.data.map(function(statement){
        data.medicationStatements.push(flattenMedicationStatement(statement, data.fhirVersion));        
      });
    } else {
      if(MedicationStatements.find().count() > 0){

        MedicationStatements.find().map(function(statement){        
          data.medicationStatements.push(flattenMedicationStatement(statement, data.fhirVersion));
        });
      } else {
        data.medicationStatements = [];        
      }
    }

  
    if(process.env.NODE_ENV === "test") console.log("MedicationStatementsTable[data]", data);
    return data;
  };

  renderTogglesHeader(displayToggle){
    if (displayToggle) {
      return (
        <TableCell className="toggle">toggle</TableCell>
      );
    }
  }
  renderToggles(displayToggle, patientId ){
    if (displayToggle) {
      return (
        <TableCell className="toggle">
            <Checkbox
              defaultChecked={true}
              //style={styles.toggle}
            />
          </TableCell>
      );
    }
  }
  renderDateHeader(displayDates){
    if (displayDates) {
      return (
        <TableCell className='date'>Asserted At</TableCell>
      );
    }
  }
  renderDate(displayDates, newDate ){
    if (displayDates) {
      return (
        <TableCell className='dateAsserted'>{ moment(newDate).format('YYYY-MM-DD') }</TableCell>
      );
    }
  }
  renderActionIconsHeader(){
    if (!this.props.hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>Actions</TableCell>
      );
    }
  }
  renderActionIcons(medicationStatement ){
    if (!this.props.hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <Icon icon={tag} style={iconStyle} onClick={this.showSecurityDialog.bind(this, medicationStatement)} />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={this.removeRecord.bind(this, medicationStatement._id)} /> */}
        </TableCell>
      );
    }
  }
  removeRecord(_id){
    console.log('Remove medication statement ', _id)
    MedicationStatements._collection.remove({_id: _id})
  }
  showSecurityDialog(medicationStatement){
    console.log('showSecurityDialog', medicationStatement)

    Session.set('securityDialogResourceJson', MedicationStatements.findOne(get(medicationStatement, '_id')));
    Session.set('securityDialogResourceType', 'MedicationStatement');
    Session.set('securityDialogResourceId', get(medicationStatement, '_id'));
    Session.set('securityDialogOpen', true);
  }
  rowClick(id){
    Session.set('medicationStatementsUpsert', false);
    Session.set('selectedMedicationStatementId', id);
    Session.set('medicationStatementPageTabIndex', 2);
  };
  render () {
    let tableRows = [];
    for (var i = 0; i < this.data.medicationStatements.length; i++) {

      let rowStyle = {
        cursor: 'pointer'
      }
      if(get(this.data.medicationStatements[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }

      tableRows.push(
        <TableRow key={i} className="medicationStatementRow" style={rowStyle} onClick={ this.rowClick.bind('this', this.data.medicationStatements[i]._id)} >
          { this.renderToggles(this.data.displayToggle, this.data.medicationStatements[i]) }
          { this.renderActionIcons(this.data.medicationStatements[i]) }
          <TableCell className='medication'>{ this.data.medicationStatements[i].medication }</TableCell>
          {/* <TableCell className='effectiveDateTime'>{ moment(this.data.medicationStatements[i].effectiveDateTime).format("YYYY-MM-DD") }</TableCell> */}
          <TableCell className='informationSource'>{ this.data.medicationStatements[i].informationSource }</TableCell>
          <TableCell className='subject'>{ this.data.medicationStatements[i].subjectDisplay }</TableCell>
          {/* <TableCell className='taken'>{ this.data.medicationStatements[i].taken }</TableCell> */}
          <TableCell className='reason'>{ this.data.medicationStatements[i].reasonCodeDisplay }</TableCell>
          {/* <TableCell className='dosage'>{ this.data.medicationStatements[i].dosage }</TableCell> */}
          { this.renderDate(this.data.displayDates, this.data.medicationStatements[i].dateAsserted) }
        </TableRow>
      )
    }

    return(
      <Table id='medicationStatementsTable' hover="true" >
        <TableHead>
          <TableRow>
            { this.renderTogglesHeader(this.data.displayToggle) }
            { this.renderActionIconsHeader() }

            <TableCell className='medication'>Medication</TableCell>
            {/* <TableCell className='effectiveDateTime'>Date /time</TableCell> */}
            <TableCell className='informationSource'>Source</TableCell>
            <TableCell className='subject'>Subject</TableCell>
            {/* <TableCell className='taken'>taken</TableCell> */}
            <TableCell className='reason'>Reason</TableCell>
            {/* <TableCell className='dosage'>dosage</TableCell> */}
            { this.renderDateHeader(this.data.displayDates) }            
          </TableRow>
        </TableHead>
        <TableBody>
          { tableRows }
        </TableBody>
      </Table>
    );
  }
}


ReactMixin(MedicationStatementsTable.prototype, ReactMeteorData);
export default MedicationStatementsTable;