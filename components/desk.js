import { createComponent } from 'cf-style-container';
import { generateMineSweeperBoard } from '../utils/minesweeper';
import Square from './square';
import Mine from './mine';
import Flag from './flag';

const PrimitiveDesk = createComponent(({ boardSize }) => ({
  width: 40 * boardSize + 2,
  height: 40 * boardSize + 2,
  border: `1px solid black`,
  display: 'flex',
  flexWrap: 'wrap'
}));

class Desk extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameBoard: generateMineSweeperBoard(props.boardSize)
    };
    this.flag = this.flag.bind(this);
    this.reveal = this.reveal.bind(this);
  }

  reveal(event, { i }) {
    this.state.gameBoard[i].isRevealed = true;
    this.setState({ gameBoard: this.state.gameBoard });
    event.preventDefault();
  }

  flag(event, { isRevealed, isFlagged, i }) {
    if (!isRevealed) {
      this.state.gameBoard[i].isFlagged = !isFlagged;
      this.setState({ gameBoard: this.state.gameBoard });
    }
    event.preventDefault();
  }

  render() {
    return (
      <PrimitiveDesk boardSize={this.props.boardSize}>
        {this.state.gameBoard.map(cell => (
          <Square
            key={cell.i}
            onClick={event => this.reveal(event, cell)}
            onContextMenu={event => this.flag(event, cell)}
          >
            {cell.isRevealed && (cell.isMined ? <Mine /> : cell.distance)}
            {cell.isFlagged && <Flag />}
          </Square>
        ))}
      </PrimitiveDesk>
    );
  }
}

export default Desk;
