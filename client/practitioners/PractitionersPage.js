import { 
  Grid, 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Button,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';
import { StyledCard, PageCanvas } from 'fhir-starter';


// import PractitionerDetail  from './PractitionerDetail';
import PractitionersTable  from './PractitionersTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Package } from 'meteor/meteor';

import React  from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import { get } from 'lodash';

//=============================================================================================================================================
// TABS

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

//=============================================================================================================================================
// COMPONENT

Session.setDefault('practitionerPageTabIndex', 1);
Session.setDefault('practitionerSearchFilter', '');
Session.setDefault('selectedPractitionerId', false);
Session.setDefault('blockchainPractitionerData', []);
Session.setDefault('fhirVersion', 'v1.0.2');

export function PractitionersPage(props){
  let data = {
    selectedPractitionerId: '',
    selectedPractitioner: null,
    practitioners: [],
    onePageLayout: true
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('PractitionersPage.onePageLayout');
  }, [])
  data.selectedPractitionerId = useTracker(function(){
    return Session.get('selectedPractitionerId');
  }, [])
  data.selectedPractitioner = useTracker(function(){
    return Practitioners.findOne(Session.get('selectedPractitionerId'));
  }, [])
  data.practitioners = useTracker(function(){
    return Practitioners.find().fetch();
  }, [])


  let blockchainTab;
  if (get(Meteor, 'settings.public.defaults.displayBlockchainComponents')){
    blockchainTab = <Tab className="practitionerBlockchainHisotryTab" label='Blockchain' onActive={this.handleActive} style={data.style.tab} value={3}>
      <PractitionersTable showBarcodes={false} data={ data.blockchainData } />
    </Tab>                 
  }

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let cardWidth = window.innerWidth - paddingWidth;

  return (      
    <PageCanvas id="practitionersPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
          <CardHeader title={data.practitioners.length + ' Practitioners'} />
          <CardContent>
            <PractitionersTable 
                practitioners={data.practitioners}
                fhirVersion={data.fhirVersion} 
                formFactorLayout={formFactor}
                showBarcodes={false} />

            {/* <Tabs id="practitionersPageTabs" value={data.tabIndex} onChange={this.handleTabChange } aria-label="simple tabs example">
              <Tab label="Practitioners" value={0} />
              <Tab label="New" value={1} />
            </Tabs>
            <TabPanel >
              <PractitionersTable 
                fhirVersion={data.fhirVersion} 
                showBarcodes={false} />
            </TabPanel>              
            <TabPanel >
              <PractitionerDetail 
                id='practitionerDetails' 
                practitioner={ data.selectedPractitioner }
                practitionerId={ data.selectedPractitionerId } />  
            </TabPanel>               */}
          </CardContent>
          { blockchainTab }
       </StyledCard>
    </PageCanvas>
  );
}

export default PractitionersPage;