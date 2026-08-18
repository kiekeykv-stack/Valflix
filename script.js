/* =========================================================
   STREAMFLIX — script.js
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
 *   id: "identificador-unico",         -> string único, sin espacios
 *   title: "Nombre de la serie",
 *   shortDescription: "Descripción corta que aparece en el modal",
 *   posterURL: "URL DE LA IMAGEN DEL POSTER",   <-- 👉 COLOCA AQUÍ LA IMAGEN (poster vertical, ideal 2:3, ej. 500x750px)
 *   bannerURL: "URL DE IMAGEN HORIZONTAL",      <-- 👉 (Opcional) imagen ancha para el encabezado del modal, ideal 16:7
 *   episodes: [
 *     {
 *       number: 1,
 *       title: "Título del episodio",
 *       embedURL: "URL DE EMBED DE GOOGLE DRIVE"  <-- 👉 COLOCA AQUÍ EL LINK DE GOOGLE DRIVE (ver instrucciones abajo)
 *     },
 *     ...
 *   ]
 * }
 *
 * -----------------------------------------------------------------
 * CÓMO OBTENER EL "embedURL" DESDE UN LINK NORMAL DE GOOGLE DRIVE:
 *
 * 1. En Google Drive, clic derecho sobre el video > "Obtener enlace"
 *    y asegúrate de que el acceso sea "Cualquier usuario con el enlace".
 *
 * 2. Copiarás algo como:
 *    https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/view?usp=sharing
 *
 * 3. Toma el ID del archivo (el texto largo entre "/d/" y "/view"):
 *    1AbCdEfGhIjKlMnOpQrStUvWxYz
 *
 * 4. Arma la URL de embed reemplazando "view?usp=sharing" por "preview":
 *    https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/preview
 *
 * 5. Esa última URL (".../preview") es la que debes pegar en "embedURL".
 *    Esta es la que realmente funciona dentro de un <iframe>.
 * -----------------------------------------------------------------
 */

const SERIES_DATA = [
  {
    id: "serie-ejemplo-1",
    title: "Ecos del Mañana",
    shortDescription:
      "En un futuro cercano, un grupo de científicos descubre una señal que podría cambiar el destino de la humanidad. Drama de ciencia ficción con giros inesperados en cada capítulo.",
    // 👉 POSTER: imagen vertical (recomendado 500x750px aprox.)
    posterURL: "https://placehold.co/500x750/1f1f1f/e50914?text=Ecos+del+Ma%C3%B1ana",
    // 👉 BANNER: imagen horizontal para el modal (recomendado 1280x560px aprox.)
    bannerURL: "https://placehold.co/1280x560/1f1f1f/e50914?text=Ecos+del+Ma%C3%B1ana",
    episodes: [
      {
        number: 1,
        title: "La Señal",
        // 👉 VIDEO: pega aquí tu URL de Drive ya convertida a formato /preview
        embedURL: "https://drive.google.com/file/d/EJEMPLO_ID_EPISODIO_1/preview",
      },
      {
        number: 2,
        title: "Contacto",
        embedURL: "https://drive.google.com/file/d/EJEMPLO_ID_EPISODIO_2/preview",
      },
      {
        number: 3,
        title: "El Precio del Silencio",
        embedURL: "https://drive.google.com/file/d/EJEMPLO_ID_EPISODIO_3/preview",
      },
    ],
  },
  {
    id: "serie-ejemplo-2",
    title: "Bajo la Misma Luna",
    shortDescription:
      "Una historia de amistad y superación ambientada en un pequeño pueblo costero, donde tres hermanos deben reconstruir su relación tras la pérdida de su padre.",
    posterURL: "https://placehold.co/500x750/1f1f1f/e50914?text=Bajo+la+Misma+Luna",
    bannerURL: "https://placehold.co/1280x560/1f1f1f/e50914?text=Bajo+la+Misma+Luna",
    episodes: [
      {
        number: 1,
        title: "El Regreso",
        embedURL: "https://drive.google.com/file/d/EJEMPLO_ID_EPISODIO_4/preview",
      },
      {
        number: 2,
        title: "Viejas Heridas",
        embedURL: "https://drive.google.com/file/d/EJEMPLO_ID_EPISODIO_5/preview",
      },
    ],
  },
  {
    id: "serie-ejemplo-3",
    title: "Código Nocturno",
    shortDescription:
      "Un thriller de espionaje sobre una hacker que descubre una conspiración internacional mientras intenta proteger a su familia de una organización que no perdona errores.",
    posterURL: "https://placehold.co/500x750/1f1f1f/e50914?text=C%C3%B3digo+Nocturno",
    bannerURL: "https://placehold.co/1280x560/1f1f1f/e50914?text=C%C3%B3digo+Nocturno",
    episodes: [
      {
        number: 1,
        title: "Acceso Denegado",
        embedURL: "https://drive.google.com/file/d/EJEMPLO_ID_EPISODIO_6/preview",
      },
      {
        number: 2,
        title: "Puerta Trasera",
        embedURL: "https://drive.google.com/file/d/EJEMPLO_ID_EPISODIO_7/preview",
      },
      {
        number: 3,
        title: "Firewall",
        embedURL: "https://drive.google.com/file/d/EJEMPLO_ID_EPISODIO_8/preview",
      },
      {
        number: 4,
        title: "Cero Rastro",
        embedURL: "https://drive.google.com/file/d/EJEMPLO_ID_EPISODIO_9/preview",
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
 * Recibe un arreglo de series (permite reutilizar la función al filtrar por búsqueda).
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
  rowTitle.textContent = "Mi Lista";
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
    linear-gradient(135deg, rgba(20,20,20,0.4) 0%, rgba(20,20,20,0.85) 100%),
    url('${first.bannerURL || first.posterURL}')
  `;
  document.getElementById("hero").style.backgroundSize = "cover";
  document.getElementById("hero").style.backgroundPosition = "center";
}

// =========================================================
// MODAL DE SERIE (descripción + lista de episodios)
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
// MODAL REPRODUCTOR (iframe con el video de Google Drive)
// =========================================================

function openPlayerModal(serie, episode) {
  playerModalTitle.textContent = `${serie.title} — Episodio ${episode.number}: ${episode.title}`;
  videoFrame.src = episode.embedURL; // 👈 Aquí se inyecta la URL /preview de Drive en el <iframe>

  playerModalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePlayerModal() {
  playerModalOverlay.classList.remove("active");
  videoFrame.src = ""; // detiene la reproducción al cerrar
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
// EFECTO DE HEADER AL HACER SCROLL (fondo sólido)
// =========================================================

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    headerEl.classList.add("scrolled");
  } else {
    headerEl.classList.remove("scrolled");
  }
});
