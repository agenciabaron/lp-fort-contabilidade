// Menu areas and services, taken from the current fortcontabilidadems.com.br menu.
// Each entry feeds both the mega menu and the services section.
export const AREAS = [
  {
    id: "consultoria",
    label: "Consultoria/Assessoria",
    title: "Consultoria e assessoria",
    lead: "Organizamos a gestão da sua empresa e treinamos sua equipe para que os processos funcionem no dia a dia, não só no papel.",
    groups: [
      { items: ["Gestão Administrativa", "Gestão Financeira", "Gestão de Estoque", "Gestão de RH", "Gestão Tributária e Fiscal"] },
      { title: "Treinamento em processos", items: ["Área Fiscal", "Área Financeira", "Área de RH", "Área de Estoque", "Área Tributária"] },
      { items: ["Contabilidade para Representantes"] },
    ],
  },
  {
    id: "contabilidade",
    label: "Contabilidade",
    title: "Contabilidade completa",
    lead: "Escrituração, balancetes, balanço e responsabilidade técnica pelos livros, com números claros para você decidir com segurança.",
    groups: [
      { items: ["Empresa Comercial", "Empresa Industrial", "Empresa de Serviços", "Terceiro Setor"] },
    ],
  },
  {
    id: "fiscal",
    label: "Fiscal",
    title: "Fiscal municipal e estadual",
    lead: "Apuração correta, guias em dia e análise tributária de entradas e saídas para pagar só o que é devido.",
    groups: [
      { title: "Fiscal municipal", items: ["Apuração ISS", "Emissão NFSe", "Retenção na Fonte (Tomador)", "Retenção na Fonte (Prestador)"] },
      { title: "Fiscal estadual", items: ["Sped ICMS/IPI", "Apuração ICMS", "Análise Tributária (Entrada)", "Análise Tributária (Saída)", "Emissão de Guias (DAR)"] },
    ],
  },
  {
    id: "dprh",
    label: "DP/RH",
    title: "Departamento pessoal e RH",
    lead: "Folha, eSocial e rotinas trabalhistas com precisão, do admissional ao desligamento, e apoio em demandas trabalhistas.",
    groups: [
      { items: ["Folha de Pagamento", "eSocial", "DCTFWeb", "Relatórios Admissionais", "Relatórios Demissionais"] },
      { items: ["Análise de Cargos e Salários", "TRCT", "GRRF", "Análise de CAT", "Preposto para Demandas Trabalhistas"] },
    ],
  },
  {
    id: "regulatorio",
    label: "Regulatório",
    title: "Certidões e regularização",
    lead: "Certidões negativas e orientação de alvarás para sua empresa participar de licitações, conseguir crédito e operar sem pendências.",
    groups: [
      { items: ["Emissão CND Federal", "Emissão CND Estadual", "Emissão CND Municipal", "Análise de Pendências para CND"] },
      { title: "Alvarás", items: ["Orientação para Anvisa", "Orientação para Bombeiro"] },
    ],
  },
  {
    id: "societario",
    label: "Societário",
    title: "Societário",
    lead: "Abertura, alteração e encerramento de empresas em qualquer formato jurídico, com viabilidade, Junta Comercial, CNPJ e certificado digital.",
    groups: [
      { title: "Abertura e encerramento", items: ["Unipessoal", "Sociedade Simples", "Sociedade Limitada", "Sociedade Anônima", "Cooperativa", "Associação", "Individual"] },
      { title: "Alteração", items: ["Contratual", "Razão Social", "Capital Social", "Endereço", "Objeto Social", "Entrada e Saída de Sócio", "Alterações Diversas", "Transformação Societária"] },
    ],
  },
];
