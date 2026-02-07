import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export const Hero = () => {
    const scrollToContent = () => {
        document.getElementById('pioneers')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden bg-brand-light">

            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-purple-100/50 to-transparent -z-0 rounded-bl-[200px]" />
            <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-tr from-pink-100/50 to-transparent -z-0 rounded-tr-[200px]" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 max-w-4xl flex flex-col items-center"
            >
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="inline-block py-2 px-6 rounded-full bg-brand-primary/10 text-brand-primary font-bold text-sm tracking-wider uppercase mb-6"
                >
                    Rede de Conhecimento
                </motion.span>

                <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-8 text-brand-dark">
                    Elas Codificaram <br />
                    <span className="text-brand-primary">o Universo</span>
                </h1>

                <p className="text-lg md:text-2xl text-gray-600 mb-16 max-w-2xl mx-auto leading-relaxed font-light">
                    De algoritmos pioneiros ao mapeamento do DNA, conheça as mulheres que redefiniram as fronteiras da ciência e da humanidade.
                </p>

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{
                        opacity: { delay: 1, duration: 0.5 },
                        y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                    }}
                    onClick={scrollToContent}
                    className="group flex flex-col items-center gap-2 text-gray-400 hover:text-brand-primary transition-colors cursor-pointer"
                    aria-label="Rolar para baixo"
                >
                    <span className="text-sm font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Descobrir</span>
                    <div className="p-3 rounded-full border border-gray-200 group-hover:border-brand-primary/30 group-hover:bg-brand-primary/5 transition-all">
                        <ArrowDown className="w-6 h-6" />
                    </div>
                </motion.button>

            </motion.div>
        </section>
    );
};
