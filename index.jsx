import BaseModel from './lib/BaseModel';
import { useTracker, withTracker } from './lib/Tracker';


import {AllergyIntolerances} from './lib/schemas/AllergyIntolerances';
import {AuditEvents} from './lib/schemas/AuditEvents';
import {Bundles} from './lib/schemas/Bundles';
import {CarePlans} from './lib/schemas/CarePlans';
import {CareTeams} from './lib/schemas/CareTeams';
import {CodeSystems} from './lib/schemas/CodeSystems';
import {Conditions} from './lib/schemas/Conditions';
import {Consents} from './lib/schemas/Consents';
import {Communications} from './lib/schemas/Communications';
import {CommunicationRequests} from './lib/schemas/CommunicationRequests';
import {Devices} from './lib/schemas/Devices';
import {DiagnosticReports} from './lib/schemas/DiagnosticReports';
import {DocumentReferences} from './lib/schemas/DocumentReferences';
import {Encounters} from './lib/schemas/Encounters';
import {Endpoints} from './lib/schemas/Endpoints';
import {HealthcareServices} from './lib/schemas/HealthcareServices';
import {Immunizations} from './lib/schemas/Immunizations';
import {InsurancePlans} from './lib/schemas/InsurancePlans';
import {Goals} from './lib/schemas/Goals';
import {Locations} from './lib/schemas/Locations';
import {Lists} from './lib/schemas/Lists';
import {Measures} from './lib/schemas/Measures';
import {MeasureReports} from './lib/schemas/MeasureReports';
import {Medications} from './lib/schemas/Medications';
import {MedicationOrders} from './lib/schemas/MedicationOrders';
import {MedicationStatements} from './lib/schemas/MedicationStatements';
import {MessageHeaders} from './lib/schemas/MessageHeaders';
import {Networks} from './lib/schemas/Networks';
import {Observations} from './lib/schemas/Observations';
import {Organizations} from './lib/schemas/Organizations';
import {OrganizationAffiliations} from './lib/schemas/OrganizationAffiliations';
import {Patients} from './lib/schemas/Patients';
import {Practitioners} from './lib/schemas/Practitioners';
import {PractitionerRoles} from './lib/schemas/PractitionerRoles';
import {Procedures} from './lib/schemas/Procedures';
import {Provenances} from './lib/schemas/Provenances';
import {Questionnaires} from './lib/schemas/Questionnaires';
import {QuestionnaireResponses} from './lib/schemas/QuestionnaireResponses';
import {Restrictions} from './lib/schemas/Restrictions';
import {RiskAssessments} from './lib/schemas/RiskAssessments';
import {SearchParameters} from './lib/schemas/SearchParameters';
import {ServiceRequests} from './lib/schemas/ServiceRequests';
import {StructureDefinitions} from './lib/schemas/StructureDefinitions';
import {Tasks} from './lib/schemas/Tasks';
import {VerificationResults} from './lib/schemas/VerificationResults';
import {ValueSets} from './lib/schemas/ValueSets';


import FhirUtilities from './lib/FhirUtilities';
import FhirDehydrator from './lib/FhirDehydrator';
import LayoutHelpers from './lib/LayoutHelpers';
import MedicalRecordImporter from './lib/MedicalRecordImporter';

import AuditEventsPage from './client/auditEvents/AuditEventsPage';
import AuditEventsTable from './client/auditEvents/AuditEventsTable';
// import AuditEventDetail from './client/auditEvents/AuditEventDetail';

import AllergyIntolerancesPage from './client/allergyIntolerances/AllergyIntolerancesPage';
import AllergyIntolerancesTable from './client/allergyIntolerances/AllergyIntolerancesTable';
// import AllergyIntoleranceDetail from './client/allergyIntolerances/AllergyIntoleranceDetail';

import BundlesPage from './client/bundles/BundlesPage';
import BundlesTable from './client/bundles/BundlesTable';
// import BundleDetail from './client/bundles/BundleDetail';

import CarePlansPage from './client/carePlans/CarePlansPage';
import CarePlansTable from './client/carePlans/CarePlansTable';
// import CarePlanDetail from './client/carePlans/CarePlanDetail';
import GoalsTable from './client/carePlans/GoalsTable';
import ActivitiesTable from './client/carePlans/ActivitiesTable';

import CareTeamsPage from './client/careTeams/CareTeamsPage';
import CareTeamsTable from './client/careTeams/CareTeamsTable';

import CodeSystemsPage from './client/codeSystems/CodeSystemsPage';
import CodeSystemsTable from './client/codeSystems/CodeSystemsTable';
// import CodeSystemDetail from './client/codeSystems/CodeSystemDetail';

