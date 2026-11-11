import { AUDIENCE_FEATURES, canDisplayFeature, isLearnerAudience } from './audienceCapabilities';
import type { LearnerAudience, LearnerFeature } from './audienceCapabilities';

export const FEATURE_DETAILS: Readonly<Record<LearnerFeature, { title: string; description: string; group: 'learning' | 'interview' | 'progress' }>> = {
  'ai-soul': { title: 'AI Soul', description: 'Explore Lan-X AI conversational practice.', group: 'learning' },
  'speaking-practice': { title: 'Speaking', description: 'Practice a short spoken introduction.', group: 'learning' },
  'listening-practice': { title: 'Listening', description: 'Listen to a sentence and write what you heard.', group: 'learning' },
  'reading-practice': { title: 'Reading', description: 'Read a passage and write a brief response.', group: 'learning' },
  'writing-practice': { title: 'Writing', description: 'Build confidence with a short writing prompt.', group: 'learning' },
  'practice-exercises': { title: 'Practice exercises', description: 'Practice vocabulary and everyday communication.', group: 'learning' },
  'progress-reports': { title: 'Progress', description: 'Your practice activity on this device (not a scored AI report).', group: 'progress' },
  'video-practice': { title: 'Video Practice', description: 'Private device-only camera practice for students.', group: 'learning' },
  'interview-preparation': { title: 'Interview Preparation', description: 'Prepare for a job interview with focused exercises.', group: 'interview' },
  'interview-video': { title: '10-minute video interview', description: 'Interview-video entry for career learners.', group: 'interview' },
  'interview-assessment': { title: '20-minute assessment', description: 'Interview assessment entry for career learners.', group: 'interview' },
};

export function getAudienceDashboardPath(audience: LearnerAudience): string {
  return '/dashboard/' + audience;
}

export function getAudienceFeaturePath(audience: LearnerAudience, feature: LearnerFeature): string {
  return getAudienceDashboardPath(audience) + '/' + feature;
}

export function resolveDashboardRoute(audience: unknown, feature?: unknown):
  | { allowed: true; audience: LearnerAudience; feature: LearnerFeature | null }
  | { allowed: false } {
  if (!isLearnerAudience(audience)) return { allowed: false };
  if (feature === undefined || feature === null) return { allowed: true, audience, feature: null };
  if (typeof feature !== 'string' || !Object.hasOwn(FEATURE_DETAILS, feature)) return { allowed: false };
  const permittedFeature = feature as LearnerFeature;
  return canDisplayFeature(audience, permittedFeature)
    ? { allowed: true, audience, feature: permittedFeature } : { allowed: false };
}

export function visibleDashboardFeatures(audience: LearnerAudience): readonly LearnerFeature[] {
  return AUDIENCE_FEATURES[audience];
}
