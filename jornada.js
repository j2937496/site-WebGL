(() => {
  const sec = document.getElementById("jornada"); if (!sec) return;
  const PERG = "Por que o céu é azul?";
  const TOK = ["Por", " que", " o", " céu", " é", " azul", "?"];
  const RESP = "Porque a luz azul se espalha mais que as outras cores na atmosfera.".split(" ");
  const CORES = ["143,216,255", "155,107,255", "255,107,214", "120,230,170", "255,200,120"];
  const ETAPAS = [
    ["Pergunta", "Tudo começa com um texto: a sua pergunta."],
    ["Tokens", "O texto é dividido em pedaços chamados tokens."],
    ["Números", "Cada token vira uma lista de números (um vetor) que carrega o significado."],
    ["Camadas", "Os números atravessam as camadas da rede. Cada camada refina o sentido."],
    ["Resposta", "No fim, o modelo escolhe a resposta palavra por palavra, pela probabilidade."]
  ];
  const vec = s => [1, 2, 3].map(k => {
    const x = Math.sin([...s].reduce((h, c) => h + c.charCodeAt(0) * k, k) * 12.9898) * 43758.5453;
    return ((x - Math.floor(x)) * 2 - 1).toFixed(2);
  });

  const cenas = [
    [...PERG].map(c => `<span class="j-it j-tx">${c === " " ? "&nbsp;" : c}</span>`).join(""),
    TOK.map((t, i) => `<span class="j-it j-chip" style="--c:${CORES[i % 5]}">${t.trim()}</span>`).join(""),
    TOK.map((t, i) => `<span class="j-it j-vec" style="--c:${CORES[i % 5]}"><b>${t.trim()}</b>${vec(t).map(v => `<i>${v}</i>`).join("")}</span>`).join(""),
    [4, 5, 5, 3, 1].map(n => `<span class="j-it j-col">${'<i class="j-dot"></i>'.repeat(n)}</span>`).join(""),
    RESP.map(w => `<span class="j-it j-tx">${w}</span>`).join(" ")
  ];

  const palco = sec.querySelector("#j-palco"), leg = sec.querySelector("#j-leg"), etp = sec.querySelector("#j-etapa"), barra = sec.querySelector("#j-barra");
  const els = cenas.map((html, i) => {
    const d = document.createElement("div"); d.className = "j-cena" + (i === 0 || i === 4 ? " txt" : ""); d.innerHTML = html;
    palco.appendChild(d); return [d, [...d.children]];
  });

  let ult = "", visivel = false;
  const atualiza = () => {
    const r = sec.getBoundingClientRect(), tot = sec.offsetHeight - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / tot)), e = Math.min(4, Math.floor(p * 5)), t = p * 5 - e;
    const chave = e + ":" + Math.round(t * 20); if (chave === ult) return; ult = chave;
    els.forEach(([d, its], i) => {
      d.classList.toggle("on", i === e);
      const n = i < e ? its.length : i === e ? Math.ceil(Math.min(1, t * 1.25) * its.length) : 0;
      its.forEach((it, k) => it.classList.toggle("on", k < n));
    });
    etp.textContent = `${e + 1} DE 5 · ${ETAPAS[e][0].toUpperCase()}`; leg.textContent = ETAPAS[e][1]; barra.style.width = p * 100 + "%";
  };
  let tk = false;
  addEventListener("scroll", () => { if (visivel && !tk) { tk = true; requestAnimationFrame(() => { tk = false; atualiza() }) } }, { passive: true });
  new IntersectionObserver(es => { visivel = es[0].isIntersecting; if (visivel) atualiza() }).observe(sec);
  atualiza();
})();