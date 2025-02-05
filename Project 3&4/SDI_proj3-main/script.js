// Flow field parameters
let scl = 10;
let inc = 0.1;
let zOffInc = 0.0003;
let angMult = 25;
let angTurn = 1;
let cols, rows, zoff = 0;
let particles = [];
let flowfield;
let hu = 0;

let sat = 100, brt = 100, alph = 10, partStroke = 1;
let emotionColor = { h: 0, s: 100, b: 100 };
let animationStarted = false;

let recognition;
let recognizing = false;
let currentMusic;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let timeoutLimit = 180000; // 3 minutes
let lastInteractionTime = Date.now();

let timeoutMessageShown = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 359, 100, 100, 100);

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
        recognition = new SpeechRecognition();
        recognition.continuous = false; // Listen for a single sentence at a time
        recognition.interimResults = false; // Don't show intermediate results
        recognition.lang = 'en-US'; // Set language

        recognition.onstart = () => {
            recognizing = true;
            console.log("Listening...");
        };

        recognition.onresult = (event) => {
            const sentence = event.results[0][0].transcript;
            console.log("You said:", sentence);
            handleInput(sentence); // Process the sentence after speech
            lastInteractionTime = Date.now();
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.onend = () => {
            recognizing = false;
            console.log("Stopped listening.");
            // Restart recognition for continuous listening
            recognition.start();
        };
    } else {
        console.error("Speech recognition not supported in this browser.");
    }

    cols = floor(width / scl);
    rows = floor(height / scl);
    flowfield = new Array(cols * rows);

    for (let i = 0; i < 300; i++) {
        particles[i] = new Particle();
    }

    background(0);

    // Start listening
    if (recognition) recognition.start();
}

function draw() {

        // Check for timeout
        if (Date.now() - lastInteractionTime > timeoutLimit && !timeoutMessageShown) {
            showTimeoutMessage();
        }

    if (animationStarted) {
        var yoff = 0;
        for (var y = 0; y < rows; y++) {
            var xoff = 0;
            for (var x = 0; x < cols; x++) {
                var index = x + y * cols;
                var angle = noise(xoff, yoff, zoff) * angMult + angTurn;  
                var v = p5.Vector.fromAngle(angle);
                v.setMag(1);
                flowfield[index] = v;
                xoff += inc;
            }
            yoff += inc;
            zoff += zOffInc;
        }

        for (let i = 0; i < particles.length; i++) {
            particles[i].follow(flowfield);
            particles[i].update();
            particles[i].edges();
            particles[i].show();
        }
    }
}

// Function to handle speech input
function handleInput(sentence) {
    if (!sentence.trim()) return;

    fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence }),
    })
        .then(response => response.json())
        .then(data => {
            const color = hexToHsb(data.color);
            emotionColor = { h: color.h, s: color.s, b: color.b };
            hu = emotionColor.h;
            animationStarted = true;

            playEmotionMusic(data.music);
        })
        .catch(error => console.error('Failed to fetch emotion data', error));
}

// Utility function to convert HEX to HSB
function hexToHsb(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let delta = max - min;
    let h = 0, s = 0, br = max * 100;
    
    if (max !== min) {
        if (max === r) h = (g - b) / delta + (g < b ? 6 : 0);
        else if (max === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;
        h *= 60;
    }
    if (max !== 0) s = (delta / max) * 100;

    return { h, s, b: br };
}

function playEmotionMusic(musicFile) {
    console.log("Playing music: ", musicFile);
    if (currentMusic) 
        currentMusic.stop();

    currentMusic = loadSound(musicFile, () => {
        currentMusic.play();
    }, (error) => {
        console.error('Failed to load music file: ', error);
    });
}

function showTimeoutMessage() {
    timeoutMessageShown = true;

    const prompt = document.getElementById('prompt');
    prompt.style.display = 'none';
    animationStarted = false;
    background(0);


    // Create a message and button to restart
    let timeoutMessage = createDiv("Always feel free to express your emotions!");
    timeoutMessage.style('color', 'white');
    timeoutMessage.style('font-size', '2em');
    timeoutMessage.style('text-align', 'center');
    timeoutMessage.style('margin', '0');
    timeoutMessage.position(windowWidth / 2 - 250, windowHeight / 2 - 100);

    let restartButton = createButton('Restart');
    restartButton.addClass('timeout-button');  
    restartButton.position(windowWidth / 2 - 70, windowHeight / 2 + 50);
    restartButton.mousePressed(() => {
        window.location.reload();  // Restart the experience by reloading the page
    });
}