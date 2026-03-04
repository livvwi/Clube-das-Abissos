import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, User, BookOpen, Calendar, Star, PenBox } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Review } from './ReviewsModal';
import { booksByMonth } from '../data';

interface Book {
    id: number;
    title: string;
    author: string;
    cover: string;
    synopsis?: string;
    releaseDate?: string;
    pages?: number;
}

interface BookDetailsModalProps {
    book: Book | null;
    isOpen: boolean;
    onClose: () => void;
    onWriteReview?: (monthKey: string, bookId: number) => void;
}

const STORAGE_KEY = 'clube_abissos_reviews_v1';

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ book, isOpen, onClose, onWriteReview }) => {
    const { currentUser } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);

    const loadBookReviews = useCallback(() => {
        if (!book) return;
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const allReviews: Review[] = JSON.parse(saved);
                const filtered = allReviews.filter(r => r.bookId === book.id);
                // Sort by date desc
                filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setReviews(filtered);
            }
        } catch (e) {
            console.error("Failed to load reviews inside book modal", e);
        }
    }, [book]);

    useEffect(() => {
        if (isOpen && book) {
            loadBookReviews();
        }
    }, [isOpen, book, loadBookReviews]);

    useEffect(() => {
        const handleUpdate = () => loadBookReviews();
        window.addEventListener('reviews:updated', handleUpdate);
        return () => window.removeEventListener('reviews:updated', handleUpdate);
    }, [loadBookReviews]);

    useEffect(() => {
        const mainScroll = document.getElementById('main-scroll-container');
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (mainScroll) mainScroll.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            if (mainScroll) mainScroll.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            if (mainScroll) mainScroll.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen || !book) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] rounded-2xl shadow-2xl flex flex-col relative mt-auto md:mt-0"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors z-10"
                    aria-label="Fechar"
                >
                    <X size={20} />
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 pb-safe-bottom">
                    {/* Top Section: Cover & Details */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8 md:mb-10 pb-8 md:pb-10 border-b border-gray-100">
                        {/* Left: Cover */}
                        <div className="w-full md:w-1/3 flex-shrink-0 flex justify-center items-start">
                            <img
                                src={book.cover}
                                alt={book.title}
                                className="w-32 md:w-full h-auto max-h-[200px] md:max-h-[450px] rounded-xl shadow-md object-contain"
                            />
                        </div>

                        {/* Right: Details */}
                        <div className="w-full md:w-2/3 flex flex-col mt-2 md:mt-4">
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark leading-tight mb-2 text-center md:text-left">
                                {book.title}
                            </h2>

                            <p className="text-brand-primary font-medium flex items-center justify-center md:justify-start gap-2 mb-6">
                                <User size={16} />
                                {book.author}
                            </p>

                            {book.synopsis && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-brand-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <BookOpen size={16} /> Sinopse
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed text-justify">
                                        {book.synopsis}
                                    </p>
                                </div>
                            )}

                            {(book.releaseDate || book.pages) && (
                                <div className="mt-auto grid grid-cols-2 gap-4 bg-brand-light p-4 rounded-xl border border-brand-primary/10">
                                    {book.releaseDate && (
                                        <div>
                                            <span className="block text-xs text-brand-secondary uppercase tracking-wider mb-1">Lançamento</span>
                                            <span className="font-medium text-brand-dark flex items-center gap-2">
                                                <Calendar size={14} className="text-brand-primary" />
                                                {book.releaseDate}
                                            </span>
                                        </div>
                                    )}
                                    {book.pages && (
                                        <div>
                                            <span className="block text-xs text-brand-secondary uppercase tracking-wider mb-1">Páginas</span>
                                            <span className="font-medium text-brand-dark flex items-center gap-2">
                                                <BookOpen size={14} className="text-brand-primary" />
                                                {book.pages} páginas
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Section: Reviews */}
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
                            <h3 className="text-lg md:text-xl font-serif font-bold text-brand-dark flex items-center gap-2">
                                Resenhas deste livro
                            </h3>
                            <button
                                onClick={() => {
                                    if (!currentUser) return;
                                    const monthKey = Object.keys(booksByMonth).find(m => booksByMonth[m].some(b => b.id === book.id)) || '2026-01';
                                    if (onWriteReview) onWriteReview(monthKey, book.id);
                                }}
                                disabled={!currentUser}
                                className="flex items-center justify-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-brand-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                            >
                                <PenBox size={16} />
                                {currentUser ? "Escrever resenha deste livro" : "Faça login para postar"}
                            </button>
                        </div>

                        {reviews.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <Star size={32} className="mx-auto mb-2 text-gray-300" />
                                <p className="text-gray-500 font-medium">Ainda não há resenhas para este livro.</p>
                                <p className="text-sm text-gray-400 mt-1">Seja o primeiro a compartilhar sua opinião!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reviews.map(review => (
                                    <div key={review.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <img src={review.user.avatarUrl} alt={review.user.name} className="w-8 h-8 rounded-full border border-gray-100 object-cover" />
                                                <div>
                                                    <p className="font-semibold text-sm text-brand-dark leading-tight">{review.user.name}</p>
                                                    <p className="text-xs text-brand-secondary">@{review.user.username}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star
                                                        key={star}
                                                        size={12}
                                                        className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                                            <Calendar size={10} />
                                            {new Date(review.date).toLocaleDateString()} às {new Date(review.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>

                                        <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                            {review.spoiler && (
                                                <div className="mb-2">
                                                    <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Sem spoilers</span>
                                                    {/* The text says "sem spoilers" but form means "contains spoilers", updating to respect the label meaning "Contém spoilers" in form */}
                                                </div>
                                            )}
                                            {/* Quick fix for the spoiler toggle: In ReviewsModal it says "Contém spoilers?" so we should render "Com spoilers" if true. */}
                                            {review.spoiler ? (
                                                <>
                                                    <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mr-2 align-middle">Alerta de Spoiler</span>
                                                    <span className="italic">"{review.text}"</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mr-2 align-middle">Sem Spoilers</span>
                                                    <span>"{review.text}"</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
