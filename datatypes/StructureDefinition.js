import SimpleSchema from 'simpl-schema';
import Code from './Code';

StructureDefinitionSchema = new SimpleSchema({
  "id" : {
    type: String,
    optional: true
  },
  "resourceType" : {
    type: String,
    defaultValue: "StructureDefinition"
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
      optional: true,
      type: String
      }, // R!  Canonical identifier for this structure definition, represented as a URI (globally unique)
    "version" : {
      type: String
      }, // Business version of the structure definition
    "name" : {
      type: String
      }, // C? R!  Name for this structure definition (computer friendly)
    "title" : {
      type: String
      }, // Name for this structure definition (human friendly)
    "status" : {
      type: String,
      allowedValues: ['draft', 'active', 'retired', 'unknown']
      }, // R!  draft | active | retired | unknown
    "experimental" : {
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
      type: Object
    }, // Contact details for the publisher
    "description" : {
      optional: true,
      type: String
      }, // Natural language description of the structure definition
    "useContext" : {
      optional: true,
      type: Array
      }, // The context that the content is intended to support
    "useContext.$" : {
      optional: true,
      type: Object
    }, // The context that the content is intended to support
    "jurisdiction" : {
      optional: true,
      type: Array
    }, // Intended jurisdiction for structure definition (if applicable)
    "jurisdiction.$" : {
      optional: true,
      type: CodeableConcept
    }, // Intended jurisdiction for structure definition (if applicable)
    "purpose" : {
      optional: true,
      type: String
      }, // Why this structure definition is defined
    "copyright" : {
      optional: true,
      type: String
      }, // Use and/or publishing restrictions
    "keyword" : {
      optional: true,
      type: Array
    }, // Assist with indexing and finding
    "keyword.$" : {
      optional: true,
      type: Coding
    }, // Assist with indexing and finding
    "fhirVersion" : {
      optional: true,
      type: String
      }, // FHIR Version this StructureDefinition targets
    "mapping" : {
      optional: true,
      type: String
      }, // R!  Internal id when this mapping is used
    "mapping.$" : {
      optional: true,
      type: String
      }, // R!  Internal id when this mapping is used
    "mapping.$.identity" : {
      optional: true,
      type: String
      }, // R!  Internal id when this mapping is used
    "mapping.$.uri" : {
      optional: true,
      type: String
      }, // C? Identifies what this mapping refers to
    "mapping.$.name" : {
      optional: true,
      type: String
      }, // C? Names what this mapping refers to
    "mapping.$.comment" : {
      optional: true,
      type: String 
    }, // Versions, Issues, Scope limitations etc.
    "kind" : {
      optional: true,
      type: String,
      allowedValues: ['primitive-type', 'complex-type', 'resource', 'logical']
      }, // R!  primitive-type | complex-type | resource | logical
    "abstract" : {
      type: Boolean
      }, // R!  Whether the structure is abstract
    "context": {
      optional: true,
      type: Array
      }, 
    "context.$" : {
      optional: true,
      type: Object
      }, 
    "context.$.type" : {
      type: String,
      allowedValues: ['fhirpath', 'element', 'extension']
      }, // R!  
    "context.$.expression" : {
      type: String
     }, // R!  Where the extension can be used in instances
    "contextInvariant" : {
      optional: true,
      type: Array
    }, // C? FHIRPath invariants - when the extension can be used
    "contextInvariant.$" : {
      optional: true,
      type: String
    }, // C? FHIRPath invariants - when the extension can be used
    "type" : {
      type: String
      }, // C? R!  Type defined orString
    "baseDefinition" : { 
      optional: true,
      blackbox: true,
      type: Object
    }, // C? Definition that this type is constrained/specialized from
    "derivation": {
      optional: true,
      type: String
      }, // specialization | constraint - How relates to base definition

    "snapshot" : {
        optional: true,
        type: Object
     }, 
    "snapshot.element" : {
      optional: true,
      type: Array
     }, // C? R!  Definition of elements in the resource (if no StructureDefinition)
    "snapshot.element.$" : {
      blackbox: true,
      type: Object 
     }, // C? R!  Definition of elements in the resource (if no StructureDefinition)

    "differential" : {
      optional: true,
      type: Object
     }, 
    "differential.element" : {
      type: Array
      }, // R!  Definition of elements in the resource (if no StructureDefinitionStringes: [],
    "differential.element.$" : {
      blackbox: true,
      type: Object 
      } // R!  Definition of elements in the resource (if no StructureDefinitionStringes: [],     
})

export default StructureDefinitionSchema;