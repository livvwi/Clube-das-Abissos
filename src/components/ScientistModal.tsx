import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, User, Lightbulb } from 'lucide-react';
import type { Scientist } from '../data';

interface ScientistModalProps {
    scientist: Scientist | null;
    onClose: () => void;
}

export const ScientistModal = ({ scientist, onClose }: ScientistModalProps) => {
    if (!scientist) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl z-10 flex flex-col md:flex-row overflow-hidden"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-colors z-20"
                    >
                        <X className="w-6 h-6 text-gray-800" />
                    </button>

                    {/* Side Image / Banner */}
                    <div className="w-full md:w-1/3 bg-brand-primary/10 relative min-h-[250px] md:min-h-full">
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 p-0">
                            {/* Placeholder for Image */}
                            {scientist.imageUrl ? (
                                <img src={scientist.imageUrl} alt={scientist.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-gray-400 text-center">
                                    <User className="w-24 h-24 mx-auto mb-4 opacity-50 text-gray-300" />
                                    <span className="text-sm uppercase tracking-widest font-bold">Imagem Indisponível</span>
                                </div>
                            )}

                            {/* Text protection gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                            <div className="absolute bottom-6 left-6 text-white z-10">
                                <span className="text-xs font-bold uppercase tracking-wider opacity-80 block mb-1">{scientist.field}</span>
                                <h2 className="text-3xl font-serif font-bold leading-tight">{scientist.name}</h2>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8 md:p-12 text-gray-800">

                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-3 text-brand-primary font-bold uppercase text-xs tracking-wider">
                                <User className="w-4 h-4" /> Trajetória
                            </div>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {scientist.lifeStory}
                            </p>
                        </div>

                        <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-4 text-brand-secondary font-bold uppercase text-xs tracking-wider">
                                <BookOpen className="w-4 h-4" /> Principais Trabalhos
                            </div>
                            <ul className="space-y-3">
                                {scientist.keyWorks.map((work, idx) => (
                                    <li key={idx} className="flex gap-3 text-gray-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-2 shrink-0" />
                                        <span>{work}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-3 text-yellow-600 font-bold uppercase text-xs tracking-wider">
                                <Lightbulb className="w-4 h-4" /> Legado & Impacto
                            </div>
                            <p className="text-gray-600 leading-relaxed italic border-l-4 border-yellow-400 pl-4 py-1">
                                "{scientist.scienceImpact}"
                            </p>
                        </div>

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
