let v = 150;
let moves = 0;
let sc = 0;
let count = 0;
let flippedCards = [];
let lockBoard = false;
let c = 0;
let timer, isPaused = false;

const flipSound = new Audio('flip.mp3');
const matchSound = new Audio('match.mp3');
const winSound = new Audio('win.mp3');
const loseSound = new Audio('lose.mp3');

function flipCard(card) {
  if (lockBoard || flippedCards.includes(card) || card.classList.contains('matched')) return;

  flipSound.play();
  card.classList.add('flip');
  flippedCards.push(card);
  card.style.boxShadow = "0px 5px 0px 0px yellow";

  if (flippedCards.length === 2) {
    lockBoard = true;

    if (flippedCards[0].querySelector('.card-back img').src === flippedCards[1].querySelector('.card-back img').src) {
      matchSound.play();
      sc += 10;
      flippedCards[0].classList.add('matched');
      flippedCards[1].classList.add('matched');
      flippedCards[0].style.boxShadow = "0px 5px 0px 0px green";
      flippedCards[1].style.boxShadow = "0px 5px 0px 0px green";
      count++;

      document.getElementById("s1").textContent = "Score → " + sc;
      flippedCards = [];
      lockBoard = false;

      if (count === 6) {
        winSound.play();
        showPopup("🎉 Game Over! You Won! 🎉");
        confetti();
      }
    } else {
      setTimeout(() => {
        flippedCards[0].classList.remove('flip');
        flippedCards[1].classList.remove('flip');
        flippedCards[0].style.boxShadow = "";
        flippedCards[1].style.boxShadow = "";
        flippedCards = [];
        sc=sc-2;
        document.getElementById("s1").textContent="Score→"+sc;
        lockBoard = false;
      }, 1000);
    }
  }

  moves++;
  if (moves % 2 === 0) {
    c++;
    document.getElementById("m1").textContent = `Moves → ${c}`;
  }
}

function shuffleCards() {
  const cards = document.querySelectorAll('.card2');
  const cardArray = Array.from(cards);

  for (let i = cardArray.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardArray[i], cardArray[j]] = [cardArray[j], cardArray[i]];
  }

  const main = document.querySelector('.main');
  cardArray.forEach(card => {
    main.appendChild(card);
  });
}

window.onload = function () {
      const screenWidth = window.innerWidth;
    if (screenWidth < 1921) {
        document.body.style.zoom = "78%";
    } else {
        document.body.style.zoom = "100%";
    }
  shuffleCards();
  const cards = document.querySelectorAll('.card2');
  cards.forEach(card => {
    card.addEventListener('click', function () {
      flipCard(card);
    });
  });
  startTimer();
};

function startTimer() {
  timer = setInterval(() => {
    if (v > 0) {
      v--;
      document.getElementById("t1").textContent = "Timer → " + v;
    } else {
      clearInterval(timer);
      loseSound.play();
      showPopup("⏳ Time’s up! Game Over!");
    }
  }, 1500);
}

function pauseTimer() {
  clearInterval(timer);
  isPaused = true;
}

function resumeTimer() {
  if (isPaused) {
    startTimer();
    isPaused = false;
  }
}

function useHint() {
  let cards = document.querySelectorAll('.card2:not(.matched)');
  if (cards.length < 2) return;
  
  let [card1, card2] = [cards[Math.floor(Math.random() * cards.length)], cards[Math.floor(Math.random() * cards.length)]];
  
  card1.classList.add('flip');
  card2.classList.add('flip');

  setTimeout(() => {
    card1.classList.remove('flip');
    card2.classList.remove('flip');
  }, 1000);
}

function showPopup(message) {
  let popup = document.createElement("div");
  popup.id = "gameOverPopup";
  let acc=(sc/60)*100;
  let r=acc.toFixed(2);
  popup.innerHTML = `<p>${message}</p><br><button onclick="closePopup()">Play Again</button><br><p>Your Accuracy : ${r}%</p><br><p>Refresh to Play Again</p>`;
  if (message.includes("You Won")) {
    const playerName = prompt("Enter your name for the high score:", "Player");
    if (playerName) {
     
      const key = 'single_easy_scores';
      let scores = JSON.parse(localStorage.getItem(key) || '[]');
      scores.push({ score: sc, playerName, date: new Date().toLocaleDateString() });
      scores.sort((a, b) => b.score - a.score);
      scores = scores.slice(0, 5); // Keep only top 5 scores
      localStorage.setItem(key, JSON.stringify(scores));
    }
  }

  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%) scale(0.8)";
  popup.style.backgroundColor = "#222";
  popup.style.color = "white";
  popup.style.padding = "40px";
  popup.style.width = "600px";  
  popup.style.height = "400px"; 
  popup.style.borderRadius = "15px";
  popup.style.boxShadow = "0 0 30px rgba(0,0,0,0.7)";
  popup.style.textAlign = "center";
  popup.style.fontSize = "28px"; 
  popup.style.opacity = "1";
  popup.style.animation = "fadeIn 0.5s ease-out forwards, shake 0.4s ease-in-out 0.6s";

  let button = popup.querySelector("button");
  button.style.marginTop = "20px";
  button.style.padding = "15px 25px"; 
  button.style.background = "#ff5733";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "10px";
  button.style.cursor = "pointer";
  button.style.transition = "all 0.3s ease";
  button.style.fontSize = "20px";
  

  button.addEventListener("mouseover", function() {
    button.style.boxShadow = "0 0 20px #ff5733";
    button.style.transform = "scale(1.1)";
  });

  button.addEventListener("mouseleave", function() {
    button.style.boxShadow = "none";
    button.style.transform = "scale(1)";
  });

  button.addEventListener("click", closePopup);

  document.body.appendChild(popup);
}

function closePopup() {
  let popup = document.getElementById("gameOverPopup");
  popup.style.animation = "fadeOut 0.5s ease-out";
  setTimeout(() => {
    popup.remove();
    location.reload();
  }, 500);
}



