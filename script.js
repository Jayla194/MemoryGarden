const memories = [
  {
    title: "Shop Till We Drop",
    message: "Shopping trips are always a highlight! Soon we will have another one of us to spend ungodly amounts in Primark. ",
    image: "Images/Image-2022-Rushden.jpg",
    alt: "Mum and daughter during a shopping day at Rushden Lakes"
  },
  {
    title: "Fun in the sun",
    message: "Heres your reminder if you don't hear it enough. You are amazing!! You're always there for us when we need help and ready to get shit done when it comes to it. Thank you <3",
    image: "Images/Image-2021-Pool.jpg",
    alt: "Mum and daughter by a pool"
  },
  {
    title: "My Partner in Crime",
    message: "We always find ways to cause mischief somehow. I wanted to add the video of us dancing to gilmore girls but I can't find it.😭",
    image: "Images/Image-2020-Beach.jpg",
    alt: "Mum and daughter at the beach"
  },
  {
    title: "My player 2",
    message: "No matter the challenge we're always ready for it. Even if that challenge was getting through a battle block level without killing each other. ",
    image: "Images/Image-2021-Gaming.jpg",
    alt: "Mum and daughter holding wine, wearing gaming headsets."
  },
  {
    title: "The Final Bloom",
    message: "Happy Mother's Day, Mum. Thank you for every fun, silly memory and every thing you do for all of us. Love you always. <3",
    image: "Images/Image-2011.jpg",
    alt: "A special mother and daughter photo"
  }
];

const carouselImages = [
  "Images/Image-2011.jpg",
  "Images/Image-2019-Insomnia.jpg",
  "Images/Image-2020-Beach.jpg",
  "Images/Image-2020-Priory.jpg",
  "Images/Image-2020-Priory1.jpg",
  "Images/Image-2020-SparkleFarts.jpg",
  "Images/Image-2020.jpg",
  "Images/Image-2021-BBQ.jpg",
  "Images/Image-2021-Cocktail.jpg",
  "Images/Image-2021-Gaming.jpg",
  "Images/Image-2021-Pool.jpg",
  "Images/Image-2021-Wine.jpg",
  "Images/Image-2021.jpg",
  "Images/Image-2022-Ella.jpg",
  "Images/Image-2022-Rushden.jpg"
];

const modal = document.getElementById("memoryModal");
const closeModalBtn = document.getElementById("closeModal");
const imageEl = document.getElementById("memoryImage");
const titleEl = document.getElementById("memoryTitle");
const messageEl = document.getElementById("memoryMessage");
const progressEl = document.getElementById("progress");
const enterTeaBtn = document.getElementById("enterTea");
const endingSection = document.getElementById("ending");
const app = document.querySelector(".app");
const carouselTrack = document.getElementById("carouselTrack");

const buds = [...document.querySelectorAll(".bud")];
const finalBud = document.getElementById("finalBud");

let openMemoryId = null;
const bloomed = new Set();
const totalMemories = memories.length;
const unlockCount = totalMemories - 1;

function buildPetals() {
  buds.forEach((bud) => {
    const head = bud.querySelector(".head");
    if (!head || head.querySelector(".petal")) return;

    for (let i = 0; i < 8; i += 1) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.setProperty("--i", String(i));
      head.appendChild(petal);
    }

    const core = document.createElement("span");
    core.className = "core";
    head.appendChild(core);
  });
}

function updateProgress() {
  const preFinalBloomed = [...bloomed].filter((id) => id < unlockCount).length;

  if (preFinalBloomed < unlockCount) {
    progressEl.textContent = `${preFinalBloomed}/${unlockCount} memories bloomed`;
  } else if (bloomed.size < totalMemories) {
    progressEl.textContent = "Final memory unlocked.";
  } else {
    progressEl.textContent = "All memories bloomed.";
  }

  if (preFinalBloomed === unlockCount && finalBud.classList.contains("locked")) {
    finalBud.classList.remove("locked");
    finalBud.classList.add("unlocked");
    finalBud.setAttribute("aria-label", "Open final memory");
  }

  if (bloomed.size === totalMemories) {
    enterTeaBtn.disabled = false;
  }
}

function openMemory(memoryId) {
  const memory = memories[memoryId];
  openMemoryId = memoryId;

  imageEl.src = memory.image;
  imageEl.alt = memory.alt;
  titleEl.textContent = memory.title;
  messageEl.textContent = memory.message;
  if (memoryId === unlockCount) {
    enterTeaBtn.disabled = false;
    enterTeaBtn.style.display = "inline-flex";
  } else {
    enterTeaBtn.disabled = true;
    enterTeaBtn.style.display = "none";
  }
  modal.showModal();
}

function bloomBud(memoryId) {
  const bud = buds.find((item) => item.dataset.memory === String(memoryId));
  if (!bud || bud.classList.contains("bloomed")) return;

  bud.classList.add("bloomed");
  bloomed.add(memoryId);
  updateProgress();
}

function handleBudClick(event) {
  const bud = event.currentTarget;
  const memoryId = Number(bud.dataset.memory);

  if (memoryId === 4 && finalBud.classList.contains("locked")) {
    progressEl.textContent = "Bloom every other flower to unlock the final memory.";
    return;
  }

  openMemory(memoryId);
}

function closeMemory() {
  if (openMemoryId !== null) {
    bloomBud(openMemoryId);
    openMemoryId = null;
  }
  enterTeaBtn.style.display = "none";
  modal.close();
}

function buildCarousel() {
  const images = [...carouselImages, ...carouselImages];
  images.forEach((image) => {
    const item = document.createElement("div");
    item.className = "carousel-item";
    const img = document.createElement("img");
    img.src = image;
    img.alt = "Memory photo";
    item.appendChild(img);
    carouselTrack.appendChild(item);
  });
}

function showEnding() {
  app.classList.add("is-hidden");
  endingSection.classList.add("is-visible");
  endingSection.setAttribute("aria-hidden", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

buds.forEach((bud) => {
  bud.addEventListener("click", handleBudClick);
});

closeModalBtn.addEventListener("click", closeMemory);
enterTeaBtn.addEventListener("click", showEnding);

modal.addEventListener("click", (event) => {
  const bounds = modal.getBoundingClientRect();
  const clickedInDialog =
    bounds.top <= event.clientY &&
    event.clientY <= bounds.top + bounds.height &&
    bounds.left <= event.clientX &&
    event.clientX <= bounds.left + bounds.width;

  if (!clickedInDialog) {
    closeMemory();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.open) {
    event.preventDefault();
    closeMemory();
  }
});

updateProgress();
buildPetals();
buildCarousel();
