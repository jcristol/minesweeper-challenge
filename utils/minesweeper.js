export function generateMineSweeperBoard(boardSize, mineProbability = 0.2) {
  const minedBoard = [...Array(boardSize).keys()].map(row => {
    return [...Array(boardSize).keys()].map(col => {
      const isMined = Math.random() < mineProbability;
      return {
        isMined,
        row,
        col
      };
    });
  });
  return minedBoard
    .map(row =>
      row.map(cell => {
        if (!cell.isMined) {
          return { ...cell, distance: calculateMineDistance(cell, minedBoard) };
        } else {
          return cell;
        }
      })
    )
    .flat()
    .map((cell, i) => ({ ...cell, i }));
}

function uniqueCellHash(cell) {
  return `[${cell.row}, ${cell.col}]`;
}

function findUnvisitedNeighbors(currentCell, board, visitedSet) {
  const isValidDirection = ([i, j]) => {
    if (board[i] && board[i][j]) {
      return true;
    }
    return false;
  };
  const directions = [
    [currentCell.row - 1, currentCell.col],
    [currentCell.row - 1, currentCell.col + 1],
    [currentCell.row - 1, currentCell.col - 1],
    [currentCell.row + 1, currentCell.col],
    [currentCell.row + 1, currentCell.col + 1],
    [currentCell.row + 1, currentCell.col - 1],
    [currentCell.row, currentCell.col + 1],
    [currentCell.row, currentCell.col - 1]
  ];
  return directions
    .filter(direction => isValidDirection(direction))
    .map(([i, j]) => board[i][j])
    .filter(cell => !visitedSet.has(uniqueCellHash(cell)));
}

function calculateMineDistance(currentCell, board, iterationLimit = 100) {
  const visitedSet = new Set();
  visitedSet.add(uniqueCellHash(currentCell));

  let distance = 0;
  let frontier = [currentCell];

  while (true && distance < iterationLimit) {
    if (frontier.some(cell => cell.isMined)) {
      return distance;
    }
    frontier.forEach(cell => visitedSet.add(uniqueCellHash(cell)));

    frontier = frontier
      .map(cell => findUnvisitedNeighbors(cell, board, visitedSet))
      .flat();
    distance += 1;
  }
  // should only hit this return zero if there aren't bombs on the field
  return 0;
}
