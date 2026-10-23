// Site content. Areas and services come from the fortcontabilidadems.com.br menu.
// Each area feeds the "Serviços" menu, the home tabs, the footer and its own page (/<slug>/).
// Photos live in public/img (Magnific stock, licensed through the agency account).
export const AREAS = [
  {
    id: "consultoria",
    slug: "consultoria",
    menu: ["Gestão Administrativa", "Gestão Financeira", "Gestão Tributária e Fiscal", "Contabilidade para Representantes"], // highlighted in the "Serviços" menu
    label: "Consultoria/Assessoria",
    title: "Consultoria e assessoria",
    heading: "Consultoria e assessoria para a gestão da sua empresa",
    lead: "Organizamos a gestão da sua empresa e treinamos sua equipe para que os processos funcionem no dia a dia, não só no papel.",
    intro: "Muitas empresas têm um bom produto e um bom time, mas perdem dinheiro em processos desorganizados. A Fort olha para a sua rotina administrativa, financeira, de estoque e de pessoal, aponta onde estão os gargalos e treina sua equipe para que as melhorias continuem depois que a consultoria termina.",
    audience: ["Empresas em crescimento que precisam organizar a casa", "Gestores que querem números confiáveis para decidir", "Equipes que precisam de treinamento em rotinas fiscais e financeiras", "Representantes comerciais"],
    photo: "consultoria.webp",
    photo2: "consultoria-2.webp",
    groups: [
      { title: "Gestão", items: [
        { name: "Gestão Administrativa", desc: "Organização de rotinas, fluxos e controles internos para a empresa funcionar sem depender de improviso." },
        { name: "Gestão Financeira", desc: "Fluxo de caixa, contas a pagar e a receber, conciliação e relatórios para enxergar a saúde financeira do negócio." },
        { name: "Gestão de Estoque", desc: "Controle de entradas, saídas e inventário para reduzir perdas e manter o estoque fiscal coerente com o físico." },
        { name: "Gestão de RH", desc: "Estrutura de cargos, rotinas de admissão e desligamento e políticas internas alinhadas à legislação." },
        { name: "Gestão Tributária e Fiscal", desc: "Revisão do enquadramento, dos tributos pagos e das obrigações para reduzir riscos e evitar pagar a mais." },
      ] },
      { title: "Treinamento em processos", items: [
        { name: "Área Fiscal", desc: "Capacitação da equipe para emissão de notas, conferência de impostos e cumprimento das obrigações." },
        { name: "Área Financeira", desc: "Treinamento em fluxo de caixa, conciliação bancária e organização dos documentos enviados à contabilidade." },
        { name: "Área de RH", desc: "Rotinas de ponto, férias, admissões e desligamentos feitas do jeito certo pela sua própria equipe." },
        { name: "Área de Estoque", desc: "Procedimentos de recebimento, movimentação e inventário para um estoque confiável." },
        { name: "Área Tributária", desc: "Noções práticas de tributação para a equipe decidir compras e vendas com segurança." },
      ] },
      { title: "Segmento", items: [
        { name: "Contabilidade para Representantes", desc: "Contabilidade pensada para representantes comerciais, com orientação sobre regime tributário, comissões e enquadramento da atividade." },
      ] },
    ],
    faq: [
      { q: "A consultoria substitui a contabilidade mensal?", a: "Não. A contabilidade cuida das obrigações legais e a consultoria trabalha a gestão do seu negócio. Os dois serviços se complementam e podem ser contratados juntos ou separados." },
      { q: "Quanto tempo dura uma consultoria?", a: "Depende do diagnóstico. Começamos entendendo a sua rotina e, a partir disso, montamos um plano com etapas e prazos claros." },
      { q: "O treinamento pode ser feito na minha empresa?", a: "Sim. Atendemos presencialmente em Dourados e on-line para todo o Mato Grosso do Sul." },
    ],
  },
  {
    id: "contabilidade",
    slug: "contabilidade",
    menu: ["Empresa Comercial", "Empresa Industrial", "Empresa de Serviços", "Terceiro Setor"], // highlighted in the "Serviços" menu
    label: "Contabilidade",
    title: "Contabilidade completa",
    heading: "Contabilidade completa para a sua empresa",
    lead: "Escrituração, balancetes, balanço e responsabilidade técnica pelos livros, com números claros para você decidir com segurança.",
    intro: "A contabilidade é a base de qualquer decisão segura. Cuidamos da escrituração, dos balancetes mensais, do balanço anual e da responsabilidade técnica pelos livros da sua empresa, e transformamos esses números em informação que você entende e usa para crescer.",
    audience: ["Comércio, indústria e prestadores de serviços", "Franquias, clínicas, advogados e profissionais de TI", "Associações e entidades do terceiro setor", "Empresas no Simples, no Lucro Presumido ou no Lucro Real"],
    photo: "contabilidade.webp",
    photo2: "contabilidade-2.webp",
    groups: [
      { title: "Segmentos", items: [
        { name: "Empresa Comercial", desc: "Escrituração de compras, vendas e estoque, com apuração correta da margem e dos impostos sobre mercadorias." },
        { name: "Empresa Industrial", desc: "Contabilidade de custos de produção, insumos e estoques, integrada às obrigações fiscais da indústria." },
        { name: "Empresa de Serviços", desc: "Rotina enxuta para prestadores de serviços, com atenção ao ISS, às retenções e ao regime mais vantajoso." },
        { name: "Terceiro Setor", desc: "Contabilidade para associações, fundações e entidades sem fins lucrativos, com prestação de contas transparente." },
      ] },
    ],
    faq: [
      { q: "Como funciona a troca de contador?", a: "Nós cuidamos de tudo: solicitamos os documentos ao escritório anterior, conferimos o que foi entregue e assumimos as obrigações sem perder prazos." },
      { q: "Vou receber relatórios da minha empresa?", a: "Sim. Além das obrigações legais, entregamos balancetes e relatórios para você acompanhar resultado, despesas e impostos." },
      { q: "Vocês atendem empresas de fora de Dourados?", a: "Sim. Com processos digitais, atendemos empresas de todo o Mato Grosso do Sul." },
    ],
  },
  {
    id: "fiscal",
    slug: "fiscal",
    menu: ["Apuração ISS", "Emissão NFSe", "Apuração ICMS", "Sped ICMS/IPI"], // highlighted in the "Serviços" menu
    label: "Fiscal",
    title: "Fiscal municipal e estadual",
    heading: "Fiscal municipal e estadual sem pendências",
    lead: "Apuração correta, guias em dia e análise tributária de entradas e saídas para pagar só o que é devido.",
    intro: "Cada nota emitida e cada compra feita tem reflexo nos impostos. A equipe fiscal da Fort acompanha as apurações municipais e estaduais, confere a tributação das entradas e saídas e mantém guias e declarações em dia, para você pagar só o que é devido e não ter surpresas com o fisco.",
    audience: ["Prestadores de serviços que recolhem ISS", "Comércios e indústrias contribuintes de ICMS", "Empresas que emitem ou recebem notas com retenção", "Negócios que querem revisar a carga tributária"],
    photo: "fiscal.webp",
    photo2: "fiscal-2.webp",
    groups: [
      { title: "Fiscal municipal", items: [
        { name: "Apuração ISS", desc: "Cálculo e conferência do ISS devido ao município, com base nas notas de serviço emitidas." },
        { name: "Emissão NFSe", desc: "Apoio na emissão da nota fiscal de serviço eletrônica, com códigos de serviço e alíquotas corretos." },
        { name: "Retenção na Fonte (Tomador)", desc: "Controle dos impostos que sua empresa deve reter ao contratar serviços de terceiros." },
        { name: "Retenção na Fonte (Prestador)", desc: "Conferência das retenções feitas pelos seus clientes, para não pagar o mesmo imposto duas vezes." },
      ] },
      { title: "Fiscal estadual", items: [
        { name: "Sped ICMS/IPI", desc: "Geração e entrega da EFD ICMS/IPI com os registros de entradas, saídas e apurações do período." },
        { name: "Apuração ICMS", desc: "Cálculo do ICMS do período, com aproveitamento correto dos créditos e atenção à substituição tributária." },
        { name: "Análise Tributária (Entrada)", desc: "Revisão da tributação das compras para garantir os créditos a que sua empresa tem direito." },
        { name: "Análise Tributária (Saída)", desc: "Conferência de CFOP, CST e alíquotas das vendas para evitar recolhimento a maior ou autuações." },
        { name: "Emissão de Guias (DAR)", desc: "Emissão do DAR, a guia de arrecadação estadual, com valores e vencimentos corretos." },
      ] },
    ],
    faq: [
      { q: "Minha empresa paga imposto demais?", a: "É possível. Uma análise das entradas e saídas costuma revelar créditos não aproveitados ou alíquotas aplicadas de forma errada. Fazemos essa revisão para você." },
      { q: "O que acontece se eu atrasar uma declaração?", a: "Atrasos geram multas e podem bloquear certidões. Por isso acompanhamos o calendário fiscal da sua empresa e avisamos antes de cada prazo." },
      { q: "Vocês emitem as notas por mim?", a: "Orientamos sua equipe na emissão e conferimos as notas na apuração. Se precisar de mais apoio, combinamos a rotina ideal para o seu negócio." },
    ],
  },
  {
    id: "dprh",
    slug: "dp-rh",
    menu: ["Folha de Pagamento", "eSocial", "TRCT", "Preposto para Demandas Trabalhistas"], // highlighted in the "Serviços" menu
    label: "DP/RH",
    title: "Departamento pessoal e RH",
    heading: "Departamento pessoal e RH com precisão",
    lead: "Folha, eSocial e rotinas trabalhistas com precisão, do admissional ao desligamento, e apoio em demandas trabalhistas.",
    intro: "Folha de pagamento envolve prazos curtos, regras que mudam e o cuidado com quem trabalha com você. A Fort cuida da rotina trabalhista completa, do admissional ao desligamento, com envios ao eSocial e à DCTFWeb no prazo, e apoia sua empresa também quando surge uma demanda trabalhista.",
    audience: ["Empresas com um ou com centenas de funcionários", "Empregadores que querem evitar passivos trabalhistas", "Negócios que vão contratar pela primeira vez", "Gestores que precisam de relatórios de pessoal"],
    photo: "dprh.webp",
    photo2: "dprh-2.webp",
    groups: [
      { title: "Rotina mensal", items: [
        { name: "Folha de Pagamento", desc: "Cálculo mensal de salários, horas extras, adicionais, férias e 13º, com holerites e encargos conferidos." },
        { name: "eSocial", desc: "Envio dos eventos trabalhistas e previdenciários ao eSocial dentro dos prazos legais." },
        { name: "DCTFWeb", desc: "Declaração e emissão da guia das contribuições previdenciárias a partir das informações da folha." },
        { name: "Relatórios Admissionais", desc: "Documentação e registro de novos funcionários, do contrato ao cadastro no eSocial." },
        { name: "Relatórios Demissionais", desc: "Cálculos e documentos de desligamento conferidos para encerrar o vínculo com segurança." },
      ] },
      { title: "Análises e desligamentos", items: [
        { name: "Análise de Cargos e Salários", desc: "Estrutura de cargos e faixas salariais coerente com o mercado e com a convenção coletiva." },
        { name: "TRCT", desc: "Elaboração do Termo de Rescisão do Contrato de Trabalho com todas as verbas devidas." },
        { name: "GRRF", desc: "Recolhimento rescisório do FGTS nos desligamentos, dentro do prazo e pelo sistema vigente." },
        { name: "Análise de CAT", desc: "Orientação e conferência da Comunicação de Acidente de Trabalho quando houver acidente ou doença ocupacional." },
        { name: "Preposto para Demandas Trabalhistas", desc: "Representação da empresa em audiências trabalhistas, com conhecimento da rotina e dos documentos." },
      ] },
    ],
    faq: [
      { q: "Vocês atendem empresas com poucos funcionários?", a: "Sim. Atendemos desde quem está contratando o primeiro funcionário até equipes maiores, com a mesma atenção aos prazos." },
      { q: "Como envio as informações da folha?", a: "Combinamos um fluxo simples e digital, com datas fixas para o envio de ponto, faltas e variáveis do mês." },
      { q: "Vocês ajudam em caso de processo trabalhista?", a: "Sim. Organizamos os documentos de pessoal e podemos atuar como preposto da empresa nas audiências." },
    ],
  },
  {
    id: "regulatorio",
    slug: "regulatorio",
    menu: ["Emissão CND Federal", "Análise de Pendências para CND", "Orientação para Anvisa", "Orientação para Bombeiro"], // highlighted in the "Serviços" menu
    label: "Regulatório",
    title: "Certidões e regularização",
    heading: "Certidões e regularização da sua empresa",
    lead: "Certidões negativas e orientação de alvarás para sua empresa participar de licitações, conseguir crédito e operar sem pendências.",
    intro: "Uma empresa sem pendências participa de licitações, consegue crédito com mais facilidade e fecha contratos sem travas. A Fort emite e acompanha suas certidões negativas, investiga a origem de qualquer pendência e orienta os alvarás necessários para você operar dentro das regras.",
    audience: ["Empresas que participam de licitações", "Negócios que precisam de crédito ou financiamento", "Estabelecimentos sujeitos à vigilância sanitária", "Empresas que precisam renovar alvarás"],
    photo: "regulatorio.webp",
    photo2: "regulatorio-2.webp",
    groups: [
      { title: "Certidões negativas", items: [
        { name: "Emissão CND Federal", desc: "Certidão de débitos relativos aos tributos federais e à dívida ativa da União." },
        { name: "Emissão CND Estadual", desc: "Certidão negativa de débitos junto à Secretaria de Fazenda do estado." },
        { name: "Emissão CND Municipal", desc: "Certidão negativa de tributos municipais junto à prefeitura." },
        { name: "Análise de Pendências para CND", desc: "Levantamento da origem de cada pendência e plano para regularizar e liberar a certidão." },
      ] },
      { title: "Alvarás", items: [
        { name: "Orientação para Anvisa", desc: "Orientação sobre licenças e exigências para atividades reguladas pela vigilância sanitária." },
        { name: "Orientação para Bombeiro", desc: "Orientação sobre o certificado do Corpo de Bombeiros exigido para o funcionamento do estabelecimento." },
      ] },
    ],
    faq: [
      { q: "Para que serve uma CND?", a: "A certidão negativa comprova que a empresa não tem débitos. Ela é pedida em licitações, financiamentos, contratos com grandes clientes e em várias operações do dia a dia." },
      { q: "Minha certidão saiu positiva. E agora?", a: "Analisamos a origem de cada pendência, que muitas vezes é uma declaração em atraso ou um débito já pago e não baixado, e cuidamos da regularização." },
      { q: "Vocês tiram o alvará para mim?", a: "Orientamos sobre as exigências de cada órgão e os documentos necessários, para o processo sair certo da primeira vez." },
    ],
  },
  {
    id: "societario",
    slug: "societario",
    menu: ["Sociedade Limitada", "Individual", "Contratual", "Entrada e Saída de Sócio"], // highlighted in the "Serviços" menu
    label: "Societário",
    title: "Societário",
    heading: "Abertura, alteração e encerramento de empresas",
    lead: "Abertura, alteração e encerramento de empresas em qualquer formato jurídico, com viabilidade, Junta Comercial, CNPJ e certificado digital.",
    intro: "O contrato social e o tipo jurídico definem como a sua empresa paga impostos, divide responsabilidades e cresce. A Fort conduz todo o processo societário, da consulta de viabilidade ao registro na Junta Comercial, CNPJ, inscrições e certificado digital, e orienta a melhor estrutura para o seu momento.",
    audience: ["Quem vai abrir a primeira empresa", "MEIs que cresceram e precisam virar ME", "Sócios que vão entrar, sair ou mudar o contrato", "Empresas que precisam encerrar as atividades"],
    photo: "societario.webp",
    photo2: "societario-2.webp",
    groups: [
      { title: "Abertura e encerramento", items: [
        { name: "Unipessoal", desc: "Sociedade limitada com um único sócio, que separa o patrimônio pessoal do patrimônio da empresa." },
        { name: "Sociedade Simples", desc: "Formato indicado para atividades intelectuais, científicas ou de profissão regulamentada exercidas pelos sócios." },
        { name: "Sociedade Limitada", desc: "O tipo mais comum no Brasil, com a responsabilidade dos sócios limitada ao capital social." },
        { name: "Sociedade Anônima", desc: "Capital dividido em ações, para empresas que precisam de uma estrutura de governança mais robusta." },
        { name: "Cooperativa", desc: "Constituição de cooperativas, com estatuto, assembleia e registros exigidos." },
        { name: "Associação", desc: "Constituição de associações sem fins lucrativos, com estatuto e registro em cartório." },
        { name: "Individual", desc: "Abertura de empresário individual e desenquadramento de MEI para ME." },
      ] },
      { title: "Alteração", items: [
        { name: "Contratual", desc: "Elaboração e registro das alterações do contrato social na Junta Comercial." },
        { name: "Razão Social", desc: "Mudança do nome empresarial com atualização em todos os órgãos." },
        { name: "Capital Social", desc: "Aumento ou redução do capital social, com a documentação correta." },
        { name: "Endereço", desc: "Mudança de endereço com viabilidade, Junta Comercial e atualização das inscrições." },
        { name: "Objeto Social", desc: "Inclusão ou exclusão de atividades e ajuste dos CNAEs da empresa." },
        { name: "Entrada e Saída de Sócio", desc: "Alteração do quadro societário com a nova distribuição de cotas e responsabilidades." },
        { name: "Alterações Diversas", desc: "Mudança de administrador, de cláusulas contratuais e outros ajustes do contrato." },
        { name: "Transformação Societária", desc: "Mudança do tipo jurídico da empresa, como de empresário individual para sociedade limitada." },
      ] },
    ],
    faq: [
      { q: "Quanto tempo leva para abrir uma empresa?", a: "Depende da atividade e dos órgãos envolvidos. Com a documentação em mãos, conduzimos cada etapa e mantemos você informado do andamento." },
      { q: "Qual o melhor tipo de empresa para mim?", a: "Depende da atividade, do número de sócios e do faturamento previsto. Fazemos essa análise antes da abertura, junto com a escolha do regime tributário." },
      { q: "Como faço para fechar minha empresa?", a: "Levantamos as pendências, regularizamos o que for necessário e fazemos a baixa na Junta Comercial, na Receita Federal e nos demais órgãos." },
    ],
  },
];

