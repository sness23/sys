export const CATEGORIES = [
  { id: 'home', name: 'Home & Moving', emoji: '🏠' },
  { id: 'beauty', name: 'Beauty & Wellness', emoji: '💆' },
  { id: 'tech', name: 'Tech & Digital', emoji: '💻' },
  { id: 'creative', name: 'Creative & Design', emoji: '🎨' },
  { id: 'tutoring', name: 'Tutoring & Learning', emoji: '📚' },
  { id: 'fitness', name: 'Fitness & Sports', emoji: '💪' },
  { id: 'food', name: 'Food & Cooking', emoji: '🍳' },
  { id: 'transport', name: 'Transportation', emoji: '🚗' },
  { id: 'events', name: 'Events & Entertainment', emoji: '🎉' },
  { id: 'other', name: 'Other', emoji: '✨' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];
