import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';


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

import { FhirDehydrator, StyledCard, PageCanvas } from 'fhir-starter';

// import AuditEventDetail from './AuditEventDetail';
import AuditEventsTable from './AuditEventsTable';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { get } from 'lodash';



//===========================================================================
// MAIN COMPONENT  

Session.setDefault('selectedAuditEventId', '');
Session.setDefault('AuditEventsPage.onePageLayout', true)
Session.setDefault('AuditEventsPage.auditEventsPageIndex', 0);

export function AuditEventsPage(props){

  // let [auditEventsPageIndex, setAuditEventsPageIndex] = useState(0);

  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    auditEvents: [],
    onePageLayout: true,
    auditEventSearchFilter: '',
    auditEventsPageIndex: 0
  };

  data.auditEventsPageIndex = useTracker(function(){
    return Session.get('AuditEventsPage.auditEventsPageIndex');
  }, [])
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

  function setAuditEventsPageIndex(index){
    Session.set('AuditEventsPage.auditEventsPageIndex', index);
  }

  
  return (
    <PageCanvas id="auditEventsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
        <CardHeader title='Audit Events' />
        <CardContent>
          <AuditEventsTable 
            auditEvents={data.auditEvents}
            count={data.auditEvents.length}
            formFactorLayout={formFactor}
            rowsPerPage={LayoutHelpers.calcTableRows()}
            page={data.auditEventsPageIndex}
            onSetPage={function(index){
              setAuditEventsPageIndex(index)
            }}
          />
        </CardContent>
      </StyledCard>
    </PageCanvas>
  );
}


export default AuditEventsPage;