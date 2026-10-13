(() => {
  const box = document.getElementById("ling"); if (!box) return;
  const CORES = ["143,216,255", "155,107,255", "255,107,214", "120,230,170", "255,200,120"];
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const mk = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; e.innerHTML = h; return e };

  box.innerHTML = `
    <div class="ling-grid">
      <div class="ling-box">
        <h3>1. Tokenizador</h3>
        <textarea id="tk-in" rows="3" aria-label="Texto para dividir em tokens">A inteligência artificial transforma texto em números.</textarea>
        <div class="tk-out" id="tk-out"></div>
        <p class="lab-stats" id="tk-info"></p>
        <div class="tk-ids" id="tk-ids"></div>
        <small>Aproximação didática: os modelos reais usam vocabulários aprendidos (como o BPE), então os cortes mudam de modelo para modelo.</small>
      </div>
      <div class="ling-box">
        <h3>2. Mini-modelo de próxima palavra</h3>
        <textarea id="md-txt" rows="5" aria-label="Texto de treino">A inteligência artificial aprende padrões nos dados. A inteligência artificial usa modelos para prever a próxima palavra. O modelo aprende com exemplos e o modelo melhora com mais dados. A rede neural aprende ajustando pesos e a rede neural erra menos a cada passo.</textarea>
        <div class="lab-bar">
          <button class="btn" id="md-treinar">Treinar</button>
          <label>Criatividade <input type="range" id="md-t" min="1" max="20" value="6" aria-label="Criatividade"></label>
        </div>
        <p class="lab-stats" id="md-info"></p>
        <input type="text" id="md-ini" placeholder="Comece com uma palavra, ex.: a" aria-label="Palavra inicial" value="a">
        <div id="md-barras"></div>
        <p class="frase" id="md-frase"></p>
        <button class="btn ghost" id="md-gerar">Gerar frase</button>
      </div>
    </div>`;
  const $ = id => box.querySelector("#" + id);

  /* ----- 1. tokenizador ----- */
  const tokenizar = t => {
    const out = [];
    for (const m of t.matchAll(/\s*[\p{L}\p{N}]+|\s*[^\s\p{L}\p{N}]/gu)) {
      const w = m[0], esp = w.match(/^\s*/)[0], p = w.slice(esp.length);
      if (p.length > 6) { const k = Math.ceil(p.length / 4), n = Math.ceil(p.length / k); for (let i = 0; i < p.length; i += n) out.push((i ? "" : esp) + p.slice(i, i + n)) }
      else out.push(w);
    }
    return out;
  };
  const id = s => [...s].reduce((h, c) => (h * 31 + c.codePointAt(0)) >>> 0, 7) % 50000;
  const mostraTokens = () => {
    const t = $("tk-in").value, toks = tokenizar(t);
    $("tk-out").innerHTML = toks.map((k, i) => `<span class="tk" style="--c:${CORES[i % 5]}">${esc(k.replace(/^\s+/, "▁"))}</span>`).join("");
    $("tk-info").textContent = `${toks.length} tokens · ${t.length} caracteres`;
    $("tk-ids").textContent = toks.map(id).join("  ");
  };
  $("tk-in").addEventListener("input", mostraTokens);

  /* ----- 2. mini-modelo (bigramas) ----- */
  let M = {};
  const palavras = t => t.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
  const treinado = () => Object.keys(M).length > 0;
  const treinar = () => {
    const ws = palavras($("md-txt").value); M = {}; let pares = 0;
    for (let i = 0; i < ws.length - 1; i++) { const a = ws[i], b = ws[i + 1]; M[a] = M[a] || {}; M[a][b] = (M[a][b] || 0) + 1; pares++ }
    $("md-info").textContent = `${ws.length} palavras · ${new Set(ws).size} diferentes · ${pares} pares aprendidos`;
    mostrar();
  };
  const dist = w => {
    const o = M[w]; if (!o) return [];
    const tot = Object.values(o).reduce((s, v) => s + v, 0);
    return Object.entries(o).map(([k, v]) => [k, v / tot]).sort((a, b) => b[1] - a[1]);
  };
  const ultima = () => palavras($("md-ini").value).pop();
  const mostrar = () => {
    const bx = $("md-barras"); bx.innerHTML = "";
    if (!treinado()) { bx.innerHTML = "<small>Aperte Treinar primeiro.</small>"; return }
    const d = dist(ultima() || "").slice(0, 5);
    if (!d.length) { bx.innerHTML = "<small>O modelo nunca viu essa palavra seguida de algo. Tente outra.</small>"; return }
    d.forEach(([k, p]) => {
      const b = mk("button", "barra", `<i style="width:${Math.round(p * 100)}%"></i><span>${esc(k)}</span><span>${Math.round(p * 100)}%</span>`);
      b.onclick = () => { $("md-ini").value = ($("md-ini").value.trim() + " " + k).trim(); mostrar() };
      bx.appendChild(b);
    });
  };
  const gerar = () => {
    if (!treinado()) treinar();
    const ini = palavras($("md-ini").value), chaves = Object.keys(M);
    const out = ini.length ? [...ini] : [chaves[Math.random() * chaves.length | 0]];
    let w = out[out.length - 1]; const T = +$("md-t").value / 6;
    for (let i = 0; i < 15; i++) {
      const d = dist(w); if (!d.length) break;
      const pesos = d.map(([k, p]) => [k, Math.pow(p, 1 / T)]), tot = pesos.reduce((s, x) => s + x[1], 0);
      let r = Math.random() * tot, esc2 = pesos[0][0];
      for (const [k, v] of pesos) { r -= v; if (r <= 0) { esc2 = k; break } }
      out.push(esc2); w = esc2;
    }
    $("md-frase").textContent = out.join(" ") + ".";
  };
  $("md-treinar").onclick = treinar;
  $("md-gerar").onclick = gerar;
  $("md-ini").addEventListener("input", mostrar);

  mostraTokens(); treinar();
})();