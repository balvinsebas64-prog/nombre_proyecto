/* ===========================================================
   recuperar.js — Lógica de recuperación de contraseña
   =========================================================== */
function recuperar() {
  const claveRec = document.getElementById("recuperacion").value;
  const nueva = document.getElementById("nueva").value;
  const confirmar = document.getElementById("confirmar").value;

  if (claveRec !== "REC2026") {
    mostrarMensaje("mensaje", "<i class='fas fa-times-circle'></i> Clave de recuperación incorrecta.", "error");
    return;
  }
  if (nueva !== confirmar) {
    mostrarMensaje("mensaje", "<i class='fas fa-times-circle'></i> Las contraseñas no coinciden.", "error");
    return;
  }
  localStorage.setItem("claveAdmin", nueva);
  mostrarMensaje("mensaje", "<i class='fas fa-check-circle'></i> Contraseña recuperada correctamente.", "exito");
  setTimeout(() => { globalThis.location.href = "login.html"; }, 1200);
}
