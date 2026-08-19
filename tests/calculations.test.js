/**
 * calculations.test.js
 * Casos de prueba manuales para las funciones de /js/calculations.js.
 * Ejecutar con: node tests/calculations.test.js
 * Cada resultado se compara contra un cálculo independiente hecho a mano
 * (ver comentario en cada caso).
 */
const { Calc } = require("../js/calculations.js");

let fallas = 0;
let total = 0;

function assertClose(nombre, obtenido, esperado, tolerancia = 0.01) {
  total++;
  const diff = Math.abs(obtenido - esperado);
  if (diff > tolerancia) {
    fallas++;
    console.error(`✕ ${nombre}: esperado ${esperado}, obtenido ${obtenido}`);
  } else {
    console.log(`✓ ${nombre}`);
  }
}

// --- Corriente monofásica: I = P / (V * cosφ) ---
// P=3000W, V=220V, cosφ=0.85 -> I = 3000/(220*0.85) = 16.0428...
assertClose("corriente monofásica, cosφ=0.85", Calc.corrienteMonofasicaDesdePotencia(3000, 220, 0.85), 16.0428, 0.001);

// cosφ=1 (carga resistiva): P=2200W, V=220V -> I=10A exacto
assertClose("corriente monofásica, cosφ=1", Calc.corrienteMonofasicaDesdePotencia(2200, 220, 1), 10, 0.0001);

// --- Corriente trifásica: I = P / (√3 * V * cosφ) ---
// P=10000W, V=380V, cosφ=0.9 -> I = 10000/(1.7320508*380*0.9)=16.885...
assertClose("corriente trifásica", Calc.corrienteTrifasicaDesdePotencia(10000, 380, 0.9), 16.885, 0.01);

// --- Potencia activa monofásica: P = V*I*cosφ ---
assertClose("potencia activa monofásica", Calc.potenciaActivaMonofasica(220, 10, 0.85), 1870, 0.01);

// --- Potencia activa trifásica: P = √3*V*I*cosφ ---
// V=380, I=16, cosφ=0.9 -> P = 1.7320508*380*16*0.9 = 9477.78...
assertClose("potencia activa trifásica", Calc.potenciaActivaTrifasica(380, 16, 0.9), 9477.78, 0.5);

// --- Potencia aparente ---
assertClose("potencia aparente monofásica", Calc.potenciaAparenteMonofasica(220, 10), 2200, 0.0001);
// V=380, I=16 -> S=1.7320508*380*16=10530.87
assertClose("potencia aparente trifásica", Calc.potenciaAparenteTrifasica(380, 16), 10530.87, 0.5);

// --- cosφ desde activa+aparente ---
// P=3000, S=3500 -> cosφ = 0.857142...
assertClose("cosφ desde P y S", Calc.cosPhiDesdeActivaYAparente(3000, 3500), 0.857142, 0.0001);

// --- Potencia reactiva desde activa+aparente: Q=√(S²-P²) ---
// P=3000, S=3500 -> Q=√(3500²-3000²)=√(12250000-9000000)=√3250000=1802.775...
assertClose("Q desde P y S", Calc.potenciaReactivaDesdeActivaYAparente(3000, 3500), 1802.7756, 0.01);

// --- cosφ desde activa+reactiva (triángulo de potencias) ---
// P=3000, Q=1802.7756 -> S=√(3000²+1802.7756²)=3500 -> cosφ=3000/3500=0.857142
assertClose("cosφ desde P y Q", Calc.cosPhiDesdeActivaYReactiva(3000, 1802.7756), 0.857142, 0.0001);

// --- Potencia reactiva desde activa+cosφ: Q = P*tan(acos(cosφ)) ---
// P=3000, cosφ=0.857142 -> φ=acos(0.857142)=0.54042 rad -> tan=0.600925 -> Q=1802.77
assertClose("Q desde P y cosφ", Calc.potenciaReactivaDesdeActivaYCosPhi(3000, 0.857142), 1802.77, 1);

// --- Caída de tensión monofásica: ΔV = 2*I*cosφ*L*ρ/S ---
// I=10A, cosφ=1, L=30m, ρ_cu=0.0178, S=2.5mm² -> ΔV = 2*10*1*30*0.0178/2.5 = 4.272 V
assertClose(
  "caída de tensión monofásica, cobre",
  Calc.caidaTensionMonofasica(10, 30, 0.0178, 2.5, 1),
  4.272,
  0.001
);
// caída porcentual sobre 220V -> 4.272/220*100 = 1.9418...%
assertClose("caída de tensión %, monofásica", Calc.caidaTensionPorcentual(4.272, 220), 1.9418, 0.01);

// --- Caída de tensión trifásica: ΔV = √3*I*cosφ*L*ρ/S ---
// I=16A, cosφ=0.9, L=50m, ρ_cu=0.0178, S=6mm²
// ΔV = 1.7320508*16*0.9*50*0.0178/6 = 3.7013...
assertClose(
  "caída de tensión trifásica, cobre",
  Calc.caidaTensionTrifasica(16, 50, 0.0178, 6, 0.9),
  3.7013,
  0.01
);

// --- Aluminio: mayor resistividad -> mayor caída para los mismos parámetros ---
const caidaCobre = Calc.caidaTensionMonofasica(10, 30, 0.0178, 2.5, 1);
const caidaAluminio = Calc.caidaTensionMonofasica(10, 30, 0.0282, 2.5, 1);
total++;
if (caidaAluminio > caidaCobre) {
  console.log("✓ caída de tensión en aluminio es mayor que en cobre (mismos parámetros)");
} else {
  fallas++;
  console.error("✕ caída de tensión en aluminio debería ser mayor que en cobre");
}

// --- Tensión en la carga ---
assertClose("tensión en la carga", Calc.tensionEnLaCarga(220, 4.272), 215.728, 0.001);

// --- Validación de rango de cosφ inválido (no calculado por Calc, pero documentado aquí) ---
// (La validación de cosφ fuera de (0,1] se prueba en validation.test.js)

console.log(`\n${total - fallas}/${total} casos correctos.`);
if (fallas > 0) process.exit(1);
