// User types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

// Habit types
export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: 'health' | 'productivity' | 'learning' | 'fitness' | 'mindfulness' | 'social' | 'other';
  frequency: 'daily' | 'weekly' | 'monthly';
  targetCount: number;
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  completions: HabitCompletion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHabitRequest {
  title: string;
  description?: string;
  category: 'health' | 'productivity' | 'learning' | 'fitness' | 'mindfulness' | 'social' | 'other';
  frequency: 'daily' | 'weekly' | 'monthly';
  targetCount?: number;
}

export interface UpdateHabitRequest {
  title?: string;
  description?: string;
  category?: 'health' | 'productivity' | 'learning' | 'fitness' | 'mindfulness' | 'social' | 'other';
  frequency?: 'daily' | 'weekly' | 'monthly';
  targetCount?: number;
}

export interface HabitCompletion {
  // Assuming this interface is defined elsewhere in the code
}

export interface CreateHabitData {
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  category: string;
}

// Roommate types
export interface Roommate {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
}

export interface Chore {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  dueDate: string;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface CreateChoreData {
  title: string;
  description?: string;
  assignedTo: string;
  dueDate: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  category: string;
  date: string;
  receipt?: string;
  createdAt: string;
}

export interface CreateExpenseData {
  title: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  category: string;
  date: string;
  receipt?: string;
}

// Secret Circle types
export interface Secret {
  id: string;
  content: string;
  author: string;
  isAnonymous: boolean;
  likes: number;
  comments: Comment[];
  createdAt: string;
}

export interface CreateSecretData {
  content: string;
  isAnonymous: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

// Mood tracking types
export interface Mood {
  id: string;
  rating: number; // 1-10
  note?: string;
  tags: string[];
  date: string;
  userId: string;
  createdAt: string;
}

export interface CreateMoodData {
  rating: number;
  note?: string;
  tags: string[];
  date: string;
}

// Analytics types
export interface HabitAnalytics {
  totalHabits: number;
  completedToday: number;
  currentStreak: number;
  longestStreak: number;
  weeklyCompletion: number;
  monthlyCompletion: number;
}

export interface RoommateAnalytics {
  totalChores: number;
  completedChores: number;
  totalExpenses: number;
  yourShare: number;
  choreCompletion: { [key: string]: number };
}

export interface MoodAnalytics {
  averageRating: number;
  moodTrend: 'improving' | 'declining' | 'stable';
  commonTags: string[];
  weeklyAverage: number[];
}

export interface MoodInsights {
  patterns: string[];
  recommendations: string[];
}
