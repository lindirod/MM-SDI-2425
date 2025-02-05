function displayVideo(video) {
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();
}

function displayHandKeypoints(hand) {
  for (let j = 0; j < hand.keypoints.length; j++) {
    let keypoint = hand.keypoints[j];
    push();
    fill(255, 0, 255);
    noStroke();
    circle(width - keypoint.x, keypoint.y, 7);
    pop();
  }
}

function isHandClosed(hand) {
  let tips = [8, 12, 16, 20];
  let knuckles = [5, 9, 13, 17];
  let wrist = hand.keypoints[0];
  let closedFingers = 0;

  for (let i = 0; i < tips.length; i++) {
    let tip = hand.keypoints[tips[i]];
    let knuckle = hand.keypoints[knuckles[i]];
    let tipToKnuckleDistance = dist(tip.x, tip.y, knuckle.x, knuckle.y);
    let tipToWristDistance = dist(tip.x, tip.y, wrist.x, wrist.y);
    if (tipToKnuckleDistance < 20 && tipToWristDistance < 100) {
      closedFingers++;
    }
  }

  return closedFingers >= 3;
}
