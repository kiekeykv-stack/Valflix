const SERIES_DATA = [
  {
    id: "the-rookie-temporada-8",
    title: "The Rookie - Temporada 8",
    shortDescription:
      "Una nueva temporada llena de casos difíciles, decisiones de vida o muerte y giros inesperados para los oficiales del LAPD.",
    posterURL: "https://media.themoviedb.org/t/p/w500/70kTz0OmjjZe7zHvIDrq2iKW7PJ.jpg",
    bannerURL: "https://media.themoviedb.org/t/p/w500/70kTz0OmjjZe7zHvIDrq2iKW7PJ.jpg",
    episodes: [
      {
        number: 10,
        title: "Capítulo 10",
        embedURL: "https://drive.google.com/file/d/1fuwzSKdGBXHkBT7nBGvKN3N8OT9Gvv0d/preview",
      },
      {
        number: 11,
        title: "Capítulo 11",
        embedURL: "https://drive.google.com/file/d/1ZThMOpyU-WGb5Dazaa8GeVZgjZum52cg/preview",
      },
      {
        number: 12,
        title: "Capítulo 12",
        embedURL: "https://drive.google.com/file/d/11tELKqwBYaTDIBpwfBGaVqFHysFXxVqQ/preview",
      },
      {
        number: 13,
        title: "Capítulo 13",
        embedURL: "https://drive.google.com/file/d/1lFzp-VrSSEABTATyoYbF_sDDmXhtlmJm/preview",
      },
      {
        number: 14,
        title: "Capítulo 14",
        embedURL: "https://drive.google.com/file/d/1NzQU9DkdnLeep8xtXCG1DSLTyJTDPLF4/preview",
      },
      {
        number: 15,
        title: "Capítulo 15",
        embedURL: "https://drive.google.com/file/d/11eTXIjE5jk7LybiFegL2x_5TPT2aBcbG/preview",
      },
      {
        number: 16,
        title: "Capítulo 16",
        embedURL: "https://drive.google.com/file/d/18EuMl7cpk-PjprL2OBDE2ON6Fz8miBVz/preview",
      },
      {
        number: 17,
        title: "Capítulo 17",
        embedURL: "https://drive.google.com/file/d/PON_TU_ID_AQUI/preview",
      },
      {
        number: 18,
        title: "Capítulo 18",
        embedURL: "https://drive.google.com/file/d/16OlvL2QkosvQEIO3-tjMuQ_E9Z-oSYuH/preview",
      },
    ],
  },
];

const FALLBACK_POSTER =
  "https://placehold.co/500x750/1f1f1f/808080?text=Sin+Imagen";

const catalogEl = document.getElementById("catalog");
const heroTitleEl = document.getElementById("heroTitle");
const heroDescEl = document.getElementById("heroDesc");
const heroEl = document.getElementById("hero");
const headerEl = document.getElementById("header");
const searchInput = document.getElementById("searchInput");

const seriesModalOverlay = document.getElementById("seriesModalOverlay");
const seriesModalBanner = document.getElementById("seriesModalBanner");
const seriesModalTitle = document.getElementById("seriesModalTitle");
const seriesModalDesc = document.getElementById("seriesModalDesc");
const episodesListEl = document.getElementById("episodesList");
const closeSeriesModalBtn = document.getElementById("closeSeriesModal");

const playerModalOverlay = document.getElementById("playerModalOverlay");
const playerModal = playerModalOverlay.querySelector(".modal");
const playerModalTitle = document.getElementById("playerModalTitle");
const videoFrame = document.getElementById("videoFrame");
const playerSpinner = document.getElementById("playerSpinner");
const closePlayerModalBtn = document.getElementById("closePlayerModal");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const fullscreenTextBtn = document.getElementById("fullscreenTextBtn");
const openInDriveLink = document.getElementById("openInDriveLink");

let lastFocusedEl = null;

document.addEventListener("DOMContentLoaded", () => {
  renderCatalog(SERIES_DATA);
  setHeroFromFirstSeries();
});

function renderCatalog(seriesList) {
  catalogEl.innerHTML = "";

  if (seriesList.length === 0) {
    catalogEl.innerHTML = `<p class="no-results">No se encontraron series que coincidan con tu búsqueda.</p>`;
    return;
  }

  const row = document.createElement("section");
  row.className = "row";

  const rowTitle = document.createElement("h3");
  rowTitle.className = "row__title";
  rowTitle.textContent = "Series Destacadas";
  row.appendChild(rowTitle);

  const track = document.createElement("div");
  track.className = "row__track";

  seriesList.forEach((serie) => {
    track.appendChild(createCardElement(serie));
  });

  row.appendChild(track);
  catalogEl.appendChild(row);
}

function createCardElement(serie) {
  const card = document.createElement("article");
  card.className = "card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Ver detalles de ${serie.title}`);

  card.innerHTML = `
    <img src="${serie.posterURL}" alt="Poster de ${serie.title}" loading="lazy" />
    <div class="card__info">
      <h4>${serie.title}</h4>
      <span>${serie.episodes.length} episodio${serie.episodes.length !== 1 ? "s" : ""}</span>
    </div>
  `;

  const img = card.querySelector("img");
  img.addEventListener(
    "error",
    () => {
      img.src = FALLBACK_POSTER;
    },
    { once: true }
  );

  card.addEventListener("click", () => openSeriesModal(serie));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openSeriesModal(serie);
    }
  });

  return card;
}

