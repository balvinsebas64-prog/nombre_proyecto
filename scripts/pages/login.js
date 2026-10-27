/* ===========================================================
   login.js — Lógica de la página de inicio de sesión
   =========================================================== */
function iniciarSesion() {
  const correo = document.getElementById("correoLogin").value;
  const clave = document.getElementById("claveLogin").value;
  const claveGuardada = localStorage.getItem("claveAdmin") || "1234";

  if (correo === "admin@gmail.com" && clave === claveGuardada) {
    localStorage.setItem("sesionActiva", JSON.stringify({ nombre: "Administrador", correo: "admin@gmail.com" }));
    globalThis.location.href = "src/app.html";
  } else {
    mostrarMensaje("mensaje", "<i class='fas fa-exclamation-circle'></i> Datos incorrectos. Intente nuevamente.", "error");
  }
}
