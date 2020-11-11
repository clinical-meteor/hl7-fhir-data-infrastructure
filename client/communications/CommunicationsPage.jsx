import React from 'react';
import PropTypes from 'prop-types';

import { 
  CardHeader,
  CardContent,
  Button,
  Box,
  Grid
} from '@material-ui/core';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

// import CommunicationsTable from './CommunicationsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Session } from 'meteor/session';
import moment from 'moment';


let defaultCommunication = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};
Session.setDefault('communicationFormData', defaultCommunication);
Session.setDefault('communicationSearchFilter', '');

export function CommunicationsPage(props){

  let data = {   
    communication: defaultCommunication,
    selectedCommunication: null,
    selectedCommunicationId: ''
  };

  data.selectedCommunicationId = useTracker(function(){
    return Session.get('selectedCommunicationId');
  }, [])
  data.selectedCommunication = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedCommunicationId'));
  }, [])
  data.communications = useTracker(function(){
    return Communications.find().fetch();
  }, [])


  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  return (
    <PageCanvas id="communicationsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>

      <StyledCard height="auto" margin={20} >
        <CardHeader
          title="Communication Log"
        />
        <CardContent>
          <CommunicationsTable 
            communications={communications}
            hideIdentifier={true}
            hideCheckbox={true}
            hideActionIcons={true}
            hideBarcode={false} 
            onRemoveRecord={function(recordId){
              Communications.remove({_id: recordId})
            }}
            actionButtonLabel="Enroll"
          />
        </CardContent>
      </StyledCard>
    </PageCanvas>
  );
}



export default CommunicationsPage;