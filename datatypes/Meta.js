import SimpleSchema from 'simpl-schema';
import CodingSchema from './Coding'

MetaSchema = new SimpleSchema({
  "versionId" : {
    type: String,
    optional: true,
    defaultValue: "1"
  },
  "lastUpdated" : {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return new Date();
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    },
    optional: true
  },
  "profile" : {
    type: String,
    optional: true
  },
  "security" : {
    type: Array,
    optional: true
  },
  "security.$" : {
    type: CodingSchema,
    optional: true
  },
  "tag" : {
    type: Array,
    optional: true
  },
  "tag.$" : {
    type: CodingSchema,
    optional: true
  },  
  "fhirVersion" : {
    type: String,
    optional: true,
    allowedValues: ['fhir-0.0.1', 'fhir-0.0.5', 'fhir-0.0.6', 'fhir-0.0.11', 'fhir-0.0.82', 'fhir-0.4.0', 'fhir-0.5.0', 'fhir-1.0.0', 'fhir-1.0.2', 'fhir-1.1.0', 'fhir-1.4.0', 'fhir-1.6.0', 'fhir-1.8.0', 'fhir-3.0.0', 'fhir-3.1.0']
  }
});


export default MetaSchema;