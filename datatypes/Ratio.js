import SimpleSchema from 'simpl-schema';

RatioSchema = new SimpleSchema({
  "numerator" : {
    type: QuantitySchema
  },
  "denominator" : {
    type: QuantitySchema
  }
});

export default RatioSchema;