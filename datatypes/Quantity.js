import SimpleSchema from 'simpl-schema';

// EXAMPLE
// whenRange: {
//   'low': {
//     'value': 40,
//     'unit': 'years',
//     'system': 'http://unitsofmeasure.org",
//     "code": "a"
//   },
//   "high": {
//     "value": 90,
//     "unit": "years",
//     "system": "http://unitsofmeasure.org",
//     "code": "a"
//   }
// }

QuantitySchema = new SimpleSchema({
  'value' : {
    optional: true,
    type : Number
  },
  'comparator': {
    optional: true,
    type: Code,
    allowedValues: ['<', '<=', '>=', '>']
  },
  'unit' : {
    optional: true,
    type : String
  },
  'system' : {
    optional: true,
    type : String // Uri
  },
  'code' : {
    optional: true,
    type : Code
  }
});



Quantity = {
  create: function(){
    var newQuantity = {

    };

    return newQuantity;
  }
}

export default QuantitySchema;
