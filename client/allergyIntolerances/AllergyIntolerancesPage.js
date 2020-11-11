// =======================================================================
// Using DSTU2  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// https://www.hl7.org/fhir/DSTU2/allergyintolerance.html
//
//
// =======================================================================

import { 
  CssBaseline,
  Grid, 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Button,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';
import { StyledCard, PageCanvas } from 'material-fhir-ui';

// import AllergyIntoleranceDetail from './AllergyIntoleranceDetail';
import AllergyIntolerancesTable from './AllergyIntolerancesTable';

import LayoutHelpers from '../../lib/LayoutHelpers';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React  from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';


//=============================================================================================================================================
// TABS

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

//=============================================================================================================================================
// COMPONENT

Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('selectedAllergyIntolerance', false);

export class AllergyIntolerancesPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('allergyIntolerancePageTabIndex'),
      allergyIntoleranceSearchFilter: Session.get('allergyIntoleranceSearchFilter'),
      allergyIntoleranceId: Session.get('selectedAllergyIntolerance'),
      fhirVersion: Session.get('fhirVersion'),
      selectedAllergy: false,
      allergyIntolerances: AllergyIntolerances.find().fetch()      
    };

    if (Session.get('selectedAllergyIntolerance')){
      data.selectedAllergy = AllergyIntolerances.findOne({_id: Session.get('selectedAllergyIntolerance')});
    } else {
      data.selectedAllergy = false;
    }


    return data;
  }

  handleTabChange(index){
    Session.set('allergyIntolerancePageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedAllergyIntolerance', false);
    Session.set('allergyIntoleranceUpsert', false);
  }

  render() {
    if(process.env.NODE_ENV === "test") console.log('In AllergyIntolerancesPage render');
    
    let headerHeight = LayoutHelpers.calcHeaderHeight();
    let formFactor = LayoutHelpers.determineFormFactor();

    let paddingWidth = 84;
    if(Meteor.isCordova){
      paddingWidth = 20;
    }
    let cardWidth = window.innerWidth - paddingWidth;
    
    return (
      <PageCanvas id="allergyIntolerancesPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
        <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
            <CardHeader title='Allergy Intolerances' />
            <CardContent>
              <AllergyIntolerancesTable 
                id='allergyIntolerancesTable' 
                fhirVersion={ this.data.fhirVersion } 
                allergyIntolerances={this.data.allergyIntolerances}
                formFactorLayout={formFactor}
                />
            </CardContent>
        </StyledCard>
      </PageCanvas>
    );
  }
}

ReactMixin(AllergyIntolerancesPage.prototype, ReactMeteorData);




export default AllergyIntolerancesPage;