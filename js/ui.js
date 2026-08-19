/**
 * ui.js
 * -------------------------------------------------------------------------
 * Renderizado de pantallas. Los event handlers llaman a Calc / Validation /
 * Normative — no repiten fórmulas ni criterios normativos acá.
 * -------------------------------------------------------------------------
 */

const UI = (() => {
  const app = () => document.getElementById("app");

  const TOOLS = [
    { id: "caida", nombre: "Caída de tensión", icono: "⚡", principal: true },
    { id: "corriente", nombre: "Corriente", icono: "A" },
    { id: "potencia", nombre: "Potencia", icono: "P" },
    { id: "aparente", nombre: "Potencia aparente", icono: "S" },
    { id: "reactiva", nombre: "Potencia reactiva", icono: "Q" },
    { id: "fp", nombre: "Factor de potencia", icono: "cφ" },
  ];

  function num(v) {
    return Number(v).toLocaleString("es-AR", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }

  // ---- Home -------------------------------------------------------------
  function renderHome() {
    const cards = TOOLS.map(
      (t) => `
      <button class="tool-card ${t.principal ? "tool-card--principal" : ""}" data-tool="${t.id}">
        <span class="tool-card__icon">${t.icono}</span>
        <span class="tool-card__nombre">${t.nombre}</span>
      </button>`
    ).join("");

    app().innerHTML = `
      <header class="topbar">
        <div class="brand">
          <span class="brand__mark">Ω</span>
          <div>
            <h1 class="brand__title">CalOhm</h1>
            <p class="brand__subtitle">Calculadora eléctrica</p>
          </div>
        </div>
        <button id="theme-toggle" class="icon-btn" aria-label="Cambiar tema">◐</button>
      </header>
      <main class="home-grid">${cards}</main>
      <footer class="disclaimer">
        Los resultados de CalOhm son una herramienta de cálculo y verificación.
        La selección definitiva de conductores, protecciones y demás componentes
        debe verificarse conforme a la reglamentación AEA vigente y las condiciones
        reales de la instalación.
      </footer>
    `;

    document.querySelectorAll("[data-tool]").forEach((btn) => {
      btn.addEventListener("click", () => App.navigate(btn.dataset.tool));
    });
    document.getElementById("theme-toggle").addEventListener("click", App.toggleTheme);
  }

  // ---- Encabezado de pantalla reutilizable -------------------------------
  function screenHeader(titulo) {
    return `
      <header class="topbar topbar--screen">
        <button class="icon-btn" id="btn-back" aria-label="Volver">←</button>
        <h2 class="screen-title">${titulo}</h2>
        <button id="theme-toggle" class="icon-btn" aria-label="Cambiar tema">◐</button>
      </header>`;
  }

  function bindHeader() {
    document.getElementById("btn-back").addEventListener("click", () => App.navigate("home"));
    document.getElementById("theme-toggle").addEventListener("click", App.toggleTheme);
  }

  function errorBox(id) {
    return `<p class="field-error" id="${id}" role="alert"></p>`;
  }

  function setError(id, mensaje) {
    const el = document.getElementById(id);
    if (el) el.textContent = mensaje || "";
  }

  // ---- Caída de tensión ---------------------------------------------------
  function renderCaidaTension() {
    const secciones = STANDARD_SECTIONS_MM2.map((s) => `<option value="${s}">${s} mm²</option>`).join("");
    app().innerHTML = `
      ${screenHeader("Caída de tensión")}
      <main class="form">
        <fieldset class="field-group">
          <legend>Sistema</legend>
          <div class="segmented" id="ct-sistema">
            <button type="button" class="segmented__opt is-active" data-val="mono">Monofásico · 220 V</button>
            <button type="button" class="segmented__opt" data-val="tri">Trifásico · 380 V</button>
          </div>
        </fieldset>

        <label class="field">
          <span>Tensión (V)</span>
          <input type="number" inputmode="decimal" id="ct-tension" value="220">
        </label>

        <fieldset class="field-group">
          <legend>Material del conductor</legend>
          <div class="segmented" id="ct-material">
            <button type="button" class="segmented__opt is-active" data-val="cobre">Cobre</button>
            <button type="button" class="segmented__opt" data-val="aluminio">Aluminio</button>
          </div>
        </fieldset>

        <label class="field">
          <span>Tipo de circuito</span>
          <select id="ct-tipo">
            <option value="IUG">Iluminación (IUG)</option>
            <option value="TUG" selected>Tomacorrientes uso general (TUG)</option>
            <option value="TUE">Tomacorrientes uso especial (TUE)</option>
            <option value="MOTOR">Motor</option>
            <option value="ESPECIFICO">Uso específico</option>
          </select>
        </label>

        <fieldset class="field-group">
          <legend>¿Qué dato de la carga conocés?</legend>
          <div class="segmented" id="ct-datocarga">
            <button type="button" class="segmented__opt is-active" data-val="potencia">Potencia</button>
            <button type="button" class="segmented__opt" data-val="corriente">Corriente</button>
          </div>
        </fieldset>

        <div id="ct-carga-potencia">
          <label class="field">
            <span>Potencia (W)</span>
            <input type="number" inputmode="decimal" id="ct-potencia">
          </label>
        </div>
        <div id="ct-carga-corriente" class="is-hidden">
          <label class="field">
            <span>Corriente (A)</span>
            <input type="number" inputmode="decimal" id="ct-corriente">
          </label>
        </div>

        <label class="field">
          <span>Factor de potencia (cos φ)</span>
          <input type="number" inputmode="decimal" step="0.01" id="ct-cosphi" value="1">
        </label>
        ${errorBox("ct-err-cosphi")}

        <label class="field">
          <span>Distancia tablero → carga (m)</span>
          <input type="number" inputmode="decimal" id="ct-distancia">
        </label>
        ${errorBox("ct-err-distancia")}

        <label class="field">
          <span>Sección a evaluar</span>
          <select id="ct-seccion">${secciones}</select>
        </label>

        <button class="btn btn--primary" id="ct-calcular">Calcular</button>
        <button class="btn btn--secondary" id="ct-auto">Encontrar sección recomendada</button>

        <div id="ct-resultado"></div>
      </main>
    `;
    bindHeader();

    const sistemaGroup = document.getElementById("ct-sistema");
    sistemaGroup.addEventListener("click", (e) => {
      const btn = e.target.closest(".segmented__opt");
      if (!btn) return;
      setActive(sistemaGroup, btn);
      document.getElementById("ct-tension").value = btn.dataset.val === "mono" ? 220 : 380;
    });

    setActive(document.getElementById("ct-material"), null);
    document.getElementById("ct-material").addEventListener("click", (e) => {
      const btn = e.target.closest(".segmented__opt");
      if (!btn) return;
      setActive(document.getElementById("ct-material"), btn);
    });

    const datoCargaGroup = document.getElementById("ct-datocarga");
    datoCargaGroup.addEventListener("click", (e) => {
      const btn = e.target.closest(".segmented__opt");
      if (!btn) return;
      setActive(datoCargaGroup, btn);
      const esPotencia = btn.dataset.val === "potencia";
      document.getElementById("ct-carga-potencia").classList.toggle("is-hidden", !esPotencia);
      document.getElementById("ct-carga-corriente").classList.toggle("is-hidden", esPotencia);
    });

    document.getElementById("ct-calcular").addEventListener("click", () => {
      const seccionElegida = Number(document.getElementById("ct-seccion").value);
      const r = calcularCaidaTension(seccionElegida);
      if (r) renderResultadoCaidaTension(r);
    });

    document.getElementById("ct-auto").addEventListener("click", () => {
      const resultado = encontrarSeccionRecomendada();
      if (resultado) renderResultadoCaidaTension(resultado, true);
    });
  }

  function setActive(group, btn) {
    group.querySelectorAll(".segmented__opt").forEach((b) => b.classList.remove("is-active"));
    if (btn) btn.classList.add("is-active");
    else group.querySelector(".segmented__opt").classList.add("is-active");
  }

  function leerDatosCaidaTension() {
    const sistema = document.querySelector("#ct-sistema .is-active").dataset.val;
    const V = Number(document.getElementById("ct-tension").value);
    const material = document.querySelector("#ct-material .is-active").dataset.val;
    const tipoCircuito = document.getElementById("ct-tipo").value;
    const datoCarga = document.querySelector("#ct-datocarga .is-active").dataset.val;
    const cosPhiRaw = document.getElementById("ct-cosphi").value;
    const distanciaRaw = document.getElementById("ct-distancia").value;

    const vCosPhi = Validation.validarCosPhi(cosPhiRaw);
    setError("ct-err-cosphi", vCosPhi.mensaje);
    const vDist = Validation.validarDistancia(distanciaRaw);
    setError("ct-err-distancia", vDist.mensaje);

    let potenciaW = null,
      corrienteA = null;
    if (datoCarga === "potencia") {
      const raw = document.getElementById("ct-potencia").value;
      const v = Validation.validarPositivo(raw, "la potencia");
      if (!v.valido) {
        setError("ct-err-distancia", vDist.valido ? "" : vDist.mensaje);
        alert(v.mensaje);
        return null;
      }
      potenciaW = Number(raw);
    } else {
      const raw = document.getElementById("ct-corriente").value;
      const v = Validation.validarPositivo(raw, "la corriente");
      if (!v.valido) {
        alert(v.mensaje);
        return null;
      }
      corrienteA = Number(raw);
    }

    if (!vCosPhi.valido || !vDist.valido) return null;

    const cosPhi = Number(cosPhiRaw);
    const distancia = Number(distanciaRaw);

    if (corrienteA === null) {
      corrienteA =
        sistema === "mono"
          ? Calc.corrienteMonofasicaDesdePotencia(potenciaW, V, cosPhi)
          : Calc.corrienteTrifasicaDesdePotencia(potenciaW, V, cosPhi);
    }

    return { sistema, V, material, tipoCircuito, cosPhi, distancia, corrienteA, potenciaW };
  }

  function calcularCaidaTension(seccion_mm2) {
    const datos = leerDatosCaidaTension();
    if (!datos) return null;
    const resistividad = RESISTIVITY_OHM_MM2_PER_M[datos.material];
    const deltaV =
      datos.sistema === "mono"
        ? Calc.caidaTensionMonofasica(datos.corrienteA, datos.distancia, resistividad, seccion_mm2, datos.cosPhi)
        : Calc.caidaTensionTrifasica(datos.corrienteA, datos.distancia, resistividad, seccion_mm2, datos.cosPhi);
    const deltaVPct = Calc.caidaTensionPorcentual(deltaV, datos.V);
    const tensionCarga = Calc.tensionEnLaCarga(datos.V, deltaV);
    const regla = Normative.limiteCaidaTension(datos.tipoCircuito);
    const estado = Normative.evaluarEstado(deltaVPct, regla ? regla.valor : null);

    return { datos, seccion_mm2, deltaV, deltaVPct, tensionCarga, regla, estado };
  }

  function encontrarSeccionRecomendada() {
    for (const s of STANDARD_SECTIONS_MM2) {
      const r = calcularCaidaTension(s);
      if (!r) return null;
      if (r.estado.estado === "CUMPLE") return r;
    }
    // Ninguna sección de la serie cumple: devolver el cálculo con la mayor sección disponible.
    return calcularCaidaTension(STANDARD_SECTIONS_MM2[STANDARD_SECTIONS_MM2.length - 1]);
  }

  function renderResultadoCaidaTension(r, esAuto) {
    const { datos, seccion_mm2, deltaV, deltaVPct, tensionCarga, regla, estado } = r;
    const badgeClass =
      estado.estado === "CUMPLE" ? "badge--ok" : estado.estado === "NO_CUMPLE" ? "badge--fail" : "badge--warn";

    const advertenciaAmpacidad = normativeRules.corrienteAdmisible.verificado
      ? ""
      : `<p class="notice notice--pending">⚠ Este resultado evalúa solo caída de tensión. La verificación de
         corriente admisible (ampacidad) según AEA 90364-7-770 Tablas 770.12.I/III está pendiente de carga
         en esta versión — confirmá la ampacidad de la sección por tu cuenta.</p>`;

    document.getElementById("ct-resultado").innerHTML = `
      <section class="result">
        <h3>Resultado</h3>
        ${esAuto ? `<p class="notice">Sección recomendada evaluada automáticamente: <strong>${seccion_mm2} mm²</strong></p>` : ""}
        <dl class="result-grid">
          <div><dt>Corriente</dt><dd>${num(datos.corrienteA)} A</dd></div>
          <div><dt>Sección utilizada</dt><dd>${seccion_mm2} mm²</dd></div>
          <div><dt>Caída de tensión</dt><dd>${num(deltaV)} V</dd></div>
          <div><dt>Caída porcentual</dt><dd>${num(deltaVPct)} %</dd></div>
          <div><dt>Límite aplicable</dt><dd>${regla && regla.valor !== null ? regla.valor.toFixed(2) + " %" : "no verificado"}</dd></div>
          <div><dt>Tensión en la carga</dt><dd>${num(tensionCarga)} V</dd></div>
        </dl>
        <p class="badge ${badgeClass}">${estado.texto}</p>
        ${advertenciaAmpacidad}
        <details class="ver-calculo">
          <summary>Ver cálculo</summary>
          <pre>${textoVerCalculo(r)}</pre>
        </details>
      </section>
    `;
  }

  function textoVerCalculo(r) {
    const { datos, seccion_mm2, deltaV, deltaVPct, tensionCarga, regla } = r;
    const resistividad = RESISTIVITY_OHM_MM2_PER_M[datos.material];
    const formula =
      datos.sistema === "mono"
        ? "ΔV = 2 · I · cos φ · L · ρ / S"
        : "ΔV = √3 · I · cos φ · L · ρ / S";

    return `Datos
V = ${datos.V} V
${datos.potenciaW !== null ? "P = " + datos.potenciaW + " W" : "I (ingresada) = " + num(datos.corrienteA) + " A"}
cos φ = ${datos.cosPhi}
L = ${datos.distancia} m
S = ${seccion_mm2} mm²
Material = ${datos.material} (ρ = ${resistividad} Ω·mm²/m)
Sistema = ${datos.sistema === "mono" ? "monofásico" : "trifásico"}

Corriente calculada
I = ${num(datos.corrienteA)} A

Caída de tensión
${formula}
ΔV = ${num(deltaV)} V
ΔV% = ${num(deltaVPct)} %
Tensión en la carga = ${num(tensionCarga)} V

Criterio AEA
${Normative.textoReferencia(regla)}

${RESISTIVITY_NOTE}`;
  }

  // ---- Corriente ------------------------------------------------------
  function renderCorriente() {
    app().innerHTML = `
      ${screenHeader("Corriente")}
      <main class="form">
        <fieldset class="field-group">
          <legend>Sistema</legend>
          <div class="segmented" id="i-sistema">
            <button type="button" class="segmented__opt is-active" data-val="mono">Monofásico</button>
            <button type="button" class="segmented__opt" data-val="tri">Trifásico</button>
          </div>
        </fieldset>
        <label class="field"><span>Tensión (V)</span><input type="number" inputmode="decimal" id="i-tension" value="220"></label>
        <label class="field"><span>Potencia (W)</span><input type="number" inputmode="decimal" id="i-potencia"></label>
        <label class="field"><span>Factor de potencia (cos φ)</span><input type="number" inputmode="decimal" step="0.01" id="i-cosphi" value="1"></label>
        ${errorBox("i-err")}
        <button class="btn btn--primary" id="i-calcular">Calcular</button>
        <div id="i-resultado"></div>
      </main>`;
    bindHeader();
    document.getElementById("i-sistema").addEventListener("click", (e) => {
      const btn = e.target.closest(".segmented__opt");
      if (!btn) return;
      setActive(document.getElementById("i-sistema"), btn);
      document.getElementById("i-tension").value = btn.dataset.val === "mono" ? 220 : 380;
    });
    document.getElementById("i-calcular").addEventListener("click", () => {
      const sistema = document.querySelector("#i-sistema .is-active").dataset.val;
      const V = Number(document.getElementById("i-tension").value);
      const P = document.getElementById("i-potencia").value;
      const cosPhiRaw = document.getElementById("i-cosphi").value;
      const vP = Validation.validarPositivo(P, "la potencia");
      const vCos = Validation.validarCosPhi(cosPhiRaw);
      setError("i-err", !vP.valido ? vP.mensaje : !vCos.valido ? vCos.mensaje : "");
      if (!vP.valido || !vCos.valido) return;
      const cosPhi = Number(cosPhiRaw);
      const I =
        sistema === "mono"
          ? Calc.corrienteMonofasicaDesdePotencia(Number(P), V, cosPhi)
          : Calc.corrienteTrifasicaDesdePotencia(Number(P), V, cosPhi);
      document.getElementById("i-resultado").innerHTML = resultadoSimple("Corriente", num(I) + " A");
    });
  }

  // ---- Potencia activa --------------------------------------------------
  function renderPotencia() {
    app().innerHTML = `
      ${screenHeader("Potencia")}
      <main class="form">
        <fieldset class="field-group">
          <legend>Sistema</legend>
          <div class="segmented" id="p-sistema">
            <button type="button" class="segmented__opt is-active" data-val="mono">Monofásico</button>
            <button type="button" class="segmented__opt" data-val="tri">Trifásico</button>
          </div>
        </fieldset>
        <label class="field"><span>Tensión (V)</span><input type="number" inputmode="decimal" id="p-tension" value="220"></label>
        <label class="field"><span>Corriente (A)</span><input type="number" inputmode="decimal" id="p-corriente"></label>
        <label class="field"><span>Factor de potencia (cos φ)</span><input type="number" inputmode="decimal" step="0.01" id="p-cosphi" value="1"></label>
        ${errorBox("p-err")}
        <button class="btn btn--primary" id="p-calcular">Calcular</button>
        <div id="p-resultado"></div>
      </main>`;
    bindHeader();
    document.getElementById("p-sistema").addEventListener("click", (e) => {
      const btn = e.target.closest(".segmented__opt");
      if (!btn) return;
      setActive(document.getElementById("p-sistema"), btn);
      document.getElementById("p-tension").value = btn.dataset.val === "mono" ? 220 : 380;
    });
    document.getElementById("p-calcular").addEventListener("click", () => {
      const sistema = document.querySelector("#p-sistema .is-active").dataset.val;
      const V = Number(document.getElementById("p-tension").value);
      const I = document.getElementById("p-corriente").value;
      const cosPhiRaw = document.getElementById("p-cosphi").value;
      const vI = Validation.validarPositivo(I, "la corriente");
      const vCos = Validation.validarCosPhi(cosPhiRaw);
      setError("p-err", !vI.valido ? vI.mensaje : !vCos.valido ? vCos.mensaje : "");
      if (!vI.valido || !vCos.valido) return;
      const cosPhi = Number(cosPhiRaw);
      const P =
        sistema === "mono"
          ? Calc.potenciaActivaMonofasica(V, Number(I), cosPhi)
          : Calc.potenciaActivaTrifasica(V, Number(I), cosPhi);
      document.getElementById("p-resultado").innerHTML = resultadoSimple("Potencia activa", num(P) + " W");
    });
  }

  // ---- Potencia aparente --------------------------------------------------
  function renderAparente() {
    app().innerHTML = `
      ${screenHeader("Potencia aparente")}
      <main class="form">
        <fieldset class="field-group">
          <legend>Sistema</legend>
          <div class="segmented" id="s-sistema">
            <button type="button" class="segmented__opt is-active" data-val="mono">Monofásico</button>
            <button type="button" class="segmented__opt" data-val="tri">Trifásico</button>
          </div>
        </fieldset>
        <label class="field"><span>Tensión (V)</span><input type="number" inputmode="decimal" id="s-tension" value="220"></label>
        <label class="field"><span>Corriente (A)</span><input type="number" inputmode="decimal" id="s-corriente"></label>
        ${errorBox("s-err")}
        <button class="btn btn--primary" id="s-calcular">Calcular</button>
        <div id="s-resultado"></div>
      </main>`;
    bindHeader();
    document.getElementById("s-sistema").addEventListener("click", (e) => {
      const btn = e.target.closest(".segmented__opt");
      if (!btn) return;
      setActive(document.getElementById("s-sistema"), btn);
      document.getElementById("s-tension").value = btn.dataset.val === "mono" ? 220 : 380;
    });
    document.getElementById("s-calcular").addEventListener("click", () => {
      const sistema = document.querySelector("#s-sistema .is-active").dataset.val;
      const V = Number(document.getElementById("s-tension").value);
      const I = document.getElementById("s-corriente").value;
      const vI = Validation.validarPositivo(I, "la corriente");
      setError("s-err", vI.mensaje);
      if (!vI.valido) return;
      const S = sistema === "mono" ? Calc.potenciaAparenteMonofasica(V, Number(I)) : Calc.potenciaAparenteTrifasica(V, Number(I));
      const enKVA = S >= 1000;
      document.getElementById("s-resultado").innerHTML = resultadoSimple(
        "Potencia aparente",
        enKVA ? num(S / 1000) + " kVA" : num(S) + " VA"
      );
    });
  }

  // ---- Potencia reactiva --------------------------------------------------
  function renderReactiva() {
    app().innerHTML = `
      ${screenHeader("Potencia reactiva")}
      <main class="form">
        <label class="field"><span>Potencia activa (W)</span><input type="number" inputmode="decimal" id="q-p"></label>
        <label class="field"><span>Factor de potencia (cos φ)</span><input type="number" inputmode="decimal" step="0.01" id="q-cosphi" value="0.9"></label>
        ${errorBox("q-err")}
        <button class="btn btn--primary" id="q-calcular">Calcular</button>
        <div id="q-resultado"></div>
      </main>`;
    bindHeader();
    document.getElementById("q-calcular").addEventListener("click", () => {
      const P = document.getElementById("q-p").value;
      const cosPhiRaw = document.getElementById("q-cosphi").value;
      const vP = Validation.validarPositivo(P, "la potencia activa");
      const vCos = Validation.validarCosPhi(cosPhiRaw);
      setError("q-err", !vP.valido ? vP.mensaje : !vCos.valido ? vCos.mensaje : "");
      if (!vP.valido || !vCos.valido) return;
      const Q = Calc.potenciaReactivaDesdeActivaYCosPhi(Number(P), Number(cosPhiRaw));
      const enKvar = Q >= 1000;
      document.getElementById("q-resultado").innerHTML = resultadoSimple(
        "Potencia reactiva",
        enKvar ? num(Q / 1000) + " kvar" : num(Q) + " var"
      );
    });
  }

  // ---- Factor de potencia --------------------------------------------------
  function renderFactorPotencia() {
    app().innerHTML = `
      ${screenHeader("Factor de potencia")}
      <main class="form">
        <fieldset class="field-group">
          <legend>Datos disponibles</legend>
          <div class="segmented" id="fp-modo">
            <button type="button" class="segmented__opt is-active" data-val="sap">Activa + aparente</button>
            <button type="button" class="segmented__opt" data-val="sar">Activa + reactiva</button>
          </div>
        </fieldset>
        <label class="field"><span>Potencia activa (W)</span><input type="number" inputmode="decimal" id="fp-p"></label>
        <div id="fp-aparente-wrap">
          <label class="field"><span>Potencia aparente (VA)</span><input type="number" inputmode="decimal" id="fp-s"></label>
        </div>
        <div id="fp-reactiva-wrap" class="is-hidden">
          <label class="field"><span>Potencia reactiva (var)</span><input type="number" inputmode="decimal" id="fp-q"></label>
        </div>
        ${errorBox("fp-err")}
        <button class="btn btn--primary" id="fp-calcular">Calcular</button>
        <div id="fp-resultado"></div>
      </main>`;
    bindHeader();
    const grupo = document.getElementById("fp-modo");
    grupo.addEventListener("click", (e) => {
      const btn = e.target.closest(".segmented__opt");
      if (!btn) return;
      setActive(grupo, btn);
      const esSap = btn.dataset.val === "sap";
      document.getElementById("fp-aparente-wrap").classList.toggle("is-hidden", !esSap);
      document.getElementById("fp-reactiva-wrap").classList.toggle("is-hidden", esSap);
    });
    document.getElementById("fp-calcular").addEventListener("click", () => {
      const modo = document.querySelector("#fp-modo .is-active").dataset.val;
      const P = document.getElementById("fp-p").value;
      const vP = Validation.validarPositivo(P, "la potencia activa");
      if (!vP.valido) {
        setError("fp-err", vP.mensaje);
        return;
      }
      let cosPhi;
      if (modo === "sap") {
        const S = document.getElementById("fp-s").value;
        const vS = Validation.validarPositivo(S, "la potencia aparente");
        if (!vS.valido) {
          setError("fp-err", vS.mensaje);
          return;
        }
        if (Number(S) < Number(P)) {
          setError("fp-err", "La potencia aparente no puede ser menor que la activa.");
          return;
        }
        setError("fp-err", "");
        cosPhi = Calc.cosPhiDesdeActivaYAparente(Number(P), Number(S));
      } else {
        const Q = document.getElementById("fp-q").value;
        const vQ = Validation.validarPositivo(Q, "la potencia reactiva");
        if (!vQ.valido) {
          setError("fp-err", vQ.mensaje);
          return;
        }
        setError("fp-err", "");
        cosPhi = Calc.cosPhiDesdeActivaYReactiva(Number(P), Number(Q));
      }
      document.getElementById("fp-resultado").innerHTML = resultadoSimple("cos φ", cosPhi.toFixed(3));
    });
  }

  function resultadoSimple(etiqueta, valor) {
    return `
      <section class="result">
        <h3>Resultado</h3>
        <dl class="result-grid">
          <div><dt>${etiqueta}</dt><dd>${valor}</dd></div>
        </dl>
      </section>`;
  }

  return {
    renderHome,
    renderCaidaTension,
    renderCorriente,
    renderPotencia,
    renderAparente,
    renderReactiva,
    renderFactorPotencia,
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = { UI };
}
