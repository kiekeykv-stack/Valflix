/* =========================================================
   VALFLIX — script.js
   =========================================================
   ¿CÓMO AGREGAR TUS PROPIAS SERIES?
   Edita únicamente el arreglo SERIES_DATA de abajo.
   No es necesario tocar el resto del archivo.
   ========================================================= */

/**
 * SERIES_DATA
 * -----------------------------------------------------------------
 * Cada objeto representa UNA serie. Estructura:
 *
 * {
 *   id: "identificador-unico",
 *   title: "Nombre de la serie",
 *   shortDescription: "Descripción corta que aparece en el modal",
 *   posterURL: "URL DE LA IMAGEN DEL POSTER",   <-- 👉 COLOCA AQUÍ LA IMAGEN (ideal 2:3, ej. 500x750px)
 *   bannerURL: "URL DE IMAGEN HORIZONTAL",      <-- 👉 (Opcional) imagen ancha para el encabezado del modal, ideal 16:7
 *   episodes: [
 *     {
 *       number: 1,
 *       title: "Título del episodio",
 *       embedURL: "URL DE EMBED DE GOOGLE DRIVE"  <-- 👉 COLOCA AQUÍ EL LINK DE GOOGLE DRIVE (formato /preview)
 *     },
 *     ...
 *   ]
 * }
 *
 * -----------------------------------------------------------------
 * CÓMO OBTENER EL "embedURL" DESDE UN LINK NORMAL DE GOOGLE DRIVE:
 * 1. Clic derecho sobre el video en Drive > "Obtener enlace" (acceso: "Cualquiera con el enlace").
 * 2. Copia el ID del archivo (texto largo entre "/d/" y "/view").
 * 3. Arma la URL final: https://drive.google.com/file/d/TU_ID_AQUI/preview
 * -----------------------------------------------------------------
 */

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
  // 👉 AGREGA MÁS SERIES AQUÍ copiando la estructura de arriba y
  //    pegando un objeto adicional dentro de este arreglo.
];

/* =========================================================
   A partir de aquí: lógica de la aplicación.
   No es necesario editar nada más abajo para agregar contenido.
   ========================================================= */

// Imagen de respaldo si un poster no carga (link roto, CORS, etc.)
const FALLBACK_POSTER =
  "https://placehold.co/500x750/1f1f1f/808080?text=Sin+Imagen";

// ---------- Referencias al DOM ----------
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
const playerModalTitle = document.getElementById("playerModalTitle");
const videoFrame = document.getElementById("videoFrame");
const playerSpinner = document.getElementById("playerSpinner");
const closePlayerModalBtn = document.getElementById("closePlayerModal");

// Recuerda qué elemento tenía el foco antes de abrir un modal (accesibilidad)
let lastFocusedEl = null;

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
  card.tabIndex = 0; // permite foco con teclado (accesibilidad)
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Ver detalles de ${serie.title}`);

  card.innerHTML = `
    <img src="${serie.posterURL}" alt="Poster de ${serie.title}" loading="lazy" />
    <div class="card__info">
      <h4>${serie.title}</h4>
      <span>${serie.episodes.length} episodio${serie.episodes.length !== 1 ? "s" : ""}</span>
    </div>
  `;

  // Si la imagen del poster falla en cargar, se reemplaza por un placeholder
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

/**
 * Muestra en el hero (banner superior) la primera serie del catálogo.
 */
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

// =========================================================
// MODAL DE SERIE
// =========================================================

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

// =========================================================
// MODAL REPRODUCTOR
// =========================================================

function openPlayerModal(serie, episode) {
  lastFocusedEl = document.activeElement;

  playerModalTitle.textContent = `${serie.title} — Episodio ${episode.number}: ${episode.title}`;

  // Muestra el spinner mientras el iframe de Drive carga
  playerSpinner.classList.remove("hidden");
  videoFrame.style.opacity = "0";
  videoFrame.src = episode.embedURL; // 👈 Aquí se inyecta la URL /preview de Drive en el <iframe>

  openModal(playerModalOverlay);
}

// Cuando el iframe termina de cargar, se oculta el spinner
videoFrame.addEventListener("load", () => {
  playerSpinner.classList.add("hidden");
  videoFrame.style.opacity = "1";
});

function closePlayerModal() {
  closeModal(playerModalOverlay);
  videoFrame.src = ""; // detiene la reproducción al cerrar
  playerSpinner.classList.remove("hidden");
}

closePlayerModalBtn.addEventListener("click", closePlayerModal);
playerModalOverlay.addEventListener("click", (e) => {
  if (e.target === playerModalOverlay) closePlayerModal();
});

// =========================================================
// HELPERS COMPARTIDOS DE MODALES (abrir/cerrar, foco, scroll lock)
// =========================================================

function openModal(overlayEl) {
  overlayEl.classList.add("active");
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  // Mueve el foco al botón de cerrar del modal recién abierto (accesibilidad)
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

  // Devuelve el foco a lo que el usuario tenía seleccionado antes de abrir el modal
  if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
    lastFocusedEl.focus({ preventScroll: true });
  }
}

// Cerrar modales con la tecla Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (playerModalOverlay.classList.contains("active")) closePlayerModal();
    else if (seriesModalOverlay.classList.contains("active")) closeSeriesModal();
  }
});

// =========================================================
// DESLIZAR HACIA ABAJO PARA CERRAR (gesto típico en móvil)
// =========================================================

function enableSwipeToClose(overlayEl, onClose) {
  const modalEl = overlayEl.querySelector(".modal");
  let startY = 0;
  let currentY = 0;
  let dragging = false;

  modalEl.addEventListener(
    "touchstart",
    (e) => {
      // Solo activa el gesto si el modal está en su tope de scroll (evita
      // interferir con el scroll normal del contenido del modal)
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

    // Si el usuario deslizó más de 100px hacia abajo, cierra el modal
    if (currentY > 100) {
      onClose();
    }
    currentY = 0;
  });
}

enableSwipeToClose(seriesModalOverlay, closeSeriesModal);
enableSwipeToClose(playerModalOverlay, closePlayerModal);

// =========================================================
// BÚSQUEDA EN VIVO (con debounce para no re-renderizar en cada tecla)
// =========================================================

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

// =========================================================
// EFECTO DE HEADER AL HACER SCROLL
// =========================================================

window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > 40) {
      headerEl.classList.add("scrolled");
    } else {
      headerEl.classList.remove("scrolled");
    }
  },
  { passive: true } // mejora el rendimiento de scroll en móvil
);
