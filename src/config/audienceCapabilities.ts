/**
 * LANX-00 shared audience/feature contract for the isolated LanXgrow review app.
 *
 * This map drives navigation and client-side presentation ONLY.
 * Server-side authorization must independently enforce ownership and audience
 * permissions. Never trust selected audience, local storage or user_metadata as
 * proof of a role. Admin privileges are not represented here.
 */
export type LearnerAudience = 'student' | 'fresher' | 'professional';

export type LearnerFeature =
  | 'ai-soul'
  | 'speaking-practice'
  | 'listening-practice'
  | 'reading-practice'
  | 'writing-practice'
  | 'practice-exercises'
  | 'progress-reports'
  | 'video-practice'
  | 'interview-preparation'
  | 'interview-video'
  | 'interview-assessment';

export const INTERVIEW_VIDEO_DURATION_SECONDS = 10 * 60;
export const INTERVIEW_ASSESSMENT_DURATION_SECONDS = 20 * 60;

const everyone = [
  'ai-soul',
  'speaking-practice',
  'listening-practice',
  'reading-practice',
  'writing-practice',
  'practice-exercises',
  'progress-reports',
] as const satisfies readonly LearnerFeature[];

export const AUDIENCE_FEATURES: Readonly<Record<LearnerAudience, readonly LearnerFeature[]>> = {
  student: [...everyone, 'video-practice'],
  fresher: [...everyone, 'interview-preparation', 'interview-video', 'interview-assessment'],
  professional: [...everyone, 'interview-preparation', 'interview-video', 'interview-assessment'],
};

export function isLearnerAudience(value: unknown): value is LearnerAudience {
  return value === 'student' || value === 'fresher' || value === 'professional';
}

export function canDisplayFeature(audience: LearnerAudience, feature: LearnerFeature): boolean {
  return AUDIENCE_FEATURES[audience].includes(feature);
}
