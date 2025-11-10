const usuario = document.getElementById("usuario");
const passWord = document.getElementById("clave");
const formularioInicioSeccion = document.getElementById("formulario");

formularioInicioSeccion.addEventListener("submit", function (e) {
    e.preventDefault();

    fetch('./Backend/usuarioAdmin.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON')
            }
            return response.json()
        })
        .then(data => {
            if (usuario.value === data.usuario && passWord.value === data.password) {
                Swal.fire({
                    icon: 'success',
                    title: 'Exito',
                    text: 'Inicio de sección correctamente',
                    // timer: 3000,
                    showConfirmButton: true,
                    background: '#1e1e2f',
                    color: '#ffffff',
                    confirmButtonColor: '#d4af37',
                    iconColor: '#d4af37',
                    customClass: {
                        popup: 'mi-popup',
                        title: 'mi-titulo',
                        confirmButton: 'mi-boton'
                    }
                })
                console.log("usuario y contraseña correcto")
            } else {
                alert("Usuario o Contraseña incorrecto")
            }
        })
        .catch(error => {
            console.error('Error:', error)
        })
})