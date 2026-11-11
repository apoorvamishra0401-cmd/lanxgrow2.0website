import type { Question } from './lifecycle';

/**
 * Original LANX-02 prompt templates; not copied from any proprietary assessment.
 * The trusted server must select, version, assign and persist the actual prompt set.
 * These templates are NOT scored by the client or an asserted AI model.
 */
export const VIDEO_INTERVIEW_PROMPTS: readonly Question[] = [
  { id: 'vi-introduction', format: 'video', prompt: 'Describe a project or responsibility you are proud of. What made your contribution useful?' },
  { id: 'vi-problem-solving', format: 'video', prompt: 'Tell us about a time an initial plan did not work. How did you diagnose the situation and adapt?' },
  { id: 'vi-communication', format: 'video', prompt: 'How would you explain a complicated idea to a teammate who is new to the topic?' },
  { id: 'vi-collaboration', format: 'video', prompt: 'Imagine two teammates disagree on the priority of an urgent task. How would you help them reach a decision?' },
  { id: 'vi-reflection', format: 'video', prompt: 'Which professional communication skill do you most want to improve, and what specific practice would you use?' },
];

export const SKILLS_ASSESSMENT_PROMPTS: readonly Question[] = [
  { id: 'sa-prioritization', format: 'choice', prompt: 'A customer requests an urgent update while your team is investigating an error. What should you do first?', choices: [
    'Confirm the impact and expected update time, then coordinate the investigation',
    'Promise the issue will be fixed immediately before checking',
    'Close the request without replying',
    'Send unverified technical details to the customer',
  ] },
  { id: 'sa-email-clarity', format: 'text', prompt: 'Write a brief, professional update to a customer explaining that a reported issue is being investigated and when they can expect your next update. Avoid promises you cannot verify.' },
  { id: 'sa-comprehension', format: 'choice', prompt: 'A team note says: “The report is complete, but the approval is pending.” Which statement is supported?', choices: [
    'The report is ready, but it is not yet approved',
    'The report has been approved',
    'The report is still being written',
    'The approval process has been cancelled',
  ] },
  { id: 'sa-rephrase', format: 'text', prompt: 'Rewrite this message to be precise and courteous: “You did not send the file so we cannot finish.”' },
  { id: 'sa-judgment', format: 'choice', prompt: 'A colleague shares a result that appears inconsistent with the source data. What is the most appropriate next step?', choices: [
    'Politely verify the source and calculations before sharing the result',
    'Publish it immediately because the colleague is confident',
    'Change the numbers silently to look more convincing',
    'Ignore the discrepancy and omit the source',
  ] },
  { id: 'sa-summary', format: 'text', prompt: 'Summarize in two or three sentences: A pilot ran for four weeks. Participants completed most planned sessions, but some had unreliable connectivity. The team recommended offline-friendly tasks for the next pilot.' },
  { id: 'sa-feedback', format: 'text', prompt: 'Give constructive feedback to a teammate whose presentation had strong examples but exceeded the allotted time. Include one actionable suggestion.' },
  { id: 'sa-reflection', format: 'text', prompt: 'A meeting ended without clear owners for the next steps. Write a short follow-up message that requests owners and target dates.' },
];

/** Defensive invariant: no question may be silently assigned twice within one set. */
export function validatePromptBank(questions: readonly Question[]): void {
  const ids = new Set<string>();
  for (const q of questions) {
    if (!q.id || !q.prompt.trim() || ids.has(q.id)) throw new Error('Invalid or repeated question');
    if (q.format === 'choice' && (!q.choices || q.choices.length < 2 || new Set(q.choices).size !== q.choices.length)) {
      throw new Error('Invalid multiple-choice options');
    }
    ids.add(q.id);
  }
}
