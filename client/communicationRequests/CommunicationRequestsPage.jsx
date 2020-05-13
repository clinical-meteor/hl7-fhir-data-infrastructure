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


import CommunicationRequestDetail from './CommunicationRequestDetail';
import CommunicationRequestsTable from './CommunicationRequestsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Session } from 'meteor/session';
import moment from 'moment';

let defaultCommunicationRequest = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};
Session.setDefault('communicationRequestFormData', defaultCommunicationRequest);
Session.setDefault('communicationRequestSearchFilter', '');

export class CommunicationRequestPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('communicationRequestPageTabIndex'),
      communicationRequest: defaultCommunicationRequest,
      communicationRequestSearchFilter: '',
      currentCommunicationRequest: null,
      communicationRequests: CommunicationRequests.find().fetch(),
      communicationRequestsCount: CommunicationRequests.find().count()
    };

    if (Session.get('communicationRequestFormData')) {
      data.communicationRequest = Session.get('communicationRequestFormData');
    }
    if (Session.get('communicationRequestSearchFilter')) {
      data.communicationRequestSearchFilter = Session.get('communicationRequestSearchFilter');
    }
    if (Session.get("selectedCommunicationRequest")) {
      data.currentCommunicationRequest = Session.get("selectedCommunicationRequest");
    }

    if(process.env.NODE_ENV === "test") console.log("CommunicationRequestPage[data]", data);
    return data;
  }

  handleTabChange(index){
    Session.set('communicationRequestPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedCommunicationRequest', false);
    Session.set('communicationRequestUpsert', false);
  }

  render() {

    let headerHeight = LayoutHelpers.calcHeaderHeight();

    return (
      <div id="communicationRequestsPage">
        <PageCanvas headerHeight={headerHeight} >
          {/* <CommunicationRequestDetail 
            id='newCommunicationRequest' /> */}

          <StyledCard height="auto" margin={20} >
            <CardHeader
              title="Communication Requests"
            />
            <CardContent>
              <CommunicationRequestsTable 
                showBarcodes={true} 
                hideIdentifier={true}
                communicationRequests={this.data.communicationRequests}
                count={this.data.communicationRequestsCount}
                hideIdentifier={false}
                hideCheckbox={true}
                hideActionIcons={true}
                hideBarcode={false}                
                onRemoveRecord={function(recordId){
                  CommunicationRequest.remove({_id: recordId})
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



ReactMixin(CommunicationRequestPage.prototype, ReactMeteorData);

export default CommunicationRequestPage;