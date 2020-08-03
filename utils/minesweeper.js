/**
 * This function generates a 2D array of minesweeper cells
 * it is used by the Desk component as the state backing the minesweeper game
 * @param {*} boardSize the length and width of the minesweeper board
 * @param {*} mineProbability the probability from 0 - 1 of a cell having a mine in it
 */
export function createMineSweeperState(boardSize, mineProbability = 0.2) {
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
        : { ...cell, distance: getDistanceToNearestMine(cell, minedBoard) }
    );
  });
}

/**
 * return true if all cells with mines have a flag
 * this is a win condition for minesweeper
 * @param {*} board the 2D array containing the data for a minesweeper board
 */
export function areAllMinesFlagged(board) {
  return board
    .flat()
    .filter(cell => cell.isMined)
    .every(cell => cell.isFlagged);
}

/**
 * this function gets neighbors of a cell on the board in a breadth first manner
 * it returns a list of all neighbors to a cell and the neighbors neighbors
 * this function is useful when mimicing minesweeper behavior on windows
 * @param {*} cell the cell to start the search for frontier cells
 * @param {*} board the 2D array containing the data for a minesweeper board
 * @param {*} depth the number of levels the search with go down
 */
export function getFrontierCells(cell, board, depth) {
  let frontier = [cell];
  const visitedSet = new Set();
  const neighbors = [];

  while (depth > 0) {
    depth -= 1;
    frontier.forEach(currentCell => visitedSet.add(hashCell(currentCell)));

    frontier = frontier
      .map(currentCell => getNeighboringCells(currentCell, board, visitedSet))
      .flat();
    neighbors.push(frontier);
  }
  return neighbors.flat().filter(n => !n.isMined);
}

/**
 * determines whether a cell has any neighbors that have been revealed
 * @param {*} cell the cell to check
 * @param {*} board the 2D array containing the data for a minesweeper board
 */
export function isOpenCell(cell, board) {
  const visitedSet = new Set();
  visitedSet.add(hashCell(cell));
  const neighbors = getNeighboringCells(cell, board, visitedSet);
  return neighbors.every(c => !c.isRevealed);
}

/**
 * reliable hashing function for a cell for use with Sets and Maps
 * @param {*} cell the cell to hash
 */
function hashCell(cell) {
  return `[${cell.row}, ${cell.col}]`;
}

/**
 * gets the unvisited neighbors of a cell
 * @param {*} currentCell the cell to use when finding neighboring cells
 * @param {*} board the 2D array containing the data for a minesweeper board
 * @param {*} visitedSet a set to keep track of which cells have already been visited
 */
function getNeighboringCells(currentCell, board, visitedSet) {
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
    .filter(cell => !visitedSet.has(hashCell(cell)));
}

/**
 * calculates the nearest distance from a cell to a mine
 * @param {*} currentCell the cell to calculate the nearest distance to a mine
 * @param {*} board the 2D array containing the data for a minesweeper board
 * @param {*} iterationLimit a limit on iterations in case there aren't any bombs on the board
 */
function getDistanceToNearestMine(currentCell, board, iterationLimit = 100) {
  const visitedSet = new Set();
  visitedSet.add(hashCell(currentCell));

  let distance = 0;
  let frontier = [currentCell];

  while (true && distance < iterationLimit) {
    if (frontier.some(cell => cell.isMined)) {
      return distance;
    }
    frontier.forEach(cell => visitedSet.add(hashCell(cell)));

    frontier = frontier
      .map(cell => getNeighboringCells(cell, board, visitedSet))
      .flat();
    distance += 1;
  }
  // should only hit this return zero if there aren't bombs on the field
  return 0;
}
