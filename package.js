Package.describe({
  name: 'clinical:hl7-fhir-data-infrastructure',
  version: '6.1.16',
  summary: 'HL7 FHIR Data Infrastructure (SimpleSchemas, Cursors, Hooks)',
  git: 'https://github.com/clinical-meteor/hl7-fhir-data-infrastructure',
  documentation: 'README.md'
});


Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');

  api.use('meteor-base@1.4.0');
  api.use('ecmascript@0.13.0');
  api.use('session');
  api.use('mongo');
  api.use('http');
  api.use('react-meteor-data@0.2.15');
  
  api.use('aldeed:collection2@3.0.0');
  // api.use('matb33:collection-hooks@0.7.15');
  // api.use('clinical:hl7-resource-datatypes@4.0.5');

  // api.use('clinical:glass-ui@2.4.11')

  // schemas and cursors
  // api.addFiles('lib/schemas/AllergyIntolerances.js', ['client', 'server']);
  // api.addFiles('lib/schemas/Bundles.js', ['client', 'server']);
  // api.addFiles('lib/schemas/CarePlans.js', ['client', 'server']);
  // api.addFiles('lib/schemas/Compositions.js', ['client', 'server']);
  // api.addFiles('lib/schemas/Conditions.js', ['client', 'server']);
  // api.addFiles('lib/schemas/DiagnosticReports.js', ['client', 'server']);
  // api.addFiles('lib/schemas/Encounters.js', ['client', 'server']);
  // api.addFiles('lib/schemas/Immunizations.js', ['client', 'server']);
  // api.addFiles('lib/schemas/Measures.js', ['client', 'server']);
  // api.addFiles('lib/schemas/MeasureReports.js', ['client', 'server']);
  // api.addFiles('lib/schemas/Medications.js', ['client', 'server']);
  // api.addFiles('lib/schemas/MedicationOrders.js', ['client', 'server']);
  // api.addFiles('lib/schemas/MedicationStatements.js', ['client', 'server']);
  // api.addFiles('lib/schemas/Observations.js', ['client', 'server']);
  // api.addFiles('lib/schemas/Patients.js', ['client', 'server']);
  // api.addFiles('lib/schemas/Practitioners.js', ['client', 'server']);
  // api.addFiles('lib/schemas/Procedures.js', ['client', 'server']);

  // api.export('AllergyIntolerance');
  // api.export('AllergyIntolerances');
  // api.export('AllergyIntoleranceSchema');

  // api.export('Bundle');
  // api.export('Bundles');
  // api.export('BundleSchema');

  // api.export('CarePlans');
  // api.export('CarePlanss');
  // api.export('CarePlansSchema');

  // api.export('Composition');
  // api.export('Compositions');
  // api.export('CompositionSchema');

  // api.export('Condition');
  // api.export('Conditions');
  // api.export('ConditionSchema');

  // api.export('DiagnosticReport');
  // api.export('DiagnosticReports');
  // api.export('DiagnosticReportSchema');

  // api.export('Encounter');
  // api.export('Encounters');
  // api.export('EncounterSchema');

  // api.export('Immunization');
  // api.export('Immunizations');
  // api.export('ImmunizationSchema');

  // api.export('Measure');
  // api.export('Measures');
  // api.export('MeasureSchema');

  // api.export('MeasureReport');
  // api.export('MeasureReports');
  // api.export('MeasureReportSchema');

  // api.export('Medication');
  // api.export('Medications');
  // api.export('MedicationSchema');

  // api.export('MedicationOrder');
  // api.export('MedicationOrders');
  // api.export('MedicationOrderSchema');

  // api.export('MedicationStatement');
  // api.export('MedicationStatements');
  // api.export('MedicationStatementSchema');

  // api.export('Observation');
  // api.export('Observations');
  // api.export('ObservationSchema');

  // api.export('Patient');
  // api.export('Patients');
  // api.export('PatientSchema');

  // api.export('Practitioner');
  // api.export('Practitioners');
  // api.export('PractitionerSchema');

  // api.export('Procedure');
  // api.export('Procedures');
  // api.export('ProcedureSchema');

  // client side data stores, speicifically minimongo pages (aka flux, redux, etc )


  // api.mainModule('index.jsx', 'client');

});


Npm.depends({
  // "moment": "2.22.2",
  // "lodash": "4.17.13",
  // "material-fhir-ui": "0.9.32",
  // "react-icons-kit": "1.3.1",
  // "prop-types": "15.7.2",
  // "react-mixin": "4.0.0",
  // "simpl-schema": "1.5.3",
  // "validator": "10.9.0",
});

