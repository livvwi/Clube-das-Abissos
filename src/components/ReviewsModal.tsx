
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Star, Trash2, BookOpen, User, Calendar, ChevronDown } from 'lucide-react';
import { booksByMonth, getMonthName } from '../data';
import { useAuth } from '../contexts/AuthContext';

// --- Interfaces ---
export interface Review {
    id: string;
    monthKey: string;
    bookId: number;
    bookTitle: string;
    bookAuthor: string;
    rating: number; // 0 to 5
    text: string;
    date: string;
    spoiler?: boolean;
    user: {
        id: string;
        name: string;
        username: string;
        avatarUrl: string;
    };
}

interface ReviewsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// --- LocalStorage Helpers ---
const STORAGE_KEY = 'clube_abissos_reviews_v1';

const loadReviews = (): Review[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error("Erro ao carregar resenhas:", error);
        return [];
    }
};

const saveReviewsToStorage = (reviews: Review[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch (error) {
        console.error("Erro ao salvar resenhas:", error);
    }
};

// --- Component ---
export const ReviewsModal: React.FC<ReviewsModalProps> = ({ isOpen, onClose }) => {
    const { currentUser } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    // Use currently available months from data
    const availableMonths = Object.keys(booksByMonth).sort();
    // Default to the first month or a specific one? Let's default to the current month if available, else first.
    // For now, hardcode '2026-01' or pick dynamically. user asked for 'selector'.
    const [selectedMonth, setSelectedMonth] = useState(availableMonths[0] || '2026-01');

    const [form, setForm] = useState({
        bookId: 0,
        rating: 0,
        text: '',
        spoiler: false,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // --- Effects ---

    // Load reviews on mount
    useEffect(() => {
        setReviews(loadReviews());
    }, []);

    // Handle Overflow & Escape key
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Focus modal on open
            setTimeout(() => modalRef.current?.focus(), 50);
        } else {
            document.body.style.overflow = '';
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // --- Helpers ---

    const getBooksForMonth = (month: string) => booksByMonth[month] || [];

    const filteredReviews = reviews.filter(r => r.monthKey === selectedMonth);

    // --- Handlers ---

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.bookId) newErrors.bookId = "Selecione um livro";
        if (form.rating === 0) newErrors.rating = "A nota é obrigatória";
        if (!form.text.trim()) newErrors.text = "A resenha é obrigatória";
        else if (form.text.length < 15) newErrors.text = "Mínimo de 15 caracteres";
        else if (form.text.length > 2000) newErrors.text = "Máximo de 2000 caracteres";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        if (!currentUser) return;
        setIsSubmitting(true);

        const book = getBooksForMonth(selectedMonth).find(b => b.id === form.bookId);
        if (!book) {
            setIsSubmitting(false); // Should not happen
            return;
        }

        const newReview: Review = {
            id: Date.now().toString(),
            monthKey: selectedMonth,
            bookId: book.id,
            bookTitle: book.title,
            bookAuthor: book.author,
            rating: form.rating,
            text: form.text,
            date: new Date().toISOString(),
            spoiler: form.spoiler,
            user: {
                id: currentUser.id,
                name: currentUser.name,
                username: currentUser.username,
                avatarUrl: currentUser.avatarUrl
            }
        };

        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);
        saveReviewsToStorage(updatedReviews); // Persist

        // Reset form
        setForm({
            bookId: 0,
            rating: 0,
            text: '',
            spoiler: false,
        });
        setErrors({});
        setIsSubmitting(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta resenha?")) {
            const updated = reviews.filter(r => r.id !== id);
            setReviews(updated);
            saveReviewsToStorage(updated);
        }
    };

    /* Render Helpers */
    const renderStars = (count: number, interactive = false, setRate?: (r: number) => void) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={interactive ? 24 : 16}
                        className={`${star <= count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
                        onClick={() => interactive && setRate && setRate(star)}
                        fill={star <= count ? "currentColor" : "none"}
                    />
                ))}
            </div>
        );
    };

    if (!isOpen) return null;

    const currentBooks = getBooksForMonth(selectedMonth);
    const selectedBookDetails = currentBooks.find(b => b.id === form.bookId);

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                ref={modalRef}
                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative"
                onClick={e => e.stopPropagation()} // Prevent close on modal click
                tabIndex={-1}
            >
                {/* Close Button */}
                <button
                    ref={closeButtonRef}
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors z-10"
                    aria-label="Fechar"
                >
                    <X size={20} />
                </button>

                {/* --- Left Column: Posts List --- */}
                <div className="w-full md:w-3/5 bg-gray-50 flex flex-col border-r border-gray-100 h-[50vh] md:h-auto">
                    <div className="p-6 border-b border-gray-200 bg-white sticky top-0 z-10 space-y-3">
                        <h2 id="modal-title" className="font-serif font-bold text-2xl text-brand-primary">Resenhas do Clube</h2>

                        {/* Month Selector */}
                        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
                            {availableMonths.map(month => (
                                <button
                                    key={month}
                                    onClick={() => setSelectedMonth(month)}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedMonth === month
                                        ? 'bg-white text-brand-primary shadow-sm'
                                        : 'text-gray-500 hover:text-brand-dark'
                                        }`}
                                >
                                    {getMonthName(month)}
                                </button>
                            ))}
                        </div>

                        <p className="text-sm text-gray-500">{filteredReviews.length} resenhas em {getMonthName(selectedMonth)}</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        {filteredReviews.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
                                <p>Nenhuma resenha em {getMonthName(selectedMonth)}. <br />Seja o primeiro a postar!</p>
                            </div>
                        ) : (
                            filteredReviews.map(review => (
                                <div key={review.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-brand-primary leading-tight">{review.bookTitle}</h3>
                                            <span className="text-sm text-brand-secondary">de {review.bookAuthor}</span>
                                        </div>
                                        {renderStars(review.rating)}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 mt-2">
                                        <img src={review.user.avatarUrl} alt={review.user.name} className="w-5 h-5 rounded-full" />
                                        <span className="font-semibold text-gray-600">
                                            {review.user.name} <span className="font-normal text-gray-400">(@{review.user.username})</span>
                                        </span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} /> {new Date(review.date).toLocaleDateString()}
                                        </span>
                                        {/* Optional delete button for cleanup/demo */}
                                        <button onClick={() => handleDelete(review.id)} className="ml-auto text-red-300 hover:text-red-500 p-1" title="Excluir">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 whitespace-pre-line relative">
                                        {review.spoiler && (
                                            <div className="mb-2">
                                                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Spoiler Alert</span>
                                            </div>
                                        )}
                                        "{review.text}"
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* --- Right Column: Post Form --- */}
                <div className="w-full md:w-2/5 flex flex-col h-[50vh] md:h-auto overflow-y-auto md:overflow-visible">
                    <div className="p-6 bg-white flex-1">
                        <h3 className="font-bold text-xl text-brand-dark mb-6 flex items-center gap-2">
                            <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">✎</span>
                            Nova Resenha
                        </h3>

                        <p className="text-sm text-gray-500 mb-4 bg-brand-light p-3 rounded-lg border border-brand-primary/10">
                            Resenhando para: <span className="font-bold text-brand-primary">{getMonthName(selectedMonth)}</span>
                        </p>

                        {!currentUser ? (
                            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                <User size={48} className="text-gray-300 mb-3" />
                                <p className="text-gray-500 font-medium mb-2">Faça login para postar sua resenha</p>
                                <p className="text-xs text-gray-400 text-center px-6">
                                    Participe da discussão com Letícia, Julianna e Lívia!
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Selecionar Livro *</label>
                                    <div className="relative">
                                        <select
                                            value={form.bookId}
                                            onChange={e => setForm({ ...form, bookId: Number(e.target.value) })}
                                            className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 appearance-none transition-all ${errors.bookId ? 'border-red-500' : 'border-gray-200'}`}
                                        >
                                            <option value={0}>Selecione um livro...</option>
                                            {currentBooks.map(book => (
                                                <option key={book.id} value={book.id}>
                                                    {book.title}
                                                </option>
                                            ))}
                                            {currentBooks.length === 0 && <option disabled>Sem livros neste mês</option>}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                    {errors.bookId && <p className="text-red-500 text-xs mt-1">{errors.bookId}</p>}

                                    {/* Auto-filled Author Display */}
                                    {selectedBookDetails && (
                                        <p className="text-xs text-brand-secondary mt-2 px-1 flex items-center gap-1">
                                            <User size={12} />
                                            Autor: <span className="font-semibold text-brand-primary">{selectedBookDetails.author}</span>
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Avaliação *</label>
                                    <div className="flex gap-2 items-center">
                                        {renderStars(form.rating, true, (r) => setForm({ ...form, rating: r }))}
                                        <span className="text-sm text-gray-500 ml-2 font-medium">{form.rating > 0 ? form.rating + '/5' : 'Selecione'}</span>
                                    </div>
                                    {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sua opinião *</label>
                                    <textarea
                                        value={form.text}
                                        onChange={e => setForm({ ...form, text: e.target.value })}
                                        className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 h-32 resize-none transition-all ${errors.text ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="O que você achou do livro? (mín. 15 caracteres)"
                                    ></textarea>
                                    <div className="flex justify-between mt-1">
                                        {errors.text && <p className="text-red-500 text-xs">{errors.text}</p>}
                                        <p className={`text-xs ml-auto ${form.text.length > 2000 ? 'text-red-500' : 'text-gray-400'}`}>
                                            {form.text.length}/2000
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="spoiler"
                                        checked={form.spoiler}
                                        onChange={e => setForm({ ...form, spoiler: e.target.checked })}
                                        className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
                                    />
                                    <label htmlFor="spoiler" className="text-sm text-gray-600 select-none cursor-pointer">Contém spoilers?</label>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || currentBooks.length === 0}
                                        className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-brand-primary/90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Publicando...' : 'Publicar Resenha'}
                                    </button>
                                </div>

                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
