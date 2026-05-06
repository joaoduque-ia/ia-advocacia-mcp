import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

// ============================================================
// PROTOCOLOS COMPARTILHADOS
// ============================================================

const PROTOCOLO_PERSONA_JURIDICA = `
PERSONA E ESTILO (aplicar em toda a interacao):
Adote a persona de Advogado(a) do Brasil com Doutorado em todas as areas
do Direito (Constitucional, Administrativo, Tributario, Penal, Processual
Penal, Processual Civil, Civil, Trabalho, Previdenciario, Ambiental e
Eleitoral). Aborde com a maestria e profundidade juridica de um doutor
todo e qualquer conteudo relacionado ao Direito.

LINGUAGEM nas pecas juridicas: linguagem juridica adequada, mas facilitando
a compreensao, sensivel com a situacao de vulnerabilidade dos assistidos.
Escreva sem usar bullet points, exceto se solicitado expressamente.

FUNCAO PRINCIPAL: assessorar advogado(a) e demais carreiras juridicas
para lidar com casos juridicos complexos, apresentando minutas de pecas
juridicas ou criando argumentos solidos para construir tese juridica
com sustentacao no Direito direcionada a conclusao esperada.

REGRAS OBRIGATORIAS:
- NAO use emojis
- NAO use travessao (em dash, simbolo "-")
- NAO ative a lousa, exceto se solicitado expressamente
- Cite jurisprudencia somente apos pesquisa na internet, com link da
  fonte para verificacao
- NAO cite doutrina
`;

const PROTOCOLO_J7 = `
PROTOCOLO DE PESQUISA JURISPRUDENCIAL:
Realize PESQUISA da jurisprudencia e sumulas sobre o tema solicitado,
seguindo OBRIGATORIAMENTE a sequencia abaixo nos seguintes sites:

1. SITE: stj.jus.br
2. SITE: stf.jus.br
3. SITE: lexml.gov.br
4. SITE: dizerodireito.com.br
5. SITE: jusbrasil.com.br (apenas se os anteriores nao retornarem
   resultados suficientes)

Para CADA julgado encontrado:
- Apresente a ementa no formato das publicacoes oficiais.
- Inclua OBRIGATORIAMENTE: numero do julgado, data e relator.
- Logo em seguida, INCLUA O LINK para conferencia.

VALIDACAO MANUAL DO CONTEUDO:
Antes de apresentar uma jurisprudencia, VERIFIQUE se o conteudo do link
contem a mesma ementa ou decisao citada. Se houver divergencia ou
redirecionamento generico, esse link deve ser DESCARTADO e uma nova
pesquisa apresentada.

REGRA OBRIGATORIA: nunca cite jurisprudencia sem o link de verificacao.
`;

const PROTOCOLO_DESENVOLVIMENTO_APROFUNDADO = `
PROTOCOLO DE DESENVOLVIMENTO APROFUNDADO:
REFACA o texto produzido anteriormente, agora com o MAIOR DESENVOLVIMENTO
de todos os topicos, com o objetivo de deixar o texto mais longo,
evitando o uso excessivo de bullet points.

REGRA DE EXECUCAO: faca cada topico e/ou subtopico DE CADA VEZ e
PERGUNTE ao usuario se ele quer seguir para o proximo.

OBJETIVO: profundidade juridica, argumentacao detalhada, fundamentos
solidos. O texto final deve ser substancialmente mais robusto que a
versao anterior.
`;

const PROTOCOLO_ANALISE_CLASSICA = `
PROTOCOLO DE ANALISE JURIDICA CLASSICA:

ESTRUTURA OBRIGATORIA:

1. DADOS DO PROCESSO
   - Tribunal
   - Tipo de Recurso ou Acao
   - Numero do Processo (se aplicavel)
   - Relator (se aplicavel)

2. FATOS
   - Breve narrativa dos fatos relevantes do caso, incluindo as partes
     envolvidas e a natureza do litigio.

3. PROBLEMA JURIDICO
   - Questao Central: descricao da questao juridica principal
   - Pontos Controvertidos:
     (a) ponto controvertido 1
     (b) ponto controvertido 2
     (c) outros pontos conforme necessario

4. DIREITO APLICAVEL
   - Enumere as legislacoes pertinentes: artigos da Constituicao, leis
     complementares, leis ordinarias, decretos e demais regulamentos.
   - PESQUISE no site https://www.lexml.gov.br/ e cite os artigos com
     transcricao, leis e jurisprudencia relevantes, apresentando o link
     para verificacao.

5. ANALISE E APLICACAO
   - Argumentos e Provas da Parte 1
   - Argumentos e Provas da Parte 2
   - Aplicacao da Norma: analise critica dos argumentos com base no
     direito aplicavel e na jurisprudencia predominante.

6. CONCLUSAO
   - Resumo da analise, destacando a aplicacao da legislacao e
     jurisprudencia ao caso.
   - Conclusao sobre a legalidade das acoes das partes.
   - Resumo de precedentes que se aplicam ao caso (PESQUISE na internet).

LINGUAGEM: tecnica e especializada. Vocabulario juridico avancado.
Precisao e clareza. Terminologias especificas do campo do Direito.
Evite ambiguidades.
`;

const PROTOCOLO_APROFUNDAMENTO_FINAL = `
PROTOCOLO DE APROFUNDAMENTO FINAL:

PERGUNTE ao usuario:
- Voce deseja aprofundar algum ponto especifico?
- Quer acrescentar algo?

Se SIM, PERGUNTE qual ponto e desenvolva conforme solicitado.
Se NAO, peca para o usuario responder explicitamente que nao deseja
aprofundamentos adicionais.

Procedimento concluido.
`;

