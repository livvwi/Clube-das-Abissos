import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Library, Plus, Trash2, Target, BookMarked, User, Check, Edit2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchPersonalShelf, fetchReadingGoal, saveShelfBook, updateShelfBook, removeShelfBook, saveReadingGoal, type ShelfBook } from '../services/shelfService';

interface MyShelfModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MyShelfModal: React.FC<MyShelfModalProps> = ({ isOpen, onClose }) => {
    const { currentUser } = useAuth();
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const [books, setBooks] = useState<ShelfBook[]>([]);
    const [goalTotal, setGoalTotal] = useState<number>(0);
    const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);
    const [goalInput, setGoalInput] = useState<number>(0);

    const [isAddingBook, setIsAddingBook] = useState(false);
    const [newBook, setNewBook] = useState({ title: '', author: '', cover: '', status: 'Quero ler', totalPages: 0 });

    const [editingBookId, setEditingBookId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && currentUser) {
            loadData();
        }
    }, [isOpen, currentUser]);

    useEffect(() => {
        const mainScroll = document.getElementById('main-scroll-container');
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (mainScroll) mainScroll.style.overflow = 'hidden';
            setTimeout(() => modalRef.current?.focus(), 50);
        } else {
            document.body.style.overflow = '';
            if (mainScroll) mainScroll.style.overflow = '';
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.style.overflow = '';
            if (mainScroll) mainScroll.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const loadData = async () => {
        if (!currentUser) return;
        const currentYear = new Date().getFullYear();
        const goalData = await fetchReadingGoal(currentUser.id, currentYear);
        if (goalData) {
            setGoalTotal(goalData.goal_total);
            setGoalInput(goalData.goal_total);
        }

        const shelfData = await fetchPersonalShelf(currentUser.id);
        const sorted = shelfData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setBooks(sorted);
    };

    const handleSaveGoal = async () => {
        if (!currentUser) return;
        const currentYear = new Date().getFullYear();
        await saveReadingGoal(currentUser.id, currentYear, goalInput);
        setGoalTotal(goalInput);
        setIsEditingGoal(false);
    };

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !newBook.title.trim() || !newBook.author.trim() || newBook.totalPages <= 0) return;

        const inserted = await saveShelfBook({
            user_id: currentUser.id,
            book_title: newBook.title,
            book_author: newBook.author,
            book_cover: newBook.cover,
            status: newBook.status as any,
            current_page: 0,
            total_pages: newBook.totalPages,
            progress_note: ''
        });

        setBooks(prev => [inserted, ...prev]);
        setIsAddingBook(false);
        setNewBook({ title: '', author: '', cover: '', status: 'Quero ler', totalPages: 0 });
    };

    const handleUpdateBook = async (id: string, updates: Partial<ShelfBook>) => {
        if (!currentUser) return;

        await updateShelfBook(id, updates);
        setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const handleRemoveBook = async (id: string, title: string) => {
        if (!currentUser) return;
        if (window.confirm(`Tem certeza que deseja remover "${title}" da sua estante?`)) {
            await removeShelfBook(id);
            setBooks(prev => prev.filter(b => b.id !== id));
        }
    };

    if (!isOpen) return null;

    const completedBooks = books.filter(b => b.status === 'Concluído').length;
    const progressPercent = goalTotal > 0 ? Math.min(100, Math.round((completedBooks / goalTotal) * 100)) : 0;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                ref={modalRef}
                className="bg-brand-light w-full max-w-5xl h-[100dvh] md:h-[90vh] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden relative"
                onClick={e => e.stopPropagation()}
                tabIndex={-1}
            >
                <div className="p-4 md:p-6 border-b border-gray-200 bg-white sticky top-0 z-10 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-brand-primary/10 p-2 rounded-xl text-brand-primary hidden sm:block">
                            <Library size={24} />
                        </div>
                        <div>
                            <h2 className="font-serif font-bold text-xl md:text-2xl text-brand-dark">Minha Estante</h2>
                            <p className="text-xs md:text-sm text-brand-secondary">Acompanhe suas leituras e metas pessoais</p>
                        </div>
                    </div>
                    <button
                        ref={closeButtonRef}
                        onClick={onClose}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
                        aria-label="Fechar"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 custom-scrollbar bg-gray-50/30">
                    {!currentUser ? (
                        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-2xl bg-white shadow-sm">
                            <User size={48} className="text-gray-300 mb-4" />
                            <h3 className="text-lg font-bold text-brand-dark mb-2">Faça login para acessar sua estante</h3>
                            <p className="text-brand-secondary text-sm text-center max-w-sm">
                                Este é o seu espaço privado para registrar progressos, comentários e metas de leitura.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* META SECTION */}
                            <section className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg text-brand-dark flex items-center gap-2">
                                        <Target size={20} className="text-brand-primary" />
                                        Meta de Leitura {new Date().getFullYear()}
                                    </h3>
                                    {!isEditingGoal ? (
                                        <button onClick={() => setIsEditingGoal(true)} className="text-sm text-brand-secondary hover:text-brand-primary transition-colors flex items-center gap-1">
                                            <Edit2 size={14} /> Editar Meta
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number" min="0"
                                                value={goalInput}
                                                onChange={e => setGoalInput(parseInt(e.target.value) || 0)}
                                                className="w-16 p-1 border rounded text-center text-sm outline-none focus:border-brand-primary"
                                            />
                                            <button onClick={handleSaveGoal} className="bg-brand-primary text-white p-1 rounded hover:bg-brand-primary/90 transition-colors">
                                                <Check size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 bg-gray-100 h-4 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-brand-primary transition-all duration-1000 ease-out"
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>
                                    <span className="font-bold text-brand-dark min-w-[3rem] text-right">
                                        {completedBooks} / {goalTotal || '?'}
                                    </span>
                                </div>
                                {goalTotal > 0 && <p className="text-xs text-brand-secondary mt-2 text-right">{progressPercent}% concluído</p>}
                            </section>

                            {/* ADD BOOK / LIST HEADER */}
                            <div className="flex justify-between items-end">
                                <h3 className="font-bold text-lg md:text-xl text-brand-dark flex items-center gap-2">
                                    <BookMarked size={20} className="text-brand-primary" />
                                    Meus Livros
                                </h3>
                                <button
                                    onClick={() => setIsAddingBook(!isAddingBook)}
                                    className="bg-brand-primary text-white text-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm hover:shadow-md hover:bg-brand-primary/90 transition-all active:scale-95"
                                >
                                    {isAddingBook ? <X size={16} /> : <Plus size={16} />}
                                    {isAddingBook ? 'Cancelar' : 'Adicionar Livro'}
                                </button>
                            </div>

                            {/* ADD BOOK FORM */}
                            {isAddingBook && (
                                <form onSubmit={handleAddBook} className="bg-white p-5 md:p-6 rounded-2xl shadow-md border border-brand-primary/20 animate-fade-in grid gap-4 grid-cols-1 md:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Título *</label>
                                        <input required type="text" value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary" placeholder="Ex: O Código Da Vinci" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Autor *</label>
                                        <input required type="text" value={newBook.author} onChange={e => setNewBook({ ...newBook, author: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary" placeholder="Ex: Dan Brown" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">URL da Capa (Opcional)</label>
                                        <input type="text" value={newBook.cover} onChange={e => setNewBook({ ...newBook, cover: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary" placeholder="https://..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Pág. *</label>
                                            <input required type="number" min="1" value={newBook.totalPages || ''} onChange={e => setNewBook({ ...newBook, totalPages: parseInt(e.target.value) || 0 })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                                            <select value={newBook.status} onChange={e => setNewBook({ ...newBook, status: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary cursor-pointer">
                                                <option>Quero ler</option>
                                                <option>Lendo</option>
                                                <option>Pausado</option>
                                                <option>Concluído</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 flex justify-end mt-2">
                                        <button type="submit" className="bg-brand-primary text-white font-bold py-2.5 px-6 rounded-xl hover:bg-brand-primary/90 transition-all shadow-sm">
                                            Salvar Livro
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* BOOKS LIST */}
                            {books.length === 0 && !isAddingBook ? (
                                <div className="text-center py-12">
                                    <Library size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p className="text-gray-500 font-medium">Sua estante está vazia.</p>
                                    <p className="text-sm text-gray-400">Clique em "Adicionar Livro" para começar.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                                    {books.map(book => {
                                        const bookProgress = book.total_pages > 0 ? Math.min(100, Math.round((book.current_page / book.total_pages) * 100)) : 0;
                                        const isEditing = editingBookId === book.id;

                                        return (
                                            <div key={book.id} className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 relative group">
                                                <button onClick={() => handleRemoveBook(book.id, book.book_title)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1 bg-white rounded-md shadow-sm">
                                                    <Trash2 size={16} />
                                                </button>

                                                <div className="w-24 h-36 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden shadow-inner flex items-center justify-center relative self-center md:self-start">
                                                    {book.book_cover ? (
                                                        <img src={book.book_cover} alt="Capa" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <BookMarked size={32} className="text-gray-300" />
                                                    )}
                                                </div>

                                                <div className="flex-1 flex flex-col pt-1">
                                                    <h4 className="font-bold text-lg text-brand-dark leading-tight pr-6">{book.book_title}</h4>
                                                    <span className="text-sm text-brand-secondary mb-3">{book.book_author}</span>

                                                    <div className="mb-3">
                                                        <select
                                                            value={book.status}
                                                            onChange={e => handleUpdateBook(book.id, { status: e.target.value as any })}
                                                            className={`text-xs font-bold px-2.5 py-1 rounded-md outline-none cursor-pointer transition-colors ${book.status === 'Concluído' ? 'bg-green-100 text-green-700' :
                                                                book.status === 'Lendo' ? 'bg-blue-100 text-blue-700' :
                                                                    book.status === 'Pausado' ? 'bg-orange-100 text-orange-700' :
                                                                        'bg-gray-100 text-gray-600'
                                                                }`}
                                                        >
                                                            <option>Quero ler</option>
                                                            <option>Lendo</option>
                                                            <option>Pausado</option>
                                                            <option>Concluído</option>
                                                        </select>
                                                    </div>

                                                    <div className="mt-auto space-y-2">
                                                        <div className="flex justify-between text-xs text-brand-secondary">
                                                            <span>Página:
                                                                <input
                                                                    type="number"
                                                                    min="0" max={book.total_pages}
                                                                    value={book.current_page || ''}
                                                                    onChange={(e) => handleUpdateBook(book.id, { current_page: parseInt(e.target.value) || 0 })}
                                                                    className="w-12 ml-1 p-0.5 border-b border-gray-300 text-center outline-none focus:border-brand-primary bg-transparent text-brand-dark font-medium"
                                                                /> / {book.total_pages}
                                                            </span>
                                                            <span className="font-medium">{bookProgress}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                            <div className="h-full bg-brand-primary" style={{ width: `${bookProgress}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="w-full md:w-1/3 flex flex-col md:border-l border-gray-100 md:pl-4 mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-semibold uppercase text-brand-secondary tracking-wider">Diário</span>
                                                        <button
                                                            onClick={() => setEditingBookId(isEditing ? null : book.id)}
                                                            className="text-brand-primary p-1 hover:bg-brand-primary/10 rounded"
                                                        >
                                                            {isEditing ? <Check size={14} /> : <Edit2 size={14} />}
                                                        </button>
                                                    </div>
                                                    {isEditing ? (
                                                        <textarea
                                                            className="w-full flex-1 p-2 text-sm bg-brand-primary/5 border border-brand-primary/20 rounded-lg outline-none resize-none min-h-[80px]"
                                                            placeholder="Como está sendo a leitura?"
                                                            value={book.progress_note || ''}
                                                            onChange={e => handleUpdateBook(book.id, { progress_note: e.target.value })}
                                                            onBlur={() => setEditingBookId(null)}
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <p className="text-sm text-gray-600 line-clamp-4 italic bg-gray-50 p-2 rounded-lg flex-1 cursor-pointer min-h-[80px]" onClick={() => setEditingBookId(book.id)}>
                                                            {book.progress_note ? `"${book.progress_note}"` : <span className="text-gray-400 not-italic">Adicione um comentário...</span>}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};
