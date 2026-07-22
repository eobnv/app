import { useState, useMemo } from 'react';
import { Flame, Loader2, TrendingUp, Crown, Key, KeyRound, Filter } from 'lucide-react';
import type { Script } from '@/lib/supabase';
import { ScriptCard } from '@/components/ScriptCard';

interface PopularPageProps {
  scripts: Script[];
  loading: boolean;
  isHearted: (id: string) => boolean;
  onToggleHeart: (id: string, hearts: number) => void;
}

type SortMode = 'hearts' | 'recent';
type KeyFilter = 'all' | 'keyless' | 'key';

export function PopularPage({ scripts, loading, isHearted, onToggleHeart }: PopularPageProps) {
  const [sortMode, setSortMode] = useState<SortMode>('hearts');
  const [filterGame, setFilterGame] = useState<string>('all');
  const [keyFilter, setKeyFilter] = useState<KeyFilter>('all');

  const games = useMemo(() => {
    const set = new Set(scripts.map(s => s.game_name));
    return ['all', ...Array.from(set)];
  }, [scripts]);

  const filtered = useMemo(() => {
    let result = [...scripts];
    if (filterGame !== 'all') {
      result = result.filter(s => s.game_name === filterGame);
    }
    if (keyFilter === 'keyless') {
      result = result.filter(s => !s.requires_key);
    } else if (keyFilter === 'key') {
      result = result.filter(s => s.requires_key);
    }
    if (sortMode === 'hearts') {
      result.sort((a, b) => b.hearts - a.hearts);
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return result;
  }, [scripts, sortMode, filterGame, keyFilter]);

  const topThree = [...scripts].sort((a, b) => b.hearts - a.hearts).slice(0, 3);

  const keyFilters: { id: KeyFilter; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <Filter className="w-3.5 h-3.5" /> },
    { id: 'keyless', label: 'Keyless', icon: <KeyRound className="w-3.5 h-3.5" /> },
    { id: 'key', label: 'Key Required', icon: <Key className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <div className="mb-8 fade-in-up">
        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
          <Flame className="w-9 h-9 text-blue-400 animate-pulse" />
          <span className="gradient-text-static">Popular</span> Scripts
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>The most hearted scripts in the community</p>
      </div>

      {/* Top 3 podium */}
      {!loading && topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {topThree.map((script, i) => (
            <div
              key={script.id}
              className="rounded-2xl border p-5 fade-in-up relative overflow-hidden group"
              style={{
                background: 'var(--bg-card)',
                borderColor: i === 0 ? 'rgba(59, 130, 246, 0.4)' : 'var(--border)',
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.1), transparent 70%)' }} />
              <div className="relative">
                {i === 0 && (
                  <div className="absolute top-0 right-0">
                    <Crown className="w-6 h-6 text-yellow-400 float" />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl font-black" style={{ color: i === 0 ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)' }}>
                    #{i + 1}
                  </span>
                </div>
                <h3 className="font-bold mb-1 truncate">{script.title}</h3>
                <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{script.game_name}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-blue-400" />
                    <span className="text-lg font-bold gradient-text-static">{script.hearts}</span>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>hearts</span>
                  </div>
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border"
                    style={
                      script.requires_key
                        ? { borderColor: 'rgba(251, 191, 36, 0.3)', background: 'rgba(251, 191, 36, 0.08)', color: '#fbbf24' }
                        : { borderColor: 'rgba(34, 197, 94, 0.3)', background: 'rgba(34, 197, 94, 0.08)', color: '#22c55e' }
                    }
                  >
                    {script.requires_key ? <Key className="w-3 h-3" /> : <KeyRound className="w-3 h-3" />}
                    {script.requires_key ? 'Key' : 'Keyless'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Key filter */}
        <div className="flex items-center gap-2">
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

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSortMode('hearts')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                sortMode === 'hearts' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Most Hearted
            </button>
            <button
              onClick={() => setSortMode('recent')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                sortMode === 'recent' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              Recent
            </button>
          </div>
          <select
            value={filterGame}
            onChange={e => setFilterGame(e.target.value)}
            className="input-field sm:max-w-xs"
          >
            {games.map(g => <option key={g} value={g}>{g === 'all' ? 'All Games' : g}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 fade-in-up">
          <Flame className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: 'var(--text-secondary)' }} />
          <p className="text-lg font-medium">No scripts found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Try changing your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((script, i) => (
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
    </div>
  );
}
