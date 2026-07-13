const STORAGE_KEY = 'aryaBirthdayQuestProgress';

const chapters = [
  {
    id: 'intro',
    title: 'Intro',
    subtitle: 'Today is not an ordinary birthday...',
    text: 'Happy Birthday Arya. Somewhere in the world, a special birthday treasure has been hidden. To find it, you must relive the most important moments of our story. Are you ready to begin your adventure?',
    image: 'images/arya.jpg',
    choices: [
      { label: 'Start Adventure', value: 'start' }
    ]
  },
  {
    id: 'concert',
    title: 'The Concert of Destiny 🎵',
    text: 'Where did our first kiss happen?',
    image: 'images/concert.jpg',
    choices: [
      { label: 'At a Café', correct: false, response: 'The memory feels warm, but not quite right.', score: 0 },
      { label: 'At Arijit\'s Concert', correct: true, response: 'One magical concert. One unforgettable moment. And suddenly everything felt different.', score: 1 },
      { label: 'During a Movie', correct: false, response: 'Close, but the music was the moment that changed everything.', score: 0 }
    ]
  },
  {
    id: 'football',
    title: 'The Football War ⚽',
    text: 'What caused our first fight?',
    image: 'images/realmadrid.jpg',
    choices: [
      { label: 'Pizza Toppings', correct: false, response: 'A tasty fight, but not the one that mattered.', score: 0 },
      { label: 'Real Madrid', correct: true, response: 'Yes 😭 We literally blocked each other. A football club almost ended a love story.', score: 1 },
      { label: 'Instagram Reels', correct: false, response: 'Not quite. Our fight had more roar and less scroll.', score: 0 }
    ]
  },
  {
    id: 'kasol',
    title: 'The Kasol Night Ride 🌙',
    text: 'Where did our legendary night ride happen?',
    image: 'images/kasol.jpg',
    choices: [
      { label: 'Goa', correct: false, response: 'The coast was beautiful, but this ride belonged to the mountains.', score: 0 },
      { label: 'Kasol', correct: true, response: 'Cold air. Empty roads. One of my favorite memories.', score: 1 },
      { label: 'Lonavala', correct: false, response: 'A lovely place, but our memory sparkled in Kasol.', score: 0 }
    ]
  },
  {
    id: 'puk',
    title: 'Secret Language 😂',
    text: 'What is one of our legendary inside jokes?',
    image: 'images/puk.jpg',
    choices: [
      { label: 'Potato', correct: false, response: 'That one is funny, but not legendary enough.', score: 0 },
      { label: 'Puk 😭😭😭', correct: true, response: 'Only true legends understand Puk.', score: 1 },
      { label: 'Penguin', correct: false, response: 'Penguins are cute, but our joke was much stranger.', score: 0 }
    ]
  },
  {
    id: 'pillow',
    title: 'Pillow Kingdom 🛏️',
    text: 'Which royal artifact belongs to our kingdom?',
    image: 'images/pillow.jpg',
    choices: [
      { label: 'Crown', correct: false, response: 'A crown fits royalty, but not our cozy kingdom.', score: 0 },
      { label: 'Sword', correct: false, response: 'Brave, yes. Soft, no.', score: 0 },
      { label: 'Pillow :)', correct: true, response: 'The Sacred Pillow has been restored. Peace returns to the kingdom.', score: 1 }
    ]
  },
  {
    id: 'dragon',
    title: 'The Birthday Dragon 🎂🐉',
    text: 'The Birthday Dragon guards your birthday treasure.',
    image: 'images/gift.jpg',
    choices: [
      { label: 'Attack', correct: false, response: 'The dragon dodges. A softer approach may work better.', score: 0 },
      { label: 'Negotiate', correct: false, response: 'The dragon listens but does not budge.', score: 0 },
      { label: 'Sing Happy Birthday', correct: true, response: 'The dragon smiles and transforms into confetti.', score: 1 }
    ]
  }
];

