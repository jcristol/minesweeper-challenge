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
  getFrontierCells,
  difficultyMap
} from '../utils/minesweeper';

const createGameState = options => {
  return {
    gameBoard: createMineSweeperState(options.boardSize, options.probability),
    ...options
  };
};

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = createGameState({
      boardSize: 5,
      probability: difficultyMap.easy.probability,
      authenticMode: false
    });
  }

  updateGameSetting(settings) {
    this.setState(
      createGameState({
        ...settings,
        boardSize: settings.boardSize || this.state.boardSize
      })
    );
  }

  reveal(event, cell, withRecursion = true) {
    if (cell.isMined) {
      this.setState({ gameOver: true });
      return;
    }

    if (
      this.state.authenticMode &&
      withRecursion &&
      isOpenCell(cell, this.state.gameBoard)
    ) {
      const neighborHood = getFrontierCells(cell, this.state.gameBoard, 2);
      neighborHood.forEach(n => this.reveal(event, n, false));
    }

    cell.isRevealed = true;
    this.setState({ gameBoard: this.state.gameBoard });
  }

  flag(event, cell) {
    if (!cell.isRevealed) {
      cell.isFlagged = !cell.isFlagged;
      this.setState({ gameBoard: this.state.gameBoard });
    }
    event.preventDefault();
  }

  render() {
    if (areAllMinesFlagged(this.state.gameBoard) || this.state.gameOver) {
      return this.state.gameOver ? <p>Game Over.</p> : <p>You Won!!!!</p>;
    }
    return (
      <Layout title={`Minesweeper (active)`}>
        <Desk boardSize={this.state.boardSize}>
          {this.state.gameBoard.map(row =>
            row.map(cell => (
              <Square
                key={cell.key}
                onClick={event => this.reveal(event, cell)}
                onContextMenu={event => this.flag(event, cell)}
              >
                {(cell.isRevealed || this.state.revealAllMode) &&
                  (cell.isMined ? <Mine /> : cell.distance)}
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
