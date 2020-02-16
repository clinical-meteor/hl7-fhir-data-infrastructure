

import BundlesPage from './client/bundles/BundlesPage';
// import BundleTable from './client/bundles/BundleTable';
// import BundleDetail from './client/bundles/BundleDetail';

var DynamicRoutes = [{
  'name': 'BundlePage',
  'path': '/bundles',
  'component': BundlesPage,
  'requireAuth': true
}];

var SidebarElements = [{
    'primaryText': 'Bundles',
    'to': '/bundles',
    'href': '/bundles'
  }];
  
var AdminSidebarElements = [{
  'primaryText': 'Bundles',
  'to': '/bundles',
  'href': '/bundles'
}];

export { 
  SidebarElements,
  AdminSidebarElements, 
  DynamicRoutes, 

  BundlesPage,
  BundleTable,
  BundleDetail
};


