/**
 * conductors.js
 * -------------------------------------------------------------------------
 * Datos de conductores. Estos valores son constantes físicas/electrotécnicas
 * (resistividad del cobre y del aluminio), NO valores normativos de tabla.
 * Se citan explícitamente para que puedan auditarse y reemplazarse si se
 * verifica un valor distinto en la fuente que se use como referencia.
 * -------------------------------------------------------------------------
 */

// Secciones normalizadas contempladas en V1 (serie habitual IRAM).
// La arquitectura permite agregar secciones sin tocar la lógica de cálculo.
const STANDARD_SECTIONS_MM2 = [1.5, 2.5, 4, 6, 10, 16, 25, 35];

// Resistividad eléctrica a 20 °C, en Ω·mm²/m (valor físico de tabla de
// materiales, ampliamente publicado — no es un valor de tabla AEA).
const RESISTIVITY_OHM_MM2_PER_M = {
  cobre: 0.0178,
  aluminio: 0.0282,
};

/**
 * NOTA IMPORTANTE:
 * La resistividad "efectiva" a la temperatura de servicio del conductor
 * (p. ej. 70 °C para aislación PVC) es mayor que la resistividad a 20 °C.
 * Muchas guías de cálculo usan un factor de corrección por temperatura
 * para la caída de tensión. Ese factor de corrección específico NO se
 * pudo verificar contra el texto de AEA durante el desarrollo de V1, por
 * lo que CalOhm V1 calcula con resistividad a 20 °C y lo declara
 * explícitamente en el detalle "Ver cálculo" como una simplificación,
 * en vez de inventar un coeficiente de corrección no verificado.
 */
const RESISTIVITY_NOTE =
  "Cálculo realizado con resistividad a 20 °C. No se aplica corrección por " +
  "temperatura de servicio del conductor porque el coeficiente específico " +
  "de AEA no pudo verificarse en esta versión.";

if (typeof module !== "undefined" && module.exports) {
  module.exports = { STANDARD_SECTIONS_MM2, RESISTIVITY_OHM_MM2_PER_M, RESISTIVITY_NOTE };
}
