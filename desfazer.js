(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const qa = s => [...document.querySelectorAll(s)];

  /* cada letra dos títulos ganha uma direção aleatória */
  qa("h2 .w").forEach(w => {
    w.innerHTML = [...w.textContent].map(c =>
      `<span class="l" style="--rx:${(Math.random() - .5) * 160};--ry:${-30 - Math.random() * 140};--rr:${(Math.random() - .5) * 160}">${c}</span>`
    ).join("");
  });

  /* ao sair pelo topo, o título se desfaz (só escreve quando o valor muda) */
  const titulos = qa("h2");
  const desfazer = () => titulos.forEach(h => {
    const r = h.getBoundingClientRect();
    const v = Math.min(1, Math.max(0, 1 - r.bottom / (innerHeight * .3))).toFixed(2);
    if (h._d === v) return;
    h._d = v; h.style.setProperty("--d", v); h.classList.toggle("dis", +v > .01);
  });
  let tk = false;
  addEventListener("scroll", () => { if (!tk) { tk = true; requestAnimationFrame(() => { tk = false; desfazer() }) } }, { passive: true });
  desfazer();

  /* letras fogem do mouse: só no computador e só as que estão perto do cursor */
  if (matchMedia("(pointer: fine)").matches && !UA.movel) {
    const R = 110; let ativos = new Set(), mx = -999, my = -999, pend = 0;
    const passo = () => {
      pend = 0; if (!UA.tilt) return;
      const novos = new Set();
      for (const h of titulos) {
        const r = h.getBoundingClientRect();
        if (r.bottom < my - R || r.top > my + R || r.right < mx - R || r.left > mx + R) continue;
        h.querySelectorAll(".l").forEach(l => {
          const b = l.getBoundingClientRect();
          const dx = b.left + b.width / 2 - (l._hx || 0) - mx, dy = b.top + b.height / 2 - (l._hy || 0) - my, d = Math.hypot(dx, dy) || 1;
          if (d < R) {
            const f = (1 - d / R) * 38; l._hx = dx / d * f; l._hy = dy / d * f;
            l.style.setProperty("--hx", l._hx.toFixed(1)); l.style.setProperty("--hy", l._hy.toFixed(1)); novos.add(l);
          }
        });
      }
      ativos.forEach(l => { if (!novos.has(l)) { l._hx = l._hy = 0; l.style.removeProperty("--hx"); l.style.removeProperty("--hy") } });
      ativos = novos;
    };
    addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; if (!pend) pend = requestAnimationFrame(passo) }, { passive: true });
  }
})();