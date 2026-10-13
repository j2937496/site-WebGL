const $ = s => document.querySelector(s);
const h = (t, c, i) => { const e = document.createElement(t); if (c) e.className = c; e.innerHTML = i || ""; return e };
const cards = (id, arr) => arr.forEach(([t, x]) => $(id).appendChild(h("div", "card rev", `<h3>${t}</h3><p>${x}</p>`)));

/* ---------- Conteúdo ---------- */
const stats = [["1956", "ano em que o termo “IA” foi criado"], ["2012", "começa a era do aprendizado profundo"], ["2017", "surgem os Transformers"]];

const origem = [
  ["1943", "Neurônio matemático", "Warren McCulloch e Walter Pitts propõem um modelo matemático simples de neurônio, a semente das redes neurais."],
  ["1950", "O teste de Turing", "Alan Turing pergunta se máquinas podem pensar e propõe o teste de imitação para avaliar isso."],
  ["1956", "Nasce o termo", "Na conferência de Dartmouth, John McCarthy e colegas cunham “inteligência artificial” e fundam o campo."],
  ["1958", "O Perceptron", "Frank Rosenblatt cria uma das primeiras redes capazes de aprender com exemplos."],
  ["1986", "Retropropagação", "Rumelhart, Hinton e Williams popularizam o método que permite treinar redes com várias camadas."],
  ["1997", "Deep Blue", "O computador da IBM vence o campeão mundial de xadrez Garry Kasparov."],
  ["2012", "AlexNet", "Uma rede profunda vence a competição de reconhecimento de imagens ImageNet por larga margem, impulsionada por GPUs."],
  ["2017", "Transformers", "O artigo “Attention Is All You Need” apresenta a arquitetura que sustenta os modelos de linguagem atuais."],
  ["2022", "IA para todos", "Assistentes de conversa e geradores de imagem chegam ao grande público e entram no dia a dia."]
];

const etapas = [
  ["Dados", "Coletar exemplos", "Tudo começa com dados: livros, artigos, códigos, imagens e conversas. Quanto mais variados e bem filtrados, melhor o modelo generaliza. Dados ruins ou enviesados geram modelos ruins ou enviesados."],
  ["Redes neurais", "Neurônios em camadas", "Uma rede neural artificial é feita de camadas de “neurônios” matemáticos. Cada conexão tem um peso: o neurônio soma os sinais que recebe, aplica uma função e passa o resultado adiante. Muitas camadas formam o chamado aprendizado profundo."],
  ["Treinamento", "Errar para acertar", "O modelo tenta prever, compara com a resposta certa e mede o erro. Um algoritmo (descida do gradiente) ajusta levemente os pesos para errar menos. Repetido bilhões de vezes, isso faz padrões emergirem."],
  ["Transformers", "Atenção ao contexto", "Esta arquitetura usa um mecanismo de atenção: para cada palavra, o modelo pondera quais outras palavras do texto são mais relevantes. Por isso ele consegue manter o contexto de frases e parágrafos longos."],
  ["Ajuste", "Refinar o comportamento", "Depois do treino geral, o modelo é ajustado com exemplos escolhidos e avaliações humanas para seguir instruções, ser útil e evitar respostas nocivas."],
  ["Resposta", "Gerar palavra por palavra", "Seu texto é dividido em pedaços (tokens) e convertido em números. O modelo calcula as probabilidades do próximo token, escolhe um, repete o processo e assim monta a resposta."]
];

const tipos = [
  ["Aprendizado supervisionado", "Aprende com exemplos rotulados, como e-mails marcados como spam ou não spam."],
  ["Não supervisionado", "Encontra grupos e padrões em dados sem rótulos, como segmentos de clientes."],
  ["Por reforço", "Aprende por tentativa e erro, recebendo recompensas. Usado em jogos e robótica."],
  ["IA generativa", "Cria conteúdo novo, como textos, imagens, áudio e código, a partir do que aprendeu."],
  ["Visão computacional", "Interpreta imagens e vídeos: reconhece rostos, objetos e até sinais em exames."],
  ["Linguagem natural", "Entende, traduz e escreve linguagem humana, falada ou escrita."]
];

