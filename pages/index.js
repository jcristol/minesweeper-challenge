import Layout from '../components/layout';

// game components
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';
import Controls from '../components/controls';
import {
  createMineSweeperState,
  difficultyMap,
  revealAllNeighboringCells
} from '../utils/minesweeper';

const createGameState = options => {
  return {
    gameBoard: createMineSweeperState(options.boardSize, options.probability),
    ...options
  };
};

const EndGameComponent = ({ text, resetHandler }) => (
  <React.Fragment>
    <h1 style={{ marginLeft: '2rem' }}>{text}</h1>
    <button style={{ marginLeft: '2rem' }} onClick={resetHandler}>
      Play Again?
    </button>
  </React.Fragment>
);

const SquareContent = ({ isMined, cellNumber }) => {
  if (isMined) {
    return <Mine />;
  }
  return cellNumber === 0 ? null : cellNumber;
};

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = createGameState({
      boardSize: 10,
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

  reveal(cell, visitedSet = new Set()) {
    if (cell.cellNumber === 0) {
      revealAllNeighboringCells({
        cell,
        gameBoard: this.state.gameBoard,
        visitedSet,
        reveal: (cell, visitedSet) => this.reveal(cell, visitedSet)
      });
    }

    if (cell.isMined) {
      this.setState({ gameOver: true });
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
    return (
      <Layout title="Minesweeper">
        <Controls
          boardSize={this.state.boardSize}
          submitForm={settings => this.updateGameSetting(settings)}
        />
        <Desk boardSize={this.state.boardSize}>
          {this.state.gameBoard.map(row =>
            row.map(cell => (
              <Square
                disabled={
                  cell.isRevealed && (cell.isMined || cell.cellNumber === 0)
                }
                key={cell.key}
                onClick={() => this.reveal(cell)}
                onContextMenu={event => this.flag(event, cell)}
              >
                {(cell.isRevealed || this.state.revealAllMode) && (
                  <SquareContent {...cell} />
                )}
                {cell.isFlagged && <Flag />}
              </Square>
            ))
          )}
        </Desk>
      </Layout>
    );
  }
}

export default Index;
