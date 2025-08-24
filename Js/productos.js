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
    <h2>${producto.nombre}</h2>
    <div class="galeria">
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <img src="${producto.imagen2}" alt="${producto.nombre} 2">
    </div>
    <p><strong>Precio:</strong> ${producto.precio}</p>
    <p><strong>Disponibilidad:</strong> ${producto.stock}</p>
    <p><strong>Descripción:</strong> ${producto.descripcion}</p>
    <p><strong>Entrega:</strong> ${producto.entrega}</p>
    <p><strong>Envío:</strong> ${producto.envio}</p>

    <h3>Reseñas</h3>
    <div id="resenas">
      ${(producto.resenas || []).map(r => `
        <div class="resena">
          <p><strong>${r.usuario}</strong> ${"★".repeat(r.puntuacion)}</p>
          <p>${r.comentario}</p>
        </div>
      `).join("")}
    </div>

    <form id="form-resena">
      <h4>Agregar una reseña</h4>
      <input type="text" id="nombre" placeholder="Tu nombre" required />
      <textarea id="comentario" placeholder="Comentario" required></textarea>
      <label for="puntuacion">Puntuación:</label>
      <select id="puntuacion">
        <option value="5">★★★★★</option>
        <option value="4">★★★★</option>
        <option value="3">★★★</option>
        <option value="2">★★</option>
        <option value="1">★</option>
      </select>
      <button type="submit">Enviar</button>
    </form>
  `;

  document.getElementById("form-resena").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Gracias por tu reseña ❤️ (esto se podría guardar local si quisiéramos)");
  });
}
