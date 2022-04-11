// =======================================================================
// Using DSTU2  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// https://www.hl7.org/fhir/DSTU2/allergyintolerance.html
//
//
// =======================================================================

import React, { useState } from 'react';

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

// import AllergyIntoleranceDetail from './AllergyIntoleranceDetail';
import AllergyIntolerancesTable from './AllergyIntolerancesTable';

import LayoutHelpers from '../../lib/LayoutHelpers';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { useTracker } from 'meteor/react-meteor-data';
import FhirDehydrator from '../../lib/FhirDehydrator';


//=============================================================================================================================================
// COMPONENT

Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('selectedAllergyIntoleranceId', false);
Session.setDefault('selectedAllergyIntolerance', false);

export function AllergyIntolerancesPage(props){

  let [allergyIntolerancePageIndex, setAllergyIntolerancePageIndex] = setState(0); 

  let data = {
    allergyIntoleranceId: '',
    selectedAllergy: null,
    allergyIntolerances: []  
  };

  data.selectedAllergyIntoleranceId = useTracker(function(){
    return Session.get('selectedAllergyIntoleranceId');
  }, [])
  data.selectedAllergyIntolerance = useTracker(function(){
    return AllergyIntolerances.findOne({_id: Session.get('selectedAllergyIntoleranceId')});
  }, [])
  data.allergyIntolerances = useTracker(function(){
    return AllergyIntolerances.find().fetch();     
  }, [])


  if(process.env.NODE_ENV === "test") console.log('In AllergyIntolerancesPage render');
    
  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
  
  let cardWidth = window.innerWidth - paddingWidth;
  
  return (
    <PageCanvas id="allergyIntolerancesPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
          <CardHeader title='Allergy Intolerances' />
          <CardContent>
            <AllergyIntolerancesTable 
              id='allergyIntolerancesTable' 
              fhirVersion={ data.fhirVersion } 
              allergyIntolerances={data.allergyIntolerances}
              formFactorLayout={formFactor}
              page={allergyIntolerancePageIndex}
              onSetPage={function(index){
                setAllergyIntolerancePageIndex(index)
              }}
            />
          </CardContent>
      </StyledCard>
    </PageCanvas>
  );
}


export default AllergyIntolerancesPage;