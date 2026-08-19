/**
 * validation.js
 * -------------------------------------------------------------------------
 * Validación de entradas de usuario. Devuelve { valido: bool, mensaje }.
 * Mensajes simples y no técnicos, según el criterio del proyecto.
 * -------------------------------------------------------------------------
 */

const Validation = (() => {
  function esNumeroValido(valor) {
    return valor !== "" && valor !== null && !Number.isNaN(Number(valor)) && Number.isFinite(Number(valor));
  }

  function validarPositivo(valor, etiqueta) {
    if (!esNumeroValido(valor)) return { valido: false, mensaje: `Ingresá ${etiqueta}.` };
    if (Number(valor) <= 0) return { valido: false, mensaje: `${capitalizar(etiqueta)} debe ser mayor a cero.` };
    return { valido: true, mensaje: "" };
  }

  function validarDistancia(valor) {
    if (!esNumeroValido(valor)) return { valido: false, mensaje: "Ingresá una distancia válida." };
    const n = Number(valor);
    if (n <= 0) return { valido: false, mensaje: "La distancia debe ser mayor a cero." };
    if (n > 1000) return { valido: false, mensaje: "Revisá la distancia: parece demasiado grande." };
    return { valido: true, mensaje: "" };
  }

  function validarCosPhi(valor) {
    if (!esNumeroValido(valor)) return { valido: false, mensaje: "Ingresá un factor de potencia válido." };
    const n = Number(valor);
    if (n <= 0 || n > 1) return { valido: false, mensaje: "El factor de potencia debe estar entre 0 (exclusivo) y 1." };
    return { valido: true, mensaje: "" };
  }

  function validarTension(valor) {
    if (!esNumeroValido(valor)) return { valido: false, mensaje: "Ingresá una tensión válida." };
    const n = Number(valor);
    if (n <= 0) return { valido: false, mensaje: "La tensión debe ser mayor a cero." };
    if (n > 1000) return { valido: false, mensaje: "Revisá la tensión: parece demasiado alta para uso domiciliario." };
    return { valido: true, mensaje: "" };
  }

  function validarSeccion(valor, seccionesDisponibles) {
    const n = Number(valor);
    if (!seccionesDisponibles.includes(n)) {
      return { valido: false, mensaje: "Seleccioná una sección válida." };
    }
    return { valido: true, mensaje: "" };
  }

  function capitalizar(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  return {
    esNumeroValido,
    validarPositivo,
    validarDistancia,
    validarCosPhi,
    validarTension,
    validarSeccion,
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = { Validation };
}