const app = document.getElementById('app');
const loadingScreen = document.getElementById('loading-screen');
const finalScreen = document.getElementById('final-screen');
const giftModal = document.getElementById('gift-modal');
const chapterTitle = document.getElementById('chapter-title');
const chapterText = document.getElementById('chapter-text');
const chapterImage = document.getElementById('chapter-image');
const chapterPill = document.getElementById('chapter-pill');
const chapterScore = document.getElementById('chapter-score');
const heartCounter = document.getElementById('heart-counter');
const progressFill = document.getElementById('progress-fill');
const choicesContainer = document.getElementById('choices');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const soundBtn = document.getElementById('sound-btn');
const treasureBtn = document.getElementById('treasure-btn');
const finishBtn = document.getElementById('finish-btn');
const bgMusic = document.getElementById('bg-music');
const confettiLayer = document.getElementById('confetti-layer');
const floatingHeartsContainer = document.getElementById('floating-hearts');

let currentIndex = 0;
let heartCrystals = 0;
let totalScore = 0;
let soundOn = true;
let typewriterTimer = null;
let answerSelected = false;

const initialState = {
  currentIndex: 0,
  heartCrystals: 0,
  totalScore: 0,
  soundOn: true
};

function saveProgress() {
  const progress = { currentIndex, heartCrystals, totalScore, soundOn };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function loadProgress() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return initialState;
  try {
    return JSON.parse(saved);
  } catch {
    return initialState;
  }
}

function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
  currentIndex = 0;
  heartCrystals = 0;
  totalScore = 0;
  soundOn = true;
  answerSelected = false;
}

function startLoading() {
  loadingScreen.classList.remove('hidden');
  app.classList.add('hidden');
  finalScreen.classList.add('hidden');
  giftModal.classList.add('hidden');
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    app.classList.remove('hidden');
    applyProgress();
    initFloatingHearts();
    updateSoundButton();
  }, 1200);
}

function applyProgress() {
  const saved = loadProgress();
  currentIndex = saved.currentIndex || 0;
  heartCrystals = saved.heartCrystals || 0;
  totalScore = saved.totalScore || 0;
  soundOn = saved.soundOn !== false;
  updateStatus();
  renderChapter();
}

function updateStatus() {
  const maxHeartCrystals = chapters.length - 1;
  chapterScore.textContent = `Score: ${totalScore}`;
  heartCounter.textContent = `${heartCrystals} / ${maxHeartCrystals}`;
  const progressPercent = Math.min((currentIndex / (chapters.length - 1)) * 100, 100);
  progressFill.style.width = `${progressPercent}%`;
}

function updateSoundButton() {
  if (soundOn) {
    soundBtn.textContent = '🔊 Sound On';
    bgMusic.play().catch(() => {});
  } else {
    soundBtn.textContent = '🔇 Sound Off';
    bgMusic.pause();
  }
}

function renderChapter() {
  answerSelected = false;
  const chapter = chapters[currentIndex];
  chapterPill.textContent = chapter.title;
  chapterTitle.textContent = chapter.title;
  animateText(chapter.text);
  renderImage(chapter.image);
  renderChoices(chapter.choices);
  updateStatus();
  nextBtn.disabled = true;
  nextBtn.textContent = 'Continue';
  nextBtn.onclick = null;
}

function renderImage(src) {
  const imageCard = document.createElement('div');
  imageCard.className = 'image-card image-placeholder';
  imageCard.textContent = src.split('/').pop();
  chapterImage.innerHTML = '';
  const img = new Image();
  img.src = src;
  img.alt = chapterTitle.textContent;
  img.className = 'image-card';
  img.onload = () => {
    chapterImage.innerHTML = '';
    chapterImage.appendChild(img);
  };
  img.onerror = () => {
    chapterImage.innerHTML = '';
    chapterImage.appendChild(imageCard);
  };
}

function renderChoices(choices) {
  choicesContainer.innerHTML = '';
  choices.forEach((choice) => {
    const button = document.createElement('button');
    button.className = 'choice-btn';
    button.textContent = choice.label;
    button.disabled = false;
    button.dataset.correct = choice.correct ? 'true' : 'false';
    button.onclick = () => selectChoice(choice, button);
    choicesContainer.appendChild(button);
  });
}

