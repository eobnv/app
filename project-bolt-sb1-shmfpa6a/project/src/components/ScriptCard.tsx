import { useState } from 'react';
import { Heart, Copy, Check, Code2, Gamepad2, User, Key, KeyRound } from 'lucide-react';
import type { Script } from '@/lib/supabase';

interface ScriptCardProps {
  script: Script;
  isHearted: boolean;
  onToggleHeart: (id: string, hearts: number) => void;
  index?: number;
}

export function ScriptCard({ script, isHearted, onToggleHeart, index = 0 }: ScriptCardProps) {
  const [copied, setCopied] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(script.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHeart = () => {
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 400);
    onToggleHeart(script.id, script.hearts);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  return (
    <div
      className="card-glow rounded-2xl border p-5 fade-in-up group"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Key/Keyless badge */}
      <div className="absolute top-3 right-3 z-10">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border"
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

      {/* Header */}
      <div className="flex items-start gap-3 mb-3 pr-28">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold mb-1 truncate transition-colors duration-400 group-hover:text-blue-400" style={{ color: 'var(--text-primary)' }}>
            {script.title}
          </h3>
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span className="flex items-center gap-1">
              <Gamepad2 className="w-3.5 h-3.5" />
              {script.game_name}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {script.author}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
        {script.description}
      </p>

      {/* Tags */}
      {script.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {script.tags.map((tag) => (
            <span key={tag} className="tag-pill transition-transform hover:scale-110">{tag}</span>
          ))}
        </div>
      )}

      {/* Code preview */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Script Code</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg btn-secondary transition-all active:scale-90"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <div
          className="code-block cursor-pointer transition-all duration-300 group-hover:border-blue-500/20"
          onClick={() => setExpanded(!expanded)}
          style={{ maxHeight: expanded ? 'none' : '120px', overflow: expanded ? 'visible' : 'hidden' }}
        >
          {script.code}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs mt-2 hover:underline transition-colors"
          style={{ color: '#60a5fa' }}
        >
          {expanded ? 'Show less' : 'Show more...'}
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {formatDate(script.created_at)}
        </span>
        <button
          onClick={handleHeart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-300 hover:scale-110 active:scale-90"
          style={{
            borderColor: isHearted ? 'rgba(59, 130, 246, 0.4)' : 'var(--border)',
            background: isHearted ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
          }}
        >
          <Heart
            className={`w-4 h-4 transition-all duration-300 ${heartAnimating ? 'heart-pop' : ''}`}
            style={{
              color: isHearted ? '#3b82f6' : 'var(--text-secondary)',
              fill: isHearted ? '#3b82f6' : 'transparent',
            }}
          />
          <span className="text-xs font-bold" style={{ color: isHearted ? '#3b82f6' : 'var(--text-secondary)' }}>
            {script.hearts}
          </span>
        </button>
      </div>
    </div>
  );
}
