import SimpleSchema from 'simpl-schema';

// create the object using our BaseModel
Observation = BaseModel.extend();

//Assign a collection so the object knows how to perform CRUD operations
Observation.prototype._collection = Observations;

// // Create a persistent data store for addresses to be stored.
// // HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');

if(typeof Observations === 'undefined'){
  if(Package['clinical:autopublish']){
    Observations = new Mongo.Collection('Observations');
  } else if(Package['clinical:desktop-publish']){    
    Observations = new Mongo.Collection('Observations');
  } else {
    Observations = new Mongo.Collection('Observations', {connection: null});
  }
}


//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
Observations._transform = function (document) {
  return new Observation(document);
};




ObservationDstu2 = new SimpleSchema({
  'resourceType' : {
    type: String,
    defaultValue: 'Observation'
  },
  "identifier" : {
    optional: true,
    type:  Array
    },
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    },
  'status' : {
    type: Code,
    allowedValues: ['registered', 'preliminary', 'final', 'amended', 'cancelled', 'entered-in-error', 'unknown']
  }, // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error
  'category' : {
    optional: true,
    type: CodeableConceptSchema
  }, // Service category
  'code' : {
    type: CodeableConceptSchema
  }, // R!  Name/Code for this diagnostic report
  'subject' : {
    optional: true,
    type: ReferenceSchema
  }, // R!  The subject of the report, usually, but not always, the patient
  'encounter' : {
    optional: true,
    type: ReferenceSchema
  }, // Health care event when test ordered
  'effectiveDateTime' : {
    optional: true,
    type: Date
  },
  'effectivePeriod' : {
    optional: true,
    type: PeriodSchema
  },
  'issued' : {
    optional: true,
    type: Date
  }, // R!  DateTime this version was released
  'performer' : {
    optional: true,
    type: Array
  }, // R!  Responsible Diagnostic Service
  'performer.$' : {
    optional: true,
    type: ReferenceSchema 
  }, // R!  Responsible Diagnostic Service

  'valueQuantity' : {
    optional: true,
    type: QuantitySchema
  },
  'valueCodeableConcept' : {
    optional: true,
    type: CodeableConceptSchema
  },
  'valueString' : {
    optional: true,
    type: String
  },
  'valueRange' : {
    optional: true,
    type: RangeSchema
  },
  'valueRatio' : {
    optional: true,
    type: RatioSchema
  },
  'valueSampledData' : {
    optional: true,
    type: SampledDataSchema
  },
  'valueAttachment' : {
    optional: true,
    type: AttachmentSchema
  },
  'valueTime' : {
    optional: true,
    type: Date
  },
  'valueDateTime' : {
    optional: true,
    type: Date
  },
  'valuePeriod' : {
    optional: true,
    type: PeriodSchema
  },
  'dataAbsentReason' : {
    optional: true,
    type: CodeableConceptSchema
  }, // C? Why the result is missing
  'interpretation' : {
    optional: true,
    type: CodeableConceptSchema
  }, // High, low, normal, etc.
  'comments' : {
    optional: true,
    type: String
  }, // Comments about result
  'bodySite' : {
    optional: true,
    type: CodeableConceptSchema
  }, // Observed body part
  'method' : {
    optional: true,
    type: CodeableConceptSchema
  }, // How it was done
  'specimen' : {
    optional: true,
    type: ReferenceSchema
  }, // Specimen used for this observation
  'device' : {
    optional: true,
    type: ReferenceSchema
  }, // (Measurement) Device


  "referenceRange" : {
    optional: true,
    type:  Array
    },
  "referenceRange.$" : {
    optional: true,
    type:  Object 
    },
  'referenceRange.$.low' : {
    optional: true,
    type: QuantitySchema
  }, // C? Low Range, if relevant
  'referenceRange.$.high' : {
    optional: true,
    type: QuantitySchema
  }, // C? High Range, if relevant
  'referenceRange.$.meaning' : {
    optional: true,
    type: CodeableConceptSchema
  }, // Indicates the meaning/use of this range of this range
  'referenceRange.$.age' : {
    optional: true,
    type: RangeSchema
  }, // Applicable age range, if relevant
  'referenceRange.$.text' : {
    optional: true,
    type: String
  }, // Text based reference range in an observation

  "related" : {
    optional: true,
    type:  Array
    },
  "related.$" : {
    optional: true,
    type:  Object 
    },
  'related.$.type' : {
    optional: true,
    type: Code
  }, // has-member | derived-from | sequel-to | replaces | qualified-by | interfered-by
  'related.$.target' : {
    type: ReferenceSchema
  }, // R!  Resource that is related to this one


  "component" : {
    optional: true,
    type:  Array
    },
  "component.$" : {
    optional: true,
    type:  Object 
    },  
  'component.$.code' : {
    type: CodeableConceptSchema
  }, // C? R!  Type of component observation (code / type)
  'component.$.valueQuantity' : {
    optional: true,
    type: QuantitySchema
  },
  'component.$.valueCodeableConcept' : {
    optional: true,
    type: CodeableConceptSchema
  },
  'component.$.valueString' : {
    optional: true,
    type: String
  },
  'component.$.valueRange' : {
    optional: true,
    type: RangeSchema
  },
  'component.$.valueRatio' : {
    optional: true,
    type: RatioSchema
  },
  'component.$.valueSampledData' : {
    optional: true,
    type: SampledDataSchema
  },
  'component.$.valueAttachment' : {
    optional: true,
    type: AttachmentSchema
  },
  'component.$.valueTime' : {
    optional: true,
    type: Date
  },
  'component.$.valueDateTime' : {
    optional: true,
    type: Date
  },
  'component.$.valuePeriod' : {
    optional: true,
    type: PeriodSchema
  },
  'component.$.dataAbsentReason' : {
    optional: true,
    type: CodeableConceptSchema
  }

});




