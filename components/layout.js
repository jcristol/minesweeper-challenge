import Link from 'next/link';
import Head from 'next/head';
import { StyleProvider } from 'cf-style-nextjs';
import { createComponent } from 'cf-style-container';
import { checkMineSweeperWin } from '../utils/minesweeper';

const Center = createComponent(({ theme }) => ({
  margin: '0px auto',
  margin: theme.space[4]
}));

const EndGameComponent = ({ text, resetHandler }) => (
  <div style={{ marginBottom: '1rem' }}>
    <h1 style={{ margin: 0 }}>{text}</h1>
    <button onClick={resetHandler}>Play Again?</button>
  </div>
);

export default ({
  children,
  title = 'Minesweeper',
  gameBoard,
  gameOver,
  restartGameHandler
}) => (
  <StyleProvider>
    <Center>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <h1 style={{ marginRight: '4rem' }}>{title}</h1>
        {checkMineSweeperWin(gameBoard) && (
          <EndGameComponent
            text="You Won!!"
            resetHandler={restartGameHandler}
          />
        )}
        {gameOver && (
          <EndGameComponent
            text="You Lost!!"
            resetHandler={restartGameHandler}
          />
        )}
      </div>
      {children}
    </Center>
  </StyleProvider>
);
