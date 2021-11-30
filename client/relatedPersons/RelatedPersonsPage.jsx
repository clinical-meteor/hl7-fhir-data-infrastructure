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

import RelatedPersonDetail from './RelatedPersonDetail';
import RelatedPersonsTable from './RelatedPersonsTable';

import LayoutHelpers from '../../lib/LayoutHelpers';

import { useTracker } from 'meteor/react-meteor-data';
import FhirDehydrator from '../../lib/FhirDehydrator';

import { get } from 'lodash';



//=============================================================================================================================================
// COMPONENT

function RelatedPersonsPage(props){

  let data = {    
    selectedCarePlanId: null,
    relatedPersons: []
  };

  data.selectedCarePlanId = useTracker(function(){
    return Session.get('selectedCarePlanId');
  }, [])
  data.relatedPersons = useTracker(function(){
    return RelatedPersons.find().fetch();
  }, [])

  function handleRowClick(relatedPersonId){
    console.log('RelatedPersonsPage.handleRowClick', relatedPersonId)
    let relatedPerson = RelatedPersons.findOne({id: relatedPersonId});

    if(relatedPerson){
      Session.set('selectedRelatedPersonId', get(relatedPerson, 'id'));
      Session.set('selectedRelatedPerson', relatedPerson);
      Session.set('RelatedPerson.Current', relatedPerson);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "RelatedPersonDetail");
        Session.set('mainAppDialogMaxWidth', "sm");

        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Person");
        } else {
          Session.set('mainAppDialogTitle', "View Person");
        }
      }      
    } else {
      console.log('No related person found...')
    }
  }

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let cardWidth = window.innerWidth - paddingWidth;

  return (
    <PageCanvas id='relatedPersonsPage' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <StyledCard height='auto' width={cardWidth + 'px'} margin={20} >
        <CardHeader title={ data.relatedPersons.length + ' Related Persons'} />
        <CardContent>
          <RelatedPersonsTable 
            relatedPersons={ data.relatedPersons}
            count={ data.relatedPersons.length}
            formFactorLayout={formFactor}
            rowsPerPage={LayoutHelpers.calcTableRows()}
            onRowClick={ handleRowClick.bind(this) }
          />
        </CardContent>
      </StyledCard>
    </PageCanvas>
  );
}


export default RelatedPersonsPage;