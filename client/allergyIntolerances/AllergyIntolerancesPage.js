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

import AllergyIntoleranceDetail from './AllergyIntoleranceDetail';
import AllergyIntolerancesTable from './AllergyIntolerancesTable';

import LayoutHelpers from '../../lib/LayoutHelpers';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
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
      selectedAllergy: false
    };

    if (Session.get('selectedAllergyIntolerance')){
      data.selectedAllergy = AllergyIntolerances.findOne({_id: Session.get('selectedAllergyIntolerance')});
    } else {
      data.selectedAllergy = false;
    }

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

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

    return (
      <div id='allergyIntolerancesPage'>
        <StyledCard height="auto" scrollable={true} margin={20} headerHeight={headerHeight} >
            <CardHeader title='Allergy Intolerances' />
            <CardContent>
              <Tabs id="allergyIntolerancesPageTabs" value={this.data.tabIndex} onChange={this.handleTabChange } aria-label="simple tabs example">
                <Tab label="History" value={0} />
                <Tab label="New" value={1} />
              </Tabs>
              <TabPanel >
                <AllergyIntolerancesTable id='allergyIntolerancesTable' fhirVersion={ this.data.fhirVersion } />
              </TabPanel >
              <TabPanel >
                <AllergyIntoleranceDetail 
                  id='allergyIntoleranceDetails' 
                  showDatePicker={true} 
                  fhirVersion={ this.data.fhirVersion }
                  allergy={ this.data.selectedAllergy }
                  allergyIntoleranceId={ this.data.allergyIntoleranceId } />
              </TabPanel >

              {/* <Tabs default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
               <Tab className='newAllergyIntoleranceTab' label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0}>
                 <AllergyIntoleranceDetail 
                  id='newAllergyIntolerance' 
                  fhirVersion={ this.data.fhirVersion }
                  showDatePicker={true} 
                  allergy={ this.data.selectedAllergy }
                  allergyIntoleranceId={ this.data.allergyIntoleranceId } />
               </Tab>
               <Tab className="allergyIntoleranceListTab" label='AllergyIntolerances' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                <AllergyIntolerancesTable id='allergyIntolerancesTable' fhirVersion={ this.data.fhirVersion } />
               </Tab>
               <Tab className="allergyIntoleranceDetailsTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                 <AllergyIntoleranceDetail 
                    id='allergyIntoleranceDetails' 
                    showDatePicker={true} 
                    fhirVersion={ this.data.fhirVersion }
                    allergy={ this.data.selectedAllergy }
                    allergyIntoleranceId={ this.data.allergyIntoleranceId } />
               </Tab>
             </Tabs> */}
            </CardContent>
        </StyledCard>
      </div>
    );
  }
}

ReactMixin(AllergyIntolerancesPage.prototype, ReactMeteorData);

export default AllergyIntolerancesPage;