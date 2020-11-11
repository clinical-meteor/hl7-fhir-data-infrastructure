import React from 'react';
import PropTypes from 'prop-types';

import { 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Box,
  Grid
} from '@material-ui/core';

import { StyledCard, PageCanvas } from 'material-fhir-ui';


import CommunicationResponseDetail from './CommunicationResponseDetail';
import CommunicationResponsesTable from './CommunicationResponsesTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Session } from 'meteor/session';
import moment from 'moment';

let defaultCommunicationResponse = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};
Session.setDefault('communicationResponseFormData', defaultCommunicationResponse);
Session.setDefault('communicationResponseSearchFilter', '');

export class CommunicationResponsesPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('communicationResponsePageTabIndex'),
      communicationResponse: defaultCommunicationResponse,
      communicationResponseSearchFilter: '',
      currentCommunicationResponse: null,
      communicationResponses: CommunicationResponses.find().fetch(),
      communicationResponsesCount: CommunicationResponses.find().count()
    };

    if (Session.get('communicationResponseFormData')) {
      data.communicationResponse = Session.get('communicationResponseFormData');
    }
    if (Session.get('communicationResponseSearchFilter')) {
      data.communicationResponseSearchFilter = Session.get('communicationResponseSearchFilter');
    }
    if (Session.get("selectedCommunicationResponse")) {
      data.currentCommunicationResponse = Session.get("selectedCommunicationResponse");
    }

    if(process.env.NODE_ENV === "test") console.log("CommunicationResponsesPage[data]", data);
    return data;
  }

  handleTabChange(index){
    Session.set('communicationResponsePageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedCommunicationResponse', false);
    Session.set('communicationResponseUpsert', false);
  }

  render() {

    let headerHeight = LayoutHelpers.calcHeaderHeight();
    let formFactor = LayoutHelpers.determineFormFactor();

    return (
      <div id="communicationResponsesPage">
        <PageCanvas headerHeight={headerHeight} >
          {/* <CommunicationResponseDetail 
            id='newCommunicationResponse' /> */}

          <StyledCard height="auto" margin={20} >
            <CardHeader
              title="Communication Response Log"
            />
            <CardContent>
              <CommunicationResponsesTable 
                showBarcodes={true} 
                hideIdentifier={true}
                communicationResponses={this.data.communicationResponses}
                count={this.data.communicationResponsesCounts}
                onRemoveRecord={function(recordId){
                  CommunicationResponses.remove({_id: recordId})
                }}
                actionButtonLabel="Enroll"
              />
            </CardContent>
          </StyledCard>
        </PageCanvas>
      </div>
    );
  }
}



ReactMixin(CommunicationResponsesPage.prototype, ReactMeteorData);

export default CommunicationResponsesPage;