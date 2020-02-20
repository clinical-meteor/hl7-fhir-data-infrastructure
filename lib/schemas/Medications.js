import SimpleSchema from 'simpl-schema';

// create the object using our BaseModel
Medication = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
Medication.prototype._collection = Medications;

// // Create a persistent data store for addresses to be stored.
// // HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');

if(typeof Medications === 'undefined'){
  if(Package['autopublish']){
    Medications = new Mongo.Collection('Medications');
    Substances = new Mongo.Collection('Substances');
  } else if(Package['clinical:autopublish']){    
    Medications = new Mongo.Collection('Medications');
    Substances = new Mongo.Collection('Substances');
  } else if(Package['clinical:desktop-publish']){    
    Medications = new Mongo.Collection('Medications');
    Substances = new Mongo.Collection('Substances');
  } else {
    Medications = new Mongo.Collection('Medications', {connection: null});
    Substances = new Mongo.Collection('Substances', {connection: null});
  }
}


//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
Medications._transform = function (document) {
  return new Medication(document);
};


MedicationDstu2 = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "Medication"
  },
  "code" :  {
    optional: true,
    type: CodeableConceptSchema
  }, // Codes that identify this medication
  "isBrand" :  {
    optional: true,
    type: Boolean
  }, // True if a brand
  "manufacturer" :  {
    optional: true,
    type: ReferenceSchema
  },// (Organization) // Manufacturer of the item
  "product" :  {
    optional: true,
    type: Object
  }, 

  "product.form" :  {
    optional: true,
    type: CodeableConceptSchema
  }, // powder | tablets | carton +
  "product.ingredient" :  {
    type: Array,
    optional: true
  }, 
  "product.ingredient.$" :  {
    type: Object,
    optional: true,
    blackbox: true
  }, 

  "product.batch.$" :  {
    optional: true,
    type: Object
  },

  "product.batch" :  {
    optional: true,
    type: Array
  },
  "product.batch.$.lotNumber" :  {
    optional: true,
    type: String
  },
  "product.batch.$.expirationDate" :  {
    optional: true,
    type: Date
  },
  "package" :  {
    optional: true,
    type: Object
   }, 

  "package.container" :  {
    optional: true,
    type: CodeableConceptSchema
   }, // E.g. box, vial, blister-pack

   "package.content" :  {
    optional: true,
    type: Array
  }, 
   "package.content.$" :  {
    optional: true,
    type: Object
  }, 

  "package.content.$.item" :  {
    optional: true,
    type: ReferenceSchema
  }, //(Medication) }, // R!  A product in the package
  "package.content.$.amount" :  {
    optional: true,
    type: QuantitySchema // (SimpleQuantity)
  }, // Quantity present in the package
  "url": {
    optional: true,
    type: String
  }
});



MedicationStu3 = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "Medication"
  },
  "code" :  {
    optional: true,
    type: CodeableConceptSchema
  }, // Codes that identify this medication
  "isBrand" :  {
    optional: true,
    type: Boolean
  }, // True if a brand
  "isOverTheCounter" :  {
    optional: true,
    type: Boolean
  }, // True if a brand
  "manufacturer" :  {
    optional: true,
    type: ReferenceSchema
  },// (Organization) // Manufacturer of the item
  "form" :  {
    optional: true,
    type: CodeableConceptSchema
  }, // powder | tablets | capsule +
  "ingredient" :  {
    optional: true,
    type: Array
  }, 
  "ingredient.$" :  {
    optional: true,
    type: Object
  }, 
  "ingredient.$.itemCodeableConcept" :  {
    optional: true,
    type: CodeableConceptSchema
  }, 
  "ingredient.$.itemReference" :  {
    optional: true,
    type: ReferenceSchema
  }, 
  "ingredient.$.isActive" :  {
    optional: true,
    type: Boolean
  }, 
  "ingredient.$.amount" :  {
    optional: true,
    type: RatioSchema
  }, 





  "package" :  {
    optional: true,
    type: Object
   }, 

  "package.container" :  {
    optional: true,
    type: CodeableConceptSchema
   }, // E.g. box, vial, blister-pack

   "package.content" :  {
    optional: true,
    type: Array
  }, 
   "package.content.$" :  {
    optional: true,
    type: Object
  }, 
  "package.content.$.itemCodeableConcept" :  {
    optional: true,
    type: CodeableConceptSchema
  }, //(Medication) }, // R!  A product in the package
  "package.content.$.itemReference" :  {
    optional: true,
    type: ReferenceSchema
  }, //(Medication) }, // R!  A product in the package
  "package.content.$.amount" :  {
    optional: true,
    type: QuantitySchema // (SimpleQuantity)
  }, // Quantity present in the package
  "package.batch" :  {
    optional: true,
    type: Array
  }, 
  "package.batch.$" :  {
    optional: true,
    type: Object
  }, 
  "package.batch.$.lotNumber" :  {
    optional: true,
    type: String
  }, 
  "package.batch.$.expirationDate" :  {
    optional: true,
    type: Date
  }, 

  "image": {
    optional: true,
    type: Array
  },
  "image.$": {
    optional: true,
    type: AttachmentSchema
  }

});


MedicationSchema = MedicationDstu2;

BaseSchema.extend(MedicationSchema);
DomainResourceSchema.extend(MedicationSchema);
Medications.attachSchema(MedicationSchema);

export default { Medication, Medications, MedicationSchema, MedicationDstu2, MedicationStu3, Substances };