const apps = [
  ["Saúde", "Apoio à análise de exames de imagem e descoberta de medicamentos."],
  ["Educação", "Tutores que explicam no ritmo de cada aluno e ajudam a praticar."],
  ["Ciência", "Modelos que preveem a estrutura de proteínas e analisam grandes volumes de dados."],
  ["Dia a dia", "Filtros de spam, rotas no mapa, tradutores, recomendações e assistentes de voz."]
];

const dicas = [
  ["Dê contexto e objetivo", "Sou professor de ensino médio. Explique o que é fotossíntese em 5 linhas, com uma analogia do dia a dia."],
  ["Peça um formato", "Compare carro elétrico e a combustão em uma tabela com preço, manutenção e autonomia."],
  ["Refine a conversa", "Ficou longo demais. Resuma em 3 tópicos e use um tom mais informal."],
  ["Confira o que importa", "Quais fontes confiáveis posso consultar para confirmar essas informações?"]
];

const riscos = [
  ["Alucinações", "Modelos podem inventar fatos com aparência convincente. Confirme informações importantes."],
  ["Viés", "Se os dados de treino refletem preconceitos, as respostas podem reproduzi-los."],
  ["Privacidade", "Evite enviar senhas, documentos e dados sensíveis. Leia a política de cada serviço."],
  ["Desinformação", "Imagens, áudios e vídeos falsos (deepfakes) ficaram mais fáceis de produzir."],
  ["Trabalho", "Algumas tarefas serão automatizadas e outras surgirão. Aprender a usar IA vira uma habilidade útil."]
];

const futuro = [
  ["Agentes", "Sistemas que planejam e executam várias etapas sozinhos, usando ferramentas como navegador e planilhas."],
  ["Multimodais", "Modelos que entendem texto, imagem, áudio e vídeo juntos, de forma natural."],
  ["IA responsável", "Mais pesquisa em segurança, transparência e regras para que a tecnologia seja usada de forma ética."]
];

const duvidas = [
  ["A IA realmente entende o que diz?", "Ela aprende padrões estatísticos da linguagem, o que gera respostas muito coerentes. Se isso equivale a entender é um debate aberto entre cientistas e filósofos."],
  ["Qual a diferença entre IA, aprendizado de máquina e aprendizado profundo?", "IA é o campo amplo. Aprendizado de máquina é a parte em que sistemas aprendem com dados. Aprendizado profundo usa redes neurais com muitas camadas e é uma parte do aprendizado de máquina."],
  ["A IA vai substituir as pessoas?", "Ela tende a transformar tarefas mais do que profissões inteiras. Quem aprende a trabalhar com ela costuma ganhar produtividade."],
  ["Preciso saber programar para usar?", "Não. Basta escrever o que você precisa em linguagem natural. Pedidos claros dão melhores resultados."],
  ["Posso confiar em tudo o que ela responde?", "Não. Use como ponto de partida e confirme em fontes confiáveis, principalmente em saúde, finanças e direito."]
];

/* ---------- Conteúdo extra ---------- */
origem.push(
  ["2014", "GANs", "Ian Goodfellow apresenta as redes adversárias generativas, em que duas redes competem para criar imagens cada vez mais realistas."],
  ["2016", "AlphaGo", "O sistema da DeepMind vence o campeão Lee Sedol no jogo Go, considerado muito mais complexo que o xadrez."],
  ["2020", "GPT-3", "Um modelo de linguagem com 175 bilhões de parâmetros mostra que aumentar a escala faz surgirem habilidades inesperadas."],
  ["2021", "AlphaFold 2", "A DeepMind publica um sistema que prevê a estrutura 3D de proteínas com precisão inédita, acelerando a biologia."]
);
origem.sort((a, b) => a[0] - b[0]);

etapas.push(["Avaliação", "Medir antes de lançar", "Antes de chegar ao público, o modelo passa por testes de desempenho (benchmarks) e por avaliações de segurança, em que especialistas tentam provocar erros e usos indevidos para corrigi-los."]);

tipos.push(
  ["Modelos multimodais", "Combinam texto, imagem, áudio e vídeo em um único modelo."],
  ["Sistemas de recomendação", "Preveem o que você pode gostar em streaming, lojas e redes sociais."]
);

