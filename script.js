const gifts = [
  {
    src: "Bag%20of%20gifs/%20-12.gif",
    title: "Pocket party",
    alt: "Animated birthday surprise from the gift bag"
  },
  {
    src: "Bag%20of%20gifs/%20-13.gif",
    title: "Cake table chaos",
    alt: "Animated celebratory gif"
  },
  {
    src: "Bag%20of%20gifs/%20-14.gif",
    title: "Confetti rush",
    alt: "Animated party gif"
  },
  {
    src: "Bag%20of%20gifs/%20-15.gif",
    title: "Big grin delivery",
    alt: "Animated happy birthday gif"
  },
  {
    src: "Bag%20of%20gifs/%20-16.gif",
    title: "Surprise loop",
    alt: "Animated surprise birthday gif"
  },
  {
    src: "Bag%20of%20gifs/Bunny%20Claws.gif",
    title: "Bunny claws",
    alt: "Animated bunny gif"
  },
  {
    src: "Bag%20of%20gifs/__.gif",
    title: "Double underscore magic",
    alt: "Animated playful gif"
  },
  {
    src: "Bag%20of%20gifs/funny%20weird%20gif.gif",
    title: "Funny weird present",
    alt: "Animated funny weird gif"
  },
  {
    src: "Bag%20of%20gifs/tumblr_m6yx0gNLiQ1rt28efo1_500_gif%20(450%C3%97457).gif",
    title: "Tumblr time capsule",
    alt: "Animated retro gif"
  },
  {
    src: "Bag%20of%20gifs/%E1%83%A6%E2%99%A5%E1%83%A6%E2%99%A1%E1%83%A6%E2%99%A5%E1%83%A6Pockemom%E2%99%A1%E1%83%A6%E2%99%A5%E1%83%A6%E2%99%A1.gif",
    title: "Pockemom power",
    alt: "Animated character gif"
  }
];

const confettiColors = ["#ff5f57", "#13b5c8", "#ffd447", "#37c58f", "#6f3cc3", "#2867f0"];
const noteMap = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99
};

const birthdayTune = [
  ["G4", 0.45],
  ["G4", 0.45],
  ["A4", 0.9],
  ["G4", 0.9],
  ["C5", 0.9],
  ["B4", 1.6],
  ["G4", 0.45],
  ["G4", 0.45],
  ["A4", 0.9],
  ["G4", 0.9],
  ["D5", 0.9],
  ["C5", 1.6],
  ["G4", 0.45],
  ["G4", 0.45],
  ["G5", 0.9],
  ["E5", 0.9],
  ["C5", 0.9],
  ["B4", 0.9],
  ["A4", 1.7],
  ["F5", 0.45],
  ["F5", 0.45],
  ["E5", 0.9],
  ["C5", 0.9],
  ["D5", 0.9],
  ["C5", 1.8]
];

const titleMessages = [
  "Another year doesn't mean you're older, it means you've been trusted with more life. Use it like you mean it.",
  "You are not who you were a year ago, and a year from now you'll look back amazed at who you're becoming today. The direction matters more than the distance.",
  "Somewhere, someone is carrying a better day because you exist in it, and they might never even tell you. You matter more than you'll ever fully know.",
  "May today remind you that happiness isn't something you earn or wait for. It's something you're allowed to simply have.",
  "The odds of you, specifically, exactly, wonderfully you, ever existing were astronomically small. And yet here you are, loved, real, and irreplaceable. That's not ordinary. That's extraordinary.",
  "may your deepest, most earnest wishes always come true"
];

const giftGrid = document.querySelector("#giftGrid");
const giftCount = document.querySelector("#giftCount");
const spotlight = document.querySelector(".spotlight-frame");
const spotlightGif = document.querySelector("#spotlightGif");
const spotlightCaption = document.querySelector("#spotlightCaption");
const titleMessage = document.querySelector("#titleMessage");
const pullBtn = document.querySelector("#pullBtn");
const shuffleBtn = document.querySelector("#shuffleBtn");
const tuneBtn = document.querySelector("#tuneBtn");
const tuneLabel = document.querySelector(".tune-label");
const confettiLayer = document.querySelector(".confetti-layer");

let audioContext;
let isTunePlaying = false;
let messageIndex = 0;
let tuneTimeout;
let activeOscillators = [];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  const next = [...items];

  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }

  return next;
}

function setSpotlight(gift, shouldBurst = false) {
  spotlight.classList.remove("is-swapping");
  window.requestAnimationFrame(() => {
    spotlightGif.src = gift.src;
    spotlightGif.alt = gift.alt;
    spotlightCaption.textContent = gift.title;
    spotlight.classList.add("is-swapping");
  });

  if (shouldBurst) {
    burstFromElement(spotlight);
  }
}