import CompositionsPage from './client/compositions/CompositionsPage';
import CompositionsTable from './client/compositions/CompositionsTable';
// import CompositionDetail from './client/compositions/CompositionDetail';

import ConditionsPage from './client/conditions/ConditionsPage';
import ConditionsTable from './client/conditions/ConditionsTable';
// import ConditionDetail from './client/conditions/ConditionDetail';

import ConsentsPage from './client/consents/ConsentsPage';
import ConsentsTable from './client/consents/ConsentsTable';
import ConsentForm from './client/consents/ConsentForm';


import CommunicationsPage from './client/communications/CommunicationsPage';
import CommunicationsTable from './client/communications/CommunicationsTable';
// import CommunicationDetail from './client/communications/CommunicationDetail';

import CommunicationRequestsPage from './client/communicationRequests/CommunicationRequestsPage';
import CommunicationRequestsTable from './client/communicationRequests/CommunicationRequestsTable';
// import CommunicationRequestDetail from './client/communicationRequests/CommunicationRequestDetail';

import DevicesPage from './client/devices/DevicesPage';
import DevicesTable from './client/devices/DevicesTable';
// import DeviceDetail from './client/devices/DeviceDetail';

import DiagnosticReportsPage from './client/diagnosticReports/DiagnosticReportsPage';
import DiagnosticReportsTable from './client/diagnosticReports/DiagnosticReportsTable';
// import DiagnosticReportDetail from './client/diagnosticReports/DiagnosticReportDetail';

import DocumentReferencesPage from './client/documentReferences/DocumentReferencesPage';
import DocumentReferencesTable from './client/documentReferences/DocumentReferencesTable';


import EncountersPage from './client/encounters/EncountersPage';
import EncountersTable from './client/encounters/EncountersTable';

import EndpointsPage from './client/endpoints/EndpointsPage';
import EndpointsTable from './client/endpoints/EndpointsTable';

import ExplanationOfBenefitsPage from './client/explanationOfBenefits/ExplanationOfBenefitsPage';
import ExplanationOfBenefitsTable from './client/explanationOfBenefits/ExplanationOfBenefitsTable';
// import ExplanationOfBenefitDetail from './client/explanationOfBenefits/ExplanationOfBenefitDetail';

import HealthcareServicesPage from './client/healthcareServices/HealthcareServicesPage';
import HealthcareServicesTable from './client/healthcareServices/HealthcareServicesTable';

import ImmunizationsPage from './client/immunizations/ImmunizationsPage';
import ImmunizationsTable from './client/immunizations/ImmunizationsTable';
// import ImmunizationDetail from './client/immunizations/ImmunizationDetail';

import InsurancePlansPage from './client/insurancePlans/InsurancePlansPage';
import InsurancePlansTable from './client/insurancePlans/InsurancePlansTable';

import GoalsPage from './client/goals/GoalsPage';
// import GoalsTable from './client/goals/GoalsTable';
// import GoalDetail from './client/goals/GoalDetail';

import ListsPage from './client/lists/ListsPage';
import ListsTable from './client/lists/ListsTable';
import ListItemsTable from './client/lists/ListItemsTable';
// import ListDetail from './client/lists/ListDetail';

import LocationsTable from './client/locations/LocationsTable';
import LocationsPage from './client/locations/LocationsPage';

import MeasuresPage from './client/measures/MeasuresPage';
import MeasuresTable from './client/measures/MeasuresTable';
// import MeasureDetail from './client/measures/MeasureDetail';

import MeasureReportsPage from './client/measureReports/MeasureReportsPage';
import MeasureReportsTable from './client/measureReports/MeasureReportsTable';
// import MeasureReportDetail from './client/measureReports/MeasureReportDetail';

import MedicationsPage from './client/medications/MedicationsPage';
import MedicationsTable from './client/medications/MedicationsTable';
// import MedicationDetail from './client/medications/MedicationDetail';

import MedicationOrdersPage from './client/medicationOrders/MedicationOrdersPage';
import MedicationOrdersTable from './client/medicationOrders/MedicationOrdersTable';
// import MedicationOrderDetail from './client/medicationOrders/MedicationOrderDetail';

import MedicationRequestsPage from './client/medicationRequests/MedicationRequestsPage';
import MedicationRequestsTable from './client/medicationRequests/MedicationRequestsTable';
// import MedicationRequestDetail from './client/medicationRequests/MedicationRequestDetail';

import MedicationStatementsPage from './client/medicationStatements/MedicationStatementsPage';
import MedicationStatementsTable from './client/medicationStatements/MedicationStatementsTable';
// import MedicationStatementDetail from './client/medicationStatements/MedicationStatementDetail';

