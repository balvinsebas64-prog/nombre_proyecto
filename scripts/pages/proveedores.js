/* ===========================================================
   proveedores.js — Lógica del módulo de Proveedores
   =========================================================== */
function guardarProveedor() {
  const codigo = document.getElementById("pr-codigo").value.trim();
  const empresa = document.getElementById("pr-empresa").value.trim();
  const ruc = document.getElementById("pr-ruc").value.trim();

  if (!codigo || !empresa || !ruc) {
    mostrarMensaje("msgProveedor", "<i class='fas fa-exclamation-circle'></i> Complete los campos obligatorios.", "error");
    return;
  }
  const proveedores = obtenerLista("proveedores");
  if (proveedores.some(p => p.codigo === codigo)) {
    mostrarMensaje("msgProveedor", "<i class='fas fa-exclamation-circle'></i> Ya existe un proveedor con ese código.", "error");
    return;
  }
  agregarRegistro("proveedores", {
    codigo, empresa, ruc,
    representante: document.getElementById("pr-representante").value.trim(),
    telefono: document.getElementById("pr-telefono").value.trim(),
    correo: document.getElementById("pr-correo").value.trim(),
    direccion: document.getElementById("pr-direccion").value.trim(),
    categoria: document.getElementById("pr-categoria").value,
    fecha: document.getElementById("pr-fecha").value,
    estado: "Activo"
  });
  mostrarMensaje("msgProveedor", "<i class='fas fa-check-circle'></i> Proveedor registrado correctamente.", "exito");

  limpiarCampos(["pr-codigo", "pr-empresa", "pr-ruc", "pr-representante", "pr-telefono", "pr-correo", "pr-direccion", "pr-fecha"]);
  actualizarBadge("badgeProveedores", "proveedores");
}

function mostrarProveedores() {
  const proveedores = obtenerLista("proveedores");
  const filtroCategoria = document.getElementById("f-categoria")?.value || "";
  const filtroEstado = document.getElementById("f-estado")?.value || "";

  const filtrados = proveedores.filter(p =>
    (!filtroCategoria || p.categoria === filtroCategoria) &&
    (!filtroEstado || p.estado === filtroEstado)
  );

  renderTabla("tablaProveedores", filtrados, (p) => {
    const idxReal = proveedores.indexOf(p);
    return `
        <tr>
            <td>${p.codigo}</td>
            <td>${p.empresa}</td>
            <td>${p.ruc}</td>
            <td>${p.representante || "—"}</td>
            <td>${p.categoria}</td>
            <td>${p.estado}</td>
            <td>
                <div class="fila-accion">
                    <button class="btn-eliminar" data-accion="eliminarProveedor" data-indice="${idxReal}"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>`;
  }, 7, "No hay proveedores registrados");
  actualizarBadge("badgeProveedores", "proveedores");
}

function eliminarProveedor(i) {
  if (!confirm("¿Eliminar este proveedor del sistema?")) return;
  eliminarRegistroPorIndice("proveedores", i);
  mostrarProveedores();
}

function buscarProveedor() {
  const nombre = document.getElementById("bp-nombre").value.trim().toLowerCase();
  const ruc = document.getElementById("bp-ruc").value.trim();
  const proveedores = obtenerLista("proveedores");

  const resultados = (nombre || ruc)
    ? proveedores.filter(p =>
      (nombre && p.empresa.toLowerCase().includes(nombre)) ||
      (ruc && p.ruc.includes(ruc)))
    : [];

  renderTabla("tablaBusquedaProveedores", resultados, (p) => `
        <tr>
            <td>${p.codigo}</td><td>${p.empresa}</td><td>${p.ruc}</td><td>${p.representante || "—"}</td><td>${p.telefono || "—"}</td>
        </tr>`, 5, (nombre || ruc) ? "Sin resultados para esa búsqueda" : "Realice una búsqueda para ver resultados");
}

function actualizarProveedor() {
  const codigo = document.getElementById("ac-codigo").value.trim();
  const proveedores = obtenerLista("proveedores");
  const idx = proveedores.findIndex(p => p.codigo === codigo);

  if (idx === -1) {
    mostrarMensaje("msgActualizar", "<i class='fas fa-exclamation-circle'></i> No se encontró un proveedor con ese código.", "error");
    return;
  }
  const telefono = document.getElementById("ac-telefono").value.trim();
  const correo = document.getElementById("ac-correo").value.trim();
  const direccion = document.getElementById("ac-direccion").value.trim();

  if (telefono) proveedores[idx].telefono = telefono;
  if (correo) proveedores[idx].correo = correo;
  if (direccion) proveedores[idx].direccion = direccion;

  guardarLista("proveedores", proveedores);
  mostrarMensaje("msgActualizar", "<i class='fas fa-check-circle'></i> Proveedor actualizado correctamente.", "exito");
  limpiarCampos(["ac-codigo", "ac-telefono", "ac-correo", "ac-direccion"]);
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarBadge("badgeProveedores", "proveedores");
});
