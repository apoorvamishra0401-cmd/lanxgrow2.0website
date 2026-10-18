/**
 * FAQ content.
 *
 * Answers are limited to information supported by the Stage 1 brief and the
 * LanXgrow brand direction. No policies, prices or guarantees have been invented.
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
      'They are voice-based and video-based assessments that support the mentorship process. They give learners a comfortable way to speak, and give mentors a clearer starting point for guidance. They are a support for mentorship, not a replacement for it.',
  },
  {
    id: 'do-i-need-to-be-a-beginner',
    question: 'Do I need to be a complete beginner to join?',
    answer:
      'No. Learners begin by being assessed so that guidance responds to their actual level. That applies whether someone is starting from the very beginning or looking to refine the English they already use.',
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
      'Create an account using an email address or a phone number, complete a short assessment, and begin guided practice with a mentor. If you would prefer to ask questions first, use the contact form.',
  },
];
