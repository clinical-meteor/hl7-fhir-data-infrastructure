import React, { useState } from 'react';

import { 
  Card,
  CardHeader,
  CardContent,
  Container,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';
import { StyledCard, PageCanvas } from 'fhir-starter';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import PersonsTable from './PersonsTable';

import LayoutHelpers from '../../lib/LayoutHelpers';

import { useTracker } from 'meteor/react-meteor-data';
import FhirDehydrator from '../../lib/FhirDehydrator';

import { get } from 'lodash';



//=============================================================================================================================================
// SESSION VARIABLES

Session.setDefault('personPageTabIndex', 1); 
Session.setDefault('personSearchFilter', ''); 
Session.setDefault('selectedPersonId', false);
Session.setDefault('selectedPerson', false)
Session.setDefault('PersonsPage.onePageLayout', true)
Session.setDefault('PersonsPage.defaultQuery', {})
Session.setDefault('PersonsTable.hideCheckbox', true)
Session.setDefault('PersonsTable.personsIndex', 0)


//=============================================================================================================================================
// COMPONENT

function PersonsPage(props){

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
  let noDataImage = get(Meteor, 'settings.public.defaults.noData.noDataImagePath', "packages/clinical_hl7-fhir-data-infrastructure/assets/NoData.png");  

  let cardWidth = window.innerWidth - paddingWidth;

  
  let data = {    
    selectedPersonId: null,
    persons: [],
    personsIndex: 0
  };

  data.selectedPersonId = useTracker(function(){
    return Session.get('selectedPersonId');
  }, [])
  data.persons = useTracker(function(){
    return Persons.find().fetch();
  }, [])
  data.personsIndex = useTracker(function(){
    return Session.get('PersonsTable.personsIndex')
  }, [])
  data.showSystemIds = useTracker(function(){
    return Session.get('showSystemIds');
  }, [])
  data.showFhirIds = useTracker(function(){
    return Session.get('showFhirIds');
  }, [])



  let layoutContent;
  if(data.persons.length > 0){
    layoutContent = <StyledCard height='auto' width={cardWidth + 'px'} margin={20} >
      <CardHeader title={ data.persons.length + ' Persons'} />
      <CardContent>
        <PersonsTable 
          persons={ data.persons}
          count={ data.persons.length}
          formFactorLayout={formFactor}
          rowsPerPage={LayoutHelpers.calcTableRows()}
          onSetPage={function(index){
            setPersonsIndex(index)
          }}
          page={data.personsIndex}
        />
      </CardContent>
    </StyledCard>
  } else {
    layoutContent = <Container maxWidth="sm" style={{display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', height: '100%', justifyContent: 'center'}}>
      <img src={Meteor.absoluteUrl() + noDataImage} style={{width: '100%', marginTop: get(Meteor, 'settings.public.defaults.noData.marginTop', '-200px')}} />    
      <CardContent>
        <CardHeader 
          title={get(Meteor, 'settings.public.defaults.noData.defaultTitle', "No Data Available")} 
          subheader={get(Meteor, 'settings.public.defaults.noData.defaultMessage', "No records were found in the client data cursor.  To debug, check the data cursor in the client console, then check subscriptions and publications, and relevant search queries.  If the data is not loaded in, use a tool like Mongo Compass to load the records directly into the Mongo database, or use the FHIR API interfaces.")} 
        />
      </CardContent>
    </Container>
  }

  return (
    <PageCanvas id='personsPage' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      { layoutContent }
    </PageCanvas>
  );
}


export default PersonsPage;