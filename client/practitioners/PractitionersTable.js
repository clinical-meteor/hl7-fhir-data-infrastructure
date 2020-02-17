
import { 
  Checkbox, 
  Table, 
  TableRow, 
  TableCell,
  TableBody
} from '@material-ui/core';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { get } from 'lodash';

Session.setDefault('selectedPractitioner', false);


// flattenPractitioner = function(practitioner){
//   let result = {
//     _id: practitioner._id,
//     id: practitioner.id,
//     active: practitioner.active.toString(),
//     gender: get(practitioner, 'gender'),
//     name: '',
//     mrn: '',
//     birthDate: '',
//     photo: "/thumbnail-blank.png",
//     initials: 'abc'
//   };

//   result.birthDate = moment(practitioner.birthDate).format("YYYY-MM-DD")
//   result.photo = get(practitioner, 'photo[0].url', '');
//   result.identifier = get(practitioner, 'identifier[0].value', '');

//   result.maritalStatus = get(practitioner, 'maritalStatus.text', '');
//   result.deceased = get(practitioner, 'deceasedBoolean', '');
//   result.species = get(practitioner, 'animal.species.text', '');
//   result.language = get(practitioner, 'communication[0].language.text', '');

//   let nameText = get(practitioner, 'name[0].text');
//   if(nameText.length > 0){
//     result.name = get(practitioner, 'name[0].text');    
//   } else {
//     if(get(practitioner, 'name[0].suffix[0]')){
//       result.name = get(practitioner, 'name[0].suffix[0]')  + ' ';
//     }

//     result.name = result.name + get(practitioner, 'name[0].given[0]') + ' ' + get(practitioner, 'name[0].family[0]');
    
//     if(get(practitioner, 'name[0].suffix[0]')){
//       result.name = result.name + ' ' + get(practitioner, 'name[0].suffix[0]');
//     }
//   }

//   return result;
// }



export class PractitionersTable extends React.Component {
  flattenPractitioner(practitioner){
    console.log('PractitionersTable.flattenPractitioner()', practitioner)

    let result = {
      _id: practitioner._id,
      name: '',
      phone: '',
      email: '',
      qualificationIssuer: '',
      qualificationIdentifier: '',
      qualificationCode: '',
      qualificationStart: null,
      qualificationEnd: null,
      text: '',
      city: '',
      state: '',
      postalCode: ''
    };

    //---------------------------------------------------------
    // TODO REFACTOR:  HumanName
    // parse name!
    // totally want to extract this
    if(get(practitioner, 'name.text')){
      result.name = get(practitioner, 'name.text');
    } else {
      if(get(practitioner, 'name.suffix[0]')){
        result.name = get(practitioner, 'name.suffix[0]')  + ' ';
      }
  
      result.name = result.name + get(practitioner, 'name.given[0]') + ' ';
      
      if(get(practitioner, 'name.family[0]')){
        result.name = result.name + get(practitioner, 'name.family[0]');
      } else {
        result.name = result.name + get(practitioner, 'name.family');
      }
      
      if(get(practitioner, 'name.suffix[0]')){
        result.name = result.name + ' ' + get(practitioner, 'name.suffix[0]');
      }
    } 
    //---------------------------------------------------------

    if(this.props.fhirVersion === 'v1.0.2'){
      // if (get(practitioner, 'telecom[0].value')) {
      //   result.phone = get(practitioner, 'telecom[0].value');
      // }
      // if (get(practitioner, 'telecom[0].use') ) {
      //   result.email = get(practitioner, 'telecom[0].use')
      // }
  
      result.qualificationId = get(practitioner, 'qualification[0].identifier[0].value');
      result.qualificationCode = get(practitioner, 'qualification[0].code.coding[0].code');
      result.qualificationStart = moment(get(practitioner, 'qualification[0].period.start')).format("MMM YYYY");
      result.qualificationEnd = moment(get(practitioner, 'qualification[0].period.end')).format("MMM YYYY");
      result.issuer = get(practitioner, 'qualification[0].issuer.display');
    
      result.text = get(practitioner, 'address[0].text')
      result.city = get(practitioner, 'address[0].city')
      result.state = get(practitioner, 'address[0].state')
      result.postalCode = get(practitioner, 'address[0].postalCode')

      //----------------------------------------------------------------
      // TODO REFACTOR:  ContactPoint
      // totally want to extract this

      let telecomArray = get(practitioner, 'telecom');
      telecomArray.forEach(function(telecomRecord){
        if(get(telecomRecord, 'system') === 'phone'){
          result.phone = get(telecomRecord, 'value');
        }
        if(get(telecomRecord, 'system') === 'email'){
          result.email = get(telecomRecord, 'value');
        }
      })
      //----------------------------------------------------------------
    }

    
    if(this.props.fhirVersion === 'v1.6.0'){
      // tbd
    }


    if(this.props.fhirVersion === '3.0.1'){
      // tbd      
    }


    return result;
  }
  getMeteorData() {
    var self = this;

    let data = {
      style: {
        // row: Glass.darkroom({
        //   opacity: Session.get('globalOpacity')
        // })
      },
      selected: [],
      practitioners: []
    };

    let query = {};
    let options = {};

    // number of items in the table should be set globally
    if (get(Meteor, 'settings.public.defaults.paginationLimit')) {
      options.limit = get(Meteor, 'settings.public.defaults.paginationLimit');
    }
    // but can be over-ridden by props being more explicit
    if(this.props.limit){
      options.limit = this.props.limit;      
    }

    if(this.props.data){
      // console.log('this.props.data', this.props.data);

      if(this.props.data.length > 0){              
        this.props.data.forEach(function(practitioner){
          data.practitioners.push(self.flattenPractitioner(practitioner));
        });  
      }
    } else {
      data.practitioners = Practitioners.find().map(function(practitioner){
        return self.flattenPractitioner(practitioner);
      });
    }
    
    if(process.env.NODE_ENV === "test") console.log("PractitionersTable[data]", data);
    return data;
  }

