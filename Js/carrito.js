document.addEventListener("DOMContentLoaded", () => {
  mostrarCarrito();
});

function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contenedor = document.getElementById("carrito-items");
  const totalEl = document.getElementById("total-carrito");
  contenedor.innerHTML = "";

  let total = 0;

  carrito.forEach((producto, index) => {
    const subtotal = producto.cantidad * parseFloat(producto.precio.replace(/[^\d.]/g, ""));
    total += subtotal;

    contenedor.innerHTML += `
    <div class="item-carrito">
    <div>
      <strong>${producto.nombre}</strong><br>
      Precio: ${producto.precio}<br>
      Cantidad:
      <input type="number" min="1" value="${producto.cantidad}" data-index="${index}" class="cantidad-input" />
    </div>
    <div>
      <button class="btn btn-danger" onclick="eliminarProducto(${index})">❌</button>
    </div>
    </div>
 `;

  });

  totalEl.textContent = total.toLocaleString();

  // Evento para cambios de cantidad
  document.querySelectorAll(".cantidad-input").forEach(input => {
    input.addEventListener("change", (e) => {
      const index = e.target.getAttribute("data-index");
      carrito[index].cantidad = parseInt(e.target.value);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      mostrarCarrito(); // recargar todo
    });
  });
}

function eliminarProducto(index) {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}
