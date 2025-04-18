import { sweetalert, mostrarNotificacion } from "./alert.js";

let carrito = [];
export { carrito };

// Actualiza el contador de productos del carrito
export function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    let contadorCarrito = document.querySelector(".contadorCarrito");
    const cantidadTotal = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    contadorCarrito.innerText = cantidadTotal;
}

// Carga el carrito guardado en el localStorage al cargar la pagina
export function cargarCarritoGuardado() {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        return JSON.parse(carritoGuardado);
    }
    return [];
}

// Vacía el carrito, actualiza la vista del contador, muestra una notificación y cierra el offcanvas
function vaciarCarrito() {
    carrito.length = 0;
    guardarCarrito(carrito);
    actualizarVistaCarrito(carrito);
    sweetalert("Carrito vaciado correctamente", "top-start", "700");

    // Cerrar el offcanvas
    const offcanvasElement = document.getElementById("offcanvasRight");
    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
    if (offcanvas) {
        offcanvas.hide();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Inicializar el contador del carrito
    const contadorCarrito = document.querySelector(".contadorCarrito");
    if (contadorCarrito) {
        const cantidadTotal = carrito.reduce((total, producto) => total + producto.cantidad, 0);
        contadorCarrito.innerText = cantidadTotal;
    }

    // Inicializar botón de vaciar carrito
    const botonVaciar = document.querySelector(".btnVaciarCarrito");
    if (botonVaciar) {
        botonVaciar.addEventListener("click", vaciarCarrito);
    }

    // Inicializar vista del carrito
    actualizarVistaCarrito(carrito);
});

function finalizarCompra() {
    if (carrito.length === 0) {
        mostrarNotificacion("El carrito está vacío");
        return;
    }

    // Vaciar el carrito
    carrito.length = 0;

    // Actualizar localStorage y UI
    guardarCarrito(carrito);
    actualizarVistaCarrito(carrito);

    // Mostrar notificación de compra exitosa
    sweetalert("Gracias por su compra", "center", "1500");

    // Cerrar el offcanvas del carrito
    const offcanvasElement = document.getElementById("offcanvasRight");
    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
    if (offcanvas) {
        offcanvas.hide();
    }
}

export function actualizarVistaCarrito(carrito) {
    const contenedorCarrito = document.querySelector(".contenedor-carrito");
    if (!contenedorCarrito) return;

    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>El carrito está vacío</p>";
        return;
    }

    carrito.forEach((producto) => {
        const itemCarrito = document.createElement("div");
        itemCarrito.className = "item-carrito";
        itemCarrito.innerHTML = `
            <div class="item-imagen">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="item-info">
                <span class="item-nombre">${producto.nombre}</span>
                <span class="item-precio">$${producto.precio * producto.cantidad}</span>
            </div>
            <div class="item-cantidad">
                <button class="cantidad-btn restar" data-nombre="${producto.nombre}">-</button>
                <span>${producto.cantidad}</span>
                <button class="cantidad-btn sumar" data-nombre="${producto.nombre}">+</button>
            </div>
        `;
        contenedorCarrito.appendChild(itemCarrito);

        const btnRestar = itemCarrito.querySelector(".restar");
        const btnSumar = itemCarrito.querySelector(".sumar");

        btnRestar.addEventListener("click", () => actualizarCantidad(producto.nombre, -1));
        btnSumar.addEventListener("click", () => actualizarCantidad(producto.nombre, 1));
    });

    const totalElement = document.createElement("div");
    const total = carrito.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0);
    totalElement.innerHTML = `
        <div class="carrito-total">
            <div class="total-line">
                <span>Total:</span>
                <span>$${total}</span>
            </div>
        </div>
        <div class="carrito-botones">
            <button class="btn-vaciar">Vaciar Carrito</button>
            <button class="btn-pagar">Finalizar Compra</button>
        </div>
    `;
    contenedorCarrito.appendChild(totalElement);

    const btnVaciar = totalElement.querySelector(".btn-vaciar");
    const btnPagar = totalElement.querySelector(".btn-pagar");

    btnVaciar.addEventListener("click", vaciarCarrito);
    //Llamar a la funcion finalizarCompra
    btnPagar.addEventListener("click", finalizarCompra);
}

function actualizarCantidad(nombreProducto, cantidad) {
    const producto = carrito.find((item) => item.nombre === nombreProducto);
    if (producto) {
        producto.cantidad += cantidad;
        if (producto.cantidad <= 0) {
            const index = carrito.findIndex((item) => item.nombre === nombreProducto);
            carrito.splice(index, 1);
        }
        guardarCarrito(carrito);
        actualizarVistaCarrito(carrito);
    }
}

export function agregarAlCarrito(event) {
    const nombreProducto = event.target.dataset.nombre;
    const precioProducto = parseFloat(event.target.dataset.precio);

    // Buscar el producto en la lista de productos para obtener su imagen
    const productos = document.querySelectorAll(".card");
    let imagenProducto = "assets/images/image.png"; // Imagen por defecto

    // Buscar la imagen del producto que se está agregando
    for (const prod of productos) {
        const nombre = prod.querySelector(".card-body h5").textContent.split(" - ")[0];
        if (nombre === nombreProducto) {
            const imgElement = prod.querySelector("img");
            if (imgElement) {
                imagenProducto = imgElement.src;
            }
            break;
        }
    }

    const productoParaCarrito = {
        nombre: nombreProducto,
        precio: precioProducto,
        cantidad: 1,
        imagen: imagenProducto,
    };

    const productoExistente = carrito.find((item) => item.nombre === nombreProducto);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push(productoParaCarrito);
    }

    guardarCarrito(carrito);
    actualizarVistaCarrito(carrito);
    sweetalert("Producto agregado al carrito", "bottom-end", "700");
}
