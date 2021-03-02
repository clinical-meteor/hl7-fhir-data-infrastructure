import SimpleSchema from 'simpl-schema';
import Code from './Code';

BaseSchema = new SimpleSchema({
  "id" : {
    type: String,
    optional: true
  },
  "resourceType" : {
    type: String
  },
  "meta" : {
    type: MetaSchema
  },
  "implicitRules" : {
    type: String,
    optional: true
  },
  "language" : {
    type: Code,
    optional: true
  }
});

export default BaseSchema;