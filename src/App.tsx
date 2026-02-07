import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { BookCard } from './components/BookCard';
import { CommunityPanel } from './components/CommunityPanel';
import { Search, Bell, ChevronRight } from 'lucide-react';

// Mock Data


const januaryBooks = [
  { id: 1, title: 'Elite de Prata', author: 'Dani Francis', cover: 'https://m.media-amazon.com/images/I/81tycP3bo7L._SY466_.jpg' },

];

const februaryBooks = [
  { id: 1, title: 'Anjos e Demônios', author: 'Dan Brown', cover: 'https://m.media-amazon.com/images/I/51MWbI+i+XL._SY425_.jpg' },

];


function App() {
  const [activeTab, setActiveTab] = useState('home');


  return (
    <div className="flex min-h-screen bg-brand-light font-sans text-brand-dark overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="px-8 py-6 flex justify-between items-center bg-transparent">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary" size={20} />
            <input
              type="text"
              placeholder="Buscar Livros e Autores"
              className="w-full bg-white pl-12 pr-4 py-3 rounded-2xl border-none outline-none shadow-sm focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm placeholder-brand-secondary/70"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative bg-white p-3 rounded-2xl shadow-sm text-brand-secondary hover:text-brand-primary transition-colors">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <button className="flex items-center gap-3 bg-brand-primary text-white pl-1 pr-4 py-1.5 rounded-2xl shadow-lg hover:bg-brand-primary/90 transition-colors">
              <img src="https://i.pravatar.cc/150?u=user" alt="Profile" className="w-8 h-8 rounded-xl bg-white/20" />
              <span className="font-medium text-sm">Olá, Leitor</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-12">



          {/* Popular Section */}
          <section className="mb-10">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-serif font-bold text-brand-dark">Livro do Mês de Janeiro</h2>
              <button className="flex items-center text-sm font-medium text-brand-secondary hover:text-brand-primary transition-colors gap-1 group">
                Ver Todos <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide">
              {januaryBooks.map((book) => (
                <BookCard
                  key={book.id}
                  title={book.title}
                  author={book.author}
                  coverUrl={book.cover}

                />
              ))}
            </div>
          </section>

          {/* February Section */}
          <section className="mb-10">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-serif font-bold text-brand-dark">Livro do Mês de Fevereiro</h2>
              <button className="flex items-center text-sm font-medium text-brand-secondary hover:text-brand-primary transition-colors gap-1 group">
                Ver Todos <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide">
              {februaryBooks.map((book) => (
                <BookCard
                  key={book.id}
                  title={book.title}
                  author={book.author}
                  coverUrl={book.cover}

                />
              ))}
            </div>
          </section>



        </div>
      </main>

      <CommunityPanel />
    </div>
  );
}

export default App;
