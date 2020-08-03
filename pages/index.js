import { generateMineSweeperBoard } from '../utils/minesweeper';
import Layout from '../components/layout';

// game components
import Desk from '../components/desk';

const Index = () => (
  <Layout title={`Minesweeper (active)`}>
    <Desk boardSize={3} />
  </Layout>
);

export default Index;
