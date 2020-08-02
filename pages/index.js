import { generateMineSweeperBoard } from '../utils/minesweeper';
import Layout from '../components/layout';

// game components
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';

const Index = () => (
  <Layout title={`Minesweeper (active)`}>
    <Desk boardSize={10}>
      {generateMineSweeperBoard(10).map(cell => (
        <Square key={cell.i} disabled={cell.i === 55 || cell.i === 10}>
          {cell.isMined && <Mine />}
          {/* {cell.isFlagged === 25 && <Flag />} */}
          {cell.distance && `${cell.distance}`}
        </Square>
      ))}
    </Desk>
  </Layout>
);

export default Index;
