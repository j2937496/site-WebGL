/* Carregue logo DEPOIS do config.js e ANTES dos outros scripts */
(() => {
  const html = document.documentElement, raf0 = window.requestAnimationFrame.bind(window);

  /* 1) Aparelho fraco: limita os laços de animação a 30 quadros por segundo */
  if (UA.fps < 60) {
    const ult = new WeakMap(), gap = 1000 / UA.fps - 4;
    window.requestAnimationFrame = cb => raf0(function f(t) {
      if (t - (ult.get(cb) || 0) < gap) return raf0(f);
      ult.set(cb, t); cb(t);
    });
  }

  /* 2) Se o site ficar lento, reduz os efeitos sozinho (e lembra nesta aba) */
  let nivel = 0, n = 0, t0 = 0, ruins = 0;
  const reduzir = () => {
    nivel++;
    UA.poeira = 0; UA.faiscas = 0; UA.geada = false;
    UA.webgl = Math.max(.25, UA.webgl * .7);          /* o cristal passa a ser desenhado em resolução menor */
    if (nivel >= 2) { UA.tilt = false; html.classList.add("nivel-baixa", "modo-minimo") }
    try { sessionStorage.setItem("ua-lento", "1") } catch (e) {}
    dispatchEvent(new Event("resize"));
  };
  const medir = t => {
    if (!t0) t0 = t; n++;
    if (t - t0 >= 2000) {
      const fps = n * 1000 / (t - t0); n = 0; t0 = t;
      if (!document.hidden && t > 4000) {
        ruins = fps < 42 ? ruins + 1 : 0;
        if (ruins >= 2 && nivel < 2) { ruins = 0; reduzir() }
      }
    }
    raf0(medir);
  };
  raf0(medir);
})();