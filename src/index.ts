import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

// ============================================================
// LISTA DE TOKENS AUTORIZADOS
// ============================================================
// Para adicionar novo aluno: adicione uma linha aqui com identificador unico.
// Para revogar acesso: comente a linha (//) ou apague.
// Apos qualquer alteracao, salve o arquivo (commit) que a Cloudflare
// faz redeploy automatico em 1-2 minutos.
// IMPORTANTE: o token vai aparecer na URL que voce envia ao aluno.
// Por isso, mantenha tokens longos e dificeis de adivinhar.
// Para revogar acesso, comente a linha (//) ou apague.
// Apos qualquer alteracao, faca commit e a Cloudflare faz redeploy automatico.

const TOKENS_AUTORIZADOS: Record<string, string> = {
	// Token administrativo (voce mesmo)
	"adm_joao_2026_xK9pL2mNqR8sT4vZ": "Joao - acesso administrativo",
	// Tokens para escritorios (compartilhaveis entre advogados do mesmo escritorio)
	"esc_001_2026_aB7cD3eF9gH2iJ5k": "Escritorio 1 - validade 12/2026",
	"esc_002_2026_bC8dE4fG0hI3jK6l": "Escritorio 2 - validade 12/2026",
	"esc_003_2026_cD9eF5gH1iJ4kL7m": "Escritorio 3 - validade 12/2026",
	"esc_004_2026_dE0fG6hI2jK5lM8n": "Escritorio 4 - validade 12/2026",
	"esc_005_2026_eF1gH7iJ3kL6mN9o": "Escritorio 5 - validade 12/2026",
	// Tokens para alunos individuais do curso
	"alu_001_2026_fG2hI8jK4lM7nO0p": "Aluno 1 - curso turma 2026 - validade 06/2027",
	"alu_002_2026_gH3iJ9kL5mN8oP1q": "Aluno 2 - curso turma 2026 - validade 06/2027",
	"alu_003_2026_hI4jK0lM6nO9pQ2r": "Aluno 3 - curso turma 2026 - validade 06/2027",
	"alu_004_2026_iJ5kL1mN7oP0qR3s": "Aluno 4 - curso turma 2026 - validade 06/2027",
};

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
- Cite jurisprudencia somente apos pesquisa na internet, com link da fonte para verificacao
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
5. SITE: jusbrasil.com.br (apenas se os anteriores nao retornarem resultados suficientes)

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

1. DADOS DO PROCESSO: Tribunal, Tipo de Recurso ou Acao, Numero do Processo, Relator.
2. FATOS: Breve narrativa dos fatos relevantes, partes envolvidas e natureza do litigio.
3. PROBLEMA JURIDICO: Questao Central e Pontos Controvertidos.
4. DIREITO APLICAVEL: Enumere artigos da Constituicao, leis complementares, leis ordinarias, decretos. PESQUISE no site https://www.lexml.gov.br/ e cite os artigos com transcricao, leis e jurisprudencia relevantes, com link para verificacao.
5. ANALISE E APLICACAO: Argumentos e Provas das Partes; Aplicacao da Norma com analise critica.
6. CONCLUSAO: Resumo da analise, aplicacao da legislacao e jurisprudencia, conclusao sobre a legalidade. Resumo de precedentes (PESQUISE na internet).

LINGUAGEM: tecnica e especializada, vocabulario juridico avancado, precisao e clareza.
`;

const PROTOCOLO_APROFUNDAMENTO_FINAL = `
PROTOCOLO DE APROFUNDAMENTO FINAL:
PERGUNTE ao usuario:
- Voce deseja aprofundar algum ponto especifico?
- Quer acrescentar algo?

Se SIM, PERGUNTE qual ponto e desenvolva conforme solicitado.
Se NAO, peca para o usuario responder explicitamente que nao deseja aprofundamentos adicionais.
Procedimento concluido.
`;

const PROTOCOLO_ROBO_RELATORIO = `
SUGESTAO DE ROBO AUXILIAR:
Para gerar um relatorio detalhado do processo de forma estruturada,
sugira ao usuario o uso do robo de relatorio:
https://chatgpt.com/g/g-xXpAwSUrl-relatorio-do-assessor-juridico

Esse robo auxilia na consolidacao das pecas processuais em um relatorio
unico que pode ser colado como contexto.
`;

// ============================================================
// HELPERS
// ============================================================

const text = (s: string) => ({ content: [{ type: "text" as const, text: s }] });

function logUso(token: string, ferramenta: string, etapa: string) {
	const identificador = TOKENS_AUTORIZADOS[token] || "DESCONHECIDO";
	console.log(`[USO] token=${token.substring(0, 20)}... | usuario="${identificador}" | tool=${ferramenta} | etapa=${etapa} | ts=${new Date().toISOString()}`);
}

function tokenValido(token: string | undefined): boolean {
	if (!token) return false;
	return token in TOKENS_AUTORIZADOS;
}

// ============================================================
// MCP AGENT
// ============================================================

export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Inteligencia Artificial para Escritorios de Advocacia",
		version: "2.0.0",
	});

	async init() {

		// ============================================================
		// MENU INICIAL
		// ============================================================
		this.server.registerTool(
			"menu_inicial",
			{
				description: "Apresenta o menu de procedimentos disponiveis no assessor juridico. Use sempre que o usuario disser 'menu', 'ajuda', 'ola', 'comandos disponiveis', 'o que voce faz', ou similar.",
				inputSchema: {},
			},
			async () => text(`Bem-vindo ao Assessor Juridico no Claude.

PROCEDIMENTOS DISPONIVEIS (digite o que precisa em linguagem natural):

