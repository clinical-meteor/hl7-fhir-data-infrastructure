import { 
  CardHeader,
  CardContent,
  Grid
} from '@material-ui/core';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React  from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import ValueSetDetail from './ValueSetDetail';
import ValueSetsTable from './ValueSetsTable';

import LayoutHelpers from '../../lib/LayoutHelpers';
import FhirUtilities from '../../lib/FhirUtilities';
import { flattenProcedure } from '../../lib/FhirDehydrator';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

import { get } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

Session.setDefault('valueSetPageTabIndex', 0);
Session.setDefault('valueSetSearchFilter', '');
Session.setDefault('selectedValueSetId', '');
Session.setDefault('selectedValueSet', '');
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('valueSetsArray', []);
Session.setDefault('ValueSetsPage.onePageLayout', true)

// Global Theming 
  // This is necessary for the Material UI component render layer
  let theme = {
    primaryColor: "rgb(108, 183, 110)",
    primaryText: "rgba(255, 255, 255, 1) !important",

    secondaryColor: "rgb(108, 183, 110)",
    secondaryText: "rgba(255, 255, 255, 1) !important",

    cardColor: "rgba(255, 255, 255, 1) !important",
    cardTextColor: "rgba(0, 0, 0, 1) !important",

    errorColor: "rgb(128,20,60) !important",
    errorText: "#ffffff !important",

    appBarColor: "#f5f5f5 !important",
    appBarTextColor: "rgba(0, 0, 0, 1) !important",

    paperColor: "#f5f5f5 !important",
    paperTextColor: "rgba(0, 0, 0, 1) !important",

    backgroundCanvas: "rgba(255, 255, 255, 1) !important",
    background: "linear-gradient(45deg, rgb(108, 183, 110) 30%, rgb(150, 202, 144) 90%)",

    nivoTheme: "greens"
  }

  // if we have a globally defined theme from a settings file
  if(get(Meteor, 'settings.public.theme.palette')){
    theme = Object.assign(theme, get(Meteor, 'settings.public.theme.palette'));
  }

  const muiTheme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        main: theme.primaryColor,
        contrastText: theme.primaryText
      },
      secondary: {
        main: theme.secondaryColor,
        contrastText: theme.errorText
      },
      appBar: {
        main: theme.appBarColor,
        contrastText: theme.appBarTextColor
      },
      cards: {
        main: theme.cardColor,
        contrastText: theme.cardTextColor
      },
      paper: {
        main: theme.paperColor,
        contrastText: theme.paperTextColor
      },
      error: {
        main: theme.errorColor,
        contrastText: theme.secondaryText
      },
      background: {
        default: theme.backgroundCanvas
      },
      contrastThreshold: 3,
      tonalOffset: 0.2
    }
  });

// const StyledCard = styled(Card)`
//   background: ` + theme.paperColor + `;
//   border-radius: 3px;
//   border: 0;
//   color: ` + theme.paperTextColor + `;
//   height: 48px;
//   padding: 0 30px;
//   box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
// `;


//===========================================================================
// MAIN COMPONENT  

export function ValueSetsPage(props){

  let data = {
    selectedValueSetId: '',
    selectedValueSet: null,
    valueSets: [],
    onePageLayout: true,
    valueSetSearchFilter: '',
    appHeight: window.innerHeight
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('ValueSetsPage.onePageLayout');
  }, [])
  data.selectedValueSetId = useTracker(function(){
    return Session.get('selectedValueSetId');
  }, [])
  data.selectedValueSet = useTracker(function(){
    return ValueSets.findOne({id: Session.get('selectedValueSetId')});
  }, [])
  data.valueSets = useTracker(function(){
    return ValueSets.find().fetch();
  }, [])
  data.valueSetSearchFilter = useTracker(function(){
    return Session.get('valueSetSearchFilter')
  }, [])
  data.appHeight = useTracker(function(){
    return Session.get('appHeight')
  }, [props.lastUpdated])

  function handleRowClick(valueSetId){
    console.log('ValueSetsPage.handleRowClick', valueSetId)
    let valueSet = ValueSets.findOne({id: valueSetId});
    if(valueSet){
      Session.set('selectedValueSetId', get(valueSet, 'id'));
      Session.set('selectedValueSet', valueSet);  
    }
  }

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor(2);
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let cardWidth = window.innerWidth - paddingWidth;


  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
      <CardHeader title={data.valueSets.length + " ValueSets"} />
      <CardContent>

        <ValueSetsTable 
          valueSets={ data.valueSets }
          formFactorLayout={formFactor} 
          count={data.valueSets.length}
          rowsPerPage={LayoutHelpers.calcTableRows()}  
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
      <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
          <CardHeader title={data.valueSets.length + " Value Sets"} />
          <CardContent>
            <ValueSetsTable 
              valueSets={ data.valueSets }
              selectedValueSetId={ data.selectedValueSetId }
              formFactorLayout={formFactor}         
              onRowClick={ handleRowClick.bind(this) }
              count={data.valueSets.length}
              rowsPerPage={ LayoutHelpers.calcTableRows("medium",  data.appHeight) }
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={5}>
      <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedValueSetId }</h1>
          {/* <CardHeader title={data.selectedValueSetId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <ValueSetDetail 
                id='valueSetDetails' 
                displayDatePicker={true} 
                displayBarcodes={false}
                valueSet={ data.selectedValueSet }
                valueSetId={ data.selectedValueSetId } 
                showValueSetInputs={true}
                showHints={false}
              />
            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  }

  return (
    <PageCanvas id="valueSetsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}



export default ValueSetsPage;