ObservationStu3 = new SimpleSchema({
  'resourceType' : {
    type: String,
    defaultValue: 'Observation'
  },
  "identifier" : {
    optional: true,
    type:  Array
    },
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    },
  'basedOn' : {
    optional: true,
    type: ReferenceSchema
  }, 
  'status' : {
    type: Code,
    allowedValues: ['registered', 'preliminary', 'final', 'amended', 'corrected', 'cancelled', 'entered-in-error', 'unknown'],
    defaultValue: 'preliminary'
  }, // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error
  'category' : {
    optional: true,
    type: CodeableConceptSchema
  }, // Service category
  'code' : {
    type: CodeableConceptSchema
  }, // R!  Name/Code for this diagnostic report
  'subject' : {
    optional: true,
    type: ReferenceSchema
  }, // R!  The subject of the report, usually, but not always, the patient
  'context' : {
    optional: true,
    type: ReferenceSchema
  }, // Health care event when test ordered
  'effectiveDateTime' : {
    optional: true,
    type: Date
  },
  'effectivePeriod' : {
    optional: true,
    type: PeriodSchema
  },
  'issued' : {
    optional: true,
    type: Date
  }, // R!  DateTime this version was released
  'performer' : {
    optional: true,
    type: Array
  }, // R!  Responsible Diagnostic Service
  'performer.$' : {
    optional: true,
    type: ReferenceSchema 
  }, // R!  Responsible Diagnostic Service

  'valueQuantity' : {
    optional: true,
    type: QuantitySchema
  },
  'valueCodeableConcept' : {
    optional: true,
    type: CodeableConceptSchema
  },
  'valueString' : {
    optional: true,
    type: String
  },
  'valueRange' : {
    optional: true,
    type: RangeSchema
  },
  'valueRatio' : {
    optional: true,
    type: RatioSchema
  },
  'valueSampledData' : {
    optional: true,
    type: SampledDataSchema
  },
  'valueAttachment' : {
    optional: true,
    type: AttachmentSchema
  },
  'valueTime' : {
    optional: true,
    type: Date
  },
  'valueDateTime' : {
    optional: true,
    type: Date
  },
  'valuePeriod' : {
    optional: true,
    type: PeriodSchema
  },
  'dataAbsentReason' : {
    optional: true,
    type: CodeableConceptSchema
  }, // C? Why the result is missing
  'interpretation' : {
    optional: true,
    type: CodeableConceptSchema
  }, // High, low, normal, etc.
  'comments' : {
    optional: true,
    type: String
  }, // Comments about result
  'bodySite' : {
    optional: true,
    type: CodeableConceptSchema
  }, // Observed body part
  'method' : {
    optional: true,
    type: CodeableConceptSchema
  }, // How it was done
  'specimen' : {
    optional: true,
    type: ReferenceSchema
  }, // Specimen used for this observation
  'device' : {
    optional: true,
    type: ReferenceSchema
  }, // (Measurement) Device


  "referenceRange" : {
    optional: true,
    type:  Array
    },
  "referenceRange.$" : {
    optional: true,
    type:  Object 
    },
  'referenceRange.$.low' : {
    optional: true,
    type: QuantitySchema
  }, // C? Low Range, if relevant
  'referenceRange.$.high' : {
    optional: true,
    type: QuantitySchema
  }, // C? High Range, if relevant
  'referenceRange.$.type' : {
    optional: true,
    type: CodeableConceptSchema
  }, // Indicates the meaning/use of this range of this range
  'referenceRange.$.appliesTo' : {
    optional: true,
    type: Array
  }, // Indicates the meaning/use of this range of this range
  'referenceRange.$.appliesTo.$' : {
    optional: true,
    type: CodeableConceptSchema
  }, // Indicates the meaning/use of this range of this range
  'referenceRange.$.age' : {
    optional: true,
    type: RangeSchema
  }, // Applicable age range, if relevant
  'referenceRange.$.text' : {
    optional: true,
    type: String
  }, // Text based reference range in an observation

  "related" : {
    optional: true,
    type:  Array
    },
  "related.$" : {
    optional: true,
    type:  Object 
    },
  'related.$.type' : {
    optional: true,
    type: Code
  }, // has-member | derived-from | sequel-to | replaces | qualified-by | interfered-by
  'related.$.target' : {
    type: ReferenceSchema
  }, // R!  Resource that is related to this one


  "component" : {
    optional: true,
    type:  Array
    },
  "component.$" : {
    optional: true,
    type:  Object 
    },  
  'component.$.code' : {
    type: CodeableConceptSchema
  }, // C? R!  Type of component observation (code / type)
  'component.$.valueQuantity' : {
    optional: true,
    type: QuantitySchema
  },
  'component.$.valueCodeableConcept' : {
    optional: true,
    type: CodeableConceptSchema
  },
  'component.$.valueString' : {
    optional: true,
    type: String
  },
  'component.$.valueRange' : {
    optional: true,
    type: RangeSchema
  },
  'component.$.valueRatio' : {
    optional: true,
    type: RatioSchema
  },
  'component.$.valueSampledData' : {
    optional: true,
    type: SampledDataSchema
  },
  'component.$.valueAttachment' : {
    optional: true,
    type: AttachmentSchema
  },
  'component.$.valueTime' : {
    optional: true,
    type: Date
  },
  'component.$.valueDateTime' : {
    optional: true,
    type: Date
  },
  'component.$.valuePeriod' : {
    optional: true,
    type: PeriodSchema
  },
  'component.$.dataAbsentReason' : {
    optional: true,
    type: CodeableConceptSchema
  },
  'component.$.interpretation' : {
    optional: true,
    type: CodeableConceptSchema
  },
  'component.$.referenceRange' : {
    optional: true,
    type: Array
  },
  'component.$.referenceRange.$' : {
    optional: true,
    type: Object
  }
});



ObservationSchema = ObservationDstu2;


BaseSchema.extend(ObservationSchema);
DomainResourceSchema.extend(ObservationSchema);
Observations.attachSchema(ObservationSchema);

export default { Observation, Observations, ObservationSchema, ObservationDstu2, ObservationStu3 };