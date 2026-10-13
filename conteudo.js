(() => {
  const q = s => document.querySelector(s);
  const mk = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e };
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("v"); io.unobserve(e.target) } }), { threshold: .1 });
  const rev = el => { el.classList.add("rev"); io.observe(el); return el };

  /* ---------- COMO CRIAR UMA IA ---------- */
  const box = q("#criar-box");
  if (box) {
    const passos = [
      ["Defina o problema", "Escolha uma tarefa clara", "Comece com uma tarefa que dê para medir. Exemplo: classificar e-mails como spam ou não spam. Decida antes o que seria um bom resultado, como acertar 95% dos casos."],
      ["Reúna os dados", "Dados são o combustível", "Colete exemplos da tarefa e rotule cada um (spam ou não spam). Remova erros e duplicatas e separe os dados em treino (cerca de 80%) e teste (cerca de 20%). Dados bons costumam valer mais que um modelo sofisticado."],
      ["Escolha a abordagem", "Comece simples", "Para dados em tabelas, experimente regressão logística ou árvores de decisão. Para imagens, áudio e texto, use redes neurais. Muitas vezes é melhor fazer fine-tuning de um modelo já treinado do que treinar do zero."],
      ["Treine", "Deixe o modelo aprender", "O algoritmo ajusta os parâmetros para errar menos nos dados de treino. Em bibliotecas como o scikit-learn, é uma linha de código. Redes grandes usam GPUs e podem levar de minutos a semanas."],
      ["Avalie", "Teste com o que ele nunca viu", "Use os dados de teste e meça acurácia, precisão e recall, conforme a tarefa. Se o modelo vai muito bem no treino e mal no teste, ele sofreu sobreajuste (overfitting) e decorou os exemplos."],
      ["Melhore", "Repita até chegar à meta", "Ajuste hiperparâmetros, adicione mais dados, corrija rótulos errados ou troque de modelo. Avaliar e melhorar é um ciclo, e é nele que a maior parte do trabalho acontece."],
      ["Publique", "Coloque para funcionar", "Disponibilize o modelo em um site, aplicativo ou API. Depois acompanhe o desempenho com dados reais: o mundo muda e o modelo pode perder qualidade com o tempo."]
    ];
    const wrap = rev(mk("div", "passos")), abas = mk("div", "abas"), art = mk("article");
    passos.forEach(([nome, t, tx], i) => {
      const b = mk("button", "", `${i + 1}. ${nome}`);
      b.onclick = () => { [...abas.children].forEach(c => c.classList.remove("on")); b.classList.add("on"); art.innerHTML = `<h3>${t}</h3><p>${tx}</p>` };
      abas.appendChild(b); if (i === 0) b.click();
    });
    wrap.append(abas, art); box.appendChild(wrap);

    const codigo = `from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

textos = ["ganhe dinheiro rápido", "reunião amanhã às 10h",
          "promoção imperdível, clique aqui", "segue o relatório em anexo",
          "você ganhou um prêmio", "vamos almoçar hoje?"]
rotulos = [1, 0, 1, 0, 1, 0]   # 1 = spam, 0 = normal

modelo = make_pipeline(TfidfVectorizer(), LogisticRegression())
modelo.fit(textos, rotulos)              # treinamento

print(modelo.predict(["clique e ganhe um prêmio"]))   # provavelmente [1]`;
    const demo = rev(mk("div", "demo", `<h3>Seu primeiro modelo em Python</h3><p>Instale com <code>pip install scikit-learn</code> e rode no seu computador ou no Google Colab. Com tão poucos exemplos o resultado é só ilustrativo.</p>`));
    const pre = mk("pre", "codigo"); pre.textContent = codigo;
    const cp = mk("button", "copiar", "Copiar código");
    cp.onclick = async () => { try { await navigator.clipboard.writeText(codigo); cp.textContent = "Copiado!" } catch { cp.textContent = "Selecione e copie" } setTimeout(() => cp.textContent = "Copiar código", 1800) };
    demo.append(pre, cp); box.appendChild(demo);

    const ferr = [
      ["Teachable Machine", "Treine um modelo de imagens, sons ou poses direto no navegador, sem programar."],
      ["Google Colab", "Notebooks de Python no navegador, com GPU gratuita em uso limitado."],
      ["scikit-learn", "Biblioteca Python de aprendizado de máquina clássico. Ótima para começar."],
      ["PyTorch e TensorFlow", "Bibliotecas para construir e treinar redes neurais."],
      ["Hugging Face", "Repositório de modelos prontos e ferramentas para ajustá-los."]
    ];
    const f = mk("div"); f.append(mk("h3", "sub", "Ferramentas para começar"));
    const grade = mk("div", "cards"); ferr.forEach(([t, d]) => grade.appendChild(mk("div", "card", `<h3>${t}</h3><p>${d}</p>`)));
    f.appendChild(grade); box.appendChild(rev(f));
  }

  /* ---------- GLOSSÁRIO ---------- */
  const gb = q("#gloss-box");
  if (gb) {
    const termos = [
      ["Básico", "Inteligência artificial (IA)", "Campo da computação que cria sistemas capazes de realizar tarefas que normalmente exigem inteligência humana."],
      ["Básico", "Aprendizado de máquina", "Parte da IA em que sistemas aprendem padrões a partir de dados, em vez de seguir só regras escritas à mão."],
      ["Básico", "Aprendizado profundo", "Aprendizado de máquina com redes neurais de muitas camadas. Está por trás do reconhecimento de imagem, voz e texto."],
      ["Básico", "Dados de treino", "Exemplos usados para o modelo aprender. A qualidade deles define boa parte da qualidade do modelo."],
      ["Básico", "Modelo", "Resultado do treinamento: um conjunto de números (parâmetros) que transforma uma entrada em uma resposta."],
      ["Modelos", "Rede neural", "Estrutura de neurônios artificiais em camadas, ligados por conexões com pesos ajustáveis."],
      ["Modelos", "Transformer", "Arquitetura baseada em atenção, criada em 2017, usada nos modelos de linguagem atuais."],
      ["Modelos", "LLM", "Modelo de linguagem de grande porte: rede treinada com enormes volumes de texto para prever e gerar linguagem."],
      ["Modelos", "Parâmetro", "Número interno ajustado durante o treino. Os modelos atuais têm bilhões."],
      ["Modelos", "Embedding", "Representação numérica do significado de uma palavra ou imagem. Itens parecidos ficam próximos."],
      ["Modelos", "IA generativa", "IA que cria conteúdo novo, como texto, imagem, áudio e código."],
      ["Treinamento", "Treinamento", "Processo em que o modelo ajusta seus parâmetros para errar menos nos exemplos."],
      ["Treinamento", "Função de perda", "Medida de quão errada foi a resposta do modelo. O treino tenta reduzi-la."],
      ["Treinamento", "Descida do gradiente", "Método que ajusta os parâmetros na direção que diminui o erro."],
      ["Treinamento", "Sobreajuste (overfitting)", "Quando o modelo decora os exemplos de treino e vai mal com dados novos."],
      ["Treinamento", "Fine-tuning", "Ajuste extra de um modelo já treinado para uma tarefa ou estilo específico."],
      ["Treinamento", "Aprendizado supervisionado", "Treino com exemplos rotulados, em que a resposta certa é conhecida."],
      ["Uso", "Prompt", "Instrução ou pergunta que você envia ao modelo."],
      ["Uso", "Token", "Pedaço de texto (palavra, sílaba ou símbolo) que o modelo processa."],
      ["Uso", "Janela de contexto", "Quantidade de texto que o modelo consegue considerar de uma só vez."],
      ["Uso", "Inferência", "Uso de um modelo já treinado para gerar uma resposta."],
      ["Uso", "Temperatura", "Ajuste que deixa a escolha da próxima palavra mais previsível (baixa) ou mais criativa (alta)."],
      ["Uso", "RAG", "Técnica em que o modelo busca documentos externos e os usa como base da resposta."],
      ["Uso", "Alucinação", "Resposta que soa correta, mas contém informação inventada."],
      ["Uso", "Viés", "Tendência do modelo a favorecer ou prejudicar certos grupos, geralmente herdada dos dados."],
      ["Uso", "Agente de IA", "Sistema que planeja e executa várias etapas sozinho, usando ferramentas."]
    ].sort((a, b) => a[1].localeCompare(b[1], "pt")); window.UA_TERMOS = termos;

    let cat = "Todos";
    const barra = rev(mk("div", "gbarra")), inp = mk("input"), chips = mk("div", "chips"), cont = mk("p", "gcont"), lista = mk("div", "cards");
    inp.type = "search"; inp.placeholder = "Buscar termo…"; inp.setAttribute("aria-label", "Buscar termo");
    const render = () => {
      const t = norm(inp.value);
      const r = termos.filter(([c, n, d]) => (cat === "Todos" || c === cat) && norm(n + " " + d).includes(t));
      lista.innerHTML = r.length ? r.map(([c, n, d]) => `<div class="card"><h3>${n}</h3><p>${d}</p><small>${c}</small></div>`).join("") : `<div class="card"><p>Nenhum termo encontrado.</p></div>`;
      cont.textContent = r.length + (r.length === 1 ? " termo" : " termos");
    };
    ["Todos", "Básico", "Modelos", "Treinamento", "Uso"].forEach(c => {
      const b = mk("button", "chip" + (c === "Todos" ? " on" : ""), c);
      b.onclick = () => { cat = c; [...chips.children].forEach(x => x.classList.toggle("on", x === b)); render() };
      chips.appendChild(b);
    });
    inp.addEventListener("input", render);
    barra.append(inp, chips); gb.append(barra, cont, lista); render();
  }
})();