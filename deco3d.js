(() => {
  /* monta as 6 faces de um cubo */
  const faces = () => ["", "rotateY(90deg) ", "rotateY(180deg) ", "rotateY(-90deg) ", "rotateX(90deg) ", "rotateX(-90deg) "]
    .map(t => `<b class="d3f" style="transform:${t}translateZ(var(--h))"></b>`).join("");

  const DEC = {
    orbita: `<i class="d3n"></i><i class="d3a a1"></i><i class="d3a a2"></i><i class="d3a a3"></i>`,
    cubo: `<div class="d3c">${faces()}<div class="d3c in">${faces()}</div></div>`,
    globo: `<div class="d3g">${[0, 1, 2, 3, 4, 5, 6, 7].map(k => `<i class="d3m" style="transform:rotateY(${k * 22.5}deg)"></i>`).join("")}
      <i class="d3m" style="transform:rotateX(90deg)"></i>
      <i class="d3m lat" style="transform:rotateX(90deg) translateZ(calc(var(--s) * .25))"></i>
      <i class="d3m lat" style="transform:rotateX(90deg) translateZ(calc(var(--s) * -.25))"></i></div>`
  };

  /* seção → decoração (troque à vontade: orbita, cubo ou globo) */
  const ONDE = { oque: "orbita", usar: "globo", futuro: "cubo" };

  const decos = [];
  Object.entries(ONDE).forEach(([id, tipo]) => {
    const sec = document.getElementById(id); if (!sec || !DEC[tipo]) return;
    const d = document.createElement("div"); d.className = "deco " + tipo; d.setAttribute("aria-hidden", "true");
    d.innerHTML = `<div class="d3p">${DEC[tipo]}</div>`; sec.appendChild(d); decos.push([d, sec]);
  });

  /* fica do lado oposto ao texto da seção */
  const lado = () => decos.forEach(([d, sec]) => {
    const c = sec.querySelector(".col"); if (!c) return;
    const r = c.getBoundingClientRect(), esq = r.left + r.width / 2 > innerWidth / 2;
    d.classList.toggle("esq", esq); d.classList.toggle("dir", !esq);
  });
  lado(); addEventListener("resize", lado); addEventListener("load", lado);

  /* chão em grade no pé da primeira tela */
  const hero = document.querySelector(".hero");
  let chao = null;
  if (hero) { hero.insertAdjacentHTML("beforeend", '<div class="chao" aria-hidden="true"><div class="d3grade"></div></div>'); chao = hero.querySelector(".chao") }

  /* pausa as animações quando saem da tela */
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("pausa", !e.isIntersecting)));
  decos.forEach(([d]) => io.observe(d)); if (chao) io.observe(chao);

  /* inclinação 3D leve seguindo o mouse (só no computador) */
  const pars = decos.map(([d]) => d.querySelector(".d3p")); let tk = 0;
  addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse" || tk) return;
    tk = requestAnimationFrame(() => {
      tk = 0; const mx = e.clientX / innerWidth - .5, my = e.clientY / innerHeight - .5;
      pars.forEach(p => p.style.transform = `rotateX(${-my * 22}deg) rotateY(${mx * 30}deg)`);
    });
  }, { passive: true });
})();