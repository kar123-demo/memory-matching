let bs = 0;
let rs = 0;
let flippedCards = [];
let lockBoard = false;
let initialColor = "";
let timer = 10;
let timerInterval;
let isRedTurn = true;

const leftSemiCircle = document.querySelector(".semi-circle");
const rightSemiCircle = document.querySelector(".semi-circle1");

function setRandomBackgroundColor() {
  const colors = ['rgb(255, 99, 71)', 'rgb(123, 168, 212)'];
  initialColor = colors[Math.floor(Math.random() * colors.length)];
  document.body.style.backgroundColor = initialColor;
if(initialColor==='rgb(123, 168, 212)') isRedTurn=false;
  updateSemiCircles();
  highlightScoreBox();
}

function updateSemiCircles() {
  leftSemiCircle.style.transform = initialColor === "rgb(255, 99, 71)" ? "translateX(0%)" : "translateX(-100%)";
  rightSemiCircle.style.transform = initialColor === "rgb(255, 99, 71)" ? "translateX(100%)" : "translateX(0%)";
}

function highlightScoreBox() {
  const redForm = document.getElementById("scor");
  const blueForm = document.getElementById("move");
  redForm.style.boxShadow = "";
  blueForm.style.boxShadow = "";

  if (initialColor === 'rgb(255, 99, 71)') {
    redForm.style.boxShadow = "0px 0px 10px 5px rgba(17, 26, 18, 0.7)";
  } else {
    blueForm.style.boxShadow = "0px 0px 10px 5px rgba(15, 22, 18, 0.7)";
  }
}

function flipCard(card) {
  if (lockBoard || flippedCards.includes(card) || card.classList.contains('matched')) return;

  card.classList.add('flip');
  flippedCards.push(card);
  card.style.boxShadow = "0px 5px 0px 0px yellow";

  if (flippedCards.length === 2) {
    lockBoard = true;
    
    if (flippedCards[0].querySelector('.card-back img').src === flippedCards[1].querySelector('.card-back img').src) {
      flippedCards.forEach(card => {
        card.classList.add('matched');
        card.style.boxShadow = "0px 0px 5px 0px green";
      });

      if (initialColor === 'rgb(255, 99, 71)') {
        rs += 10;
        document.getElementById("m1").textContent = "RedScore→" + rs;
      } else {
        bs += 10;
        document.getElementById("s1").textContent = "BlueScore→" + bs;
      }

      flippedCards = [];
      lockBoard = false;
      startTimer();

      if (checkAllCardsMatched()) {
        setTimeout(showPopup, 500);
      }
    } else {
      setTimeout(() => {
        flippedCards.forEach(card => {
          card.classList.remove('flip');
          card.style.boxShadow = "";
        });

        if (initialColor === 'rgb(255, 99, 71)') {
          rs -= 2.5;
        } else {
          bs -= 2.5;
        }

        document.getElementById("m1").textContent = "RedScore→" + rs;
        document.getElementById("s1").textContent = "BlueScore→" + bs;

        flippedCards = [];
        lockBoard = false;
        switchTurn();
      }, 1000);
    }
  }
}

function checkAllCardsMatched() {
  const cards = document.querySelectorAll('.card2');
  return Array.from(cards).every(card => card.classList.contains('matched'));
}

function showPopup() {
  clearInterval(timerInterval);
  let message = rs > bs ? `Red wins with ${rs} points!` : bs > rs ? `Blue wins with ${bs} points!` : `It's a tie with ${rs} points each!`;

  // Save high scores for multiplayer game
  const redPlayerName = prompt("Enter Red player's name:", "Red Player");
  const bluePlayerName = prompt("Enter Blue player's name:", "Blue Player");
  
  if (redPlayerName && bluePlayerName) {
    const key = 'multi_medium_scores';
    let scores = JSON.parse(localStorage.getItem(key) || '[]');
    
    // Save both players' scores
    scores.push({
      redPlayer: { name: redPlayerName, score: rs },
      bluePlayer: { name: bluePlayerName, score: bs },
      date: new Date().toLocaleDateString()
    });
    
    // Sort by highest score between the two players
    scores.sort((a, b) => Math.max(b.redPlayer.score, b.bluePlayer.score) - Math.max(a.redPlayer.score, a.bluePlayer.score));
    scores = scores.slice(0, 5); // Keep only top 5 scores
    localStorage.setItem(key, JSON.stringify(scores));
  }

  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.innerHTML = ` 
    <p>${message}</p>
    <p>Red Score: ${rs}</p>
    <p>Blue Score: ${bs}</p>
    <button class="replay-btn">Replay</button>
  `;

  document.body.appendChild(popup);
  popup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgb(240, 240, 240);
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
    font-size: 24px;
    text-align: center;
    z-index: 1000;
    width: 400px;
    max-width: 90%;
  `;

  popup.querySelector('.replay-btn').addEventListener('click', restartGame);
}

function restartGame() {
  document.querySelectorAll('.card2').forEach(card => card.classList.remove('flip', 'matched'));

  rs = 0;
  bs = 0;
  document.getElementById("m1").textContent = "RedScore→" + rs;
  document.getElementById("s1").textContent = "BlueScore→" + bs;

  setRandomBackgroundColor();
  shuffleCards();

  document.querySelector('.popup')?.remove();

  flippedCards = [];
  lockBoard = false;
  startTimer();
}

function shuffleCards() {
  const cards = document.querySelectorAll('.card2');
  const cardArray = Array.from(cards).sort(() => Math.random() - 0.5);
  document.querySelector('.main').append(...cardArray);
}
function switchTurn() {
  if (flippedCards.length === 1) {
    flippedCards[0].classList.remove('flip');
    flippedCards[0].style.boxShadow = "";
    flippedCards = [];
  }

  isRedTurn = !isRedTurn; 

  document.body.style.backgroundColor = isRedTurn ? 'rgb(255, 99, 71)' : 'rgb(123, 168, 212)'; 

  initialColor = document.body.style.backgroundColor; 
  
  updateSemiCircles();
  highlightScoreBox();
  
  startTimer();
}



function startTimer() {
  clearInterval(timerInterval);
  timer = 10;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timer--;
    updateTimerDisplay();

    if (timer <= 0) {
      clearInterval(timerInterval);

      switchTurn();
    }
  }, 1200);
}

function updateTimerDisplay() {
  document.getElementById("timer").textContent = `${timer}s`;
}

window.onload = function () {
  document.body.style.zoom = window.innerWidth < 1921 ? "70%" : "100%";
  shuffleCards();
  setRandomBackgroundColor();
  startTimer();

  document.querySelectorAll('.card2').forEach(card => card.addEventListener('click', () => flipCard(card)));
};
