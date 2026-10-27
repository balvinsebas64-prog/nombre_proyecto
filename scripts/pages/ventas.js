/* ===========================================================
   ventas.js — Lógica del módulo de Ventas
   =========================================================== */

const IGV_PORCENTAJE = 0.18;
let carritoVenta = [];

function refrescarFormularioVenta() {
  poblarClientesVenta();
  poblarProductosVenta();
}

// --- Poblar selects con datos de otros módulos ---
function poblarClientesVenta() {
  const select = document.getElementById("v-cliente");
  if (!select) return;
  const clientes = obtenerLista("clientes");
  const seleccionActual = select.value;
  select.innerHTML = '<option value="">-- Seleccione un cliente --</option>' +
    clientes.map(c => `<option value="${c.id}">${c.nombre} — ${c.documento}</option>`).join("");
  select.value = seleccionActual;
}

function poblarProductosVenta() {
  const select = document.getElementById("v-producto");
  if (!select) return;
  const productos = obtenerLista("productos");
  const seleccionActual = select.value;
  select.innerHTML = '<option value="">-- Seleccione un producto --</option>' +
    productos.map(p => `<option value="${p.codigo}">${p.nombre} (${p.codigo}) — S/ ${Number(p.precio).toFixed(2)}</option>`).join("");
  select.value = seleccionActual;
  actualizarPrecioUnitario();
}

function actualizarPrecioUnitario() {
  const codigo = document.getElementById("v-producto").value;
  const productos = obtenerLista("productos");
  const producto = productos.find(p => p.codigo === codigo);
  const campoPrecio = document.getElementById("v-preciounitario");
  campoPrecio.value = producto ? Number(producto.precio).toFixed(2) : "";
}

// --- Carrito temporal de la venta actual ---
function agregarProductoCarrito() {
  const codigo = document.getElementById("v-producto").value;
  const cantidad = Number.parseInt(document.getElementById("v-cantidad").value, 10);
  const productos = obtenerLista("productos");
  const producto = productos.find(p => p.codigo === codigo);

  if (!producto) {
    mostrarMensaje("msgVenta", "<i class='fas fa-exclamation-circle'></i> Seleccione un producto válido.", "error");
    return;
  }
  if (!cantidad || cantidad <= 0) {
    mostrarMensaje("msgVenta", "<i class='fas fa-exclamation-circle'></i> Ingrese una cantidad válida.", "error");
    return;
  }

  const precio = Number(producto.precio);
  carritoVenta.push({
    codigo: producto.codigo,
    nombre: producto.nombre,
    cantidad,
    precioUnitario: precio,
    subtotal: precio * cantidad
  });

  limpiarCampos(["v-cantidad"]);
  document.getElementById("v-producto").value = "";
  actualizarPrecioUnitario();
  renderizarCarritoVenta();
}

function quitarProductoCarrito(indice) {
  carritoVenta.splice(indice, 1);
  renderizarCarritoVenta();
}

function calcularTotalesVenta() {
  const subtotal = carritoVenta.reduce((acumulado, item) => acumulado + item.subtotal, 0);
  const aplicaIgv = document.getElementById("v-aplicaigv").checked;
  const igv = aplicaIgv ? subtotal * IGV_PORCENTAJE : 0;
  const total = subtotal + igv;
  return { subtotal, igv, total };
}

function renderizarCarritoVenta() {
  renderTabla("tablaCarritoVenta", carritoVenta, (item, i) => `
        <tr>
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>S/ ${item.precioUnitario.toFixed(2)}</td>
            <td>S/ ${item.subtotal.toFixed(2)}</td>
            <td>
                <button class="btn-eliminar" data-accion="quitarProductoCarrito" data-indice="${i}"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`, 5, "Aún no agregaste productos a esta venta");

  const { subtotal, igv, total } = calcularTotalesVenta();
  document.getElementById("v-subtotal").textContent = `S/ ${subtotal.toFixed(2)}`;
  document.getElementById("v-igv").textContent = `S/ ${igv.toFixed(2)}`;
  document.getElementById("v-total").textContent = `S/ ${total.toFixed(2)}`;
}

function limpiarFormularioVenta() {
  carritoVenta = [];
  document.getElementById("v-cliente").value = "";
  document.getElementById("v-producto").value = "";
  limpiarCampos(["v-cantidad", "v-fecha"]);
  document.getElementById("v-preciounitario").value = "";
  document.getElementById("v-aplicaigv").checked = true;
  renderizarCarritoVenta();
}

function guardarVenta() {
  const clienteId = document.getElementById("v-cliente").value;
  const fecha = document.getElementById("v-fecha").value;
  const clientes = obtenerLista("clientes");
  const cliente = clientes.find(c => String(c.id) === clienteId);

  if (!cliente) {
    mostrarMensaje("msgVenta", "<i class='fas fa-exclamation-circle'></i> Seleccione un cliente registrado.", "error");
    return;
  }
  if (carritoVenta.length === 0) {
    mostrarMensaje("msgVenta", "<i class='fas fa-exclamation-circle'></i> Agregue al menos un producto a la venta.", "error");
    return;
  }
  if (!fecha) {
    mostrarMensaje("msgVenta", "<i class='fas fa-exclamation-circle'></i> Ingrese la fecha de venta.", "error");
    return;
  }

  const { subtotal, igv, total } = calcularTotalesVenta();

  agregarRegistro("ventas", {
    numero: `VEN-${Date.now().toString().slice(-6)}`,
    clienteId: cliente.id,
    clienteNombre: cliente.nombre,
    items: carritoVenta,
    fecha,
    subtotal: subtotal.toFixed(2),
    igv: igv.toFixed(2),
    total: total.toFixed(2),
    estado: "Registrada"
  });

  mostrarMensaje("msgVenta", "<i class='fas fa-check-circle'></i> Venta registrada correctamente.", "exito");
  limpiarFormularioVenta();
  actualizarBadge("badgeVentas", "ventas");
}

