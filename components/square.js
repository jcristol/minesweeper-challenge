import React from 'react';
import { createComponent } from 'cf-style-container';

const PrimitiveSquare = createComponent(
  ({ disabled }) => ({
    width: 40,
    height: 40,
    padding: 10,
    cursor: disabled ? 'initial' : 'pointer',
    backgroundColor: disabled ? '#CCC' : '#FFF',
    border: `1px solid black`,
    lineHeight: 1,
    textAlign: 'center',
    fontSize: 18
  }),
  'div',
  ['onClick', 'onContextMenu']
);

class Square extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <PrimitiveSquare>{this.props.children}</PrimitiveSquare>;
  }
}

export default Square;
