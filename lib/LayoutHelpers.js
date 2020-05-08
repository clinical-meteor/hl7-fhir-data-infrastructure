import { get, has } from 'lodash';

LayoutHelpers = {
  calcCardRowHeight: function(numberOfRows, rowSpacing){
    let cardRowHeight = 0;
    let fractionalRowHeight = 1;
    let innerCanvasHeight = 0;  

    let headerHeight = footerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader')){
      headerHeight = 128;
    }

    if(!rowSpacing){
      rowSpacing = 20;
    }

    if(numberOfRows > 0){
      fractionalRowHeight = 1 / numberOfRows;

      if(window.innerHeight > 0){
        innerCanvasHeight = LayoutHelpers.calcInnerCanvasHeight();

        cardRowHeight = ((innerCanvasHeight - ((numberOfRows + 1) * rowSpacing)) * fractionalRowHeight).toFixed(0);
      }       
    }
    return cardRowHeight;
  },
  calcCardRowContentHeight: function(numberOfRows, cardHeaderHeight, rowSpacing){    
    if(!cardHeaderHeight){
      cardHeaderHeight = 0;
    }
    if(!numberOfRows){
      numberOfRows = 1;
    }
    if(!rowSpacing){
      rowSpacing = 20;
    }
    let cardRowContentHeight = LayoutHelpers.calcCardRowHeight(numberOfRows, rowSpacing) - cardHeaderHeight;
    return cardRowContentHeight;
  },
  calcCardContentHeight: function(cardHeight){
    if(cardHeight > 40){
      return cardHeight - 40;
    }
  },
  calcHeaderHeight: function(){
    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader')){
      headerHeight = 128;
    }
    return headerHeight;
  },
  calcInnerCanvasHeight: function(headerHeight, footerHeight, innerHeight){
    if(!headerHeight){
      headerHeight = 64;
    }
    if(get(Meteor, 'settings.public.defaults.prominantHeader')){
      headerHeight = 128;
    }
    if(!footerHeight){
      footerHeight = 64;
    }

    if(!innerHeight){
      innerHeight = window.innerHeight;
    }
    
    let canvasHeight = 0;
    if(Meteor.isClient){
      canvasHeight = innerHeight - headerHeight - footerHeight;
    }

    // Should we also include the Meteor.isServer case?
    // How would this work as server-side rendering?  

    return canvasHeight;
  },
  calcTableRows: function(tableSize, innerHeight){
    let rowHeight = 52;
    if(tableSize === "small"){
      rowHeight = 33;
    }

    let innerCanvasHeight = LayoutHelpers.calcInnerCanvasHeight(null, null, innerHeight);
    let cardHeaderHeight = 64;
    let cardMargin = 20;
    let tableMargins = 60;
    let tableHeight = innerCanvasHeight - cardMargin - cardHeaderHeight - tableMargins;

    let numberOfRows = (tableHeight / rowHeight).toFixed(0);

    return numberOfRows;
  }
}

export default LayoutHelpers;





// TODO: Generalize the following code snippet, and determine an API
// that can be used across all the different resource types
// We want to be able to sort all columns in the other tables.
// However, they've now been converted to React pure components
// meaning they don't manage their own sorting now.
// That's now the responsibility if the containing Page object
// But it may give us the opportunity to add in column filter preferences

// LayoutHelpers.generateSortQuery()
// LayoutHelpers.sortAscending()
// LayoutHelpers.sort Descending()

// let options = {
//   sort: {}
// }

// if(props.sort){
//   if(Session.get('sortAscending')){
//     options.sort[this.props.sort] = 1;
//   } else {
//     options.sort[this.props.sort] = -1;
//   }
// } else {
//   // but we default to the date the questionnaire was authored on by default
//   options.sort = {};
//   if(Session.get('sortAscending')){
//     options.sort["authored"] = 1;
//   } else {
//     options.sort["authored"] = -1;
//   }
// }