import SimpleSchema from 'simpl-schema';
import PeriodSchema from './Period';

IdentifierSchema = new SimpleSchema({
  "use" : {
    optional: true,
    type: String
  },
  "assigner" : {
    optional: true,
    type: Object
  },
  "type" : {
    optional: true,
    type: CodeableConceptSchema
  },
  "assigner.display" : {
    optional: true,
    type: String
  },
  "assigner.reference" : {
    optional: true,
    type: String
  },
  "system" : {
    optional: true,
    type: String
  },
  "value" : {
    optional: true,
    type: String
  },
  "period": {
    type: PeriodSchema,
    optional: true 
  }
  // "period.start" : {
  //   optional: true,
  //   type: Date
  // },
  // "period.end" : {
  //   optional: true,
  //   type: Date
  // }
});


export default IdentifierSchema;