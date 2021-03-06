Package.describe({
  name: 'clinical:hl7-fhir-data-infrastructure',
  version: '6.11.5',
  summary: 'HL7 FHIR Data Infrastructure (SimpleSchemas, Cursors, Hooks)',
  git: 'https://github.com/clinical-meteor/hl7-fhir-data-infrastructure',
  documentation: 'README.md'
});


Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');

  api.use('meteor@1.9.3');
  api.use('webapp@1.10.0');
  api.use('ddp@1.4.0');
  api.use('livedata@1.0.18');
  api.use('es5-shim@4.8.0');
  api.use('ecmascript@0.15.0');

  api.use('session');
  api.use('mongo');
  api.use('http');
  api.use('react-meteor-data@2.1.2');
  
  api.use('aldeed:collection2@3.0.6');
  api.use('matb33:collection-hooks@1.0.1');
  api.use('clinical:hl7-resource-datatypes@4.0.6');

  api.addFiles('lib/FhirUtilities.js', ['client', 'server']);
  api.addFiles('lib/LayoutHelpers.js', ['client', 'server']);
  api.addFiles('lib/FhirDehydrator.js', ['client', 'server']);
  api.addFiles('lib/MedicalRecordImporter.js', ['client', 'server']);
  api.addFiles('lib/Theming.js', ['client', 'server']);

  api.export('FhirUtilities');
  api.export('LayoutHelpers');
  api.export('FhirDehydrator');
  api.export('MedicalRecordImporter');
  api.export('Theming');

  // schemas and cursors
  api.addFiles('lib/BaseModel.js', ['client', 'server']);

  api.addFiles('lib/schemas/AllergyIntolerances.js', ['client', 'server']);
  api.addFiles('lib/schemas/AuditEvents.js', ['client', 'server']);
  api.addFiles('lib/schemas/Bundles.js', ['client', 'server']);
  api.addFiles('lib/schemas/CarePlans.js', ['client', 'server']);
  api.addFiles('lib/schemas/Compositions.js', ['client', 'server']);
  api.addFiles('lib/schemas/Conditions.js', ['client', 'server']);
  api.addFiles('lib/schemas/Communications.js', ['client', 'server']);
  api.addFiles('lib/schemas/CommunicationRequests.js', ['client', 'server']);
  api.addFiles('lib/schemas/CommunicationResponses.js', ['client', 'server']);
  api.addFiles('lib/schemas/Devices.js', ['client', 'server']);
  api.addFiles('lib/schemas/DiagnosticReports.js', ['client', 'server']);
  api.addFiles('lib/schemas/DocumentReferences.js', ['client', 'server']);
  api.addFiles('lib/schemas/Encounters.js', ['client', 'server']);
  api.addFiles('lib/schemas/Endpoints.js', ['client', 'server']);
  api.addFiles('lib/schemas/ExplanationOfBenefit.js', ['client', 'server']);
  api.addFiles('lib/schemas/Immunizations.js', ['client', 'server']);
  api.addFiles('lib/schemas/Lists.js', ['client', 'server']);
  api.addFiles('lib/schemas/Locations.js', ['client', 'server']);
  api.addFiles('lib/schemas/Measures.js', ['client', 'server']);
  api.addFiles('lib/schemas/MeasureReports.js', ['client', 'server']);
  api.addFiles('lib/schemas/Medications.js', ['client', 'server']);
  api.addFiles('lib/schemas/MedicationOrders.js', ['client', 'server']);
  api.addFiles('lib/schemas/MedicationRequests.js', ['client', 'server']);
  api.addFiles('lib/schemas/MedicationStatements.js', ['client', 'server']);
  api.addFiles('lib/schemas/MessageHeaders.js', ['client', 'server']);
  api.addFiles('lib/schemas/Observations.js', ['client', 'server']);
  api.addFiles('lib/schemas/Organizations.js', ['client', 'server']);
  api.addFiles('lib/schemas/Patients.js', ['client', 'server']);
  api.addFiles('lib/schemas/Practitioners.js', ['client', 'server']);
  api.addFiles('lib/schemas/Provenances.js', ['client', 'server']);
  api.addFiles('lib/schemas/Procedures.js', ['client', 'server']);
  api.addFiles('lib/schemas/Questionnaires.js', ['client', 'server']);
  api.addFiles('lib/schemas/QuestionnaireResponses.js', ['client', 'server']);
  api.addFiles('lib/schemas/Tasks.js', ['client', 'server']);
  api.addFiles('lib/schemas/ValueSets.js', ['client', 'server']);

  api.export('AllergyIntolerance');
  api.export('AllergyIntolerances');
  api.export('AllergyIntoleranceSchema');

  api.export('AuditEvent');
  api.export('AuditEvents');
  api.export('AuditEventSchema');

  api.export('Bundle');
  api.export('Bundles');
  api.export('BundleSchema');

  api.export('CarePlans');
  api.export('CarePlans');
  api.export('CarePlansSchema');

  api.export('Composition');
  api.export('Compositions');
  api.export('CompositionSchema');

  api.export('Condition');
  api.export('Conditions');
  api.export('ConditionSchema');

  api.export('Communication');
  api.export('Communications');
  api.export('CommunicationSchema');

  api.export('CommunicationRequest');
  api.export('CommunicationRequests');
  api.export('CommunicationRequestSchema');

  api.export('CommunicationResponse');
  api.export('CommunicationResponses');
  api.export('CommunicationResponseSchema');

  api.export('Device');
  api.export('Devices');
  api.export('DeviceSchema');

  api.export('DiagnosticReport');
  api.export('DiagnosticReports');
  api.export('DiagnosticReportSchema');

  api.export('DocumentReference');
  api.export('DocumentReferences');
  api.export('DocumentReferenceSchema');

  api.export('Encounter');
  api.export('Encounters');
  api.export('EncounterSchema');

  api.export('Endpoint');
  api.export('Endpoints');
  api.export('EndpointSchema');

  api.export('ExplanationOfBenefit');
  api.export('ExplanationOfBenefits');
  api.export('ExplanationOfBenefitSchema');

  api.export('Immunization');
  api.export('Immunizations');
  api.export('ImmunizationSchema');

  api.export('List');
  api.export('Lists');
  api.export('ListSchema');

  api.export('Location');
  api.export('Locations');
  api.export('LocationSchema');
  api.export('HospitalLocations');

  api.export('Measure');
  api.export('Measures');
  api.export('MeasureSchema');

  api.export('MeasureReport');
  api.export('MeasureReports');
  api.export('MeasureReportSchema');

  api.export('Medication');
  api.export('Medications');
  api.export('MedicationSchema');

  api.export('MedicationOrder');
  api.export('MedicationOrders');
  api.export('MedicationOrderSchema');

  api.export('MedicationRequest');
  api.export('MedicationRequests');
  api.export('MedicationRequestSchema');

  api.export('MedicationStatement');
  api.export('MedicationStatements');
  api.export('MedicationStatementSchema');

  api.export('MessageHeader');
  api.export('MessageHeaders');
  api.export('MessageHeaderSchema');

  api.export('Observation');
  api.export('Observations');
  api.export('ObservationSchema');

  api.export('Organization');
  api.export('Organizations');
  api.export('OrganizationSchema');

  api.export('Patient');
  api.export('Patients');
  api.export('PatientSchema');

  api.export('Practitioner');
  api.export('Practitioners');
  api.export('PractitionerSchema');

  api.export('Procedure');
  api.export('Procedures');
  api.export('ProcedureSchema');

  api.export('Questionnaire');
  api.export('Questionnaires');
  api.export('QuestionnaireSchema');

  api.export('QuestionnaireResponse');
  api.export('QuestionnaireResponses');
  api.export('QuestionnaireResponseSchema');

  api.export('Substance');
  api.export('Substances');

  api.export('Task');
  api.export('Tasks');
  api.export('TaskSchema');

  api.export('ValueSet');
  api.export('ValueSets');
  api.export('ValueSetSchema');

  api.export('BaseModel');

  // ---------------------------------------------------------------------------
  // Base Resources

  api.addFiles('datatypes/Meta.js');
  api.addFiles('datatypes/Base.js');
  api.addFiles('datatypes/DomainResource.js');
  api.addFiles('datatypes/Narrative.js');

  api.export('MetaSchema');
  api.export('BaseSchema');
  api.export('DomainResourceSchema');
  api.export('NarrativeSchema');

  // ---------------------------------------------------------------------------
  // Data Types

  api.addFiles('datatypes/Address.js');
  api.addFiles('datatypes/Annotation.js');
  api.addFiles('datatypes/Attachment.js');
  api.addFiles('datatypes/Code.js');
  api.addFiles('datatypes/Coding.js');
  api.addFiles('datatypes/CodableConcept.js');
  api.addFiles('datatypes/ContactPoint.js');
  api.addFiles('datatypes/Conformance.js');
  api.addFiles('datatypes/Group.js');
  api.addFiles('datatypes/HumanName.js');
  api.addFiles('datatypes/Identifier.js');
  api.addFiles('datatypes/Money.js');
  api.addFiles('datatypes/Period.js');
  api.addFiles('datatypes/Quantity.js');
  api.addFiles('datatypes/Range.js');
  api.addFiles('datatypes/Reference.js');
  api.addFiles('datatypes/Ratio.js');
  api.addFiles('datatypes/SampledData.js');
  api.addFiles('datatypes/Signature.js');
  api.addFiles('datatypes/Timing.js');

  api.addFiles('datatypes/Basic.js');
  api.addFiles('datatypes/OperationDefinition.js');
  api.addFiles('datatypes/StructureDefinition.js');
  api.addFiles('datatypes/ValueSet.js');

  api.export('AddressSchema');
  api.export('AnnotationSchema');
  api.export('AttachmentSchema');
  api.export('Code');
  api.export('QuantitySchema');
  api.export('HumanNameSchema');
  api.export('ReferenceSchema');
  api.export('PeriodSchema');
  api.export('CodingSchema');
  api.export('MoneySchema');
  api.export('CodeableConceptSchema');
  api.export('IdentifierSchema');
  api.export('ContactPointSchema');
  api.export('GroupSchema');
  api.export('ConformanceSchema');
  api.export('RangeSchema');
  api.export('RatioSchema');
  api.export('SampledDataSchema');
  api.export('SignatureSchema');
  api.export('TimingSchema');

  api.export('BasicSchema');
  api.export('OperationDefinitionSchema');
  api.export('StructureDefinitionSchema');
  api.export('ValueSetSchema');

  api.export('Address');
  api.export('Annotation');
  api.export('Attachment');
  api.export('Code');
  api.export('Quantity');
  api.export('HumanName');
  api.export('Reference');
  api.export('Period');
  api.export('Coding');
  api.export('CodeableConcept');
  api.export('Identifier');
  api.export('ContactPoint');
  api.export('Group');
  api.export('Conformance');
  api.export('Range');
  api.export('Ratio');
  api.export('SampledData');
  api.export('Signature');
  api.export('Timing');

  // ---------------------------------------------------------------------------
  // Web Components

  // client side data stores, speicifically minimongo pages (aka flux, redux, etc )
  api.mainModule('index.jsx', 'client');

  // ---------------------------------------------------------------------------
  // Server Utilities

  // medical records importer, hydrator/dehydrator, etc
  api.mainModule('utilities.js', 'server');
});


Npm.depends({
  "react-sortable-hoc": "1.11.0"
})