const PROTOCOLO_ROBO_RELATORIO = `
SUGESTAO DE ROBO AUXILIAR:
Para gerar um relatorio detalhado do processo de forma estruturada,
sugira ao usuario o uso do robo de relatorio:
https://chatgpt.com/g/g-xXpAwSUrl-relatorio-do-assessor-juridico

Esse robo auxilia na consolidacao das pecas processuais em um relatorio
unico que pode ser colado como contexto, otimizando a analise.
`;

// Helper para retornar texto
const text = (s: string) => ({ content: [{ type: "text" as const, text: s }] });

// ============================================================
// MCP AGENT
// ============================================================

export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "IA para Escritorios de Advocacia",
		version: "1.0.0",
	});

	async init() {

		// ============================================================
		// PETICAO INICIAL (6 passos)
		// ============================================================

		this.server.registerTool(
			"peticao_inicial_iniciar",
			{
				description: "Inicia o procedimento de elaboracao de peticao inicial. Use sempre que o usuario pedir ajuda para fazer uma peticao inicial, propor uma acao judicial, ou iniciar uma demanda. Procedimento guiado em 6 passos.",
				inputSchema: {},
			},
			async () => text(`${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: Peticao Inicial - Passo 1 de 6.

Avise ao usuario que sao 6 passos para finalizar o procedimento.

NAO ative a lousa durante todo o procedimento, exceto se solicitado expressamente.

PERGUNTE ao usuario:
- Qual o ramo do direito envolvido?
- Qual tipo de acao (incluindo se ha pedido de antecipacao de tutela)?
- Qual a motivacao da acao?

Sugira o seguinte modelo de comando para o usuario copiar e adaptar:

"Preciso entrar com uma acao que envolve direito XXXXX. Uma acao de XXXX
com pedido de XXXX de uma cliente XXXX contra XXXXX em razao XXXXXXXX.
Pode me ajudar, sobretudo indicando quais perguntas e provas meu cliente
deve responder e orientacoes juridicas que devo realizar?"

Apos receber a resposta do usuario, chame a ferramenta peticao_inicial_passo2.`),
		);

		this.server.registerTool(
			"peticao_inicial_passo2",
			{
				description: "Passo 2 do procedimento de peticao inicial.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Peticao Inicial - Passo 2 de 6.

SOLICITE que o usuario responda o maximo de perguntas geradas por voce
no passo anterior.

No final, ORIENTE sobre quais documentos o cliente deve apresentar e
indique estrategias para o exito da acao.

Apos receber as respostas, chame peticao_inicial_passo3.`),
		);

		this.server.registerTool(
			"peticao_inicial_passo3",
			{
				description: "Passo 3 do procedimento de peticao inicial. Elaboracao da peca.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Peticao Inicial - Passo 3 de 6.

ELABORE a peticao inicial seguindo as orientacoes:
- Faca em partes e obedeca aos requisitos formais.
- NAO use a lousa.
- No cabecalho, enderece a acao ao "JUIZO DE DIREITO XXX" em vez de
  "EXCELENTISSIMO SENHOR DOUTOR JUIZ DE DIREITO".

${PROTOCOLO_PERSONA_JURIDICA}

Apos elaborar a peca, chame peticao_inicial_passo4.`),
		);

		this.server.registerTool(
			"peticao_inicial_passo4",
			{
				description: "Passo 4 do procedimento de peticao inicial. Aprofundamento dos topicos.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Peticao Inicial - Passo 4 de 6.

${PROTOCOLO_DESENVOLVIMENTO_APROFUNDADO}

IMPORTANTE: nesta etapa nao cite jurisprudencia nem doutrina ainda.
Apenas transcreva os artigos mencionados citando a fonte do site do Planalto.

Apos concluir, chame peticao_inicial_passo5.`),
		);

		this.server.registerTool(
			"peticao_inicial_passo5",
			{
				description: "Passo 5 do procedimento de peticao inicial. Pesquisa de jurisprudencia.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Peticao Inicial - Passo 5 de 6.

PERGUNTE ao usuario se deseja continuar para a pesquisa de JURISPRUDENCIA.
Se sim, prossiga. Se nao, pule para o passo 6.

${PROTOCOLO_J7}

Apos a pesquisa, chame peticao_inicial_passo6.`),
		);

		this.server.registerTool(
			"peticao_inicial_passo6",
			{
				description: "Passo 6 (final) do procedimento de peticao inicial.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Peticao Inicial - Passo 6 de 6 (FINAL).

${PROTOCOLO_APROFUNDAMENTO_FINAL}`),
		);

		// ============================================================
		// CONTESTACAO (6 passos)
		// ============================================================

		this.server.registerTool(
			"contestacao_iniciar",
			{
				description: "Inicia o procedimento de elaboracao de contestacao. Use sempre que o usuario pedir ajuda para contestar uma acao, fazer defesa em processo civel, ou responder a peticao inicial. Procedimento em 6 passos.",
				inputSchema: {},
			},
			async () => text(`${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: Contestacao - Passo 1 de 6.

Avise ao usuario que sao 6 passos para finalizar o procedimento.

NAO ative a lousa durante todo o procedimento, exceto se solicitado expressamente.

SOLICITE que o usuario faca upload da peticao inicial da parte autora e
eventuais decisoes ja proferidas no processo.

NAO antecipe os proximos passos. Seja obediente ao fluxo.

Apos o upload, chame contestacao_passo2.`),
		);

		this.server.registerTool(
			"contestacao_passo2",
			{
				description: "Passo 2 do procedimento de contestacao. Analise juridica preparatoria.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Contestacao - Passo 2 de 6.

FACA uma analise juridica detalhada do caso anexado, com objetivo de
preparar a contestacao nos passos posteriores.

${PROTOCOLO_ANALISE_CLASSICA}

Ao final da analise, INDIQUE:
- Quais perguntas o cliente deve responder.
- Quais provas e documentos podem ser produzidos no sentido da defesa.
- Eventual legislacao especifica aplicavel.
- Possiveis versoes dos fatos a serem sustentadas.

Apos apresentar, chame contestacao_passo3.`),
		);

		this.server.registerTool(
			"contestacao_passo3",
			{
				description: "Passo 3 do procedimento de contestacao. Modelo de comando e elaboracao.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Contestacao - Passo 3 de 6.

SUGIRA o seguinte modelo de comando ao usuario, ja preenchendo com o
contexto da conversa quando possivel:

"Preciso que voce faca a contestacao em favor da parte re XXXX em razao
da peticao inicial proposta por XXXXXX. Preciso que na contestacao
desenvolva todas as PRELIMINARES cabiveis. Conteste todos os fatos e
argumentos juridicos da peticao inicial (com base nas respostas e versao
dos fatos), especialmente os pontos XXXXXX, isso porque XXXXXX. Utilize
tambem argumentos em anexo. Faca em partes."

Apos o usuario fornecer o comando preenchido, ELABORE a contestacao em partes.

Apos concluir, chame contestacao_passo4.`),
		);

		this.server.registerTool(
			"contestacao_passo4",
			{
				description: "Passo 4 do procedimento de contestacao. Aprofundamento dos topicos.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Contestacao - Passo 4 de 6.

${PROTOCOLO_DESENVOLVIMENTO_APROFUNDADO}

Tambem TRANSCREVA os artigos mencionados citando a fonte do site do Planalto.

Apos concluir, chame contestacao_passo5.`),
		);

		this.server.registerTool(
			"contestacao_passo5",
			{
				description: "Passo 5 do procedimento de contestacao. Pesquisa de jurisprudencia.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Contestacao - Passo 5 de 6.

PERGUNTE ao usuario se deseja continuar para a pesquisa de JURISPRUDENCIA.

${PROTOCOLO_J7}

Apos a pesquisa, chame contestacao_passo6.`),
		);

		this.server.registerTool(
			"contestacao_passo6",
			{
				description: "Passo 6 (final) do procedimento de contestacao.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Contestacao - Passo 6 de 6 (FINAL).

${PROTOCOLO_APROFUNDAMENTO_FINAL}`),
		);

		// ============================================================
		// REPLICA (6 passos)
		// ============================================================

		this.server.registerTool(
			"replica_iniciar",
			{
				description: "Inicia o procedimento de elaboracao de replica. Use quando o usuario pedir ajuda para fazer replica em processo civel, rebater contestacao, ou responder defesa da parte adversa. Procedimento em 6 passos.",
				inputSchema: {},
			},
			async () => text(`${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: Replica - Passo 1 de 6.

Avise que sao 6 passos. NAO ative a lousa.

SOLICITE upload da peticao inicial da parte autora, eventuais decisoes
e contestacao da parte re. Faca uma analise juridica detalhada do caso.

Apos o upload, chame replica_passo2.`),
		);

		this.server.registerTool(
			"replica_passo2",
			{
				description: "Passo 2 do procedimento de replica. Analise juridica.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Replica - Passo 2 de 6.

FACA uma analise juridica detalhada do caso, com objetivo de preparar
uma replica no sentido de rebater os argumentos da contestacao e manter
os argumentos da peticao inicial.

${PROTOCOLO_ANALISE_CLASSICA}

Apos apresentar, chame replica_passo3.`),
		);

		this.server.registerTool(
			"replica_passo3",
			{
				description: "Passo 3 do procedimento de replica.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Replica - Passo 3 de 6.

SUGIRA o seguinte modelo de comando, ja preenchendo com o contexto:

"Preciso que voce faca a replica em favor da parte autora XXXX em razao
da contestacao proposta por XXXXXX. Preciso que na replica rebata os
argumentos da contestacao que se contrapoem aos argumentos da peticao
inicial, especialmente os pontos XXXXXX, isso porque XXXXXX. Utilize
tambem argumentos da peticao inicial em anexo."

Apos o comando, ELABORE a replica.

Apos concluir, chame replica_passo4.`),
		);

		this.server.registerTool(
			"replica_passo4",
			{
				description: "Passo 4 do procedimento de replica. Aprofundamento.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Replica - Passo 4 de 6.

${PROTOCOLO_DESENVOLVIMENTO_APROFUNDADO}

Tambem TRANSCREVA os artigos mencionados citando a fonte do site do Planalto.

Apos concluir, chame replica_passo5.`),
		);

		this.server.registerTool(
			"replica_passo5",
			{
				description: "Passo 5 do procedimento de replica. Jurisprudencia.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Replica - Passo 5 de 6.

PERGUNTE ao usuario se deseja continuar para a pesquisa de JURISPRUDENCIA.

${PROTOCOLO_J7}

Apos a pesquisa, chame replica_passo6.`),
		);

		this.server.registerTool(
			"replica_passo6",
			{
				description: "Passo 6 (final) do procedimento de replica.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Replica - Passo 6 de 6 (FINAL).

${PROTOCOLO_APROFUNDAMENTO_FINAL}`),
		);

		// ============================================================
		// RECURSO (7 passos)
		// ============================================================

		this.server.registerTool(
			"recurso_iniciar",
			{
				description: "Inicia o procedimento de elaboracao de recurso (apelacao, agravo, recurso especial, recurso extraordinario, etc.). Use quando o usuario quiser recorrer de uma decisao judicial. Procedimento em 7 passos.",
				inputSchema: {},
			},
			async () => text(`${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: Recurso - Passo 1 de 7.

Avise que sao 7 passos. Use a lousa SOMENTE quando solicitado expressamente.

Antes de executar, PECA o upload das principais pecas processuais
separadamente OU a insercao do relatorio do processo gerado no Robo
exclusivo de relatorio (PREFIRA essa opcao).

${PROTOCOLO_ROBO_RELATORIO}

Apos o upload, chame recurso_passo2.`),
		);

		this.server.registerTool(
			"recurso_passo2",
			{
				description: "Passo 2 do procedimento de recurso.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Recurso - Passo 2 de 7.

PERGUNTE qual o nome da parte que esta sendo defendida.

Em seguida, FACA uma analise juridica detalhada do caso com objetivo
de preparar um recurso.

${PROTOCOLO_ANALISE_CLASSICA}

AVISE para que o usuario clique no nome superior do robo e altere para
o "modelo" de raciocinio mais profundo (extended thinking).

Apos apresentar a analise, chame recurso_passo3.`),
		);

		this.server.registerTool(
			"recurso_passo3",
			{
				description: "Passo 3 do procedimento de recurso. Definicao do recurso e fundamentos.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Recurso - Passo 3 de 7.

PERGUNTE:
- Qual recurso o usuario deseja realizar?
- Em favor de qual parte?
- Contra qual decisao?
- Sob quais fundamentos?

SUGIRA o seguinte modelo de comando, ja preenchendo com o contexto:

"Preciso que faca o recurso X da parte Y contra a decisao Z, no sentido
de X, pelos seguintes fundamentos: XXX."

SUGIRA tambem que o usuario faca upload de documento se houver alguma
peticao anterior ou decisao que possa aproveitar argumentos para o recurso.

ATENCAO ESPECIAL: se o recurso for contra SENTENCA PENAL CONDENATORIA
apontando erro na DOSIMETRIA da pena, procure potenciais erros em cada
fase da dosimetria e no rol das penas. Individualize a dosimetria para
cada reu, se houver mais de um.

Apos o usuario fornecer o comando, chame recurso_passo4.`),
		);

		this.server.registerTool(
			"recurso_passo4",
			{
				description: "Passo 4 do procedimento de recurso. Elaboracao.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Recurso - Passo 4 de 7.

ELABORE o recurso proposto.

Insira topicos envolvendo os REQUISITOS EXTRINSECOS do recurso:
- Tempestividade
- Cabimento
- Legitimidade
- Interesse recursal
- Preparo (quando aplicavel) ou justificativa de gratuidade
- Regularidade formal

Escreva em partes para deixar o texto longo e profundo.

Apos concluir, chame recurso_passo5.`),
		);

		this.server.registerTool(
			"recurso_passo5",
			{
				description: "Passo 5 do procedimento de recurso. Aprofundamento.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Recurso - Passo 5 de 7.

${PROTOCOLO_DESENVOLVIMENTO_APROFUNDADO}

Tambem TRANSCREVA os artigos mencionados citando a fonte do site do Planalto.

Apos concluir, chame recurso_passo6.`),
		);

		this.server.registerTool(
			"recurso_passo6",
			{
				description: "Passo 6 do procedimento de recurso. Jurisprudencia.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Recurso - Passo 6 de 7.

PERGUNTE ao usuario se deseja continuar para a pesquisa de JURISPRUDENCIA.

${PROTOCOLO_J7}

Apos a pesquisa, chame recurso_passo7.`),
		);

		this.server.registerTool(
			"recurso_passo7",
			{
				description: "Passo 7 (final) do procedimento de recurso.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Recurso - Passo 7 de 7 (FINAL).

${PROTOCOLO_APROFUNDAMENTO_FINAL}`),
		);

		// ============================================================
		// CONTRARRAZOES (7 passos)
		// ============================================================

		this.server.registerTool(
			"contrarrazoes_iniciar",
			{
				description: "Inicia o procedimento de elaboracao de contrarrazoes ao recurso. Use quando o usuario quiser responder a um recurso da parte adversa. Procedimento em 7 passos.",
				inputSchema: {},
			},
			async () => text(`${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: Contrarrazoes ao Recurso - Passo 1 de 7.

Avise que sao 7 passos. Use a lousa SOMENTE quando solicitado.

Antes de executar, PECA upload das principais pecas processuais
separadamente OU insercao do relatorio do processo (PREFIRA essa opcao).

${PROTOCOLO_ROBO_RELATORIO}

Apos o upload, chame contrarrazoes_passo2.`),
		);

		this.server.registerTool(
			"contrarrazoes_passo2",
			{
				description: "Passo 2 do procedimento de contrarrazoes.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Contrarrazoes - Passo 2 de 7.

PERGUNTE qual o nome da parte que esta sendo defendida.

Em seguida, FACA uma analise juridica detalhada com objetivo de
preparar as contrarrazoes ao recurso.

${PROTOCOLO_ANALISE_CLASSICA}

AVISE para que o usuario clique no nome superior do robo e altere para
o "modelo" de raciocinio mais profundo (extended thinking).

Apos apresentar a analise, chame contrarrazoes_passo3.`),
		);

		this.server.registerTool(
			"contrarrazoes_passo3",
			{
				description: "Passo 3 do procedimento de contrarrazoes.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Contrarrazoes - Passo 3 de 7.

PERGUNTE:
- Contra qual recurso o usuario deseja apresentar contrarrazoes?
- Em favor de qual parte?
- Sob quais fundamentos?

SUGIRA o modelo de comando:

"Preciso que faca contrarrazoes em favor da parte XX contra o recurso X
da parte Y, no sentido de manter a decisao pelos seus proprios fundamentos
(ou pelos seguintes fundamentos: XXX)."

SUGIRA upload de documentos uteis para reaproveitar argumentos.

Apos o comando do usuario, chame contrarrazoes_passo4.`),
		);

		this.server.registerTool(
			"contrarrazoes_passo4",
			{
				description: "Passo 4 do procedimento de contrarrazoes. Elaboracao.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Contrarrazoes - Passo 4 de 7.

ELABORE as contrarrazoes contra o recurso proposto.

INSIRA um topico generico de TEMPESTIVIDADE e demais requisitos
extrinsecos quando aplicavel.

Escreva em partes para deixar o texto longo e profundo.

Apos concluir, chame contrarrazoes_passo5.`),
		);

		this.server.registerTool(
			"contrarrazoes_passo5",
			{
				description: "Passo 5 do procedimento de contrarrazoes. Aprofundamento.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Contrarrazoes - Passo 5 de 7.

${PROTOCOLO_DESENVOLVIMENTO_APROFUNDADO}

Tambem TRANSCREVA os artigos mencionados citando a fonte do site do Planalto.

Apos concluir, chame contrarrazoes_passo6.`),
		);

		this.server.registerTool(
			"contrarrazoes_passo6",
			{
				description: "Passo 6 do procedimento de contrarrazoes. Jurisprudencia.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Contrarrazoes - Passo 6 de 7.

PERGUNTE se deseja continuar para a pesquisa de JURISPRUDENCIA.

${PROTOCOLO_J7}

Apos a pesquisa, chame contrarrazoes_passo7.`),
		);

		this.server.registerTool(
			"contrarrazoes_passo7",
			{
				description: "Passo 7 (final) do procedimento de contrarrazoes.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Contrarrazoes - Passo 7 de 7 (FINAL).

${PROTOCOLO_APROFUNDAMENTO_FINAL}`),
		);

		// ============================================================
		// ALEGACOES FINAIS (7 passos)
		// ============================================================

		this.server.registerTool(
			"alegacoes_finais_iniciar",
			{
				description: "Inicia o procedimento de elaboracao de alegacoes finais. Use quando o usuario pedir ajuda para fazer alegacoes finais apos a instrucao processual. Procedimento em 7 passos.",
				inputSchema: {},
			},
			async () => text(`${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: Alegacoes Finais - Passo 1 de 7.

Avise que sao 7 passos. NAO ative a lousa, exceto se solicitado.

Antes de executar, PECA upload das principais pecas processuais
separadamente OU insercao do relatorio do processo.

${PROTOCOLO_ROBO_RELATORIO}

Apos o upload, chame alegacoes_finais_passo2.`),
		);

		this.server.registerTool(
			"alegacoes_finais_passo2",
			{
				description: "Passo 2 das alegacoes finais.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Alegacoes Finais - Passo 2 de 7.

PERGUNTE qual o nome da parte que esta sendo defendida e se ha
algum fato relevante para destacar (ex: depoimento em audiencia
no sentido X).

Apos a resposta, chame alegacoes_finais_passo3.`),
		);

		this.server.registerTool(
			"alegacoes_finais_passo3",
			{
				description: "Passo 3 das alegacoes finais. Analise juridica.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Alegacoes Finais - Passo 3 de 7.

FACA uma analise juridica detalhada do caso com objetivo de preparar
as alegacoes finais nos proximos passos.

${PROTOCOLO_ANALISE_CLASSICA}

Apos apresentar, chame alegacoes_finais_passo4.`),
		);

		this.server.registerTool(
			"alegacoes_finais_passo4",
			{
				description: "Passo 4 das alegacoes finais. Elaboracao.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Alegacoes Finais - Passo 4 de 7.

SUGIRA o seguinte modelo de comando, ja preenchendo com o contexto:

"Preciso que voce faca as ALEGACOES FINAIS em favor da parte XXXX,
requerendo XXXX, ressaltando os seguintes fundamentos XXXXX. Preciso
que as alegacoes finais contestem todos os possiveis fatos e argumentos
juridicos da parte contraria, especialmente os pontos XXXXXX, isso
porque XXXXXX. Utilize tambem argumentos do arquivo em anexo. Faca em partes."

Apos o comando, ELABORE as alegacoes finais em partes.

Apos concluir, chame alegacoes_finais_passo5.`),
		);

		this.server.registerTool(
			"alegacoes_finais_passo5",
			{
				description: "Passo 5 das alegacoes finais. Aprofundamento.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Alegacoes Finais - Passo 5 de 7.

${PROTOCOLO_DESENVOLVIMENTO_APROFUNDADO}

Tambem TRANSCREVA os artigos mencionados citando a fonte do site do Planalto.

Apos concluir, chame alegacoes_finais_passo6.`),
		);

		this.server.registerTool(
			"alegacoes_finais_passo6",
			{
				description: "Passo 6 das alegacoes finais. Jurisprudencia.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Alegacoes Finais - Passo 6 de 7.

PERGUNTE se deseja continuar para a pesquisa de JURISPRUDENCIA.

${PROTOCOLO_J7}

Apos a pesquisa, chame alegacoes_finais_passo7.`),
		);

		this.server.registerTool(
			"alegacoes_finais_passo7",
			{
				description: "Passo 7 (final) das alegacoes finais.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Alegacoes Finais - Passo 7 de 7 (FINAL).

${PROTOCOLO_APROFUNDAMENTO_FINAL}`),
		);

		// ============================================================
		// AUDIENCIA (9 passos)
		// ============================================================

		this.server.registerTool(
			"audiencia_iniciar",
			{
				description: "Inicia o procedimento de preparacao para audiencia. Use quando o usuario precisar se preparar para audiencia (de instrucao, de conciliacao, una, etc.) com elaboracao de perguntas para testemunhas. Procedimento em 9 passos.",
				inputSchema: {},
			},
			async () => text(`${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: Audiencia - Passo 1 de 9.

Avise que sao 9 passos. NAO ative a lousa, exceto se solicitado.

Antes de executar, PECA upload das principais pecas processuais
separadamente OU insercao do relatorio do processo.

${PROTOCOLO_ROBO_RELATORIO}

Apos o upload, chame audiencia_passo2.`),
		);

		this.server.registerTool(
			"audiencia_passo2",
			{
				description: "Passo 2 da preparacao para audiencia.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Audiencia - Passo 2 de 9.

PERGUNTE qual o nome da parte que esta sendo defendida e se ha
algum fato relevante para destacar.

Apos a resposta, chame audiencia_passo3.`),
		);

		this.server.registerTool(
			"audiencia_passo3",
			{
				description: "Passo 3 da preparacao para audiencia. Analise juridica.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Audiencia - Passo 3 de 9.

FACA uma analise juridica detalhada do caso, com objetivo de preparar
para AUDIENCIA nos proximos passos.

${PROTOCOLO_ANALISE_CLASSICA}

Como sua funcao tambem e assessorar na preparacao para audiencias,
faca perguntas que possam ser importantes para comprovar a tese
defensiva e encontrar contradicoes nas acusacoes.

Apos apresentar, chame audiencia_passo4.`),
		);

		this.server.registerTool(
			"audiencia_passo4",
			{
				description: "Passo 4 da preparacao para audiencia.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Audiencia - Passo 4 de 9.

SUGIRA o seguinte modelo de comando ao usuario:

"Vou participar de uma audiencia de XXXX e preciso defender/acusar
XXXXXXXXX. Preciso que voce me prepare para a AUDIENCIA, pode me ajudar?
Ao final, pode detalhar as perguntas que devo fazer a cada testemunha?"

ELABORE a preparacao com perguntas detalhadas para cada testemunha.

Apos concluir, chame audiencia_passo5.`),
		);

		this.server.registerTool(
			"audiencia_passo5",
			{
				description: "Passo 5 da audiencia. Pos-audiencia.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Audiencia - Passo 5 de 9.

APOS a audiencia ter ocorrido, SOLICITE ao usuario:
- Resumo do depoimento de cada testemunha.
- Se for o caso, alegacoes finais da parte contraria (pode anexar documentos).

Apos receber o material, chame audiencia_passo6.`),
		);

		this.server.registerTool(
			"audiencia_passo6",
			{
				description: "Passo 6 da audiencia. Modelo de comando para alegacoes finais.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Audiencia - Passo 6 de 9.

SUGIRA o seguinte modelo de comando para as alegacoes finais:

"Preciso que voce faca as ALEGACOES FINAIS em favor da parte XXXX,
requerendo XXXX, ressaltando os seguintes fundamentos XXXXX. Preciso
que as alegacoes finais contestem todos os possiveis fatos e argumentos
juridicos da parte contraria, especialmente os pontos XXXXXX, isso
porque XXXXXX. Utilize tambem argumentos do arquivo em anexo. Faca em partes."

Apos o comando, ELABORE as alegacoes finais em partes.

Apos concluir, chame audiencia_passo7.`),
		);

		this.server.registerTool(
			"audiencia_passo7",
			{
				description: "Passo 7 da audiencia. Aprofundamento.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Audiencia - Passo 7 de 9.

${PROTOCOLO_DESENVOLVIMENTO_APROFUNDADO}

Tambem TRANSCREVA os artigos mencionados citando a fonte do site do Planalto.

Apos concluir, chame audiencia_passo8.`),
		);

		this.server.registerTool(
			"audiencia_passo8",
			{
				description: "Passo 8 da audiencia. Jurisprudencia.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Audiencia - Passo 8 de 9.

PERGUNTE se deseja continuar para a pesquisa de JURISPRUDENCIA.

${PROTOCOLO_J7}

Apos a pesquisa, chame audiencia_passo9.`),
		);

		this.server.registerTool(
			"audiencia_passo9",
			{
				description: "Passo 9 (final) da audiencia.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Audiencia - Passo 9 de 9 (FINAL).

${PROTOCOLO_APROFUNDAMENTO_FINAL}`),
		);

		// ============================================================
		// JURI (3 passos)
		// ============================================================

		this.server.registerTool(
			"juri_iniciar",
			{
				description: "Inicia o procedimento de preparacao para sessao do juri. Use quando o usuario precisar preparar defesa ou acusacao em julgamento pelo Tribunal do Juri. Procedimento em 3 passos com elementos de storytelling.",
				inputSchema: {},
			},
			async () => text(`${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: Juri - Passo 1 de 3.

PERGUNTE qual a parte sendo defendida e SOLICITE upload do documento
ou resumo do caso.

ALERTE para verificar se o PDF esta em imagem (geralmente os inqueritos
estao). Se estiver, ORIENTE a converter em PDF selecionavel (OCR) no site
https://www.ilovepdf.com/pt/ocr-pdf

FACA uma analise juridica previa e detalhada do caso.

SUGIRA o modelo de comando:

"No caso em concreto defendo X e quero provar Y. O que posso defender
na sessao do juri?"

Como sua funcao tambem e assessorar na preparacao para defesa na sessao
do juri, utilize ferramentas de STORYTELLING para auxiliar.

Apos apresentar a analise, chame juri_passo2.`),
		);

		this.server.registerTool(
			"juri_passo2",
			{
				description: "Passo 2 do juri. Introducao com storytelling.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Juri - Passo 2 de 3.

SUGIRA o seguinte modelo de comando ao usuario:

"Agora, preciso que utilize elementos de storytelling para fazer uma
introducao a sustentacao oral que sensibilize os jurados XXXXXX
(acrescente uma peculiaridade dos jurados, da situacao e/ou do reu)."

ELABORE a introducao com storytelling, sensibilizando os jurados conforme
as peculiaridades fornecidas.

Apos concluir, chame juri_passo3.`),
		);

		this.server.registerTool(
			"juri_passo3",
			{
				description: "Passo 3 (final) do juri. Conclusao com storytelling.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Juri - Passo 3 de 3 (FINAL).

SUGIRA o seguinte modelo de comando ao usuario:

"Agora, preciso que utilize elementos de storytelling para fazer uma
conclusao a sustentacao oral que sensibilize os jurados XXXXXX
(acrescente uma peculiaridade dos jurados, da situacao e/ou do reu)."

ELABORE a conclusao com elementos de storytelling, em narrativa
envolvente que reforce a tese defensiva.

PERGUNTE ao usuario se deseja aprofundar algum ponto ou refinar a
sustentacao oral. Procedimento concluido.`),
		);

		// ============================================================
		// SUSTENTACAO ORAL E MEMORIAIS (2 passos)
		// ============================================================

		this.server.registerTool(
			"sustentacao_oral_iniciar",
			{
				description: "Inicia o procedimento de elaboracao de sustentacao oral e/ou memoriais. Use quando o usuario precisar preparar sustentacao oral em sessao de julgamento de tribunal ou memoriais para entrega aos julgadores. Procedimento em 2 passos.",
				inputSchema: {},
			},
			async () => text(`${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: Sustentacao Oral e Memoriais - Passo 1 de 2.

Antes de executar, PECA upload do documento ou insercao do texto.

PERGUNTE:
- Qual o tom que deve ser usado na sustentacao oral?
- O usuario quer usar a ferramenta de storytelling?

ELABORE uma sustentacao oral CONVINCENTE conforme as orientacoes.

Apos concluir, chame sustentacao_oral_passo2.`),
		);

		this.server.registerTool(
			"sustentacao_oral_passo2",
			{
				description: "Passo 2 (final) de sustentacao oral. Memoriais.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Sustentacao Oral e Memoriais - Passo 2 de 2 (FINAL).

PERGUNTE se o usuario deseja a producao de MEMORIAIS para entrega no
gabinete (despacho com o relator/julgador).

Se sim, ELABORE memoriais convincentes e MAIS TECNICOS que a sustentacao
oral. Memoriais permitem maior detalhamento juridico e citacao precisa
de dispositivos legais.

Procedimento concluido.`),
		);

		// ============================================================
		// JURISPRUDENCIA (autonoma)
		// ============================================================

		this.server.registerTool(
			"jurisprudencia_pesquisar",
			{
				description: "Realiza pesquisa estruturada de jurisprudencia e sumulas em fontes oficiais. Use quando o usuario pedir pesquisa de jurisprudencia, precedentes, sumulas, decisoes sobre tema especifico.",
				inputSchema: {},
			},
			async () => text(`${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: Pesquisa de Jurisprudencia.

PERGUNTE qual assunto o usuario deseja pesquisar.

AVISE para que o usuario clique no nome superior do robo e altere para
o "modelo" de raciocinio mais profundo (extended thinking).

Apos confirmar o tema, execute o protocolo:

${PROTOCOLO_J7}

Ao final, PERGUNTE se deseja aprofundar algum dos julgados encontrados,
pesquisar tema correlato, ou encerrar.`),
		);

		// ============================================================
		// ANALISE JURIDICA (2 passos)
		// ============================================================

		this.server.registerTool(
			"analise_juridica_iniciar",
			{
				description: "Realiza analise juridica detalhada de caso concreto, seguindo estrutura classica. Use quando o usuario pedir analise juridica, parecer, ou estudo aprofundado de um caso. Procedimento em 2 passos.",
				inputSchema: {},
			},
			async () => text(`${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: Analise Juridica - Passo 1 de 2.

Antes de executar, PECA o upload dos documentos (prefira pecas processuais
separadas) OU resumo gerado no robo de relatorio OU digitacao da duvida.

${PROTOCOLO_ROBO_RELATORIO}

EXECUTE a analise juridica detalhada conforme o protocolo:

${PROTOCOLO_ANALISE_CLASSICA}

Apos apresentar a analise, chame analise_juridica_passo2.`),
		);

		this.server.registerTool(
			"analise_juridica_passo2",
			{
				description: "Passo 2 (final) da analise juridica. Sugestao de proximas pecas.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Analise Juridica - Passo 2 de 2 (FINAL).

PERGUNTE ao usuario se deseja auxilio para elaborar alguma peticao
judicial cabivel ao caso concreto.

Se sim, EXECUTE o procedimento mais adequado conforme o tipo de peca:
- Para peticao inicial: chame peticao_inicial_iniciar
- Para contestacao: chame contestacao_iniciar
- Para replica: chame replica_iniciar
- Para recurso: chame recurso_iniciar
- Para contrarrazoes: chame contrarrazoes_iniciar
- Para alegacoes finais: chame alegacoes_finais_iniciar
- Para outros casos: chame outros_iniciar

Procedimento concluido.`),
		);

		// ============================================================
		// CORRECAO DE TEXTO (4 passos)
		// ============================================================

		this.server.registerTool(
			"correcao_texto_iniciar",
			{
				description: "Realiza correcao gramatical e ortografica de texto juridico, podendo aprimorar para escrita mais juridica e construir linha do tempo se houver muitas datas. Procedimento em 4 passos.",
				inputSchema: {},
			},
			async () => text(`${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: Correcao Gramatical e Ortografica - Passo 1 de 4.

SOLICITE ao usuario o texto a ser corrigido.

Apos receber o texto, chame correcao_texto_passo2.`),
		);

		this.server.registerTool(
			"correcao_texto_passo2",
			{
				description: "Passo 2 da correcao de texto.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Correcao de Texto - Passo 2 de 4.

FACA uma correcao gramatical e ortografica do texto. Seja EXIGENTE.

TRANSCREVA o novo texto completo e EXPLIQUE as alteracoes realizadas.

Se o texto for muito grande, faca por topicos.

Apos concluir, chame correcao_texto_passo3.`),
		);

		this.server.registerTool(
			"correcao_texto_passo3",
			{
				description: "Passo 3 da correcao de texto. Aprimoramento juridico.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Correcao de Texto - Passo 3 de 4.

PERGUNTE se o usuario deseja que o texto seja deixado mais claro e em
uma escrita mais juridica.

Se sim, REALIZE o aprimoramento e EXPLIQUE as alteracoes. Se for muito
grande, faca por topicos.

Apos concluir, chame correcao_texto_passo4.`),
		);

		this.server.registerTool(
			"correcao_texto_passo4",
			{
				description: "Passo 4 (final) da correcao de texto. Linha do tempo.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Correcao de Texto - Passo 4 de 4 (FINAL).

SOMENTE se houver muitas datas no texto, PERGUNTE se o usuario deseja
construir uma LINHA DO TEMPO com os dados apresentados em formato
de tabela.

Alem do formato tradicional, SUGIRA outro formato adequado ao caso
(ex: linha do tempo visual em texto, fluxograma narrativo, etc.).

Procedimento concluido.`),
		);

		// ============================================================
		// EXPLICAR EM LINGUAGEM SIMPLES (2 passos)
		// ============================================================

		this.server.registerTool(
			"explicar_simples_iniciar",
			{
				description: "Elabora mensagem em formato de WhatsApp para explicar resultado de decisao judicial ou andamento processual ao cliente, em linguagem acessivel, empatica e sensivel a vulnerabilidade do assistido. Procedimento em 2 passos.",
				inputSchema: {},
			},
			async () => text(`${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: Explicar em Linguagem Simples - Passo 1 de 2.

Antes de executar, PECA upload das principais pecas processuais
separadamente.

Apos o upload, chame explicar_simples_passo2.`),
		);

		this.server.registerTool(
			"explicar_simples_passo2",
			{
				description: "Passo 2 (final) de explicar simples. Geracao da mensagem.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Explicar em Linguagem Simples - Passo 2 de 2 (FINAL).

PERGUNTE:
- Qual o nome da parte sendo defendida?
- Ainda cabe recurso da parte contraria ou voce vai recorrer?

ELABORE a mensagem em formato de WhatsApp seguindo:

OBJETIVO: explicar o resultado da decisao judicial ou o andamento do
processo, e o que pode acontecer daqui para frente.

LINGUAGEM: acessivel, empatica e sensivel a vulnerabilidade do assistido.

TOM: inclua expressoes regionais e um leve sotaque tipico do Estado de
Pernambuco (ou da localidade do assistido), de forma natural e respeitosa,
como se estivesse falando com alguem da propria comunidade. Sem exageros.

REGRAS OBRIGATORIAS:
- SEM emojis
- SEM travessao (em dash)
- Linguagem direta e humana

Procedimento concluido.`),
		);

		// ============================================================
		// OUTROS (curinga - 4 passos)
		// ============================================================

		this.server.registerTool(
			"outros_iniciar",
			{
				description: "Procedimento curinga para auxilio em demandas juridicas que nao se encaixam nas outras ferramentas (ex: pareceres, contratos, manifestacoes diversas). Use quando o usuario precisar de algo juridico nao coberto pelas demais ferramentas. Procedimento em 4 passos.",
				inputSchema: {},
			},
			async () => text(`${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: Outros (curinga) - Passo 1 de 4.

PERGUNTE em qual problema o usuario precisa de ajuda. Por exemplo:
- Peticao X
- Parecer sobre X
- Analisar contrato de XX
- Manifestacao
- Outro

INFORME que este procedimento serve para auxiliar quando a necessidade
nao se encaixa nas demais ferramentas disponibilizadas.

SUGIRA o modelo de comando:

"Preciso fazer XXXXXXXXXXXX. Como voce pode me ajudar?"

Apos a resposta, chame outros_passo2.`),
		);

		this.server.registerTool(
			"outros_passo2",
			{
				description: "Passo 2 do procedimento outros.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Outros - Passo 2 de 4.

SOLICITE que o usuario responda o maximo de perguntas geradas por voce.

No final, INDIQUE estrategias para o exito do problema e ja SUGIRA
outras acoes correlatas que podem ser uteis.

Apos as respostas, chame outros_passo3.`),
		);

		this.server.registerTool(
			"outros_passo3",
			{
				description: "Passo 3 do procedimento outros. Elaboracao da peca.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Outros - Passo 3 de 4.

ELABORE a solicitacao pedida.
- Faca em partes.
- Obedeca aos requisitos formais aplicaveis.
- NAO use a lousa.

Apos concluir, chame outros_passo4.`),
		);

		this.server.registerTool(
			"outros_passo4",
			{
				description: "Passo 4 (final) do procedimento outros. Aprofundamento.",
				inputSchema: {},
			},
			async () => text(`PROCEDIMENTO: Outros - Passo 4 de 4 (FINAL).

${PROTOCOLO_DESENVOLVIMENTO_APROFUNDADO}

Tambem TRANSCREVA os artigos mencionados citando a fonte do site do Planalto.

Procedimento concluido.`),
		);

	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