import MessageHeadersPage from './client/messageHeaders/MessageHeadersPage';
import MessageHeadersTable from './client/messageHeaders/MessageHeadersTable';
// import MessageHeaderDetail from './client/messageHeaders/MessageHeaderDetail';

import NetworksPage from './client/networks/NetworksPage';
import NetworksTable from './client/networks/NetworksTable';

import ObservationsPage from './client/observations/ObservationsPage';
import ObservationsTable from './client/observations/ObservationsTable';
import ObservationDetail from './client/observations/ObservationDetail';

import OrganizationsPage from './client/organizations/OrganizationsPage';
import OrganizationsTable from './client/organizations/OrganizationsTable';

import OrganizationAffiliationsPage from './client/organizationAffiliations/OrganizationAffiliationsPage';
import OrganizationAffiliationsTable from './client/organizationAffiliations/OrganizationAffiliationsTable';

import PatientsPage from './client/patients/PatientsPage';

import PersonsPage from './client/persons/PersonsPage';
import PersonsTable from './client/persons/PersonsTable';

import PractitionersPage from './client/practitioners/PractitionersPage';
import PractitionersTable from './client/practitioners/PractitionersTable';

import PractitionerRolesPage from './client/practitionerRoles/PractitionerRolesPage';
import PractitionerRolesTable from './client/practitionerRoles/PractitionerRolesTable';

import ProceduresPage from './client/procedures/ProceduresPage';
import ProceduresTable from './client/procedures/ProceduresTable';
// import ProcedureDetail from './client/procedures/ProcedureDetail';

import ProvenancesPage from './client/provenances/ProvenancesPage';
import ProvenancesTable from './client/provenances/ProvenancesTable';

import QuestionnairesPage from './client/questionnaires/QuestionnairesPage';
import QuestionnairesTable from './client/questionnaires/QuestionnairesTable';
import QuestionnaireDetailSortable from './client/questionnaires/QuestionnaireDetailSortable';
import QuestionnaireDetailExpansionPanels from './client/questionnaires/QuestionnaireDetailExpansionPanels';

import QuestionnaireResponsesPage from './client/questionnaireResponses/QuestionnaireResponsesPage';
import QuestionnaireResponsesTable from './client/questionnaireResponses/QuestionnaireResponsesTable';
// import QuestionnaireResponseDetail from './client/questionnaireResponses/QuestionnaireResponseDetail';

import RelatedPersonsPage from './client/relatedPersons/RelatedPersonsPage';
import RelatedPersonsTable from './client/relatedPersons/RelatedPersonsTable';

import RiskAssessmentsPage from './client/riskAssessments/RiskAssessmentsPage';
import RiskAssessmentsTable from './client/riskAssessments/RiskAssessmentsTable';
import RiskAssessmentForm from './client/riskAssessments/RiskAssessmentForm';

import SearchParametersPage from './client/searchParameters/SearchParametersPage';
import SearchParametersTable from './client/searchParameters/SearchParametersTable';

import ServiceRequestsPage from './client/serviceRequests/ServiceRequestsPage';
import ServiceRequestsTable from './client/serviceRequests/ServiceRequestsTable';
import ServiceRequestForm from './client/serviceRequests/ServiceRequestForm';

import StructureDefinitionsPage from './client/structureDefinitions/StructureDefinitionsPage';
import StructureDefinitionsTable from './client/structureDefinitions/StructureDefinitionsTable';

import RestrictionsPage from './client/restrictions/RestrictionsPage';
import RestrictionsTable from './client/restrictions/RestrictionsTable';

import TasksPage from './client/tasks/TasksPage';
import TasksTable from './client/tasks/TasksTable';

import VerificationResultsPage from './client/verificationResults/VerificationResultsPage';
import VerificationResultsTable from './client/verificationResults/VerificationResultsTable';

import ValueSetsPage from './client/valuesets/ValueSetsPage';
import ValueSetsTable from './client/valuesets/ValueSetsTable';

import DynamicSpacer from './ui/DynamicSpacer';






