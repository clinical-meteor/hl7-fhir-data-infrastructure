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
Session.setDefault('PractitionersTable.practitionersPageIndex', 0);
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
    showSystemIds: false,
    showFhirIds: false,
    practitionersPageIndex: 0,
    currentUser: false,
    isDisabled: true,
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

  data.practitionersPageIndex = useTracker(function(){
    return Session.get('PractitionersTable.practitionersPageIndex')
  }, [])
  data.showSystemIds = useTracker(function(){
    return Session.get('showSystemIds');
  }, [])
  data.showFhirIds = useTracker(function(){
    return Session.get('showFhirIds');
  }, [])
  data.currentUser = useTracker(function(){
    return Session.get('currentUser');
  }, [])
  data.isDisabled = useTracker(function(){
    if(Session.get('currentUser')){
      return false;
    } else {
      return true;
    }
  }, [])

  function setPractitionersIndex(newIndex){
    Session.set('PractitionersTable.practitionersPageIndex', newIndex)
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
  let noDataImage = get(Meteor, 'settings.public.defaults.noData.noDataImagePath', "packages/clinical_hl7-fhir-data-infrastructure/assets/NoData.png");  


  let layoutContent;
  if(data.practitioners.length > 0){
    layoutContents = <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
      <CardHeader title={data.practitioners.length + ' Practitioners'} />
      <CardContent>
        <PractitionersTable 
            practitioners={data.practitioners}
            count={data.practitioners.length}
            hideCheckbox={data.hideCheckbox}
            hideBarcode={!data.showSystemIds}
            hideFhirId={!data.showFhirIds}
            hideQualification={true}
            selectedPractitionerId={ data.selectedPractitionerId }
            onRowClick={ handleRowClick.bind(this) }
            rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
            onSetPage={function(index){
              setPractitionersIndex(index)
            }}    
            page={data.practitionersPageIndex}
            size="medium"
            />
      </CardContent>
      { blockchainTab }
    </StyledCard>
  } else {
    layoutContainer = <Container maxWidth="sm" style={{display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', height: '100%', justifyContent: 'center'}}>
      <img src={Meteor.absoluteUrl() + noDataImage} style={{width: '100%', marginTop: get(Meteor, 'settings.public.defaults.noData.marginTop', '-200px')}} />    
      <CardContent>
        <CardHeader 
          title={get(Meteor, 'settings.public.defaults.noData.defaultTitle', "No Data Selected")} 
          subheader={get(Meteor, 'settings.public.defaults.noData.defaultMessage', "Please import some vital sign data, and then select a biomarker type.")} 
        />
      </CardContent>
    </Container>
  }

  return (      
    <PageCanvas id="practitionersPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      { layoutContent }
    </PageCanvas>
  );
}

export default PractitionersPage;