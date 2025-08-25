document.addEventListener("DOMContentLoaded", () => {
  const cont = document.querySelector("#factura-contenido .card-body");
  const factura = JSON.parse(localStorage.getItem("ultimaFactura") || "null");

  if (!factura) {
    cont.innerHTML = `
      <div class="text-center py-5">
        <h3 class="mb-3">No hay compra registrada</h3>
        <p>Volvé a la tienda para seleccionar productos.</p>
        <a class="btn btn-dark" href="productos.html">Ir a productos</a>
      </div>`;
    return;
  }

  // Utilidad formateo CRC
  const fCRC = (n) => (n || 0).toLocaleString("es-CR");

  // Cabecera
  const fecha = new Date(factura.fechaISO);
  const fechaStr = fecha.toLocaleString("es-CR");
  const metodoEnvioLabel = factura.metodoEnvio === "postal" ? "Envío postal" : "Recogida en tienda";

  // Filas de productos
  const filas = factura.items.map((it, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${it.nombre}</td>
      <td class="text-end">₡${fCRC(it.precioUnit)}</td>
      <td class="text-center">${it.cantidad}</td>
      <td class="text-end">₡${fCRC(it.subtotal)}</td>
    </tr>
  `).join("");

  cont.innerHTML = `
    <div class="d-flex justify-content-between align-items-start mb-4">
      <div>
        <h2 class="mb-1" style="color:#50314c">Factura LEHLI</h2>
        <small class="text-muted">ID: ${factura.id}</small><br>
        <small class="text-muted">Fecha: ${fechaStr}</small>
      </div>
      <img src="img/logoL.png" alt="LEHLI" height="56">
    </div>

    <div class="table-responsive">
      <table class="table table-sm align-middle">
        <thead class="table-light">
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th class="text-end">Precio unit.</th>
            <th class="text-center">Cantidad</th>
            <th class="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${filas}
        </tbody>
      </table>
    </div>

    <div class="row g-3">
      <div class="col-md-6">
        <div class="p-3 border rounded-3">
          <h6 class="mb-2">Métodos &amp; envío</h6>
          <p class="mb-1"><strong>Envío:</strong> ${metodoEnvioLabel}</p>
          <p class="mb-1"><strong>Costo de envío:</strong> ₡${fCRC(factura.envio)}</p>
          <p class="mb-0"><strong>Pago:</strong> ${factura.pago.marca} ${factura.pago.enmascarada} — Titular: ${factura.pago.titular}</p>
        </div>
      </div>

      <div class="col-md-6">
        <div class="p-3 border rounded-3">
          <div class="d-flex justify-content-between">
            <span>Subtotal</span><strong>₡${fCRC(factura.subtotal)}</strong>
          </div>
          <div class="d-flex justify-content-between">
            <span>Envío</span><strong>₡${fCRC(factura.envio)}</strong>
          </div>
          <hr>
          <div class="d-flex justify-content-between fs-5">
            <span>Total</span><strong>₡${fCRC(factura.total)}</strong>
          </div>
        </div>
      </div>
    </div>
  `;

  // Imprimir
  document.getElementById("btn-imprimir")?.addEventListener("click", () => window.print());
});
