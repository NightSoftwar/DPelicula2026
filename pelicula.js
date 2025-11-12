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
      <p><strong>Género:</strong> ${pelicula.genero}</p>
      <p><strong>Año:</strong> ${pelicula.anio}</p>
      <p>${pelicula.descripcion}</p>
      <a class="btn-volver" href="./index.html">⬅ Volver</a>
    </div>
  </div>
`;

    } catch (err) {
        console.error(err);
        main.innerHTML = `<p class="error">Error al cargar la película.</p>`;
    }
}

cargarPelicula();
