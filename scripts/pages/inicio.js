/* ===========================================================
   inicio.js — Redirección inicial según haya sesión activa
   =========================================================== */
(() => {
  globalThis.location.href = localStorage.getItem("sesionActiva")
    ? "src/app.html"
    : "login.html";
})();
