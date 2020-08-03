import Layout from '../components/layout';

// game components
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';
import Controls from '../components/controls';
import {
  createMineSweeperState,
  areAllMinesFlagged,
  isOpenCell,
  getFrontierCells
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
    const difficultMap = {
      easy: 0.1,
      medium: 0.2,
      hard: 0.3
    };

    this.setState({
      gameSettings: {
        boardSize: this.state.gameSettings.boardSize,
        ...settings
      },
      gameBoard: createMineSweeperState(
        settings.boardSize || this.state.gameSettings.boardSize,
        difficultMap[settings.difficulty]
      )
    });
  }

  reveal(event, cell, withRecursion = true) {
    if (
      this.state.gameSettings.authenticMode &&
      withRecursion &&
      isOpenCell(cell, this.state.gameBoard)
    ) {
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
