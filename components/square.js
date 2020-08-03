import React from 'react';
import { createComponent } from 'cf-style-container';
import Mine from './mine';
import Flag from './flag';

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
    this.state = {
      isRevealed: false,
      isFlagged: false
    };
  }

  flagHandler(event) {
    if (!this.state.isRevealed) {
      this.setState(state => ({ ...state, isFlagged: !state.isFlagged }));
    }
    event.preventDefault();
  }

  revealHandler(event) {
    this.setState(state => ({ ...state, isRevealed: true }));
    event.preventDefault();
  }

  render() {
    return (
      <PrimitiveSquare
        onClick={event => this.revealHandler(event)}
        onContextMenu={event => this.flagHandler(event)}
      >
        {this.state.isRevealed &&
          (this.props.isMined ? <Mine /> : this.props.distance)}
        {this.state.isFlagged && <Flag />}
      </PrimitiveSquare>
    );
  }
}

export default Square;
