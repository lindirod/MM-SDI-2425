let board;
let gridSize = 300; // Grid of the game
let cellSize;

function initBoard() {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
}

function drawBoard(offsetX, offsetY) {
  strokeWeight(4);
  cellSize = gridSize / 3;
  for (let i = 1; i < 3; i++) {
    line(offsetX + i * cellSize, offsetY, offsetX + i * cellSize, offsetY + gridSize);
    line(offsetX, offsetY + i * cellSize, offsetX + gridSize, offsetY + i * cellSize);
  }
}

function checkMove(x, y, offsetX, offsetY) {
  let row = floor((y - offsetY) / cellSize);
  let col = floor((x - offsetX) / cellSize);

  if (row >= 0 && col >= 0 && row < 3 && col < 3 && board[row][col] === '') {
    board[row][col] = currentPlayer;
    winner = getWinner(board);
    if (winner !== null) {
      gameOver = true;
    } else {
      currentPlayer = 'O';
      makeAIMove();
    }
  }
}

function drawMarks(offsetX, offsetY) {
  textSize(64);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let mark = board[i][j];
      let x = offsetX + j * cellSize + cellSize / 2;
      let y = offsetY + i * cellSize + cellSize / 2;
      text(mark, x, y);
    }
  }
}

function getWinner(board) {
  let vals = ['X', 'O'];
  for (let k = 0; k < vals.length; k++) {
    let value = vals[k];
    for (let i = 0; i < 3; i++) {
      if (board[i][0] === value && board[i][1] === value && board[i][2] === value) return value;
      if (board[0][i] === value && board[1][i] === value && board[2][i] === value) return value;
    }
    if (board[0][0] === value && board[1][1] === value && board[2][2] === value) return value;
    if (board[0][2] === value && board[1][1] === value && board[2][0] === value) return value;
  }
  return board.flat().includes('') ? null : 'Tie';
}
