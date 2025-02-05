let particles = [];
let fft, song;
let currentLyric = "";
let lyrics = [];

// Load the song and lyrics
function preload() {
  song = loadSound('NF-The-Search.mp3');
  loadJSON('lyrics.json', (data) => {
    lyrics = data;  
  });
}

function setup() {
  createCanvas(600, 500);
  angleMode(DEGREES);
  
  fft = new p5.FFT(0.8, 512);
  fft.setInput(song);

  // Buttons to control music
  playButton = select("#playButton");
  playButton.mousePressed(playMusic);
  
  pauseButton = select("#pauseButton");
  pauseButton.mousePressed(pauseMusic);
  
  stopButton = select("#stopButton");
  stopButton.mousePressed(stopMusic);

  // Progress bar slider
  progressBar = select("#progressBar");
  progressBar.input(updateSongTime); 
}

function playMusic() {
  if (!song.isPlaying()) {
    song.play();
  }
}

function pauseMusic() {
  if (song.isPlaying()) {
    song.pause();
  }
}

function stopMusic() {
  song.stop();
  progressBar.value(0); 
}

function updateSongTime() {
  let newTime = progressBar.value() * song.duration(); 
  song.jump(newTime); 
}

function draw() {
  background(30);
  
  progressBar.value(song.currentTime() / song.duration());

  let spectrum = fft.analyze();
  
  let bass = fft.getEnergy("bass");
  let mid = fft.getEnergy("mid");
  let treble = fft.getEnergy("treble");

  let bassParticles = floor(map(bass, 0, 255, 0, 10));
  let midParticles = floor(map(mid, 0, 255, 0, 10));
  let trebleParticles = floor(map(treble, 0, 255, 0, 10));

  for (let i = 0; i < bassParticles; i++) {
    particles.push(new Particle(bass / 255, "bass", random(width), random(320, 400)));
  }
  for (let i = 0; i < midParticles; i++) {
    particles.push(new Particle(mid / 255, "mid", random(width), random(220, 300)));
  }
  for (let i = 0; i < trebleParticles; i++) {
    particles.push(new Particle(treble / 255, "treble", random(width), random(80, 200)));
  }
  
  if (mouseIsPressed) {
    displayLyrics();
  }

  for (let j = particles.length - 1; j >= 0; j--) {
    particles[j].update();
    particles[j].show();
    if (particles[j].alpha <= 0) {
      particles.splice(j, 1);
    }
  }
}

function displayLyrics() {
  let currentTime = song.currentTime();

  for (let i = 0; i < lyrics.length; i++) {
    let lyric = lyrics[i];
    if (currentTime >= lyric.time && (i === lyrics.length - 1 || currentTime < lyrics[i + 1].time)) {
      currentLyric = lyric.text;
      break;
    }
  }

  fill(255);
  textSize(22);
  textAlign(CENTER);
  text(currentLyric, width / 2, height - 450); 
}
