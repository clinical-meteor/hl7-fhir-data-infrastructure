Package.describe({
  name: 'clinical:hl7-fhir-data-infrastructure',
  version: '6.33.3',
  summary: 'HL7 FHIR Data Infrastructure (SimpleSchemas, Cursors, Hooks)',
  git: 'https://github.com/clinical-meteor/hl7-fhir-data-infrastructure',
  documentation: 'README.md'
});


Package.onUse(function (api) {
  api.versionsFrom('1.4');



  // api.use('meteor-base@1.5.1');
  // api.use('es5-shim@4.8.0');
  // api.use('bshamblen:json-simple-schema@0.1.3');

  api.use('meteor@1.10.4');
  api.use('ddp@1.4.0');
  api.use('livedata@1.0.18');
  api.use('ecmascript@0.16.0');
  api.use('react-meteor-data@2.5.1');

  api.use('session');
  api.use('mongo');
  api.use('http');
  
  api.use('aldeed:collection2@3.5.0');
  api.use('matb33:collection-hooks@1.0.1');
  api.use('clinical:hl7-resource-datatypes@4.0.8');

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

  api.export('lookupReference');
  

  // schemas and cursors
  api.addFiles('lib/BaseModel.js', ['client', 'server']);

  api.addFiles('lib/schemas/SimpleSchemas/ActivityDefinitions.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/AllergyIntolerances.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/AuditEvents.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Bundles.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/CarePlans.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/CareTeams.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/CodeSystems.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Compositions.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Conditions.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Consents.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Communications.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/CommunicationRequests.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/CommunicationResponses.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Devices.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/DiagnosticReports.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/DocumentReferences.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/DocumentManifests.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Encounters.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Endpoints.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/ExplanationOfBenefit.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/HealthcareServices.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Immunizations.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/InsurancePlans.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Goals.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Groups.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Lists.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Locations.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Measures.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/MeasureReports.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Medications.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/MedicationOrders.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/MedicationRequests.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/MedicationStatements.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/MessageHeaders.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Networks.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/NutritionIntakes.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Observations.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Organizations.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/OrganizationAffiliations.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Patients.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Practitioners.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/PractitionerRoles.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Persons.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Provenances.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Procedures.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/RelatedPersons.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Questionnaires.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/QuestionnaireResponses.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Restrictions.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/RiskAssessments.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/SearchParameters.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/ServiceRequests.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/StructureDefinitions.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/ServerStats.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Subscriptions.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/Tasks.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/ValueSets.js', ['client', 'server']);
  api.addFiles('lib/schemas/SimpleSchemas/VerificationResults.js', ['client', 'server']);

  api.addFiles('lib/schemas-extra/InboundRequests.js', ['client', 'server']);
  api.addFiles('lib/schemas-extra/OAuthClients.js', ['client', 'server']);
  api.addFiles('lib/schemas-extra/UdapCertificates.js', ['client', 'server']);


  api.export('ActivityDefinition');
  api.export('ActivityDefinitions');
  api.export('ActivityDefinitionSchema');

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

  api.export('CareTeams');
  api.export('CareTeams');
  api.export('CareTeamsSchema');

  api.export('CodeSystem');
  api.export('CodeSystems');
  api.export('CodeSystemSchema');

  api.export('Composition');
  api.export('Compositions');
  api.export('CompositionSchema');

  api.export('Condition');
  api.export('Conditions');
  api.export('ConditionSchema');

  api.export('Consent');
  api.export('Consents');
  api.export('ConsentSchema');

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

  api.export('DocumentManifest');
  api.export('DocumentManifests');
  api.export('DocumentManifestSchema');

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

  api.export('Goal');
  api.export('Goals');
  api.export('GoalSchema');

  api.export('Group');
  api.export('Groups');
  api.export('GroupSchema');

  api.export('HealthcareService');
  api.export('HealthcareServices');
  api.export('HealthcareServiceSchema');

  api.export('InsurancePlan');
  api.export('InsurancePlans');
  api.export('InsurancePlanSchema');

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

  api.export('Network');
  api.export('Networks');
  api.export('NetworkSchema');

  api.export('NutritionIntake');
  api.export('NutritionIntakes');
  api.export('NutritionIntakeSchema');
  
  api.export('OAuthClients');

  api.export('Observation');
  api.export('Observations');
  api.export('ObservationSchema');

  api.export('Organization');
  api.export('Organizations');
  api.export('OrganizationSchema');

  api.export('OrganizationAffiliation');
  api.export('OrganizationAffiliations');
  api.export('OrganizationAffiliationSchema');

  api.export('Patient');
  api.export('Patients');
  api.export('PatientSchema');

  api.export('Person');
  api.export('Persons');
  api.export('PersonSchema');

  api.export('Practitioner');
  api.export('Practitioners');
  api.export('PractitionerSchema');

  api.export('PractitionerRole');
  api.export('PractitionerRoles');
  api.export('PractitionerRoleSchema');

  api.export('Procedure');
  api.export('Procedures');
  api.export('ProcedureSchema');

  api.export('Provenance');
  api.export('Provenances');
  api.export('ProvenanceSchema');

  api.export('Questionnaire');
  api.export('Questionnaires');
  api.export('QuestionnaireSchema');

  api.export('QuestionnaireResponse');
  api.export('QuestionnaireResponses');
  api.export('QuestionnaireResponseSchema');

  api.export('RelatedPerson');
  api.export('RelatedPersons');
  api.export('RelatedPersonSchema');

  api.export('Restriction');
  api.export('Restrictions');
  api.export('RestrictionSchema');

  api.export('RiskAssessment');
  api.export('RiskAssessments');
  api.export('RiskAssessmentSchema');

  api.export('SearchParameter');
  api.export('SearchParameters');
  api.export('SearchParameterSchema');

  api.export('ServiceRequest');
  api.export('ServiceRequests');
  api.export('ServiceRequestSchema');

  api.export('Substance');
  api.export('Substances');

  api.export('StructureDefinition');
  api.export('StructureDefinitions');
  api.export('StructureDefinitionSchema');

  api.export('Subscription');
  api.export('Subscriptions');
  api.export('SubscriptionSchema');

  api.export('Task');
  api.export('Tasks');
  api.export('TaskSchema');

  api.export('ValueSet');
  api.export('ValueSets');
  api.export('ValueSetSchema');

  api.export('VerificationResult');
  api.export('VerificationResults');
  api.export('VerificationResultSchema');

  api.export('InboundRequests');
  api.export('OAuthClients');
  api.export('UdapCertificates');

  api.export('BaseModel');

  api.export('ServerStats');

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
  api.addFiles('datatypes/CodeableConcept.js');
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
  api.addFiles('datatypes/OperationOutcome.js');
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
  api.export('OperationOutcomeSchema');
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
  // Image Assets

  api.addAssets('assets/NoData.png', 'client');  
  api.addAssets('lib/schemas/fhir.schema.r5.json', ['server', 'client']);  


  

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
  "react-sortable-hoc": "1.11.0",
  // "react-icons-kit": "2.0.0"

  // GITHUB / CIRCLE CI will generate a "Cannot find module 'react'" error 
  // during Q/A and pull requests if this is removed
  // "react": "18.2.0"  
})
