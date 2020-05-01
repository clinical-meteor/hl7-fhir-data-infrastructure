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
  calcInnerCanvasHeight: function(headerHeight, footerHeight){
    if(!headerHeight){
      headerHeight = 64;
    }
    if(get(Meteor, 'settings.public.defaults.prominantHeader')){
      headerHeight = 128;
    }
    if(!footerHeight){
      footerHeight = 64;
    }
    
    let canvasHeight = 0;
    if(Meteor.isClient){
      canvasHeight = window.innerHeight - headerHeight - footerHeight;
    }

    // Should we also include the Meteor.isServer case?
    // How would this work as server-side rendering?  

    return canvasHeight;
  }
}

export default LayoutHelpers;