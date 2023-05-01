import { get } from 'lodash';
import validator from 'validator';

import BaseModel from '../../BaseModel';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';


// REFACTOR:  we want to deprecate meteor/clinical:hl7-resource-datatypes
// so please remove references from the following line
// and replace with import from ../../datatypes/*
// BETTER REFACTOR:  Replace with JsonSchema importer.
import {  AddressSchema, BaseSchema, ContactPointSchema, CodeableConceptSchema, DomainResourceSchema, IdentifierSchema,  MoneySchema, PeriodSchema, QuantitySchema, ReferenceSchema, SignatureSchema } from 'meteor/clinical:hl7-resource-datatypes';


// import JSONSchema from 'meteor/bshamblen:json-simple-schema';
import JsonToSimpleSchemaParser from '../JsonToSimpleSchemaParser.js'

// var jsonSchemaDoc = JSON.parse($.ajax({
// 	type: 'GET',
// 	url: 'http://example.com/path-to-json-schema-file',
// 	async: false
// }).responseText);



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
NutritionIntake = BaseModel.extend();

//Assign a collection so the object knows how to perform CRUD operations
NutritionIntake.prototype._collection = NutritionIntakes;

if(typeof NutritionIntakes === 'undefined'){
  NutritionIntakes = new Mongo.Collection('NutritionIntakes');
}


//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
NutritionIntakes._transform = function (document) {
  return new NutritionIntake(document);
};



// let fhirSpecificationRaw = '../fhir.schema.r5.json';

import fhirSpecification from '../fhir.schema.r5.json';




// var fhirSpecification = JSON.parse(fhirSpecificationRaw);

console.log(">>>===================================================")
console.log('fhirSpecification', fhirSpecification)
console.log('fhirSpecification.definitions', get(fhirSpecification, 'definitions'))
console.log('fhirSpecification.definitions.NutritionIntake', get(fhirSpecification, 'definitions.NutritionIntake'))

var fhirJsonSpecification = new JsonToSimpleSchemaParser(fhirSpecification);

console.log('fhirJsonSpecification', fhirJsonSpecification)


var NutritionIntakeSchema = fhirJsonSpecification.toSimpleSchema("NutritionIntake");
console.log('fhirSpecification.definitions.NutritionIntakeSchema', NutritionIntakeSchema);

NutritionIntakes.attachSchema(NutritionIntakeSchema);



export default { NutritionIntake, NutritionIntakes, NutritionIntakeSchema };