riscos.push(
  ["Impacto ambiental", "Treinar e operar grandes modelos consome energia e água em data centers. Eficiência virou prioridade de pesquisa."],
  ["Direitos autorais", "Há debates e disputas judiciais sobre o uso de obras protegidas para treinar modelos."]
);

dicas.push(
  ["Defina um papel", "Aja como um revisor de textos. Corrija o parágrafo abaixo e explique cada mudança."],
  ["Peça passo a passo", "Explique como funcionam juros compostos em passos simples, com um exemplo numérico."],
  ["Mostre o estilo", "Escreva 3 slogans para uma padaria. Estilo: curto e bem-humorado, como “Pão quente, dia feliz”."],
  ["Deixe ela perguntar", "Quero planejar uma viagem. Faça perguntas, uma por vez, até ter o que precisa para sugerir um roteiro."]
);

duvidas.push(
  ["O que são parâmetros e por que importam?", "São os números ajustados durante o treino. Em geral, mais parâmetros permitem aprender padrões mais complexos, mas a qualidade dos dados e do ajuste também pesa muito."],
  ["IA e ChatGPT são a mesma coisa?", "Não. IA é o campo inteiro. Assistentes de conversa são um tipo específico, baseado em modelos de linguagem."]
);

const recursos = [
  ["Dados", "Enormes volumes de texto, imagens, áudio e código, coletados, limpos e filtrados."],
  ["Computação", "Milhares de GPUs e chips especializados trabalhando em paralelo por semanas ou meses."],
  ["Energia", "Data centers consomem muita eletricidade para treinar e para responder a milhões de pedidos."],
  ["Pessoas", "Pesquisadores, engenheiros e avaliadores humanos que testam, corrigem e orientam o modelo."]
];

const glossario = [
  ["Token", "Pedaço de texto (palavra, sílaba ou símbolo) que o modelo processa."],
  ["Parâmetro", "Número interno ajustado no treino. Os modelos atuais têm bilhões."],
  ["Prompt", "A instrução ou pergunta que você envia ao modelo."],
  ["Janela de contexto", "Quantidade de texto que o modelo consegue considerar de uma vez."],
  ["Embedding", "Representação numérica do significado: textos parecidos ficam “próximos”."],
  ["Inferência", "Uso do modelo já treinado para gerar uma resposta."],
  ["Fine-tuning", "Ajuste extra do modelo para uma tarefa ou estilo específico."],
  ["RAG", "Técnica em que o modelo busca documentos externos e usa como base da resposta."],
  ["Temperatura", "Controla se a escolha da próxima palavra é mais previsível ou mais criativa."],
  ["Alucinação", "Resposta que soa correta, mas contém informação inventada."]
];

/* ---------- Renderização ---------- */
$("#stats").innerHTML = stats.map(([a, b]) => `<div><b>${a}</b><small>${b}</small></div>`).join("");
origem.forEach(([a, t, x]) => $("#linhas").appendChild(h("div", "linha rev", `<span class="ano">${a}</span><div><h3>${t}</h3><p>${x}</p></div>`)));
cards("#tipos-lista", tipos); cards("#apps-lista", apps); cards("#riscos-lista", riscos); cards("#futuro-lista", futuro);

dicas.forEach(([t, p]) => {
  const c = h("div", "card rev", `<h3>${t}</h3><code>${p}</code>`);
  const b = h("button", "copiar", "Copiar exemplo");
  b.onclick = async () => {
    try { await navigator.clipboard.writeText(p); b.textContent = "Copiado!" } catch { b.textContent = "Selecione e copie" }
    setTimeout(() => b.textContent = "Copiar exemplo", 1800);
  };
  c.appendChild(b); $("#dicas").appendChild(c);
});

duvidas.forEach(([q, a]) => $("#lista-faq").appendChild(h("details", "rev", `<summary>${q}</summary><p>${a}</p>`)));

etapas.forEach(([nome, t, x], i) => {
  const b = h("button", "", nome);
  b.onclick = () => {
    document.querySelectorAll(".abas button").forEach(e => e.classList.remove("on"));
    b.classList.add("on");
    $("#passo").innerHTML = `<h3>${t}</h3><p>${x}</p>`;
  };
  $("#abas").appendChild(b);
  if (i === 0) b.click();
});

