export interface Scientist {
    id: string;
    name: string;
    field: string;
    description: string;
    category: "PIONEIRAS MUNDIAIS" | "POTÊNCIAS BRASILEIRAS" | "FUTURO";
    achievement: string;
    imageUrl?: string;
    lifeStory: string;
    keyWorks: string[];
    scienceImpact: string;
}

export const scientists: Scientist[] = [
    // Pioneiras Mundiais
    {
        id: "marie-curie",
        name: "Marie Curie",
        field: "Física / Química",
        description: "A única pessoa com Nobel em duas áreas diferentes. Descobriu o Polônio e o Rádio.",
        category: "PIONEIRAS MUNDIAIS",
        achievement: "Nobel em Duas Áreas",
        lifeStory: "Nascida na Polônia, Maria Skłodowska enfrentou barreiras para estudar em sua terra natal. Mudou-se para Paris, onde vivia com poucos recursos enquanto estudava na Sorbonne. Sua parceria com Pierre Curie levou a descobertas fundamentais sobre radioatividade, termo que ela mesma cunhou.",
        keyWorks: [
            "Descoberta dos elementos Polônio e Rádio",
            "Teoria da Radioatividade",
            "Desenvolvimento de unidades móveis de raio-x na 1ª Guerra Mundial"
        ],
        scienceImpact: "Quebrou o teto de vidro na ciência acadêmica europeia e fundou o Instituto Curie. Sua vida é o maior símbolo de que a paixão pelo conhecimento supera qualquer obstáculo social."
    },
    {
        id: "ada-lovelace",
        name: "Ada Lovelace",
        field: "Computação",
        description: "A primeira programadora da história. Escreveu o primeiro algoritmo para máquinas.",
        category: "PIONEIRAS MUNDIAIS",
        achievement: "Primeiro Algoritmo",
        lifeStory: "Filha do poeta Lord Byron e da matemática Annabella Milbanke, Ada foi incentivada a estudar lógica e matemática para não seguir o temperamento 'poético' do pai. Sua colaboração com Charles Babbage na Máquina Analítica resultou em notas visionárias.",
        keyWorks: [
            "Tradução e notas sobre a Máquina Analítica de Babbage",
            "O 'Primeiro Programa': algoritmo para calcular números de Bernoulli",
            "Visão de que computadores poderiam manipular mais que apenas números"
        ],
        scienceImpact: "Previu o potencial da computação universal um século antes dela existir, inspirando gerações de mulheres na tecnologia e engenharia de software."
    },
    {
        id: "rosalind-franklin",
        name: "Rosalind Franklin",
        field: "Biologia",
        description: "A mãe do DNA. Sua 'Foto 51' revelou a estrutura de dupla hélice.",
        category: "PIONEIRAS MUNDIAIS",
        achievement: "Estrutura do DNA",
        lifeStory: "Rosalind era uma cristalógrafa de raio-x brilhante e meticulosa. Trabalhando no King's College em Londres, produziu imagens de difração de DNA de clareza sem precedentes, fundamentais para a descoberta de Watson e Crick, que receberam o Nobel sem dar a ela o devido crédito em vida.",
        keyWorks: [
            "A 'Foto 51' da estrutura B do DNA",
            "Estudos pioneiros sobre a estrutura do carvão e grafite",
            "Pesquisa sobre a estrutura de vírus (como o da pólio)"
        ],
        scienceImpact: "Sua história tornou-se um símbolo da luta por reconhecimento feminino na ciência. Seu trabalho é a base da genética moderna e biologia molecular."
    },
    {
        id: "katherine-johnson",
        name: "Katherine Johnson",
        field: "Matemática",
        description: "A calculadora da NASA. Seus cálculos manuais levaram o homem à Lua.",
        category: "PIONEIRAS MUNDIAIS",
        achievement: "Cálculos da Apollo 11",
        lifeStory: "Uma matemática prodígio, Katherine enfrentou a segregação racial e de gênero na NASA (então NACA). Sua precisão era tão lendária que o astronauta John Glenn pediu que ela verificasse os cálculos do computador eletrônico antes de voar.",
        keyWorks: [
            "Cálculo de trajetória para o voo de Alan Shepard (1º americano no espaço)",
            "Verificação dos cálculos orbitais de John Glenn",
            "Cálculos para o acoplamento do módulo lunar da Apollo 11"
        ],
        scienceImpact: "Abriu portas para mulheres negras na ciência espacial e STEM, provando que a excelência intelectual não tem raça nem gênero."
    },
    // Potências Brasileiras
    {
        id: "johanna-dobereiner",
        name: "Johanna Döbereiner",
        field: "Agronomia",
        description: "Revolucionou a agricultura com a fixação biológica de nitrogênio.",
        category: "POTÊNCIAS BRASILEIRAS",
        achievement: "Fixação de Nitrogênio",
        lifeStory: "Nascida na Tchecoslováquia, Johanna veio para o Brasil e dedicou sua vida à pesquisa do solo. Ela defendeu que bactérias poderiam substituir fertilizantes nitrogenados caros e poluentes, uma ideia inicialmente ridicularizada que se provou revolucionária.",
        keyWorks: [
            "Descoberta de bactérias fixadoras de nitrogênio em gramíneas",
            "Desenvolvimento da tecnologia de fixação biológica na soja",
            "Programa Proálcool (contribuições na cana-de-açúcar)"
        ],
        scienceImpact: "Sua pesquisa economiza bilhões de dólares anuais para o Brasil e torna a agricultura tropical mais sustentável, reduzindo drásticamente a necessidade de adubos químicos."
    },
    {
        id: "jaqueline-goes",
        name: "Jaqueline Goes de Jesus",
        field: "Biomedicina",
        description: "Liderou o sequenciamento do genoma do COVID-19 em tempo recorde no Brasil.",
        category: "POTÊNCIAS BRASILEIRAS",
        achievement: "Sequenciamento COVID-19",
        lifeStory: "Baiana, doutora em Patologia, Jaqueline coordenou a equipe que sequenciou o genoma do primeiro caso de SARS-CoV-2 na América Latina apenas 48 horas após a confirmação. Um feito de velocidade e precisão reconhecido mundialmente.",
        keyWorks: [
            "Sequenciamento do genoma do SARS-CoV-2 em 48h",
            "Monitoramento de variantes do vírus Zika",
            "Pesquisa de arboviroses emergentes"
        ],
        scienceImpact: "Tornou-se um ícone da ciência brasileira contemporânea, inspirando meninas negras e nordestinas e reafirmando a competência científica do Brasil em crises globais."
    },
    {
        id: "nise-da-silveira",
        name: "Nise da Silveira",
        field: "Psiquiatria",
        description: "Humanizou o tratamento mental trocando eletrochoques pela arte.",
        category: "POTÊNCIAS BRASILEIRAS",
        achievement: "Terapia Humanizada",
        lifeStory: "Alagoana revolucionária, Nise recusou-se a aplicar os brutais 'tratamentos' da época (eletrochoque, lobotomia). Isolada pelos colegas na seção de Terapia Ocupacional, ela deu tintas e telas aos pacientes, revelando o rico mundo interior deles.",
        keyWorks: [
            "Fundação do Museu de Imagens do Inconsciente",
            "Introdução da psicologia junguiana no Brasil",
            "Pioneirismo na terapia assistida por animais (coterapeutas)"
        ],
        scienceImpact: "Revolucionou a psiquiatria mundial pelo afeto e arte. Mostrou que a 'loucura' não deve ser silenciada, mas compreendida e acolhida."
    },
    {
        id: "bertha-lutz",
        name: "Bertha Lutz",
        field: "Biologia / Diplomacia",
        description: "Zoóloga e diplomata que garantiu direitos das mulheres na ONU.",
        category: "POTÊNCIAS BRASILEIRAS",
        achievement: "Direitos na ONU",
        lifeStory: "Filha de Adolfo Lutz, Bertha uniu ciência e ativismo político. Como bióloga, estudou anfíbios; como feminista, liderou a luta pelo voto feminino no Brasil e foi essencial para incluir a igualdade de gênero na Carta das Nações Unidas em 1945.",
        keyWorks: [
            "Estudos taxonômicos sobre anfíbios brasileiros (Hylidae)",
            "Redação do Estatuto da Mulher",
            "Inclusão de 'igualdade entre homens e mulheres' na Carta da ONU"
        ],
        scienceImpact: "Provou que cientistas também são agentes políticos. Deixou um legado duplo: na conservação da natureza e na garantia de direitos civis fundamentais para as mulheres."
    },
];

export const katieBouman: Scientist = {
    id: "katie-bouman",
    name: "Katie Bouman",
    field: "Ciência da Computação",
    description: "Desenvolveu o algoritmo que tornou possível a primeira imagem de um buraco negro.",
    category: "FUTURO",
    achievement: "Imagem do Buraco Negro",
    lifeStory: "Katherine 'Katie' Bouman liderou, ainda como estudante de pós-graduação no MIT, o desenvolvimento de um algoritmo crucial para o projeto Event Horizon Telescope. Sua abordagem inovadora permitiu combinar dados de radiotelescópios espalhados pelo mundo para criar uma imagem coerente de algo que até então era considerado invisível.",
    keyWorks: [
        "Algoritmo CHIRP (Continuous High-resolution Image Reconstruction using Patch priors)",
        "Liderança no processamento de imagens do Event Horizon Telescope",
        "Pesquisa em fotografia computacional e aprendizado de máquina"
    ],
    scienceImpact: "Sua contribuição tornou o invisível visível, provando teorias de Einstein e inspirando milhões ao redor do mundo com a imagem viral de sua reação ao ver o buraco negro pela primeira vez."
};
