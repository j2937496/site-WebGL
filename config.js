/* Mude só estas três linhas */
window.UA = (() => {
 let nivel = "media"; try { nivel = localStorage.getItem("ua-nivel") || nivel } catch (e) {}       /* "alta", "media" ou "baixa" */
  const particulas = false;    /* false = sem poeira e sem faíscas do mouse */
  const estrelas = true;       /* false = desliga as estrelas cintilantes do fundo */

  const P = {
    alta:  { webgl: .7,  passos: 60, cristal: true, poeira: 110, portal: 1600, voxel: 5, faiscas: 220, cursor: true,  tilt: true,  geada: true,  parallax: true  },
    media: { webgl: .5,  passos: 40, cristal: true, poeira: 60,  portal: 1000, voxel: 4, faiscas: 120, cursor: true,  tilt: true,  geada: false, parallax: true  },
    baixa: { webgl: .35, passos: 28, cristal: true, poeira: 0,   portal: 500,  voxel: 3, faiscas: 0,   cursor: false, tilt: false, geada: false, parallax: false }
  };
  const movel = matchMedia("(max-width:760px)").matches || matchMedia("(pointer:coarse)").matches;
  const fraco = movel && (navigator.hardwareConcurrency || 4) <= 4;
  let lento = false; try { lento = sessionStorage.getItem("ua-lento") === "1" } catch (e) {}
  const n = lento || fraco ? "baixa" : movel && nivel === "alta" ? "media" : nivel;

  const html = document.documentElement;
  html.classList.add("nivel-" + n);
  if (!estrelas) html.classList.add("sem-estrelas");

  const cfg = { nivel: n, movel, fade: movel ? .45 : .9, fps: fraco ? 30 : 60, ...P[n] };
  if (movel) Object.assign(cfg, {
    geada: false, parallax: false, tilt: false, cursor: false,
    poeira: 0, faiscas: 0, portal: Math.min(cfg.portal, 400),
    webgl: Math.min(cfg.webgl, .4), passos: Math.min(cfg.passos, 32)
  });
  if (!particulas) Object.assign(cfg, { poeira: 0, faiscas: 0, portal: Math.min(cfg.portal, 350) });
  return cfg;
})();