/* demo: próxima palavra */
const est = [
  { p: "Modelos de linguagem aprendem a prever a próxima", l: " com base no", o: [["palavra", 71], ["frase", 12], ["letra", 9], ["sílaba", 8]] },
  { l: ".", o: [["contexto", 58], ["texto anterior", 22], ["histórico", 12], ["treinamento", 8]] }
];
let txt = "", passo = 0;
function demo() {
  $("#barras").innerHTML = ""; $("#reiniciar").hidden = true;
  if (passo >= est.length) { $("#frase").innerHTML = txt; $("#reiniciar").hidden = false; return }
  if (passo === 0) txt = est[0].p;
  $("#frase").innerHTML = txt + '<span class="cursor"></span>';
  est[passo].o.forEach(([w, pct]) => {
    const b = h("button", "barra", `<i style="width:0"></i><span>${w}</span><span>${pct}%</span>`);
    requestAnimationFrame(() => requestAnimationFrame(() => b.firstChild.style.width = pct + "%"));
    b.onclick = () => { txt += ` <mark>${w}</mark>` + est[passo].l; passo++; demo() };
    $("#barras").appendChild(b);
  });
}
$("#reiniciar").onclick = () => { passo = 0; demo() };
demo();

/* ---------- Carregamento ---------- */
let n = 0;
const ld = setInterval(() => {
  n += Math.ceil(Math.random() * 7);
  if (n >= 100) { n = 100; clearInterval(ld); setTimeout(() => { $("#loader").classList.add("fim"); document.querySelectorAll(".hero .rev").forEach(e => e.classList.add("v")) }, 300) }
  $("#pct").textContent = n + "%";
}, 70);

/* ---------- Navegação por pontos e revelação ---------- */
const secs = [...document.querySelectorAll("section")];
secs.forEach(s => $("#dots").appendChild(h("a", "", "")).setAttribute("href", "#" + s.id));
const dots = [...document.querySelectorAll(".dots a")];
dots.forEach((d, i) => d.setAttribute("aria-label", secs[i].dataset.nome));
new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    const i = secs.indexOf(e.target);
    dots.forEach((d, k) => d.classList.toggle("on", k === i));
    $("#secao").textContent = e.target.dataset.nome;
  }
}), { rootMargin: "-45% 0px -45% 0px" } ).observe && (() => {
  const o = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      const i = secs.indexOf(e.target);
      dots.forEach((d, k) => d.classList.toggle("on", k === i));
      $("#secao").textContent = e.target.dataset.nome;
    }
  }), { rootMargin: "-45% 0px -45% 0px" } );
  secs.forEach(s => o.observe(s));
})();
const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("v"); rv.unobserve(e.target) } }), { threshold: .12 });
document.querySelectorAll(".rev").forEach(e => { if (!e.closest(".hero")) rv.observe(e) });

