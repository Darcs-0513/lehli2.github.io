document.addEventListener("DOMContentLoaded", function () {
  fetch("Json/productos.json")
    .then(response => response.json())
    .then(productos => {
      const contenedores = {
        "COLECCION LEHLI": document.querySelectorAll(".bloque-coleccion.urban .producto-preview"),
        "NEO FUTURE": document.querySelectorAll(".bloque-coleccion.natural .producto-preview"),
        "BOXI DENIM": document.querySelectorAll(".bloque-coleccion.elegante .producto-preview"),
        "Stylings by LEHLI": document.querySelectorAll(".bloque-coleccion.atrevida .producto-preview")
      };

      const conteo = {
        "COLECCION LEHLI": 0,
        "NEO FUTURE": 0,
        "BOXI DENIM": 0,
        "Stylings by LEHLI": 0
      };

      productos.forEach(producto => {
        const categoria = producto.categoria;
        if (contenedores[categoria] && conteo[categoria] < 2) {
          const html = `
            <div class="card text-center bg-dark text-light h-100">
              <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 180px; object-fit: cover;">
              <div class="card-body d-flex flex-column justify-content-between">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">${producto.precio}</p>
                <button class="btn btn-light mt-auto">Agregar al carrito</button>
              </div>
            </div>
          `;
          contenedores[categoria][conteo[categoria]].innerHTML = html;
          conteo[categoria]++;
        }
      });
    })
    .catch(error => {
      console.error("Error al cargar los productos:", error);
    });
});
