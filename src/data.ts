
// Mock data source for books arranged by month
export const booksByMonth: Record<string, { id: number; title: string; author: string; cover: string; synopsis?: string; releaseDate?: string; pages?: number; }[]> = {
    "2026-01": [
        {
            id: 1,
            title: 'Elite de Prata',
            author: 'Dani Francis',
            cover: 'https://m.media-amazon.com/images/I/81tycP3bo7L._SY466_.jpg',
            synopsis: '"Elite de Prata" acompanha Wren Darlington, uma das Modificadas mais poderosas, que vive escondendo suas habilidades psíquicas – uma verdadeira sentença de morte. Ao ajudar a Rebelião às escondidas, um erro fatal a leva para o programa de treinamento do serviço militar do Continente, a renomada Elite de Prata. Lá, ela e a Rebelião veem a chance perfeita de infiltração, mas Wren precisará sobreviver ao rigoroso treinamento de sobrevivência, esconder seus poderes e não se render ao charmoso e severo comandante Cross Redden. No meio de uma guerra, ela terá que decidir o que realmente vale a pena salvar.',
            releaseDate: '14 de outubro de 2025',
            pages: 464
        },
    ],
    "2026-02": [
        {
            id: 101,
            title: 'Anjos e Demônios',
            author: 'Dan Brown',
            cover: 'https://m.media-amazon.com/images/I/51MWbI+i+XL._SY425_.jpg',
            synopsis: '"Anjos e Demônios" é a primeira aventura do famoso professor de simbologia de Harvard, Robert Langdon. O enredo se desenrola quando Langdon é chamado para investigar um misterioso símbolo marcado a fogo no peito de um físico assassinado no centro de pesquisas na Suíça. Ele descobre que a assinatura pertence aos Illuminati, uma antiga sociedade secreta que se acreditava extinta e que ressurge com o objetivo de executar uma terrível vingança contra a Igreja Católica. Com uma nova e devastadora arma, lutam para explodir o Vaticano às vésperas de eleger um novo Papa. Langdon embarca em uma frenética caçada por criptas e igrejas em Roma, desvendando enigmas para levá-los ao esconderijo inimigo.',
            releaseDate: '15 de maio de 2021',
            pages: 464
        },
    ],
    "2026-03": [
        {
            id: 201,
            title: 'Patinando no amor',
            author: 'Lynn Painter',
            cover: '/patinando-no-amor.png',
            synopsis: '"Patinando no Amor" é uma comédia romântica que narra o reencontro de dois melhores amigos de infância, Dani e Alec. Eles eram inseparáveis, mas se afastaram quando ela se mudou. Anos depois, Dani retorna, sem vontade de rever o garoto que a abandonou, que agora é uma estrela idolatrada do hóquei. Acontecimentos inesperados os reaproximam e os forçam a fingir um namoro, o que os leva a se reconectar, desenterrar segredos de família e confrontar os sentimentos que ainda guardam um pelo outro.',
            releaseDate: '2 de fevereiro de 2026',
            pages: 416
        },
    ]
};

export const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const monthStr = date.toLocaleString('pt-BR', { month: 'long', timeZone: 'UTC' }); // Force UTC to avoid timezone shifts
    return monthStr.charAt(0).toUpperCase() + monthStr.slice(1);
};



