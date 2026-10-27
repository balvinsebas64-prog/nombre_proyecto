/* ===========================================================
   productos.js — Lógica del módulo de Productos
   =========================================================== */
function guardarProducto() {
  const nombre = document.getElementById("p-nombre").value.trim();
  const codigo = document.getElementById("p-codigo").value.trim();
  const descripcion = document.getElementById("p-descripcion").value.trim();
  const precio = Number.parseFloat(document.getElementById("p-precio").value);
  const stock = Number.parseInt(document.getElementById("p-stock").value, 10);

  if (!nombre || !codigo || Number.isNaN(precio) || Number.isNaN(stock)) {
    mostrarMensaje("msgProducto", "<i class='fas fa-exclamation-circle'></i> Complete los campos obligatorios.", "error");
    return;
  }
  const productos = obtenerLista("productos");
  if (productos.some(p => p.codigo === codigo)) {
    mostrarMensaje("msgProducto", "<i class='fas fa-exclamation-circle'></i> Ya existe un producto con ese código.", "error");
    return;
  }
  agregarRegistro("productos", { nombre, codigo, descripcion, precio, stock });
  mostrarMensaje("msgProducto", "<i class='fas fa-check-circle'></i> Producto registrado correctamente.", "exito");

  limpiarCampos(["p-nombre", "p-codigo", "p-descripcion", "p-precio", "p-stock"]);
  actualizarBadge("badgeProductos", "productos");
}

function mostrarInventario() {
  const productos = obtenerLista("productos");
  renderTabla("tablaInventario", productos, (p, i) => `
        <tr>
            <td>${p.codigo}</td>
            <td>${p.nombre}</td>
            <td>${p.descripcion || "—"}</td>
            <td>S/ ${Number(p.precio).toFixed(2)}</td>
            <td>${p.stock}</td>
            <td>
                <div class="fila-accion">
                    <button class="btn-eliminar" data-accion="eliminarProducto" data-indice="${i}"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>`, 6, "No hay productos registrados");
  actualizarBadge("badgeProductos", "productos");
}

function eliminarProducto(i) {
  if (!confirm("¿Está seguro de eliminar este producto? Esta acción no se puede deshacer.")) return;
  eliminarRegistroPorIndice("productos", i);
  mostrarInventario();
}

function actualizarStock() {
  const codigo = document.getElementById("s-codigo").value.trim();
  const nuevoStock = Number.parseInt(document.getElementById("s-stock").value, 10);
  const productos = obtenerLista("productos");
  const idx = productos.findIndex(p => p.codigo === codigo);

  if (idx === -1) {
    mostrarMensaje("msgStock", "<i class='fas fa-exclamation-circle'></i> No se encontró un producto con ese código.", "error");
    return;
  }
  productos[idx].stock = nuevoStock;
  guardarLista("productos", productos);
  mostrarMensaje("msgStock", "<i class='fas fa-check-circle'></i> Stock actualizado correctamente.", "exito");
  limpiarCampos(["s-codigo", "s-stock"]);
}

function buscarProducto() {
  const tipo = document.getElementById("bp-tipo").value;
  const valor = document.getElementById("bp-valor").value.trim().toLowerCase();
  const productos = obtenerLista("productos");
  const resultados = valor
    ? productos.filter(p => (p[tipo] || "").toString().toLowerCase().includes(valor))
    : [];

  renderTabla("tablaBusquedaProductos", resultados, (p) => `
        <tr>
            <td>${p.codigo}</td><td>${p.nombre}</td><td>${p.descripcion || "—"}</td>
            <td>S/ ${Number(p.precio).toFixed(2)}</td><td>${p.stock}</td>
        </tr>`, 5, valor ? "Sin resultados para esa búsqueda" : "Realice una búsqueda para ver resultados");
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarBadge("badgeProductos", "productos");
});
