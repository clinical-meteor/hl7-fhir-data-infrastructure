import React  from 'react';

import { 
  Card,
  CardHeader,
  CardContent,
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
// COMPONENT

function PersonsPage(props){

  let data = {    
    selectedPersonId: null,
    persons: []
  };

  data.selectedPersonId = useTracker(function(){
    return Session.get('selectedPersonId');
  }, [])
  data.persons = useTracker(function(){
    return Persons.find().fetch();
  }, [])


  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let cardWidth = window.innerWidth - paddingWidth;

  return (
    <PageCanvas id='personsPage' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <StyledCard height='auto' width={cardWidth + 'px'} margin={20} >
        <CardHeader title={ data.persons.length + ' Persons'} />
        <CardContent>
          <PersonsTable 
            persons={ data.persons}
            count={ data.persons.length}
            formFactorLayout={formFactor}
            rowsPerPage={LayoutHelpers.calcTableRows()}
          />
        </CardContent>
      </StyledCard>
    </PageCanvas>
  );
}


export default PersonsPage;