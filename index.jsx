

import BundlesPage from './client/bundles/BundlesPage';
import BundleTable from './client/bundles/BundleTable';
import BundleDetail from './client/bundles/BundleDetail';

import PatientsPage from './client/patients/NewPatientsPage';

var DynamicRoutes = [{
  'name': 'BundlePage',
  'path': '/bundles',
  'component': BundlesPage,
  'requireAuth': true
}, {
  'name': 'PatientPage',
  'path': '/patients',
  'component': PatientsPage,
  'requireAuth': true
}];

var SidebarElements = [{
    'primaryText': 'Bundles',
    'to': '/bundles',
    'href': '/bundles'
  }, {
    'primaryText': 'Patients',
    'to': '/patients',
    'href': '/patients',
    // 'iconName': "FaUserInjured"
  }];
  
var AdminSidebarElements = [{
  'primaryText': 'Bundles',
  'to': '/bundles',
  'href': '/bundles'
}, {
  'primaryText': 'Patients',
  'to': '/patients',
  'href': '/patients',
  // 'iconName': "FaUserInjured"
}];

export { 
  SidebarElements,
  AdminSidebarElements, 
  DynamicRoutes, 

  BundlesPage,
  BundleTable,
  BundleDetail,

  PatientsPage
};


