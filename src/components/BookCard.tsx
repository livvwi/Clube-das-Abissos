import React from 'react';
import { Bookmark } from 'lucide-react';

interface BookProps {
    title: string;
    author: string;
    coverUrl: string;
    featured?: boolean;
    indicatedBy?: string;
    onClick?: () => void;
}

export const BookCard: React.FC<BookProps> = ({ title, author, coverUrl, featured = false, indicatedBy, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`group relative flex-shrink-0 transition-transform duration-300 hover:-translate-y-2 cursor-pointer ${featured ? 'w-full md:w-[400px]' : 'w-48'} bg-transparent dark:!bg-slate-800 dark:md:!bg-transparent p-0 dark:!p-3 dark:md:!p-0 rounded-none dark:!rounded-[1.5rem] dark:md:!rounded-none`}
        >
            <div className={`relative rounded-2xl overflow-hidden shadow-lg ${featured ? 'aspect-[16/9]' : 'aspect-[2/3]'}`}>
                <img
                    src={coverUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-brand-primary transition-colors">
                    <Bookmark size={18} fill="currentColor" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>

            <div className="mt-4 px-1 dark:!px-2 dark:md:!px-0">
                <h3 className={`font-serif font-bold text-brand-dark dark:!text-white dark:md:!text-brand-dark leading-tight ${featured ? 'text-2xl' : 'text-lg'}`}>
                    {title}
                </h3>
                <p className="text-brand-secondary text-sm mt-1 dark:!text-slate-300 dark:md:!text-brand-secondary">{author}</p>
                {indicatedBy && (
                    <p className="text-brand-secondary text-xs mt-0.5 opacity-80 italic dark:!text-slate-300 dark:md:!text-brand-secondary">
                        ✦ Indicado por {indicatedBy}
                    </p>
                )}
            </div>
        </div>
    );
};
