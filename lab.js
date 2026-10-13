(() => {
  const $ = id => document.getElementById(id);
  const pl = $("lab-plano"), cv = $("lab-3d"); if (!pl || !cv) return;
  const p2 = pl.getContext("2d"), x = cv.getContext("2d");
  const rm = matchMedia("(prefers-reduced-motion: reduce)").matches, toque = matchMedia("(pointer: coarse)").matches;
  const rnd = (a = 1) => (Math.random() * 2 - 1) * a, sig = z => 1 / (1 + Math.exp(-z));
  const CA = [155, 107, 255], CB = [143, 216, 255], ROSA = [255, 107, 214];
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

  let NH = 4, net, N3 = [], E3 = [], adj = [], pts = [], classe = 0, treinando = false;
  let epoca = 0, loss = 0, acc = 0, sonda = [0, 0], vis = false, sujo = true, fr = 0;
  let modo = toque ? "girar" : "moldar", ry = .6, rx = .35, arrasta = null, rot = false, last = [0, 0];
  let cam = { R: 1, cx: 0, cy: 0, cY: 1, sY: 0, cX: 1, sX: 0 }, W2 = 300, H2 = 300, W3 = 300, H3 = 300;

  /* ---------- exemplos ---------- */
  const cl = v => Math.max(-.95, Math.min(.95, v));
  const gauss = (cx, cy, s, c, n) => Array.from({ length: n }, () => ({ xy: [cl(cx + (rnd() + rnd()) * s), cl(cy + (rnd() + rnd()) * s)], c }));
  const anel = (r, s, c, n) => Array.from({ length: n }, () => { const a = Math.random() * 6.283, d = r + rnd(s); return { xy: [Math.cos(a) * d, Math.sin(a) * d], c } });
  const EX = {
    linear: () => [...gauss(-.5, -.4, .2, 0, 16), ...gauss(.5, .45, .2, 1, 16)],
    xor: () => [...gauss(-.55, -.55, .14, 0, 10), ...gauss(.55, .55, .14, 0, 10), ...gauss(-.55, .55, .14, 1, 10), ...gauss(.55, -.55, .14, 1, 10)],
    circulo: () => [...gauss(0, 0, .12, 0, 18), ...anel(.7, .07, 1, 32)]
  };
  const DICA = {
    linear: "Linear: uma reta já separa os grupos. É o caso mais simples para a rede.",
    xor: "XOR: nenhuma reta separa os grupos. A rede precisa das camadas ocultas. Compare 2 e 6 neurônios.",
    circulo: "Círculo: um grupo dentro do outro pede uma fronteira curva."
  };

  /* ---------- a rede: 2 → NH → NH → 1 ---------- */
  function novaRede() {
    net = {
      W1: Array.from({ length: NH }, () => [rnd(1), rnd(1)]), b1: Array(NH).fill(0),
      W2: Array.from({ length: NH }, () => Array.from({ length: NH }, () => rnd(.8))), b2: Array(NH).fill(0),
      W3: Array.from({ length: NH }, () => rnd(.8)), b3: 0
    };
    epoca = 0; loss = 0; acc = 0; construir3D();
  }
  function fwd(p) {
    const a1 = net.W1.map((w, i) => Math.tanh(w[0] * p[0] + w[1] * p[1] + net.b1[i]));
    const a2 = net.W2.map((w, i) => Math.tanh(w.reduce((s, v, j) => s + v * a1[j], 0) + net.b2[i]));
    return { a1, a2, o: sig(net.W3.reduce((s, v, j) => s + v * a2[j], 0) + net.b3) };
  }
  function passo(lr) {
    if (!pts.length) return;
    const g = { W1: net.W1.map(() => [0, 0]), b1: Array(NH).fill(0), W2: net.W2.map(r => r.map(() => 0)), b2: Array(NH).fill(0), W3: Array(NH).fill(0), b3: 0 };
    let L = 0, ok = 0;
    for (const p of pts) {
      const { a1, a2, o } = fwd(p.xy), y = p.c;
      L -= y ? Math.log(o + 1e-9) : Math.log(1 - o + 1e-9); ok += (o > .5) === !!y;
      const d3 = o - y;
      const d2 = a2.map((a, i) => net.W3[i] * d3 * (1 - a * a));
      const d1 = a1.map((a, j) => d2.reduce((s, d, i) => s + d * net.W2[i][j], 0) * (1 - a * a));
      for (let i = 0; i < NH; i++) {
        g.W3[i] += d3 * a2[i]; g.b2[i] += d2[i]; g.b1[i] += d1[i];
        g.W1[i][0] += d1[i] * p.xy[0]; g.W1[i][1] += d1[i] * p.xy[1];
        for (let j = 0; j < NH; j++) g.W2[i][j] += d2[i] * a1[j];
      }
      g.b3 += d3;
    }
    const s = lr / pts.length;
    for (let i = 0; i < NH; i++) {
      net.W3[i] -= s * g.W3[i]; net.b2[i] -= s * g.b2[i]; net.b1[i] -= s * g.b1[i];
      net.W1[i][0] -= s * g.W1[i][0]; net.W1[i][1] -= s * g.W1[i][1];
      for (let j = 0; j < NH; j++) net.W2[i][j] -= s * g.W2[i][j];
    }
    net.b3 -= s * g.b3; epoca++; loss = L / pts.length; acc = ok / pts.length;
  }

  /* ---------- estrutura 3D e física elástica ---------- */
  function construir3D() {
    const cam3 = [2, NH, NH, 1]; N3 = []; E3 = [];
    cam3.forEach((n, l) => {
      for (let i = 0; i < n; i++) {
        const a = i / n * Math.PI * 2 + l * .6, r = n === 1 ? 0 : n === 2 ? .45 : .75;
        const p = [(l - 1.5) * .95, Math.sin(a) * r, Math.cos(a) * r];
        N3.push({ l, i, r: p.slice(), p: p.slice(), v: [0, 0, 0], act: 0, sx: 0, sy: 0, z: 0, f: 1 });
      }
    });
    const id = (l, i) => N3.findIndex(n => n.l === l && n.i === i);
    for (let l = 0; l < 3; l++) for (let j = 0; j < cam3[l + 1]; j++) for (let i = 0; i < cam3[l]; i++) E3.push({ a: id(l, i), b: id(l + 1, j), l, i, j });
    adj = N3.map(() => []); E3.forEach(e => { adj[e.a].push(e.b); adj[e.b].push(e.a) });
  }
  const peso = e => e.l === 0 ? net.W1[e.j][e.i] : e.l === 1 ? net.W2[e.j][e.i] : net.W3[e.i];
  function fisica() {
    N3.forEach((n, i) => {
      if (arrasta && arrasta.n === n) return;
      for (let k = 0; k < 3; k++) {
        let f = (n.r[k] - n.p[k]) * .12;
        for (const j of adj[i]) f += ((N3[j].p[k] - N3[j].r[k]) - (n.p[k] - n.r[k])) * .05;
        n.v[k] = (n.v[k] + f) * .82;
      }
    });
    N3.forEach(n => { if (!(arrasta && arrasta.n === n)) for (let k = 0; k < 3; k++) n.p[k] += n.v[k] });
  }
  const proj = p => {
    const { R, cx, cy, cY, sY, cX, sX } = cam;
    const X = p[0] * cY + p[2] * sY; let Z = -p[0] * sY + p[2] * cY;
    const Y = p[1] * cX - Z * sX; Z = p[1] * sX + Z * cX;
    const f = 3 / (3 + Z); return [cx + X * R * f, cy - Y * R * f, Z, f];
  };

  /* ---------- desenho: plano de dados ---------- */
  const off = document.createElement("canvas"); off.width = off.height = 32;
  const o2 = off.getContext("2d"), img = o2.createImageData(32, 32);
  function mapa() {
    for (let j = 0; j < 32; j++) for (let i = 0; i < 32; i++) {
      const o = fwd([(i + .5) / 16 - 1, 1 - (j + .5) / 16]).o, k = (j * 32 + i) * 4, c = mix(CA, CB, o);
      img.data[k] = c[0]; img.data[k + 1] = c[1]; img.data[k + 2] = c[2]; img.data[k + 3] = 55 + 110 * Math.abs(o - .5) * 2;
    }
    o2.putImageData(img, 0, 0);
  }
  function desenhar2D() {
    p2.clearRect(0, 0, W2, H2); p2.imageSmoothingEnabled = true; p2.drawImage(off, 0, 0, W2, H2);
    p2.strokeStyle = "rgba(150,130,255,.2)"; p2.lineWidth = 1; p2.beginPath();
    p2.moveTo(W2 / 2, 0); p2.lineTo(W2 / 2, H2); p2.moveTo(0, H2 / 2); p2.lineTo(W2, H2 / 2); p2.stroke();
    for (const p of pts) {
      const px = (p.xy[0] + 1) / 2 * W2, py = (1 - p.xy[1]) / 2 * H2, c = p.c ? CB : CA;
      p2.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`; p2.strokeStyle = "#fff"; p2.lineWidth = 1.5;
      p2.beginPath(); p2.arc(px, py, 6, 0, 6.3); p2.fill(); p2.stroke();
    }
    const sx = (sonda[0] + 1) / 2 * W2, sy = (1 - sonda[1]) / 2 * H2;
    p2.strokeStyle = "rgba(255,255,255,.8)"; p2.beginPath(); p2.moveTo(sx - 8, sy); p2.lineTo(sx + 8, sy); p2.moveTo(sx, sy - 8); p2.lineTo(sx, sy + 8); p2.stroke();
  }

  /* ---------- desenho: rede 3D ---------- */
  function desenhar3D() {
    x.clearRect(0, 0, W3, H3);
    if (!arrasta && !rot && !rm) ry += .004;
    cam = { R: Math.min(W3 * .3, H3 * .42), cx: W3 / 2, cy: H3 / 2, cY: Math.cos(ry), sY: Math.sin(ry), cX: Math.cos(rx), sX: Math.sin(rx) };
    const s = fwd(sonda);
    N3.forEach(n => {
      const t = n.l === 0 ? sonda[n.i] : n.l === 1 ? s.a1[n.i] : n.l === 2 ? s.a2[n.i] : s.o * 2 - 1;
      n.act += (t - n.act) * .2;
      const q = proj(n.p); n.sx = q[0]; n.sy = q[1]; n.z = q[2]; n.f = q[3];
    });
    x.globalCompositeOperation = "lighter";
    for (const e of E3) {
      const a = N3[e.a], b = N3[e.b], w = peso(e), m = Math.min(1, Math.abs(w) / 1.5);
      const al = (.1 + .55 * m) * (.3 + .7 * Math.min(1, Math.abs(a.act)));
      x.strokeStyle = w >= 0 ? `rgba(143,216,255,${al})` : `rgba(255,107,214,${al})`;
      x.lineWidth = (.5 + 2.6 * m) * (a.f + b.f) / 2;
      x.beginPath(); x.moveTo(a.sx, a.sy); x.lineTo(b.sx, b.sy); x.stroke();
    }
    [...N3].sort((a, b) => b.z - a.z).forEach(n => {
      const k = Math.min(1, Math.abs(n.act)), c = n.l === 3 ? mix(CA, CB, s.o) : n.act >= 0 ? CB : ROSA;
      const r0 = (6 + 5 * k) * n.f * (n.l === 3 ? 1.4 : 1);
      if (k > .15) {
        const g = x.createRadialGradient(n.sx, n.sy, 0, n.sx, n.sy, r0 * 3.2);
        g.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${.4 * k})`); g.addColorStop(1, "transparent");
        x.fillStyle = g; x.beginPath(); x.arc(n.sx, n.sy, r0 * 3.2, 0, 6.3); x.fill();
      }
      x.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${.35 + .6 * k})`;
      x.beginPath(); x.arc(n.sx, n.sy, r0, 0, 6.3); x.fill();
      x.strokeStyle = arrasta && arrasta.n === n ? "#fff" : "rgba(220,230,255,.5)"; x.lineWidth = 1; x.stroke();
    });
    x.globalCompositeOperation = "source-over"; x.fillStyle = "rgba(207,205,242,.85)"; x.font = "12px Manrope,sans-serif"; x.textAlign = "center";
    N3.filter(n => n.l === 0 || n.l === 3).forEach(n => x.fillText(n.l === 0 ? (n.i ? "y" : "x") : "classe", n.sx, n.sy - 14 * n.f));
  }

  /* ---------- interação: plano de dados ---------- */
  const xyDe = e => { const r = pl.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 2 - 1, 1 - (e.clientY - r.top) / r.height * 2] };
  pl.addEventListener("pointermove", e => { sonda = xyDe(e) });
  pl.addEventListener("pointerdown", e => {
    const xy = xyDe(e); sonda = xy;
    const i = pts.findIndex(p => Math.hypot(p.xy[0] - xy[0], p.xy[1] - xy[1]) < (toque ? .1 : .07));
    if (i >= 0) pts.splice(i, 1); else pts.push({ xy, c: classe });
    sujo = true;
  });

  /* ---------- interação: rede 3D (girar e moldar) ---------- */
  function achar(px, py) {
    let melhor = null, d0 = toque ? 34 : 22;
    for (const n of N3) { const d = Math.hypot(n.sx - px, n.sy - py); if (d < d0 && (!melhor || n.z < melhor.z)) { melhor = n; d0 = d } }
    return melhor;
  }
  cv.addEventListener("pointerdown", e => {
    const r = cv.getBoundingClientRect(), n = modo === "moldar" ? achar(e.clientX - r.left, e.clientY - r.top) : null;
    last = [e.clientX, e.clientY];
    if (n) arrasta = { n }; else rot = true;
    cv.setPointerCapture(e.pointerId);
  });
  cv.addEventListener("pointermove", e => {
    const r = cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    if (arrasta) {
      const { R, cx, cy, cY, sY, cX, sX } = cam, n = arrasta.n, Z = n.z, f = 3 / (3 + Z);
      const X1 = (px - cx) / (R * f), Y1 = (cy - py) / (R * f);
      const wy = Y1 * cX + Z * sX, Z1 = -Y1 * sX + Z * cX, wx = X1 * cY - Z1 * sY, wz = X1 * sY + Z1 * cY;
      const d = [wx - n.r[0], wy - n.r[1], wz - n.r[2]], m = Math.min(1, .95 / (Math.hypot(d[0], d[1], d[2]) || 1));
      n.p = [n.r[0] + d[0] * m, n.r[1] + d[1] * m, n.r[2] + d[2] * m]; n.v = [0, 0, 0];
    } else if (rot) {
      ry += (e.clientX - last[0]) * .01; rx = Math.max(-1.3, Math.min(1.3, rx + (e.clientY - last[1]) * .01)); last = [e.clientX, e.clientY];
    }
  });
  ["pointerup", "pointercancel"].forEach(ev => cv.addEventListener(ev, () => { arrasta = null; rot = false }));

  /* ---------- controles ---------- */
  const seg = (id, fn) => {
    const g = $(id);
    g.querySelectorAll("button").forEach(b => b.onclick = () => { g.querySelectorAll("button").forEach(c => c.classList.toggle("on", c === b)); fn(b.dataset) });
  };
  seg("lab-classe", d => { classe = +d.c });
  seg("lab-modo", d => { modo = d.m; cv.style.touchAction = modo === "moldar" ? "none" : "pan-y" });
  seg("lab-ex", d => { pts = EX[d.ex](); $("lab-dica").textContent = DICA[d.ex]; novaRede(); parar(); sujo = true });
  const parar = () => { treinando = false; $("lab-treinar").textContent = "Treinar" };
  $("lab-treinar").onclick = () => { treinando = !treinando; $("lab-treinar").textContent = treinando ? "Pausar" : "Treinar" };
  $("lab-limpar").onclick = () => { pts = []; novaRede(); parar(); sujo = true; $("lab-dica").textContent = "" };
  $("lab-h").oninput = e => { NH = +e.target.value; $("lab-hv").textContent = NH; novaRede(); sujo = true };

  /* ---------- tamanho, visibilidade e laço ---------- */
  function fit() {
    const d = Math.min(devicePixelRatio || 1, 2);
    [[pl, p2, 2], [cv, x, 3]].forEach(([c, g, k]) => {
      const r = c.getBoundingClientRect(); if (!r.width) return;
      c.width = r.width * d; c.height = r.height * d; g.setTransform(d, 0, 0, d, 0, 0);
      if (k === 2) { W2 = r.width; H2 = r.height } else { W3 = r.width; H3 = r.height }
    });
  }
  addEventListener("resize", fit);
  new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis) fit() }).observe($("lab"));

  function loop() {
    requestAnimationFrame(loop); if (!vis) return; fr++;
    if (treinando) for (let k = 0; k < 8; k++) passo(1);
    if (sujo || (treinando && fr % 2 === 0)) { mapa(); sujo = false }
    fisica(); desenhar2D(); desenhar3D();
    if (fr % 8 === 0) $("lab-stats").textContent = pts.length ? `Época ${epoca} · perda ${loss.toFixed(3)} · acerto ${Math.round(acc * 100)}%` : "Toque no plano para adicionar pontos.";
  }

  novaRede(); fit();
  $("lab-modo").querySelector(`[data-m="${modo}"]`).click();
  $("lab-ex").querySelector('[data-ex="linear"]').click();
  requestAnimationFrame(loop);
})();