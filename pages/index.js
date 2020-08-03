import { generateMineSweeperBoard } from '../utils/minesweeper';
import Layout from '../components/layout';

// game components
import Desk from '../components/desk';
import Square from '../components/square';

const Index = () => (
  <Layout title={`Minesweeper (active)`}>
    <Desk boardSize={10}>
      {generateMineSweeperBoard(10).map(cell => (
        <Square
          key={cell.i}
          disabled={cell.i === 55 || cell.i === 10}
          isMined={cell.isMined}
          distance={cell.distance}
        />
      ))}
    </Desk>
  </Layout>
);

export default Index;
