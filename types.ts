
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password?: string;
  avatarUrl: string;
  joinedDate: string;
}

export interface MoodEntry {
  id: string;
  mood: 'Ecstatic' | 'Happy' | 'Neutral' | 'Sad' | 'Anxious' | 'Focused' | 'Sleepy';
  timestamp: string;
  note?: string;
  aiInsight?: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  timestamp: string;
  tags: string[];
  mood: string;
  isLocked: boolean;
  aiAnalysis?: {
    moodSummary: string;
    productivityInsight: string;
    recommendations: string[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface StreakData {
  currentStreak: number; // Global daily streak
  lastActivityDate: string | null;
  
  // Specific Activity Streaks
  journalStreak: number;
  lastJournalDate: string | null;
  
  moodStreak: number;
  lastMoodDate: string | null;
  
  focusStreak: number;
  lastFocusDate: string | null;
  
  achievements: string[]; // IDs of achievements
}

export enum AchievementType {
  CALM_STARTER = 'Calm Starter',
  MINDFUL_7_DAY = '7-Day Mindful',
  CONSISTENCY_CHAMP = 'Consistency Champ',
  FOCUS_MASTER = 'Focus Master'
}