function setHeroFromFirstSeries() {
  if (SERIES_DATA.length === 0) return;
  const first = SERIES_DATA[0];
  heroTitleEl.textContent = first.title;
  heroDescEl.textContent = first.shortDescription;

  heroEl.style.backgroundImage = `
    linear-gradient(135deg, rgba(20,20,20,0.6) 0%, rgba(20,20,20,0.95) 100%),
    url('${first.bannerURL || first.posterURL}')
  `;
  heroEl.style.backgroundSize = "cover";
  heroEl.style.backgroundPosition = "center";
}

function openSeriesModal(serie) {
  lastFocusedEl = document.activeElement;

  seriesModalTitle.textContent = serie.title;
  seriesModalDesc.textContent = serie.shortDescription;

  seriesModalBanner.style.backgroundImage = `url('${serie.bannerURL || serie.posterURL}')`;

  episodesListEl.innerHTML = "";
  serie.episodes.forEach((ep) => {
    const li = document.createElement("li");
    li.className = "episode-item";
    li.innerHTML = `
      <span class="episode-item__number">${ep.number}</span>
      <div class="episode-item__info">
        <h5>${ep.title}</h5>
      </div>
      <button class="episode-item__play" type="button">▶ <span>Reproducir</span></button>
    `;

    li.querySelector(".episode-item__play").addEventListener("click", () => {
      openPlayerModal(serie, ep);
    });

    episodesListEl.appendChild(li);
  });

  openModal(seriesModalOverlay);
}

function closeSeriesModal() {
  closeModal(seriesModalOverlay);
}

closeSeriesModalBtn.addEventListener("click", closeSeriesModal);
seriesModalOverlay.addEventListener("click", (e) => {
  if (e.target === seriesModalOverlay) closeSeriesModal();
});

function openPlayerModal(serie, episode) {
  lastFocusedEl = document.activeElement;

  playerModalTitle.textContent = `${serie.title} — Episodio ${episode.number}: ${episode.title}`;

  playerSpinner.classList.remove("hidden");
  videoFrame.style.opacity = "0";
  videoFrame.src = episode.embedURL;

  openInDriveLink.href = episode.embedURL.replace("/preview", "/view");

  openModal(playerModalOverlay);
}

function toggleFullscreen() {
  const el = playerModal;
  const isFullscreen =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!isFullscreen) {
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
}

fullscreenBtn.addEventListener("click", toggleFullscreen);
fullscreenTextBtn.addEventListener("click", toggleFullscreen);

videoFrame.addEventListener("load", () => {
  playerSpinner.classList.add("hidden");
  videoFrame.style.opacity = "1";
});

function closePlayerModal() {
  closeModal(playerModalOverlay);
  videoFrame.src = "";
  playerSpinner.classList.remove("hidden");
}

closePlayerModalBtn.addEventListener("click", closePlayerModal);
playerModalOverlay.addEventListener("click", (e) => {
  if (e.target === playerModalOverlay) closePlayerModal();
});

function openModal(overlayEl) {
  overlayEl.classList.add("active");
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  const closeBtn = overlayEl.querySelector(".modal__close");
  if (closeBtn) closeBtn.focus({ preventScroll: true });
}

function closeModal(overlayEl) {
  overlayEl.classList.remove("active");

  const anyModalOpen =
    seriesModalOverlay.classList.contains("active") ||
    playerModalOverlay.classList.contains("active");

  if (!anyModalOpen) {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }

  if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
    lastFocusedEl.focus({ preventScroll: true });
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (playerModalOverlay.classList.contains("active")) closePlayerModal();
    else if (seriesModalOverlay.classList.contains("active")) closeSeriesModal();
  }
});

function enableSwipeToClose(overlayEl, onClose) {
  const modalEl = overlayEl.querySelector(".modal");
  let startY = 0;
  let currentY = 0;
  let dragging = false;

  modalEl.addEventListener(
    "touchstart",
    (e) => {
      if (modalEl.scrollTop > 0) return;
      startY = e.touches[0].clientY;
      dragging = true;
      modalEl.style.transition = "none";
    },
    { passive: true }
  );

  modalEl.addEventListener(
    "touchmove",
    (e) => {
      if (!dragging) return;
      currentY = e.touches[0].clientY - startY;
      if (currentY > 0) {
        modalEl.style.transform = `translateY(${currentY}px)`;
      }
    },
    { passive: true }
  );

  modalEl.addEventListener("touchend", () => {
    if (!dragging) return;
    dragging = false;
    modalEl.style.transition = "";
    modalEl.style.transform = "";

    if (currentY > 100) {
      onClose();
    }
    currentY = 0;
  });
}

enableSwipeToClose(seriesModalOverlay, closeSeriesModal);
enableSwipeToClose(playerModalOverlay, closePlayerModal);

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const handleSearch = debounce((query) => {
  const normalized = query.trim().toLowerCase();
  const filtered = SERIES_DATA.filter((serie) =>
    serie.title.toLowerCase().includes(normalized)
  );
  renderCatalog(filtered);
}, 200);

searchInput.addEventListener("input", (e) => handleSearch(e.target.value));

window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > 40) {
      headerEl.classList.add("scrolled");
    } else {
      headerEl.classList.remove("scrolled");
    }
  },
  { passive: true }
);
