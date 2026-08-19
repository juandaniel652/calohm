/**
 * storage.js
 * -------------------------------------------------------------------------
 * Única persistencia de V1: preferencia de tema (claro/oscuro) en
 * localStorage. Sin cuentas, sin backend, sin historial online.
 * -------------------------------------------------------------------------
 */

const Storage = (() => {
  const THEME_KEY = "calohm:theme";

  function getTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || "claro";
    } catch (e) {
      return "claro";
    }
  }

  function setTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* almacenamiento no disponible — la app sigue funcionando sin persistir */
    }
  }

  return { getTheme, setTheme };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = { Storage };
}
