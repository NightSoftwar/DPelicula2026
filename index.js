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
    const filtroGenero = document.getElementById("filtroGenero");
    const filtroAnio = document.getElementById("filtroAnio");

    let todasLasPeliculas = [];

    // ===============================
    // 1) CARGAR PELÍCULAS
    // ===============================
    async function cargarPeliculas() {
        lista.innerHTML = "<p class='loading'>Cargando películas...</p>";

        try {
            const q = query(collection(db, "peliculas"), orderBy("anio", "desc"));
            const snapshot = await getDocs(q);

            todasLasPeliculas = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            todasLasPeliculas.sort((a, b) =>
                a.titulo.localeCompare(b.titulo)
            );
            generarGeneros();
            generarAnios();
            mostrarPeliculas(todasLasPeliculas);

        } catch (error) {
            console.error("❌ Error al cargar películas:", error);
            lista.innerHTML = "<p class='error'>Error al cargar las películas 😞</p>";
        }
    }

    // ===============================
    // 2) MOSTRAR PELÍCULAS
    // ===============================
    function mostrarPeliculas(peliculas) {
        if (!peliculas.length) {
            lista.innerHTML = "<p class='empty'>No hay películas disponibles</p>";
            return;
        }

        lista.innerHTML = peliculas.map((p) => `
            <div class="pelicula-card">
                <img src="${p.portadaImg || './assets/no-image.jpg'}" alt="${p.titulo}">
                <div class="pelicula-info">
                    <h2>${p.titulo}</h2>
                    <p><strong>Géneros:</strong> ${p.generos.join(", ")}</p>
                    <p><b>Año:</b> ${p.anio}</p>
                    <p><b>Duración:</b> ${p.duracion} min</p>
                    <p><b>Rating:</b> ⭐ ${p.rating}</p>
                    <p><b>Director:</b> ${p.director}</p>
                    <button class="btn-ver" data-id="${p.id}">Ver detalles</button>
                </div>
            </div>
        `).join("");

        document.querySelectorAll(".btn-ver").forEach(btn => {
            btn.addEventListener("click", e => {
                const id = e.target.dataset.id;
                window.location.href = `./pelicula.html?id=${id}`;
            });
        });
    }

    // ===============================
    // 3) GENERAR AÑOS AUTOMÁTICOS
    // ===============================
    function generarAnios() {
        const anios = [...new Set(todasLasPeliculas.map(p => p.anio))].sort((a, b) => b - a);

        anios.forEach(a => {
            const op = document.createElement("option");
            op.value = a;
            op.textContent = a;
            filtroAnio.appendChild(op);
        });
    }

    // ===============================
    // 4) FILTROS (TEXTO / GENERO / AÑO)
    // ===============================
    function filtrarPeliculas() {
        const texto = buscador.value.toLowerCase().trim();
        const genero = filtroGenero.value;
        const anio = filtroAnio.value;

        const filtradas = todasLasPeliculas.filter(p => {
            const coincideTexto = p.titulo.toLowerCase().includes(texto);
            const coincideGenero = genero === "" || p.generos.includes(genero);
            const coincideAnio = anio === "" || p.anio == anio;

            return coincideTexto && coincideGenero && coincideAnio;
        });

        mostrarPeliculas(filtradas);
    }
    function generarGeneros() {
        // Extraer todos los géneros de todas las películas
        const generos = new Set();

        todasLasPeliculas.forEach(p => {
            if (Array.isArray(p.generos)) {
                p.generos.forEach(g => generos.add(g));
            }
        });

        // Ordenar alfabéticamente
        const listaOrdenada = [...generos].sort((a, b) => a.localeCompare(b));

        // Insertar en el select
        listaOrdenada.forEach(genero => {
            const op = document.createElement("option");
            op.value = genero;
            op.textContent = genero;
            filtroGenero.appendChild(op);
        });
    }
    // EVENTOS
    buscador.addEventListener("keyup", filtrarPeliculas);
    filtroGenero.addEventListener("change", filtrarPeliculas);
    filtroAnio.addEventListener("change", filtrarPeliculas);

    // INICIO
    cargarNovedades()
    cargarPeliculas();
    async function cargarNovedades() {
        try {
            const novedadesQuery = query(
                collection(db, "peliculas"),
                orderBy("fechaRegistro", "desc"),
                limit(4)
            );

            const snapshot = await getDocs(novedadesQuery);

            const novedades = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            mostrarNovedades(novedades);

        } catch (error) {
            console.error("❌ Error al cargar novedades:", error);
        }
    }
    function mostrarNovedades(novedades) {
        const contenedor = document.getElementById("novedadesLista");

        contenedor.innerHTML = novedades.map(p => `
        <div class="swiper-slide">
            <div class="novedad-card">
                <img src="${p.portadaImg}" alt="${p.titulo}">
                <div class="novedad-card-info">
                    <h3>${p.titulo}</h3>
                    <p>${p.anio}</p>
                    <button class="btn-ver" data-id="${p.id}">Ver detalles</button>
                </div>
            </div>
        </div>
    `).join("");

        inicializarSwiper();
    }
    function inicializarSwiper() {
        new Swiper(".novedades-swiper", {
            slidesPerView: 2,
            spaceBetween: 15,
            loop: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                600: { slidesPerView: 3 },
                900: { slidesPerView: 4 },
            }
        });
    }
});