let DynamicRoutes = [{
  name: 'AllergyIntolerancesPage',
  path: '/allergy-intolerances',
  component: AllergyIntolerancesPage,
  requireAuth: true
}, {
  name: 'AuditEventPage',
  path: '/audit-events',
  component: AuditEventsPage,
  requireAuth: true
}, {
  name: 'BundlePage',
  path: '/bundles',
  component: BundlesPage,
  requireAuth: true
}, {
  name: 'CarePlansPage',
  path: '/careplans',
  component: CarePlansPage,
  requireAuth: true
}, {
  name: 'CareTeamsPage',
  path: '/careteams',
  component: CareTeamsPage,
  requireAuth: true
}, {
  name: 'CompositionsPage',
  path: '/compositions',
  component: CompositionsPage,
  requireAuth: true
}, {
  name: 'DevicesPage',
  path: '/devices',
  component: DevicesPage,
  requireAuth: true
}, {
  name: 'CodeSystemsPage',
  path: '/code-systems',
  component: CodeSystemsPage
}, {
  name: 'ConditionsPage',
  path: '/conditions',
  component: ConditionsPage,
  requireAuth: true
}, {
  name: 'ConsentsPage',
  path: '/consents',
  component: ConsentsPage,
  requireAuth: true
}, {
  name: 'CommunicationsPage',
  path: '/communications',
  component: CommunicationsPage,
  requireAuth: true
}, {
  name: 'CommunicationRequestsPage',
  path: '/communication-requests',
  component: CommunicationRequestsPage,
  requireAuth: true
}, {
  name: 'DiagnosticReportsPage',
  path: '/diagnostic-reports',
  component: DiagnosticReportsPage,
  requireAuth: true
}, {
  name: 'DocumentReferencesPage',
  path: '/document-references',
  component: DocumentReferencesPage,
  requireAuth: true
}, {
  name: 'EncountersPage',
  path: '/encounters',
  component: EncountersPage,
  requireAuth: true
}, {
  name: 'EndpointsPage',
  path: '/endpoints',
  component: EndpointsPage,
  requireAuth: true
}, {
  name: 'ExplanationOfBenefitsPage',
  path: '/explanation-of-benefits',
  component: ExplanationOfBenefitsPage,
  requireAuth: true
}, {
  name: 'GoalsPage',
  path: '/goals',
  component: GoalsPage,
  requireAuth: true
}, {
  name: 'HealthcareServicesPage',
  path: '/healthcare-services',
  component: HealthcareServicesPage,
  requireAuth: true
}, {
  name: 'ImmunizationsPage',
  path: '/immunizations',
  component: ImmunizationsPage,
  requireAuth: true
}, {
  name: 'InsurancePlansPage',
  path: '/insurance-plans',
  component: InsurancePlansPage,
  requireAuth: true
}, {
  name: 'LocationsPage',
  path: '/locations',
  component: LocationsPage,
  requireAuth: true
}, {
  name: 'ListsPage',
  path: '/lists',
  component: ListsPage,
  requireAuth: true
}, {
  name: 'MeasuresPage',
  path: '/measures',
  component: MeasuresPage,
  requireAuth: true
}, {
  name: 'MeasureReportsPage',
  path: '/measure-reports',
  component: MeasureReportsPage,
  requireAuth: true
}, {
  name: 'MedicationsPage',
  path: '/medications',
  component: MedicationsPage,
  requireAuth: true
}, {
  name: 'MedicationOrdersPage',
  path: '/medication-orders',
  component: MedicationOrdersPage,
  requireAuth: true
}, {
  name: 'MedicationStatementsPage',
  path: '/medication-statements',
  component: MedicationStatementsPage,
  requireAuth: true
}, {
  name: 'MessageHeadersPage',
  path: '/message-headers',
  component: MessageHeadersPage,
  requireAuth: true
}, {
  name: 'NetworksPage',
  path: '/networks',
  component: NetworksPage,
  requireAuth: true
}, {
  name: 'ObservationsPage',
  path: '/observations',
  component: ObservationsPage,
  requireAuth: true
}, {
  name: 'OrganizationsPage',
  path: '/organizations',
  component: OrganizationsPage,
  requireAuth: true
}, {
  name: 'OrganizationAffiliationsPage',
  path: '/organization-affiliations',
  component: OrganizationAffiliationsPage,
  requireAuth: true
}, {
  name: 'PatientsPage',
  path: '/patients',
  component: PatientsPage,
  requireAuth: true
}, {
  name: 'PractitionersPage',
  path: '/practitioners',
  component: PractitionersPage,
  requireAuth: true
}, {
  name: 'PractitionerRolesPage',
  path: '/practitioner-roles',
  component: PractitionerRolesPage,
  requireAuth: true
}, {
  name: 'PersonsPage',
  path: '/persons',
  component: PersonsPage,
  requireAuth: true
}, {
  name: 'ProceduresPage',
  path: '/procedures',
  component: ProceduresPage,
  requireAuth: true
}, {
  name: 'ProvenancesPage',
  path: '/provenances',
  component: ProvenancesPage,
  requireAuth: true
}, {
  name: 'QuestionnairesPage',
  path: '/questionnaires',
  component: QuestionnairesPage,
  requireAuth: true
}, {
  name: 'QuestionnaireResponsesPage',
  path: '/questionnaire-responses',
  component: QuestionnaireResponsesPage,
  requireAuth: true
}, {
  name: 'RelatedPersonsPage',
  path: '/related-persons',
  component: RelatedPersonsPage,
  requireAuth: true
}, {
  name: 'RiskAssessmentsPage',
  path: '/risk-assessments',
  component: RiskAssessmentsPage,
  requireAuth: true
}, {
  name: 'RestrictionsPage',
  path: '/restrictions',
  component: RestrictionsPage,
  requireAuth: true
}, {
  name: 'SearchParametersPage',
  path: '/search-parameters',
  component: SearchParametersPage,
  requireAuth: true
}, {
  name: 'ServiceRequestsPage',
  path: '/service-requests',
  component: ServiceRequestsPage,
  requireAuth: true
}, {
  name: 'TasksPage',
  path: '/tasks',
  component: TasksPage,
  requireAuth: true
}, {
  name: 'StructureDefinitionsPage',
  path: '/structure-definitions',
  component: StructureDefinitionsPage,
  requireAuth: true
}, {
  name: 'VerificationResultsPage',
  path: '/verification-results',
  component: VerificationResultsPage,
  requireAuth: true
}, {
  name: 'ValueSetsPage',
  path: '/valuesets',
  component: ValueSetsPage
} ];




