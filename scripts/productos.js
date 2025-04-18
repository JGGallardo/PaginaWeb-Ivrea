let productos = [];
let categoriaActual = "Pizzas"; // Categoría por defecto

class Producto {
    constructor(categoria, nombre, precio, ingredientes, imagen) {
        this.categoria = categoria;
        this.nombre = nombre;
        this.precio = precio;
        this.ingredientes = ingredientes;
        this.imagen = imagen;
    }
}

// Función para importar los productos desde el archivo JSON
// y guardarlos en la variable productos
export async function importarProductosDesdeJSON() {
    try {
        const response = await fetch("../dbProductos.json");
        const data = await response.json();
        productos = data.productos.map(
            (p) => new Producto(p.categoria, p.nombre, p.precio, p.ingredientes, p.imagen)
        );
        return productos;
    } catch (error) {
        console.error("Error al cargar los productos: ", error);
        return [];
    }
}

export function cargarProductos(productos, agregarAlCarrito) {
    let contenedor = document.querySelector("#productos");
    if (!contenedor) return;

    // Filtrar productos por categoría actual
    const productosFiltrados = filtrarProductosPorCategoria(productos, categoriaActual);

    contenedor.innerHTML = "";
    productosFiltrados.forEach((prod) => {
        let divProd = document.createElement("div");
        divProd.className = "card";
        divProd.innerHTML = `
            <img src="${prod.imagen || "assets/images/image.png"}" alt="${prod.nombre}">
            <div class="card-body">
                <h5>${prod.nombre} - $${prod.precio}</h5>
                <p><span>Ingredientes:</span> ${prod.ingredientes.join(", ")}</p>
                <button class="btnAgregarCarrito" data-nombre="${prod.nombre}" data-precio="${
            prod.precio
        }">Agregar al Carrito</button>
            </div>
        `;
        contenedor.appendChild(divProd);

        const botonAgregar = divProd.querySelector(".btnAgregarCarrito");
        if (botonAgregar) {
            botonAgregar.addEventListener("click", agregarAlCarrito);
        }
    });
}

// Función para filtrar productos por categoría
function filtrarProductosPorCategoria(productos, categoria) {
    return productos.filter((producto) => producto.categoria === categoria);
}

// Función para cambiar la categoría actual y actualizar la vista
export function cambiarCategoria(categoria, productos, agregarAlCarrito) {
    categoriaActual = categoria;
    cargarProductos(productos, agregarAlCarrito);

    // Actualizar clase active en los enlaces del navbar
    const enlaces = document.querySelectorAll(".navbar-nav .nav-link");
    enlaces.forEach((enlace) => {
        if (enlace.textContent === categoria) {
            enlace.classList.add("active");
        } else {
            enlace.classList.remove("active");
        }
    });
}

// Función para inicializar los event listeners de los enlaces del navbar
export function inicializarFiltrosCategorias(productos, agregarAlCarrito) {
    const enlaces = document.querySelectorAll(".navbar-nav .nav-link");
    enlaces.forEach((enlace) => {
        enlace.addEventListener("click", (e) => {
            e.preventDefault();
            const categoria = enlace.textContent.trim(); // Added trim() to remove any whitespace
            cambiarCategoria(categoria, productos, agregarAlCarrito);
        });
    });
}
