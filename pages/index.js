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
  revealAllNeighboringCells,
  checkMineSweeperWin
} from '../utils/minesweeper';

const createGameState = gameSettings => {
  const { boardSize, difficulty, gameOver } = gameSettings;
  return {
    gameBoard: createMineSweeperState(
      boardSize,
      difficultyMap[difficulty].probability
    ),
    gameSettings,
    gameOver
  };
};

const EndGameComponent = ({ text, resetHandler }) => (
  <div style={{ marginBottom: '1rem' }}>
    <h1 style={{ margin: 0 }}>{text}</h1>
    <button onClick={resetHandler}>Play Again?</button>
  </div>
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
      difficulty: difficultyMap.easy.text,
      authenticMode: false
    });
  }

  updateGameSettings(settings) {
    this.setState(
      createGameState({
        ...this.state.gameSettings,
        ...settings
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

    if (cell.isFlagged) {
      cell.isFlagged = false;
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
    const restartGameHandler = () =>
      this.updateGameSettings({ gameOver: false });
    return (
      <Layout title="Minesweeper">
        {checkMineSweeperWin(this.state.gameBoard) && (
          <EndGameComponent
            text="You Won!!"
            resetHandler={restartGameHandler}
          />
        )}
        {this.state.gameOver && (
          <EndGameComponent
            text="You Lost!!"
            resetHandler={restartGameHandler}
          />
        )}
        <Controls
          gameSettings={this.state.gameSettings}
          updateGameSettings={settings => this.updateGameSettings(settings)}
        />
        <Desk boardSize={this.state.gameSettings.boardSize}>
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
                {(cell.isRevealed || this.state.gameSettings.revealAllMode) && (
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
