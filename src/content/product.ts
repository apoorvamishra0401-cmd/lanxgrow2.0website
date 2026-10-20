/**
 * Product screenshots and the learning-journey narrative.
 *
 * The five images are screens from the LanXgrow app, stored in
 * `public/images/product/`. They are presented as a product preview: the
 * marketing site itself does not capture audio or video, analyse faces, score
 * responses or store learner data. Descriptions stay limited to what each
 * screen actually shows.
 */

export type ProductScreen = {
  id: string;
  /** Two-digit step used as an editorial index. */
  step: string;
  /** Short label for the step list. */
  title: string;
  /** Caption shown directly beneath the screen. */
  label: string;
  /** One short paragraph describing the visible screen. */
  description: string;
  /** Public path, resolved from `public/`. */
  src: string;
  /** Meaningful alternative text describing the interface. */
  alt: string;
};

export const productShowcase = {
  eyebrow: 'Inside LanXgrow',
  heading: 'One journey, from first word to confident voice.',
  intro:
    'The LanXgrow app brings practice, listening, speaking and assessment into one clear rhythm — so the learner always knows what comes next.',
  note: 'Product preview — screens from the LanXgrow app.',
} as const;

export const productScreens: ProductScreen[] = [
  {
    id: 'home',
    step: '01',
    title: 'Your learning home',
    label: 'Learner home',
    description:
      'Open the app to a clear view of what comes next: practice, video assessment, the structured course and progress — all in one place.',
    src: '/images/product/learner-dashboard.jpg',
    alt: 'LanXgrow app home screen with a welcome message and cards for Call, Practice, Video Assessment, English Pro Course, Learn and Entertainment, and Dashboard.',
  },
  {
    id: 'daily',
    step: '02',
    title: 'Daily Practice',
    label: 'Daily practice',
    description:
      'Short, structured practice built around a goal. Choose listening and speaking, reading and speaking, or writing — and keep the habit small enough to repeat.',
    src: '/images/product/daily-practice.jpg',
    alt: 'Daily Practice screen with a practice goal, a photo of a learner at a laptop, and options to listen and speak, read and speak, or write.',
  },
  {
    id: 'listening',
    step: '03',
    title: 'Listening practice',
    label: 'Listening practice',
    description:
      'Listen carefully to a spoken passage, guided by questions that focus attention on the main idea, the important details and what you would explain to someone else.',
    src: '/images/product/listening-practice.jpg',
    alt: 'Listening practice screen showing an assigned audio track, playback controls and guidance questions about the main idea and important details.',
  },
  {
    id: 'voice',
    step: '04',
    title: 'Voice practice',
    label: 'Voice practice',
    description:
      'Explain what you understood in your own words. The learner speaks naturally, with a visible prompt and a simple recording control.',
    src: '/images/product/voice-practice.jpg',
    alt: 'Voice practice screen titled Explain What You Understood, with a task card, a microphone control and a Start Recording button.',
  },
  {
    id: 'video',
    step: '05',
    title: 'Video assessment',
    label: 'Video assessment',
    description:
      'Record or upload a spoken response to an assigned topic, with a visible time limit and clear controls for pausing, stopping and restarting.',
    src: '/images/product/video-assessment.jpg',
    alt: 'Video assessment screen titled Record Your Video, showing a recording timer, a camera preview, an assigned topic and stop recording controls.',
  },
];
