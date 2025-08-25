document.addEventListener("DOMContentLoaded", () => {
  // ---------- MAPA ----------
  const COORDS_LEHLI = [9.791444, -84.133694];
  const mapaDiv = document.getElementById("mapa-lehli");
  if (mapaDiv && typeof L !== "undefined") {
    const map = L.map("mapa-lehli").setView(COORDS_LEHLI, 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 19
    }).addTo(map);
    L.marker(COORDS_LEHLI)
      .addTo(map)
      .bindPopup("LEHLI BRAND — Aserri, CR")
      .openPopup();
  }

  // ---------- VALIDACIONES ----------
  const form = document.getElementById("form-contacto");
  const bloquePedido = document.getElementById("bloquePedido");
  const tipoConsulta = document.getElementById("tipoConsulta");
  const numeroPedido = document.getElementById("numeroPedido");
  const fechaNac = document.getElementById("fechaNac");
  const nombre = document.getElementById("nombre");
  const tel = document.getElementById("telefono");
  const email = document.getElementById("email");
  const mensaje = document.getElementById("mensaje");
  const captchaError = document.getElementById("captchaError");

  // Máximo del date = hoy
  const hoyISO = new Date().toISOString().split("T")[0];
  fechaNac.setAttribute("max", hoyISO);

  // Nombre: letras (incluye tildes), espacios, apóstrofes y guiones
  function validarNombre(v) {
    return /^[A-Za-zÁÉÍÓÚáéíóúÑñ' -]{2,60}$/.test((v || "").trim());
  }

  // Tel CR: 8 dígitos
  function validarTel(v) {
    return /^\d{8}$/.test(v || "");
  }

  // Fecha no futura
  function validarFecha(v) {
    if (!v) return false;
    return v <= hoyISO;
  }

  // Mostrar/ocultar Nº de pedido si corresponde
  tipoConsulta.addEventListener("change", () => {
    const esPedido = tipoConsulta.value === "Pedido";
    bloquePedido.classList.toggle("d-none", !esPedido);
    numeroPedido.required = esPedido;
  });

  // Bootstrap validation + captcha
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Reset mensajes
    captchaError.classList.add("d-none");

    // Validaciones personalizadas
    if (!validarNombre(nombre.value)) {
      nombre.setCustomValidity("Nombre inválido");
    } else {
      nombre.setCustomValidity("");
    }

    if (!validarTel(tel.value)) {
      tel.setCustomValidity("Tel inválido");
    } else {
      tel.setCustomValidity("");
    }

    if (!validarFecha(fechaNac.value)) {
      fechaNac.setCustomValidity("Fecha inválida");
    } else {
      fechaNac.setCustomValidity("");
    }

    // checkValidity (HTML5)
    const esValido = form.checkValidity();

    // Captcha (demo)
    const token = (typeof grecaptcha !== "undefined") ? grecaptcha.getResponse() : "";
    const captchaOK = !!token;
    if (!captchaOK) captchaError.classList.remove("d-none");

    form.classList.add("was-validated");
    if (!(esValido && captchaOK)) return;

    // Armar resumen (no editable)
    const genero = (form.querySelector("input[name='genero']:checked") || {}).value || "";
    const preferencia = (form.querySelector("input[name='preferencia']:checked") || {}).value || "";
    const resumen = `
      <ul class="list-group">
        <li class="list-group-item"><strong>Nombre:</strong> ${escapeHTML(nombre.value)}</li>
        <li class="list-group-item"><strong>Correo:</strong> ${escapeHTML(email.value)}</li>
        <li class="list-group-item"><strong>Teléfono:</strong> ${escapeHTML(tel.value)}</li>
        <li class="list-group-item"><strong>Fecha de nacimiento:</strong> ${escapeHTML(fechaNac.value)}</li>
        <li class="list-group-item"><strong>Género:</strong> ${escapeHTML(genero)}</li>
        <li class="list-group-item"><strong>Tipo de consulta:</strong> ${escapeHTML(tipoConsulta.value)}</li>
        ${!bloquePedido.classList.contains("d-none") && numeroPedido.value
          ? `<li class="list-group-item"><strong>Número de pedido:</strong> ${escapeHTML(numeroPedido.value)}</li>`
          : ""
        }
        <li class="list-group-item"><strong>Preferencia de contacto:</strong> ${escapeHTML(preferencia)}</li>
        <li class="list-group-item"><strong>Mensaje:</strong><br>${nl2br(escapeHTML(mensaje.value))}</li>
      </ul>
      <div class="mt-3">
        <span class="badge rounded-pill" style="background:#dbb4c8;color:#101820;">Tu consulta fue enviada (simulada)</span>
      </div>
    `;
    document.getElementById("resumen-contenido").innerHTML = resumen;
    document.getElementById("resumen-contacto").classList.remove("d-none");

    // OPCIÓN: ocultar el formulario para que no se edite en esta etapa
    form.classList.add("d-none");

    // Reset captcha
    if (typeof grecaptcha !== "undefined") grecaptcha.reset();
  });
});

// Helpers
function escapeHTML(s) {
  return (s || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
function nl2br(s) {
  return (s || "").replace(/\n/g, "<br>");
}
