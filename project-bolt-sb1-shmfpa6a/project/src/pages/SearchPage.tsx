import { useState, useMemo } from 'react';
import { Search as SearchIcon, Loader2, X, Key, KeyRound, Filter } from 'lucide-react';
import { useSearchScripts } from '@/lib/hooks';
import { ScriptCard } from '@/components/ScriptCard';
import type { Script } from '@/lib/supabase';

interface SearchPageProps {
  isHearted: (id: string) => boolean;
  onToggleHeart: (id: string, hearts: number) => void;
}

type KeyFilter = 'all' | 'keyless' | 'key';

const suggestions = ['aimbot', 'auto farm', 'esp', 'fly', 'admin', 'blox fruits', 'arsenal', 'jailbreak'];

export function SearchPage({ isHearted, onToggleHeart }: SearchPageProps) {
  const [query, setQuery] = useState('');
  const [keyFilter, setKeyFilter] = useState<KeyFilter>('all');
  const { results, loading } = useSearchScripts(query);

  const filtered = useMemo(() => {
    if (keyFilter === 'all') return results;
    if (keyFilter === 'keyless') return results.filter(s => !s.requires_key);
    return results.filter(s => s.requires_key);
  }, [results, keyFilter]);

  const keyFilters: { id: KeyFilter; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <Filter className="w-3.5 h-3.5" /> },
    { id: 'keyless', label: 'Keyless', icon: <KeyRound className="w-3.5 h-3.5" /> },
    { id: 'key', label: 'Key Required', icon: <Key className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <div className="mb-8 fade-in-up">
        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
          <SearchIcon className="w-9 h-9 text-blue-400" />
          <span className="gradient-text-static">Search</span> Scripts
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Find scripts by title, game, author, or keyword</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6 fade-in-up" style={{ animationDelay: '60ms' }}>
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: query ? '#60a5fa' : 'var(--text-secondary)' }} />
        <input
          className="input-field pl-12 pr-12 text-lg transition-all focus:shadow-lg"
          style={{ boxShadow: query ? '0 0 0 1px rgba(59, 130, 246, 0.2)' : undefined }}
          placeholder="Search for scripts..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/5 transition-all active:scale-90"
          >
            <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </button>
        )}
      </div>

      {/* Key filter */}
      {query && (
        <div className="flex items-center gap-2 mb-6 fade-in-up">
          <span className="text-xs font-medium mr-1" style={{ color: 'var(--text-secondary)' }}>Key:</span>
          {keyFilters.map(kf => (
            <button
              key={kf.id}
              onClick={() => setKeyFilter(kf.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                keyFilter === kf.id ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              {kf.icon}
              {kf.label}
            </button>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {!query && (
        <div className="text-center py-10 fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 float" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
            <SearchIcon className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Try searching for:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((s, i) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="tag-pill hover:scale-110 transition-transform fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {query && (
        <>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            {loading ? 'Searching...' : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${query}"`}
          </p>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 fade-in-up">
              <SearchIcon className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: 'var(--text-secondary)' }} />
              <p className="text-lg font-medium mb-2">No scripts found</p>
              <p style={{ color: 'var(--text-secondary)' }}>Try a different search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((script: Script, i) => (
                <ScriptCard
                  key={script.id}
                  script={script}
                  isHearted={isHearted(script.id)}
                  onToggleHeart={onToggleHeart}
                  index={i}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
