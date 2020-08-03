import { createComponent } from 'cf-style-container';
import {
  createMineSweeperState,
  isOpenCell,
  getFrontierCells,
  areAllMinesFlagged
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
    const boardSize = 5;
    this.state = {
      gameBoard: createMineSweeperState(boardSize),
      boardSize
    };
  }

  componentDidUpdate() {
    const { gameBoard } = this.state;
    if (areAllMinesFlagged(gameBoard) && !this.state.gameover) {
      this.setState({ ...this.state, gameover: true, status: 'win' });
    }
  }

  reveal(event, cell, withRecursion = true) {
    // this if statement tries to mimic original minesweeper
    // in original minesweeper mines searched in the open reveal more then one game tile
    // in this version of the game open tiles that are reveal
    // all neighbors and neighbors neighbors specified by a depth
    if (withRecursion && isOpenCell(cell, this.state.gameBoard)) {
      const neighborHood = getFrontierCells(cell, this.state.gameBoard, 2);
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

  updateBoardSize(newBoardSize) {
    this.setState({
      gameBoard: createMineSweeperState(newBoardSize),
      boardSize: newBoardSize
    });
  }

  // toggleAuthenticMode() {
  //   this.setState({
  //     authMode: true
  //   });
  // }

  selectDifficulty() {
    this.setState({
      gameBoard: createMineSweeperState(this.boardSize, 0.1)
    });
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
      <React.Fragment>
        <PrimitiveDesk boardSize={this.state.boardSize}>
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
        <div style={{ paddingTop: '4rem', display: 'flex', flexWrap: 'wrap' }}>
          <div style={{ width: '20rem', padding: '2rem' }}>
            <h2>Size of Board</h2>
            <input
              onChange={event => this.updateBoardSize(event.target.value)}
            />
          </div>
          <div
            style={{
              width: '20rem',
              padding: '2rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <h2 style={{ paddingRight: '1rem' }}>Authentic Mode</h2>
            <input type="checkbox" onChange={() => this.toggleAuthenticMode} />
          </div>
          <div
            style={{
              width: '20rem',
              padding: '2rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <h2 style={{ paddingRight: '1rem' }}>Difficulty</h2>
            <select onChange={() => this.changeDifficulty}>
              <option>easy</option>
              <option>medium</option>
              <option>hard</option>
            </select>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Desk;
