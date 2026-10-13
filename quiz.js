(() => {
  const box = document.getElementById("quiz-box"); if (!box) return;
  const ls = { get: k => { try { return localStorage.getItem(k) } catch (e) { return null } }, set: (k, v) => { try { localStorage.setItem(k, v) } catch (e) {} } };
  const P = [
    ["O que são os pesos de uma rede neural?", ["Os dados de entrada", "Números ajustados durante o treinamento", "O tamanho do computador", "As respostas certas"], 1, "São os números que a rede ajusta para errar menos."],
    ["Para que serve a retropropagação?", ["Apagar dados antigos", "Gerar novas imagens", "Calcular quanto cada peso contribuiu para o erro", "Deixar a rede mais bonita"], 2, "O erro volta pela rede e mostra quais pesos ajustar."],
    ["O que é um token?", ["Um pedaço de texto que o modelo processa", "Uma senha de acesso", "Um tipo de placa de vídeo", "O nome de um modelo"], 0, "Pode ser uma palavra, uma sílaba ou um símbolo."],
    ["O que é sobreajuste (overfitting)?", ["Treinar rápido demais", "O modelo decorar os exemplos e ir mal com dados novos", "Usar poucos neurônios", "Um erro de digitação"], 1, "Por isso se separa uma parte dos dados só para testar."],
    ["Por que o XOR precisa de camadas ocultas?", ["Porque tem poucos pontos", "Porque é muito grande", "Porque nenhuma reta separa os grupos", "Porque usa só uma cor"], 2, "As camadas ocultas permitem curvar a fronteira."]
  ];
  let i = 0, pontos = 0;

  function pergunta() {
    const [t, ops, ok, ex] = P[i];
    box.innerHTML = `<div class="qz"><small>PERGUNTA ${i + 1} DE ${P.length}</small><h3>${t}</h3>
      ${ops.map((o, k) => `<button class="qz-op" data-k="${k}">${o}</button>`).join("")}
      <p class="qz-exp" hidden>${ex}</p><button class="btn" hidden>${i + 1 < P.length ? "Próxima" : "Ver resultado"}</button></div>`;
    const opcoes = [...box.querySelectorAll(".qz-op")], exp = box.querySelector(".qz-exp"), prox = box.querySelector(".btn");
    opcoes.forEach(b => b.onclick = () => {
      const k = +b.dataset.k; if (k === ok) pontos++;
      opcoes.forEach((o, n) => { o.disabled = true; if (n === ok) o.classList.add("ok"); else if (n === k) o.classList.add("no") });
      exp.hidden = false; prox.hidden = false; prox.focus();
    });
    prox.onclick = () => { i++; i < P.length ? pergunta() : fim() };
  }

  function fim() {
    const nivel = pontos === P.length ? ["Ouro", "#ffd36b"] : pontos >= 3 ? ["Prata", "#cfd8ff"] : ["Bronze", "#e0a070"];
    const melhor = Math.max(pontos, +(ls.get("ua-quiz") || 0)); ls.set("ua-quiz", melhor);
    const pct = window.UAx ? UAx.pct() : 0;
    box.innerHTML = `<div class="qz"><div class="qz-medalha" style="--c:${nivel[1]}">${pontos}/${P.length}</div>
      <h3>Medalha de ${nivel[0]}</h3>
      <p>Você acertou ${pontos} de ${P.length}. Seu melhor resultado: ${melhor}/${P.length}.</p>
      <p class="qz-exp">${pct >= 100 && pontos >= 4 ? "Explorador completo: você visitou todas as seções e foi muito bem no quiz!" : `Trilha de aprendizado: ${pct}% explorada.`}</p>
      <button class="btn">Refazer</button></div>`;
    box.querySelector(".btn").onclick = () => { i = 0; pontos = 0; pergunta() };
  }
  pergunta();
})();