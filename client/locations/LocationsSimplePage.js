

import { CardContent, CardHeader } from '@material-ui/core';
import { StyledCard, PageCanvas } from 'material-fhir-ui';

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

    var canvas = <PageCanvas width={768} >
      <StyledCard height='auto'>
        <CardHeader
          title="Locations"
        />
        <CardContent>
          <LocationTable />
        </CardContent>
      </StyledCard>
    </PageCanvas>;
          
    return (
      <div id="locationsPage"> 
        {canvas}                
      </div>
    );
  }
}


ReactMixin(LocationsSimplePage.prototype, ReactMeteorData);
export default LocationsSimplePage;