/** FAQ content.
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
    'If something is not covered here, use the WhatsApp button or the email address in the footer to reach the LanXgrow team.',
} as const;


export const faqItems: FaqItem[] = [
  {
    id: 'available-today',
    question: 'What can I use on the public website today?',
    answer: 'You can explore the interview preparation framework, try guided scripted conversation, and choose optional local voice or video rehearsal in SMART AI. These are demonstrations. Live AI feedback, automated assessment reports and employer-equivalent scoring are not enabled in this public experience. Sign-in is a separate account step; confirm programme availability with the team.',
  },

  {
    id: 'why-cannot-speak-fluent',
    question:
      'Why can I understand English but struggle to speak fluently?',
    answer:
      'Understanding English and speaking it comfortably are different skills. You may recognise words and follow conversations but still struggle to respond quickly, organise your thoughts or speak without translating in your head. Regular speaking practice and useful feedback can help you work on these challenges. LanXgrow focuses on practical English Communication. The public website offers guided demonstrations; personalised AI assessment is planned.',
  },
  {
    id: 'improve-speaking-skills',
    question:
      'How can I improve my English speaking skills and confidence?',
    answer:
      'Start by speaking about familiar topics, practising everyday conversations and gradually moving towards more challenging situations. Focus on expressing your ideas clearly instead of waiting for every sentence to be perfect. LanXgrow\'s English Communication approach focuses on practical speaking, listening, pronunciation and clarity of expression. Public demonstrations show the approach; live personalised AI feedback is planned.',
  },
  {
    id: 'practice-without-partner',
    question:
      'How can I practise speaking English without a conversation partner?',
    answer:
      'You can practise by explaining a topic aloud, describing your day or rehearsing common situations such as introductions and workplace conversations. AI-based practice can offer another way to exercise your speaking skills, although feedback may have limitations. LanXgrow currently offers guided demonstrations and optional local rehearsal on the public website. Live AI-assisted voice and video assessment is planned. Contact the team to confirm programme availability.',
  },
  {
    id: 'improve-for-interviews',
    question:
      'How can I improve my English communication skills for interviews and the workplace?',
    answer:
      'Clear communication can help you explain your ideas, answer questions and participate in professional conversations. Practising structured responses, organising your thoughts and speaking clearly are useful starting points. LanXgrow focuses on practical English Communication skills. Ask the team which programme content is relevant to your current career or interview preparation goals.',
  },
  {
    id: 'can-ai-help',
    question:
      'Can AI help me improve my spoken English?',
    answer:
      'AI can support language practice by giving learners opportunities to work on speaking and review aspects of their performance. Its usefulness depends on the quality of the assessment, the feedback provided and how consistently you practise. The current LAN-X public experience offers guided demonstrations and optional local rehearsal. Live AI assessment feedback is planned. AI feedback is guidance, not a guarantee of perfect accuracy or fluency.',
  },
  {
    id: 'ai-feedback-reliable',
    question:
      'How reliable is AI feedback on English speaking and pronunciation?',
    answer:
      'AI feedback can help highlight areas to review, but it may not capture every aspect of natural communication, context or pronunciation. It is best used as a learning aid rather than a definitive judgement of your ability. Live AI assessment feedback is planned and cannot be tested on this public website. Ask the team about current programme availability before enrolling.',
  },
  {
    id: 'improve-pronunciation',
    question:
      'How can I improve my English pronunciation and clarity of speech?',
    answer:
      'Listen to spoken English, practise saying useful phrases aloud and review how clearly you express your ideas. Pay attention to individual sounds as well as pace and sentence clarity. LanXgrow\'s English Communication learning focus includes pronunciation and clarity of expression. The specific feedback available depends on the assessment features offered.',
  },
  {
    id: 'programme-audience',
    question:
      'Who is LanXgrow\'s English Communication programme designed for?',
    answer:
      'LanXgrow\'s intended audience includes higher secondary students, undergraduate and postgraduate freshers, job seekers, experienced professionals and working professionals who want to develop their English Communication skills. The most suitable programme depends on your current level and goals. Contact the LanXgrow team to discuss your requirements and confirm programme suitability.',
  },
  {
    id: 'programme-contents',
    question:
      'What does LanXgrow\'s English Communication programme cover?',
    answer:
      'The programme focuses on practical communication, including speaking, listening, pronunciation and clarity of expression. Personalised AI feedback and automated assessment are planned. For confirmed curriculum, session structure and available activities relevant to your goals, contact LanXgrow directly.',
  },
  {
    id: 'measure-progress',
    question:
      'How can I measure my progress in English speaking?',
    answer:
      'Compare similar speaking activities over time and notice changes in how clearly you express ideas, respond to questions and organise your thoughts. LanXgrow\'s intended approach uses the learner\'s starting point, comparable speaking activities and feedback to help identify areas for improvement. Individual progress varies, so a fixed timeline or guaranteed result cannot be promised.',
  },
  {
    id: 'voice-data-use',
    question:
      'How does LanXgrow use my voice and video data?',
    answer:
      'The homepage animation does not use your camera or microphone. In SMART AI, local rehearsal can request camera or microphone permission when you choose it; recordings stay in your browser in this demonstration. Optional speech-to-text uses your browser’s speech service and may process audio outside your device. Review permission prompts and the Privacy Notice before recording. Email official@lanxgrow.com with questions.',
  },
  {
    id: 'cost-and-duration',
    question:
      'How much does the English Communication programme cost, and how long does it take?',
    answer:
      'Fees and programme schedules depend on the programme details confirmed by LanXgrow. There is no single timeline that guarantees the same improvement for every learner. Contact the LanXgrow team for current fees, programme duration, schedules and inclusions before making an enrolment decision.',
  },
];
