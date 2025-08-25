document.addEventListener("DOMContentLoaded", () => {
  mostrarCarrito();
});

function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contenedor = document.getElementById("carrito-items");

  // NUEVO: capturamos los spans del desglose
  const metodoEnvio = localStorage.getItem("metodoEnvio") || "tienda";
  const subtotalEl = document.getElementById("subtotal-carrito");
  const envioEl    = document.getElementById("envio-carrito");
  const totalEl    = document.getElementById("total-carrito");
  const notaEnvio  = document.getElementById("envio-nota");

  contenedor.innerHTML = "";

  // 🔴 FALTABA ESTO
  let total = 0;

  // para el envío/desglose
  let totalEnvio = 0;
  let hayNoDisponible = false;
  let hayConEnvio = false;
  const ENVIO_POR_UNIDAD = false;

  carrito.forEach((producto, index) => {
    const precioLimpio = parseFloat(producto.precio.replace(/[₡,.]/g, "").trim());
    const subtotal = producto.cantidad * precioLimpio;
    total += subtotal;

    // Envío
    if (metodoEnvio === "postal" && producto.envio) {
  if (/no disponible/i.test(producto.envio)) {
    hayNoDisponible = true;
  } else if (producto.envio.includes("₡")) {
    hayConEnvio = true;
    // "₡2.500 nacional" -> 2500
    const envioValor = parseInt(producto.envio.replace(/[^\d]/g, ""), 10) || 0;
    totalEnvio += ENVIO_POR_UNIDAD ? envioValor * (producto.cantidad || 1) : envioValor;
  }
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

  // Pintar SUBTOTAL / ENVÍO / TOTAL
  const totalFinal = total + totalEnvio;
if (subtotalEl) subtotalEl.textContent = total.toLocaleString("es-CR");
if (envioEl)    envioEl.textContent    = totalEnvio.toLocaleString("es-CR");
if (totalEl)    totalEl.textContent    = totalFinal.toLocaleString("es-CR");

if (notaEnvio) {
  if (metodoEnvio === "tienda") {
    notaEnvio.textContent = "Recogida en tienda: sin costo.";
  } else if (metodoEnvio === "postal") {
    if (hayNoDisponible && hayConEnvio) {
      notaEnvio.textContent = "Envío postal seleccionado. Algunos artículos no tienen envío disponible.";
    } else if (hayNoDisponible && !hayConEnvio) {
      notaEnvio.textContent = "Envío postal seleccionado. No hay envío disponible para los artículos.";
    } else if (hayConEnvio) {
      notaEnvio.textContent = "Envío postal seleccionado. Se sumó el costo de envío.";
    } else {
      notaEnvio.textContent = "Envío postal seleccionado.";
    }
  } else {
    notaEnvio.textContent = "";
  }
}

  // Evento para cambios de cantidad
  document.querySelectorAll(".cantidad-input").forEach(input => {
    input.addEventListener("change", (e) => {
  const index = e.target.getAttribute("data-index");
  const nuevaCantidad = parseInt(e.target.value);

  if (nuevaCantidad <= 0) {
    carrito.splice(index, 1); 
  } else {
    carrito[index].cantidad = nuevaCantidad;
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito(); 
  actualizarContadorCarrito();
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


// Método de envío: cargar selección y escuchar cambios
document.addEventListener("DOMContentLoaded", () => {
  const metodoGuardado = localStorage.getItem("metodoEnvio") || "tienda"; // por defecto: tienda (gratis)
  const rPostal = document.getElementById("envio-postal");
  const rTienda = document.getElementById("envio-tienda");

  if (rPostal && rTienda) {
    if (metodoGuardado === "postal") rPostal.checked = true;
    else rTienda.checked = true;

    [rPostal, rTienda].forEach(r => {
      r.addEventListener("change", (e) => {
        localStorage.setItem("metodoEnvio", e.target.value);
        mostrarCarrito(); // recalcula totales inmediatamente
      });
    });
       mostrarCarrito();
  }
});
