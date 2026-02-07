import { motion } from 'framer-motion';
import type { Scientist } from '../data';
import { ScientistCard } from './ScientistCard';

interface BrazilSectionProps {
    scientists: Scientist[];
    onScientistClick: (scientist: Scientist) => void;
}

export const BrazilSection = ({ scientists, onScientistClick }: BrazilSectionProps) => {
    return (
        <section className="py-24 px-4 bg-green-50/50 border-y border-green-100 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-green-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute left-0 bottom-0 w-96 h-96 bg-yellow-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block py-1 px-4 rounded-full bg-green-100 text-green-700 font-bold tracking-widest text-xs uppercase mb-4">
                        Ciência Nacional
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                        Potências <span className="text-green-600">Brasileiras</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Mulheres que colocaram o Brasil no mapa da ciência mundial com descobertas revolucionárias e impacto social.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {scientists.map((scientist, index) => (
                        <ScientistCard key={scientist.id} scientist={scientist} index={index} onClick={onScientistClick} />
                    ))}
                </div>
            </div>
        </section>
    );
};
