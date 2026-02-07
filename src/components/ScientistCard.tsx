import { motion } from 'framer-motion';
import { Microscope, Code, FlaskConical, Calculator, Award, Brain, Leaf, Dna, ArrowRight, User } from 'lucide-react';
import type { Scientist } from '../data';

const icons = {
    "Física / Química": FlaskConical,
    "Computação": Code,
    "Biologia": Dna,
    "Matemática": Calculator,
    "Biologia / Diplomacia": Award,
    "Agronomia": Leaf,
    "Biomedicina": Microscope,
    "Psiquiatria": Brain,
};

interface ScientistCardProps {
    scientist: Scientist;
    index: number;
    onClick: (scientist: Scientist) => void;
}

export const ScientistCard = ({ scientist, index, onClick }: ScientistCardProps) => {
    const Icon = icons[scientist.field as keyof typeof icons] || Microscope;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
            className="group h-full cursor-pointer"
            onClick={() => onClick(scientist)}
        >
            <div className="relative h-full p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-xl origin-left z-10" />

                {/* Image Placeholder Area */}
                <div className="w-full h-40 bg-gray-100 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative">
                    {scientist.imageUrl ? (
                        <img src={scientist.imageUrl} alt={scientist.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                        <div className="flex flex-col items-center text-gray-300 group-hover:text-brand-primary/50 transition-colors">
                            <User className="w-12 h-12 mb-2" />
                            <span className="text-xs uppercase font-bold tracking-widest">Foto</span>
                        </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white/90 text-brand-dark px-3 py-1 rounded-full text-xs font-bold shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-transform">Ver Perfil</span>
                    </div>
                </div>

                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-lg bg-brand-light text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                        <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest py-1 px-2 rounded bg-gray-50 border border-gray-100">{scientist.field}</span>
                </div>

                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 group-hover:text-brand-primary transition-colors">
                    {scientist.name}
                </h3>

                <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed line-clamp-3">
                    {scientist.description}
                </p>

                <div className="pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-2 text-xs font-semibold text-brand-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {scientist.achievement}
                        <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
