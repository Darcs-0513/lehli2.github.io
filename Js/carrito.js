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
  const metodoGuardado = localStorage.getItem("metodoEnvio") || "tienda"; 
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


// PARA LAS TARJETAAAAAAASSS
// ---------- PAGO: helpers de validación ----------
function soloDigitos(input, maxLen) {
  input.value = (input.value || "").replace(/\D/g, "").slice(0, maxLen);
}

function esAmex(num16) {
  // AmEx empieza con 34 o 37
  return /^3[47]/.test(num16);
}

function validarTitular(nombre) {
  // Letras con tildes, ñ, espacios, apóstrofes y guiones. 2-60
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ' -]{2,60}$/.test(nombre.trim());
}

function validarNumTarjeta(num) {
  return /^\d{16}$/.test(num);
}

function validarExpiracion(valor) {
  // Acepta MM/AA o MM/AAAA
  const m = valor.trim().match(/^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/);
  if (!m) return false;
  const mm = parseInt(m[1], 10);
  let yy = parseInt(m[2], 10);
  if (m[2].length === 2) yy = 2000 + yy;

  const hoy = new Date();
  const ymHoy = hoy.getFullYear() * 100 + (hoy.getMonth() + 1);
  const ymCard = yy * 100 + mm;
  return ymCard >= ymHoy; // no en el pasado
}

function validarCVV(cvv, num16) {
  const amex = esAmex(num16);
  return amex ? /^\d{4}$/.test(cvv) : /^\d{3}$/.test(cvv);
}

// ---------- PAGO: set up del modal ----------
function setupPago() {
  const modalEl = document.getElementById("modalPago");
  const form = document.getElementById("form-pago");
  if (!modalEl || !form) return;

  const titular = document.getElementById("titular");
  const numTarjeta = document.getElementById("numTarjeta");
  const expiracion = document.getElementById("expiracion");
  const cvv = document.getElementById("cvv");

  // Al abrir modal, pintar resumen con los valores actuales de la página
  modalEl.addEventListener("show.bs.modal", () => {
    const metodo = localStorage.getItem("metodoEnvio") || "tienda";
    const lblMetodo = metodo === "postal" ? "postal" : "tienda";

    const sub = document.getElementById("subtotal-carrito")?.textContent || "0";
    const env = document.getElementById("envio-carrito")?.textContent || "0";
    const tot = document.getElementById("total-carrito")?.textContent || "0";

    document.getElementById("pago-metodo").textContent = lblMetodo;
    document.getElementById("pago-subtotal").textContent = sub;
    document.getElementById("pago-envio").textContent = env;
    document.getElementById("pago-total").textContent = tot;

    // Reset UI del formulario
    [titular, numTarjeta, expiracion, cvv].forEach(i => {
      i.classList.remove("is-invalid", "is-valid");
      i.value = "";
    });
  });

  // Restringir inputs a dígitos donde aplica
  numTarjeta.addEventListener("input", () => {
    soloDigitos(numTarjeta, 16);
    // Ajuste CVV dinámico si es AmEx
    const isAmex = esAmex(numTarjeta.value);
    cvv.maxLength = isAmex ? 4 : 3;
    if (isAmex && cvv.value.length > 4) cvv.value = cvv.value.slice(0, 4);
    if (!isAmex && cvv.value.length > 3) cvv.value = cvv.value.slice(0, 3);
  });
  cvv.addEventListener("input", () => {
    const isAmex = esAmex(numTarjeta.value);
    soloDigitos(cvv, isAmex ? 4 : 3);
  });

  // Validación en submit (simulación)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const vTitular = validarTitular(titular.value);
    const vNum = validarNumTarjeta(numTarjeta.value);
    const vExp = validarExpiracion(expiracion.value);
    const vCvv = validarCVV(cvv.value, numTarjeta.value);

    titular.classList.toggle("is-invalid", !vTitular);
    numTarjeta.classList.toggle("is-invalid", !vNum);
    expiracion.classList.toggle("is-invalid", !vExp);
    cvv.classList.toggle("is-invalid", !vCvv);

    titular.classList.toggle("is-valid", vTitular);
    numTarjeta.classList.toggle("is-valid", vNum);
    expiracion.classList.toggle("is-valid", vExp);
    cvv.classList.toggle("is-valid", vCvv);

    if (!(vTitular && vNum && vExp && vCvv)) return;

    // Éxito: simular transacción
    const btn = document.getElementById("btn-confirmar-pago");
    btn.disabled = true;
    btn.textContent = "Procesando...";

    setTimeout(() => {
      // Cerrar modal
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.hide();

      // Limpiar carrito y refrescar UI
      localStorage.setItem("carrito", JSON.stringify([]));
      mostrarCarrito();
      actualizarContadorCarrito();

      // Avisar al usuario
      mostrarToast("¡Compra registrada correctamente! 🧾✨");

      // Reset botón
      btn.disabled = false;
      btn.textContent = "Pagar ahora";
    }, 900);
  });
}

// Inicializar pago cuando cargue el DOM
document.addEventListener("DOMContentLoaded", setupPago);
