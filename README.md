# CalOhm — Calculadora eléctrica para profesionales

PWA offline para electricistas domiciliarios argentinos. Calcula caída de
tensión, corriente, potencia activa, potencia aparente, potencia reactiva y
factor de potencia, y ayuda a seleccionar la sección de conductor por caída
de tensión, para instalaciones monofásicas y trifásicas.

## Estado de V1 y advertencia importante

CalOhm **no inventa valores normativos**. Cada criterio usado en la app está
en `data/normative-data.js`, con la fuente que se consultó para verificarlo
y un flag `verificado: true/false`.

Lo que quedó **verificado y en uso**:
- Límite de caída de tensión: **3 %** para circuitos terminales de
  iluminación y tomacorrientes (uso general y especial).
- Límite de caída de tensión para motores: **5 %** en régimen, **15 %**
  durante el arranque.
- Límite de caída de tensión del tramo seccional: **1 %**.

Lo que quedó **pendiente de verificación** (y por lo tanto la app lo declara
explícitamente en pantalla en vez de usarlo como si fuera un límite
normativo confirmado):
- La tabla de **corriente admisible (ampacidad, Iz)** por sección,
  material y método de canalización (AEA 90364-7-770, tablas 770.12.I y
  770.12.III). CalOhm V1 recomienda sección **solo por caída de tensión**;
  no valida ampacidad. Antes de usar un resultado en obra, verificá la
  ampacidad de la sección elegida contra la tabla oficial vigente de AEA.
- El coeficiente de corrección de resistividad por temperatura de servicio
  del conductor (V1 calcula con resistividad del cobre/aluminio a 20 °C).
- El criterio de caída de tensión para "circuitos de uso específico"
  (la propia AEA 90364-7-771 remite a evaluación caso por caso).

**Antes de usar esta app en una instalación real, contrastá los criterios
normativos contra el ejemplar vigente de AEA 90364 / AEA 90364-7-770 /
AEA 90364-7-771.**

## Fórmulas utilizadas

Todas en `js/calculations.js`, con pruebas manuales en `tests/`.

| Cálculo | Fórmula |
|---|---|
| Corriente monofásica | I = P / (V·cosφ) |
| Corriente trifásica | I = P / (√3·V·cosφ) |
| Potencia activa monofásica | P = V·I·cosφ |
| Potencia activa trifásica | P = √3·V·I·cosφ |
| Potencia aparente monofásica | S = V·I |
| Potencia aparente trifásica | S = √3·V·I |
| Potencia reactiva (P, S) | Q = √(S² − P²) |
| Potencia reactiva (P, cosφ) | Q = P·tan(acos(cosφ)) |
| cos φ (P, S) | cosφ = P / S |
| cos φ (P, Q) | cosφ = P / √(P² + Q²) |
| Caída de tensión monofásica | ΔV = 2·I·cosφ·L·ρ/S |
| Caída de tensión trifásica | ΔV = √3·I·cosφ·L·ρ/S |

`ρ` es la resistividad del conductor a 20 °C (cobre = 0,0178 Ω·mm²/m,
aluminio = 0,0282 Ω·mm²/m — constantes físicas, no valores de tabla AEA).
`L` es la distancia tablero → carga que ingresa el usuario; la app aplica
internamente el factor de ida y vuelta (o el √3 en trifásico), sin pedirle
al usuario que la duplique.

La aproximación es **resistiva pura** (no incorpora reactancia del cable):
es razonable para las secciones chicas y longitudes típicas de una
instalación domiciliaria, pero es una simplificación declarada, no un dato
oculto — se explicita en el detalle "Ver cálculo" de cada resultado.

## Referencias normativas utilizadas

- AEA 90364 — Reglamentación para la ejecución de instalaciones eléctricas
  en inmuebles.
- AEA 90364-7-770 — Viviendas unifamiliares hasta 63 A (edición 2017),
  Tabla 770.6 (tipos de circuito).
- AEA 90364-7-771 — Unidades funcionales / criterios generales de caída de
  tensión, consultada de forma indirecta a través de fuentes secundarias
  (ver `data/normative-data.js` → `fuentesConsultadas`).

## Estructura del proyecto

```
calohm/
├── index.html
├── styles.css
├── app.js
├── manifest.json
├── service-worker.js
├── js/
│   ├── calculations.js   fórmulas puras
│   ├── validation.js     validación de entradas
│   ├── normative.js      lectura de criterios normativos
│   ├── ui.js              renderizado de pantallas
│   └── storage.js        persistencia de tema (localStorage)
├── data/
│   ├── conductors.js      secciones estándar y resistividad
│   └── normative-data.js  reglas normativas centralizadas
├── icons/
└── tests/
    ├── calculations.test.js
    └── validation.test.js
```

## Ejecutar localmente

No requiere build ni backend. Cualquier servidor estático sirve, por
ejemplo:

```bash
cd calohm
python3 -m http.server 8080
# abrir http://localhost:8080
```

(Abrir `index.html` con doble clic también funciona, aunque el Service
Worker requiere `http://` o `https://` para registrarse — file:// no lo
soporta en la mayoría de los navegadores.)

## Ejecutar las pruebas

```bash
node tests/calculations.test.js
node tests/validation.test.js
```

## Desplegar en Netlify

1. Subí la carpeta `calohm/` a un repositorio Git, o arrastrá la carpeta
   directamente a **Netlify Drop** (https://app.netlify.com/drop).
2. Si usás Netlify vía Git: "New site from Git" → seleccionar el repo →
   dejar el *build command* vacío y el *publish directory* como `calohm`
   (o la raíz, si el repo solo contiene esta app).
3. Netlify sirve HTTPS por defecto, lo cual es necesario para que el
   Service Worker se registre y la PWA sea instalable.
4. Verificar después del deploy: abrir el sitio, comprobar que aparece el
   ícono de "Instalar app" en el navegador, y probar el funcionamiento
   offline (DevTools → Network → Offline, o modo avión en el celular).

## Próximas versiones (fuera de alcance de V1)

Explícitamente no incluido en V1: IA/chatbot, login, backend, base de
datos remota, presupuestos, clientes, proyectos, sincronización.
# calohm
