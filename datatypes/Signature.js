import SimpleSchema from 'simpl-schema';

SignatureSchema = new SimpleSchema({
  "type" : {
    type: Array
    },
  "type.$" : {
    type: CodingSchema 
    },
  "when" : {
    type: Date
    },
  "who" : {
    optional: true,
    blackbox: true,
    type: Object
    },
  "targetFormat" : {
    optional: true,
    type: String
  },
  "sigFormat" : {
    optional: true,
    type: String
  },
  "onBehalfOf" : {
    optional: true,
    blackbox: true,
    type: Object
    },
  "data" : {
    optional: true,
    blackbox: true,
    type: Object
  }  
});


Signature = {
  create: function(){
    var newSignature = {

    };

    return newSignature;
  }
}

export default SignatureSchema;