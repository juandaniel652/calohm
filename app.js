/**
 * app.js — controlador principal: ruteo entre pantallas y tema.
 */
const App = (() => {
  const routes = {
    home: UI.renderHome,
    caida: UI.renderCaidaTension,
    corriente: UI.renderCorriente,
    potencia: UI.renderPotencia,
    aparente: UI.renderAparente,
    reactiva: UI.renderReactiva,
    fp: UI.renderFactorPotencia,
  };

  function navigate(route) {
    const render = routes[route] || routes.home;
    render();
    window.location.hash = route;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute(
      "data-theme",
      theme === "oscuro" ? "oscuro" : "claro",
    );
  }

  function toggleTheme() {
    const actual =
      document.documentElement.getAttribute("data-theme") === "oscuro"
        ? "oscuro"
        : "claro";
    const nuevo = actual === "oscuro" ? "claro" : "oscuro";
    applyTheme(nuevo);
    Storage.setTheme(nuevo);
  }

  function init() {
    applyTheme(Storage.getTheme());
    const inicial = window.location.hash.replace("#", "") || "home";
    navigate(routes[inicial] ? inicial : "home");

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js").catch(() => {
          /* si falla el registro, la app sigue funcionando online */
        });
      });
    }
  }

  return { navigate, toggleTheme, init };
})();

document.addEventListener("DOMContentLoaded", App.init);
