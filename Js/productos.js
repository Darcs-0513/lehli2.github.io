function mostrarToast(mensaje) {
  const toast = document.createElement("div");
  toast.className = "toast position-fixed bottom-0 end-0 m-3 text-bg-dark show";
  toast.style.zIndex = "9999";
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <div class="toast-body">
      ${mensaje}
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}


document.addEventListener("DOMContentLoaded", function () {
  fetch("Json/productos.json")
    .then(response => response.json())
    .then(productos => {
      const contenedores = {
        "COLECCION LEHLI": document.querySelectorAll(".bloque-coleccion.urban .productos-contenedor"),
        "NEO FUTURE": document.querySelectorAll(".bloque-coleccion.natural .productos-contenedor"),
        "BOXI DENIM": document.querySelectorAll(".bloque-coleccion.elegante .productos-contenedor"),
        "Stylings by LEHLI": document.querySelectorAll(".bloque-coleccion.atrevida .productos-contenedor")
      };

      const conteo = {
        "COLECCION LEHLI": 0,
        "NEO FUTURE": 0,
        "BOXI DENIM": 0,
        "Stylings by LEHLI": 0
      };

      productos.forEach(producto => {
        const categoria = producto.coleccion;
        if (contenedores[categoria] && conteo[categoria] < 2) {
          const html = `
            <div class="card text-center bg-dark text-light h-100">
              <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 180px; object-fit: cover;">
              <div class="card-body d-flex flex-column justify-content-between">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">${producto.precio}</p>
                <a href="detalleProductos.html?id=${encodeURIComponent(producto.nombre)}" class="btn btn-light mt-auto">Ver más</a>
              </div>
            </div>
          `;
          const tarjeta = document.createElement("div");
tarjeta.className = "col-6";
tarjeta.innerHTML = html;
contenedores[categoria][0].appendChild(tarjeta);

          conteo[categoria]++;
        }
      });
    })
    .catch(error => {
      console.error("Error al cargar los productos:", error);
    });
});



// PARA EL FILTRO 
document.addEventListener("DOMContentLoaded", function () {
  const filtro = document.getElementById("filtro");
  filtro.addEventListener("change", function () {
    const seleccion = filtro.value;

    document.querySelectorAll(".bloque-coleccion").forEach(bloque => {
      const titulo = bloque.querySelector(".titulo-coleccion").textContent.trim();

      if (seleccion === "todas" || titulo.toLowerCase() === seleccion.toLowerCase()) {
        bloque.style.display = "block";
      } else {
        bloque.style.display = "none";
      }
    });
  });
});



// PARA EL DETALLE DE CADA PRODUCTO 

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const idProducto = params.get("id");

  fetch("Json/productos.json")
    .then(res => res.json())
    .then(data => {
      const producto = data.find(p => p.nombre === idProducto);
      if (producto) renderDetalle(producto);
      else document.getElementById("detalle-producto").innerHTML = "<p>Producto no encontrado.</p>";
    });
});

function renderDetalle(producto) {
  const contenedor = document.getElementById("detalle-producto");

  contenedor.innerHTML = `
    <div class="row mt-5 align-items-center">
      <!-- Galería de imágenes -->
      <div class="col-md-6 mb-4">
        <div id="galeriaProducto" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner rounded">
            <div class="carousel-item active">
              <img src="${producto.imagen}" class="d-block w-100" alt="${producto.nombre}">
            </div>
            <div class="carousel-item">
              <img src="${producto.imagen2}" class="d-block w-100" alt="${producto.nombre} 2">
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#galeriaProducto" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#galeriaProducto" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>

      <!-- Información del producto -->
      <div class="col-md-6">
        <h2 class="mb-3 titulo-catalogo">${producto.nombre}</h2>
        <p><strong>Precio:</strong> ${producto.precio}</p>
        <p><strong>Disponibilidad:</strong> ${producto.stock}</p>
        <p><strong>Entrega:</strong> ${producto.entrega}</p>
        <p><strong>Envío:</strong> ${producto.envio}</p>
        <p class="mt-3">${producto.descripcion}</p>

        <button class="btn btn-dark mt-4" data-id="${producto.id}">🛒 Agregar al carrito</button>


      </div>
    </div>

    <!-- Reseñas -->
    <div class="mt-5">
      <h3 class="mb-3">Reseñas de usuarios</h3>
      <div id="resenas" class="mb-4">
        ${(producto.resenas || []).map(r => `
          <div class="resena">
            <p class="mb-1"><strong>${r.usuario}</strong> ${"★".repeat(r.puntuacion)}</p>
            <p class="mb-0">${r.comentario}</p>
          </div>
        `).join("")}
      </div>

      <!-- Formulario reseña -->
      <form id="form-resena" class="bg-dark text-light p-4 rounded">
        <h4 class="mb-3">Agregar una reseña</h4>
        <div class="mb-3">
          <label for="nombre" class="form-label">Tu nombre</label>
          <input type="text" id="nombre" class="form-control" required>
        </div>
        <div class="mb-3">
          <label for="comentario" class="form-label">Comentario</label>
          <textarea id="comentario" class="form-control" rows="3" required></textarea>
        </div>
        <div class="mb-3">
          <label for="puntuacion" class="form-label">Puntuación</label>
          <select id="puntuacion" class="form-select">
            <option value="5">★★★★★</option>
            <option value="4">★★★★</option>
            <option value="3">★★★</option>
            <option value="2">★★</option>
            <option value="1">★</option>
          </select>
        </div>
        <button type="submit" class="btn btn-light">Enviar reseña</button>
      </form>
    </div>
  `;

  document.getElementById("form-resena").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Gracias por tu reseña ❤️ (esto se podría guardar local si quisiéramos)");
  });


// Asignar evento al botón después de que existe en el DOM
const btnAgregar = document.querySelector(".btn-dark");
btnAgregar.addEventListener("click", () => {
  agregarAlCarrito(producto);
});


}
t

// PARA EL CARRITOOOO

function agregarAlCarrito(producto) {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const existente = carrito.find(p => p.id === producto.id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
  mostrarToast("Producto agregado al carrito 🛒");
}


function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  const contador = document.getElementById("contador-carrito");
  if (contador) {
    contador.textContent = total;
    contador.classList.add("pulse");
    setTimeout(() => contador.classList.remove("pulse"), 300);
  }
}


// Llamar al cargar la página
actualizarContadorCarrito();

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
});
