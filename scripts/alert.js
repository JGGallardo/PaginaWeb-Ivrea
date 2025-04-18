export function mostrarNotificacion(mensaje, duracion = 3000) {
    const notificacion = document.getElementById("notificacion");
    notificacion.textContent = mensaje;
    notificacion.style.display = "block";
    setTimeout(() => {
        notificacion.style.display = "none";
    }, duracion);
}

export function sweetalert(mensaje, posicion, tiempo) {
    Swal.fire({
        position: posicion,
        icon: "success",
        title: mensaje,
        showConfirmButton: false,
        timer: tiempo,
    });
}
