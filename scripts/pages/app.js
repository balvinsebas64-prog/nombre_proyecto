/* ===========================================================
   app.js — Lógica de la página de bienvenida / panel principal
   =========================================================== */
function mostrarBienvenida() {
  const sesion = JSON.parse(localStorage.getItem("sesionActiva"));
  const el = document.getElementById("bienvenida");
  if (el && sesion) {
    el.innerHTML = `<i class="fas fa-user-circle"></i> Bienvenido, ${sesion.nombre}`;
  }
}

document.addEventListener("DOMContentLoaded", mostrarBienvenida);
