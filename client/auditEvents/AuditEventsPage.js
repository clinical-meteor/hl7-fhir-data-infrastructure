import React  from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';


import { 
  Grid, 
  Container,
  Card,
  CardHeader,
  CardContent,
  Button
} from '@material-ui/core';

// import AuditEventDetail from './AuditEventDetail';
import AuditEventsTable from './AuditEventsTable';


import { StyledCard, PageCanvas } from 'material-fhir-ui';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { get } from 'lodash';

import LayoutHelpers from '../../lib/LayoutHelpers';

//===========================================================================
// THEMING


import { ThemeProvider, makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  button: {
    background: theme.background,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: theme.buttonText,
    height: 48,
    padding: '0 30px',
  }
}));

let styles = {
  hideOnPhone: {
    visibility: 'visible',
    display: 'table'
  },
  cellHideOnPhone: {
    visibility: 'visible',
    display: 'table',
    paddingTop: '16px',
    maxWidth: '120px'
  },
  cell: {
    paddingTop: '16px'
  }
}


//===========================================================================
// MAIN COMPONENT  

export class AuditEventsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('auditEventPageTabIndex'),
      auditEventSearchFilter: Session.get('auditEventSearchFilter'),
      currentAuditEvent: Session.get('selectedAuditEvent'),
      auditEvents: AuditEvents.find().fetch()
    };

    return data;
  }

  handleTabChange(index){
    Session.set('auditEventPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedAuditEvent', false);
    Session.set('auditEventUpsert', false);
  }

  render() {
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
}

ReactMixin(AuditEventsPage.prototype, ReactMeteorData);
export default AuditEventsPage;