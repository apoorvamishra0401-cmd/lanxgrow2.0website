export const departments = {
  Technical: ['Software Engineering', 'IT Infrastructure & Cloud', 'Data Science & AI', 'Cybersecurity'],
  'Non-Technical': ['Customer Support', 'Sales & Business Development', 'Product & Operations', 'Product Design & UX', 'Data Analysis & BI'],
} as const;
export type Candidate = { name: string; category: 'Fresher' | 'Working Professional'; track: keyof typeof departments; department: string };
export type InterviewFeedback = { summary: string; strengths: string[]; priorities: string[]; evidence: { quote: string; guidance: string }[]; nextPractice: string };
export function parseCandidate(value: unknown): Candidate {
  const p = value as Partial<Candidate> | null;
  if (!p || typeof p.name !== 'string' || p.name.trim().length < 2 || p.name.length > 100) throw Error('Please enter your name.');
  if (p.category !== 'Fresher' && p.category !== 'Working Professional') throw Error('Choose your career stage.');
  if (p.track !== 'Technical' && p.track !== 'Non-Technical') throw Error('Choose your preparation track.');
  if (!(departments[p.track] as readonly string[]).includes(p.department || '')) throw Error('Choose a department within your track.');
  return { name: p.name.trim(), category: p.category, track: p.track, department: p.department! };
}
function text(value: unknown, max = 1600): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max;
}
export function parseFeedback(value: unknown, transcript: string): InterviewFeedback {
  const p = value as InterviewFeedback | null;
  if (!p || !text(p.summary) || !text(p.nextPractice) || !Array.isArray(p.strengths) || !Array.isArray(p.priorities) || !Array.isArray(p.evidence)) throw Error('Feedback needs another attempt.');
  if (p.strengths.length < 1 || p.strengths.length > 3 || p.priorities.length < 1 || p.priorities.length > 3 || p.evidence.length < 1 || p.evidence.length > 3) throw Error('Feedback needs another attempt.');
  if (![...p.strengths, ...p.priorities].every(v => text(v, 600))) throw Error('Feedback needs another attempt.');
  if (!p.evidence.every(v => v && text(v.quote, 500) && transcript.includes(v.quote) && text(v.guidance, 1000))) throw Error('Feedback evidence could not be verified. Please retry.');
  return { summary: p.summary, strengths: p.strengths, priorities: p.priorities, evidence: p.evidence.map(v => ({ quote: v.quote, guidance: v.guidance })), nextPractice: p.nextPractice };
}
