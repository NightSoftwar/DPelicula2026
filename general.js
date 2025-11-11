document.addEventListener("DOMContentLoaded", () => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    const loginLink = document.querySelector('#mobileMenu a[href="./login.html"]');

    if (loggedUser && loginLink) {
        // Cambiar texto a "Cerrar Sesión"
        loginLink.textContent = "Cerrar Sesión";
        loginLink.href = "#";

        // Referencias al modal
        const logoutModal = document.getElementById("logoutModal");
        const logoutMessage = document.getElementById("logoutMessage");
        const cancelLogout = document.getElementById("cancelLogout");
        const confirmLogout = document.getElementById("confirmLogout");

        loginLink.addEventListener("click", (e) => {
            e.preventDefault();

            // Personaliza el mensaje con el nombre
            logoutMessage.innerHTML = `¿Seguro que deseas cerrar sesión<br>${loggedUser.name} ?`;
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
            setTimeout(() => {
                window.location.href = "./index.html";
            }, 500);
        });
    }
});
