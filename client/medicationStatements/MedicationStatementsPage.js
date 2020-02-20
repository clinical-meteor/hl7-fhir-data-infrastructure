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

import MedicationStatementDetail from './MedicationStatementDetail';
import MedicationStatementsTable from './MedicationStatementsTable';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import { get } from 'lodash';


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
Session.setDefault('selectedMedicationStatementId', false);

export class MedicationStatementsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('medicationStatementPageTabIndex'),
      medicationStatementSearchFilter: Session.get('medicationStatementSearchFilter'),
      selectedMedicationStatementId: Session.get('selectedMedicationStatementId'),
      fhirVersion: Session.get('fhirVersion'),
      selectedMedicationStatement: false
    }; 

    if(Session.get('fhirVersion')){
      data.fhirVersion = Session.get('fhirVersion')
    }

    if (Session.get('selectedMedicationStatementId')){
      data.selectedMedicationStatement = MedicationStatements.findOne({_id: Session.get('selectedMedicationStatementId')});
    } else {
      data.selectedMedicationStatement = false;
    }

    // data.style = Glass.blur(data.style);
    // data.style.appbar = Glass.darkroom(data.style.appbar);
    // data.style.tab = Glass.darkroom(data.style.tab);

    return data;
  }

  handleTabChange(index){
    Session.set('medicationStatementPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedMedicationStatement', false);
    Session.set('medicationStatementFormUpsert', false);
  }

  render() {
    if(process.env.NODE_ENV === "test") console.log('In MedicationStatementsPage render');

    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader')){
      headerHeight = 128;
    }

    return (
      <PageCanvas id='medicationStatementsPage' headerHeight={headerHeight}>
        <StyledCard height="auto" scrollable={true} margin={20}  >
            <CardHeader title='Medication Statements' />
            <CardContent>
              <Tabs id="allergyIntolerancesPageTabs" value={this.data.tabIndex} onChange={this.handleTabChange } aria-label="simple tabs example">
                <Tab label="History" value={0} />
                <Tab label="New" value={1} />
              </Tabs>
              <TabPanel >
                <MedicationStatementsTable fhirVersion={ this.data.fhirVersion } />
              </TabPanel >
              <TabPanel >
                {/* <MedicationStatementDetail 
                    id='medicationStatementDetails'
                    fhirVersion={ this.data.fhirVersion }
                    medicationStatement={ this.data.selectedMedicationStatement }
                    medicationStatementId={ this.data.selectedMedicationStatementId } 
                    showDatePicker={true} 
                  /> */}
              </TabPanel >
            </CardContent>
        </StyledCard>        
      </PageCanvas>
    );
  }
}

ReactMixin(MedicationStatementsPage.prototype, ReactMeteorData);

export default MedicationStatementsPage;