/* ---------- Universo 3D (WebGL) ---------- */
(() => {
  const c = $("#cosmo");
  const gl = c.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
  if (!gl || !UA.cristal) { c.style.background = "radial-gradient(circle at 50% 50%,#2a1b8a,#04030f 65%)"; return }
  const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const vs = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
  const fs = `
precision highp float;
uniform vec2 R,M,O;uniform float T,S;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float hash(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 x){
  vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1.,0.,0.)),f.x),mix(hash(i+vec3(0.,1.,0.)),hash(i+vec3(1.,1.,0.)),f.x),f.y),
             mix(mix(hash(i+vec3(0.,0.,1.)),hash(i+vec3(1.,0.,1.)),f.x),mix(hash(i+vec3(0.,1.,1.)),hash(i+vec3(1.,1.,1.)),f.x),f.y),f.z);
}
float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<3;i++){s+=a*noise(p);p*=2.03;a*=.5;}return s;}
vec3 pal(float t){
  vec3 a=mix(vec3(.12,.28,1.),vec3(.6,.28,1.),S);
  return mix(a,vec3(.45,.85,1.),smoothstep(.4,1.,t));
}
float map(vec3 p){
  p.xz*=rot(T*.18+S*6.+M.x*1.6);
  p.yz*=rot(.45+M.y*.9+S*2.);
  float d=length(p)-1.05-.3*fbm(p*1.7+T*.12);
  float c=(abs(p.x)+abs(p.y)+abs(p.z)-1.55)*.57735;
  return max(d,c);
}
vec3 nrm(vec3 p){
  vec2 e=vec2(.004,0.);
  return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));
}
void main(){
  float k=min(R.x,R.y)*(R.x<R.y?.8:1.);
  vec2 uv=(gl_FragCoord.xy-.5*R)/k-O;
  vec3 ro=vec3(0.,0.,3.8),rd=normalize(vec3(uv,-1.6));

  float n=fbm(rd*2.5+vec3(0.,S*3.,T*.02));
  vec3 col=pal(n+.2)*pow(n,2.2)*.55;
  float st=hash(floor(rd*70.));
  col+=step(.9965,st)*(.5+.5*sin(T*2.+st*50.))*vec3(.8,.9,1.);

  float t=0.,glow=0.;bool hit=false;
  for(int i=0;i<${UA.passos};i++){
    vec3 q=ro+rd*t;float d=map(q);
    glow+=.014/(.03+abs(d));
    if(d<.003){hit=true;break;}
    t+=d*.75;if(t>9.)break;
  }
  if(hit){
    vec3 p=ro+rd*t,nn=nrm(p),l=normalize(vec3(-.5,.7,.6));
    float fr=pow(1.-max(dot(nn,-rd),0.),3.);
    float dif=max(dot(nn,l),0.);
    float spc=pow(max(dot(reflect(rd,nn),l),0.),24.);
    float f=fbm(p*3.+T*.2);
    col=pal(.2+f*.6+fr*.4)*(.25+.7*dif)+fr*pal(1.)*1.2+spc*.9+pal(.5)*f*.25;
  }
  col+=pal(.35+.4*sin(t*.4))*glow*.07;
  vec2 v=uv+O;col*=1.-.55*dot(v,v);
  col=1.-exp(-col*1.4);
  col=pow(col,vec3(.9));
  col+=(hash(vec3(gl_FragCoord.xy,T))-.5)/200.;
  gl_FragColor=vec4(col,1.);
}`;

  const sh = (type, src) => {
    const o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o);
    if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(o));
    return o;
  };
  const pg = gl.createProgram();
  gl.attachShader(pg, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(pg, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(pg); gl.useProgram(pg);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pg, "a");
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = n => gl.getUniformLocation(pg, n);
  const uR = U("R"), uT = U("T"), uS = U("S"), uM = U("M"), uO = U("O");
  let sp = 0, m = { x: 0, y: 0 }, tm = { x: 0, y: 0 };

  const fit = () => {
    const q = UA.webgl * Math.min(devicePixelRatio || 1, 1.5); (innerWidth < 800 ? .5 : .7) * Math.min(devicePixelRatio || 1, 1.5); /* qualidade: aumente para mais nitidez, diminua se travar */
    c.width = Math.floor(innerWidth * q); c.height = Math.floor(innerHeight * q);
    gl.viewport(0, 0, c.width, c.height); gl.uniform2f(uR, c.width, c.height);
  };
  addEventListener("resize", fit); fit();
  addEventListener("mousemove", e => { tm.x = e.clientX / innerWidth - .5; tm.y = e.clientY / innerHeight - .5 });

  function draw(t) {
        const vis = Math.max(0, 1 - scrollY / (innerHeight * UA.fade));
    c.style.opacity = vis.toFixed(3);
    if (vis < .01) { requestAnimationFrame(draw); return }
    const mx = document.documentElement.scrollHeight - innerHeight;
    sp += ((mx > 0 ? scrollY / mx : 0) - sp) * .06;
    m.x += (tm.x - m.x) * .05; m.y += (tm.y - m.y) * .05;
    const u = sp * (secs.length - 1);
    const off = innerWidth > 800 ? -Math.cos(Math.PI * u) * Math.min(u, 1) * .45 : 0;
    gl.uniform1f(uT, rm ? 0 : t * .001); gl.uniform1f(uS, sp);
    gl.uniform2f(uM, m.x, m.y); gl.uniform2f(uO, off, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();