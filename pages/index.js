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

const SquareContent = ({ isMined, cellNumber }) => {
  if (isMined) {
    return <Mine />;
  }
  return cellNumber === 0 ? null : cellNumber;
};

const canFlagOrRevealTile = (state, cell) =>
  state.gameSettings.revealAll || cell.isRevealed ? false : true;

class Index extends React.Component {
  // this ensures that the client and server side render generate the same minesweeper board
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
    cell.isFlagged = !cell.isFlagged;
    this.setState({ gameBoard: this.state.gameBoard });
  }

  render() {
    const { boardSize, revealAll } = this.state.gameSettings;
    const { gameBoard, gameOver } = this.state;

    return (
      <Layout
        title="Minesweeper"
        gameBoard={gameBoard}
        gameOver={gameOver}
        restartGameHandler={() => this.updateGameSettings({ gameOver: false })}
      >
        <Controls
          {...this.state.gameSettings}
          updateGameSettings={settings => this.updateGameSettings(settings)}
        />
        <Desk boardSize={boardSize}>
          {gameBoard.map(row =>
            row.map(cell => (
              <Square
                disabled={
                  (cell.isRevealed || revealAll) &&
                  (cell.isMined || cell.cellNumber === 0)
                }
                color={generateCellColor(cell.cellNumber)}
                key={cell.key}
                onClick={() => {
                  if (canFlagOrRevealTile(this.state, cell)) {
                    this.reveal(cell);
                  }
                }}
                onContextMenu={event => {
                  if (canFlagOrRevealTile(this.state, cell)) {
                    this.flag(cell);
                  }
                  // prevent the context menu from popping up
                  event.preventDefault();
                }}
              >
                {(cell.isRevealed || revealAll) && <SquareContent {...cell} />}
                {!revealAll && cell.isFlagged && <Flag />}
              </Square>
            ))
          )}
        </Desk>
      </Layout>
    );
  }
}

export default Index;
