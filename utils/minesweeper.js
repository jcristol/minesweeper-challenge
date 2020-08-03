export function generateMineSweeperBoard(boardSize, mineProbability = 0.2) {
  const minedBoard = [...Array(boardSize).keys()].map(row => {
    return [...Array(boardSize).keys()].map(col => ({
      isRevealed: false,
      isFlagged: false,
      isMined: Math.random() < mineProbability,
      row,
      col,
      key: `${row}, ${col}`
    }));
  });
  return minedBoard.map(row => {
    return row.map(cell =>
      cell.isMined
        ? cell
        : { ...cell, distance: calculateMineDistance(cell, minedBoard) }
    );
  });
}

export function allMinesFlagged(board) {
  return board
    .flat()
    .filter(cell => cell.isMined)
    .every(cell => cell.isFlagged);
}

export function collectNeighbors(cell, board, depth) {
  let frontier = [cell];
  const visitedSet = new Set();
  const neighbors = [];

  while (depth > 0) {
    depth -= 1;
    frontier.forEach(currentCell =>
      visitedSet.add(uniqueCellHash(currentCell))
    );

    frontier = frontier
      .map(currentCell =>
        findUnvisitedNeighbors(currentCell, board, visitedSet)
      )
      .flat();
    neighbors.push(frontier);
  }
  return neighbors.flat().filter(n => !n.isMined);
}

export function openCell(cell, board) {
  const visitedSet = new Set();
  visitedSet.add(uniqueCellHash(cell));
  const neighbors = findUnvisitedNeighbors(cell, board, visitedSet);
  return neighbors.every(c => !c.isRevealed);
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
