/** About page copy. Human-centred, concise, and limited to what can be stated honestly. */

export const aboutIntro = {
  eyebrow: 'About LanXgrow',
  heading: 'AI-Powered English Learning, Personalised Around You.',
  supporting:
    'Your ideas deserve to be heard—in the classroom, in an interview and in the conversations that shape your future. LanXgrow is bringing purposeful English practice, human guidance and thoughtfully designed technology into one connected learning experience, built around the person behind the voice.',
} as const;

export const aboutPurpose = {
  eyebrow: 'Purpose',
  heading: 'Why LanXgrow Exists',
  paragraphs: [
    'You can know the words and still hesitate when it is your turn to speak. That moment is where our purpose begins.',
    'Confidence needs room to grow: a chance to explain an idea, ask a question, make a mistake and try again. Grammar and vocabulary matter most when they help you say something that matters to you.',
    'We are building LanXgrow to make that practice more purposeful and easier to return to. From school and college to a first job or the workplace, our aim is to help learners turn understanding into expression, one meaningful conversation at a time.',
  ],
} as const;

/**
 * Research note shown on the About page.
 *
 * The figure, age range, rural scope and the reading-only limitation must always
 * appear together. It is never a spoken-English statistic and never belongs in
 * the homepage hero.
 */
export const aboutResearch = {
  url: 'https://asercentre.org/wp-content/uploads/2022/12/ASER-2023_Main-findings-1.pdf',
  eyebrow: 'Research note',
  figure: '42.7%',
  statement: 'of surveyed rural Indian youth aged 14–18 could not read at least simple sentences in English.',
  source:
    'ASER 2023, Beyond Basics. Survey conducted across 28 districts in 26 states.\n\nThis measures basic English reading ability, not speaking fluency or conversational confidence.',
} as const;

/**
 * Progress copy.
 *
 * Deliberately future-facing: it describes an intended approach, and promises
 * neither a fixed timeline nor an outcome.
 */
export const aboutProgress = {
  eyebrow: 'Progress',
  heading: 'Progress, reviewed with care',
  body: 'Progress starts with noticing: the idea you explained more clearly, the question you asked without holding back, the conversation you stayed in. Our approach is designed to connect a clear starting point with repeatable practice and specific guidance, so each review points towards a useful next step. Every learner brings a different starting point and pace.',
} as const;

export const aboutPhilosophy = {
  eyebrow: 'Philosophy',
  heading: 'What we believe about learning',
  beliefs: [
    {
      title: 'Communication Before Perfection',
      body: 'Your first goal is to make yourself understood. We value the attempt, the exchange and the willingness to keep going—because clearer expression grows through use.',
    },
    {
      title: 'Learning That Adapts to You',
      body: 'A classroom presentation, an interview and a team meeting ask different things of you. Learning should make space for your starting point, your goals and the situations you want to feel ready for.',
    },
    {
      title: 'Technology With a Purpose',
      body: 'Technology earns its place when it makes the next step clearer. LAN-X AI is being developed to support voice and video practice, with feedback that informs learning while human judgement keeps its place.',
    },
  ],
} as const;

export const aboutApproach = {
  eyebrow: 'THE LANXGROW APPROACH',
  heading: 'English Is Not Just What You Know. It\'s What You Can Express.',
  body: [
    'Sometimes the thought is clear in your mind, but the words arrive too late. Sometimes you have an answer and still let the moment pass. We believe learning should help you meet those everyday moments with more preparation and less hesitation.',
    'The LanXgrow experience is being built around six connected parts: Call, Practice, Video Assessment, English Pro Course, Learn & Entertainment, and Dashboard. Together, they are designed to give learning a rhythm—explore an idea, put it into words, reflect on the experience and return with a clearer focus.',
  ],
} as const;

export const aboutCommitments = {
  eyebrow: 'Commitments',
  heading: 'What you can expect from us',
  items: [
    'A clear path forward: purposeful learning that connects your starting point with the conversations you want to handle.',
    'Practice for real life: speaking tasks shaped around everyday conversations, presentations, interviews and work.',
    'Guidance you can act on: specific next steps, with patience and respect for the way you learn.',
    'More reasons to keep learning: conversation, structured lessons and interest-led discovery within one connected approach.',
    'Progress with perspective: opportunities to reflect on your practice and choose what to work on next.',
  ],
} as const;
