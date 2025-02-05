const prompts = [
    "Now, tell us how you feel today? "
];

function getRandomPrompt() {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
}

// Display the random prompt when the page loads
const promptElement = document.getElementById('prompt');
promptElement.textContent = getRandomPrompt();

