import { 
  Card,
  CardHeader,
  CardContent,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';
import { StyledCard, PageCanvas } from 'material-fhir-ui';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

// import CarePlanDetail from './CarePlanDetail';
import CarePlansTable from './CarePlansTable';

import LayoutHelpers from '../../lib/LayoutHelpers';

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


export class CarePlansPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('carePlanPageTabIndex'),
      carePlanSearchFilter: Session.get('carePlanSearchFilter'),
      currentCarePlan: Session.get('selectedCarePlan'),
      carePlans: CarePlans.find().fetch(),
      carePlansCount: CarePlans.find().count()
    };

    // data.style = Glass.blur(data.style);
    // data.style.appbar = Glass.darkroom(data.style.appbar);
    // data.style.tab = Glass.darkroom(data.style.tab);

    return data;
  }

  handleTabChange(index){
    Session.set('carePlanPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedCarePlan', false);
    Session.set('carePlanUpsert', false);
  }

  render() {
    if(process.env.NODE_ENV === "test") console.log('In CarePlansPage render');


    let headerHeight = LayoutHelpers.calcHeaderHeight();
    let formFactor = LayoutHelpers.determineFormFactor();

    let paddingWidth = 84;
    if(Meteor.isCordova){
      paddingWidth = 20;
    }
    let cardWidth = window.innerWidth - paddingWidth;


    return (
      <PageCanvas id='carePlansPage' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
        <StyledCard height='auto' width={cardWidth + 'px'} margin={20} >
          <CardHeader title={this.data.carePlansCount + ' CarePlans'} />
          <CardContent>
            <CarePlansTable 
              carePlans={this.data.carePlans}
              count={this.data.carePlansCount}
              formFactorLayout={formFactor}
            />
          </CardContent>
        </StyledCard>
      </PageCanvas>
    );
  }
}

ReactMixin(CarePlansPage.prototype, ReactMeteorData);

export default CarePlansPage;