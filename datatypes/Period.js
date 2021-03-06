import SimpleSchema from 'simpl-schema';

PeriodSchema = new SimpleSchema({
  "start" : {
    optional: true,
    type : Date
  },
  "end" : {
    optional: true,
    type : Date
  }
});

export default PeriodSchema;