let SidebarElements = [{
  primaryText: 'Allergy Intolerances',
  to: '/allergy-intolerances',
  href: '/allergy-intolerances',
  iconName: 'ic_warning',
  collectionName: 'AllergyIntolerances'
}, {
  primaryText: 'Audit Events',
  to: '/audit-events',
  href: '/audit-events',
  collectionName: 'AuditEvents'
}, {
  primaryText: 'Bundles',
  to: '/bundles',
  href: '/bundles',
  iconName: 'suitcase',
  collectionName: 'Bundles'
}, {
  primaryText: 'Care Plans',
  to: '/careplans',
  href: '/careplans',
  iconName: 'notepad',
  collectionName: 'CarePlans'
}, {
  primaryText: 'Care Teams',
  to: '/careteams',
  href: '/careteams',
  iconName: 'notepad',
  collectionName: 'CareTeams'
}, {
  primaryText: 'CodeSystems',
  to: '/code-systems',
  href: '/code-systems',
  iconName: 'notepad',
  collectionName: 'CodeSystems'  
}, {
  primaryText: 'Conditions',
  to: '/conditions',
  href: '/conditions',
  iconName: 'heartbeat',
  collectionName: 'Conditions'  
}, {
  primaryText: 'Consents',
  to: '/consents',
  href: '/consents',
  iconName: 'notepad',
  collectionName: 'Consents'  
}, {
  primaryText: 'Communications',
  to: '/communications',
  href: '/communications',
  iconName: 'envelopeO',
  collectionName: 'Communications'  
}, {
  primaryText: 'Communication Requests',
  to: '/communication-requests',
  href: '/communication-requests',
  iconName: 'envelopeO',
  collectionName: 'CommunicationRequests'    
}, {
  primaryText: 'Devices',
  to: '/devices',
  href: '/devices',
  iconName: 'ic_devices',
  collectionName: 'Devices'    
}, {
  primaryText: 'Diagnostic Reports',
  to: '/diagnostic-reports',
  href: '/diagnostic-reports',
  iconName: 'notepad',
  collectionName: 'DiagnosticReports' 
}, {
  primaryText: 'Document References',
  to: '/document-references',
  href: '/document-references',
  iconName: 'notepad',
  collectionName: 'DocumentReferences'  
}, {
  primaryText: 'Encounters',
  to: '/encounters',
  href: '/encounters',
  iconName: 'ic_transfer_within_a_station',
  collectionName: 'Encounters'
}, {
  primaryText: 'Endpoints',
  to: '/endpoints',
  href: '/endpoints',
  iconName: 'notepad',
  collectionName: 'Endpoints'
}, {
  primaryText: 'Explanation Of Benefits',
  to: '/explanation-of-benefits',
  href: '/explanation-of-benefits',
  iconName: 'notepad',
  collectionName: 'ExplanationOfBenefits'
}, {
  primaryText: 'Healthcare Services',
  to: '/healthcare-services',
  href: '/healthcare-services',
  iconName: 'notepad',
  collectionName: 'HealthcareServices'  
}, {
  primaryText: 'Immunizations',
  to: '/immunizations',
  href: '/immunizations',
  iconName: 'eyedropper',
  collectionName: 'Immunizations'  
}, {
  primaryText: 'Insurance Plans',
  to: '/insurance-plans',
  href: '/insurance-plans',
  iconName: 'notepad',
  collectionName: 'InsurancePlans'  
}, {
  primaryText: 'Locations',
  to: '/locations',
  href: '/locations',
  iconName: 'location',
  collectionName: 'Locations' 
}, {
  primaryText: 'Lists',
  to: '/lists',
  href: '/lists',
  iconName: 'notepad',
  collectionName: 'Lists' 
}, {
  primaryText: 'Goals',
  to: '/goals',
  href: '/goals',
  iconName: 'notepad',
  collectionName: 'Goals' 
}, {
  primaryText: 'Measures',
  to: '/measures',
  href: '/measures',
  iconName: 'dashboard',
  collectionName: 'Measures'
}, {
  primaryText: 'Measure Reports',
  to: '/measure-reports',
  href: '/measure-reports',
  iconName: 'dashboard',
  collectionName: 'MeasureReports'
}, {
  primaryText: 'Medications',
  to: '/medications',
  href: '/medications',
  iconName: 'erlenmeyerFlask',
  collectionName: 'Medications'  
}, {
  primaryText: 'Medication Orders',
  to: '/medication-orders',
  href: '/medication-orders',
  iconName: 'ic_local_pharmacy',
  collectionName: 'MedicationOrders'  
}, {
  primaryText: 'Medication Statements',
  to: '/medication-statements',
  href: '/medication-statements',
  iconName: 'ic_local_pharmacy',
  collectionName: 'MedicationStatements'  
}, {
  primaryText: 'Message Headers',
  to: '/message-headers',
  href: '/message-headers',
  iconName: 'envelopeO',
  collectionName: 'MessageHeaders'  
}, {
  primaryText: 'Networks',
  to: '/networks',
  href: '/networks',
  iconName: 'notepad',
  collectionName: 'Networks' 
}, {
  primaryText: 'Observations',
  to: '/observations',
  href: '/observations',
  iconName: 'iosPulseStrong',
  collectionName: 'Observations' 
}, {
  primaryText: 'Organizations',
  to: '/organizations',
  href: '/organizations',
  iconName: 'hospitalO',
  collectionName: 'Organizations'
}, {
  primaryText: 'Organization Affiliations',
  to: '/organization-affiliations',
  href: '/organization-affiliations',
  iconName: 'hospitalO',
  collectionName: 'OrganizationAffiliations'
}, {
  primaryText: 'Patients',
  to: '/patients',
  href: '/patients',
  iconName: 'users',
  collectionName: 'Patients'
}, {
  primaryText: 'Persons',
  to: '/persons',
  href: '/persons',
  iconName: 'users',
  collectionName: 'Persons'
}, {
  primaryText: 'Practitioners',
  to: '/practitioners',
  href: '/practitioners',
  iconName: 'userMd',
  collectionName: 'Practitioners'
}, {
  primaryText: 'Practitioner Roles',
  to: '/practitioner-roles',
  href: '/practitioner-roles',
  iconName: 'userMd',
  collectionName: 'PractitionerRoles'
}, {
  primaryText: 'Procedures',
  to: '/procedures',
  href: '/procedures',
  iconName: 'bath',
  collectionName: 'Procedures'
}, {
  primaryText: 'Provenances',
  to: '/provenances',
  href: '/provenances',
  iconName: 'fire',
  collectionName: 'Provenances'
}, {
  primaryText: 'Questionnaires',
  to: '/questionnaires',
  href: '/questionnaires',
  iconName: 'ic_question_answer',
  collectionName: 'Questionnaires'
}, {
  primaryText: 'Questionnaire Responses',
  to: '/questionnaire-responses',
  href: '/questionnaire-responses',
  iconName: 'ic_question_answer',
  collectionName: 'QuestionnaireResponses'
}, {
  primaryText: 'RelatedPersons',
  to: '/related-persons',
  href: '/related-persons',
  iconName: 'users',
  collectionName: 'RelatedPersons'
}, {
  primaryText: 'Risk Assessments',
  to: '/risk-assessments',
  href: '/risk-assessments',
  iconName: 'ic_format_list_bulleted',
  collectionName: 'RiskAssessments'
}, {
  primaryText: 'Restrictions',
  to: '/restrictions',
  href: '/restrictions',
  iconName: 'notepad',
  collectionName: 'Restrictions'
}, {
  primaryText: 'SearchParameters',
  to: '/search-parameters',
  href: '/search-parameters',
  iconName: 'ic_format_list_bulleted',
  collectionName: 'SearchParameters'
}, {
  primaryText: 'Service Requests',
  to: '/service-requests',
  href: '/service-requests',
  iconName: 'ic_format_list_bulleted',
  collectionName: 'ServiceRequests'
}, {
  primaryText: 'Tasks',
  to: '/tasks',
  href: '/tasks',
  iconName: 'ic_format_list_bulleted',
  collectionName: 'Tasks'
}, {
  primaryText: 'StructureDefinitions',
  to: '/structure-definitions',
  href: '/structure-definitions',
  iconName: 'ic_format_list_bulleted',
  collectionName: 'StructureDefinitions'
}, {
  primaryText: 'Value Sets',
  to: '/valuesets',
  href: '/valuesets',
  iconName: 'notepad',
  collectionName: 'ValueSets'
}, {
  primaryText: 'VerificationResults',
  to: '/verification-results',
  href: '/verification-results',
  iconName: 'notepad',
  collectionName: 'VerificationResults'
}];
  
