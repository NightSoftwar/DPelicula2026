import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    const lista = document.getElementById("peliculasLista");
    const buscador = document.querySelector(".search-bar input");

    let todasLasPeliculas = [];

    // === 1️⃣ Cargar las películas desde Firestore ===
    async function cargarPeliculas() {
        lista.innerHTML = "<p class='loading'>Cargando películas...</p>";

        try {
            const q = query(collection(db, "peliculas"), orderBy("anio", "desc"), limit(10));
            const snapshot = await getDocs(q);

            todasLasPeliculas = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            mostrarPeliculas(todasLasPeliculas);
        } catch (error) {
            console.error("❌ Error al cargar películas:", error);
            lista.innerHTML = "<p class='error'>Error al cargar las películas 😞</p>";
        }
    }

    // === 2️⃣ Mostrar las películas en tarjetas ===
    function mostrarPeliculas(peliculas) {
        if (!peliculas.length) {
            lista.innerHTML = "<p class='empty'>No hay películas disponibles</p>";
            return;
        }

        lista.innerHTML = peliculas
            .map(
                (p) => `
        <div class="pelicula-card">
          <img src="${p.portadaImg || './assets/no-image.jpg'}" alt="${p.titulo}">
          <div class="pelicula-info">
            <h2>${p.titulo}</h2>
            <p><b>Género:</b> ${p.genero}</p>
            <p><b>Año:</b> ${p.anio}</p>
            <p><b>Duración:</b> ${p.duracion} min</p>
            <p><b>Rating:</b> ⭐ ${p.rating}</p>
            <p><b>Director:</b> ${p.director}</p>
            <button class="btn-ver" data-id="${p.id}">Ver detalles</button>
          </div>
        </div>
      `
            )
            .join("");

        // Evento para cada botón
        document.querySelectorAll(".btn-ver").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                // Por ahora, redirige a una página temporal generada
                const url = `./pelicula.html?id=${id}`;
                window.location.href = url;
            });
        });
    }

    // === 3️⃣ Filtro de búsqueda ===
    buscador.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            const texto = buscador.value.toLowerCase().trim();
            const filtradas = todasLasPeliculas.filter((p) =>
                p.titulo.toLowerCase().includes(texto)
            );
            mostrarPeliculas(filtradas);
        }
    });

    // === 4️⃣ Cargar al inicio ===
    cargarPeliculas();
});