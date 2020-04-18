import { CardText, CardTitle } from 'material-ui/Card';
import { Tab, Tabs } from 'material-ui/Tabs';

import { Glass, GlassCard, FullPageCanvas, DynamicSpacer } from 'meteor/clinical:glass-ui';

import CommunicationDetail from './CommunicationDetail';
import CommunicationTable from './CommunicationTable';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Session } from 'meteor/session';
import PropTypes from 'prop-types';

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

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

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
    return (
      <div id="communicationsPage">
        <FullPageCanvas>
          <CommunicationDetail 
            id='newCommunication' />
          {/* <DynamicSpacer /> */}

          <GlassCard height="auto" style={{margin: '16px'}}>
            <CardTitle
              title="Communication Log"
            />
            <CardText>
              <CommunicationTable 
                showBarcodes={true} 
                hideIdentifier={true}
                onRemoveRecord={function(recordId){
                  Communications.remove({_id: recordId})
                }}
                actionButtonLabel="Enroll"
              />
            </CardText>
          </GlassCard>
        </FullPageCanvas>
      </div>
    );
  }
}



ReactMixin(CommunicationsPage.prototype, ReactMeteorData);

export default CommunicationsPage;