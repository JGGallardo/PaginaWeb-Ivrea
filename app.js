import {
    importarProductosDesdeJSON,
    cargarProductos,
    inicializarFiltrosCategorias,
} from "./scripts/productos.js";
import {
    cargarCarritoGuardado,
    actualizarVistaCarrito,
    guardarCarrito,
    carrito,
    agregarAlCarrito,
} from "./scripts/carrito.js";

const carritoGuardado = cargarCarritoGuardado();
carrito.length = 0; // Limpia el array sin perder la referencia
carritoGuardado.forEach((item) => carrito.push(item)); // Agrega los elementos guardados

// Carga los productos y actualiza la vista
const productos = await importarProductosDesdeJSON();
cargarProductos(productos, agregarAlCarrito);
guardarCarrito(carrito);
actualizarVistaCarrito(carrito);

// Inicializa los filtros de categorías
inicializarFiltrosCategorias(productos, agregarAlCarrito);
