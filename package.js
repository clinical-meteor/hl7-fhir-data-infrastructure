Package.describe({
  name: 'clinical:hl7-fhir-data-infrastructure',
  version: '6.0.0',
  summary: 'HL7 FHIR Data Infrastructure (SimpleSchemas, Cursors, Hooks)',
  git: 'https://github.com/clinical-meteor/hl7-fhir-rest',
  documentation: 'README.md'
});


Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');

  api.use('meteor-base@1.4.0');
  api.use('ecmascript@0.13.0');

  api.use('mongo');
});


Npm.depends({
  "moment": "2.22.2",
  "lodash": "4.17.13"
});

