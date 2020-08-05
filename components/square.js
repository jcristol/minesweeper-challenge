import React from 'react';
import { createComponent } from 'cf-style-container';

const Square = createComponent(
  ({ disabled, color }) => ({
    width: 40,
    height: 40,
    padding: 10,
    cursor: disabled ? 'initial' : 'pointer',
    backgroundColor: disabled ? '#CCC' : '#FFF',
    border: `1px solid black`,
    lineHeight: 1,
    textAlign: 'center',
    fontSize: 18,
    color
  }),
  'div',
  ['onClick', 'onContextMenu']
);

export default Square;
