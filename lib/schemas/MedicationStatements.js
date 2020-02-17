import SimpleSchema from 'simpl-schema';
import { BaseSchema, DomainResourceSchema } from 'meteor/clinical:hl7-resource-datatypes'

// create the object using our BaseModel
MedicationStatement = BaseModel.extend();

//Assign a collection so the object knows how to perform CRUD operations
MedicationStatement.prototype._collection = MedicationStatements;

// // Create a persistent data store for addresses to be stored.
// // HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');

if(typeof MedicationStatements === 'undefined'){
  if(Package['clinical:autopublish']){
    MedicationStatements = new Mongo.Collection('MedicationStatements');
  } else if(Package['clinical:desktop-publish']){    
    MedicationStatements = new Mongo.Collection('MedicationStatements');
  } else {
    MedicationStatements = new Mongo.Collection('MedicationStatements', {connection: null});
  }
}

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
MedicationStatements._transform = function (document) {
  return new MedicationStatement(document);
};



MedicationStatementDstu2 = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "MedicationStatement"
  },
  "identifier" : {
    optional: true,
    type:  Array
    },
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    },
  "patient" : {
    type: ReferenceSchema
  },
  "informationSource" : {
    optional: true,
    type: ReferenceSchema
  },
  "dateAsserted" : {
    optional: true,
    type: Date,
    defaultValue: new Date()    
  },
  "status" : {
    type: String,
    allowedValues: ['active', 'completed', 'entered-in-error', 'intended'],
    defaultValue: 'active'
  },
  "wasNotTaken" : {
    optional: true,
    type: Boolean,
    defaultValue: true
  },

  "reasonNotTaken" : {
    optional: true,
    type: Array
  },
  "reasonNotTaken.$" : {
    optional: true,
    type: CodeableConceptSchema 
  },
  "reasonForUseCodeableConcept" : {
    optional: true,
    type: CodeableConceptSchema
  },
  "reasonForUseReference" : {
    optional: true,
    type: ReferenceSchema 
  },
  "effectiveDateTime" : {
    optional: true,
    type: Date,
    defaultValue: new Date()
  },
  "effectivePeriod" : {
    optional: true,
    type: PeriodSchema
  },
  "note" : {
    optional: true,
    type: String 
  },
  "supportingInformation" : {
    optional: true,
    type: Array 
  },
  "supportingInformation.$" : {
    optional: true,
    type: ReferenceSchema 
  },
  "medicationCodeableConcept" : {
    optional: true,
    type: CodeableConceptSchema
  },
  "medicationReference" : {
    optional: true,
    type: ReferenceSchema
  },
  "dosage" : {
    optional: true,
    type: Array
  },
  "dosage.$" : {
    optional: true,
    blackbox: true,
    type: Object 
  },
  "dosage.$.text" : {
    optional: true,
    type: String 
  },
  "dosage.$.timing" : {
    optional: true,
    type: TimingSchema 
  },
  "dosage.$.asNeededBoolean" : {
    optional: true,
    type: Boolean 
  },
  "dosage.$.asNeededCodeableConcept" : {
    optional: true,
    type: CodeableConceptSchema 
  },
  "dosage.$.siteCodeableConcept" : {
    optional: true,
    type: CodeableConceptSchema 
  },
  "dosage.$.route" : {
    optional: true,
    type: CodeableConceptSchema 
  },
  "dosage.$.method" : {
    optional: true,
    type: CodeableConceptSchema 
  },
  "dosage.$.quantityQuantity" : {
    optional: true,
    type: QuantitySchema 
  },
  "dosage.$.quantityRange" : {
    optional: true,
    type: RangeSchema 
  },
  "dosage.$.rateRatio" : {
    optional: true,
    type: RatioSchema 
  },
  "dosage.$.rateRange" : {
    optional: true,
    type: RangeSchema 
  },
  "dosage.$.maxDosePerPeriod" : {
    optional: true,
    type: RatioSchema 
  }
});




MedicationStatementStu3 = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "MedicationStatement"
  },
  "identifier" : {
    optional: true,
    type:  Array
    },
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    },
  "basedOn" : {
    optional: true,
    type: Array
  },
  "basedOn.$" : {
    optional: true,
    type: ReferenceSchema 
  },
  "partOf" : {
    optional: true,
    type: Array
  },  
  "partOf.$" : {
    optional: true,
    type: ReferenceSchema 
  },  
  "context" : {
    optional: true,
    type: ReferenceSchema
  },
  "status" : {
    type: String,
    allowedValues: ['active', 'completed', 'entered-in-error', 'intended', 'stopped', 'on-hold'],
    defaultValue: 'active'
  },
  "category" : {
    optional: true,
    type: CodeableConcept
  },  
  "medicationCodeableConcept" : {
    optional: true,
    type: CodeableConceptSchema
  },
  "medicationReference" : {
    optional: true,
    type: ReferenceSchema
  },
  "effectiveDateTime" : {
    optional: true,
    type: Date,
    defaultValue: new Date()
  },
  "effectivePeriod" : {
    optional: true,
    type: PeriodSchema
  },
  "dateAsserted" : {
    optional: true,
    type: Date,
    defaultValue: new Date()    
  },
  "informationSource" : {
    optional: true,
    type: ReferenceSchema
  },
  "subject" : {
    type: ReferenceSchema
  },
  "derivedFrom" : {
    optional: true,
    type: Array
  },
  "derivedFrom.$" : {
    optional: true,
    type: ReferenceSchema
  },
  "taken" : {
    type: String,
    allowedValues: ['y', 'n', 'unk', 'na'],
    defaultValue: 'y'
  },
  "reasonNotTaken" : {
    optional: true,
    type: Array
  },
  "reasonNotTaken.$" : {
    optional: true,
    type: CodeableConceptSchema 
  },
  "reasonCode" : {
    optional: true,
    type: Array
  },
  "reasonCode" : {
    optional: true,
    type: CodeableConceptSchema 
  },
  "note" : {
    optional: true,
    type: Array
  },
  "note.$" : {
    optional: true,
    type: AnnotationSchema 
  },
  "dosage" : {
    optional: true,
    type: Array
  },
  "dosage.$" : {
    optional: true,
    blackbox: true,
    type: Object 
  }
});

MedicationStatementSchema = MedicationStatementDstu2;

// MedicationStatementSchema.extend(BaseSchema);
// MedicationStatementSchema.extend(DomainResourceSchema);

MedicationStatements.attachSchema(MedicationStatementSchema);

export default { MedicationStatement, MedicationStatements, MedicationStatementSchema, MedicationStatementDstu2, MedicationStatementStu3 };