  rowClick(id){
    Session.set('practitionerUpsert', false);
    Session.set('selectedPractitionerId', id);
    Session.set('practitionerPageTabIndex', 2);
  }
  render () {
    let tableRows = [];
    //console.log('this.data.practitioners', this.data.practitioners)
    for (var i = 0; i < this.data.practitioners.length; i++) {
      tableRows.push(
      <TableRow className='practitionerRow' key={i} style={this.data.style.row} onClick={ this.rowClick.bind('this', this.data.practitioners[i]._id) }>
        <TableCell className="name">{this.data.practitioners[i].name}</TableCell>
        <TableCell className="phone">{this.data.practitioners[i].phone}</TableCell>
        <TableCell className="email">{this.data.practitioners[i].email}</TableCell>
        <TableCell className="issuer">{this.data.practitioners[i].issuer}</TableCell>
        <TableCell className="qualificationCode">{this.data.practitioners[i].qualificationCode}</TableCell>
        <TableCell className="qualificationStart">{this.data.practitioners[i].qualificationStart}</TableCell>
        <TableCell className="qualificationEnd">{this.data.practitioners[i].qualificationEnd}</TableCell>
        <TableCell className="city">{this.data.practitioners[i].city}</TableCell>
        <TableCell className="state">{this.data.practitioners[i].state}</TableCell>
        {/*<TableCell className="barcode">{this.data.practitioners[i]._id}</TableCell>*/}
      </TableRow>);
    }


    return(
      <Table id="practitionersTable" hover >
        <TableHead>
          <TableRow>
            <TableCell className="name">Name</TableCell>
            <TableCell className="phone">Phone</TableCell>
            <TableCell className="email">Use</TableCell>
            <TableCell className="issuer">Issuer</TableCell>
            <TableCell className="qualificationCode">Credential</TableCell>
            <TableCell className="qualificationStart">Start</TableCell>
            <TableCell className="qualificationEnd">End</TableCell>
            <TableCell className="city">City</TableCell>
            <TableCell className="state">State</TableCell>
            {/*<TableCell className="barcode">_id</TableCell>*/}
          </TableRow>
        </TableHead>
        <TableBody>
          { tableRows }
        </TableBody>
      </Table>

    );
  }
}

ReactMixin(PractitionersTable.prototype, ReactMeteorData);
export default PractitionersTable;