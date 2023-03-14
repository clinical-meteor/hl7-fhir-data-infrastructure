import { get } from 'lodash';
import validator from 'validator';

import BaseModel from '../BaseModel';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// REFACTOR:  we want to deprecate meteor/clinical:hl7-resource-datatypes
// so please remove references from the following line
// and replace with import from ../../datatypes/*
import {  AddressSchema, BaseSchema, ContactPointSchema, CodeableConceptSchema, DomainResourceSchema, IdentifierSchema,  MoneySchema, PeriodSchema, QuantitySchema, ReferenceSchema, SignatureSchema } from 'meteor/clinical:hl7-resource-datatypes';
import HumanNameSchema from '../../datatypes/HumanName';

// if(Package['clinical:autopublish']){
//   console.log("*****************************************************************************")
//   console.log("HIPAA WARNING:  Your app has the 'clinical-autopublish' package installed.");
//   console.log("Any protected health information (PHI) stored in this app should be audited."); 
//   console.log("Please consider writing secure publish/subscribe functions and uninstalling.");  
//   console.log("");  
//   console.log("meteor remove clinical:autopublish");  
//   console.log("");  
// }
// if(Package['autopublish']){
//   console.log("*****************************************************************************")
//   console.log("HIPAA WARNING:  DO NOT STORE PROTECTED HEALTH INFORMATION IN THIS APP. ");  
//   console.log("Your application has the 'autopublish' package installed.  Please uninstall.");
//   console.log("");  
//   console.log("meteor remove autopublish");  
//   console.log("meteor add clinical:autopublish");  
//   console.log("");  
// }


// create the object using our BaseModel
BasicResource = BaseModel.extend();

//Assign a collection so the object knows how to perform CRUD operations
BasicResource.prototype._collection = BasicResources;

if(typeof BasicResources === 'undefined'){
  BasicResources = new Mongo.Collection('BasicResources');
}


//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
BasicResources._transform = function (document) {
  return new BasicResource(document);
};

BasicResourceSchema = DomainResourceSchema.extend({
  "resourceType" : {
    type: String,
    defaultValue: "Resource"
  }
});

BasicResources.attachSchema(BasicResourceSchema);

export default { BasicResource, BasicResources, BasicResourceSchema };