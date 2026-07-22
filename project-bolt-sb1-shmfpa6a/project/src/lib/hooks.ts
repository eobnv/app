import { useState, useEffect, useCallback } from 'react';
import { supabase, type Script } from '@/lib/supabase';

const HEARTED_KEY = 'roblox_scripts_hearted';

function getHeartedIds(): Set<string> {
  try {
    const stored = localStorage.getItem(HEARTED_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
}

function saveHeartedIds(ids: Set<string>) {
  localStorage.setItem(HEARTED_KEY, JSON.stringify([...ids]));
}

export function useHeartedScripts() {
  const [heartedIds, setHeartedIds] = useState<Set<string>>(getHeartedIds);

  const toggleHeart = useCallback(async (scriptId: string, currentHearts: number) => {
    const isHearted = heartedIds.has(scriptId);
    const newHearts = isHearted ? currentHearts - 1 : currentHearts + 1;
    const newSet = new Set(heartedIds);
    if (isHearted) {
      newSet.delete(scriptId);
    } else {
      newSet.add(scriptId);
    }
    setHeartedIds(newSet);
    saveHeartedIds(newSet);

    const { error } = await supabase
      .from('scripts')
      .update({ hearts: newHearts })
      .eq('id', scriptId);

    if (error) {
      // Revert on failure
      const reverted = new Set(heartedIds);
      if (isHearted) reverted.add(scriptId);
      else reverted.delete(scriptId);
      setHeartedIds(reverted);
      saveHeartedIds(reverted);
    }

    return { newHearts, isHearted: !isHearted };
  }, [heartedIds]);

  const isHearted = useCallback((scriptId: string) => heartedIds.has(scriptId), [heartedIds]);

  return { toggleHeart, isHearted };
}

export function useScripts() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScripts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setScripts(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchScripts();
  }, [fetchScripts]);

  return { scripts, loading, error, refetch: fetchScripts, setScripts };
}

export function usePopularScripts() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .order('hearts', { ascending: false })
        .limit(20);

      if (error) {
        setError(error.message);
      } else {
        setScripts(data || []);
      }
      setLoading(false);
    })();
  }, []);

  return { scripts, loading, error, setScripts };
}

export function useSearchScripts(query: string) {
  const [results, setResults] = useState<Script[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      const { data } = await supabase
        .from('scripts')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,game_name.ilike.%${query}%,author.ilike.%${query}%`)
        .order('hearts', { ascending: false });

      setResults(data || []);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return { results, loading };
}
