(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const q = s => document.querySelector(s), doc = document.documentElement;

  /* ================= SOM ================= */
  const btn = q("#som"); let ac, master, on = false;
  const NOTAS = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
  function chime(i, v = .1) {
    if (!on || !ac) return; const t = ac.currentTime, f = NOTAS[i % NOTAS.length];
    [1, 2.01, 3.02].forEach((m, k) => {
      const o = ac.createOscillator(), g = ac.createGain(); o.type = "sine"; o.frequency.value = f * m;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v / (k + 1), t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + 1.6);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 1.7);
    });
  }
  function pad() {
    const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 520; lp.connect(master);
    [110, 164.81, 220.3].forEach((f, k) => {
      const o = ac.createOscillator(), g = ac.createGain(), l = ac.createOscillator(), lg = ac.createGain();
      o.type = "sawtooth"; o.frequency.value = f; g.gain.value = .018; l.frequency.value = .08 + k * .05; lg.gain.value = .012;
      l.connect(lg); lg.connect(g.gain); o.connect(g); g.connect(lp); o.start(); l.start();
    });
  }
  if (btn) btn.onclick = () => {
    on = !on; btn.setAttribute("aria-pressed", on); btn.textContent = "Som: " + (on ? "on" : "off");
    if (on && !ac) { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = .7; master.connect(ac.destination); pad() }
    if (ac) on ? ac.resume() : ac.suspend();
  };
  const sc = q("#secao"), nomes = [...document.querySelectorAll("section")].map(s => s.dataset.nome); let ult = sc.textContent;
  new MutationObserver(() => { const t = sc.textContent, i = nomes.indexOf(t); if (i < 0 || t === ult) return; ult = t; chime(i, .12) }).observe(sc, { childList: true });
  document.querySelectorAll(".card").forEach(c => c.addEventListener("mouseenter", () => chime(Math.random() * 6 | 0, .035)));

  /* ================= GEADA + ABERRAÇÃO CROMÁTICA ================= */
  const geada = document.createElement("div"); geada.className = "geada"; geada.hidden = true; document.body.appendChild(geada);
  let flash = 0, caAnt = -1;

  /* ================= SCROLL INFINITO ================= */
  let acc = 0, looping = false;
  addEventListener("wheel", e => {
    const fim = innerHeight + scrollY >= doc.scrollHeight - 4;
    if (!fim || e.deltaY <= 0) { acc = 0; return }
    acc += e.deltaY;
    if (acc > 500 && !looping) {
      looping = true; flash = 1;
      setTimeout(() => scrollTo({ top: 0, behavior: "instant" }), 450);
      setTimeout(() => { looping = false; acc = 0 }, 1500);
    }
  }, { passive: true });
   
      /* ================= NÚCLEO DE DADOS (versão leve) ================= */
  const cv = document.createElement("canvas"); cv.className = "gelo-cv"; document.body.appendChild(cv);
  const x = cv.getContext("2d"); let W, H;
  const fit = () => { const d = Math.min(devicePixelRatio || 1, UA.movel ? 1.25 : 2, Math.sqrt(4e6 / (innerWidth * innerHeight))); W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; x.setTransform(d, 0, 0, d, 0, 0) };
  addEventListener("resize", fit); fit();

  const rnd = Math.random, n = UA.voxel, S = .8 / n, V = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) {
    if (i > 0 && i < n - 1 && j > 0 && j < n - 1 && k > 0 && k < n - 1) continue; /* só a casca */
    const c0 = (i - (n - 1) / 2) / (n / 2), c1 = (j - (n - 1) / 2) / (n / 2), c2 = (k - (n - 1) / 2) / (n / 2), l = Math.hypot(c0, c1, c2) || 1;
    V.push({ c0, c1, c2, d0: c0 / l, d1: c1 / l, d2: c2 / l, ph: (i + j + k) * .6, k2: .6 + rnd() * .8, s: rnd() < .5 ? -1 : 1, b: rnd(), h: 0 });
  }
  const KX = [-1, -1, -1, -1, 1, 1, 1, 1], KY = [-1, -1, 1, 1, -1, -1, 1, 1], KZ = [-1, 1, -1, 1, -1, 1, -1, 1];
  const FA = [0, 1, 3, 2, 4, 6, 7, 5, 0, 4, 5, 1, 2, 3, 7, 6, 0, 2, 6, 4, 1, 5, 7, 3];
  const PX = new Float32Array(8), PY = new Float32Array(8), PZ = new Float32Array(8);
  let ox = 0, oy = 0, oz = 0, fr = 0;

  let parts = [], mx = -999, my = -999, ey = 0, vel = 0, ly = scrollY;
  addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    if (UA.faiscas) for (let i = 0; i < 2; i++) parts.push({ x: mx, y: my, vx: (rnd() - .5) * 1.4, vy: rnd() * -.6, l: 1, z: rnd() * 2 + 1 });
  });
  addEventListener("click", e => {
    if (UA.faiscas) for (let i = 0; i < 20; i++) { const a = rnd() * 6.28, s = rnd() * 5 + 1; parts.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * s, vy: Math.sin(a) * s, l: 1, z: rnd() * 3 + 1 }) }
  });

  function draw(t) {
    const mxS = doc.scrollHeight - H, sp = mxS > 0 ? scrollY / mxS : 0;
    vel += ((scrollY - ly) - vel) * .12; ly = scrollY;
    ey += (Math.min(1, scrollY / (H * .55)) - ey) * .1;

    /* no celular, enquanto o cubo se desfaz, desenha a cada 2 quadros (30 fps) */
    if (UA.movel && (ey > .02 || Math.abs(vel) > 1) && (fr++ & 1)) { requestAnimationFrame(draw); return }

    x.clearRect(0, 0, W, H);
    const al = 1 - ey * 1.25;
    if (al > .03) {
      x.globalCompositeOperation = "lighter";
      const R = Math.min(W, H) * (W < H ? .36 : .3), cx = W / 2, cy = H * .5, hue = 215 + sp * 55;
      const ry = t * .00025 + (mx > 0 ? (mx / W - .5) * .6 : 0), cY = Math.cos(ry), sY = Math.sin(ry);
      const tx = .5 + (my > 0 ? (my / H - .5) * .2 : 0), cX = Math.cos(tx), sX = Math.sin(tx);
      const pj = (a, b, c) => {
        const X = a * cY + c * sY; let Z = -a * sY + c * cY;
        const Y = b * cX - Z * sX; Z = b * sX + Z * cX;
        const f = 3 / (3 + Z); ox = cx + X * R * f; oy = cy - Y * R * f; oz = Z;
      };

      for (const v of V) {
        let h = v.h;
        if (mx > 0) { pj(v.c0, v.c1, v.c2); const dm = Math.hypot(ox - mx, oy - my); h += ((dm < 120 ? 1 - dm / 120 : 0) - h) * .15 } else h *= .9;
        v.h = h;
        const lift = Math.pow(Math.max(0, Math.sin(t * .0011 - v.ph)), 8) * .6;
        const e = Math.min(1.3, Math.max(lift, ey * v.k2 + h * .6)), o = e * 1.3, tw = e * (1.2 + v.b * 2) * v.s;
        const ca = Math.cos(tw), sa = Math.sin(tw), cb = Math.cos(tw * .7), sb = Math.sin(tw * .7);
        let zs = 0;
        for (let q = 0; q < 8; q++) {
          const r0 = KX[q] * S, r1 = KY[q] * S, r2 = KZ[q] * S;
          const a0 = r0 * ca + r2 * sa, a2 = -r0 * sa + r2 * ca, b1 = r1 * cb - a2 * sb, b2 = r1 * sb + a2 * cb;
          pj(v.c0 + a0 + v.d0 * o, v.c1 + b1 + v.d1 * o, v.c2 + b2 + v.d2 * o);
          PX[q] = ox; PY[q] = oy; PZ[q] = oz; zs += oz;
        }
        const zc = zs / 8, pul = Math.pow(Math.max(0, Math.sin(t * .0014 - (v.c0 + v.c1 + v.c2) * 1.6)), 10);
        const fz = Math.max(0, Math.min(1, (1.7 - zc) / 3.4)), hh = pul > .2 ? hue - 35 : hue, li = pul > .2 ? 86 : 62 + fz * 14;

        x.beginPath();
        for (let f = 0; f < 6; f++) {
          const a = FA[f * 4], b = FA[f * 4 + 1], c = FA[f * 4 + 2], d = FA[f * 4 + 3];
          if ((PZ[a] + PZ[b] + PZ[c] + PZ[d]) / 4 > zc) continue; /* face de trás */
          x.moveTo(PX[a], PY[a]); x.lineTo(PX[b], PY[b]); x.lineTo(PX[c], PY[c]); x.lineTo(PX[d], PY[d]); x.closePath();
        }
        x.fillStyle = `hsla(${hh},90%,${li}%,${(.05 + .09 * fz + pul * .28 + h * .12) * al})`; x.fill();
        x.strokeStyle = `hsla(${hh + 15},100%,${li + 12}%,${(.22 + .4 * fz + pul * .5 + h * .4) * al})`; x.lineWidth = .7 + fz * .8; x.stroke();
      }

      parts = parts.filter(p => p.l > 0); if (parts.length > UA.faiscas) parts.splice(0, parts.length - UA.faiscas);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy; p.vy += .04; p.vx *= .985; p.l -= .018;
        x.fillStyle = `hsla(${hue + 10},95%,78%,${p.l * .8})`; x.fillRect(p.x - p.z, p.y - p.z, p.z * 2, p.z * 2);
      }
    }

    /* geada e aberração cromática pela velocidade do scroll (desligadas no celular) */
    const g = Math.max(UA.geada ? Math.min(1, Math.abs(vel) / 60) * .85 : 0, flash); flash *= .97;
    geada.hidden = g < .02; if (g >= .02) geada.style.setProperty("--g", g.toFixed(3));
    const ca = UA.geada ? Math.round(Math.min(6, Math.abs(vel) * .14) * 10) / 10 : 0;
    if (ca !== caAnt) { caAnt = ca; doc.style.setProperty("--ca", ca) }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();