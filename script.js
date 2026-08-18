/* =========================================================
   STREAMFLIX — script.js
   ========================================================= */

const SERIES_DATA = [
  {
    id: "rukie",
    title: "Rukie",
    shortDescription:
      "Empezar de nuevo no es fácil, especialmente para John Nolan, quien tras un incidente decide perseguir su sueño de ser policía en Los Ángeles.",
    // 👉 POSTER OFICIAL
    posterURL: "https://media.themoviedb.org/t/p/w500/70kTz0OmjjZe7zHvIDrq2iKW7PJ.jpg",
    // 👉 BANNER
    bannerURL: "https://media.themoviedb.org/t/p/w500/70kTz0OmjjZe7zHvIDrq2iKW7PJ.jpg",
    episodes: [
      {
        number: 1,
        title: "Piloto",
        embedURL: "https://drive.google.com/file/d/EJEMPLO_ID_EPISODIO_1/preview",
      },
      {
        number: 2,
        title: "En pos de la justicia",
        embedURL: "https://drive.google.com/file/d/1c5uOrpgRvopmq4vXxcihTWT6K_BFVFnZ/preview",
      },
      {
        number: 3,
        title: "La fiera",
        embedURL: "https://drive.google.com/file/d/1YY_qG5LkdhbU5lZR9DJs8Jd0MW0EVCYp/preview",
      },
      {
        number: 4,
        title: "Sabotaje",
        embedURL: "https://drive.google.com/file/d/1icOu0q5a7avNu2Z5IsKxi0fslBWlD2Bb/preview",
      },
      {
        number: 5,
        title: "Aislamiento",
        embedURL: "https://drive.google.com/file/d/1LDYQWyhbacL8Oos1r2wxfKatQ33qISCp/preview",
      },
      {
        number: 6,
        title: "Relaciones",
        embedURL: "https://drive.google.com/file/d/1lq8DJiuFNP8eA0VdfJyVZ_Nveks90BSw/preview",
      },
    ],
  },
];

/* =========================================================
   A partir de aquí: lógica de la aplicación.
   ========================================================= */

// ---------- Referencias al DOM ----------
const catalogEl = document.getElementById("catalog");
const heroTitleEl = document.getElementById("heroTitle");
const heroDescEl = document.getElementById("heroDesc");
const headerEl = document.getElementById("header");
const searchInput = document.getElementById("searchInput");

const seriesModalOverlay = document.getElementById("seriesModalOverlay");
const seriesModalBanner = document.getElementById("seriesModalBanner");
const seriesModalTitle = document.getElementById("seriesModalTitle");
const seriesModalDesc = document.getElementById("seriesModalDesc");
const episodesListEl = document.getElementById("episodesList");
const closeSeriesModalBtn = document.getElementById("closeSeriesModal");

const playerModalOverlay = document.getElementById("playerModalOverlay");
const playerModalTitle = document.getElementById("playerModalTitle");
const videoFrame = document.getElementById("videoFrame");
const closePlayerModalBtn = document.getElementById("closePlayerModal");

// ---------- Inicialización ----------
document.addEventListener("DOMContentLoaded", () => {
  renderCatalog(SERIES_DATA);
  setHeroFromFirstSeries();
});

/**
 * Pinta la fila de tarjetas en el catálogo.
 */
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

/**
 * Crea el elemento DOM de una tarjeta de serie individual.
 */
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

  card.addEventListener("click", () => openSeriesModal(serie));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openSeriesModal(serie);
    }
  });

  return card;
}

/**
 * Muestra en el hero (banner superior) la primera serie del catálogo.
 */
function setHeroFromFirstSeries() {
  if (SERIES_DATA.length === 0) return;
  const first = SERIES_DATA[0];
  heroTitleEl.textContent = first.title;
  heroDescEl.textContent = first.shortDescription;

  document.getElementById("hero").style.backgroundImage = `
    linear-gradient(135deg, rgba(20,20,20,0.6) 0%, rgba(20,20,20,0.95) 100%),
    url('${first.bannerURL || first.posterURL}')
  `;
  document.getElementById("hero").style.backgroundSize = "cover";
  document.getElementById("hero").style.backgroundPosition = "center";
}

// =========================================================
// MODAL DE SERIE
// =========================================================

function openSeriesModal(serie) {
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
      <button class="episode-item__play" type="button">▶ Reproducir</button>
    `;

    li.querySelector(".episode-item__play").addEventListener("click", () => {
      openPlayerModal(serie, ep);
    });

    episodesListEl.appendChild(li);
  });

  seriesModalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeSeriesModal() {
  seriesModalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

closeSeriesModalBtn.addEventListener("click", closeSeriesModal);
seriesModalOverlay.addEventListener("click", (e) => {
  if (e.target === seriesModalOverlay) closeSeriesModal();
});

// =========================================================
// MODAL REPRODUCTOR
// =========================================================

function openPlayerModal(serie, episode) {
  playerModalTitle.textContent = `${serie.title} — Episodio ${episode.number}: ${episode.title}`;
  videoFrame.src = episode.embedURL;

  playerModalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePlayerModal() {
  playerModalOverlay.classList.remove("active");
  videoFrame.src = "";
  document.body.style.overflow = seriesModalOverlay.classList.contains("active") ? "hidden" : "";
}

closePlayerModalBtn.addEventListener("click", closePlayerModal);
playerModalOverlay.addEventListener("click", (e) => {
  if (e.target === playerModalOverlay) closePlayerModal();
});

// Cerrar modales con la tecla Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (playerModalOverlay.classList.contains("active")) closePlayerModal();
    else if (seriesModalOverlay.classList.contains("active")) closeSeriesModal();
  }
});

// =========================================================
// BÚSQUEDA EN VIVO
// =========================================================

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim().toLowerCase();
  const filtered = SERIES_DATA.filter((serie) =>
    serie.title.toLowerCase().includes(query)
  );
  renderCatalog(filtered);
});

// =========================================================
// EFECTO DE HEADER AL HACER SCROLL
// =========================================================

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    headerEl.classList.add("scrolled");
  } else {
    headerEl.classList.remove("scrolled");
  }
});
