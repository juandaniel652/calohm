/**
 * normative-data.js
 * -------------------------------------------------------------------------
 * Estructura centralizada de datos normativos utilizados por CalOhm.
 *
 * REGLA DEL PROYECTO: ningún valor normativo se incorpora sin haber sido
 * verificado contra una fuente normativa identificable. Todo valor que no
 * pudo verificarse contra el texto oficial de AEA queda marcado con
 * `verificado: false` y NO se utiliza como criterio de aprobación/rechazo
 * en los cálculos: la interfaz debe mostrarlo como "pendiente de
 * verificación" y no como límite normativo aplicado.
 *
 * Cada regla documenta: id, norma, edición (si se pudo determinar),
 * sección/cláusula, descripción, valor, unidad, condición de aplicación
 * y las fuentes consultadas para verificarla.
 * -------------------------------------------------------------------------
 */

const normativeRules = {

  // ---------------------------------------------------------------------
  // CAÍDA DE TENSIÓN — límites por tipo de circuito
  // Verificado por coincidencia entre múltiples fuentes secundarias que
  // citan el texto de AEA 90364-7-770 / 771. Antes de usar esta app en
  // una instalación real, contrastar contra el ejemplar vigente de AEA.
  // ---------------------------------------------------------------------
  caidaTension: {
    generalUsoEspecial: {
      id: "CT-01",
      norma: "AEA 90364-7-770 / 90364-7-771",
      edicion: "770: 2017 (no se pudo confirmar edición exacta de 771 aplicable)",
      seccion: "770.15 / 771 (criterios de caída de tensión)",
      descripcion:
        "Caída de tensión máxima admitida en circuitos terminales de uso general o especial (iluminación y tomacorrientes), medida entre el origen de la instalación y el punto más alejado del circuito.",
      valor: 3,
      unidad: "%",
      condicion: "Circuitos terminales de iluminación y tomacorrientes (IUG, TUG, TUE)",
      verificado: true,
      fuentesConsultadas: [
        "profetolocka.com.ar — Determinación de sección de conductores (caída de tensión), citando AEA 770/771",
      ],
    },
    motorRegimen: {
      id: "CT-02",
      norma: "AEA 90364-7-770 / 90364-7-771",
      edicion: "no confirmada",
      seccion: "criterios de caída de tensión para circuitos de motores",
      descripcion: "Caída de tensión máxima en régimen permanente para circuitos que alimentan exclusivamente motores.",
      valor: 5,
      unidad: "%",
      condicion: "Circuitos que alimentan solo motores, régimen normal",
      verificado: true,
      fuentesConsultadas: ["profetolocka.com.ar"],
    },
    motorArranque: {
      id: "CT-03",
      norma: "AEA 90364-7-770 / 90364-7-771",
      edicion: "no confirmada",
      seccion: "criterios de caída de tensión para circuitos de motores",
      descripcion: "Caída de tensión máxima admitida durante el arranque de un motor.",
      valor: 15,
      unidad: "%",
      condicion: "Circuitos que alimentan solo motores, durante el arranque",
      verificado: true,
      fuentesConsultadas: ["profetolocka.com.ar"],
    },
    seccional: {
      id: "CT-04",
      norma: "AEA 90364-7-770 (recomendación) / AEA 90364-7-771 (obligatorio)",
      edicion: "no confirmada",
      seccion: "criterio de caída de tensión en circuitos seccionales",
      descripcion:
        "Caída de tensión parcial admitida en el tramo seccional (desde el origen de la instalación hasta el tablero seccional). En AEA 770 figura como recomendación; en AEA 771 como límite obligatorio.",
      valor: 1,
      unidad: "%",
      condicion: "Tramo seccional (acometida → tablero seccional)",
      verificado: true,
      fuentesConsultadas: ["profetolocka.com.ar"],
    },
    otroUsoEspecifico: {
      id: "CT-05",
      norma: "AEA 90364-7-771",
      edicion: "no confirmada",
      seccion: "Circuitos de uso específico",
      descripcion:
        "Los circuitos de uso específico no contemplados en la clasificación general deben consultarse puntualmente en AEA 90364-7-771; no existe un porcentaje único aplicable a todos los casos.",
      valor: null,
      unidad: "%",
      condicion: "Circuitos de uso específico (a definir caso por caso)",
      verificado: false,
      fuentesConsultadas: [],
    },
  },

  // ---------------------------------------------------------------------
  // TIPOS DE CIRCUITO — Tabla 770.6 (resumen)
  // ---------------------------------------------------------------------
  tiposCircuito: {
    IUG: {
      id: "TC-01",
      norma: "AEA 90364-7-770",
      edicion: "2017",
      seccion: "Tabla 770.6",
      descripcion: "Iluminación de uso general",
      maxBocas: 15,
      maxProteccionA: 16,
      caidaTensionRef: "generalUsoEspecial",
      verificado: true,
    },
    TUG: {
      id: "TC-02",
      norma: "AEA 90364-7-770",
      edicion: "2017",
      seccion: "Tabla 770.6",
      descripcion: "Tomacorrientes de uso general",
      maxBocas: 15,
      maxProteccionA: 20,
      caidaTensionRef: "generalUsoEspecial",
      verificado: true,
    },
    TUE: {
      id: "TC-03",
      norma: "AEA 90364-7-770",
      edicion: "2017",
      seccion: "Tabla 770.6",
      descripcion: "Tomacorrientes de uso especial",
      maxBocas: 15,
      maxProteccionA: 32,
      caidaTensionRef: "generalUsoEspecial",
      verificado: true,
    },
    MOTOR: {
      id: "TC-04",
      norma: "AEA 90364-7-770 / 771",
      edicion: "no confirmada",
      seccion: "criterios de motores",
      descripcion: "Circuito dedicado a motor",
      maxBocas: null,
      maxProteccionA: null,
      caidaTensionRef: "motorRegimen",
      verificado: true,
    },
    ESPECIFICO: {
      id: "TC-05",
      norma: "AEA 90364-7-771",
      edicion: "no confirmada",
      seccion: "Circuitos de uso específico",
      descripcion: "Uso específico — remitir a AEA 90364-7-771, criterio a definir por el proyectista",
      maxBocas: null,
      maxProteccionA: null,
      caidaTensionRef: "otroUsoEspecifico",
      verificado: false,
    },
  },

  // ---------------------------------------------------------------------
  // CORRIENTE ADMISIBLE (Iz) POR SECCIÓN — PENDIENTE DE VERIFICACIÓN
  //
  // La AEA 90364-7-770 remite a sus tablas 770.12.I y 770.12.III para la
  // corriente máxima admisible según sección, tipo de cable (IRAM 247-3 /
  // IRAM 2178 / IRAM 62267) y método de canalización. No se pudo acceder
  // al texto completo y verificado de esas tablas durante el desarrollo
  // de V1, por lo tanto NINGÚN valor de ampacidad se preinstaló acá.
  //
  // Consecuencia funcional: la función "Encontrar sección recomendada"
  // de V1 evalúa la sección por CAÍDA DE TENSIÓN (criterio verificado),
  // pero NO valida corriente admisible hasta que esta tabla se complete
  // con los valores oficiales de AEA 770.12.I/III. La interfaz debe
  // advertir esto explícitamente en cada resultado.
  // ---------------------------------------------------------------------
  corrienteAdmisible: {
    verificado: false,
    fuente: "AEA 90364-7-770, Tablas 770.12.I y 770.12.III (pendiente de carga)",
    datos: null, // completar con { seccion_mm2: { cobre: A, aluminio: A } } una vez verificado
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { normativeRules };
}
