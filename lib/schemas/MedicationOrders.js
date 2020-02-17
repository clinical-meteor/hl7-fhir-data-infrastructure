import SimpleSchema from 'simpl-schema';

// create the object using our BaseModel
MedicationOrder = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
MedicationOrder.prototype._collection = MedicationOrders;

// // Create a persistent data store for addresses to be stored.
// // HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');

if(typeof MedicationOrders === 'undefined'){
  if(Package['clinical:autopublish']){
    MedicationOrders = new Mongo.Collection('MedicationOrders');
  } else if(Package['clinical:desktop-publish']){    
    MedicationOrders = new Mongo.Collection('MedicationOrders');
  } else {
    MedicationOrders = new Mongo.Collection('MedicationOrders', {connection: null});
  }
}


//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
MedicationOrders._transform = function (document) {
  return new MedicationOrder(document);
};


MedicationOrderSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "MedicationOrder"
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

BaseSchema.extend(MedicationOrderSchema);
DomainResourceSchema.extend(MedicationOrderSchema);
MedicationOrders.attachSchema(MedicationOrderSchema);

export default { MedicationOrder, MedicationOrders, MedicationOrderSchema };