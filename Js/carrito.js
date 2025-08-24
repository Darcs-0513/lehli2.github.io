document.addEventListener("DOMContentLoaded", () => {
  mostrarCarrito();
});

function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contenedor = document.getElementById("carrito-items");
  const totalEl = document.getElementById("total-carrito");
  contenedor.innerHTML = "";

  let total = 0;
  let totalEnvio = 0;

  carrito.forEach((producto, index) => {
    const precioLimpio = parseFloat(producto.precio.replace(/[₡,.]/g, "").trim());
    const subtotal = producto.cantidad * precioLimpio;
    total += subtotal;
    // Si el producto tiene envío con ₡, lo sumamos
if (producto.envio && producto.envio.includes("₡")) {
  const envioValor = parseFloat(producto.envio.replace(/[₡,.a-zA-Z ]/g, ""));
  totalEnvio += envioValor;
}


    contenedor.innerHTML += `
      <div class="item-carrito d-flex gap-4 align-items-center">
        <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 100px; height: auto; border-radius: 10px;">
        <div class="flex-grow-1">
          <strong>${producto.nombre}</strong><br>
          Precio: ${producto.precio}<br>
          Cantidad:
          <input type="number" min="0" value="${producto.cantidad}" data-index="${index}" class="cantidad-input" />
        </div>
        <div>
          <button class="btn btn-danger" onclick="eliminarProducto(${index})">❌</button>
        </div>
      </div>
    `;
  });

const totalFinal = total + totalEnvio;
totalEl.textContent = totalFinal.toLocaleString("es-CR");


  // Evento para cambios de cantidad
  document.querySelectorAll(".cantidad-input").forEach(input => {
    input.addEventListener("change", (e) => {
  const index = e.target.getAttribute("data-index");
  const nuevaCantidad = parseInt(e.target.value);

  if (nuevaCantidad <= 0) {
    carrito.splice(index, 1); // ✅ eliminar si es 0
  } else {
    carrito[index].cantidad = nuevaCantidad;
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito(); // ✅ refresca la lista
  actualizarContadorCarrito();D
    });
  });
}


function eliminarProducto(index) {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  actualizarContadorCarrito(); 
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
