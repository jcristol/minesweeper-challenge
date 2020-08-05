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
  getUnvisitedNeighbors,
  hashCell
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
      visitedSet.add(hashCell(cell));
      getUnvisitedNeighbors(cell, this.state.gameBoard, visitedSet)
        .filter(neighbor => !neighbor.isMined)
        .forEach(neighbor => {
          visitedSet.add(hashCell(neighbor));
          this.reveal(neighbor, visitedSet);
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
    // if (checkMineSweeperWin(this.state.gameBoard) || this.state.gameOver) {
    //   const resetHandler = () =>
    //     this.setState(
    //       createGameState({
    //         boardSize: 5,
    //         probability: difficultyMap.easy.probability,
    //         authenticMode: false,
    //         gameOver: false
    //       })
    //     );

    //   return this.state.gameOver ? (
    //     <EndGameComponent text="You Lost!" resetHandler={resetHandler} />
    //   ) : (
    //     <EndGameComponent text="You Won!" resetHandler={resetHandler} />
    //   );
    // }
    return (
      <Layout title="Minesweeper">
        <Desk boardSize={this.state.boardSize}>
          {this.state.gameBoard.map(row =>
            row.map(cell => {
              return (
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
              );
            })
          )}
        </Desk>
        <Controls submitForm={settings => this.updateGameSetting(settings)} />
      </Layout>
    );
  }
}

export default Index;
