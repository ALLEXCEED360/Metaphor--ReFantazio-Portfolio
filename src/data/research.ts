export const research = {
  id: 'cat-cot',
  title: 'CAT-CoT',
  subtitle: 'Context-Aware Thought Chain for Empathetic Dialogue',
  areas: ['Natural Language Processing', 'Large Language Models', 'Empathetic Dialogue'],
  dataset: { name: 'EmpatheticDialogues', from: '24,850', to: '16,789', unit: 'samples' },
  status: 'Under Review',
  venue: 'ARR 2025',
  pipeline: ['Input', 'Context', 'Reasoning', 'Empathy', 'Response'],
  abstract:
    'CAT-CoT asks a language model to first read the emotional context of a conversation, then reason about it explicitly, and only then respond. Separating those stages produced responses that were rated as more empathetic without sacrificing relevance.',
}
