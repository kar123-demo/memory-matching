let mode1 = "-1";
let difficulty = "";
let c=0;
const v = document.getElementById("background-video");
v.onended = function() {
    v.pause(); 
};

function showImage() {
    c=1;
    let imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    let image = document.createElement("img");
    image.src = "./pictures/ins.png";
    image.style.width="700px";
    image.style.height="700px";


    let closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.className = "close-btn";
    closeButton.onclick = function () {
        c=0;
        document.body.removeChild(imageContainer); 
    };

    imageContainer.appendChild(closeButton);
    imageContainer.appendChild(image);

    document.body.appendChild(imageContainer);
}

function mode() {
    c=1;
    let modeContainer = document.createElement("div");
    modeContainer.className = "mode-container";
    
    let heading = document.createElement("h2");
    heading.innerText = "Select Mode";
    modeContainer.appendChild(heading);
    
    let singlePlayerBtn = document.createElement("button");
    singlePlayerBtn.innerText = "Single Player";
    singlePlayerBtn.className = "mode-button";
    singlePlayerBtn.onclick = function() {
        c=0;
        mode1 = "single";
        showDifficultyOptions();
        document.body.removeChild(modeContainer); 
    };
    
    let multiPlayerBtn = document.createElement("button");
    multiPlayerBtn.innerText = "Multiplayer";
    multiPlayerBtn.className = "mode-button";
    multiPlayerBtn.onclick = function() {
        c=0;
        mode1 = "multi";
        showDifficultyOptions();
        document.body.removeChild(modeContainer); 
    };
    
    let closeButton = document.createElement("button");
    closeButton.innerText = "✖";
    closeButton.className = "close-button";
    closeButton.onclick = function() {
        c=0;
        document.body.removeChild(modeContainer);
    };
    
    modeContainer.appendChild(singlePlayerBtn);
    modeContainer.appendChild(multiPlayerBtn);
    modeContainer.appendChild(closeButton);
    
    document.body.appendChild(modeContainer);
    
    let style = document.createElement("style");
    style.innerHTML = `
        .mode-container {
            text-align: center;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgb(199, 247, 226);
            padding: 20px;
            border: 2px solid black;
            border-radius: 12%;
            z-index: 1000;
            width: 40%;
            box-sizing: border-box;
        }
        
        h2 {
            font-size: 24px;
            margin-bottom: 20px;
        }
        .mode-button {
            background-color: #007BFF;
            color: white;
            border: none;
            padding: 10px 20px;
            margin: 10px;
            font-size: 18px;
            cursor: pointer;
            border-radius: 5px;
        }
        .mode-button:hover {
            background-color: #0056b3;
        }
        .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
        }
        .difficulty-dropdown {
            display: none;
            margin-top: 20px;
            text-align: center;
        }
        .difficulty-dropdown button {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            margin: 10px;
            font-size: 18px;
            cursor: pointer;
            border-radius: 5px;
        }
        .difficulty-dropdown button:hover {
            background-color: #218838;
        }
    `;
    document.head.appendChild(style);
}

function showDifficultyOptions() {
    c=1;
    let difficultyContainer = document.createElement("div");
    difficultyContainer.className = "difficulty-dropdown";

    let easyBtn = document.createElement("button");
    easyBtn.innerText = "Easy";
    easyBtn.onclick = function() {
        difficulty = "easy";
        c=0;
        updatePlayButton();
        difficultyContainer.style.display = "none";  
    };

    let mediumBtn = document.createElement("button");
    mediumBtn.innerText = "Medium";
    mediumBtn.onclick = function() {
        c=0;
        difficulty = "medium";
        updatePlayButton();
        difficultyContainer.style.display = "none";  
    };

    let hardBtn = document.createElement("button");
    hardBtn.innerText = "Hard";
    hardBtn.onclick = function() {
        difficulty = "hard";
        c=0;
        updatePlayButton();
        difficultyContainer.style.display = "none";  
    };

    difficultyContainer.appendChild(easyBtn);
    difficultyContainer.appendChild(mediumBtn);
    difficultyContainer.appendChild(hardBtn);

    document.body.appendChild(difficultyContainer);

    difficultyContainer.style.display = "block";  
}

function updatePlayButton() {
    const playButton = document.getElementById("b1");
    if (mode1 !== "-1" && difficulty !== "") {
        playButton.disabled = false;  
    }
}

function startGame() {
    if (mode1 === "single") {
        if(difficulty==="easy"){
        alert("Starting Single Player Game with " + difficulty + " difficulty.");
        window.open('./single/harish.html', '_blank');
        }
        if(difficulty==="medium"){
            alert("Starting Single Player Game with " + difficulty + " difficulty.");
            window.open('./single/Medium.html', '_blank');
            }
        if(difficulty==="hard"){
                alert("Starting Single Player Game with " + difficulty + " difficulty.");
                window.open('./single/Hard.html', '_blank');
        }
    } else if (mode1 === "multi") {
        if(difficulty==="easy"){
        alert("Starting Multiplayer Game with " + difficulty + " difficulty.");
        window.open('./Multi/harish2.html', '_blank');
        }
       else if(difficulty==="medium"){
            alert("Starting Multiplayer Game with " + difficulty + " difficulty.");
            window.open('./Multi/Medium1.html', '_blank');
            }
    else if(difficulty==="hard"){
                alert("Starting Multiplayer Game with " + difficulty + " difficulty.");
                window.open('./Multi/Hard1.html', '_blank');
                }
    }
}

function demo() {
    if (mode1 === "-1") { 
        mode();
    } else {
        startGame();
    }
}
window.onload=()=>{
   mode1="-1";
}

// High Scores Management
function saveHighScore(mode, difficulty, score, playerName = 'Player') {
    // Only save scores for single player mode
    if (mode === 'single') {
        const key = `${mode}_${difficulty}_scores`;
        let scores = JSON.parse(localStorage.getItem(key) || '[]');
        scores.push({ score, playerName, date: new Date().toLocaleDateString() });
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 5); // Keep only top 5 scores
        localStorage.setItem(key, JSON.stringify(scores));
        updateHighScoresDisplay();
    }
}

function updateHighScoresDisplay() {
    // Update only single player scores
    updateScoreCategory('single', 'hard', 'hard-scores');
    updateScoreCategory('single', 'medium', 'medium-scores');
    updateScoreCategory('single', 'easy', 'easy-scores');
}

function updateScoreCategory(mode, difficulty, elementId) {
    const key = `${mode}_${difficulty}_scores`;
    const scores = JSON.parse(localStorage.getItem(key) || '[]');
    const container = document.getElementById(elementId);
    
    if (container) {
        if (scores.length === 0) {
            container.innerHTML = '<p>No scores yet</p>';
        } else {
            container.innerHTML = scores.map((score, index) => 
                `<p>${index + 1}. ${score.playerName}: ${score.score} (${score.date})</p>`
            ).join('');
        }
    }
}

function showHighScores() {
    const highScoresDiv = document.querySelector('.high-scores');
    if (highScoresDiv) {
        updateHighScoresDisplay();
        highScoresDiv.style.display = 'block';
    }
}

function hideHighScores() {
    const highScoresDiv = document.querySelector('.high-scores');
    if (highScoresDiv) {
        highScoresDiv.style.display = 'none';
    }
}

// Add event listener for showing/hiding high scores
document.addEventListener('DOMContentLoaded', () => {
    const highScoresDiv = document.querySelector('.high-scores');
    if (highScoresDiv) {
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = '✖';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '20px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = hideHighScores;
        highScoresDiv.appendChild(closeButton);
    }
});
