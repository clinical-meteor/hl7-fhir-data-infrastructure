import React, { useState } from 'react';
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

import { StyledCard, PageCanvas } from 'fhir-starter';


// import CommunicationRequestDetail from './CommunicationRequestDetail';
import CommunicationRequestsTable from './CommunicationRequestsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { useTracker } from 'meteor/react-meteor-data';
import FhirDehydrator from '../../lib/FhirDehydrator';

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

export function CommunicationRequestPage(props){

  let data = {
    // communicationRequest: defaultCommunicationRequest,
    selectedCommunicationRequestId: '',
    currentCommunicationRequest: null,
    communicationRequests: [],
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

  data.selectedCommunicationRequestId = useTracker(function(){
    return Session.get('selectedCommunicationRequestId');
  }, [])
  data.selectedCommunicationRequest = useTracker(function(){
    return CommunicationRequests.findOne(Session.get('selectedCommunicationRequestId'));
  }, [])
  data.communicationRequests = useTracker(function(){
    return CommunicationRequests.find().fetch();
  }, [])


  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  return (
    <PageCanvas id="communicationRequestsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      {/* <CommunicationRequestDetail 
        id='newCommunicationRequest' /> */}

      <StyledCard height="auto" margin={20} >
        <CardHeader
          title={data.communicationRequests.length + " Communication Requests"}
        />
        <CardContent>
          <CommunicationRequestsTable 
            showBarcodes={true} 
            hideIdentifier={true}
            communicationRequests={data.communicationRequests}
            count={data.communicationRequests.length}
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
  );
}


export default CommunicationRequestPage;