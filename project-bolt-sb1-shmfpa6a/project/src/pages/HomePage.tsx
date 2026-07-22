import { Flame, Heart, Code2, Zap, Shield, ArrowRight, TrendingUp, Key, KeyRound, Sparkles } from 'lucide-react';
import type { PageId } from '@/components/Sidebar';
import type { Script } from '@/lib/supabase';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  scripts: Script[];
}

export function HomePage({ onNavigate, scripts }: HomePageProps) {
  const totalHearts = scripts.reduce((sum, s) => sum + s.hearts, 0);
  const keylessCount = scripts.filter(s => !s.requires_key).length;
  const topScripts = [...scripts].sort((a, b) => b.hearts - a.hearts).slice(0, 3);

  const features = [
    { icon: Code2, title: '1000+ Scripts', desc: 'Across every popular Roblox game' },
    { icon: Heart, title: 'Community Hearts', desc: 'Vote on your favorite scripts' },
    { icon: Shield, title: 'Verified Safe', desc: 'Every script is checked' },
    { icon: Zap, title: 'Fast Updates', desc: 'New scripts added daily' },
  ];

  return (
    <div className="min-h-full">
      {/* Hero section */}
      <div className="relative dot-field aurora-bg overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ background: '#3b82f6' }} />
          <div className="absolute top-40 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: '#22d3ee' }} />
        </div>

        <div className="relative px-6 py-20 lg:py-32 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 scale-in" style={{ borderColor: 'rgba(59, 130, 246, 0.3)', background: 'rgba(59, 130, 246, 0.05)' }}>
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="text-sm font-medium text-blue-400">The #1 Roblox Script Library</span>
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
          </div>

          <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="gradient-text glow-text">ScriptHub</span>
          </h1>
          <p className="text-2xl lg:text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Premium <span className="gradient-text-static">Roblox Scripts</span>
          </p>
          <p className="text-lg max-w-2xl mx-auto mb-10 shimmer-text">
            Discover, share, and heart the best Roblox scripts. From admin commands to auto-farms, we've got you covered.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('popular')}
              className="btn-primary px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
            >
              <Flame className="w-5 h-5" />
              Browse Popular Scripts
            </button>
            <button
              onClick={() => onNavigate('your-scripts')}
              className="btn-secondary px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
            >
              Share Your Script
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="px-6 py-12 border-y" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-black gradient-text-static">{scripts.length}+</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Total Scripts</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black gradient-text-static">{(totalHearts / 1000).toFixed(1)}K</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Total Hearts</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black gradient-text-static">12+</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Games Supported</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black gradient-text-static">24/7</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Always Updated</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2">Why <span className="gradient-text-static">ScriptHub</span>?</h2>
        <p className="text-center mb-10" style={{ color: 'var(--text-secondary)' }}>The best place to find and share Roblox scripts</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="card-glow rounded-2xl border p-6 text-center fade-in-up"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', animationDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-bold mb-1">{f.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top scripts preview */}
      {topScripts.length > 0 && (
        <div className="px-6 py-16 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-blue-400" />
              Top <span className="gradient-text-static">Hearted</span>
            </h2>
            <button onClick={() => onNavigate('popular')} className="text-sm flex items-center gap-1 hover:underline" style={{ color: '#60a5fa' }}>
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topScripts.map((script, i) => (
              <div
                key={script.id}
                className="card-glow rounded-2xl border p-5 fade-in-up"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black" style={{ color: 'rgba(59, 130, 246, 0.3)' }}>#{i + 1}</span>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" style={{ fill: '#3b82f6', color: '#3b82f6' }} />
                    <span className="text-sm font-bold">{script.hearts}</span>
                  </div>
                </div>
                <h3 className="font-bold mb-1 truncate transition-colors group-hover:text-blue-400">{script.title}</h3>
                <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{script.game_name}</p>
                <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-secondary)' }}>{script.description}</p>
                <div
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border"
                  style={
                    script.requires_key
                      ? { borderColor: 'rgba(251, 191, 36, 0.3)', background: 'rgba(251, 191, 36, 0.08)', color: '#fbbf24' }
                      : { borderColor: 'rgba(34, 197, 94, 0.3)', background: 'rgba(34, 197, 94, 0.08)', color: '#22c55e' }
                  }
                >
                  {script.requires_key ? <Key className="w-3 h-3" /> : <KeyRound className="w-3 h-3" />}
                  {script.requires_key ? 'Key Required' : 'Keyless'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto p-10 rounded-3xl border relative overflow-hidden" style={{ borderColor: 'rgba(59, 130, 246, 0.2)', background: 'var(--bg-card)' }}>
          <div className="absolute inset-0 opacity-5 dot-field" />
          <div className="relative">
            <Heart className="w-12 h-12 mx-auto mb-4 float" style={{ fill: '#3b82f6', color: '#3b82f6' }} />
            <h2 className="text-3xl font-bold mb-3">Join the Community</h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Share your scripts with thousands of Roblox players. Get hearts, build reputation, and help the community grow.
            </p>
            <button
              onClick={() => onNavigate('your-scripts')}
              className="btn-primary px-8 py-3.5 rounded-xl font-semibold inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Code2 className="w-5 h-5" />
              Upload Your Script
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
