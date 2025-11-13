import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

// Obtener el ID desde la URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const main = document.querySelector(".pelicula-detalle");

async function cargarPelicula() {
  if (!id) {
    main.innerHTML = `<p class="error">Película no encontrada.</p>`;
    return;
  }

  try {
    const ref = doc(db, "peliculas", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      main.innerHTML = `<p class="error">No se encontró la película con ID ${id}.</p>`;
      return;
    }

    const pelicula = snap.data();

    main.innerHTML = `
  <div class='container-pelicula'>
    <div class="imagenes">
      ${pelicula.imagenes.map((img) => `
        <img src="${img}" alt="${pelicula.titulo}">
      `).join("")}
    </div>

    <div class="info">
      <h1>${pelicula.titulo}</h1>
<p><strong>Géneros:</strong> ${pelicula.generos.join(", ")}</p>
      <p><strong>Año:</strong> ${pelicula.anio}</p>
      <p>${pelicula.descripcion}</p>

            <div class="trailer">
        <iframe
          src="${pelicula.trailer.replace("watch?v=", "embed/")}" 
          title="Trailer de ${pelicula.titulo}" 
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>
      </div>
      <!-- 🔹 NUEVA SECCIÓN DETALLES -->
      <div class="detalles">
        <h2>🎬 Características</h2>
        <ul>
          <li><strong>Duración:</strong> ${pelicula.duracion || "N/A"} min</li>
          <li><strong>Idioma:</strong> ${pelicula.idioma || "Español / Latino"}</li>
          <li><strong>Audio:</strong> ${pelicula.audio || "Estéreo 2.0"}</li>
          <li><strong>Formato:</strong> ${pelicula.formato || "MP4"}</li>
          <li><strong>Resolución:</strong> ${pelicula.resolucion || "1080p"}</li>
        </ul>
      </div>


      <div class="acciones">
        <a class="btn-descargar" href="${pelicula.linkDescarga || '#'}" target="_blank" rel="noopener noreferrer">
          ⬇ Descargar Película
        </a>
        <a class="btn-volver" href="./index.html">⬅ Volver</a>
      </div>
    </div>
  </div>
`;



  } catch (err) {
    console.error(err);
    main.innerHTML = `<p class="error">Error al cargar la película.</p>`;
  }
}

cargarPelicula();
