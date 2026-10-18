/**
 * FAQ content.
 *
 * Answers are limited to information supported by the brand direction and, where
 * research is referenced, by sources that are safe to publish. No policies,
 * prices or guarantees are invented, and language about accounts, assessments
 * and progress stays future-facing because those workflows are not live yet.
 */

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqIntro = {
  eyebrow: 'FAQ',
  heading: 'Questions, answered plainly.',
  supporting:
    'If something is not covered here, the enquiry form is the best way to reach the LanXgrow team.',
} as const;

export const faqItems: FaqItem[] = [
  {
    id: 'what-is-lanxgrow',
    question: 'What is LanXgrow?',
    answer:
      'LanXgrow is an education brand focused on English Communication and mentorship. We bring guided learning together with Smart AI-supported voice and video assessments to support learners as they build real communication skills.',
  },
  {
    id: 'who-is-it-for',
    question: 'Who is LanXgrow for?',
    answer:
      'LanXgrow is designed for students and adult learners who want to communicate more confidently in English, and for parents looking for considered, guided support for their children.',
  },
  {
    id: 'what-does-english-communication-cover',
    question: 'What does English Communication cover?',
    answer:
      'The focus is on using English in real situations — speaking and conversational fluency, listening and comprehension, pronunciation, clarity of expression and the confidence to take part in everyday conversation.',
  },
  {
    id: 'role-of-a-mentor',
    question: 'What does the mentor do?',
    answer:
      'A mentor works alongside the learner. They establish where the learner is, decide what to practise next, and give feedback that is specific and encouraging. Mentorship is how LanXgrow keeps learning personal rather than generic.',
  },
  {
    id: 'smart-ai-assessments',
    question: 'What are Smart AI-supported assessments?',
    answer:
      'They are voice-based and video-based assessments that support the mentorship process. They give learners a comfortable way to speak, and give mentors a clearer starting point for guidance. They are a starting point and a checkpoint, not a verdict, and they never replace the mentor’s judgement.',
  },
  {
    id: 'do-i-need-to-be-a-beginner',
    question: 'Do I need to be a complete beginner to join?',
    answer:
      'No. Our approach begins by understanding the learner’s current level, so guidance responds to where they actually are — whether they are starting from the very beginning or looking to refine the English they already use.',
  },
  {
    id: 'parents',
    question: 'I am a parent. Can I be involved?',
    answer:
      'Yes. Parents and adult learners remain part of the picture at LanXgrow. Progress is easier to sustain when the people around a learner understand what is being worked on and why.',
  },
  {
    id: 'how-to-start',
    question: 'How do I get started?',
    answer:
      'Start with our Services page to see how LanXgrow works and what English Communication covers. Enrolment is not open yet, and we will publish how to join on this website as soon as it is.',
  },
  {
    id: 'how-do-you-measure-progress',
    question: 'How do you measure progress?',
    answer:
      'Our intended approach is to understand a learner’s starting point, use comparable speaking activities to review progress, and give specific feedback along the way. We do not promise a fixed timeline or a particular outcome.',
  },
  {
    id: 'are-my-voice-and-video-recorded',
    question: 'Is my voice or video recorded?',
    answer:
      'The voice and video assessment shown on this website is a visual demonstration. This page does not access your camera or microphone, and it does not record or send anything. When live assessments are introduced, we will explain clearly what is captured and how it is used before anything begins.',
  },
];
