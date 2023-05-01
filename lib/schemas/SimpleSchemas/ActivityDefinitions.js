
if(Package['clinical:autopublish']){
  console.log("*****************************************************************************")
  console.log("HIPAA WARNING:  Your app has the 'clinical-autopublish' package installed.");
  console.log("Any protected health information (PHI) stored in this app should be audited."); 
  console.log("Please consider writing secure publish/subscribe functions and uninstalling.");  
  console.log("");  
  console.log("meteor remove clinical:autopublish");  
  console.log("");  
}
if(Package['autopublish']){
  console.log("*****************************************************************************")
  console.log("HIPAA WARNING:  DO NOT STORE PROTECTED HEALTH INFORMATION IN THIS APP. ");  
  console.log("Your application has the 'autopublish' package installed.  Please uninstall.");
  console.log("");  
  console.log("meteor remove autopublish");  
  console.log("meteor add clinical:autopublish");  
  console.log("");  
}

import { get } from 'lodash';
import validator from 'validator';

import BaseModel from '../../BaseModel';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { Code, ReferenceSchema, CodeableConceptSchema, IdentifierSchema, PeriodSchema } from 'meteor/clinical:hl7-resource-datatypes';

// import ReferenceSchema from '../../../datatypes/Reference';
// import CodeableConceptSchema from '../../datatypes/CodeableConcept';
// import IdentifierSchema from '../../datatypes/Identifier';
// import PeriodSchema from '../../datatypes/Period';
// import Code from '../../datatypes/Code';




// create the object using our BaseModel
ActivityDefinition = BaseModel.extend();

//Assign a collection so the object knows how to perform CRUD operations
ActivityDefinition.prototype._collection = ActivityDefinitions;

ActivityDefinitions = new Mongo.Collection('ActivityDefinitions');


//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
ActivityDefinitions._transform = function (document) {
  return new ActivityDefinition(document);
};



ActivityDefinitionR4 = new SimpleSchema({
  "_id" : {
    type: String,
    optional: true
  },
  "id" : {
    type: String,
    optional: true
  },
  "meta" : {
    type: Object,
    optional: true,
    blackbox: true
  },
  "resourceType" : {
    type: String,
    defaultValue: "ActivityDefinition"
  },
  "extension" : {
    type:  Array,
    optional: true    
    },
  "extension.$" : {
    optional: true,
    blackbox: true,
    type:  Object 
    },
  "modifierExtension" : {
    optional: true,
    type:  Array
    },
  "modifierExtension.$" : {
    optional: true,
    blackbox: true,
    type:  Object 
    },
  "url" :  {
    optional: true,
    type: String
  },
  "identifier" : {
    optional: true,
    type:  Array
    },
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    },
  "version" :  {
    optional: true,
    type: String
  },
  "name" :  {
    optional: true,
    type: String
  },
  "title" :  {
    optional: true,
    type: String
  },
  "subtitle" :  {
    optional: true,
    type: String
  },
  "status" :  {
    optional: true,
    allowedValues: ["draft" , "active" , "retired" , "unknown"],
    type: Code
  },
  "experimental" :  {
    optional: true,
    type: Boolean
  },
  "subjectCodeableConcept" :  {
    optional: true,
    type: CodeableConceptSchema
  },
  "subjectReference" :  {
    optional: true,
    type: ReferenceSchema
  },
  "date" :  {
    optional: true,
    type: Date
  },
  "publisher" :  {
    optional: true,
    type: String
  },
  "purpose" :  {
    optional: true,
    type: String
  },
  "usage" :  {
    optional: true,
    type: String
  },
  "copyright" :  {
    optional: true,
    type: String
  },
  "approvalDate" :  {
    optional: true,
    type: Date
  },
  "lastReviewDate" :  {
    optional: true,
    type: Date
  },
  "effectivePeriod" :  {
    optional: true,
    type: PeriodSchema
  },
  "topic" :  {
    optional: true,
    type: Array
  },
  "topic.$" :  {
    optional: true,
    type: CodeableConceptSchema
  },
});

ActivityDefinitionSchema = ActivityDefinitionSchema;

// BaseSchema.extend(ActivityDefinitionSchema);
// DomainResourceSchema.extend(ActivityDefinitionSchema);

// ActivityDefinitions.attachSchema(ActivityDefinitionSchema);

export default { ActivityDefinition, ActivityDefinitions, ActivityDefinitionSchema };