1. PETICAO INICIAL (6 etapas): "preciso fazer uma peticao inicial"
2. CONTESTACAO (6 etapas): "preciso fazer uma contestacao"
3. REPLICA (6 etapas): "preciso fazer uma replica"
4. RECURSO (7 etapas): "preciso fazer um recurso"
5. CONTRARRAZOES (7 etapas): "preciso de contrarrazoes ao recurso"
6. ALEGACOES FINAIS (7 etapas): "preciso de alegacoes finais"
7. AUDIENCIA (9 etapas): "preciso me preparar para audiencia"
8. JURI (3 etapas): "vou ao tribunal do juri"
9. SUSTENTACAO ORAL (2 etapas): "preciso de sustentacao oral"
10. JURISPRUDENCIA: "pesquise jurisprudencia sobre [tema]"
11. ANALISE JURIDICA (2 etapas): "faca analise juridica deste caso"
12. CORRECAO DE TEXTO (4 etapas): "corrija este texto"
13. EXPLICAR EM LINGUAGEM SIMPLES (2 etapas): "explique para meu cliente"
14. OUTROS (4 etapas): "preciso fazer [descreva]"

ATALHOS COM HASHTAG (alternativa para uso rapido):
#peticaoinicial #contestacao #replica #recurso #contrarrazoes
#alegacoesfinais #audiencia #juri #sustentacaooral #jurisprudencia
#analisejuridica #correcaotexto #linguagemsimples #outros

