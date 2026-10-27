/* ===========================================================
   usuarios.js — Lógica del módulo de Usuarios
   =========================================================== */
function guardarUsuario() {
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const clave = document.getElementById("clave").value.trim();

  if (!nombre || !correo || !clave) {
    mostrarMensaje("msgUsuario", "<i class='fas fa-exclamation-circle'></i> Complete todos los campos.", "error");
    return;
  }

  agregarRegistro("usuarios", { nombre, correo, clave });
  mostrarMensaje("msgUsuario", "<i class='fas fa-check-circle'></i> Usuario guardado correctamente.", "exito");

  limpiarCampos(["nombre", "correo", "clave"]);
  actualizarBadge("badgeUsuarios", "usuarios");
}

function mostrarUsuarios() {
  const usuarios = obtenerLista("usuarios");
  renderTabla("tablaUsuarios", usuarios, (u, i) => `
        <tr>
            <td>${u.id}</td>
            <td>${u.nombre}</td>
            <td>${u.correo}</td>
            <td>••••••</td>
            <td>
                <div class="fila-accion">
                    <button class="btn-editar" data-accion="editarUsuario" data-indice="${i}"><i class="fas fa-edit"></i></button>
                    <button class="btn-eliminar" data-accion="eliminarUsuario" data-indice="${i}"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>`, 5, "No hay usuarios registrados");
  actualizarBadge("badgeUsuarios", "usuarios");
}

function editarUsuario(i) {
  const usuarios = obtenerLista("usuarios");
  const nuevoNombre = prompt("Nuevo nombre", usuarios[i].nombre);
  const nuevoCorreo = prompt("Nuevo correo", usuarios[i].correo);
  if (nuevoNombre) usuarios[i].nombre = nuevoNombre;
  if (nuevoCorreo) usuarios[i].correo = nuevoCorreo;
  guardarLista("usuarios", usuarios);
  mostrarUsuarios();
}

function eliminarUsuario(i) {
  if (!confirm("¿Eliminar este usuario?")) return;
  eliminarRegistroPorIndice("usuarios", i);
  mostrarUsuarios();
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarBadge("badgeUsuarios", "usuarios");
});