function animateText(text) {
  clearInterval(typewriterTimer);
  chapterText.textContent = '';
  chapterText.classList.add('active');
  let index = 0;
  typewriterTimer = setInterval(() => {
    chapterText.textContent += text[index] || '';
    index += 1;
    if (index > text.length) {
      clearInterval(typewriterTimer);
      chapterText.classList.remove('active');
    }
  }, 24);
}

function selectChoice(choice, button) {
  if (answerSelected) return;
  answerSelected = true;

  const choiceButtons = Array.from(document.querySelectorAll('.choice-btn'));
  choiceButtons.forEach((btn) => {
    btn.disabled = true;
    const correct = btn.dataset.correct === 'true';
    btn.classList.add(correct ? 'correct' : 'incorrect');
  });

  button.classList.add('selected');
  const isFinalChapter = currentIndex === chapters.length - 1;

  if (choice.correct) {
    heartCrystals = Math.min(heartCrystals + 1, chapters.length - 1);
    totalScore += 1;
    if (soundOn) {
      playCelebrateSound();
    }
    triggerConfetti();
  }

  chapterText.textContent = choice.response;
  updateStatus();
  nextBtn.disabled = false;

  if (isFinalChapter && choice.correct) {
    nextBtn.textContent = 'Celebrate!';
    nextBtn.onclick = showFinalScreen;
  } else {
    nextBtn.textContent = 'Next Memory';
    nextBtn.onclick = () => advanceChapter(choice.correct);
  }

  saveProgress();
}

function advanceChapter(correct) {
  currentIndex = Math.min(currentIndex + 1, chapters.length - 1);
  saveProgress();
  renderChapter();
}

function showFinalScreen() {
  app.classList.add('hidden');
  finalScreen.classList.remove('hidden');
  saveProgress();
}

function showGiftModal() {
  giftModal.classList.remove('hidden');
  triggerConfetti();
}

function restartGame() {
  resetProgress();
  applyProgress();
  app.classList.remove('hidden');
  finalScreen.classList.add('hidden');
  giftModal.classList.add('hidden');
  nextBtn.textContent = 'Continue';
  nextBtn.onclick = null;
  renderChapter();
}

function toggleSound() {
  soundOn = !soundOn;
  updateSoundButton();
  saveProgress();
}

function playCelebrateSound() {
  const winSound = new Audio('audio/confetti-sparkle.mp3');
  winSound.volume = 0.6;
  winSound.play().catch(() => {});
}

function triggerConfetti() {
  for (let i = 0; i < 30; i++) {
    const confetto = document.createElement('div');
    confetto.className = 'confetti';
    confetto.style.left = `${Math.random() * 100}%`;
    confetto.style.background = `hsl(${Math.random() * 340 + 280}, 90%, 70%)`;
    confetto.style.animationDuration = `${Math.random() * 1.2 + 1.4}s`;
    confettiLayer.appendChild(confetto);
    setTimeout(() => confetto.remove(), 2600);
  }
}

function initFloatingHearts() {
  floatingHeartsContainer.innerHTML = '';
  const count = window.innerWidth > 900 ? 16 : 10;
  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement('div');
    heart.className = 'heart-dot';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${Math.random() * 12 + 10}s`;
    heart.style.animationDelay = `${Math.random() * 8}s`;
    floatingHeartsContainer.appendChild(heart);
  }
}

startBtn.addEventListener('click', () => {
  currentIndex = 1;
  saveProgress();
  renderChapter();
});

restartBtn.addEventListener('click', restartGame);
soundBtn.addEventListener('click', toggleSound);
treasureBtn.addEventListener('click', showGiftModal);
finishBtn.addEventListener('click', restartGame);

window.addEventListener('load', () => {
  startLoading();
});

window.addEventListener('beforeunload', saveProgress);

window.addEventListener('resize', () => {
  initFloatingHearts();
});