// --- Listado / historial de ventas ---
function mostrarVentas() {
  const ventas = obtenerLista("ventas");
  renderTabla("tablaVentas", ventas, (v, i) => `
        <tr>
            <td>${v.numero}</td>
            <td>${v.clienteNombre}</td>
            <td>${v.items.map(item => `${item.nombre} x${item.cantidad}`).join(", ")}</td>
            <td>${v.items.reduce((acumulado, item) => acumulado + item.cantidad, 0)}</td>
            <td>S/ ${v.subtotal}</td>
            <td>S/ ${v.total}</td>
            <td>${v.fecha}</td>
            <td>
                <div class="fila-accion">
                    <button class="btn-eliminar" data-accion="eliminarVenta" data-indice="${i}"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>`, 8, "No hay ventas registradas");
  actualizarBadge("badgeVentas", "ventas");
}

function eliminarVenta(i) {
  if (!confirm("¿Eliminar esta venta?")) return;
  eliminarRegistroPorIndice("ventas", i);
  mostrarVentas();
}

// --- Comprobante ---
function generarComprobante() {
  const numero = document.getElementById("cp-numero").value.trim();
  if (!numero) { mostrarMensaje("msgComprobante", "<i class='fas fa-exclamation-circle'></i> Ingrese el número de venta.", "error"); return; }
  agregarRegistro("comprobantes", {
    numeroVenta: numero,
    tipo: document.getElementById("cp-tipo").value,
    documento: document.getElementById("cp-documento").value.trim(),
    razonSocial: document.getElementById("cp-razonsocial").value.trim(),
    fecha: document.getElementById("cp-fecha").value
  });
  mostrarMensaje("msgComprobante", "<i class='fas fa-check-circle'></i> Comprobante generado correctamente.", "exito");
  limpiarCampos(["cp-numero", "cp-documento", "cp-razonsocial", "cp-fecha"]);
}

// --- Pago ---
function registrarPago() {
  const numero = document.getElementById("pg-numero").value.trim();
  if (!numero) { mostrarMensaje("msgPago", "<i class='fas fa-exclamation-circle'></i> Ingrese el número de venta.", "error"); return; }
  agregarRegistro("pagos", {
    numeroVenta: numero,
    monto: document.getElementById("pg-monto").value,
    metodo: document.getElementById("pg-metodo").value,
    operacion: document.getElementById("pg-operacion").value.trim()
  });
  mostrarMensaje("msgPago", "<i class='fas fa-check-circle'></i> Pago registrado correctamente.", "exito");
  limpiarCampos(["pg-numero", "pg-monto", "pg-operacion"]);
}

// --- Devolución ---
function registrarDevolucion() {
  const numero = document.getElementById("dv-numero").value.trim();
  const codigo = document.getElementById("dv-codigo").value.trim();
  const cantidad = Number.parseInt(document.getElementById("dv-cantidad").value, 10);
  if (!numero || !codigo || Number.isNaN(cantidad)) {
    mostrarMensaje("msgDevolucion", "<i class='fas fa-exclamation-circle'></i> Complete todos los campos.", "error");
    return;
  }
  agregarRegistro("devoluciones", {
    numeroVenta: numero, codigo, cantidad,
    motivo: document.getElementById("dv-motivo").value,
    reembolso: document.getElementById("dv-reembolso").value
  });

  const productos = obtenerLista("productos");
  const idx = productos.findIndex(p => p.codigo === codigo);
  if (idx !== -1) {
    productos[idx].stock = (Number.parseInt(productos[idx].stock, 10) || 0) + cantidad;
    guardarLista("productos", productos);
  }

  mostrarMensaje("msgDevolucion", "<i class='fas fa-check-circle'></i> Devolución registrada y stock actualizado.", "exito");
  limpiarCampos(["dv-numero", "dv-codigo", "dv-cantidad"]);
}

// --- Cotización ---
function generarCotizacion() {
  const nombre = document.getElementById("ct-nombre").value.trim();
  const correo = document.getElementById("ct-correo").value.trim();
  const cantidad = Number.parseInt(document.getElementById("ct-cantidad").value, 10);
  const precio = Number.parseFloat(document.getElementById("ct-precio").value);
  if (!nombre || !correo || Number.isNaN(cantidad) || Number.isNaN(precio)) {
    mostrarMensaje("msgCotizacion", "<i class='fas fa-exclamation-circle'></i> Complete todos los campos obligatorios.", "error");
    return;
  }
  agregarRegistro("cotizaciones", {
    nombre, correo,
    descripcion: document.getElementById("ct-descripcion").value.trim(),
    cantidad, precio,
    total: (cantidad * precio).toFixed(2),
    validez: document.getElementById("ct-validez").value
  });
  mostrarMensaje("msgCotizacion", "<i class='fas fa-check-circle'></i> Cotización generada correctamente.", "exito");
  limpiarCampos(["ct-nombre", "ct-correo", "ct-descripcion", "ct-cantidad", "ct-precio"]);
}

document.addEventListener("DOMContentLoaded", () => {
  poblarClientesVenta();
  poblarProductosVenta();
  renderizarCarritoVenta();
  actualizarBadge("badgeVentas", "ventas");
});
