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
    const precioLimpio = parseFloat(producto.precio.replace(/[₡,.]/g, "").trim());
const subtotal = producto.cantidad * precioLimpio;
    total += subtotal;

    contenedor.innerHTML += `
<div class="item-carrito d-flex gap-4 align-items-center">
  <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 100px; height: auto; border-radius: 10px;">
  <div class="flex-grow-1">
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

totalEl.textContent = total.toLocaleString("es-CR");

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

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
});


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

// para contador 
document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
});
