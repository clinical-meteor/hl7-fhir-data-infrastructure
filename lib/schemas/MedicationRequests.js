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


// create the object using our BaseModel
MedicationRequest = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
MedicationRequest.prototype._collection = MedicationRequests;

// // Create a persistent data store for addresses to be stored.
// // HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');

if(typeof MedicationRequests === 'undefined'){
  if(Package['clinical:autopublish']){
    MedicationRequests = new Mongo.Collection('MedicationRequests');
  } else if(Package['clinical:desktop-publish']){    
    MedicationRequests = new Mongo.Collection('MedicationRequests');
  } else {
    MedicationRequests = new Mongo.Collection('MedicationRequests', {connection: null});
  }
}


//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
MedicationRequests._transform = function (document) {
  return new MedicationRequest(document);
};


MedicationRequestSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "MedicationRequest"
  },
  "identifier" : {
    optional: true,
    type:  Array
    },
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    },
  "dateWritten" : {
    optional: true,
    type: Date
  },
  "status" : {
    optional: true,
    type: String
  },
  "dateEnded" : {
    optional: true,
    type: Date
  },
  "reasonEnded" : {
    optional: true,
    type: CodeableConceptSchema
  },
  "patient" : {
    optional: true,
    type: ReferenceSchema
  },
  "prescriber" : {
    optional: true,
    type: ReferenceSchema
  },
  "encounter" : {
    optional: true,
    type: ReferenceSchema
  },

  "reasonCodeableConceptSchema" : {
    optional: true,
    type: CodeableConceptSchema
  },
  "reasonReferenceSchema" : {
    optional: true,
    type: ReferenceSchema
  },
  "note" : {
    optional: true,
    type: String
  },

  "medicationCodeableConceptSchema" : {
    optional: true,
    type: CodeableConceptSchema
  },
  "medicationReferenceSchema" : {
    optional: true,
    type: ReferenceSchema
  },

  "dosageInstruction" : {
    optional: true,
    type: Array
  },
  "dosageInstruction.$" : {
    optional: true,
    type: Object
  },  
  "dosageInstruction.$.text" : {
    optional: true,
    type: String
  },
  "dosageInstruction.$.additionalInstructions" : {
    optional: true,
    type: CodeableConceptSchema
  },
  "dosageInstruction.$.timing" : {
    optional: true,
    type: TimingSchema
  },

  "dosageInstruction.$.asNeededBoolean" : {
    optional: true,
    type: Boolean
  },
  "dosageInstruction.$.asNeededCodeableConceptSchema" : {
    optional: true,
    type: CodeableConceptSchema
  },

  "dosageInstruction.$.siteCodeableConceptSchema" : {
    optional: true,
    type: CodeableConceptSchema
  },
  "dosageInstruction.$.siteReferenceSchema" : {
    optional: true,
    type: ReferenceSchema
  },
  "dosageInstruction.$.route" : {
    optional: true,
    type: CodeableConceptSchema
  },
  "dosageInstruction.$.method" : {
    optional: true,
    type: CodeableConceptSchema
  },

  "dosageInstruction.$.doseRange" : {
    optional: true,
    type: RangeSchema
  },
  "dosageInstruction.$.doseQuantity" : {
    optional: true,
    type: QuantitySchema
  },

  "dosageInstruction.$.rateRatio" : {
    optional: true,
    type: RatioSchema
  },
  "dosageInstruction.$.rateRange" : {
    optional: true,
    type: RangeSchema
  },
  "dosageInstruction.$.maxDosePerPeriodSchema" : {
    optional: true,
    type: RatioSchema
  },

  "dispenseRequest" : {
    optional: true,
    type: Object
    },

  "dispenseRequest.medicationCodeableConceptSchema" : {
    optional: true,
    type: CodeableConceptSchema
  },
  "dispenseRequest.medicationReferenceSchema" : {
    optional: true,
    type: ReferenceSchema
  },
  "dispenseRequest.validityPeriodSchema" : {
    optional: true,
    type: PeriodSchema
  },
  "dispenseRequest.numberOfRepeatsAllowed" : {
    optional: true,
    type: Number
  },
  "dispenseRequest.quantity" : {
    optional: true,
    type: QuantitySchema
  },
  "dispenseRequest.expectedSupplyDuration" : {
    optional: true,
    type: QuantitySchema
  },

  "substitution" : {
    optional: true,
    type:  Array
    },
  "substitution.$" : {
    optional: true,
    type:  IdentifierSchema 
    },
  "substitution.type" : {
    optional: true,
    type: CodeableConceptSchema
  },
  "substitution.reason" : {
    optional: true,
    type: CodeableConceptSchema
  },
  "priorPrescription" : {
    optional: true,
    type: ReferenceSchema
  }
});

BaseSchema.extend(MedicationRequestSchema);
DomainResourceSchema.extend(MedicationRequestSchema);
MedicationRequests.attachSchema(MedicationRequestSchema);

export default { MedicationRequest, MedicationRequests, MedicationRequestSchema };