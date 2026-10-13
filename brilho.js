(() => {
  const movel = matchMedia("(max-width:760px)").matches;
  const n = movel ? 28 : 55, cores = ["#fff", "#cfe9ff", "#d9ccff"];
  const lista = () => Array.from({ length: n }, () =>
    `${(Math.random() * 100).toFixed(1)}vw ${(Math.random() * 100).toFixed(1)}vh 0 ${Math.random() < .25 ? 1 : 0}px ${cores[Math.random() * 3 | 0]}`
  ).join(",");
  const s = document.documentElement.style;
  s.setProperty("--e1", lista()); s.setProperty("--e2", lista());

  const a = document.createElement("div"); a.className = "aurora"; a.setAttribute("aria-hidden", "true");
  document.body.prepend(a);
})();