import SimpleSchema from 'simpl-schema';
import Code from './Code';

BaseSchema = new SimpleSchema({
  "_id" : {
    type: String,
    optional: true
  },
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