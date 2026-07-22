import { useState, useEffect } from 'react';
import { Menu, Flame } from 'lucide-react';
import { Sidebar, type PageId } from '@/components/Sidebar';
import { HomePage } from '@/pages/HomePage';
import { YourScriptsPage } from '@/pages/YourScriptsPage';
import { PopularPage } from '@/pages/PopularPage';
import { SearchPage } from '@/pages/SearchPage';
import { AboutPage } from '@/pages/AboutPage';
import { useScripts, useHeartedScripts } from '@/lib/hooks';

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { scripts, loading, refetch, setScripts } = useScripts();
  const { toggleHeart, isHearted } = useHeartedScripts();

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleHeart = async (id: string, hearts: number) => {
    const result = await toggleHeart(id, hearts);
    if (result) {
      setScripts(prev => prev.map(s => s.id === id ? { ...s, hearts: result.newHearts } : s));
    }
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        scriptCount={scripts.length}
      />

      {/* Mobile header */}
      <header
        className="lg:hidden fixed top-0 right-0 left-0 z-30 flex items-center justify-between px-4 py-3 border-b backdrop-blur-md"
        style={{ background: 'rgba(10, 10, 15, 0.8)', borderColor: 'var(--border)' }}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <Flame className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold gradient-text-static">ScriptHub</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Main content */}
      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0 dot-field aurora-bg">
        <div key={currentPage} className="page-enter">
          {currentPage === 'home' && <HomePage onNavigate={handleNavigate} scripts={scripts} />}
          {currentPage === 'your-scripts' && (
            <YourScriptsPage
              scripts={scripts}
              loading={loading}
              refetch={refetch}
              setScripts={setScripts}
              isHearted={isHearted}
              onToggleHeart={handleToggleHeart}
            />
          )}
          {currentPage === 'popular' && (
            <PopularPage
              scripts={scripts}
              loading={loading}
              isHearted={isHearted}
              onToggleHeart={handleToggleHeart}
            />
          )}
          {currentPage === 'search' && (
            <SearchPage
              isHearted={isHearted}
              onToggleHeart={handleToggleHeart}
            />
          )}
          {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        </div>
      </main>
    </div>
  );
}

export default App;
