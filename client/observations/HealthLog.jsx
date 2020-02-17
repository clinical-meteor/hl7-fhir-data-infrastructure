
import { StyledCard, PageCanvas, DynamicSpacer } from 'material-fhir-ui';


import { Meteor } from 'meteor/meteor';
import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import { VitalMeasurements } from './VitalMeasurements';

import PropTypes from 'prop-types';

export class Healthlog extends React.Component {
  getMeteorData() {
    let data = {
      style: {},
      state: {
        isLoggedIn: false
      }
    };

    if (Meteor.user()) {
      data.state.isLoggedIn = true;
    }

    return data;
  }

  renderAuthenticatedUserControls(isLoggedIn) {

    // user should be able to see the addPost component if they're logged in and looking at their
    // own profile; otherwise,
    if (isLoggedIn) {
      if (!this.props.routeParams.userId) {
        return (
          <div>
            <VitalMeasurements />
          </div>
        );
      }
    }
  }

  render() {
    return (
      <div id="weblogPage">
        <PageCanvas>
          { this.renderAuthenticatedUserControls(this.data.state.isLoggedIn) }
        </PageCanvas>
      </div>
    );
  }
}


Healthlog.propTypes = {
  children: PropTypes.any
};
ReactMixin(Healthlog.prototype, ReactMeteorData);
export default Healthlog;