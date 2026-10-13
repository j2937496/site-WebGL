(() => {
  const q = s => document.querySelector(s), qa = s => [...document.querySelectorAll(s)];
  const mk = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e };
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const ls = { get: k => { try { return localStorage.getItem(k) } catch (e) { return null } }, set: (k, v) => { try { localStorage.setItem(k, v) } catch (e) {} } };
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  /* ---------- painel: desempenho, progresso e busca ---------- */
  const btn = mk("button", "hub-btn", "⚙"); btn.setAttribute("aria-label", "Painel"); btn.setAttribute("aria-expanded", "false");
  const hub = mk("div", "hub", `
    <h3>Painel</h3>
    <p class="hub-t">DESEMPENHO</p>
    <div class="seg" id="hub-n"><button data-n="alta">Alto</button><button data-n="media">Médio</button><button data-n="baixa">Baixo</button></div>
    <p class="hub-t">TRILHA DE APRENDIZADO · <span id="hub-pct">0%</span></p>
    <div class="hub-barra"><i id="hub-barra"></i></div>
    <button class="hub-busca" id="hub-busca">Buscar… <kbd>Ctrl K</kbd></button>`);
  document.body.append(btn, hub);
  btn.onclick = () => { const on = hub.classList.toggle("on"); btn.setAttribute("aria-expanded", on) };

  const atual = ls.get("ua-nivel") || "media";
  qa("#hub-n button").forEach(b => {
    b.classList.toggle("on", b.dataset.n === atual);
    b.onclick = () => { ls.set("ua-nivel", b.dataset.n); try { sessionStorage.removeItem("ua-lento") } catch (e) {} location.reload() };
  });

  /* ---------- progresso: seções visitadas ---------- */
  const secs = qa("section[data-nome]");
  let vis = new Set(); try { vis = new Set(JSON.parse(ls.get("ua-vis") || "[]")) } catch (e) {}
  const pct = () => Math.min(100, Math.round(vis.size / secs.length * 100));
  const desenha = () => { q("#hub-pct").textContent = pct() + "%"; q("#hub-barra").style.width = pct() + "%" };
  window.UAx = { pct };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !vis.has(e.target.id) && (e.intersectionRatio >= .4 || e.intersectionRect.height >= innerHeight * .45)) {
      vis.add(e.target.id); ls.set("ua-vis", JSON.stringify([...vis])); desenha();
    }
  }), { threshold: Array.from({ length: 21 }, (_, i) => i / 20) });
  secs.forEach(s => io.observe(s)); desenha();

  /* ---------- busca (Ctrl K) ---------- */
  const d = mk("dialog", "bs"); d.setAttribute("aria-label", "Buscar");
  d.innerHTML = `<input type="search" placeholder="Buscar seções, termos e dúvidas…" aria-label="Buscar"><ul></ul>`;
  document.body.appendChild(d);
  const inp = d.querySelector("input"), ul = d.querySelector("ul");
  let itens = [], res = [], sel = 0;

  const indice = () => {
    itens = secs.map(s => ({ t: s.dataset.nome, d: (s.querySelector("h2") || {}).textContent || "", tag: "Seção", go: () => s.scrollIntoView({ behavior: "smooth" }) }));
    (window.UA_TERMOS || []).forEach(([c, t, df]) => itens.push({ t, d: df, tag: "Glossário", go: () => {
      const g = q("#glossario"); if (g) g.scrollIntoView({ behavior: "smooth" });
      const i = q("#gloss-box input"); if (i) { i.value = t; i.dispatchEvent(new Event("input")) }
    } }));
    qa("#lista-faq details").forEach(x => itens.push({ t: x.querySelector("summary").textContent, d: x.querySelector("p").textContent, tag: "Dúvida", go: () => { x.open = true; x.scrollIntoView({ behavior: "smooth", block: "center" }) } }));
  };
  const busca = () => {
    const t = norm(inp.value.trim());
    res = (t
      ? itens.map(i => { const n = norm(i.t), df = norm(i.d); return [n.startsWith(t) ? 3 : n.includes(t) ? 2 : df.includes(t) ? 1 : 0, i] }).filter(x => x[0]).sort((a, b) => b[0] - a[0]).map(x => x[1])
      : itens.filter(i => i.tag === "Seção")).slice(0, 8);
    sel = 0;
    ul.innerHTML = res.map((i, k) => `<li class="${k ? "" : "on"}" data-k="${k}"><b>${esc(i.t)}</b><small><span class="tag">${i.tag}</span> ${esc(i.d.slice(0, 70))}</small></li>`).join("") || `<li><small>Nada encontrado.</small></li>`;
  };
  const abre = () => { indice(); inp.value = ""; busca(); d.showModal ? d.showModal() : d.setAttribute("open", ""); setTimeout(() => inp.focus(), 30) };
  const vai = k => { const i = res[k]; if (!i) return; d.close(); setTimeout(i.go, 60) };

  inp.addEventListener("input", busca);
  inp.addEventListener("keydown", e => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault(); sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + res.length) % (res.length || 1);
      [...ul.children].forEach((li, k) => li.classList.toggle("on", k === sel));
      if (ul.children[sel]) ul.children[sel].scrollIntoView({ block: "nearest" });
    }
    if (e.key === "Enter") vai(sel);
  });
  ul.addEventListener("click", e => { const li = e.target.closest("li[data-k]"); if (li) vai(+li.dataset.k) });
  d.addEventListener("click", e => { if (e.target === d) d.close() });
  addEventListener("keydown", e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); abre() } });
  q("#hub-busca").onclick = () => { hub.classList.remove("on"); btn.setAttribute("aria-expanded", "false"); abre() };

  /* ---------- PWA (só funciona com o site hospedado em https) ---------- */
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
})();