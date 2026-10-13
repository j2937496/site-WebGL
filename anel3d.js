(() => {
  /* Troque o id para mudar o lugar do anel: ele aparece ANTES dessa seção */
  const ANTES = "usar";
  const alvo = document.getElementById(ANTES); if (!alvo) return;

  const PAINEIS = [
    ["Dados", "entrada"], ["Pesos", "w · x"], ["Camadas", "profundidade"], ["Atenção", "contexto"], ["Tokens", "pedaços"],
    ["Treino", "errar e ajustar"], ["Modelo", "parâmetros"], ["Contexto", "memória curta"], ["Resposta", "saída"], ["Gradiente", "direção do erro"]
  ];
  const CORES = ["143,216,255", "155,107,255", "255,107,214"];
  const passo = 360 / PAINEIS.length;

  const pal = document.createElement("div"); pal.className = "palco"; pal.setAttribute("aria-hidden", "true");
  pal.innerHTML = `
    <div class="p-cena">
      <i class="p-nucleo"></i>
      <div class="p-tilt">
        <i class="p-anel t"></i><i class="p-anel b"></i>
        <div class="p-giro"><div class="p-auto">${PAINEIS.map(([t, s], i) =>
          `<div class="p-cara" style="--c:${CORES[i % 3]};transform:rotateY(${i * passo}deg) translateZ(var(--r))"><b>${t}</b><small>${s}</small></div>`).join("")}</div></div>
      </div>
    </div>
    <p class="p-dica">${matchMedia("(pointer:coarse)").matches ? "DESLIZE PARA GIRAR" : "ARRASTE PARA GIRAR"}</p>`;
  alvo.before(pal);

  /* gira com o dedo/mouse, com inércia */
  const giro = pal.querySelector(".p-giro");
  let ang = 0, vel = 0, down = false, lx = 0, raf = 0;
  const aplica = () => giro.style.setProperty("--giro", ang.toFixed(1) + "deg");
  const inercia = () => { vel *= .94; if (Math.abs(vel) < .05) return; ang += vel; aplica(); raf = requestAnimationFrame(inercia) };

  pal.addEventListener("pointerdown", e => {
    down = true; lx = e.clientX; vel = 0; cancelAnimationFrame(raf);
    pal.classList.add("seg"); pal.setPointerCapture(e.pointerId);
  });
  pal.addEventListener("pointermove", e => {
    if (!down) return;
    const dx = (e.clientX - lx) * .45; lx = e.clientX; ang += dx; vel = dx; aplica();
  });
  const solta = () => { if (!down) return; down = false; pal.classList.remove("seg"); inercia() };
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(ev => pal.addEventListener(ev, solta));

  /* pausa as animações quando sai da tela */
  new IntersectionObserver(es => pal.classList.toggle("pausa", !es[0].isIntersecting)).observe(pal);
})();
