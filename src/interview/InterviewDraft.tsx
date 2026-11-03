import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuthSession } from '@/hooks/useAuthSession';
import type { CompletedDiagnostic } from './LivingOrbDiagnostic';
import type { Candidate } from '../../supabase/functions/interview-assessment/domain';

type Draft = { id: string; recording: CompletedDiagnostic; ownerId: string | null; candidate: Candidate | null };
type DraftContext = { draft: Draft | null; setDraft: React.Dispatch<React.SetStateAction<Draft | null>> };
const Context = createContext<DraftContext | null>(null);

// Audio stays in memory across SPA account and consent navigation. Never serialize this draft.
export function InterviewDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const { session, loading } = useAuthSession();
  useEffect(() => {
    if (loading) return;
    setDraft(current => {
      if (!current) return current;
      if (current.ownerId && current.ownerId !== session?.userId) return null;
      if (!current.ownerId && session) return { ...current, ownerId: session.userId };
      return current;
    });
  }, [session?.userId, loading]);
  return <Context.Provider value={{ draft, setDraft }}>{children}</Context.Provider>;
}
export function useInterviewDraft() {
  const context = useContext(Context);
  if (!context) throw Error('Interview draft provider is missing.');
  return context;
}
