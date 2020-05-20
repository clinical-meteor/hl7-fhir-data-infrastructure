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


import BaseModel from '../BaseModel';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { BaseSchema, DomainResourceSchema, HumanNameSchema, IdentifierSchema, ContactPointSchema, AddressSchema, ReferenceSchema, SignatureSchema } from 'meteor/clinical:hl7-resource-datatypes';



// // create the object using our BaseModel
MeasureReport = BaseModel.extend();


// //Assign a collection so the object knows how to perform CRUD operations
MeasureReport.prototype._collection = MeasureReports;

// Create a persistent data store for addresses to be stored.
// HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');

if(typeof MeasureReports === 'undefined'){
//   if(Package['clinical:autopublish']){
//     MeasureReports = new Mongo.Collection('MeasureReports');
//   } else if(Package['clinical:desktop-publish']){
//     MeasureReports = new Mongo.Collection('MeasureReports');
//   } else {
  // MeasureReports = new Mongo.Collection('MeasureReports', {connection: null});
//   }
  MeasureReports = new Mongo.Collection('MeasureReports');
}


// //Add the transform to the collection since Meteor.users is pre-defined by the accounts package
// MeasureReports._transform = function (document) {
//   return new Encounter(document);
// };




// ===================================================

MeasureReportSchemaR4 = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "MeasureReport"
  },
  "_id" : {
    optional: true,
    type:  String
    },
  "id" : {
    optional: true,
    type:  String
    },
  "meta" : {
    optional: true,
    blackbox: true,
    type:  Object
  },
  "extension" : {
    optional: true,
    type:  Array
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
  "identifier" : {
    optional: true,
    type:  Array
    },
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    },
  "status" : {
    optional: true,
    allowedValues: ['complete', 'pending', 'error'],
    type:  String
  },
  "type" : {
    optional: true,
    allowedValues: ['individual', 'subject-list', 'summary', 'data-collection'],
    type:  String
  },
  "measure" : {
    optional: true,
    type:  String
  },
  "subject" : {
    optional: true,
    type:  ReferenceSchema
  },
  'date' : {
    optional: true,
    type: Date
  },
  "reporter" : {
    optional: true,
    type:  ReferenceSchema
  },
  "period" : {
    optional: true,
    type: PeriodSchema
  },
  "improvementNotation" : {
    optional: true,
    type:  CodeableConceptSchema
    },
  "group" : {
    optional: true,
    type: Array
  }, 
  "group.$" : {
    optional: true,
    type: Object
  }, 
  "group.$.code" : {
    optional: true,
    type: CodeableConceptSchema
  }, 
  "group.$.population" : {
    optional: true,
    type: Array
  }, 
  "group.$.population.$" : {
    optional: true,
    type: Object
  }, 
  "group.$.population.$.code" : {
    optional: true,
    type: CodeableConceptSchema
  }, 
  "group.$.population.$.count" : {
    optional: true,
    type: Number
  }, 
  "group.$.population.$.subjectResults" : {
    optional: true,
    blackbox: true,
    type: Object
  }, 
  "group.$.measureScore" : {
    optional: true,
    type: QuantitySchema
  }, 
  "group.$.stratifier" : {
    optional: true,
    type: Array
  }, 
  "group.$.stratifier.$" : {
    optional: true,
    blackbox: true,
    type: Object
  }, 
});

MeasureReportSchema = MeasureReportSchemaR4;
MeasureReports.attachSchema(MeasureReportSchema);

export { MeasureReportSchemaDstu2, MeasureReportSchema, MeasureReportSchemaR4 }

