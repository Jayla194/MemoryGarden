const memories = [
  {
    title: "Shop Till We Drop",
    message: "You are always ready for our shop-till-we-drop moments <3",
    image: "Images/Image-2022-Rushden.jpg",
    alt: "Mum and daughter during a shopping day"
  },
  {
    title: "Fun in the sun",
    message: "Sun, pool, and your laugh. My favorite combination.",
    image: "Images/Image-2021-Pool.jpg",
    alt: "Mum and daughter by a pool"
  },
  {
    title: "Beach Day",
    message: "I love this picture of us to much, along with the video of us dancing to gilmore girls. Our silly moments are always a lot of fun. <3",
    image: "Images/Image-2020-Beach.jpg",
    alt: "Mum and daughter at the beach"
  },
  {
    title: "BBQ Memories",
    message: "You make simple moments feel special, even at the barbecue.",
    image: "Images/Image-2021-BBQ.jpg",
    alt: "Mum and daughter at a barbecue"
  },
  {
    title: "The Final Bloom",
    message: "Happy Mother's Day, Mum. Thank you for every memory and every thing you do for all of us. Love you always.",
    image: "Images/Image-2011.jpg",
    alt: "A special mother and daughter photo"
  }
];

const modal = document.getElementById("memoryModal");
const closeModalBtn = document.getElementById("closeModal");
const imageEl = document.getElementById("memoryImage");
const titleEl = document.getElementById("memoryTitle");
const messageEl = document.getElementById("memoryMessage");
const progressEl = document.getElementById("progress");

const buds = [...document.querySelectorAll(".bud")];
const finalBud = document.getElementById("finalBud");

let openMemoryId = null;
const bloomed = new Set();

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
  progressEl.textContent = `${bloomed.size}/4 memories bloomed`;

  if (bloomed.size === 4 && finalBud.classList.contains("locked")) {
    finalBud.classList.remove("locked");
    finalBud.classList.add("unlocked");
    finalBud.setAttribute("aria-label", "Open final memory");
  }
}

function openMemory(memoryId) {
  const memory = memories[memoryId];
  openMemoryId = memoryId;

  imageEl.src = memory.image;
  imageEl.alt = memory.alt;
  titleEl.textContent = memory.title;
  messageEl.textContent = memory.message;
  modal.showModal();
}

function bloomBud(memoryId) {
  const bud = buds.find((item) => item.dataset.memory === String(memoryId));
  if (!bud || bud.classList.contains("bloomed")) return;

  bud.classList.add("bloomed");
  if (memoryId < 4) {
    bloomed.add(memoryId);
    updateProgress();
  }
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
  modal.close();
}

buds.forEach((bud) => {
  bud.addEventListener("click", handleBudClick);
});

closeModalBtn.addEventListener("click", closeMemory);

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
