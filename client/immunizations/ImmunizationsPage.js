import { 
  Grid,
  Card,
  Button,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  TextField,
  DatePicker,
  Tab, 
  Tabs
} from '@material-ui/core';


import ImmunizationDetail from './ImmunizationDetail';
import ImmunizationsTable from './ImmunizationsTable';

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

export class ImmunizationsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('immunizationPageTabIndex'),
      immunizationSearchFilter: Session.get('immunizationSearchFilter'),
      selectedImmunizationId: Session.get('selectedImmunizationId'),
      fhirVersion: Session.get('fhirVersion'),
      selectedImmunization: false
    };

    if (Session.get('selectedImmunizationId')){
      data.selectedImmunization = Immunizations.findOne({_id: Session.get('selectedImmunizationId')});
    } else {
      data.selectedImmunization = false;
    }

    // data.style = Glass.blur(data.style);
    // data.style.appbar = Glass.darkroom(data.style.appbar);
    // data.style.tab = Glass.darkroom(data.style.tab);

    return data;
  }

  handleTabChange(index){
    Session.set('immunizationPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedImmunizationId', false);
    Session.set('immunizationUpsert', false);
  }

  render() {
    if(process.env.NODE_ENV === "test") console.log('ImmunizationsPage.render()', this.data);

    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader')){
      headerHeight = 128;
    }
    
    return (
      <div id='immunizationsPage'>
        <StyledCard height="auto" scrollable={true} margin={20} headerHeight={headerHeight} >
            <CardHeader title='Immunizations' />
            <CardContent>

            <Tabs id="immunizationsPageTabs" value={this.data.tabIndex} onChange={this.handleTabChange } aria-label="simple tabs example">
                <Tab label="Immunizations" value={0} />
                <Tab label="Edit" value={1} />
              </Tabs>
              <TabPanel className="immunizationListTab"  >
                <ImmunizationsTable 
                    displayDates={true}
                  />
              </TabPanel >
              <TabPanel className="immunizationDetailsTab" >
                <ImmunizationDetail 
                  id='immunizationDetails' 
                  fhirVersion={ this.data.fhirVersion }
                  immunization={ this.data.selectedImmunization }
                  immunizationId={ this.data.selectedImmunizationId }
                  showDatePicker={true} 
                  />
              </TabPanel>
            </CardContent>
        </StyledCard>
      </div>
    );
  }
}

ReactMixin(ImmunizationsPage.prototype, ReactMeteorData);
export default ImmunizationsPage;