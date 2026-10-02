// To add or change work, edit this list only.
// category: medical | branding | illustration
// images: files in assets/work/, first one is the card thumbnail
// a .mp4 can be listed too (not as the first item), with a matching name-poster.webp beside it
// thumb (optional): use a different image as the thumbnail, e.g. thumb: 2
// thumbPosition (optional): where the thumbnail crop is centred, e.g. thumbPosition: "50% 20%"
const projects = [
  {
    category: "medical",
    title: "Discover",
    images: ["discover-1.webp", "discover-2.webp", "discover-3.webp", "discover-4.webp", "discover-5.webp", "discover-6.webp", "discover-7.webp", "discover-8.webp", "discover-9.webp"],
    thumbPosition: "50% 15%"
  },
  {
    category: "medical",
    title: "Spotlight",
    images: ["spotlight-1.webp", "spotlight-2.webp", "spotlight-3.webp", "spotlight-4.webp", "spotlight-5.webp"]
  },
  {
    category: "medical",
    title: "Pulse",
    images: ["pulse-1.webp", "pulse-2.webp", "pulse-3.mp4"]
  },
  {
    category: "medical",
    title: "Infographics",
    images: ["infographics-1.webp", "infographics-2.webp"]
  },
  {
    category: "branding",
    title: "Atlas",
    images: ["atlas-1.webp", "atlas-2.webp", "atlas-3.webp", "atlas-4.webp", "atlas-5.webp"]
  },
  {
    category: "branding",
    title: "Mixology",
    images: ["mixology-1.webp", "mixology-2.webp", "mixology-3.webp", "mixology-4.webp"]
  },
  {
    category: "branding",
    title: "Product Design",
    images: ["product-design-1.webp", "product-design-2.webp", "product-design-3.webp"],
    thumb: 3,
    thumbPosition: "50% 75%"
  },
  {
    category: "branding",
    title: "Merck Portal",
    images: ["merck-1.webp", "merck-2.webp", "merck-3.webp", "merck-4.webp", "merck-5.webp"]
  },
  {
    category: "illustration",
    title: "Music",
    images: ["music-1.webp", "music-2.webp", "music-3.webp", "music-4.webp"],
    thumb: 2
  },
  {
    category: "illustration",
    title: "Landscapes",
    images: ["landscapes-1.webp", "landscapes-2.webp", "landscapes-3.webp", "landscapes-4.webp", "landscapes-5.webp"]
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
        <img class="card__image" src="${workPath}${thumb}" alt="${project.title}" loading="lazy"${project.thumbPosition ? ` style="object-position: ${project.thumbPosition}"` : ""}>
        <span class="card__label">${project.title}</span>`;
      card.addEventListener("click", () => openModal(project));
      grid.appendChild(card);
    });
});

// ---------- Back to top ----------
// the header carrying #top is position: fixed, so its scroll position never
// changes and the browser's native anchor jump has nothing to scroll to

document.querySelectorAll('a[href="#top"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
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
const modalVideo = modal.querySelector(".modal__video");
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
  modalVideo.pause();
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

function showImage() {
  const { title, images } = currentProject;
  const file = images[currentIndex];
  const isVideo = file.endsWith(".mp4");
  modalVideo.pause();
  modalImage.hidden = isVideo;
  modalVideo.hidden = !isVideo;
  if (isVideo) {
    modalVideo.poster = workPath + file.replace(".mp4", "-poster.webp");
    modalVideo.src = workPath + file;
    modalVideo.setAttribute("aria-label", `${title} — video ${currentIndex + 1} of ${images.length}`);
  } else {
    modalImage.src = workPath + file;
    modalImage.alt = `${title} — image ${currentIndex + 1} of ${images.length}`;
  }
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
