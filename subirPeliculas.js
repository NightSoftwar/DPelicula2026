import { db } from "./firebase.js";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
document.addEventListener("DOMContentLoaded", () => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    const form = document.getElementById("formPelicula");
    const toast = document.getElementById("toast");

    // --- Protección de acceso ---
    if (!loggedUser) {
        showToast("⚠️ No tienes permiso para estar aquí. Serás redirigido...", "error");
        setTimeout(() => (window.location.href = "../index.html"), 2500);
        return;
    }

    // --- Evento Submit ---
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const pelicula = {
            titulo: form.titulo.value.trim(),
            descripcion: form.descripcion.value.trim(),
            duracion: parseInt(form.duracion.value),
            anio: parseInt(form.anio.value),
            genero: form.genero.value,
            director: form.director.value.trim(),
            portadaImg: form.portadaImg.value.trim(),
            imagenes: [
                form.imagen1.value,
                form.imagen2.value,
                form.imagen3.value
            ],
            rating: parseFloat(form.rating.value) || "N/A",
            urlTrailer: form.urlTrailer.value.trim(),
            idioma: form.idioma.value.trim(),
            audio: form.audio.value.trim(),
            formato: form.formato.value.trim(),
            resolucion: form.resolucion.value.trim(),
            linkDescarga: form.linkDescarga.value.trim(),
            usuario: loggedUser.name,
            fechaRegistro: serverTimestamp()
        };

        try {
            // === 1️⃣ Obtener el documento contador ===
            const contadorRef = doc(db, "config", "contadorPeliculas");
            const contadorSnap = await getDoc(contadorRef);

            let nuevoId = 1;

            if (contadorSnap.exists()) {
                // Ya existe → aumentar en 1
                nuevoId = contadorSnap.data().ultimoId + 1;
                await updateDoc(contadorRef, { ultimoId: nuevoId });
            } else {
                // No existe → crear contador
                await setDoc(contadorRef, { ultimoId: 1 });
            }

            // === 2️⃣ Guardar la película con ID incremental ===
            await setDoc(doc(db, "peliculas", nuevoId.toString()), pelicula);

            console.log("🎬 Película registrada con ID:", nuevoId);
            showToast(`✅ Película registrada con ID #${nuevoId}`, "success");
            form.reset();

        } catch (error) {
            console.error("❌ Error al guardar película:", error);
            showToast("Error al guardar la película 😞", "error");
        }
    });

    // --- Toast function ---
    function showToast(msg, tipo = "info") {
        toast.textContent = msg;
        toast.style.borderLeftColor = tipo === "error" ? "var(--color-red)" : "#00b894";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3200);
    }
});