

import { CardText, CardTitle } from 'material-ui/Card';
import { GlassCard, FullPageCanvas, Glass } from 'meteor/clinical:glass-ui';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import { get, has } from 'lodash';

import LocationTable from './LocationsTable';



export class LocationsSimplePage extends React.Component {
  getMeteorData() {
    let data = {
    };

    if(process.env.NODE_ENV === "test") console.log("LocationsSimplePage[data]", data);
    return data;
  }

  render() {  

    var canvas = <FullPageCanvas width={768} >
      <GlassCard height='auto'>
        <CardTitle
          title="Locations"
        />
        <CardText>
          <LocationTable />
        </CardText>
      </GlassCard>
    </FullPageCanvas>;
          
    return (
      <div id="locationsPage"> 
        {canvas}                
      </div>
    );
  }
}


ReactMixin(LocationsSimplePage.prototype, ReactMeteorData);
export default LocationsSimplePage;