Para iniciar, basta escrever sua necessidade. O assistente reconhece e inicia o procedimento.
`),
		);

		// ============================================================
		// PETICAO INICIAL
		// ============================================================
		this.server.registerTool(
			"peticao_inicial",
			{
				description: "Procedimento de elaboracao de peticao inicial para iniciar acao judicial. Use quando o usuario quiser fazer peticao inicial, propor acao, iniciar demanda. 6 etapas. Comece sempre com etapa='1_inicio'.",
				inputSchema: {
					etapa: z.enum([
						"1_inicio",
						"2_perguntas_documentos",
						"3_elaboracao",
						"4_aprofundamento",
						"5_jurisprudencia",
						"6_finalizar"
					]).describe("Etapa do procedimento. Comece com '1_inicio' e avance sequencialmente."),
				},
			},
			async ({ etapa }) => {
				const conteudos: Record<string, string> = {
					"1_inicio": `${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: PETICAO INICIAL - Etapa 1 de 6 (inicio).
ESTADO: voce esta na primeira etapa do procedimento de peticao inicial.
Avise ao usuario que sao 6 etapas para finalizar o procedimento.
NAO ative a lousa, exceto se solicitado.

PERGUNTE:
- Qual o ramo do direito envolvido?
- Qual tipo de acao (incluindo se ha pedido de antecipacao de tutela)?
- Qual a motivacao da acao?

Sugira o modelo de comando:
"Preciso entrar com uma acao que envolve direito XXXXX. Uma acao de XXXX com pedido de XXXX de uma cliente XXXX contra XXXXX em razao XXXXXXXX. Pode me ajudar, sobretudo indicando quais perguntas e provas meu cliente deve responder e orientacoes juridicas que devo realizar?"

PROXIMA ACAO: apos a resposta do usuario, chame peticao_inicial com etapa='2_perguntas_documentos'.`,

					"2_perguntas_documentos": `PROCEDIMENTO: PETICAO INICIAL - Etapa 2 de 6 (perguntas e documentos).

SOLICITE que o usuario responda o maximo de perguntas geradas por voce na etapa anterior.
No final, ORIENTE sobre quais documentos o cliente deve apresentar e indique estrategias para o exito da acao.

PROXIMA ACAO: apos receber as respostas, chame peticao_inicial com etapa='3_elaboracao'.`,

					"3_elaboracao": `PROCEDIMENTO: PETICAO INICIAL - Etapa 3 de 6 (elaboracao).

ELABORE a peticao inicial:
- Faca em partes e obedeca aos requisitos formais.
- NAO use a lousa.
- No cabecalho, enderece a acao ao "JUIZO DE DIREITO XXX" em vez de "EXCELENTISSIMO SENHOR DOUTOR JUIZ DE DIREITO".

${PROTOCOLO_PERSONA_JURIDICA}

PROXIMA ACAO: apos elaborar, chame peticao_inicial com etapa='4_aprofundamento'.`,

					"4_aprofundamento": `PROCEDIMENTO: PETICAO INICIAL - Etapa 4 de 6 (aprofundamento).

${PROTOCOLO_DESENVOLVIMENTO_APROFUNDADO}

IMPORTANTE: nesta etapa NAO cite jurisprudencia nem doutrina ainda.
Apenas transcreva os artigos mencionados citando a fonte do site do Planalto.

PROXIMA ACAO: apos concluir, chame peticao_inicial com etapa='5_jurisprudencia'.`,

					"5_jurisprudencia": `PROCEDIMENTO: PETICAO INICIAL - Etapa 5 de 6 (jurisprudencia).

PERGUNTE ao usuario se deseja continuar para a pesquisa de JURISPRUDENCIA.
Se sim, prossiga. Se nao, va direto para a etapa 6.

${PROTOCOLO_J7}

PROXIMA ACAO: apos a pesquisa, chame peticao_inicial com etapa='6_finalizar'.`,

					"6_finalizar": `PROCEDIMENTO: PETICAO INICIAL - Etapa 6 de 6 (FINAL).

${PROTOCOLO_APROFUNDAMENTO_FINAL}`,
				};
				return text(conteudos[etapa]);
			},
		);

		// ============================================================
		// CONTESTACAO
		// ============================================================
		this.server.registerTool(
			"contestacao",
			{
				description: "Procedimento de elaboracao de contestacao para defender em acao civel. Use quando o usuario quiser contestar, fazer defesa, responder peticao inicial. 6 etapas. Comece com etapa='1_inicio'.",
				inputSchema: {
					etapa: z.enum([
						"1_inicio",
						"2_analise",
						"3_elaboracao",
						"4_aprofundamento",
						"5_jurisprudencia",
						"6_finalizar"
					]).describe("Etapa do procedimento. Comece com '1_inicio' e avance sequencialmente."),
				},
			},
			async ({ etapa }) => {
				const conteudos: Record<string, string> = {
					"1_inicio": `${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: CONTESTACAO - Etapa 1 de 6 (inicio).
ESTADO: voce esta iniciando o procedimento de contestacao.
Avise que sao 6 etapas. NAO ative a lousa.

SOLICITE upload da peticao inicial da parte autora e eventuais decisoes ja proferidas.
NAO antecipe etapas seguintes.

PROXIMA ACAO: apos o upload, chame contestacao com etapa='2_analise'.`,

					"2_analise": `PROCEDIMENTO: CONTESTACAO - Etapa 2 de 6 (analise juridica).

FACA uma analise juridica detalhada do caso anexado para preparar a contestacao.

${PROTOCOLO_ANALISE_CLASSICA}

Ao final, INDIQUE:
- Perguntas que o cliente deve responder.
- Provas e documentos que podem ser produzidos.
- Legislacao especifica aplicavel.
- Possiveis versoes dos fatos.

PROXIMA ACAO: chame contestacao com etapa='3_elaboracao'.`,

					"3_elaboracao": `PROCEDIMENTO: CONTESTACAO - Etapa 3 de 6 (elaboracao).

SUGIRA o modelo de comando, ja preenchendo com o contexto:
"Preciso que voce faca a contestacao em favor da parte re XXXX em razao da peticao inicial proposta por XXXXXX. Preciso que na contestacao desenvolva todas as PRELIMINARES cabiveis. Conteste todos os fatos e argumentos juridicos da peticao inicial, especialmente os pontos XXXXXX, isso porque XXXXXX. Utilize tambem argumentos em anexo. Faca em partes."

Apos o usuario fornecer o comando, ELABORE a contestacao em partes.

PROXIMA ACAO: chame contestacao com etapa='4_aprofundamento'.`,

					"4_aprofundamento": `PROCEDIMENTO: CONTESTACAO - Etapa 4 de 6 (aprofundamento).

${PROTOCOLO_DESENVOLVIMENTO_APROFUNDADO}

Tambem TRANSCREVA os artigos mencionados citando a fonte do site do Planalto.

PROXIMA ACAO: chame contestacao com etapa='5_jurisprudencia'.`,

					"5_jurisprudencia": `PROCEDIMENTO: CONTESTACAO - Etapa 5 de 6 (jurisprudencia).

PERGUNTE se deseja continuar para a pesquisa de JURISPRUDENCIA.

${PROTOCOLO_J7}

PROXIMA ACAO: chame contestacao com etapa='6_finalizar'.`,

					"6_finalizar": `PROCEDIMENTO: CONTESTACAO - Etapa 6 de 6 (FINAL).

${PROTOCOLO_APROFUNDAMENTO_FINAL}`,
				};
				return text(conteudos[etapa]);
			},
		);

		// ============================================================
		// REPLICA
		// ============================================================
		this.server.registerTool(
			"replica",
			{
				description: "Procedimento de elaboracao de replica para rebater contestacao em processo civel. Use quando o usuario quiser fazer replica, rebater defesa adversa. 6 etapas. Comece com etapa='1_inicio'.",
				inputSchema: {
					etapa: z.enum([
						"1_inicio",
						"2_analise",
						"3_elaboracao",
						"4_aprofundamento",
						"5_jurisprudencia",
						"6_finalizar"
					]).describe("Etapa do procedimento."),
				},
			},
			async ({ etapa }) => {
				const conteudos: Record<string, string> = {
					"1_inicio": `${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: REPLICA - Etapa 1 de 6 (inicio).
Avise que sao 6 etapas. NAO ative a lousa.

SOLICITE upload da peticao inicial, eventuais decisoes e contestacao da parte re.

PROXIMA ACAO: apos o upload, chame replica com etapa='2_analise'.`,

					"2_analise": `PROCEDIMENTO: REPLICA - Etapa 2 de 6 (analise).

FACA uma analise juridica detalhada do caso, com objetivo de preparar replica para rebater os argumentos da contestacao e manter os argumentos da peticao inicial.

${PROTOCOLO_ANALISE_CLASSICA}

PROXIMA ACAO: chame replica com etapa='3_elaboracao'.`,

					"3_elaboracao": `PROCEDIMENTO: REPLICA - Etapa 3 de 6 (elaboracao).

SUGIRA o modelo de comando:
"Preciso que voce faca a replica em favor da parte autora XXXX em razao da contestacao proposta por XXXXXX. Preciso que na replica rebata os argumentos da contestacao que se contrapoem aos argumentos da peticao inicial, especialmente os pontos XXXXXX, isso porque XXXXXX. Utilize tambem argumentos da peticao inicial em anexo."

ELABORE a replica.

PROXIMA ACAO: chame replica com etapa='4_aprofundamento'.`,

					"4_aprofundamento": `PROCEDIMENTO: REPLICA - Etapa 4 de 6 (aprofundamento).

${PROTOCOLO_DESENVOLVIMENTO_APROFUNDADO}

Tambem TRANSCREVA os artigos mencionados citando a fonte do site do Planalto.

PROXIMA ACAO: chame replica com etapa='5_jurisprudencia'.`,

					"5_jurisprudencia": `PROCEDIMENTO: REPLICA - Etapa 5 de 6 (jurisprudencia).

PERGUNTE se deseja continuar para a pesquisa de JURISPRUDENCIA.

${PROTOCOLO_J7}

PROXIMA ACAO: chame replica com etapa='6_finalizar'.`,

					"6_finalizar": `PROCEDIMENTO: REPLICA - Etapa 6 de 6 (FINAL).

${PROTOCOLO_APROFUNDAMENTO_FINAL}`,
				};
				return text(conteudos[etapa]);
			},
		);

		// ============================================================
		// RECURSO
		// ============================================================
		this.server.registerTool(
			"recurso",
			{
				description: "Procedimento de elaboracao de recurso (apelacao, agravo, recurso especial, extraordinario, etc.). Use quando o usuario quiser recorrer de decisao judicial. 7 etapas. Comece com etapa='1_inicio'.",
				inputSchema: {
					etapa: z.enum([
						"1_inicio",
						"2_analise",
						"3_definicao",
						"4_elaboracao",
						"5_aprofundamento",
						"6_jurisprudencia",
						"7_finalizar"
					]).describe("Etapa do procedimento."),
				},
			},
			async ({ etapa }) => {
				const conteudos: Record<string, string> = {
					"1_inicio": `${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: RECURSO - Etapa 1 de 7 (inicio).
Avise que sao 7 etapas. Use a lousa SOMENTE quando solicitado.

PECA upload das principais pecas processuais separadamente OU insercao do relatorio do processo (PREFIRA essa opcao).

${PROTOCOLO_ROBO_RELATORIO}

PROXIMA ACAO: apos o upload, chame recurso com etapa='2_analise'.`,

					"2_analise": `PROCEDIMENTO: RECURSO - Etapa 2 de 7 (analise juridica).

PERGUNTE o nome da parte que esta sendo defendida.

FACA analise juridica detalhada do caso para preparar o recurso.

${PROTOCOLO_ANALISE_CLASSICA}

AVISE para que o usuario altere para o "modelo" de raciocinio mais profundo (extended thinking).

PROXIMA ACAO: chame recurso com etapa='3_definicao'.`,

					"3_definicao": `PROCEDIMENTO: RECURSO - Etapa 3 de 7 (definicao do recurso).

PERGUNTE:
- Qual recurso o usuario deseja realizar?
- Em favor de qual parte?
- Contra qual decisao?
- Sob quais fundamentos?

SUGIRA o modelo de comando:
"Preciso que faca o recurso X da parte Y contra a decisao Z, no sentido de X, pelos seguintes fundamentos: XXX."

SUGIRA upload de documentos uteis para reaproveitar argumentos.

ATENCAO ESPECIAL: se o recurso for contra SENTENCA PENAL CONDENATORIA com erro na DOSIMETRIA da pena, procure potenciais erros em cada fase da dosimetria e no rol das penas. Individualize a dosimetria para cada reu, se houver mais de um.

PROXIMA ACAO: chame recurso com etapa='4_elaboracao'.`,

					"4_elaboracao": `PROCEDIMENTO: RECURSO - Etapa 4 de 7 (elaboracao).

ELABORE o recurso proposto.

Insira topicos com REQUISITOS EXTRINSECOS:
- Tempestividade
- Cabimento
- Legitimidade
- Interesse recursal
- Preparo (quando aplicavel) ou justificativa de gratuidade
- Regularidade formal

Escreva em partes para deixar o texto longo e profundo.

PROXIMA ACAO: chame recurso com etapa='5_aprofundamento'.`,

					"5_aprofundamento": `PROCEDIMENTO: RECURSO - Etapa 5 de 7 (aprofundamento).

${PROTOCOLO_DESENVOLVIMENTO_APROFUNDADO}

Tambem TRANSCREVA os artigos mencionados citando a fonte do site do Planalto.

PROXIMA ACAO: chame recurso com etapa='6_jurisprudencia'.`,

					"6_jurisprudencia": `PROCEDIMENTO: RECURSO - Etapa 6 de 7 (jurisprudencia).

PERGUNTE se deseja continuar para a pesquisa de JURISPRUDENCIA.

${PROTOCOLO_J7}

PROXIMA ACAO: chame recurso com etapa='7_finalizar'.`,

					"7_finalizar": `PROCEDIMENTO: RECURSO - Etapa 7 de 7 (FINAL).

${PROTOCOLO_APROFUNDAMENTO_FINAL}`,
				};
				return text(conteudos[etapa]);
			},
		);

		// ============================================================
		// CONTRARRAZOES
		// ============================================================
		this.server.registerTool(
			"contrarrazoes",
			{
				description: "Procedimento de elaboracao de contrarrazoes ao recurso da parte adversa. Use quando o usuario quiser responder a recurso. 7 etapas. Comece com etapa='1_inicio'.",
				inputSchema: {
					etapa: z.enum([
						"1_inicio",
						"2_analise",
						"3_definicao",
						"4_elaboracao",
						"5_aprofundamento",
						"6_jurisprudencia",
						"7_finalizar"
					]).describe("Etapa do procedimento."),
				},
			},
			async ({ etapa }) => {
				const conteudos: Record<string, string> = {
					"1_inicio": `${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: CONTRARRAZOES - Etapa 1 de 7 (inicio).
Avise que sao 7 etapas. Use a lousa SOMENTE quando solicitado.

PECA upload das principais pecas processuais separadamente OU insercao do relatorio do processo (PREFIRA essa opcao).

${PROTOCOLO_ROBO_RELATORIO}

PROXIMA ACAO: apos o upload, chame contrarrazoes com etapa='2_analise'.`,

					"2_analise": `PROCEDIMENTO: CONTRARRAZOES - Etapa 2 de 7 (analise).

PERGUNTE o nome da parte que esta sendo defendida.

FACA analise juridica detalhada do caso para preparar as contrarrazoes.

${PROTOCOLO_ANALISE_CLASSICA}

AVISE para que o usuario altere para o "modelo" de raciocinio mais profundo (extended thinking).

PROXIMA ACAO: chame contrarrazoes com etapa='3_definicao'.`,

					"3_definicao": `PROCEDIMENTO: CONTRARRAZOES - Etapa 3 de 7 (definicao).

PERGUNTE:
- Contra qual recurso?
- Em favor de qual parte?
- Sob quais fundamentos?

SUGIRA o modelo de comando:
"Preciso que faca contrarrazoes em favor da parte XX contra o recurso X da parte Y, no sentido de manter a decisao pelos seus proprios fundamentos (ou pelos seguintes fundamentos: XXX)."

SUGIRA upload de documentos uteis.

PROXIMA ACAO: chame contrarrazoes com etapa='4_elaboracao'.`,

					"4_elaboracao": `PROCEDIMENTO: CONTRARRAZOES - Etapa 4 de 7 (elaboracao).

ELABORE as contrarrazoes contra o recurso proposto.

INSIRA um topico generico de TEMPESTIVIDADE e demais requisitos extrinsecos quando aplicavel.

Escreva em partes para deixar o texto longo e profundo.

PROXIMA ACAO: chame contrarrazoes com etapa='5_aprofundamento'.`,

					"5_aprofundamento": `PROCEDIMENTO: CONTRARRAZOES - Etapa 5 de 7 (aprofundamento).

${PROTOCOLO_DESENVOLVIMENTO_APROFUNDADO}

Tambem TRANSCREVA os artigos mencionados citando a fonte do site do Planalto.

PROXIMA ACAO: chame contrarrazoes com etapa='6_jurisprudencia'.`,

					"6_jurisprudencia": `PROCEDIMENTO: CONTRARRAZOES - Etapa 6 de 7 (jurisprudencia).

PERGUNTE se deseja continuar para a pesquisa de JURISPRUDENCIA.

${PROTOCOLO_J7}

PROXIMA ACAO: chame contrarrazoes com etapa='7_finalizar'.`,

					"7_finalizar": `PROCEDIMENTO: CONTRARRAZOES - Etapa 7 de 7 (FINAL).

${PROTOCOLO_APROFUNDAMENTO_FINAL}`,
				};
				return text(conteudos[etapa]);
			},
		);

		// ============================================================
		// ALEGACOES FINAIS
		// ============================================================
		this.server.registerTool(
			"alegacoes_finais",
			{
				description: "Procedimento de elaboracao de alegacoes finais apos instrucao processual. Use quando o usuario quiser fazer alegacoes finais. 7 etapas. Comece com etapa='1_inicio'.",
				inputSchema: {
					etapa: z.enum([
						"1_inicio",
						"2_identificacao",
						"3_analise",
						"4_elaboracao",
						"5_aprofundamento",
						"6_jurisprudencia",
						"7_finalizar"
					]).describe("Etapa do procedimento."),
				},
			},
			async ({ etapa }) => {
				const conteudos: Record<string, string> = {
					"1_inicio": `${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: ALEGACOES FINAIS - Etapa 1 de 7 (inicio).
Avise que sao 7 etapas. NAO ative a lousa.

PECA upload das principais pecas processuais separadamente OU insercao do relatorio do processo.

${PROTOCOLO_ROBO_RELATORIO}

PROXIMA ACAO: apos o upload, chame alegacoes_finais com etapa='2_identificacao'.`,

					"2_identificacao": `PROCEDIMENTO: ALEGACOES FINAIS - Etapa 2 de 7 (identificacao).

PERGUNTE o nome da parte sendo defendida e se ha algum fato relevante para destacar (ex: depoimento em audiencia no sentido X).

PROXIMA ACAO: chame alegacoes_finais com etapa='3_analise'.`,

					"3_analise": `PROCEDIMENTO: ALEGACOES FINAIS - Etapa 3 de 7 (analise).

FACA analise juridica detalhada do caso para preparar as alegacoes finais.

${PROTOCOLO_ANALISE_CLASSICA}

PROXIMA ACAO: chame alegacoes_finais com etapa='4_elaboracao'.`,

					"4_elaboracao": `PROCEDIMENTO: ALEGACOES FINAIS - Etapa 4 de 7 (elaboracao).

SUGIRA o modelo de comando:
"Preciso que voce faca as ALEGACOES FINAIS em favor da parte XXXX, requerendo XXXX, ressaltando os seguintes fundamentos XXXXX. Preciso que as alegacoes finais contestem todos os possiveis fatos e argumentos juridicos da parte contraria, especialmente os pontos XXXXXX, isso porque XXXXXX. Utilize tambem argumentos do arquivo em anexo. Faca em partes."

ELABORE as alegacoes finais em partes.

PROXIMA ACAO: chame alegacoes_finais com etapa='5_aprofundamento'.`,

					"5_aprofundamento": `PROCEDIMENTO: ALEGACOES FINAIS - Etapa 5 de 7 (aprofundamento).

${PROTOCOLO_DESENVOLVIMENTO_APROFUNDADO}

Tambem TRANSCREVA os artigos mencionados citando a fonte do site do Planalto.

PROXIMA ACAO: chame alegacoes_finais com etapa='6_jurisprudencia'.`,

					"6_jurisprudencia": `PROCEDIMENTO: ALEGACOES FINAIS - Etapa 6 de 7 (jurisprudencia).

PERGUNTE se deseja continuar para a pesquisa de JURISPRUDENCIA.

${PROTOCOLO_J7}

PROXIMA ACAO: chame alegacoes_finais com etapa='7_finalizar'.`,

					"7_finalizar": `PROCEDIMENTO: ALEGACOES FINAIS - Etapa 7 de 7 (FINAL).

${PROTOCOLO_APROFUNDAMENTO_FINAL}`,
				};
				return text(conteudos[etapa]);
			},
		);

		// ============================================================
		// AUDIENCIA
		// ============================================================
		this.server.registerTool(
			"audiencia",
			{
				description: "Procedimento de preparacao para audiencia (instrucao, conciliacao, una) com perguntas para testemunhas. Use quando o usuario quiser se preparar para audiencia. 9 etapas. Comece com etapa='1_inicio'.",
				inputSchema: {
					etapa: z.enum([
						"1_inicio",
						"2_identificacao",
						"3_analise",
						"4_preparacao",
						"5_pos_audiencia",
						"6_alegacoes",
						"7_aprofundamento",
						"8_jurisprudencia",
						"9_finalizar"
					]).describe("Etapa do procedimento."),
				},
			},
			async ({ etapa }) => {
				const conteudos: Record<string, string> = {
					"1_inicio": `${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: AUDIENCIA - Etapa 1 de 9 (inicio).
Avise que sao 9 etapas. NAO ative a lousa.

PECA upload das principais pecas processuais separadamente OU insercao do relatorio do processo.

${PROTOCOLO_ROBO_RELATORIO}

PROXIMA ACAO: apos o upload, chame audiencia com etapa='2_identificacao'.`,

					"2_identificacao": `PROCEDIMENTO: AUDIENCIA - Etapa 2 de 9 (identificacao).

PERGUNTE o nome da parte sendo defendida e se ha algum fato relevante para destacar.

PROXIMA ACAO: chame audiencia com etapa='3_analise'.`,

					"3_analise": `PROCEDIMENTO: AUDIENCIA - Etapa 3 de 9 (analise).

FACA analise juridica detalhada do caso, com objetivo de preparar para AUDIENCIA.

${PROTOCOLO_ANALISE_CLASSICA}

Faca perguntas que possam comprovar a tese defensiva e encontrar contradicoes nas acusacoes.

PROXIMA ACAO: chame audiencia com etapa='4_preparacao'.`,

					"4_preparacao": `PROCEDIMENTO: AUDIENCIA - Etapa 4 de 9 (preparacao).

SUGIRA o modelo de comando:
"Vou participar de uma audiencia de XXXX e preciso defender/acusar XXXXXXXXX. Preciso que voce me prepare para a AUDIENCIA, pode me ajudar? Ao final, pode detalhar as perguntas que devo fazer a cada testemunha?"

ELABORE a preparacao com perguntas detalhadas para cada testemunha.

PROXIMA ACAO: chame audiencia com etapa='5_pos_audiencia'.`,

					"5_pos_audiencia": `PROCEDIMENTO: AUDIENCIA - Etapa 5 de 9 (pos-audiencia).

APOS a audiencia ter ocorrido, SOLICITE:
- Resumo do depoimento de cada testemunha.
- Se for o caso, alegacoes finais da parte contraria.

PROXIMA ACAO: chame audiencia com etapa='6_alegacoes'.`,

					"6_alegacoes": `PROCEDIMENTO: AUDIENCIA - Etapa 6 de 9 (alegacoes finais).

SUGIRA o modelo de comando:
"Preciso que voce faca as ALEGACOES FINAIS em favor da parte XXXX, requerendo XXXX, ressaltando os seguintes fundamentos XXXXX. Preciso que as alegacoes finais contestem todos os possiveis fatos e argumentos juridicos da parte contraria, especialmente os pontos XXXXXX, isso porque XXXXXX. Utilize tambem argumentos do arquivo em anexo. Faca em partes."

ELABORE as alegacoes finais em partes.

PROXIMA ACAO: chame audiencia com etapa='7_aprofundamento'.`,

					"7_aprofundamento": `PROCEDIMENTO: AUDIENCIA - Etapa 7 de 9 (aprofundamento).

${PROTOCOLO_DESENVOLVIMENTO_APROFUNDADO}

Tambem TRANSCREVA os artigos mencionados citando a fonte do site do Planalto.

PROXIMA ACAO: chame audiencia com etapa='8_jurisprudencia'.`,

					"8_jurisprudencia": `PROCEDIMENTO: AUDIENCIA - Etapa 8 de 9 (jurisprudencia).

PERGUNTE se deseja continuar para a pesquisa de JURISPRUDENCIA.

${PROTOCOLO_J7}

PROXIMA ACAO: chame audiencia com etapa='9_finalizar'.`,

					"9_finalizar": `PROCEDIMENTO: AUDIENCIA - Etapa 9 de 9 (FINAL).

${PROTOCOLO_APROFUNDAMENTO_FINAL}`,
				};
				return text(conteudos[etapa]);
			},
		);

		// ============================================================
		// JURI
		// ============================================================
		this.server.registerTool(
			"juri",
			{
				description: "Procedimento de preparacao para sessao do Tribunal do Juri com elementos de storytelling. Use quando o usuario quiser preparar defesa ou acusacao no juri. 3 etapas. Comece com etapa='1_inicio'.",
				inputSchema: {
					etapa: z.enum([
						"1_inicio",
						"2_introducao_storytelling",
						"3_conclusao_storytelling"
					]).describe("Etapa do procedimento."),
				},
			},
			async ({ etapa }) => {
				const conteudos: Record<string, string> = {
					"1_inicio": `${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: JURI - Etapa 1 de 3 (inicio).

PERGUNTE qual a parte sendo defendida e SOLICITE upload do documento ou resumo do caso.

ALERTE para verificar se o PDF esta em imagem (geralmente os inqueritos estao). Se estiver, ORIENTE a converter em PDF selecionavel (OCR) no site https://www.ilovepdf.com/pt/ocr-pdf

FACA analise juridica previa e detalhada do caso.

SUGIRA o modelo de comando:
"No caso em concreto defendo X e quero provar Y. O que posso defender na sessao do juri?"

Utilize ferramentas de STORYTELLING para auxiliar.

PROXIMA ACAO: chame juri com etapa='2_introducao_storytelling'.`,

					"2_introducao_storytelling": `PROCEDIMENTO: JURI - Etapa 2 de 3 (introducao com storytelling).

SUGIRA o modelo de comando:
"Agora, preciso que utilize elementos de storytelling para fazer uma introducao a sustentacao oral que sensibilize os jurados XXXXXX (acrescente uma peculiaridade dos jurados, da situacao e/ou do reu)."

ELABORE a introducao com storytelling, sensibilizando os jurados conforme as peculiaridades fornecidas.

PROXIMA ACAO: chame juri com etapa='3_conclusao_storytelling'.`,

					"3_conclusao_storytelling": `PROCEDIMENTO: JURI - Etapa 3 de 3 (FINAL - conclusao com storytelling).

SUGIRA o modelo de comando:
"Agora, preciso que utilize elementos de storytelling para fazer uma conclusao a sustentacao oral que sensibilize os jurados XXXXXX (acrescente uma peculiaridade dos jurados, da situacao e/ou do reu)."

ELABORE a conclusao com elementos de storytelling, em narrativa envolvente que reforce a tese defensiva.

PERGUNTE ao usuario se deseja aprofundar algum ponto. Procedimento concluido.`,
				};
				return text(conteudos[etapa]);
			},
		);

		// ============================================================
		// SUSTENTACAO ORAL E MEMORIAIS
		// ============================================================
		this.server.registerTool(
			"sustentacao_oral",
			{
				description: "Procedimento de elaboracao de sustentacao oral em sessao de tribunal e/ou memoriais para entrega aos julgadores. Use quando o usuario quiser preparar sustentacao oral ou memoriais. 2 etapas. Comece com etapa='1_sustentacao'.",
				inputSchema: {
					etapa: z.enum([
						"1_sustentacao",
						"2_memoriais"
					]).describe("Etapa do procedimento."),
				},
			},
			async ({ etapa }) => {
				const conteudos: Record<string, string> = {
					"1_sustentacao": `${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: SUSTENTACAO ORAL - Etapa 1 de 2.

PECA upload do documento ou insercao do texto.

PERGUNTE:
- Qual o tom que deve ser usado na sustentacao oral?
- O usuario quer usar a ferramenta de storytelling?

ELABORE uma sustentacao oral CONVINCENTE conforme as orientacoes.

PROXIMA ACAO: chame sustentacao_oral com etapa='2_memoriais'.`,

					"2_memoriais": `PROCEDIMENTO: SUSTENTACAO ORAL - Etapa 2 de 2 (FINAL - memoriais).

PERGUNTE se o usuario deseja a producao de MEMORIAIS para entrega no gabinete.

Se sim, ELABORE memoriais convincentes e MAIS TECNICOS que a sustentacao oral. Memoriais permitem maior detalhamento juridico e citacao precisa de dispositivos legais.

Procedimento concluido.`,
				};
				return text(conteudos[etapa]);
			},
		);

		// ============================================================
		// JURISPRUDENCIA
		// ============================================================
		this.server.registerTool(
			"jurisprudencia",
			{
				description: "Pesquisa estruturada de jurisprudencia e sumulas em fontes oficiais (STJ, STF, Lexml, Dizer o Direito, JusBrasil). Use quando o usuario pedir pesquisa de jurisprudencia, precedentes, sumulas, decisoes sobre tema. Procedimento de etapa unica.",
				inputSchema: {},
			},
			async () => text(`${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: PESQUISA DE JURISPRUDENCIA.

PERGUNTE qual assunto o usuario deseja pesquisar.

AVISE para que o usuario altere para o "modelo" de raciocinio mais profundo (extended thinking).

Apos confirmar o tema, execute o protocolo:

${PROTOCOLO_J7}

Ao final, PERGUNTE se deseja aprofundar algum dos julgados encontrados, pesquisar tema correlato, ou encerrar.`),
		);

		// ============================================================
		// ANALISE JURIDICA
		// ============================================================
		this.server.registerTool(
			"analise_juridica",
			{
				description: "Analise juridica detalhada de caso concreto seguindo estrutura classica. Use quando o usuario pedir analise, parecer ou estudo aprofundado. 2 etapas. Comece com etapa='1_analise'.",
				inputSchema: {
					etapa: z.enum([
						"1_analise",
						"2_proximas_pecas"
					]).describe("Etapa do procedimento."),
				},
			},
			async ({ etapa }) => {
				const conteudos: Record<string, string> = {
					"1_analise": `${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: ANALISE JURIDICA - Etapa 1 de 2.

PECA upload dos documentos (prefira pecas processuais separadas) OU resumo gerado no robo de relatorio OU digitacao da duvida.

${PROTOCOLO_ROBO_RELATORIO}

EXECUTE a analise juridica detalhada conforme o protocolo:

${PROTOCOLO_ANALISE_CLASSICA}

PROXIMA ACAO: chame analise_juridica com etapa='2_proximas_pecas'.`,

					"2_proximas_pecas": `PROCEDIMENTO: ANALISE JURIDICA - Etapa 2 de 2 (FINAL).

PERGUNTE ao usuario se deseja auxilio para elaborar alguma peticao judicial cabivel ao caso.

Se sim, EXECUTE o procedimento adequado conforme o tipo de peca:
- Peticao inicial: chame peticao_inicial com etapa='1_inicio'
- Contestacao: chame contestacao com etapa='1_inicio'
- Replica: chame replica com etapa='1_inicio'
- Recurso: chame recurso com etapa='1_inicio'
- Contrarrazoes: chame contrarrazoes com etapa='1_inicio'
- Alegacoes finais: chame alegacoes_finais com etapa='1_inicio'
- Outros casos: chame outros com etapa='1_inicio'

Procedimento concluido.`,
				};
				return text(conteudos[etapa]);
			},
		);

		// ============================================================
		// CORRECAO DE TEXTO
		// ============================================================
		this.server.registerTool(
			"correcao_texto",
			{
				description: "Correcao gramatical e ortografica de texto juridico, com aprimoramento juridico opcional e linha do tempo. Use quando o usuario pedir correcao de texto. 4 etapas. Comece com etapa='1_solicitar'.",
				inputSchema: {
					etapa: z.enum([
						"1_solicitar",
						"2_corrigir",
						"3_aprimorar",
						"4_linha_tempo"
					]).describe("Etapa do procedimento."),
				},
			},
			async ({ etapa }) => {
				const conteudos: Record<string, string> = {
					"1_solicitar": `${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: CORRECAO DE TEXTO - Etapa 1 de 4.

SOLICITE ao usuario o texto a ser corrigido.

PROXIMA ACAO: apos receber o texto, chame correcao_texto com etapa='2_corrigir'.`,

					"2_corrigir": `PROCEDIMENTO: CORRECAO DE TEXTO - Etapa 2 de 4.

FACA correcao gramatical e ortografica do texto. Seja EXIGENTE.

TRANSCREVA o novo texto completo e EXPLIQUE as alteracoes.

Se o texto for muito grande, faca por topicos.

PROXIMA ACAO: chame correcao_texto com etapa='3_aprimorar'.`,

					"3_aprimorar": `PROCEDIMENTO: CORRECAO DE TEXTO - Etapa 3 de 4.

PERGUNTE se o usuario deseja que o texto seja deixado mais claro e em uma escrita mais juridica.

Se sim, REALIZE o aprimoramento e EXPLIQUE as alteracoes.

PROXIMA ACAO: chame correcao_texto com etapa='4_linha_tempo'.`,

					"4_linha_tempo": `PROCEDIMENTO: CORRECAO DE TEXTO - Etapa 4 de 4 (FINAL).

SOMENTE se houver muitas datas no texto, PERGUNTE se o usuario deseja construir uma LINHA DO TEMPO em formato de tabela.

Alem do formato tradicional, SUGIRA outro formato adequado ao caso.

Procedimento concluido.`,
				};
				return text(conteudos[etapa]);
			},
		);

		// ============================================================
		// EXPLICAR EM LINGUAGEM SIMPLES
		// ============================================================
		this.server.registerTool(
			"linguagem_simples",
			{
				description: "Mensagem em formato WhatsApp para explicar decisao judicial ou processo ao cliente, em linguagem empatica com sotaque regional. Use quando o usuario quiser explicar algo ao cliente. 2 etapas. Comece com etapa='1_upload'.",
				inputSchema: {
					etapa: z.enum([
						"1_upload",
						"2_mensagem"
					]).describe("Etapa do procedimento."),
				},
			},
			async ({ etapa }) => {
				const conteudos: Record<string, string> = {
					"1_upload": `${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: LINGUAGEM SIMPLES - Etapa 1 de 2.

PECA upload das principais pecas processuais separadamente.

PROXIMA ACAO: chame linguagem_simples com etapa='2_mensagem'.`,

					"2_mensagem": `PROCEDIMENTO: LINGUAGEM SIMPLES - Etapa 2 de 2 (FINAL).

PERGUNTE:
- Qual o nome da parte sendo defendida?
- Ainda cabe recurso da parte contraria ou voce vai recorrer?

ELABORE mensagem em formato de WhatsApp:

OBJETIVO: explicar resultado da decisao judicial ou andamento do processo, e o que pode acontecer daqui para frente.

LINGUAGEM: acessivel, empatica e sensivel a vulnerabilidade do assistido.

TOM: inclua expressoes regionais e um leve sotaque tipico do Estado de Pernambuco (ou da localidade do assistido), de forma natural e respeitosa, como se estivesse falando com alguem da propria comunidade. Sem exageros.

REGRAS OBRIGATORIAS:
- SEM emojis
- SEM travessao
- Linguagem direta e humana

Procedimento concluido.`,
				};
				return text(conteudos[etapa]);
			},
		);

		// ============================================================
		// OUTROS (curinga)
		// ============================================================
		this.server.registerTool(
			"outros",
			{
				description: "Procedimento curinga para demandas juridicas que nao se encaixam nas outras ferramentas (pareceres, contratos, manifestacoes diversas). Use quando o usuario precisar de algo nao coberto pelas demais. 4 etapas. Comece com etapa='1_inicio'.",
				inputSchema: {
					etapa: z.enum([
						"1_inicio",
						"2_perguntas",
						"3_elaboracao",
						"4_aprofundamento"
					]).describe("Etapa do procedimento."),
				},
			},
			async ({ etapa }) => {
				const conteudos: Record<string, string> = {
					"1_inicio": `${PROTOCOLO_PERSONA_JURIDICA}

PROCEDIMENTO: OUTROS - Etapa 1 de 4 (inicio).

PERGUNTE em qual problema o usuario precisa de ajuda. Por exemplo:
- Peticao X
- Parecer sobre X
- Analisar contrato de XX
- Manifestacao
- Outro

INFORME que este procedimento auxilia quando a necessidade nao se encaixa nas demais ferramentas.

SUGIRA o modelo de comando:
"Preciso fazer XXXXXXXXXXXX. Como voce pode me ajudar?"

PROXIMA ACAO: chame outros com etapa='2_perguntas'.`,

					"2_perguntas": `PROCEDIMENTO: OUTROS - Etapa 2 de 4.

SOLICITE que o usuario responda o maximo de perguntas geradas por voce.

No final, INDIQUE estrategias para o exito do problema e SUGIRA outras acoes correlatas uteis.

PROXIMA ACAO: chame outros com etapa='3_elaboracao'.`,

					"3_elaboracao": `PROCEDIMENTO: OUTROS - Etapa 3 de 4.

ELABORE a solicitacao pedida.
- Faca em partes.
- Obedeca aos requisitos formais aplicaveis.
- NAO use a lousa.

PROXIMA ACAO: chame outros com etapa='4_aprofundamento'.`,

					"4_aprofundamento": `PROCEDIMENTO: OUTROS - Etapa 4 de 4 (FINAL).

${PROTOCOLO_DESENVOLVIMENTO_APROFUNDADO}

Tambem TRANSCREVA os artigos mencionados citando a fonte do site do Planalto.

Procedimento concluido.`,
				};
				return text(conteudos[etapa]);
			},
		);

	}
}

// ============================================================
// ROUTING E AUTENTICACAO
// ============================================================

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);
		const pathname = url.pathname;

		// Rota raiz: pagina informativa
		if (pathname === "/" || pathname === "") {
			return new Response(
				`Servidor MCP - Inteligencia Artificial para Escritorios de Advocacia

Para acessar este servico, voce precisa de uma URL personalizada com seu token de acesso.

Formato: /mcp/SEU_TOKEN

Caso nao tenha recebido sua URL, entre em contato com o administrador.`,
				{
					status: 200,
					headers: { "Content-Type": "text/plain; charset=utf-8" }
				}
			);
		}

		// Rota /mcp/TOKEN: autentica via token na URL
		if (pathname.startsWith("/mcp/")) {
			const token = pathname.substring(5).split("/")[0]; // pega "/mcp/TOKEN" -> "TOKEN"

			if (!tokenValido(token)) {
				return new Response(
					JSON.stringify({
						jsonrpc: "2.0",
						error: {
							code: -32001,
							message: "Acesso nao autorizado. Token invalido ou expirado. Entre em contato com o administrador."
						},
						id: null
					}),
					{
						status: 401,
						headers: { "Content-Type": "application/json" }
					}
				);
			}

			// Token valido: registra log e processa
			logUso(token, "request", "mcp_endpoint");

			// Reescreve a URL para que o MCP server interno trate como /mcp padrao
			const novaUrl = new URL(request.url);
			novaUrl.pathname = "/mcp";
			const novaRequest = new Request(novaUrl.toString(), {
				method: request.method,
				headers: request.headers,
				body: request.body,
			});

			return MyMCP.serve("/mcp").fetch(novaRequest, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
