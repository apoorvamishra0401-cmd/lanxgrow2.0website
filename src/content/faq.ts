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
    id: 'why-cannot-speak-fluent',
    question:
      'Why can I understand English but struggle to speak fluently?',
    answer:
      'Understanding English and speaking it comfortably are different skills. You may recognise words and follow conversations but still struggle to respond quickly, organise your thoughts or speak without translating in your head. Regular speaking practice and useful feedback can help you work on these challenges. LanXgrow focuses on practical English Communication through structured practice, personalised learning and AI-assisted assessment.',
  },
  {
    id: 'improve-speaking-skills',
    question:
      'How can I improve my English speaking skills and confidence?',
    answer:
      'Start by speaking about familiar topics, practising everyday conversations and gradually moving towards more challenging situations. Focus on expressing your ideas clearly instead of waiting for every sentence to be perfect. LanXgrow\'s English Communication programme focuses on practical speaking, listening, pronunciation and clarity of expression, supported by personalised learning and AI-assisted assessment.',
  },
  {
    id: 'practice-without-partner',
    question:
      'How can I practise speaking English without a conversation partner?',
    answer:
      'You can practise by explaining a topic aloud, describing your day or rehearsing common situations such as introductions and workplace conversations. AI-based practice can offer another way to exercise your speaking skills, although feedback may have limitations. LanXgrow uses AI-assisted voice and video assessments as part of its learning approach. Contact the team to confirm the available practice formats.',
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
      'AI can support language practice by giving learners opportunities to work on speaking and review aspects of their performance. Its usefulness depends on the quality of the assessment, the feedback provided and how consistently you practise. LAN-X AI supports voice-based and video-based assessments for personalised learning. AI feedback is guidance, not a guarantee of perfect accuracy or fluency.',
  },
  {
    id: 'ai-feedback-reliable',
    question:
      'How reliable is AI feedback on English speaking and pronunciation?',
    answer:
      'AI feedback can help highlight areas to review, but it may not capture every aspect of natural communication, context or pronunciation. It is best used as a learning aid rather than a definitive judgement of your ability. LanXgrow incorporates AI-assisted assessments into its learning approach. Ask the team about the assessment features available in the programme before enrolling.',
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
      'The programme focuses on practical communication, including speaking, listening, pronunciation and clarity of expression. Personalised learning and AI-assisted voice and video assessments support the learning approach. For the exact curriculum, session structure and activities relevant to your goals, contact LanXgrow directly.',
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
      'The current public assessment preview does not record your camera or microphone. Before any recording-based learning feature is introduced, we will explain what is collected, why it is needed and how it is handled. Read our Privacy Notice or email official@lanxgrow.com with questions.',
  },
  {
    id: 'cost-and-duration',
    question:
      'How much does the English Communication programme cost, and how long does it take?',
    answer:
      'Fees and programme schedules depend on the programme details confirmed by LanXgrow. There is no single timeline that guarantees the same improvement for every learner. Contact the LanXgrow team for current fees, programme duration, schedules and inclusions before making an enrolment decision.',
  },
];
