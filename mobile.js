(() => {
  const menu = document.getElementById("menu"); if (!menu) return;
  const velho = document.getElementById("gaveta"); if (velho) velho.remove();

  const st = document.createElement("style");
  st.textContent = `
.gd{position:fixed;inset:0;width:100%;height:100%;max-width:none;max-height:none;margin:0;padding:0;border:0;background:#04030f;color:#fff;overflow-y:auto;overscroll-behavior:contain}
.gd::backdrop{background:#04030f}
.gd-top{position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:#04030f;border-bottom:1px solid rgba(150,130,255,.22)}
.gd-top span{font:700 .82rem 'Sora',sans-serif;letter-spacing:.06em}
.gd-x{width:44px;height:44px;border-radius:50%;border:1px solid rgba(150,130,255,.22);background:none;color:#fff;font-size:1.1rem;cursor:pointer}
.gd nav{display:flex;flex-direction:column;padding:12px 24px 40px}
.gd nav a{display:block;font:200 1.5rem/1.2 'Sora',sans-serif;color:#fff;text-decoration:none;padding:14px 0;min-height:52px;border-bottom:1px solid rgba(150,130,255,.22)}
html.sem-rolagem,body.sem-rolagem{overflow:hidden}`;
  document.head.appendChild(st);

  const d = document.createElement("dialog"); d.className = "gd"; d.setAttribute("aria-label", "Menu");
  d.innerHTML = `<div class="gd-top"><span>Universo Artificial</span><button class="gd-x" aria-label="Fechar menu">✕</button></div><nav></nav>`;
  const nav = d.querySelector("nav");
  document.querySelectorAll("section[data-nome]").forEach(s => {
    const a = document.createElement("a"); a.href = "#" + s.id; a.textContent = s.dataset.nome; nav.appendChild(a);
  });
  document.body.appendChild(d);

  const trava = on => {
    document.documentElement.classList.toggle("sem-rolagem", on);
    document.body.classList.toggle("sem-rolagem", on);
    menu.setAttribute("aria-expanded", on);
  };
  const abrir = () => { if (!d.open) { d.showModal ? d.showModal() : d.setAttribute("open", "") } trava(true) };
  const fechar = () => { if (d.open) { d.close ? d.close() : d.removeAttribute("open") } trava(false) };

  menu.onclick = () => d.open ? fechar() : abrir();
  d.querySelector(".gd-x").onclick = fechar;
  d.addEventListener("close", () => trava(false));
  d.addEventListener("cancel", () => trava(false));
  nav.addEventListener("click", e => {
    const a = e.target.closest("a"); if (!a) return;
    e.preventDefault(); fechar();
    requestAnimationFrame(() => { const t = document.querySelector(a.getAttribute("href")); if (t) t.scrollIntoView({ behavior: "smooth" }) });
  });
  addEventListener("resize", () => { if (innerWidth > 760) fechar() });
})();