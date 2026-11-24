export type ServiceCategory = 'facial' | 'corporal';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  shortDescription: string;
  image: string;
  imageAlt: string;
}

export interface BeforeAfterItem {
  id: string;
  procedure: string;
  category: ServiceCategory;
  caption: string;
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  /** Alterar para false quando substituído por fotografia real devidamente autorizada */
  isIllustrative: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface DaySchedule {
  open: boolean;
  /** Formato HH:mm */
  start: string;
  /** Formato HH:mm */
  end: string;
  label: string;
}

/**
 * CONFIGURAÇÃO CENTRAL DA BIOCLINIC ESTÉTICA AVANÇADA
 * Altere dados de contato, URLs, horários, serviços e textos institucionais em um único lugar.
 */
export const CLINIC_CONFIG = {
  siteUrl: 'https://bioclinicesteticaavancada.com.br', // Atualize com o domínio final no deploy
  name: 'BioClinic Estética Avançada',
  shortName: 'BioClinic',
  tagline: 'Beleza em harmonia, cuidado em cada detalhe.',
  specialty: 'Estética Avançada, Harmonização Facial e Corporal',
  professional: {
    name: 'Fabiana Tavares',
    role: 'Responsável pela clínica',
    registration: 'CRBM/MA 11622',
    photo: '/images/fabiana-tavares.jpg',
    photoAlt: 'Fabiana Tavares, responsável pela BioClinic Estética Avançada (CRBM/MA 11622)',
  },
  logo: {
    src: '/images/logo-bioclinic.jpg',
    circleSrc: '/images/logo-bioclinic-circle.png',
    alt: 'Logotipo oficial BioClinic Estética Avançada',
  },
  hero: {
    mainImage: '/images/hero-clinic.jpg',
    mainImageAlt: 'Ambiente sofisticado da BioClinic Estética Avançada em tons nude e rose gold',
    detailImage: '/images/hero-detail.jpg',
    detailImageAlt: 'Detalhe editorial de cuidados estéticos avançados na BioClinic',
  },
  contact: {
    phoneDisplay: '(98) 98811-1576',
    phoneHref: 'tel:+5598988111576',
    whatsappDisplay: '(98) 98811-1576',
    whatsappInternational: '5598988111576',
    whatsappBaseUrl: 'https://wa.me/5598988111576',
    email: 'bioclinic.esteticavancada@gmail.com',
    address: {
      street: 'Av. Contorno Sul, 18',
      neighborhood: 'Cohatrac, Itaguara',
      city: 'São Luís',
      state: 'MA',
      stateFull: 'Maranhão',
      postalCode: '65052-116',
      country: 'BR',
      full: 'Av. Contorno Sul, 18 - Cohatrac, Itaguara, São Luís - MA, CEP 65052-116',
    },
    mapsShareUrl: 'https://share.google/fnh48qc1tONJwOzlG',
    mapsEmbedUrl:
      'https://maps.google.com/maps?q=Av.%20Contorno%20Sul%2C%2018%20-%20Cohatrac%2C%20S%C3%A3o%20Lu%C3%ADs%20-%20MA%2C%2065052-116&t=&z=16&ie=UTF8&iwloc=&output=embed',
  },
  social: {
    instagram: {
      label: '@bioclinic_esteticavancada',
      url: 'https://www.instagram.com/bioclinic_esteticavancada/',
    },
    facebook: {
      label: 'Bioclinica Estética Avançada',
      // Substitua pelo link direto da página oficial do Facebook caso possua URL personalizada
      url: 'https://www.facebook.com/search/top?q=Bioclinica%20Est%C3%A9tica%20Avan%C3%A7ada',
    },
  },
  reviews: {
    /**
     * URL de avaliação no Google centralizada para fácil substituição.
     * Nota técnica: o link fornecido inicialmente abre a busca local do Google.
     * Quando tiver o link direto do Google Business Profile (ex.: https://g.page/r/.../review),
     * basta substituir o valor abaixo.
     */
    googleReviewUrl:
      'https://www.google.com/search?q=clinica+de+est%C3%A9tica+s%C3%A3o+luis&client=ms-android-samsung-a1-terr1-rvo0cqb&udm=local',
  },
  seo: {
    title: 'BioClinic Estética Avançada | Harmonização Facial e Corporal em São Luís - MA',
    description:
      'Conheça a BioClinic Estética Avançada em São Luís - MA. Procedimentos faciais e corporais, atendimento especializado e agendamento pelo WhatsApp.',
    ogImage: '/og-image.jpg',
    themeColor: '#F7E4DE',
  },
  /**
   * PARÂMETROS EDITÁVEIS DE AGENDAMENTO
   * Os horários de abertura e fechamento seguem o expediente oficial da clínica.
   * `slotIntervalMinutes` e `blockedDates` são parâmetros técnicos editáveis pelo administrador/desenvolvedor.
   */
  schedule: {
    /** Intervalo técnico configurável entre opções de horário exibidas no formulário (em minutos) */
    slotIntervalMinutes: 30,
    /** Último horário permitido para início de atendimento (offset em minutos antes do fechamento; 0 inclui até o fechamento) */
    lastSlotBeforeCloseMinutes: 30,
    /** Quantos meses futuros o calendário permite navegar */
    maxMonthsAhead: 3,
    /** Datas excepcionalmente indisponíveis no formato YYYY-MM-DD (ex.: feriados) */
    blockedDates: [] as string[],
    /** Dias da semana: 0 = Domingo ... 6 = Sábado */
    weeklyHours: {
      0: { open: false, start: '', end: '', label: 'Fechado' },
      1: { open: true, start: '09:30', end: '19:30', label: '09h30 às 19h30' },
      2: { open: true, start: '09:30', end: '19:30', label: '09h30 às 19h30' },
      3: { open: true, start: '09:30', end: '19:30', label: '09h30 às 19h30' },
      4: { open: true, start: '09:30', end: '19:30', label: '09h30 às 19h30' },
      5: { open: true, start: '09:30', end: '19:30', label: '09h30 às 19h30' },
      6: { open: true, start: '10:00', end: '19:30', label: '10h às 19h30' },
    } as Record<number, DaySchedule>,
    summaryLines: [
      { days: 'Segunda a sexta', hours: '09h30 às 19h30' },
      { days: 'Sábado', hours: '10h às 19h30' },
      { days: 'Domingo', hours: 'Fechado' },
    ],
  },
} as const;

export const NAV_LINKS = [
  { id: 'inicio', label: 'Início' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'sobre', label: 'Sobre a Clínica' },
  { id: 'antes-e-depois', label: 'Antes e Depois' },
  { id: 'avaliacoes', label: 'Avaliações' },
  { id: 'agendamento', label: 'Agendamento' },
  { id: 'contato', label: 'Contato' },
  { id: 'faq', label: 'FAQ' },
] as const;

export const SERVICES: ServiceItem[] = [
  // PROCEDIMENTOS FACIAIS
  {
    id: 'harmonizacao-facial',
    name: 'Harmonização Facial',
    category: 'facial',
    shortDescription:
      'Planejamento estético facial individualizado voltado ao equilíbrio e à simetria das proporções do rosto.',
    image: '/images/facial-harmonizacao.jpg',
    imageAlt: 'Ilustração editorial de Harmonização Facial na BioClinic Estética Avançada',
  },
  {
    id: 'limpeza-de-pele',
    name: 'Limpeza de Pele',
    category: 'facial',
    shortDescription:
      'Higienização facial profissional dedicada ao cuidado da pele e à remoção de impurezas superficiais.',
    image: '/images/facial-limpeza.jpg',
    imageAlt: 'Ilustração editorial de Limpeza de Pele na BioClinic Estética Avançada',
  },
  {
    id: 'peeling-quimico',
    name: 'Peeling Químico',
    category: 'facial',
    shortDescription:
      'Protocolo facial estético com aplicação controlada de ativos selecionados conforme avaliação individual.',
    image: '/images/facial-peeling.jpg',
    imageAlt: 'Ilustração editorial de Peeling Químico na BioClinic Estética Avançada',
  },
  {
    id: 'microagulhamento',
    name: 'Microagulhamento',
    category: 'facial',
    shortDescription:
      'Procedimento estético facial realizado com técnica específica e protocolo definido para cada pele.',
    image: '/images/facial-microagulhamento.jpg',
    imageAlt: 'Ilustração editorial de Microagulhamento na BioClinic Estética Avançada',
  },
  {
    id: 'rejuvenescimento-facial',
    name: 'Rejuvenescimento Facial',
    category: 'facial',
    shortDescription:
      'Cuidado estético facial planejado de forma personalizada para valorizar a vitalidade e o viço da pele.',
    image: '/images/facial-rejuvenescimento.jpg',
    imageAlt: 'Ilustração editorial de Rejuvenescimento Facial na BioClinic Estética Avançada',
  },
  {
    id: 'skinbooster',
    name: 'Skinbooster',
    category: 'facial',
    shortDescription:
      'Procedimento estético voltado à hidratação cutânea, com indicação definida em avaliação profissional.',
    image: '/images/facial-skinbooster.jpg',
    imageAlt: 'Ilustração editorial de Skinbooster na BioClinic Estética Avançada',
  },
  {
    id: 'botox-3-areas',
    name: 'Botox — 3 áreas',
    category: 'facial',
    shortDescription:
      'Aplicação estética planejada em três regiões faciais, conforme análise individual da expressão.',
    image: '/images/facial-botox.jpg',
    imageAlt: 'Ilustração editorial de Botox 3 áreas na BioClinic Estética Avançada',
  },
  {
    id: 'limpeza-de-pele-peeling-quimico',
    name: 'Limpeza de Pele + Peeling Químico',
    category: 'facial',
    shortDescription:
      'Protocolo combinado que integra higienização facial profissional e aplicação de peeling químico.',
    image: '/images/facial-limpeza-peeling.jpg',
    imageAlt: 'Ilustração editorial de Limpeza de Pele associada a Peeling Químico',
  },
  {
    id: 'limpeza-de-pele-skinbooster',
    name: 'Limpeza de Pele + Skinbooster',
    category: 'facial',
    shortDescription:
      'Associação de limpeza facial profissional e protocolo Skinbooster sob orientação individualizada.',
    image: '/images/facial-limpeza-skinbooster.jpg',
    imageAlt: 'Ilustração editorial de Limpeza de Pele associada a Skinbooster',
  },

  // PROCEDIMENTOS CORPORAIS
  {
    id: 'harmonizacao-corporal',
    name: 'Harmonização Corporal',
    category: 'corporal',
    shortDescription:
      'Abordagem estética corporal personalizada com foco na proporção e no cuidado individual de cada região.',
    image: '/images/corporal-harmonizacao.jpg',
    imageAlt: 'Ilustração editorial de Harmonização Corporal na BioClinic Estética Avançada',
  },
  {
    id: 'criolipolise',
    name: 'Criolipólise',
    category: 'corporal',
    shortDescription:
      'Procedimento estético corporal por resfriamento controlado, indicado após avaliação presencial.',
    image: '/images/corporal-criolipolise.jpg',
    imageAlt: 'Ilustração editorial de Criolipólise na BioClinic Estética Avançada',
  },
  {
    id: 'carboxiterapia',
    name: 'Carboxiterapia',
    category: 'corporal',
    shortDescription:
      'Técnica de estética corporal aplicada de acordo com a região e os objetivos definidos em consulta.',
    image: '/images/corporal-carboxiterapia.jpg',
    imageAlt: 'Ilustração editorial de Carboxiterapia na BioClinic Estética Avançada',
  },
  {
    id: 'corrente-russa',
    name: 'Corrente Russa',
    category: 'corporal',
    shortDescription:
      'Protocolo corporal com eletroestimulação realizado em sessões planejadas individualmente.',
    image: '/images/corporal-corrente-russa.jpg',
    imageAlt: 'Ilustração editorial de Corrente Russa na BioClinic Estética Avançada',
  },
  {
    id: 'detox-corporal',
    name: 'Detox Corporal',
    category: 'corporal',
    shortDescription:
      'Protocolo estético corporal voltado ao cuidado integrado e à sensação de leveza e bem-estar.',
    image: '/images/corporal-detox.jpg',
    imageAlt: 'Ilustração editorial de Detox Corporal na BioClinic Estética Avançada',
  },
];

/**
 * GALERIA ANTES E DEPOIS
 * Imagens provisórias geradas por IA apenas para demonstração visual do comparador.
 * Para substituir por registros reais autorizados, atualize os caminhos das imagens
 * e altere `isIllustrative` para `false`.
 */
export const BEFORE_AFTER_GALLERY: BeforeAfterItem[] = [
  {
    id: 'ba-harmonizacao-facial',
    procedure: 'Harmonização Facial',
    category: 'facial',
    caption: 'Demonstração ilustrativa do comparador interativo para Harmonização Facial.',
    beforeImage: '/images/ba-1-before.jpg',
    afterImage: '/images/ba-1-after.jpg',
    beforeAlt: 'Imagem ilustrativa demonstrativa — Antes (Harmonização Facial)',
    afterAlt: 'Imagem ilustrativa demonstrativa — Depois (Harmonização Facial)',
    isIllustrative: true,
  },
  {
    id: 'ba-limpeza-skinbooster',
    procedure: 'Limpeza de Pele + Skinbooster',
    category: 'facial',
    caption: 'Demonstração ilustrativa do comparador interativo para protocolo facial combinado.',
    beforeImage: '/images/ba-2-before.jpg',
    afterImage: '/images/ba-2-after.jpg',
    beforeAlt: 'Imagem ilustrativa demonstrativa — Antes (Limpeza de Pele + Skinbooster)',
    afterAlt: 'Imagem ilustrativa demonstrativa — Depois (Limpeza de Pele + Skinbooster)',
    isIllustrative: true,
  },
  {
    id: 'ba-rejuvenescimento-facial',
    procedure: 'Rejuvenescimento Facial',
    category: 'facial',
    caption: 'Demonstração ilustrativa do comparador interativo para Rejuvenescimento Facial.',
    beforeImage: '/images/ba-3-before.jpg',
    afterImage: '/images/ba-3-after.jpg',
    beforeAlt: 'Imagem ilustrativa demonstrativa — Antes (Rejuvenescimento Facial)',
    afterAlt: 'Imagem ilustrativa demonstrativa — Depois (Rejuvenescimento Facial)',
    isIllustrative: true,
  },
  {
    id: 'ba-peeling-quimico',
    procedure: 'Peeling Químico',
    category: 'facial',
    caption: 'Demonstração ilustrativa do comparador interativo para Peeling Químico.',
    beforeImage: '/images/ba-4-before.jpg',
    afterImage: '/images/ba-4-after.jpg',
    beforeAlt: 'Imagem ilustrativa demonstrativa — Antes (Peeling Químico)',
    afterAlt: 'Imagem ilustrativa demonstrativa — Depois (Peeling Químico)',
    isIllustrative: true,
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-avaliacao',
    question: 'Preciso passar por uma avaliação antes de realizar o procedimento?',
    answer:
      'Sim. A avaliação prévia é fundamental para conhecer suas expectativas, analisar as características individuais da pele ou da região corporal e definir com segurança qual procedimento é mais indicado para o seu caso.',
  },
  {
    id: 'faq-dor',
    question: 'Os procedimentos estéticos são dolorosos?',
    answer:
      'A sensibilidade varia de pessoa para pessoa e depende diretamente do tipo de procedimento escolhido. Durante a avaliação individual, a profissional explica o que esperar em termos de conforto e quais medidas podem ser adotadas para tornar o atendimento o mais tranquilo possível.',
  },
  {
    id: 'faq-recuperacao',
    question: 'Quanto tempo dura a recuperação após um procedimento?',
    answer:
      'O tempo de recuperação depende do procedimento realizado e da resposta individual de cada organismo. Enquanto alguns cuidados permitem retorno imediato à rotina, outros podem exigir atenção específica por alguns dias — todos os detalhes são informados individualmente antes do atendimento.',
  },
  {
    id: 'faq-permanencia',
    question: 'Os resultados dos procedimentos são permanentes?',
    answer:
      'A duração dos efeitos varia conforme a técnica aplicada, as características biológicas de cada pessoa e os cuidados adotados na rotina. Por isso, a expectativa de duração e a necessidade de manutenção são orientadas de forma personalizada pela profissional.',
  },
  {
    id: 'faq-cuidados',
    question: 'Quais cuidados devo ter após realizar um procedimento?',
    answer:
      'As orientações pós-procedimento são sempre individualizadas conforme a técnica realizada. De modo geral, seguir rigorosamente as recomendações passadas pela profissional responsável — incluindo cuidados com a pele, exposição solar e retorno quando indicado — é essencial para uma boa evolução.',
  },
];
