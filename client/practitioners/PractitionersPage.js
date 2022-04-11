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


import PractitionerDetail  from './PractitionerDetail';
import PractitionersTable  from './PractitionersTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Package } from 'meteor/meteor';

import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';


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
Session.setDefault('PractitionersPage.onePageLayout', false);
Session.setDefault('PractitionersTable.hideCheckbox', true);
Session.setDefault('PractitionersTable.practitionersIndex', 0);
Session.setDefault('selectedPractitionerId', false);
Session.setDefault('blockchainPractitionerData', []);
Session.setDefault('fhirVersion', 'v1.0.2');

export function PractitionersPage(props){
  
  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let data = {
    selectedPractitionerId: '',
    selectedPractitioner: null,
    practitioners: [],
    onePageLayout: true,
    hideCheckbox: true,
    practitionersIndex: 0
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('PractitionersPage.onePageLayout');
  }, [])
  data.hideCheckbox = useTracker(function(){
    return Session.get('PractitionersTable.hideCheckbox');
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

  data.practitionersIndex = useTracker(function(){
    return Session.get('PractitionersTable.practitionersIndex')
  }, [])


  function setPractitionersIndex(newIndex){
    Session.set('PractitionersTable.practitionersIndex', newIndex)
  }


  function handleRowClick(practitionerId){
    console.log('PractitionersPage.handleRowClick', practitionerId)
    let practitioner = Practitioners.findOne({id: practitionerId});

    if(practitioner){
      Session.set('selectedPractitionerId', get(practitioner, 'id'));
      Session.set('selectedPractitioner', practitioner);
      Session.set('Practitioner.Current', practitioner);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "PractitionerDetail");
        Session.set('mainAppDialogMaxWidth', "md");

        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Practitioner");
        } else {
          Session.set('mainAppDialogTitle', "View Practitioner");
        }
      }      
    } else {
      console.log('No practitioner found...')
    }
  }

  let blockchainTab;
  if (get(Meteor, 'settings.public.defaults.displayBlockchainComponents')){
    blockchainTab = <Tab className="practitionerBlockchainHisotryTab" label='Blockchain' onActive={this.handleActive} style={data.style.tab} value={3}>
      <PractitionersTable showBarcodes={false} data={ data.blockchainData } />
    </Tab>                 
  }

  let cardWidth = window.innerWidth - paddingWidth;

  // let [practitionersIndex, setPractitionersIndex] = setState(0);

  return (      
    <PageCanvas id="practitionersPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
          <CardHeader title={data.practitioners.length + ' Practitioners'} />
          <CardContent>
            <PractitionersTable 
                practitioners={data.practitioners}
                hideCheckbox={data.hideCheckbox}
                selectedPractitionerId={ data.selectedPractitionerId }
                onRowClick={ handleRowClick.bind(this) }
                rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
                onSetPage={function(index){
                  setPractitionersIndex(index)
                }}    
                page={data.practitionersIndex}
                size="medium"
                />
          </CardContent>
          { blockchainTab }
       </StyledCard>
    </PageCanvas>
  );
}

export default PractitionersPage;