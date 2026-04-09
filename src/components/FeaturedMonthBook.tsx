import React from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { getMonthName } from '../data';

interface FeaturedMonthBookProps {
    monthKey: string;
    book: {
        id: number;
        title: string;
        author: string;
        cover: string;
        synopsis?: string;
        category?: string;
    };
    onReviewClick: () => void;
}

export const FeaturedMonthBook: React.FC<FeaturedMonthBookProps> = ({ monthKey, book, onReviewClick }) => {
    return (
        <section className="mb-12 w-full">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">📚</span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-dark">
                    Livro do Mês – {getMonthName(monthKey)}
                </h2>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-brand-primary/10 flex flex-col md:flex-row gap-8 relative overflow-hidden transition-all hover:shadow-md">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 flex justify-center">
                    <img 
                        src={book.cover || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop'} 
                        alt={`Capa do livro ${book.title}`}
                        className="w-48 md:w-full max-w-[240px] aspect-[2/3] object-cover rounded-xl shadow-lg border border-brand-primary/20 transform transition-transform duration-500 hover:scale-[1.02]"
                    />
                </div>

                <div className="flex-1 flex flex-col justify-center z-10">
                    {book.category && (
                        <div className="mb-3 flex flex-wrap gap-2">
                            <span className="bg-brand-primary/10 text-brand-primary text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase">
                                {book.category}
                            </span>
                        </div>
                    )}
                    
                    <h3 className="text-3xl sm:text-4xl font-serif font-extrabold text-brand-dark mb-2 leading-tight">
                        {book.title}
                    </h3>
                    <p className="text-lg text-brand-secondary font-medium mb-6">
                        Por <span className="text-brand-primary">{book.author}</span>
                    </p>
                    
                    <div className="bg-brand-light p-5 rounded-2xl mb-8 border border-gray-100">
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            {book.synopsis}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                        <button 
                            onClick={onReviewClick}
                            className="bg-brand-primary text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:bg-brand-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                        >
                            Escrever Resenha
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        <a 
                            href={`https://www.amazon.com.br/s?k=${encodeURIComponent(book.title + ' ' + book.author)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-brand-primary border-2 border-brand-primary/20 font-bold py-3 px-6 rounded-xl hover:bg-brand-primary/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            Ver na Amazon
                            <ExternalLink size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
