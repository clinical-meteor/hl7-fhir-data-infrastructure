import React  from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';


import { 
  Grid, 
  Container,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Box
} from '@material-ui/core';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

// import AuditEventDetail from './AuditEventDetail';
import AuditEventsTable from './AuditEventsTable';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React  from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';


import { get } from 'lodash';

import LayoutHelpers from '../../lib/LayoutHelpers';



//===========================================================================
// MAIN COMPONENT  

Session.setDefault('selectedAuditEventId', '');
Session.setDefault('AuditEventsPage.onePageLayout', true)

export function AuditEventsPage(props){

  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    auditEvents: [],
    onePageLayout: true,
    auditEventSearchFilter: ''
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('AuditEventsPage.onePageLayout');
  }, [])
  data.selectedAuditEventId = useTracker(function(){
    return Session.get('selectedAuditEventId');
  }, [])
  data.selectedAuditEvent = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedAuditEventId'));
  }, [])
  data.auditEvents = useTracker(function(){
    return AuditEvents.find().fetch();
  }, [])
  data.auditEventSearchFilter = useTracker(function(){
    return Session.get('auditEventSearchFilter')
  }, [])

  if(process.env.NODE_ENV === "test") console.log('In AuditEventsPage render');

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let cardWidth = window.innerWidth - paddingWidth;

  return (
    <PageCanvas id="auditEventsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
        <CardHeader title='Audit Events' />
        <CardContent>
          <AuditEventsTable 
            auditEvents={this.data.auditEvents}
            count={this.data.auditEvents.length}
            formFactorLayout={formFactor}
          />
        </CardContent>
      </StyledCard>
    </PageCanvas>
  );
}


export default AuditEventsPage;