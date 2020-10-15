import { 
  CssBaseline,
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
import { StyledCard, PageCanvas } from 'material-fhir-ui';


import PractitionerDetail  from './PractitionerDetail';
import PractitionersTable  from './PractitionersTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Package } from 'meteor/meteor';

import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
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

export class PractitionersPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('practitionerPageTabIndex'),
      practitionerSearchFilter: Session.get('practitionerSearchFilter'),
      selectedPractitionerId: Session.get('selectedPractitionerId'),
      blockchainData: Session.get('blockchainPractitionerData'),
      fhirVersion: Session.get('fhirVersion'),
      practitioners: Practitioners.find().fetch(),
      selectedPractitioner: false
    };

    if (Session.get('selectedPractitionerId')){
      data.selectedPractitioner = Practitioners.findOne({_id: Session.get('selectedPractitionerId')});
    } else {
      data.selectedPractitioner = false;
    }

    if(process.env.NODE_ENV === "test") console.log("PractitionersPage[data]", data);
    return data;
  }

  // this could be a mixin
  handleTabChange(index){
    Session.set('practitionerPageTabIndex', index);
  }

  // this could be a mixin
  onNewTab(){
    process.env.DEBUG && console.log("onNewTab; we should clear things...");

    Session.set('selectedPractitionerId', false);
    Session.set('practitionerUpsert', false);
  }

  render() {
    var blockchainTab;
    if (get(Meteor, 'settings.public.defaults.displayBlockchainComponents')){
      blockchainTab = <Tab className="practitionerBlockchainHisotryTab" label='Blockchain' onActive={this.handleActive} style={this.data.style.tab} value={3}>
        <PractitionersTable showBarcodes={false} data={ this.data.blockchainData } />
      </Tab>                 
    }

    let headerHeight = LayoutHelpers.calcHeaderHeight();
    let formFactor = LayoutHelpers.determineFormFactor();

    let paddingWidth = 84;
    if(Meteor.isCordova){
      paddingWidth = 20;
    }
    let cardWidth = window.innerWidth - paddingWidth;

    return (      
      <PageCanvas id="practitionersPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
        <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
            <CardHeader title='Practitioners' />
            <CardContent>
              <PractitionersTable 
                  practitioners={this.data.practitioners}
                  fhirVersion={this.data.fhirVersion} 
                  formFactorLayout={formFactor}
                  showBarcodes={false} />

              {/* <Tabs id="practitionersPageTabs" value={this.data.tabIndex} onChange={this.handleTabChange } aria-label="simple tabs example">
                <Tab label="Practitioners" value={0} />
                <Tab label="New" value={1} />
              </Tabs>
              <TabPanel >
                <PractitionersTable 
                  fhirVersion={this.data.fhirVersion} 
                  showBarcodes={false} />
              </TabPanel>              
              <TabPanel >
                <PractitionerDetail 
                  id='practitionerDetails' 
                  practitioner={ this.data.selectedPractitioner }
                  practitionerId={ this.data.selectedPractitionerId } />  
              </TabPanel>               */}
            </CardContent>
            { blockchainTab }
         </StyledCard>
      </PageCanvas>
    );
  }
}

ReactMixin(PractitionersPage.prototype, ReactMeteorData);
export default PractitionersPage;