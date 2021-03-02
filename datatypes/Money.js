import SimpleSchema from 'simpl-schema';

MoneySchema = new SimpleSchema({
  'value' : {
    optional: true,
    type : Number
  },
  'currency': {
    optional: true,
    type: Code // ISO 4217 Currency Code
  }
});

export default MoneySchema;