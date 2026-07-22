import { useState } from 'react';
import { Plus, Trash2, Code2, Loader2, Upload, X, Key, KeyRound } from 'lucide-react';
import { supabase, type Script, type ScriptInput } from '@/lib/supabase';
import { ScriptCard } from '@/components/ScriptCard';

interface YourScriptsPageProps {
  scripts: Script[];
  loading: boolean;
  refetch: () => void;
  setScripts: React.Dispatch<React.SetStateAction<Script[]>>;
  isHearted: (id: string) => boolean;
  onToggleHeart: (id: string, hearts: number) => void;
}

const gameOptions = [
  'Universal', 'Arsenal', 'Blox Fruits', 'Pet Simulator 99', 'Da Hood',
  'Brookhaven RP', 'Doors', 'Tower of Hell', 'Murder Mystery 2',
  'Adopt Me', 'Jailbreak', 'Custom',
];

export function YourScriptsPage({ scripts, loading, refetch, setScripts, isHearted, onToggleHeart }: YourScriptsPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ScriptInput>({
    title: '',
    description: '',
    code: '',
    author: '',
    game_name: 'Universal',
    tags: [],
    requires_key: false,
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.code.trim() || !form.author.trim() || !form.description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from('scripts')
      .insert({
        title: form.title.trim(),
        description: form.description.trim(),
        code: form.code,
        author: form.author.trim(),
        game_name: form.game_name,
        tags: form.tags,
        requires_key: form.requires_key,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    if (data) {
      setScripts(prev => [data, ...prev]);
    }
    setForm({ title: '', description: '', code: '', author: '', game_name: 'Universal', tags: [], requires_key: false });
    setTagInput('');
    setShowForm(false);
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error: deleteError } = await supabase.from('scripts').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setScripts(prev => prev.filter(s => s.id !== id));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput('');
  };

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2">
            Your <span className="gradient-text-static">Scripts</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Upload, manage, and share your Roblox scripts</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Cancel' : 'New Script'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border" style={{ borderColor: 'rgba(59, 130, 246, 0.3)', background: 'rgba(59, 130, 246, 0.1)' }}>
          <p className="text-sm text-blue-400">{error}</p>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="mb-8 p-6 rounded-2xl border scale-in" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-400" />
            Upload New Script
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Script Title *</label>
                <input
                  className="input-field"
                  placeholder="e.g. Ultimate Aimbot Pro"
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Author Name *</label>
                <input
                  className="input-field"
                  placeholder="Your username"
                  value={form.author}
                  onChange={e => setForm(prev => ({ ...prev, author: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Game *</label>
              <select
                className="input-field"
                value={form.game_name}
                onChange={e => setForm(prev => ({ ...prev, game_name: e.target.value }))}
              >
                {gameOptions.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Description *</label>
              <textarea
                className="input-field min-h-[80px] resize-y"
                placeholder="What does your script do?"
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Lua Code *</label>
              <textarea
                className="input-field min-h-[160px] resize-y font-mono text-sm"
                placeholder="-- Your Lua script here..."
                value={form.code}
                onChange={e => setForm(prev => ({ ...prev, code: e.target.value }))}
                style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  className="input-field flex-1"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  onChange={e => setTagInput(e.target.value)}
                />
                <button type="button" onClick={addTag} className="btn-secondary px-4 rounded-xl text-sm font-medium">Add</button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.tags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))}
                      className="tag-pill hover:opacity-80"
                    >
                      #{tag} <X className="w-3 h-3 ml-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Requires Key?</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, requires_key: false }))}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                    !form.requires_key ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  Keyless
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, requires_key: true }))}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                    form.requires_key ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  <Key className="w-4 h-4" />
                  Key Required
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              {submitting ? 'Publishing...' : 'Publish Script'}
            </button>
          </form>
        </div>
      )}

      {/* Scripts list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      ) : scripts.length === 0 ? (
        <div className="text-center py-20">
          <Code2 className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: 'var(--text-secondary)' }} />
          <p className="text-lg font-medium mb-2">No scripts yet</p>
          <p style={{ color: 'var(--text-secondary)' }}>Click "New Script" to upload your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scripts.map((script, i) => (
            <div key={script.id} className="relative group">
              <ScriptCard
                script={script}
                isHearted={isHearted(script.id)}
                onToggleHeart={onToggleHeart}
                index={i}
              />
              <button
                onClick={() => handleDelete(script.id)}
                className="absolute top-3 right-3 z-10 p-2 rounded-lg border opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                style={{ borderColor: 'rgba(59, 130, 246, 0.3)', background: 'rgba(59, 130, 246, 0.1)' }}
                title="Delete script"
              >
                <Trash2 className="w-4 h-4 text-blue-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
