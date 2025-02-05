let video;
let handpose;
let hands = [];
let currentPlayer = 'X';
let gameOver = false;
let restartButton;

function preload() {
  handpose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);
  
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handpose.detectStart(video, gotHands);
  
  // Initialize the Tic-Tac-Toe board
  initBoard();

  restartButton = select('#restart');
  restartButton.position(width / 2 - 50, height - 50);
  restartButton.mousePressed(restartGame);
}

function gotHands(results) {
  hands = results;
}

function draw() {
  clear();
  // Mirror and display the video feed
  displayVideo(video);

  let offsetX = (width - gridSize) / 2;
  let offsetY = (height - gridSize) / 2;
  
  drawBoard(offsetX, offsetY);
  drawMarks(offsetX, offsetY);

  if (gameOver) {
    displayGameOverMessage(winner);
    return;
  } else {
    fill(0);  // Black color during gameplay
  }

  if (hands.length > 0) {
    let hand = hands[0];
    displayHandKeypoints(hand);
    if (isHandClosed(hand)) {
      let x = width - hand.keypoints[9].x;
      let y = hand.keypoints[9].y;
      checkMove(x, y, offsetX, offsetY);
    }
  }
}

function displayGameOverMessage(winner){
    fill(255, 0, 0);  // Red color for game over
    textSize(32);
    textAlign(CENTER, CENTER);
    text('Game Over!', width / 2, height - 70);

    // Display the winner or tie
    if (winner === 'Tie') {
      text("It's a tie!", width / 2, height - 430);
    } else if (winner === 'X') {
      text("You won!", width / 2, height - 430);
    } else if (winner === 'O') {
      text("AI won!", width / 2, height - 430);
    }
    return;
}

// Function to restart the game
function restartGame() {
  initBoard();
  currentPlayer = 'X';
  gameOver = false;
  winner = null;
}
