Package.describe({
  name: 'clinical:hl7-fhir-data-infrastructure',
  version: '6.0.0',
  summary: 'HL7 FHIR Data Infrastructure (SimpleSchemas, Cursors, Hooks)',
  git: 'https://github.com/clinical-meteor/hl7-fhir-data-infrastructure',
  documentation: 'README.md'
});


Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');

  api.use('meteor-base@1.4.0');
  api.use('ecmascript@0.13.0');

  api.use('mongo');

  api.use('aldeed:collection2@3.0.0');
  api.use('matb33:collection-hooks@0.7.15');
  api.use('clinical:hl7-resource-datatypes@4.0.5');

  // might not be worth keeping, remove if possible
  // or at least bring into the package directly
  api.use('clinical:base-model@1.4.0');

  // client side data stores, speicifically minimongo pages (aka flux, redux, etc )
  api.use('http');
  api.use('session');
  api.use('react-meteor-data@0.2.15');

});


Npm.depends({
  "moment": "2.22.2",
  "lodash": "4.17.13"
});

