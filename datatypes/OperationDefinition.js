import SimpleSchema from 'simpl-schema';
import Code from './Code';

OperationDefinitionSchema = new SimpleSchema({
  "id" : {
    type: String,
    optional: true
  },
  "resourceType" : {
    type: String,
    defaultValue: "OperationDefinition"
  },


  "url" : {
    optional: true,
    type: String
    }, // Canonical identifier for this operation definition, represented as a URI (globally unique)
  "version" : {
    optional: true,
    type: String
    }, // Business version of the operation definition
  "name" : {
    type: String
    }, // C? R!  Name for this operation definition (computer friendly)
  "title" : {
    optional: true,
    type: String
    }, // Name for this operation definition (human friendly)
  "status" : {
    type: String,
    allowedValues: ['draft', 'active', 'retired', 'unknown']
    }, // R!  draft | active | retired | unknown
  "kind" : {
    type: String,
    allowedValues: ['operation', 'query']
    }, // R!  operation | query
  "experimental" : {
    optional: true,
    type: Boolean
  }, // For testing purposes, not real usage
  "date" : {
    optional: true,
    type: "Date"
    }, // Date last changed
  "publisher" : {
    optional: true,
    type: String
    }, // Name of the publisher (organization or individual)
  "contact" : {
    optional: true,
    type: Array
  }, // Contact details for the publisher
  "contact.$" : {
    optional: true,
    blackbox: true,
    type: Object
  }, // Contact details for the publisher
  "description" : {
    optional: true,
    type: String
    }, // Natural language description of the operation definition
  "useContext" : {
    optional: true,
    type: Array
  }, // The context that the content is intended to support
  "useContext.$" : {
    optional: true,
    blackbox: true,
    type: Object
  }, // The context that the content is intended to support
  "jurisdiction" : {
    optional: true,
    type: Array
  }, // Intended jurisdiction for operation definition (if applicable)
  "jurisdiction.$" : {
    optional: true,
    type: CodeableConcept 
  }, // Intended jurisdiction for operation definition (if applicable)
  "purpose" : {
    optional: true,
    type: String
    }, // Why this operation definition is defined
  "affectsState" : {
    optional: true,
    type: Boolean
  }, // Whether content is changed by the operation
  "code" : {
    type: String
    }, // R!  Name used to invoke the operation
  "comment" : {
    optional: true,
    type: String
    }, // Additional information about use
  "base" : { 
    optional: true,
    blackbox: true,
    type: Object 
  }, // Marks this as a profile of the base
  "resource" : {
    optional: true,
    type: Array
  }, // Types this operation applies to
  "resource.$" : {
    optional: true,
    type: String
  }, // Types this operation applies to
  "system" : {
    type: Boolean
  }, // R!  Invoke at the system level?
  "type" : {
    type: Boolean
  }, // R!  Invoke at the type level?
  "instance" : {
    type: Boolean
  }, // R!  Invoke on an instance?
  "inputProfile" : { 
    optional: true,
    blackbox: true,
    type: Object 
  }, // Validation information for in parameters
  "outputProfile" : { 
    optional: true,
    blackbox: true,
    type: Object 
  }, // Validation information for out parameters

  "parameter" : {
    type: String
    }, // R!  Name in Parameters.parameter.name or in URL
  "parameter.$" : {
    type: String
    }, // R!  Name in Parameters.parameter.name or in URL
  "parameter.$.name" : {
    type: String
    }, // R!  Name in Parameters.parameter.name or in URL
  "parameter.$.use" : {
    type: String
    }, // R!  in | out
  "parameter.$.min" : {
    type: Number 
    }, // R!  Minimum Cardinality
  "parameter.$.max" : {
    type: String
    }, // R!  Maximum Cardinality (a number or *)
  "parameter.$.documentation" : {
    optional: true,
    type: String
    }, // Description of meaning/use
  "parameter.$.type" : {
    optional: true,
    type: String
    }, // C? What type this parameter has
  "parameter.$.targetProfile" : {
    optional: true,
    type: Array
  }, // If type is Reference | canonical, allowed targets
  "parameter.$.targetProfile.$" : {
    optional: true,
    type: Object, 
    blackbox: true 
  }, // If type is Reference | canonical, allowed targets
  "parameter.$.searchType" : {
    optional: true,
    type: String,
    allowedValues: ['number', 'date', 'string', 'token', 'reference', 'composite', 'quantity', 'uri', 'special']
    }, // C? number | date | string | token | reference | composite | quantity | uri | special

  "parameter.$.binding" : {
    type: Object
    },       
  "parameter.$.binding.strength" : {
    type: String,
    allowedValues: ['required', 'extensible', 'preferred', 'example']
    }, // R!  required | extensible | preferred | example
  "parameter.$.binding.valueSet" : { 
    type: Object,
    blackbox: true 
  }, // R!  Source of value set
  "parameter.$.referencedFrom" : {
    type: String
    }, // R!  Referencing parameter
  "parameter.$.referencedFrom.$" : {
    type: String
    }, // R!  Referencing parameter
  "parameter.$.referencedFrom.$.source" : {
    type: String
    }, // R!  Referencing parameter
  "parameter.$.referencedFrom.$.sourceId" : {
    optional: true,
    type: String
   }, // Element id of reference
  "parameter.$.part" : {
    optional: true,
    type: Array
   },  // C? Parts of a nested Parameter
  "parameter.$.part.$" : {
    optional: true,
    blackbox: true,
    type: Object 
   },  // C? Parts of a nested Parameter
  "overload" : {
    optional: true,
    type: Array
  }, // Name of parameter to include in overload
  "overload.$" : {
    optional: true,
    type: Object
  }, // Name of parameter to include in overload
  "overload.$.parameterName" : {
    optional: true,
    type: Array
  }, // Name of parameter to include in overload
  "overload.$.parameterName.$" : {
    optional: true,
    type: String
  }, // Name of parameter to include in overload
  "overload.$.comment" : {
    optional: true,
    type: String 
  }// Comments to go on overload
});

export default OperationDefinitionSchema;