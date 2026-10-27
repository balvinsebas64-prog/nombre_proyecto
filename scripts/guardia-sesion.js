/* ===========================================================
   guardia-sesion.js — Redirige a login si no hay sesión activa.
   Se incluye con <script src="...guardia-sesion.js" data-login="ruta">
   =========================================================== */
(() => {
  const rutaLogin = document.currentScript.dataset.login || "login.html";
  if (!localStorage.getItem("sesionActiva")) {
    globalThis.location.href = rutaLogin;
  }
})();
