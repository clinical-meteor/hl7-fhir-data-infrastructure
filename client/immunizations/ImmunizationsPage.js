import { 
  Grid,
  Card,
  Button,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  TextField,
  DatePicker,
  Tab, 
  Tabs,
  Box
} from '@material-ui/core';

import { PageCanvas, StyledCard } from 'fhir-starter';

// import ImmunizationDetail from './ImmunizationDetail';
import ImmunizationsTable from './ImmunizationsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { Session } from 'meteor/session';

import React  from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import { get } from 'lodash';


//=============================================================================================================================================
// COMPONENT


Session.setDefault('fhirVersion', 'v1.0.2');

export function ImmunizationsPage(props){

  let data = {
    selectedImmunizationId: Session.get('selectedImmunizationId'),
    selectedImmunization: false,
    immunizations: []
  };

  data.selectedImmunizationId = useTracker(function(){
    return Session.get('selectedImmunizationId');
  }, [])
  data.selectedImmunization = useTracker(function(){
    return Immunizations.findOne({_id: Session.get('selectedImmunizationId')});
  }, [])
  data.immunizations = useTracker(function(){
    return Immunizations.find().fetch();
  }, [])


  if(process.env.NODE_ENV === "test") console.log('ImmunizationsPage.render()', data);

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let cardWidth = window.innerWidth - paddingWidth;

  return (
    <PageCanvas id='immunizationsPage' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
          <CardHeader title={data.immunizations.length + ' Immunizations'} />
          <CardContent>
            <Grid container>
              <Grid item md={12}>
                <ImmunizationsTable 
                  immunizations={data.immunizations }    
                  count={data.immunizations.length }    
                  formFactorLayout={formFactor}
                />
              </Grid>
            </Grid>
          </CardContent>
      </StyledCard>
    </PageCanvas>
  );
}



export default ImmunizationsPage;