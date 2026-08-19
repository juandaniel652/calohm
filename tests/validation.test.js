/**
 * validation.test.js — Ejecutar con: node tests/validation.test.js
 */
const { Validation } = require("../js/validation.js");

let fallas = 0;
let total = 0;

function assertEq(nombre, obtenido, esperado) {
  total++;
  if (obtenido !== esperado) {
    fallas++;
    console.error(`✕ ${nombre}: esperado ${esperado}, obtenido ${obtenido}`);
  } else {
    console.log(`✓ ${nombre}`);
  }
}

assertEq("cosφ=1 es válido", Validation.validarCosPhi("1").valido, true);
assertEq("cosφ=0.85 es válido", Validation.validarCosPhi("0.85").valido, true);
assertEq("cosφ=0 es inválido", Validation.validarCosPhi("0").valido, false);
assertEq("cosφ=1.2 es inválido", Validation.validarCosPhi("1.2").valido, false);
assertEq("cosφ=-0.5 es inválido", Validation.validarCosPhi("-0.5").valido, false);
assertEq("cosφ vacío es inválido", Validation.validarCosPhi("").valido, false);

assertEq("distancia=30 es válida", Validation.validarDistancia("30").valido, true);
assertEq("distancia=0 es inválida", Validation.validarDistancia("0").valido, false);
assertEq("distancia negativa es inválida", Validation.validarDistancia("-5").valido, false);
assertEq("distancia no numérica es inválida", Validation.validarDistancia("abc").valido, false);
assertEq("distancia absurda (2000m) es inválida", Validation.validarDistancia("2000").valido, false);

assertEq("potencia positiva es válida", Validation.validarPositivo("3000", "la potencia").valido, true);
assertEq("potencia cero es inválida", Validation.validarPositivo("0", "la potencia").valido, false);
assertEq("potencia negativa es inválida", Validation.validarPositivo("-100", "la potencia").valido, false);

assertEq("tensión=220 es válida", Validation.validarTension("220").valido, true);
assertEq("tensión=0 es inválida", Validation.validarTension("0").valido, false);

console.log(`\n${total - fallas}/${total} casos correctos.`);
if (fallas > 0) process.exit(1);
