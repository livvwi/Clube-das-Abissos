
// Mock data source for books arranged by month
export const booksByMonth: Record<string, { id: number; title: string; author: string; cover: string }[]> = {
    "2026-01": [
        { id: 1, title: 'Elite de Prata', author: 'Dani Francis', cover: 'https://m.media-amazon.com/images/I/81tycP3bo7L._SY466_.jpg' },
    ],
    "2026-02": [
        { id: 101, title: 'Anjos e Demônios', author: 'Dan Brown', cover: 'https://m.media-amazon.com/images/I/51MWbI+i+XL._SY425_.jpg' },
    ],
    "2026-03": [] // Empty for now, placeholder
};

// Helper to get readable month name
export const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString('pt-BR', { month: 'long', timeZone: 'UTC' }); // Force UTC to avoid timezone shifts
};

// Current mocked user
export const currentUser = {
    id: 'user_123',
    name: 'Leitor',
    username: 'leitor_oficial',
    avatarUrl: 'https://i.pravatar.cc/150?u=user'
};
