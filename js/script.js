// To add or change work, edit this list only.
// category: medical | branding | illustration
// images: files in assets/work/, first one is the card thumbnail
// thumb (optional): use a different image as the thumbnail, e.g. thumb: 2
const projects = [
  {
    category: "medical",
    title: "Discover",
    images: ["discover-1.png", "discover-2.png", "discover-3.png"]
  },
  {
    category: "medical",
    title: "Spotlight",
    images: ["spotlight-1.png", "spotlight-2.png", "spotlight-3.png", "spotlight-4.png"]
  },
  {
    category: "medical",
    title: "Pulse",
    images: ["pulse-1.png", "pulse-2.png"]
  },
  {
    category: "medical",
    title: "Infographics",
    images: ["infographics-1.png", "infographics-2.png"]
  },
  {
    category: "branding",
    title: "Atlas",
    images: ["atlas-1.png", "atlas-2.png", "atlas-3.png", "atlas-4.png"]
  },
  {
    category: "branding",
    title: "Mixology",
    images: ["mixology-1.png", "mixology-2.png"]
  },
  {
    category: "branding",
    title: "Product Design",
    images: ["product-design-1.png", "product-design-2.png", "product-design-3.png"],
    thumb: 3
  },
  {
    category: "illustration",
    title: "Music",
    images: ["music-1.png", "music-2.png", "music-3.png"],
    thumb: 2
  },
  {
    category: "illustration",
    title: "Landscapes",
    images: ["landscapes-1.png", "landscapes-2.png", "landscapes-3.png", "landscapes-4.png", "landscapes-5.png"]
  }
];

const workPath = "assets/work/";

// ---------- Build the cards ----------

document.querySelectorAll(".work__grid").forEach((grid) => {
  const category = grid.dataset.category;
  projects
    .filter((project) => project.category === category)
    .forEach((project) => {
      const card = document.createElement("button");
      card.className = "card";
      card.type = "button";
      const thumb = project.images[(project.thumb || 1) - 1];
      card.innerHTML = `
        <img class="card__image" src="${workPath}${thumb}" alt="${project.title}" loading="lazy">
        <span class="card__label">${project.title}</span>`;
      card.addEventListener("click", () => openModal(project));
      grid.appendChild(card);
    });
});

// ---------- Mobile menu ----------

const siteNav = document.querySelector(".site-nav");
const menuToggle = siteNav.querySelector(".site-nav__toggle");

function setMenu(open) {
  siteNav.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", open);
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
}

menuToggle.addEventListener("click", () => {
  siteNav.classList.add("menu-animated");
  setMenu(!siteNav.classList.contains("menu-open"));
});

// crossing the breakpoint: snap the menu shut with no fade, and release the scroll lock
matchMedia("(max-width: 40rem)").addEventListener("change", () => {
  siteNav.classList.remove("menu-animated");
  setMenu(false);
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    setMenu(false);
    if (!target) return;
    // scroll ourselves: the default jump is swallowed while the menu has the page locked
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", link.getAttribute("href"));
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteNav.classList.contains("menu-open")) setMenu(false);
});

// ---------- Modal ----------

const modal = document.getElementById("modal");
const modalImage = modal.querySelector(".modal__image");
const modalTitle = modal.querySelector(".modal__title");
const modalCounter = modal.querySelector(".modal__counter");
const prevButton = modal.querySelector(".modal__arrow--prev");
const nextButton = modal.querySelector(".modal__arrow--next");
const closeButton = modal.querySelector(".modal__close");

let currentProject = null;
let currentIndex = 0;
let lastFocused = null;

function openModal(project) {
  currentProject = project;
  currentIndex = 0;
  lastFocused = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  showImage();
  closeButton.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

function showImage() {
  const { title, images } = currentProject;
  modalImage.src = workPath + images[currentIndex];
  modalImage.alt = `${title} — image ${currentIndex + 1} of ${images.length}`;
  modalTitle.textContent = title;
  modalCounter.textContent = images.length > 1 ? `${currentIndex + 1} / ${images.length}` : "";
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === images.length - 1;
}

function step(direction) {
  const next = currentIndex + direction;
  if (!currentProject || next < 0 || next >= currentProject.images.length) return;
  currentIndex = next;
  showImage();
}

prevButton.addEventListener("click", () => step(-1));
nextButton.addEventListener("click", () => step(1));
closeButton.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal || event.target.classList.contains("modal__stage")) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (modal.hidden) return;
  if (event.key === "Escape") closeModal();
  if (event.key === "ArrowLeft") step(-1);
  if (event.key === "ArrowRight") step(1);
});

// Swipe between images on touch screens
let touchStartX = 0;

modal.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

modal.addEventListener("touchend", (event) => {
  const deltaX = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(deltaX) > 48) step(deltaX < 0 ? 1 : -1);
}, { passive: true });
