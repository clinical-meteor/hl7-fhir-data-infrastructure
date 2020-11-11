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
import LayoutHelpers from '../../lib/LayoutHelpers';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React  from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
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
      selectedMedicationStatement: false,
      medicationStatements: MedicationStatements.find().fetch(),
      medicationStatementsCount: MedicationStatements.find().count()
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

    let headerHeight = LayoutHelpers.calcHeaderHeight();
    let formFactor = LayoutHelpers.determineFormFactor();

    let paddingWidth = 84;
    if(Meteor.isCordova){
      paddingWidth = 20;
    }
    let cardWidth = window.innerWidth - paddingWidth;

    return (
      <PageCanvas id="medicationStatementsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
        <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
            <CardHeader title={this.data.medicationStatementsCount + ' Medication Statements'} />
            <CardContent>
              <MedicationStatementsTable 
                fhirVersion={ this.data.fhirVersion } 
                medicationStatements={this.data.medicationStatements} 
                count={this.data.medicationStatementsCount}
                rowsPerPage={20}
                medicationsCursor={Medications}
              />

              {/* <MedicationStatementDetail 
                id='medicationStatementDetails'
                fhirVersion={ this.data.fhirVersion }
                medicationStatement={ this.data.selectedMedicationStatement }
                medicationStatementId={ this.data.selectedMedicationStatementId } 
                showDatePicker={true} 
              /> */}

            </CardContent>
        </StyledCard>        
      </PageCanvas>
    );
  }
}

ReactMixin(MedicationStatementsPage.prototype, ReactMeteorData);

export default MedicationStatementsPage;