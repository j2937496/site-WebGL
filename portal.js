(() => {
  const sec = document.querySelector("#portal"); if (!sec) return;
  const cv = sec.querySelector("canvas"), x = cv.getContext("2d");
  const N = UA.portal, rnd = Math.random, tau = Math.PI * 2;
  let W, H, vis = false, swirl = 1, forma = "dome", mx = 0;

  const fit = () => { const d = Math.min(devicePixelRatio || 1, 2, Math.sqrt(3e6 / ((cv.clientWidth * cv.clientHeight) || 1))); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; x.setTransform(d, 0, 0, d, 0, 0) };
  addEventListener("resize", fit); fit();

  /* formas: cada função devolve um ponto em espaço unitário */
  const F = {
    dome: () => { const y = rnd(), r = Math.sqrt(1 - y * y), a = rnd() * tau; return rnd() < .12 ? [Math.cos(a), -.5, Math.sin(a)] : [r * Math.cos(a), y - .5, r * Math.sin(a)] },
    esfera: () => { const y = rnd() * 2 - 1, r = Math.sqrt(1 - y * y), a = rnd() * tau; return [r * Math.cos(a), y, r * Math.sin(a)] },
    cubo: () => { const f = rnd() * 6 | 0, a = (rnd() * 2 - 1) * .75, b = (rnd() * 2 - 1) * .75, s = f % 2 ? .75 : -.75, p = [a, b, s]; return f >> 1 === 0 ? [s, a, b] : f >> 1 === 1 ? [a, s, b] : p },
    toro: () => { const u = rnd() * tau, v = rnd() * tau; return [(.7 + .28 * Math.cos(v)) * Math.cos(u), .28 * Math.sin(v), (.7 + .28 * Math.cos(v)) * Math.sin(u)] },
    helice: () => { const t = rnd() * 2 - 1, a = t * 18 + (rnd() < .5 ? 0 : Math.PI); if (rnd() < .15) { const k = rnd() * 2 - 1; return [k * .5 * Math.cos(t * 18), t * .95, k * .5 * Math.sin(t * 18)] } return [Math.cos(a) * .5, t * .95, Math.sin(a) * .5] },
    espiral: () => { const r = Math.pow(rnd(), .6), a = r * 9 + (rnd() < .5 ? 0 : Math.PI); return [r * Math.cos(a), (rnd() - .5) * .12 * (1 - r), r * Math.sin(a)] }
  };
  const cache = {};
  const alvo = n => cache[n] || (cache[n] = Float32Array.from({ length: N * 3 }, (_, i) => 0).map((_, i, a) => 0) && (() => { const a = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const p = F[n](); a[i * 3] = p[0]; a[i * 3 + 1] = p[1]; a[i * 3 + 2] = p[2] } return a })());

  const P = new Float32Array(N * 3), V = new Float32Array(N * 3);
  for (let i = 0; i < N * 3; i++) P[i] = (rnd() - .5) * 4;
  let T = alvo("dome");
  const morph = n => { forma = n; T = alvo(n); swirl = 1 };

  sec.querySelectorAll(".portal-links a").forEach(a => {
    ["mouseenter", "focus"].forEach(ev => a.addEventListener(ev, () => morph(a.dataset.forma)));
    ["mouseleave", "blur"].forEach(ev => a.addEventListener(ev, () => morph("dome")));
  });
  sec.addEventListener("mousemove", e => { mx = e.clientX / innerWidth - .5 });
  new IntersectionObserver(es => { vis = es[0].isIntersecting }, { threshold: .1 }).observe(sec);

  function loop(t) {
    requestAnimationFrame(loop); if (!vis) return;
    swirl += (.25 - swirl) * .02;
    const R = Math.min(W, H) * (W < H ? .42 : .34), cx = W / 2, cy = H * .5;
    const ry = t * .0003 + mx * 1.2, cY = Math.cos(ry), sY = Math.sin(ry), rx = .35, cX = Math.cos(rx), sX = Math.sin(rx);
    x.clearRect(0, 0, W, H); x.globalCompositeOperation = "lighter";
    for (let i = 0; i < N; i++) {
      const j = i * 3;
      V[j] += (T[j] - P[j]) * .012 - P[j + 2] * .0016 * swirl;
      V[j + 1] += (T[j + 1] - P[j + 1]) * .012 + Math.sin(t * .001 + i) * .0003;
      V[j + 2] += (T[j + 2] - P[j + 2]) * .012 + P[j] * .0016 * swirl;
      V[j] *= .92; V[j + 1] *= .92; V[j + 2] *= .92;
      P[j] += V[j]; P[j + 1] += V[j + 1]; P[j + 2] += V[j + 2];
      const sp = Math.min(1, Math.hypot(V[j], V[j + 1], V[j + 2]) * 40);
      const X = P[j] * cY + P[j + 2] * sY; let Z = -P[j] * sY + P[j + 2] * cY;
      const Y = P[j + 1] * cX - Z * sX; Z = P[j + 1] * sX + Z * cX;
      const f = 3 / (3 + Z), s = 1 + (1 - Z) * .7;
      x.fillStyle = `hsla(${270 - 110 * sp},95%,${58 + 30 * sp}%,${.35 + .5 * sp})`;
      x.fillRect(cx + X * R * f, cy - Y * R * f, s * f, s * f);
    }
  }
  requestAnimationFrame(loop);
})();