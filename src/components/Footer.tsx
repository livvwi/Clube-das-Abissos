import { Heart, Atom } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="py-12 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6">
                <div className="p-3 rounded-full bg-brand-light text-brand-primary">
                    <Atom className="w-6 h-6" />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-600 font-serif text-lg font-bold">Mulheres na Ciência</p>
                    <p className="text-gray-500 flex flex-col md:flex-row items-center justify-center gap-2 text-sm">
                        <span>Desenvolvido por <span className="font-bold text-brand-dark">InovaÍ</span></span>
                        <span className="hidden md:inline w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="flex items-center gap-1">Celebrando a Mulher na Ciência <Heart className="w-3 h-3 text-brand-secondary fill-brand-secondary" /></span>
                    </p>
                </div>
            </div>
        </footer>
    );
};
