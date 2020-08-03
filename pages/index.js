import Layout from '../components/layout';

// game components
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';
import Controls from '../components/controls';
import {
  createMineSweeperState,
  areAllMinesFlagged
} from '../utils/minesweeper';

class Index extends React.Component {
  constructor(props) {
    super(props);
    const boardSize = 5;
    this.state = {
      gameBoard: createMineSweeperState(boardSize),
      gameSettings: {
        boardSize,
        authenticMode: false,
        difficulty: 'easy'
      }
    };
  }

  updateGameSetting(settings) {
    this.setState({
      gameSettings: settings,
      gameBoard: createMineSweeperState(settings.boardSize)
    });
  }

  reveal(event, cell, withRecursion = true) {
    // this if statement tries to mimic original minesweeper
    // in original minesweeper mines searched in the open reveal more then one game tile
    // in this version of the game open tiles that are reveal
    // all neighbors and neighbors neighbors specified by a depth
    // if (withRecursion && isOpenCell(cell, this.state.gameBoard)) {
    //   const neighborHood = getFrontierCells(cell, this.state.gameBoard, 2);
    //   neighborHood.forEach(n => this.reveal(event, n, false));
    // }

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
    if (areAllMinesFlagged(this.state.gameBoard)) {
      // render the winning information
      return <p>Game Over.</p>;
    }
    return (
      <Layout title={`Minesweeper (active)`}>
        <Desk boardSize={this.state.gameSettings.boardSize}>
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
        </Desk>
        <Controls submitForm={settings => this.updateGameSetting(settings)} />
      </Layout>
    );
  }
}

export default Index;
