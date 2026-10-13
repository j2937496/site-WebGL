(() => {
  const q = s => document.querySelector(s), qa = s => [...document.querySelectorAll(s)];
  const mk = (t, c) => { const e = document.createElement(t); if (c) e.className = c; return e };
  const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fino = matchMedia("(pointer: fine)").matches;
  const doc = document.documentElement;

  /* entrada do título depois do carregamento */
  const ld = q("#loader"), go = () => document.body.classList.add("go");
  if (!ld || ld.classList.contains("fim")) go();
  else { new MutationObserver(() => ld.classList.contains("fim") && go()).observe(ld, { attributes: true }); setTimeout(go, 5000) }

  /* títulos: palavra por palavra */
  qa("h2").forEach(el => { el.innerHTML = el.textContent.trim().split(/\s+/).map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join(" ") });

  /* cards: entrada em sequência, brilho no mouse e inclinação 3D */
  qa(".cards").forEach(g => [...g.children].forEach((c, i) => c.style.setProperty("--i", i % 6)));
  qa(".card").forEach(c => {
    c.addEventListener("mousemove", e => {
      const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      c.style.setProperty("--mx", px * 100 + "%"); c.style.setProperty("--my", py * 100 + "%");
      if (!rm && fino && UA.tilt && c.classList.contains("v")) {
        c.classList.add("ok");
        c.style.transform = `perspective(700px) rotateX(${(.5 - py) * 8}deg) rotateY(${(px - .5) * 8}deg) translateZ(6px)`;
      }
    });
    c.addEventListener("mouseleave", () => { c.style.transform = "" });
  });

  /* botões magnéticos (só com mouse) */
  if (fino) qa(".btn").forEach(b => {
    b.addEventListener("mousemove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)` });
    b.addEventListener("mouseleave", () => { b.style.transform = "" });
  });

  /* números que contam */
  qa("#stats b").forEach(b => {
    const v = +b.textContent; if (!v) return; b.textContent = v - 60;
    new IntersectionObserver((es, o) => {
      if (!es[0].isIntersecting) return; o.disconnect();
      const t0 = performance.now();
      (function f(t) { const k = Math.min((t - t0) / 1600, 1); b.textContent = Math.round(v - 60 + 60 * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f) })(t0);
    }).observe(b);
  });

  /* texto "embaralhado" no nome da seção */
  const sc = q("#secao");
  if (sc) {
    const nomes = new Set(qa("section").map(s => s.dataset.nome)), ch = "01<>/{}#%";
    let alvo = sc.textContent, iv;
    new MutationObserver(() => {
      const t = sc.textContent; if (!nomes.has(t) || t === alvo) return;
      alvo = t; clearInterval(iv); let i = 0;
      iv = setInterval(() => {
        sc.textContent = alvo.split("").map((c, k) => k < i ? c : ch[Math.random() * ch.length | 0]).join("");
        if (i++ >= alvo.length) { clearInterval(iv); sc.textContent = alvo }
      }, 45);
    }).observe(sc, { childList: true });
  }

  /* faixas em movimento */
  const faixa = (termos, inv) => {
    const f = mk("div", "faixa" + (inv ? " inv" : "")), l = termos.map(x => `<span>${x}</span>`).join("");
    f.innerHTML = `<div class="trilho">${l}${l}</div>`; return f;
  };
  const orig = q("#origem"), neu = q("#neural");
  if (orig) orig.before(faixa(["Redes neurais", "Transformers", "Tokens", "Aprendizado profundo", "Embeddings", "Retropropagação"]));
  if (neu) neu.before(faixa(["IA generativa", "Visão computacional", "Linguagem natural", "Aprendizado por reforço", "Multimodal", "Agentes"], true));

  /* barra de progresso, linha do tempo e paralaxe */
  const bar = mk("div", "prog"); document.body.appendChild(bar);
  const L = q("#linhas"), cols = qa("section > .col");
  const rolar = () => {
    const mx = doc.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${mx > 0 ? scrollY / mx : 0})`;
    if (L) {
      const r = L.getBoundingClientRect();
      L.style.setProperty("--p", Math.min(1, Math.max(0, (innerHeight * .65 - r.top) / r.height)) * 100 + "%");
    }
    if (!rm && UA.parallax) cols.forEach(c => { const b = c.getBoundingClientRect(); c.style.transform = `translateY(${(b.top + b.height / 2 - innerHeight / 2) / innerHeight * -40}px)` });
  };
  let tk = false;
  addEventListener("scroll", () => { if (!tk) { tk = true; requestAnimationFrame(() => { tk = false; rolar() }) } }, { passive: true });
  rolar();

  /* luz que segue o mouse: elemento movido só com transform (não mexe no estilo da página) */
  if (fino) {
    const luz = mk("div", "luz"); luz.setAttribute("aria-hidden", "true"); document.body.appendChild(luz);
    const h1 = q(".hero h1"); let px = innerWidth / 2, py = innerHeight * .4, pend = 0;
    const frame = () => {
      pend = 0; luz.style.transform = `translate3d(${px}px,${py}px,0)`;
      if (h1 && !rm) h1.style.transform = `translate(${(px / innerWidth - .5) * -26}px,${(py / innerHeight - .5) * -16}px)`;
    };
    addEventListener("pointermove", e => { px = e.clientX; py = e.clientY; if (!pend) pend = requestAnimationFrame(frame) }, { passive: true });
  }

  /* clique em onda */
  addEventListener("click", e => {
    const o = mk("span", "onda"); o.style.left = e.clientX + "px"; o.style.top = e.clientY + "px";
    document.body.appendChild(o); setTimeout(() => o.remove(), 900);
  });

  /* cursor personalizado */
  if (fino && !rm && UA.cursor) {
    document.body.classList.add("tem-cursor");
    const d = mk("div", "cur-d"), r = mk("div", "cur-r"); document.body.append(d, r);
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    addEventListener("pointermove", e => { x = e.clientX; y = e.clientY; d.style.transform = `translate(${x}px,${y}px)` }, { passive: true });
    (function f() { rx += (x - rx) * .15; ry += (y - ry) * .15; r.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(f) })();
    document.addEventListener("mouseover", e => r.classList.toggle("on", !!e.target.closest("a,button,summary,input,.card")));
  }

  /* poeira estelar: só existe se UA.poeira > 0, e o laço para de vez se for desligado */
  if (!rm && UA.poeira > 0) {
    const cv = mk("canvas", "poeira"), x = cv.getContext("2d"); document.body.appendChild(cv);
    let W, H, P = [], ly = scrollY, vel = 0;
    const fit = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; P = Array.from({ length: Math.min(UA.poeira, W / 12 | 0) }, () => ({ x: Math.random() * W, y: Math.random() * H, z: Math.random() * .9 + .1, v: Math.random() * .4 + .1 })) };
    addEventListener("resize", fit); fit();
    (function loop() {
      if (!UA.poeira) { cv.remove(); return }
      requestAnimationFrame(loop);
      if (document.hidden) return;
      vel += ((scrollY - ly) - vel) * .12; ly = scrollY;
      x.clearRect(0, 0, W, H); x.globalCompositeOperation = "lighter";
      for (const p of P) {
        p.y -= p.v * p.z * 2 + vel * p.z * .9; p.x += Math.sin(p.y * .01 + p.z * 10) * .15;
        if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20; if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        const len = Math.min(60, Math.abs(vel) * p.z * 2.2) + p.z * 2;
        x.strokeStyle = `hsla(${210 + p.z * 60},90%,${65 + p.z * 20}%,${.25 + p.z * .5})`; x.lineWidth = p.z * 1.8;
        x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(p.x, p.y + (vel > 0 ? len : -len)); x.stroke();
      }
    })();
  }
})();