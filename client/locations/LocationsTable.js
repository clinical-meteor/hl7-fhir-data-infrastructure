import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';
import Toggle from 'material-ui/Toggle';
import { GlassCard, VerticalCanvas, Glass } from 'meteor/clinical:glass-ui';

Session.setDefault('selectedLocations', []);

export class LocationTable extends React.Component {
  getMeteorData() {

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
        row: Glass.darkroom({
          opacity: Session.get('globalOpacity'),
          cursor: 'pointer'
        })
      },
      selected: [],
      locations: []
    };

    if(this.props.data){
       data.locations = this.props.data;
    } else {
      data.locations = Locations.find().map(function(location){
        let result = {
          _id: '',
          name: '',
          manufacturer: '',
          form: '',
          primaryIngredient: ''
        };

        if (location._id ) {
          result._id = location._id;
        }
        if (location.name ) {
          result.name = location.name;
        }
        if (location.position ) { 
          result.position = location.position;
        }

        return result;
      })
    }

    if (Session.get('darkroomEnabled')) {
      data.style.color = 'black';
      data.style.background = 'white';
    } else {
      data.style.color = 'white';
      data.style.background = 'black';
    }

    // this could be another mixin
    if (Session.get('glassBlurEnabled')) {
      data.style.filter = 'blur(3px)';
      data.style.WebkitFilter = 'blur(3px)';
    }

    // this could be another mixin
    if (Session.get('backgroundBlurEnabled')) {
      data.style.backdropFilter = 'blur(5px)';
    }

    //console.log("data", data);
    return data;
  }
  handleChange(row, key, value) {
    const source = this.state.source;
    source[row][key] = value;
    this.setState({source});
  }

  handleSelect(selected) {
    this.setState({selected});
  }

  rowClick(id){
    Session.set('locationUpsert', false);
    Session.set('selectedLocationId', id);
    Session.set('locationPageTabIndex', 2);
  }
  render () {
    if(process.env.NODE_ENV === "test") console.log('LocationTable.render()', this.state)

    let tableRows = [];
    // console.log('this.data.locations', this.data.locations);
    
    for (var i = 0; i < this.data.locations.length; i++) {
      tableRows.push(
      <tr className='locationRow' ref='med-{i}' key={i} style={this.data.style.row} onClick={ this.rowClick.bind('this', this.data.locations[i]._id) }>
        <td className="cardinality">{(this.data.locations[i].cardinality) ? this.data.locations[i].cardinality : ''}</td>
        <td className="name hidden-on-phone">{this.data.locations[i].name}</td>
        <td className="latitutude">{(this.data.locations[i].position) ? this.data.locations[i].position.latitude : ''}</td>
        <td className="longitude">{(this.data.locations[i].position) ? this.data.locations[i].position.longitude : ''}</td>
        <td className="altitude">{(this.data.locations[i].position) ? this.data.locations[i].position.altitude : ''}</td>
      </tr>);
    }


    return(
      <Table id="locationsTable" ref='locationsTable' >
        <thead>
          <tr>
            <th className="cardinality hidden-on-phone">cardinality</th>
            <th className="name hidden-on-phone">name</th>
            <th className="latitutude">latitutude</th>
            <th className="longitude">longitude</th>
            <th className="altitude">altitude</th>
          </tr>
        </thead>
        <tbody>
          { tableRows }
        </tbody>
      </Table>
    );
  }
}


ReactMixin(LocationTable.prototype, ReactMeteorData);
export default LocationTable;