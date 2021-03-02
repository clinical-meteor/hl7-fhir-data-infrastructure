import SimpleSchema from 'simpl-schema';
import Code from './Code';

BasicSchema = new SimpleSchema({
  "id" : {
    type: String,
    optional: true
  },
  "resourceType" : {
    type: String,
    defaultValue: "Basic"
  },
  "identifier" : {
    optional: true,
    type:  Array
    },
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    },
  "code" : {
    type: CodeableConceptSchema 
    },
  "subject" : {
    optional: true,
    type: ReferenceSchema
    },    
  "created" : {
    optional: true,
    type: Date
    },    
  "author" : {
    optional: true,
    type: ReferenceSchema 
    }, 
});

export default BasicSchema;