/**
 * normative.js
 * -------------------------------------------------------------------------
 * Capa que traduce data/normative-data.js en criterios utilizables por los
 * cálculos y en texto explicativo para el usuario. No contiene valores
 * normativos "hardcodeados": todo sale de normativeRules.
 * -------------------------------------------------------------------------
 */

const Normative = (() => {
  /** Devuelve el límite de caída de tensión (%) aplicable a un tipo de circuito. */
  function limiteCaidaTension(tipoCircuito) {
    const tc = normativeRules.tiposCircuito[tipoCircuito];
    if (!tc) return null;
    const regla = normativeRules.caidaTension[tc.caidaTensionRef];
    return regla || null;
  }

  /** Texto de referencia normativa para mostrar en pantalla ("Normativa utilizada: ..."). */
  function textoReferencia(regla) {
    if (!regla) return "Criterio no verificado — no disponible.";
    const estado = regla.verificado ? "" : " (PENDIENTE DE VERIFICACIÓN — no usar como criterio definitivo)";
    return `${regla.norma}\n${regla.seccion}\n${regla.descripcion}${estado}`;
  }

  /** Estado (CUMPLE / ADVERTENCIA / NO CUMPLE) de una caída de tensión porcentual contra el límite. */
  function evaluarEstado(caidaPorcentual, limitePorcentual) {
    if (limitePorcentual === null || limitePorcentual === undefined) {
      return { estado: "ADVERTENCIA", texto: "⚠ Sin criterio verificado para evaluar" };
    }
    if (caidaPorcentual <= limitePorcentual) {
      return { estado: "CUMPLE", texto: "✓ CUMPLE" };
    }
    return { estado: "NO_CUMPLE", texto: "✕ NO CUMPLE" };
  }

  return { limiteCaidaTension, textoReferencia, evaluarEstado };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = { Normative };
}
