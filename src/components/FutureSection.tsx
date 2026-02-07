import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { katieBouman } from '../data';
import type { Scientist } from '../data';

interface FutureSectionProps {
    onScientistClick: (scientist: Scientist) => void;
}

export const FutureSection = ({ onScientistClick }: FutureSectionProps) => {
    return (
        <section className="py-24 px-4 relative overflow-hidden">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full"
                >
                    <div className="relative p-8 md:p-12 bg-gray-100 rounded-3xl overflow-hidden shadow-lg text-gray-800 border border-gray-200">
                        {/* Decorative Gradient - Adjusted for light background */}
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-brand-secondary/10 to-transparent opacity-50" />

                        <div className="relative z-10 text-center md:text-left">
                            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                                <Star className="w-8 h-8 text-brand-accent fill-brand-accent" />
                                <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Inspiração</span>
                            </div>

                            <h3 className="text-3xl font-serif font-bold mb-4 text-brand-dark">O Futuro é Agora</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                                Assim como <button
                                    onClick={() => onScientistClick(katieBouman)}
                                    className="font-bold text-brand-primary border-b-2 border-brand-primary/30 hover:border-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer px-1 -mx-1 rounded"
                                >
                                    Katie Bouman
                                </button>, que desenvolveu o algoritmo para capturar a primeira imagem de um buraco negro, novas cientistas estão reescrevendo nossa compreensão do universo todos os dias.
                            </p>
                            <div className="flex items-center gap-2 text-brand-accent font-medium text-sm uppercase tracking-wide justify-center md:justify-start">
                                <Sparkles className="w-4 h-4" /> Evolução Contínua
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
