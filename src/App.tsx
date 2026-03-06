import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { BookCard } from './components/BookCard';
import { ReviewsModal } from './components/ReviewsModal';
import { Search, Bell, ChevronRight, LogIn, LogOut, Moon, Sun } from 'lucide-react';
import { booksByMonth } from './data';
import { useAuth } from './contexts/AuthContext';
import { usePreferences } from './contexts/PreferencesContext';
import { LoginModal } from './components/LoginModal';
import { BookDetailsModal } from './components/BookDetailsModal';
import { useNotifications } from './contexts/NotificationsContext';
import { NotificationsDropdown } from './components/NotificationsDropdown';
import { supabase } from './lib/supabaseClient';

const januaryBooks = booksByMonth['2026-01'] || [];
const februaryBooks = booksByMonth['2026-02'] || [];
const marchBooks = booksByMonth['2026-03'] || [];

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  synopsis?: string;
  releaseDate?: string;
  pages?: number;
}

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [targetReviewMonth, setTargetReviewMonth] = useState<string | null>(null);
  const [targetReviewId, setTargetReviewId] = useState<string | null>(null);
  const [targetBookId, setTargetBookId] = useState<number | null>(null);

  const { currentUser, logout, loading } = useAuth();
  const { preferences, toggleTheme } = usePreferences();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    console.log("Supabase conectado:", supabase);
  }, []);

  // Better approach: Derived state for the modal
  const showLoginModal = isLoginOpen || (!loading && !currentUser);
  const isLoginRequired = !loading && !currentUser ? true : false;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-brand-light font-sans text-brand-dark overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenReviews={() => setIsReviewsOpen(true)}
        />
      </div>

      <main className="flex-1 flex flex-col h-screen overflow-hidden pb-16 md:pb-0 relative w-full">
        {/* Top Bar */}
        <header className="px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center bg-brand-light/90 md:bg-transparent backdrop-blur-md sticky top-0 md:relative z-20 gap-4 md:gap-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary" size={20} />
            <input
              type="text"
              placeholder="Buscar Livros e Autores"
              className="w-full bg-white pl-12 pr-4 py-3 rounded-2xl border-none outline-none shadow-sm focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm placeholder-brand-secondary/70"
            />
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-6">
            <div className="flex gap-2 md:gap-4">
              <button
                onClick={toggleTheme}
                className="relative bg-white p-3 rounded-2xl shadow-sm text-brand-secondary hover:text-brand-primary transition-colors flex-shrink-0"
                title={preferences.theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
              >
                {preferences.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                id="bell-button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative bg-white p-3 rounded-2xl shadow-sm text-brand-secondary hover:text-brand-primary transition-colors flex-shrink-0"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 md:gap-3 bg-brand-primary text-white pl-1 pr-3 md:pr-4 py-1.5 rounded-2xl shadow-lg hover:bg-brand-primary/90 transition-colors group cursor-pointer flex-shrink-0">
              {currentUser ? (
                <>
                  <img src={currentUser.avatarUrl} alt="Profile" className="w-8 h-8 rounded-xl bg-white/20 object-cover" />
                  <span className="font-medium text-xs md:text-sm hidden sm:block">Olá, {currentUser.name.split(' ')[0]}</span>
                  <div className="w-px h-4 bg-white/20 mx-1"></div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      logout();
                    }}
                    title="Sair"
                    className="opacity-70 hover:opacity-100 hover:text-red-200 transition-all p-1"
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <button
                  className="flex items-center gap-2 cursor-pointer h-full text-left p-0.5"
                  onClick={() => setIsLoginOpen(true)}
                >
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <LogIn size={15} />
                  </div>
                  <span className="font-medium text-xs md:text-sm hidden sm:block whitespace-nowrap">Entrar</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div id="main-scroll-container" className="flex-1 overflow-y-auto px-4 md:px-8 pb-12 block">



          {/* Popular Section */}
          <section className="mb-10 w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-4 sm:mb-6 gap-2 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-dark truncate pr-4">Livro do Mês de Janeiro</h2>
              <button className="flex items-center w-fit text-sm font-medium text-brand-secondary hover:text-brand-primary transition-colors gap-1 group whitespace-nowrap">
                Ver Todos <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform border border-transparent" />
              </button>
            </div>

            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 sm:pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 custom-scrollbar scroll-smooth snap-x snap-mandatory">
              {januaryBooks.map((book) => (
                <div key={book.id} className="snap-start shrink-0 w-[140px] sm:w-[180px]">
                  <BookCard
                    title={book.title}
                    author={book.author}
                    coverUrl={book.cover}
                    onClick={() => setSelectedBook(book)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* February Section */}
          <section className="mb-10 w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-4 sm:mb-6 gap-2 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-dark truncate pr-4">Livro do Mês de Fevereiro</h2>
              <button className="flex items-center w-fit text-sm font-medium text-brand-secondary hover:text-brand-primary transition-colors gap-1 group whitespace-nowrap">
                Ver Todos <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 sm:pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 custom-scrollbar scroll-smooth snap-x snap-mandatory">
              {februaryBooks.map((book) => (
                <div key={book.id} className="snap-start shrink-0 w-[140px] sm:w-[180px]">
                  <BookCard
                    title={book.title}
                    author={book.author}
                    coverUrl={book.cover}
                    onClick={() => setSelectedBook(book)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* March Section */}
          <section className="mb-10 w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-4 sm:mb-6 gap-2 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-dark truncate pr-4">Livro do Mês de Março</h2>
              <button className="flex items-center w-fit text-sm font-medium text-brand-secondary hover:text-brand-primary transition-colors gap-1 group whitespace-nowrap">
                Ver Todos <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 sm:pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 custom-scrollbar scroll-smooth snap-x snap-mandatory">
              {marchBooks.map((book) => (
                <div key={book.id} className="snap-start shrink-0 w-[140px] sm:w-[180px]">
                  <BookCard
                    title={book.title}
                    author={book.author}
                    coverUrl={book.cover}
                    onClick={() => setSelectedBook(book)}
                  />
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center p-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-colors ${activeTab === 'home' || activeTab === '' ? 'text-brand-primary bg-brand-primary/5' : 'text-brand-secondary active:bg-gray-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            <span className="text-[10px] mt-1 font-medium">Início</span>
          </button>

          <button
            onClick={() => setIsReviewsOpen(true)}
            className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-colors ${isReviewsOpen ? 'text-brand-primary bg-brand-primary/5' : 'text-brand-secondary active:bg-gray-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
            <span className="text-[10px] mt-1 font-medium">Resenhas</span>
          </button>
        </div>
      </div>
      <ReviewsModal
        isOpen={isReviewsOpen}
        onClose={() => {
          setIsReviewsOpen(false);
          setTargetReviewMonth(null);
          setTargetReviewId(null);
          setTargetBookId(null);
        }}
        targetMonth={targetReviewMonth}
        targetReviewId={targetReviewId}
        targetBookId={targetBookId}
      />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setIsLoginOpen(false)}
        isRequired={isLoginRequired}
      />
      <BookDetailsModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        onWriteReview={(monthKey, bookId) => {
          setSelectedBook(null);
          setTargetReviewMonth(monthKey);
          setTargetBookId(bookId);
          setIsReviewsOpen(true);
        }}
      />

      <NotificationsDropdown
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNotificationClick={(notif) => {
          setTargetReviewMonth(notif.meta.monthKey);
          setTargetReviewId(notif.meta.reviewId || null);
          setIsReviewsOpen(true);
        }}
      />
    </div>
  );
}

export default App;