function renderGifts() {
  const shuffledGifts = shuffle(gifts);
  giftGrid.innerHTML = "";
  giftCount.textContent = `${gifts.length} surprises loaded`;

  shuffledGifts.forEach((gift, index) => {
    const card = document.createElement("button");
    card.className = "gift-card";
    card.type = "button";
    card.style.setProperty("--card-color", confettiColors[index % confettiColors.length]);
    card.setAttribute("aria-label", `Open ${gift.title}`);

    const img = document.createElement("img");
    img.src = gift.src;
    img.alt = gift.alt;
    img.loading = "lazy";

    const title = document.createElement("span");
    title.textContent = gift.title;

    const helper = document.createElement("small");
    helper.textContent = "Tap to spotlight";

    card.append(img, title, helper);
    card.addEventListener("click", () => setSpotlight(gift, true));
    giftGrid.append(card);
  });
}

function buildConfetti() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    return;
  }

  for (let i = 0; i < 64; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.setProperty("--x", `${Math.random() * 100}%`);
    piece.style.setProperty("--w", `${6 + Math.random() * 8}px`);
    piece.style.setProperty("--h", `${9 + Math.random() * 16}px`);
    piece.style.setProperty("--c", randomItem(confettiColors));
    piece.style.setProperty("--r", `${Math.random() * 180}deg`);
    piece.style.setProperty("--d", `${7 + Math.random() * 9}s`);
    piece.style.setProperty("--delay", `${Math.random() * -12}s`);
    piece.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
    confettiLayer.append(piece);
  }
}

function showNextTitleMessage() {
  titleMessage.classList.add("is-changing");

  window.setTimeout(() => {
    titleMessage.textContent = titleMessages[messageIndex];
    messageIndex = (messageIndex + 1) % titleMessages.length;
    titleMessage.classList.remove("is-changing");
  }, 260);
}

function burstFromElement(element) {
  const rect = element.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  for (let i = 0; i < 18; i += 1) {
    const burst = document.createElement("span");
    const angle = (Math.PI * 2 * i) / 18;
    const distance = 70 + Math.random() * 110;

    burst.className = "burst";
    burst.style.left = `${originX}px`;
    burst.style.top = `${originY}px`;
    burst.style.setProperty("--burst-color", randomItem(confettiColors));
    burst.style.setProperty("--burst-x", `${Math.cos(angle) * distance}px`);
    burst.style.setProperty("--burst-y", `${Math.sin(angle) * distance}px`);
    document.body.append(burst);

    window.setTimeout(() => burst.remove(), 700);
  }
}

function playNote(context, frequency, start, duration) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration - 0.03);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration);
  activeOscillators.push(oscillator);
  oscillator.addEventListener("ended", () => {
    activeOscillators = activeOscillators.filter((item) => item !== oscillator);
  });
}

function scheduleTune() {
  const context = audioContext;
  let time = context.currentTime + 0.05;
  const beatMs = 420;

  birthdayTune.forEach(([note, beats]) => {
    const duration = beats * 0.42;
    playNote(context, noteMap[note], time, duration);
    time += duration + 0.035;
  });

  const totalMs = birthdayTune.reduce((total, [, beats]) => total + beats * beatMs + 35, 0);
  tuneTimeout = window.setTimeout(() => {
    if (isTunePlaying) {
      scheduleTune();
    }
  }, totalMs + 250);
}

function stopTune() {
  window.clearTimeout(tuneTimeout);
  activeOscillators.forEach((oscillator) => {
    try {
      oscillator.stop();
    } catch {
      // Oscillator may already have finished.
    }
  });
  activeOscillators = [];
  isTunePlaying = false;
  tuneBtn.setAttribute("aria-pressed", "false");
  tuneLabel.textContent = "Play tune";
  tuneBtn.querySelector(".control-icon").textContent = "play";
}

async function toggleTune() {
  if (isTunePlaying) {
    stopTune();
    return;
  }

  audioContext = audioContext || new AudioContext();

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  isTunePlaying = true;
  tuneBtn.setAttribute("aria-pressed", "true");
  tuneLabel.textContent = "Stop tune";
  tuneBtn.querySelector(".control-icon").textContent = "stop";
  scheduleTune();
}

pullBtn.addEventListener("click", () => {
  setSpotlight(randomItem(gifts), true);
});

shuffleBtn.addEventListener("click", () => {
  renderGifts();
  burstFromElement(shuffleBtn);
});

tuneBtn.addEventListener("click", toggleTune);

buildConfetti();
renderGifts();
setSpotlight(randomItem(gifts));
showNextTitleMessage();
window.setInterval(showNextTitleMessage, 7600);
