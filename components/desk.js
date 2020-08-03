import { createComponent } from 'cf-style-container';
import {
  generateMineSweeperBoard,
  openCell,
  collectNeighbors,
  allMinesFlagged
} from '../utils/minesweeper';
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
  }

  componentDidUpdate() {
    const { gameBoard } = this.state;
    if (allMinesFlagged(gameBoard) && !this.state.gameover) {
      this.setState({ ...this.state, gameover: true, status: 'win' });
    }
  }

  reveal(event, cell, withRecursion = true) {
    // this if statement tries to mimic original minesweeper
    // in original minesweeper mines searched in the open reveal more then one game tile
    // in this version of the game open tiles that are reveal
    // all neighbors and neighbors neighbors specified by a depth
    if (withRecursion && openCell(cell, this.state.gameBoard)) {
      const neighborHood = collectNeighbors(cell, this.state.gameBoard, 2);
      neighborHood.forEach(n => this.reveal(event, n, false));
    }

    // update the gameboard state for this cell
    cell.isRevealed = true;
    this.setState({ gameBoard: this.state.gameBoard });

    // if the cell is mined then trigger a game loss
    if (cell.isMined) {
      this.setState({ ...this.state, gameover: true, status: 'loss' });
    }
  }

  flag(event, cell) {
    if (!cell.isRevealed) {
      cell.isFlagged = !cell.isFlagged;
      this.setState({ gameBoard: this.state.gameBoard });
    }
    event.preventDefault();
  }

  render() {
    if (this.state.gameover) {
      if (this.state.status === 'loss') {
        return <p>Game Over</p>;
      } else {
        return <p>Congrats you won</p>;
      }
    }
    return (
      <PrimitiveDesk boardSize={this.props.boardSize}>
        {this.state.gameBoard.map(row =>
          row.map(cell => (
            <Square
              key={cell.key}
              onClick={event => this.reveal(event, cell)}
              onContextMenu={event => this.flag(event, cell)}
            >
              {cell.isRevealed && (cell.isMined ? <Mine /> : cell.distance)}
              {cell.isFlagged && <Flag />}
            </Square>
          ))
        )}
      </PrimitiveDesk>
    );
  }
}

export default Desk;
