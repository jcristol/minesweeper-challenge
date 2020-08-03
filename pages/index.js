import { generateMineSweeperBoard } from '../utils/minesweeper';
import Layout from '../components/layout';

// game components
import Desk from '../components/desk';
import Square from '../components/square';

const Index = () => (
  <Layout title={`Minesweeper (active)`}>
    <Desk boardSize={10} />
  </Layout>
);

export default Index;
