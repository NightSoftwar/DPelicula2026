document.addEventListener("DOMContentLoaded", () => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    const mobileMenu = document.getElementById("mobileMenu");
    const loginLink = mobileMenu.querySelector('a[href="./login.html"]');
    const homeLink = mobileMenu.querySelector('a[href="./index.html"]');

    if (loggedUser && loginLink) {
        // Cambiar texto a "Cerrar Sesión"
        loginLink.textContent = "Cerrar Sesión";
        loginLink.href = "#";

        // Crear enlace "Subir Películas"
        const uploadLink = document.createElement("a");
        uploadLink.href = "./subirPeliculas.html";
        uploadLink.textContent = "Subir Películas";

        // Insertar justo después de "Inicio"
        if (homeLink && homeLink.nextSibling) {
            mobileMenu.insertBefore(uploadLink, homeLink.nextSibling);
        } else {
            mobileMenu.appendChild(uploadLink);
        }

        // === Manejo del modal de cierre de sesión ===
        const logoutModal = document.getElementById("logoutModal");
        const logoutMessage = document.getElementById("logoutMessage");
        const cancelLogout = document.getElementById("cancelLogout");
        const confirmLogout = document.getElementById("confirmLogout");

        loginLink.addEventListener("click", (e) => {
            e.preventDefault();
            logoutMessage.innerHTML = `¿Seguro que deseas cerrar sesión?<br><strong>${loggedUser.name}</strong>`;
            logoutModal.classList.add("active");
        });

        cancelLogout.addEventListener("click", () => {
            logoutModal.classList.remove("active");
        });

        confirmLogout.addEventListener("click", () => {
            localStorage.removeItem("loggedUser");
            logoutModal.classList.remove("active");

            // Breve transición antes de salir
            const overlay = document.createElement("div");
            overlay.style.position = "fixed";
            overlay.style.top = 0;
            overlay.style.left = 0;
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.backgroundColor = "black";
            overlay.style.opacity = 0;
            overlay.style.transition = "opacity 0.4s ease";
            document.body.appendChild(overlay);

            setTimeout(() => (overlay.style.opacity = 1), 10);
            setTimeout(() => (window.location.href = "./index.html"), 500);
        });
    }
});
