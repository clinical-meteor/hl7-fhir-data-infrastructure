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

import CommunicationDetail from './CommunicationDetail';
import CommunicationsTable from './CommunicationsTable';
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

export class CommunicationsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('communicationPageTabIndex'),
      communication: defaultCommunication,
      communicationSearchFilter: '',
      currentCommunication: null
    };

    if (Session.get('communicationFormData')) {
      data.communication = Session.get('communicationFormData');
    }
    if (Session.get('communicationSearchFilter')) {
      data.communicationSearchFilter = Session.get('communicationSearchFilter');
    }
    if (Session.get("selectedCommunication")) {
      data.currentCommunication = Session.get("selectedCommunication");
    }

    if(process.env.NODE_ENV === "test") console.log("CommunicationsPage[data]", data);
    return data;
  }

  handleTabChange(index){
    Session.set('communicationPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedCommunication', false);
    Session.set('communicationUpsert', false);
  }

  render() {

    let headerHeight = LayoutHelpers.calcHeaderHeight();
    let formFactor = LayoutHelpers.determineFormFactor();

    return (
      <div id="communicationsPage">
        <PageCanvas headerHeight={headerHeight} >
          {/* <CommunicationDetail 
            id='newCommunication' />  */}

          <StyledCard height="auto" margin={20} >
            <CardHeader
              title="Communication Log"
            />
            <CardContent>
              <CommunicationsTable 
                
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
      </div>
    );
  }
}



ReactMixin(CommunicationsPage.prototype, ReactMeteorData);

export default CommunicationsPage;