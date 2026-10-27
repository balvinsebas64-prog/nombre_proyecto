/* ===========================================================
   util.js — Funciones compartidas por todos los módulos
   =========================================================== */

// --- Sesión ---
function requiereSesion() {
  if (!localStorage.getItem("sesionActiva")) {
    globalThis.location.href = "login.html";
  }
}

function cerrarSesion() {
  localStorage.removeItem("sesionActiva");
  globalThis.location.href = "login.html";
}

// --- LocalStorage genérico ---
function obtenerLista(clave) {
  return JSON.parse(localStorage.getItem(clave)) || [];
}

function guardarLista(clave, lista) {
  localStorage.setItem(clave, JSON.stringify(lista));
}

function agregarRegistro(clave, registro) {
  const lista = obtenerLista(clave);
  registro.id = registro.id || Date.now();
  lista.push(registro);
  guardarLista(clave, lista);
  return registro;
}

function eliminarRegistroPorIndice(clave, indice) {
  const lista = obtenerLista(clave);
  lista.splice(indice, 1);
  guardarLista(clave, lista);
}

// --- Navegación interna del módulo (pestañas tipo SPA) ---
function mostrarPanel(idPanel, btn) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("activo"));
  document.getElementById(idPanel)?.classList.add("activo");
  document.querySelectorAll(".subnav button").forEach(b => b.classList.remove("tab-activa"));
  btn?.classList.add("tab-activa");
  globalThis.scrollTo({ top: 0, behavior: "smooth" });
}

// --- Mensajes de feedback ---
function mostrarMensaje(idElemento, texto, tipo) {
  const el = document.getElementById(idElemento);
  if (!el) return;
  el.className = `mensaje visible ${tipo || "exito"}`;
  el.innerHTML = texto;
  setTimeout(() => { el.classList.remove("visible"); }, 4000);
}

// --- Render de tabla genérico ---
function renderTabla(idTbody, lista, columnas, colspan, vacioTexto) {
  const tbody = document.getElementById(idTbody);
  if (!tbody) return;
  if (!lista || lista.length === 0) {
    tbody.innerHTML = `<tr class="tabla-vacia"><td colspan="${colspan}">${vacioTexto || "No hay registros aún"}</td></tr>`;
    return;
  }
  tbody.innerHTML = lista.map((item, i) => columnas(item, i)).join("");
}

// --- Actualiza contadores tipo badge en pestañas ---
function actualizarBadge(idBadge, clave) {
  const el = document.getElementById(idBadge);
  if (!el) return;
  el.textContent = obtenerLista(clave).length;
}

// --- Limpia un conjunto de campos de formulario por id ---
function limpiarCampos(ids, valoresPorDefecto = {}) {
  ids.forEach(id => {
    const campo = document.getElementById(id);
    if (!campo) return;
    campo.value = Object.hasOwn(valoresPorDefecto, id) ? valoresPorDefecto[id] : "";
  });
}

/* ===========================================================
   Delegación de eventos: sustituye a onclick / onchange inline.
   Cada página define sus funciones (guardarCliente, mostrarClientes, etc.)
   como funciones globales y las referencia desde el HTML mediante
   atributos data-* en vez de manejadores de evento incrustados.

   data-panel="panel-x"        → muestra ese panel
   data-panel-tab="tab-x"      → (opcional) botón de pestaña a marcar activo
   data-refrescar="funcion"    → (opcional) función a ejecutar tras mostrar el panel
   data-accion="funcion"       → ejecuta esa función global al hacer click
   data-indice="n"             → argumento numérico para data-accion
   data-accion-change="funcion"→ ejecuta esa función global al cambiar (select/input)
   =========================================================== */
function inicializarAcciones() {
  document.addEventListener("click", (evento) => {
    const elementoPanel = evento.target.closest("[data-panel]");
    if (elementoPanel) {
      const idBotonTab = elementoPanel.dataset.panelTab
        ? document.getElementById(elementoPanel.dataset.panelTab)
        : elementoPanel;
      mostrarPanel(elementoPanel.dataset.panel, idBotonTab);
      if (elementoPanel.dataset.refrescar) {
        globalThis[elementoPanel.dataset.refrescar]?.();
      }
    }

    const elementoAccion = evento.target.closest("[data-accion]");
    if (elementoAccion) {
      const fn = globalThis[elementoAccion.dataset.accion];
      if (typeof fn === "function") {
        const indice = elementoAccion.dataset.indice;
        fn(indice !== undefined ? Number.parseInt(indice, 10) : undefined);
      }
    }
  });

  document.addEventListener("change", (evento) => {
    const elemento = evento.target.closest("[data-accion-change]");
    if (elemento) {
      globalThis[elemento.dataset.accionChange]?.();
    }
  });
}

document.addEventListener("DOMContentLoaded", inicializarAcciones);
