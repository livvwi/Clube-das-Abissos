export interface ShelfBook {
    id: string;
    user_id: string;
    book_title: string;
    book_author: string;
    book_cover?: string;
    status: 'Quero ler' | 'Lendo' | 'Pausado' | 'Concluído';
    current_page: number;
    total_pages: number;
    progress_note: string;
    created_at: string;
    updated_at: string;
}

export interface ReadingGoal {
    user_id: string;
    goal_total: number;
    year: number;
}

const SHELF_STORAGE_KEY = '@abissos/personal_shelf';
const GOAL_STORAGE_KEY = '@abissos/reading_goal';

const getLocalStorage = (key: string) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export const fetchPersonalShelf = async (userId: string): Promise<ShelfBook[]> => {
    const allBooks = getLocalStorage(SHELF_STORAGE_KEY);
    return allBooks.filter((b: ShelfBook) => b.user_id === userId);
};

export const saveShelfBook = async (book: Omit<ShelfBook, 'id' | 'created_at' | 'updated_at'>): Promise<ShelfBook> => {
    const allBooks = getLocalStorage(SHELF_STORAGE_KEY);
    const newBook: ShelfBook = {
        ...book,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    allBooks.push(newBook);
    localStorage.setItem(SHELF_STORAGE_KEY, JSON.stringify(allBooks));
    return newBook;
};

export const updateShelfBook = async (id: string, updates: Partial<ShelfBook>): Promise<ShelfBook | null> => {
    const allBooks = getLocalStorage(SHELF_STORAGE_KEY);
    const index = allBooks.findIndex((b: ShelfBook) => b.id === id);
    if (index === -1) return null;

    allBooks[index] = { ...allBooks[index], ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem(SHELF_STORAGE_KEY, JSON.stringify(allBooks));
    return allBooks[index];
};

export const removeShelfBook = async (id: string): Promise<void> => {
    let allBooks = getLocalStorage(SHELF_STORAGE_KEY);
    allBooks = allBooks.filter((b: ShelfBook) => b.id !== id);
    localStorage.setItem(SHELF_STORAGE_KEY, JSON.stringify(allBooks));
};

export const fetchReadingGoal = async (userId: string, year: number): Promise<ReadingGoal | null> => {
    const allGoals = getLocalStorage(GOAL_STORAGE_KEY);
    return allGoals.find((g: ReadingGoal) => g.user_id === userId && g.year === year) || null;
};

export const saveReadingGoal = async (userId: string, year: number, goalTotal: number): Promise<ReadingGoal> => {
    const allGoals = getLocalStorage(GOAL_STORAGE_KEY);
    const existingIndex = allGoals.findIndex((g: ReadingGoal) => g.user_id === userId && g.year === year);
    const goal: ReadingGoal = { user_id: userId, year, goal_total: goalTotal };
    if (existingIndex !== -1) {
        allGoals[existingIndex] = goal;
    } else {
        allGoals.push(goal);
    }
    localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(allGoals));
    return goal;
}
