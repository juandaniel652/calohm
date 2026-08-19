/**
 * calculations.js
 * -------------------------------------------------------------------------
 * Funciones matemáticas/electrotécnicas puras. No contienen criterios
 * normativos (eso vive en normative.js + data/normative-data.js) ni tocan
 * el DOM. Fórmulas clásicas de electrotecnia, documentadas y con pruebas
 * en /tests.
 * -------------------------------------------------------------------------
 */

const Calc = (() => {
  /** Corriente monofásica a partir de potencia activa. I = P / (V·cosφ) */
  function corrienteMonofasicaDesdePotencia(P_W, V, cosPhi) {
    return P_W / (V * cosPhi);
  }

  /** Corriente trifásica a partir de potencia activa. I = P / (√3·V·cosφ) */
  function corrienteTrifasicaDesdePotencia(P_W, V_lineLine, cosPhi) {
    return P_W / (Math.sqrt(3) * V_lineLine * cosPhi);
  }

  /** Potencia activa monofásica. P = V·I·cosφ */
  function potenciaActivaMonofasica(V, I, cosPhi) {
    return V * I * cosPhi;
  }

  /** Potencia activa trifásica. P = √3·V·I·cosφ */
  function potenciaActivaTrifasica(V_lineLine, I, cosPhi) {
    return Math.sqrt(3) * V_lineLine * I * cosPhi;
  }

  /** Potencia aparente monofásica. S = V·I */
  function potenciaAparenteMonofasica(V, I) {
    return V * I;
  }

  /** Potencia aparente trifásica. S = √3·V·I */
  function potenciaAparenteTrifasica(V_lineLine, I) {
    return Math.sqrt(3) * V_lineLine * I;
  }

  /** Potencia aparente a partir de activa y cosφ. S = P / cosφ */
  function potenciaAparenteDesdeActiva(P_W, cosPhi) {
    return P_W / cosPhi;
  }

  /** Potencia reactiva a partir de activa y aparente. Q = √(S² − P²) */
  function potenciaReactivaDesdeActivaYAparente(P_W, S_VA) {
    const rad = S_VA * S_VA - P_W * P_W;
    return rad <= 0 ? 0 : Math.sqrt(rad);
  }

  /** Potencia reactiva a partir de activa y cosφ. Q = P·tan(φ) */
  function potenciaReactivaDesdeActivaYCosPhi(P_W, cosPhi) {
    const phi = Math.acos(cosPhi);
    return P_W * Math.tan(phi);
  }

  /** Factor de potencia a partir de activa y aparente. cosφ = P / S */
  function cosPhiDesdeActivaYAparente(P_W, S_VA) {
    return P_W / S_VA;
  }

  /** Factor de potencia a partir de activa y reactiva. cosφ = P / √(P²+Q²) */
  function cosPhiDesdeActivaYReactiva(P_W, Q_var) {
    const S = Math.sqrt(P_W * P_W + Q_var * Q_var);
    return P_W / S;
  }

  /**
   * Caída de tensión monofásica (aproximación resistiva, conductor de ida
   * y vuelta). ΔV = 2 · I · L · ρ / S
   *  - I: corriente (A)
   *  - L: longitud eléctrica del tramo, tablero → carga (m)
   *  - ρ: resistividad del conductor (Ω·mm²/m)
   *  - S: sección (mm²)
   * El factor de potencia se aplica sobre la componente resistiva:
   * en esta aproximación (sin dato de reactancia verificado) se multiplica
   * la corriente activa equivalente, es decir ΔV = 2·I·cosφ·L·ρ/S.
   */
  function caidaTensionMonofasica(I_A, L_m, resistividad, S_mm2, cosPhi) {
    return (2 * I_A * cosPhi * L_m * resistividad) / S_mm2;
  }

  /**
   * Caída de tensión trifásica (aproximación resistiva).
   * ΔV = √3 · I · L · ρ · cosφ / S
   */
  function caidaTensionTrifasica(I_A, L_m, resistividad, S_mm2, cosPhi) {
    return (Math.sqrt(3) * I_A * cosPhi * L_m * resistividad) / S_mm2;
  }

  function caidaTensionPorcentual(deltaV, V_ref) {
    return (deltaV / V_ref) * 100;
  }

  function tensionEnLaCarga(V_ref, deltaV) {
    return V_ref - deltaV;
  }

  return {
    corrienteMonofasicaDesdePotencia,
    corrienteTrifasicaDesdePotencia,
    potenciaActivaMonofasica,
    potenciaActivaTrifasica,
    potenciaAparenteMonofasica,
    potenciaAparenteTrifasica,
    potenciaAparenteDesdeActiva,
    potenciaReactivaDesdeActivaYAparente,
    potenciaReactivaDesdeActivaYCosPhi,
    cosPhiDesdeActivaYAparente,
    cosPhiDesdeActivaYReactiva,
    caidaTensionMonofasica,
    caidaTensionTrifasica,
    caidaTensionPorcentual,
    tensionEnLaCarga,
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = { Calc };
}
