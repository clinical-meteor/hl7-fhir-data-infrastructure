

import React, { useState } from 'react';
import PropTypes from 'prop-types';

export function DynamicSpacer(props){

  const {children, height, ...otherProps} = props;

  let spacerHeight = '20px'  
  if(height > 0){
    spacerHeight = height + 'px';
  }

  return(<div className="dynamicSpacer" style={{ height: spacerHeight }}></div>)
}

export default DynamicSpacer;