// "Como trabalhamos", shown on every area page
export const STEPS = [
  { title: "Conversa inicial", text: "Você conta o que precisa pelo WhatsApp ou no escritório, sem compromisso." },
  { title: "Diagnóstico", text: "Analisamos a situação da empresa e indicamos o caminho mais seguro." },
  { title: "Execução", text: "Nossa equipe cuida dos processos e dos prazos, com você acompanhando cada etapa." },
  { title: "Acompanhamento", text: "Seguimos ao seu lado com relatórios, alertas e atendimento direto." },
];

export const TIMELINE = [
  { year: "2015", title: "O começo", text: "Primeiros passos na Wilcont como office boys. Arquivo, escrita fiscal, departamento pessoal e contábil: uma base sólida em cada setor." },
  { year: "2023", title: "Nasce a Fort", text: "Sem sede própria, atendendo nos clientes e on-line. Comprometimento, agilidade e transparência desde o primeiro dia." },
  { year: "2025", title: "Primeira sede", text: "A abertura do escritório físico em Dourados. No mesmo ano, a carteira de clientes dobrou." },
  { year: "2026", title: "Fort + Wilcont", text: "A aquisição da Wilcont, com mais de 40 anos de história no MS. O lugar onde tudo começou agora faz parte do futuro da Fort.", gold: true },
];

// Subjects offered in the contact form (the API accepts only these)
export const TOPICS = [...AREAS.map((a) => a.label), "Abrir empresa", "Trocar de contador", "Migrar de MEI para ME", "Declaração do IRPF", "Outro assunto"];