let AdminSidebarElements = [{
  primaryText: 'Allergies & Intolerances',
  to: '/allergies',
  href: '/allergies'
}, {
  primaryText: 'Bundles',
  to: '/bundles',
  href: '/bundles'
}, {
  primaryText: 'Care Plans',
  to: '/careplans',
  href: '/careplans'
}, {
  primaryText: 'CodeSystems',
  to: '/code-systems',
  href: '/code-systems',
  iconName: 'notepad',
  collectionName: 'CodeSystems'  
}, {
  primaryText: 'Devices',
  to: '/devices',
  href: '/devices'
}, {
  primaryText: 'Diagnostic Reports',
  to: '/diagnostic-reports',
  href: '/diagnostic-reports'
}, {
  primaryText: 'Encounters',
  to: '/encounters',
  href: '/encounters'
}, {
  primaryText: 'Endpoints',
  to: '/endpoints',
  href: '/endpoints',
  iconName: 'notepad',
  collectionName: 'Endpoints'
}, {
  primaryText: 'Healthcare Services',
  to: '/healthcare-services',
  href: '/healthcare-services',
  iconName: 'notepad',
  collectionName: 'HealthcareServices'  
}, {
  primaryText: 'Immunizations',
  to: '/immunizations',
  href: '/immunizations'
}, {
  primaryText: 'Insurance Plans',
  to: '/insurance-plans',
  href: '/insurance-plans',
  iconName: 'notepad',
  collectionName: 'InsurancePlans'  
}, {
  primaryText: 'Lists',
  to: '/lists',
  href: '/lists'
}, {
  primaryText: 'Goals',
  to: '/goals',
  href: '/goals'
}, {
  primaryText: 'Measures',
  to: '/measures',
  href: '/measures'
}, {
  primaryText: 'Measure Reports',
  to: '/measure-reports',
  href: '/measure-reports'
}, {
  primaryText: 'Medications',
  to: '/medications',
  href: '/medications'
}, {
  primaryText: 'Medication Orders',
  to: '/medication-orders',
  href: '/medication-orders'
}, {
  primaryText: 'Medication Statements',
  to: '/medication-statements',
  href: '/medication-statements'
}, {
  primaryText: 'Networks',
  to: '/networks',
  href: '/networks',
  iconName: 'notepad',
  collectionName: 'Networks' 
}, {
  primaryText: 'Observations',
  to: '/observations',
  href: '/observations'
}, {
  primaryText: 'Organizations',
  to: '/organizations',
  href: '/organizations',
  iconName: 'hospitalO',
}, {
  primaryText: 'Organization Affiliations',
  to: '/organization-affiliations',
  href: '/organization-affiliations',
  iconName: 'hospitalO',
  collectionName: 'OrganizationAffiliations'
}, {
  primaryText: 'Patients',
  to: '/patients',
  href: '/patients'
}, {
  primaryText: 'Practitioners',
  to: '/practitioners',
  href: '/practitioners'
}, {
  primaryText: 'Practitioner Roles',
  to: '/practitioner-roles',
  href: '/practitioner-roles',
  iconName: 'userMd',
  collectionName: 'PractitionerRoles'
}, {
  primaryText: 'Procedures',
  to: '/procedures',
  href: '/procedures'
}, {
  primaryText: 'Restrictions',
  to: '/restrictions',
  href: '/restrictions',
  iconName: 'notepad',
  collectionName: 'Restrictions'
}, {
  primaryText: 'Risk Assessments',
  to: '/risk-assessments',
  href: '/risk-assessments',
  iconName: 'ic_format_list_bulleted',
  collectionName: 'RiskAssessments'
}, {
  primaryText: 'StructureDefinitions',
  to: '/structure-definitions',
  href: '/structure-definitions',
  iconName: 'ic_format_list_bulleted',
  collectionName: 'StructureDefinitions'
}, {
  primaryText: 'Service Requests',
  to: '/service-requests',
  href: '/service-requests',
  iconName: 'ic_format_list_bulleted',
  collectionName: 'ServiceRequests'
}, {
  primaryText: 'StructureDefinitions',
  to: '/structure-definitions',
  href: '/structure-definitions',
  iconName: 'ic_format_list_bulleted',
  collectionName: 'StructureDefinitions'
}, {
  primaryText: 'VerificationResults',
  to: '/verification-results',
  href: '/verification-results',
  iconName: 'notepad',
  collectionName: 'VerificationResults'
}];


