/* ===========================================================
   clientes.js — Lógica del módulo de Clientes
   =========================================================== */
function guardarCliente() {
  const nombre = document.getElementById("c-nombre").value.trim();
  const documento = document.getElementById("c-documento").value.trim();
  const email = document.getElementById("c-email").value.trim();
  const telefono = document.getElementById("c-telefono").value.trim();
  const direccion = document.getElementById("c-direccion").value.trim();
  const fecha = document.getElementById("c-fecha").value;

  if (!nombre || !documento || !email) {
    mostrarMensaje("msgCliente", "<i class='fas fa-exclamation-circle'></i> Complete los campos obligatorios.", "error");
    return;
  }
  agregarRegistro("clientes", { nombre, documento, email, telefono, direccion, fecha });
  mostrarMensaje("msgCliente", "<i class='fas fa-check-circle'></i> Cliente registrado correctamente.", "exito");

  limpiarCampos(["c-nombre", "c-documento", "c-email", "c-telefono", "c-direccion", "c-fecha"]);
  actualizarBadge("badgeClientes", "clientes");
}

function mostrarClientes() {
  const clientes = obtenerLista("clientes");
  renderTabla("tablaClientes", clientes, (c, i) => `
        <tr>
            <td>${c.id}</td>
            <td>${c.nombre}</td>
            <td>${c.documento}</td>
            <td>${c.email}</td>
            <td>${c.telefono || "—"}</td>
            <td>${c.direccion || "—"}</td>
            <td>
                <div class="fila-accion">
                    <button class="btn-editar" data-accion="editarCliente" data-indice="${i}"><i class="fas fa-edit"></i></button>
                    <button class="btn-eliminar" data-accion="eliminarCliente" data-indice="${i}"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>`, 7, "No hay clientes registrados");
  actualizarBadge("badgeClientes", "clientes");
}

function editarCliente(i) {
  const clientes = obtenerLista("clientes");
  const c = clientes[i];
  const nuevoTelefono = prompt("Nuevo teléfono", c.telefono || "");
  const nuevaDireccion = prompt("Nueva dirección", c.direccion || "");
  if (nuevoTelefono !== null) c.telefono = nuevoTelefono;
  if (nuevaDireccion !== null) c.direccion = nuevaDireccion;
  guardarLista("clientes", clientes);
  mostrarClientes();
}

function eliminarCliente(i) {
  if (!confirm("¿Está seguro de eliminar este cliente? Esta acción no se puede deshacer.")) return;
  eliminarRegistroPorIndice("clientes", i);
  mostrarClientes();
}

function buscarCliente() {
  const tipo = document.getElementById("b-tipo").value;
  const valor = document.getElementById("b-valor").value.trim().toLowerCase();
  const clientes = obtenerLista("clientes");
  const resultados = valor
    ? clientes.filter(c => (c[tipo] || "").toString().toLowerCase().includes(valor))
    : [];

  renderTabla("tablaBusquedaClientes", resultados, (c) => `
        <tr>
            <td>${c.id}</td><td>${c.nombre}</td><td>${c.documento}</td><td>${c.email}</td><td>${c.telefono || "—"}</td>
        </tr>`, 5, valor ? "Sin resultados para esa búsqueda" : "Realice una búsqueda para ver resultados");
}

function enviarContacto() {
  const id = document.getElementById("ct-id").value.trim();
  const asunto = document.getElementById("ct-asunto").value.trim();
  const mensaje = document.getElementById("ct-mensaje").value.trim();

  if (!id || !asunto || !mensaje) {
    mostrarMensaje("msgContacto", "<i class='fas fa-exclamation-circle'></i> Complete los campos obligatorios.", "error");
    return;
  }
  agregarRegistro("contactosClientes", {
    idCliente: id,
    medio: document.getElementById("ct-medio").value,
    asunto, mensaje,
    prioridad: document.getElementById("ct-prioridad").value
  });
  mostrarMensaje("msgContacto", "<i class='fas fa-check-circle'></i> Mensaje enviado y registrado correctamente.", "exito");
  limpiarCampos(["ct-id", "ct-asunto", "ct-mensaje"]);
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarBadge("badgeClientes", "clientes");
});
