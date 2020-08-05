export const difficultyMap = {
  easy: {
    text: 'easy',
    probability: 0.1
  },
  medium: {
    text: 'medium',
    probability: 0.2
  },
  hard: {
    text: 'hard',
    probability: 0.3
  }
};

/**
 * This function generates a 2D array of minesweeper cells
 * it is used by the Desk component as the state backing the minesweeper game
 * @param {*} boardSize the length and width of the minesweeper board
 * @param {*} mineProbability the probability from 0 - 1 of a cell having a mine in it
 */
export function createMineSweeperState(boardSize, mineProbability = 0.1) {
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
        : {
            ...cell,
            cellNumber: countAdjacentMines(cell, minedBoard)
          }
    );
  });
}

/**
 * return true if you have won the game
 * this is a win condition for minesweeper
 * @param {*} board the 2D array containing the data for a minesweeper board
 */
export function checkMineSweeperWin(board) {
  const areAllMinesFlagged = board
    .flat()
    .filter(cell => cell.isMined)
    .every(cell => cell.isFlagged);

  const areAllFlagsOnAMine = board
    .flat()
    .filter(cell => cell.isFlagged)
    .every(cell => cell.isMined);
  return areAllMinesFlagged && areAllFlagsOnAMine;
}

/**
 * reliable hashing function for a cell for use with Sets and Maps
 * @param {*} cell the cell to hash
 */
export function hashCell(cell) {
  return `[${cell.row}, ${cell.col}]`;
}

export function getUnvisitedNeighbors(cell, board, visitedSet) {
  const neighbors = getNeighboringCells(cell, board);
  return neighbors.filter(neighbor => !visitedSet.has(hashCell(neighbor)));
}

/**
 * gets the cells neighbors
 * @param {*} currentCell the cell to use when finding neighboring cells
 * @param {*} board the 2D array containing the data for a minesweeper board
 */
function getNeighboringCells(cell, board) {
  const isValidDirection = ([i, j]) => {
    if (board[i] && board[i][j]) {
      return true;
    }
    return false;
  };
  const directions = [
    [cell.row - 1, cell.col],
    [cell.row - 1, cell.col + 1],
    [cell.row - 1, cell.col - 1],
    [cell.row + 1, cell.col],
    [cell.row + 1, cell.col + 1],
    [cell.row + 1, cell.col - 1],
    [cell.row, cell.col + 1],
    [cell.row, cell.col - 1]
  ];
  return directions
    .filter(direction => isValidDirection(direction))
    .map(([i, j]) => board[i][j]);
}

function countAdjacentMines(cell, board) {
  return getNeighboringCells(cell, board).reduce(
    (acc, cell) => (cell.isMined ? acc + 1 : acc),
    0
  );
}
