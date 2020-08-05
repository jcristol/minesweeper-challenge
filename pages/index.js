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
  checkMineSweeperWin,
  generateCellColor
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
  // i spent way to much time trying to sync server and client state here
  static getInitialProps = () => {
    return {
      initialGameState: createGameState({
        boardSize: 10,
        difficulty: difficultyMap.easy.text
      })
    };
  };

  constructor(props) {
    super(props);
    this.state = props.initialGameState;
  }

  updateGameSettings(settings) {
    if (settings.revealAll !== undefined) {
      this.setState({
        ...this.state,
        gameSettings: {
          ...this.state.gameSettings,
          ...settings
        }
      });
    } else {
      this.setState(
        createGameState({
          ...this.state.gameSettings,
          ...settings
        })
      );
    }
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

  flag(cell) {
    if (!cell.isRevealed) {
      cell.isFlagged = !cell.isFlagged;
      this.setState({ gameBoard: this.state.gameBoard });
    }
  }

  render() {
    const restartGameHandler = () =>
      this.updateGameSettings({ gameOver: false });
    const gameSettings = this.state.gameSettings;
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
          {...gameSettings}
          updateGameSettings={settings => this.updateGameSettings(settings)}
        />
        <Desk boardSize={gameSettings.boardSize}>
          {this.state.gameBoard.map(row =>
            row.map(cell => (
              <Square
                disabled={
                  (cell.isRevealed || gameSettings.revealAll) &&
                  (cell.isMined || cell.cellNumber === 0)
                }
                color={generateCellColor(cell.cellNumber)}
                key={cell.key}
                onClick={() => {
                  if (!this.state.gameSettings.revealAll) {
                    this.reveal(cell);
                  }
                }}
                onContextMenu={event => {
                  if (!this.state.gameSettings.revealAll) {
                    this.flag(cell);
                  }
                  event.preventDefault();
                }}
              >
                {(cell.isRevealed || gameSettings.revealAll) && (
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