export { 
  SidebarElements,
  AdminSidebarElements, 
  DynamicRoutes, 

  AllergyIntolerancesPage,
  AllergyIntolerancesTable,
  // AllergyIntoleranceDetail,

  AuditEventsPage,
  AuditEventsTable,
  // AuditEventDetail,

  BundlesPage,
  BundlesTable,
  // BundleDetail,

  CarePlansPage,
  CarePlansTable,
  GoalsTable,
  ActivitiesTable,
  // CarePlanDetail,

  CodeSystemsPage,
  CodeSystemsTable,

  CareTeamsPage,
  CareTeamsTable,

  CompositionsPage,
  CompositionsTable,
  // CompositionDetail,

  ConditionsPage,
  ConditionsTable,
  // ConditionDetail,

  ConsentsPage,
  ConsentsTable,
  ConsentForm,
  // ConsentDetail,

  CommunicationsPage,
  CommunicationsTable,
  // CommunicationDetail,

  CommunicationRequestsPage,
  CommunicationRequestsTable,
  // CommunicationRequestDetail,

  DevicesPage,
  DevicesTable,
  // DeviceDetail,

  DiagnosticReportsPage,
  DiagnosticReportsTable,
  // DiagnosticReportDetail,

  DocumentReferencesPage,
  DocumentReferencesTable,

  EncountersPage,
  EncountersTable,

  EndpointsPage,
  EndpointsTable,

  ExplanationOfBenefitsPage,
  ExplanationOfBenefitsTable,

  HealthcareServicesPage,
  HealthcareServicesTable,

  ImmunizationsPage,
  ImmunizationsTable,

  InsurancePlansPage,
  InsurancePlansTable,

  GoalsPage,
  // GoalsTable,
  // GoalDetail,
  
  ListsPage,
  ListsTable,
  ListItemsTable,
  // ListDetail,

  LocationsTable,
  LocationPage,

  MeasuresPage,
  MeasuresTable,
  // MeasureDetail,

  MeasureReportsPage,
  MeasureReportsTable,

  MedicationsPage,
  MedicationsTable,

  MedicationOrdersPage,
  MedicationOrdersTable,

  MedicationRequestsPage,
  MedicationRequestsTable,

  MedicationStatementsPage,
  MedicationStatementsTable,

  NetworksPage,
  NetworksTable,

  ObservationsPage,
  ObservationsTable,
  ObservationDetail,

  OrganizationsPage,
  OrganizationsTable,

  OrganizationAffiliationsPage,
  OrganizationAffiliationsTable,

  PatientsPage,

  PractitionersPage,
  PractitionersTable,

  PractitionerRolesPage,
  PractitionerRolesTable,

  ProceduresPage,
  ProceduresTable,

  ProvenancesPage,
  ProvenancesTable,

  QuestionnairesPage,
  QuestionnairesTable,
  QuestionnaireDetailSortable,
  QuestionnaireDetailExpansionPanels,

  QuestionnaireResponsesPage,
  QuestionnaireResponsesTable,

  RestrictionsPage,
  RestrictionsTable,

  RiskAssessmentsPage,
  RiskAssessmentsTable,
  RiskAssessmentForm,

  SearchParametersPage,
  SearchParametersTable,

  ServiceRequestsPage,
  ServiceRequestsTable,
  ServiceRequestForm,

  StructureDefinitionsPage,
  StructureDefinitionsTable,

  TasksPage,
  TasksTable,

  ValueSetsPage,
  ValueSetsTable,

  VerificationsPage,
  VerificationsTable,

  FhirDehydrator,
  FhirUtilities,
  LayoutHelpers,
  MedicalRecordImporter,

  BaseModel,

  DynamicSpacer,

  useTracker, 
  withTracker
};




