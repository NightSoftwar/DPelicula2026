document.querySelector(".login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("./data/users.json");
        const data = await response.json();

        const user = data.users.find(
            (u) => u.email === email && u.password === password
        );

        if (user) {
            showToast(`Bienvenido, ${user.name} 👋`);
            localStorage.setItem("loggedUser", JSON.stringify(user));

            // Redirigir luego de 1.5 s para que vea el mensaje
            setTimeout(() => {
                window.location.href = "./subirPeliculas.html";
            }, 1500);
        } else {
            showToast("❌ Correo o contraseña incorrectos");
        }
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
});

// --- Función de toast ---
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}
