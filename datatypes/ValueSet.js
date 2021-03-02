import SimpleSchema from 'simpl-schema';
import Code from './Code';

ValueSetSchema = new SimpleSchema({
  "id" : {
    type: String,
    optional: true
  },
  "resourceType" : {
    type: String,
    defaultValue: "ValueSet"
  },
  "identifier" : {
    optional: true,
    type:  Array
    },
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    },


  "url" : {
    type: String
  }, // Canonical identifier for this value set, represented as a URI (globally unique)

  "version" : {
    optional: true,
    type: String
  }, // Business version of the value set
  "name" : {
    optional: true,
    type: String
  }, // C? Name for this value set (computer friendly)
  "title" : {
    optional: true,
    type: String
  }, // Name for this value set (human friendly)
  "status" : {
    type: String,
    allowedValues: ['draft', 'active', 'retired', 'unknown']
  }, // R!  draft | active | retired | unknown
  "experimental" : {
    optional: true,
    type: Boolean
  }, // For testing purposes, not real usage
  "date" : {
    optional: true,
    type: Date
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
  }, // Natural language description of the value set
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
  }, // Intended jurisdiction for value set (if applicable)
  "jurisdiction.$" : {
    optional: true,
    type: CodeableConcept 
  }, // Intended jurisdiction for value set (if applicable)
  "immutable" : {
    optional: true,
    type: Boolean
  }, // Indicates whether or not any change to the content logical definition may occur
  "purpose" : {
    optional: true,
    type: String
  }, // Why this value set is defined
  "copyright" : {
    optional: true,
    type: String
  }, // Use and/or publishing restrictions
  "compose" : {
    optional: true,
    type: Object
   }, // Content logical definition of the value set (CLD)
  "compose.lockedDate" : {
    optional: true,
    type: Date
  }, // Fixed date for references with no specified version (transitive)
  "compose.inactive" : {
    optional: true,
    type: Boolean
  }, // Whether inactive codes are in the value set
  "compose.include" : {
    optional: true,
    type: Array
  }, // C? The system the codes come from
  "compose.include.$" : {
    type: Object
  }, // C? The system the codes come from
  "compose.include.$.system" : {
    optional: true,
    type: String
  }, // C? The system the codes come from
  "compose.include.$.version" : {
    optional: true,
    type: String
  }, // Specific version of the code system referred to
  "compose.include.$.concept" : {
    optional: true,
    type: Array
  }, // R!  Code or expression from system
  "compose.include.$.concept.$" : {
    optional: true,
    type: Object
  }, // R!  Code or expression from system
  "compose.include.$.concept.$.code" : {
    type: String
  }, // R!  Code or expression from system
  "compose.include.$.concept.$.display" : {
    optional: true,
    type: String
  }, // Text to display for this code for this value set in this valueset
  "compose.include.$.concept.$.designation" : {
    optional: true,
    type: Array
   }, // Additional representations for this concept
   "compose.include.$.concept.$.designation.$" : {
    optional: true,
    type: Object
   }, // Additional representations for this concept
  "compose.include.$.concept.$.designation.$.language" : {
    optional: true,
    type: String
  }, // Human language of the designation
  "compose.include.$.concept.$.designation.$.use" : {
    optional: true,
    type: String 
  }, // Types of uses of designations
  "compose.include.$.concept.$.designation.$.value" : {
    type: String 
  }, // R!  The text value for this designation

  "compose.include.$.filter" : {
    optional: true,
    type: Array
  }, 
  "compose.include.$.filter.$" : {
    optional: true,
    type: Object
  }, 
  "compose.include.$.filter.$.property" : {
    type: String
  }, // R!  A property/filter defined by the code system
  "compose.include.$.filter.$.op" : {
    type: String
  }, // R!  = | is-a | descendent-of | is-not-a | regex | in | not-in | generalizes | exists
  "compose.include.$.filter.$.value" : {
    type: String
   }, // R!  Code from the system, or regex criteria, orBooleanvalue for exists
  "compose.include.valueSet" : {
    optional: true,
    type: Array
   }, // C? Select the contents included in this value set
   "compose.include.valueSet.$" : {
    optional: true,
    blackbox: true,
    type: Object 
   }, // C? Select the contents included in this value set
   "compose.exclude" : {
    optional: true,
    type: Array
   }, // C? Explicitly exclude codes from a code system or other value sets
  "compose.exclude.$" : {
    optional: true,
    type: Object 
   }, // C? Explicitly exclude codes from a code system or other value sets

   "expansion" : {
    optional: true,
    type: Object
  }, 
  "expansion.identifier" : {
    optional: true,
    type: String
  }, // Identifies the value set expansion (business identifier)
  "expansion.timestamp" : {
    type: Date
  }, // R!  Time ValueSet expansion happened
  "expansion.total" : {
    optional: true,
    type: Number
  }, // Total number of codes in the expansion
  "expansion.offset" : {
    optional: true,
    type: Number
  }, // Offset at which this resource starts

  "expansion.parameter" : {
    optional: true,
    type: Array
  }, 
  "expansion.parameter.$" : {
    optional: true,
    type: Object
  }, 
  "expansion.parameter.$.name" : {
    optional: true,
    type: String
  }, // R!  Name as assigned by the client or server
  "expansion.parameter.$.valueString" : {
    optional: true,
    type: String
  },
  "expansion.parameter.$.valueBoolean" : {
    optional: true,
    type: Boolean
  },
  "expansion.parameter.$.valueInteger" : {
    optional: true,
    type: Number
  },
  "expansion.parameter.$.valueDecimal" : {
    optional: true,
    type: Number
  },
  "expansion.parameter.$.valueUri" : {
    optional: true,
    type: String
  },
  "expansion.parameter.$.valueCode" : {
    optional: true,
    type: String
  },
  "expansion.parameter.$.valueDateTime" : {
    optional: true,
    type: Date
  },

  "expansion.contains" : {
    optional: true,
    type: Array
  }, 
  "expansion.contains.$" : {
    optional: true,
    type: Object
  }, 
  "expansion.contains.$.system" : {
    optional: true,
    type: String
  }, // System value for the code
  "expansion.contains.$.abstract" : {
    optional: true,
    type: Boolean
  }, // If user cannot select this entry
  "expansion.contains.$.inactive" : {
    optional: true,
    type: Boolean
  }, // If concept is inactive in the code system
  "expansion.contains.$.version" : {
    optional: true,
    type: String
  }, // Version in which this code/display is defined
  "expansion.contains.$.code" : {
    optional: true,
    type: String
  }, // C? Code - if blank, this is not a selectable code
  "expansion.contains.$.display" : {
    optional: true,
    type: String
  }, // C? User display for the concept
  "expansion.contains.$.designation" : {
    optional: true,
    type: Array
  }, // Additional representations for this item
  "expansion.contains.$.designation.$" : {
    optional: true,
    type: Object 
  }, // Additional representations for this item
  "expansion.contains.$.contains" : {
    optional: true,
    type: Array
   }, // Codes contained under this entry
   "expansion.contains.$.contains.$" : {
    optional: true,
    type: Object 
   } // Codes contained under this entry
});

export default ValueSetSchema;