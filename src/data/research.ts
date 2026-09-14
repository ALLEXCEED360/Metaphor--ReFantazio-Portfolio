/**
 * The one treatise: an undergraduate thesis at BRAC University, treated as a
 * full codex entry. Figures come from the thesis itself (June 2025).
 */

export interface BenchRow {
  model: string
  base: number
  tuned: number
}

export interface Chapter {
  id: string
  numeral: string
  title: string
  short: string
  paint: string
  art: number
}

export const research = {
  id: 'cat-cot',
  title: 'CAT-CoT',
  subtitle: 'Instruction-Tuning LLMs via Cognitive Appraisal Theory-Inspired Chain-of-Thought Reasoning to Enhance Emotional Expressivity',
  degree: 'B.Sc. in Computer Science and Engineering',
  institution: 'BRAC University',
  department: 'Department of Computer Science and Engineering',
  submitted: 'June 2025',
  supervisor: 'Dr. Jannatun Noor Mukta',
  advisors: ['Dr. A. B. M. Alim Al Islam, BUET', 'Dr. Tanjir Rashid Soron'],
  authors: ['Ashfaq Ahmad Saad', 'Asif Ahnaf Chowdhury', 'Fardeen Alam', 'Kazi Amzad Abid', 'A N M Jubair Tanvir'],
  grade: 'A',
  review: ['Springer Nature', 'ACL Rolling Review'],
  keywords: ['Cognitive Appraisal Theory', 'Instruction Tuning', 'Chain of Thought', 'Empathetic AI', 'Emotional Intelligence', 'LLMs'],

  abstract:
    'Large language models talk fluently but read emotion at the surface, leaning on keywords and sentiment cues. CAT-CoT teaches a model to appraise before it answers: what is at stake for the person, what they can do about it, and how the situation might be reframed. That reasoning is written into a synthetic dataset and taught to open models through instruction tuning.',

  stats: [
    { value: '4,641', label: 'appraisal dialogues' },
    { value: '9', label: 'open models tuned' },
    { value: '+6.5', unit: '%', label: 'emotion understanding' },
    { value: '+4.0', unit: '%', label: 'emotion application' },
    { value: '3', label: 'psychiatrists as judges' },
  ],

  /* the appraisal chain the model walks before it replies */
  chain: [
    {
      step: 'Primary appraisal',
      question: 'What is at stake?',
      facets: ['Goal relevance', 'Goal congruence', 'Ego involvement'],
      text: 'Does this matter to the person, does it help or hurt what they want, and how close is it to who they are.',
    },
    {
      step: 'Secondary appraisal',
      question: 'What can be done?',
      facets: ['Coping potential', 'Future expectancy', 'Perceived control'],
      text: 'Whether they can act on it, how it is likely to unfold, and how much of it is in their hands.',
    },
    {
      step: 'Reappraisal',
      question: 'Can it be reframed?',
      facets: ['Revised reading', 'Regulated emotion'],
      text: 'An optional second look that adjusts the first reading before a word of the reply is written.',
    },
  ],

  /* how the corpus was made and checked */
  corpus: [
    { title: 'Seed', text: 'EmpatheticDialogues, a benchmark of grounded emotional conversations.' },
    { title: 'Select', text: 'Cleaned and filtered to 4,641 single-turn exchanges with the emotion labels kept diverse.' },
    { title: 'Annotate', text: 'GPT-4o-mini writes a stepwise appraisal chain for every turn under a controlled rewriting prompt.' },
    { title: 'Verify', text: 'BLEU, ROUGE, BERTScore and Distinct-N against references, plus expert ratings on a 5-point scale.' },
    { title: 'Agree', text: "Three psychiatrists and two annotation teams, reliability checked with Krippendorff's alpha and Cohen's kappa." },
    { title: 'Tune', text: 'Qwen3, Qwen2.5, Qwen2 and Gemma 3 models from 0.6B to 14B instruction-tuned with Unsloth.' },
  ],

  /* EmoBench (English) overall accuracy, base vs CAT-CoT tuned */
  bench: {
    eu: {
      title: 'Emotion Understanding',
      rows: [
        { model: 'Qwen3 4B', base: 17.0, tuned: 23.5 },
        { model: 'Gemma 3 4B', base: 23.5, tuned: 26.5 },
        { model: 'Qwen3 8B', base: 26.5, tuned: 29.0 },
        { model: 'Qwen2.5 7B', base: 29.0, tuned: 31.0 },
      ] as BenchRow[],
    },
    ea: {
      title: 'Emotion Application',
      rows: [
        { model: 'Qwen3 1.7B', base: 51.5, tuned: 56.0 },
        { model: 'Qwen3 4B', base: 56.5, tuned: 60.5 },
        { model: 'Qwen2 7B', base: 63.5, tuned: 66.0 },
      ] as BenchRow[],
    },
    note: 'Mid-sized models gained the most. The tuned Qwen3 4B moved within reach of the untuned 8B, and gains landed in whichever segment a model was weakest in.',
  },

  /* the same prompt, before and after (Figure 1.1 of the thesis) */
  example: {
    prompt:
      'I am undergoing treatment for a chronic illness. While I feel a sense of hope due to positive feedback from my doctors, I am also overwhelmed by the uncertainty of what lies ahead and the potential for setbacks.',
    baseline: {
      model: 'Qwen3 1.7B',
      text: 'Your feelings are valid: hope and uncertainty are intertwined in the journey of chronic illness. While positive feedback from doctors brings reassurance, the uncertainty of the future can feel daunting. It is okay to feel overwhelmed; this is part of the process. Lean on your support network, stay informed, and remember that progress, though uncertain, is always possible. You are not alone in navigating this path.',
    },
    tuned: {
      model: 'Qwen3 1.7B · CAT-CoT',
      text: 'I can see that you are experiencing a complex mix of emotions right now, and it is completely understandable to feel both hopeful and overwhelmed. It is important to recognise that it is okay to have these feelings, and they reflect your current state of being. While the positive feedback from your doctors brings you hope, it is also natural to feel uncertain about what lies ahead. Remember, you are not alone in this journey, and there are support systems and coping strategies available to you. It might help to focus on small, manageable steps in your treatment and to reach out to someone you trust for support. You are doing your best, and it is okay to feel overwhelmed.',
    },
  },
}

export const chapters: Chapter[] = [
  { id: 'thesis', numeral: 'I', title: 'The Thesis', short: 'Thesis', paint: '#f14352', art: 4 },
  { id: 'chain', numeral: 'II', title: 'The Appraisal Chain', short: 'Chain', paint: '#ea6c1b', art: 12 },
  { id: 'corpus', numeral: 'III', title: 'The Corpus', short: 'Corpus', paint: '#d4a900', art: 7 },
  { id: 'trial', numeral: 'IV', title: 'The Trial', short: 'Trial', paint: '#0c8e5e', art: 14 },
  { id: 'voice', numeral: 'V', title: 'The Voice', short: 'Voice', paint: '#3a96aa', art: 9 },
]
