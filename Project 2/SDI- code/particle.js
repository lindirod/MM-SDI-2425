class Particle {
  constructor(vol, type, x, y) {
    this.pos = createVector(x, y); // Random starting position
    this.vel = createVector(0, 0);
    
    // Define acceleration based on volume and type
    let accMagnitude = vol * 0.2; 
    this.acc = p5.Vector.random2D().mult(accMagnitude);
    
    // Set properties based on type
    this.alpha = 255;
    this.size = map(vol, 0, 1, 5, 15);

    // Color based on type
    if (type === "bass") {
      this.r = 100; // Darker color for bass
      this.g = 0;
      this.b = 150;
    } else if (type === "mid") {
      this.r = 255; // Warmer color for mid
      this.g = 100;
      this.b = 0;
    } else if (type === "treble") {
      this.r = 255; // White for treble
      this.g = 255;
      this.b = 255;
    }
  }
  
  show() {
    noStroke();
    fill(this.r, this.g, this.b, this.alpha);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    // Slow down the velocity over time
    this.vel.mult(0.95); 
    
    // Gradually fade out
    this.alpha -= 4;
    this.size *= 0.98;
  }
}
