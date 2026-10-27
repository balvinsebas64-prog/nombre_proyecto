/* ===========================================================
   cambiar-clave.js — Lógica de cambio de contraseña
   =========================================================== */
function cambiarClave() {
  const actual = document.getElementById("actual").value;
  const nueva = document.getElementById("nueva").value;
  const confirmar = document.getElementById("confirmar").value;
  const claveGuardada = localStorage.getItem("claveAdmin") || "1234";

  if (actual !== claveGuardada) {
    mostrarMensaje("mensaje", "<i class='fas fa-times-circle'></i> Clave actual incorrecta.", "error");
    return;
  }
  if (nueva !== confirmar) {
    mostrarMensaje("mensaje", "<i class='fas fa-times-circle'></i> Las claves no coinciden.", "error");
    return;
  }
  localStorage.setItem("claveAdmin", nueva);
  mostrarMensaje("mensaje", "<i class='fas fa-check-circle'></i> Contraseña actualizada correctamente.", "exito");
  setTimeout(() => { globalThis.location.href = "login.html"; }, 1200);
}
