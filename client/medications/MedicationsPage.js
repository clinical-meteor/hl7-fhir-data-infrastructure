import { 
  Card,
  CardHeader,
  CardContent,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';
import { StyledCard, PageCanvas, DynamicSpacer } from 'material-fhir-ui';

import React  from 'react';
import ReactMixin  from 'react-mixin';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import MedicationDetail from './MedicationDetail';
import MedicationsTable from './MedicationsTable';

// import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';


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
Session.setDefault('medicationPageTabIndex', 1);
Session.setDefault('medicationSearchFilter', ''); 
Session.setDefault('selectedMedicationId', false);

export class MedicationsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('medicationPageTabIndex'),
      medicationSearchFilter: Session.get('medicationSearchFilter'),
      selectedMedicationId: Session.get('selectedMedicationId'),
      fhirVersion: Session.get('fhirVersion'),
      selectedMedication: false
    }; 

    if (Session.get('selectedMedicationId')){
      data.selectedMedication = Medications.findOne({_id: Session.get('selectedMedicationId')});
    } else {
      data.selectedMedication = false;
    }

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    if(process.env.NODE_ENV === "test") console.log("MedicationsPage[data]", data);
    return data;
  }

  handleTabChange(index){
    Session.set('medicationPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedMedicationId', false);
    Session.set('medicationUpsert', false);
  }

  render() {

    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader')){
      headerHeight = 128;
    }

    return (
      <div id="medicationsPage">
        <StyledCard height="auto" scrollable={true} margin={20} headerHeight={headerHeight} >
            <CardHeader
              title="Medications"
            />
            <CardContent>
              <Tabs id="medicationsPageTabs" value={this.data.tabIndex} onChange={this.handleTabChange } aria-label="simple tabs example">
                <Tab label="Medications" value={0} />
                <Tab label="New" value={1} />
              </Tabs>
              <TabPanel >
                <MedicationsTable />
              </TabPanel>
              <TabPanel >
                <MedicationDetail 
                  id='medicationDetails'
                  fhirVersion={ this.data.fhirVersion }
                  medication={ this.data.selectedMedication }
                  medicationId={ this.data.selectedMedicationId }
                  hideCode={false} 
                  />  
              </TabPanel>              
            </CardContent>
          </StyledCard>
      </div>
    );
  }
}

ReactMixin(MedicationsPage.prototype, ReactMeteorData);

export default MedicationsPage;