
import { User, MoodEntry, JournalEntry, StreakData, ChatMessage, AchievementType } from '../types';

const STORAGE_KEYS = {
  USER: 'counsy_user', // Current session user
  USERS_DB: 'counsy_users_db', // All registered users
  MOODS: 'counsy_moods',
  JOURNALS: 'counsy_journals',
  STREAKS: 'counsy_streaks',
  CHAT: 'counsy_chat_history'
};

// --- User Session ---
export const getUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const logoutUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// --- User Database (Auth Simulation) ---
const getAllUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS_DB);
  return data ? JSON.parse(data) : [];
};

export const registerUser = (userData: User): { success: boolean; message?: string; user?: User } => {
  const users = getAllUsers();
  
  // Check if email already exists
  if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
    return { success: false, message: 'Email already registered.' };
  }

  // Check if username already exists
  if (users.some(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
    return { success: false, message: 'Username is taken.' };
  }

  // Add new user
  users.push(userData);
  localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
  
  // Set as current session
  saveUser(userData);
  
  return { success: true, user: userData };
};

export const loginUser = (identifier: string, password: string): { success: boolean; message?: string; user?: User } => {
  const users = getAllUsers();
  // Check email OR username
  const user = users.find(u => 
    (u.email.toLowerCase() === identifier.toLowerCase() || u.username.toLowerCase() === identifier.toLowerCase()) && 
    u.password === password
  );

  if (user) {
    saveUser(user);
    return { success: true, user };
  }

  return { success: false, message: 'Invalid credentials.' };
};

export const checkUsernameAvailability = (username: string): boolean => {
  const users = getAllUsers();
  return !users.some(u => u.username.toLowerCase() === username.toLowerCase());
};

export const updateUserProfile = (updatedUser: User): void => {
  // Update session
  saveUser(updatedUser);

  // Update DB
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
  }
};

// --- Moods ---
export const getMoods = (): MoodEntry[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MOODS);
  return data ? JSON.parse(data) : [];
};

export const saveMood = (mood: MoodEntry): void => {
  const moods = getMoods();
  moods.unshift(mood); // Add to top
  localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(moods));
  updateStreak('mood');
};

// --- Journals ---
export const getJournals = (): JournalEntry[] => {
  const data = localStorage.getItem(STORAGE_KEYS.JOURNALS);
  return data ? JSON.parse(data) : [];
};

export const saveJournal = (entry: JournalEntry): void => {
  const journals = getJournals();
  journals.unshift(entry);
  localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
  updateStreak('journal');
};

// --- Chat ---
export const getChatHistory = (): ChatMessage[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CHAT);
  return data ? JSON.parse(data) : [];
};

export const saveChatMessage = (message: ChatMessage): void => {
  const history = getChatHistory();
  history.push(message);
  localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(history));
};

export const clearChatHistory = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CHAT);
};

// --- Streaks & Achievements ---
export const getStreakData = (): StreakData => {
  const data = localStorage.getItem(STORAGE_KEYS.STREAKS);
  if (data) return JSON.parse(data);
  return {
    currentStreak: 0,
    lastActivityDate: null,
    journalStreak: 0,
    lastJournalDate: null,
    moodStreak: 0,
    lastMoodDate: null,
    focusStreak: 0,
    lastFocusDate: null,
    achievements: []
  };
};

export const completeFocusSession = () => {
  updateStreak('focus');
};

const calculateNewStreak = (currentStreak: number, lastDateStr: string | null, todayStr: string): number => {
  if (!lastDateStr) return 1;
  
  if (lastDateStr === todayStr) return currentStreak; // Already done today

  const lastDate = new Date(lastDateStr);
  const today = new Date(todayStr);
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  // If last date was yesterday (difference is 1 day or close to it due to timezones, simple string compare checks date part)
  // Let's rely on string math for safety:
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastDateStr === yesterdayStr) {
    return currentStreak + 1;
  } else {
    // Gap > 1 day, reset
    return 1;
  }
};

const updateStreak = (type: 'journal' | 'mood' | 'focus') => {
  const data = getStreakData();
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Update Global Streak
  data.currentStreak = calculateNewStreak(data.currentStreak, data.lastActivityDate, todayStr);
  data.lastActivityDate = todayStr;

  // 2. Update Specific Streak
  if (type === 'journal') {
    data.journalStreak = calculateNewStreak(data.journalStreak, data.lastJournalDate, todayStr);
    data.lastJournalDate = todayStr;
  } else if (type === 'mood') {
    data.moodStreak = calculateNewStreak(data.moodStreak, data.lastMoodDate, todayStr);
    data.lastMoodDate = todayStr;
  } else if (type === 'focus') {
    data.focusStreak = calculateNewStreak(data.focusStreak, data.lastFocusDate, todayStr);
    data.lastFocusDate = todayStr;
  }

  // 3. Check Achievements
  const newAchievements = new Set(data.achievements);

  // Starter
  if (!newAchievements.has(AchievementType.CALM_STARTER)) {
    newAchievements.add(AchievementType.CALM_STARTER);
  }
  
  // 7-Day Global
  if (data.currentStreak >= 7 && !newAchievements.has(AchievementType.MINDFUL_7_DAY)) {
    newAchievements.add(AchievementType.MINDFUL_7_DAY);
  }

  // Consistency (e.g., 30 days global or high journal)
  if (data.currentStreak >= 30 && !newAchievements.has(AchievementType.CONSISTENCY_CHAMP)) {
    newAchievements.add(AchievementType.CONSISTENCY_CHAMP);
  }
  
  // Focus Master (e.g. 5 focus sessions in a row)
  if (data.focusStreak >= 5 && !newAchievements.has(AchievementType.FOCUS_MASTER)) {
    newAchievements.add(AchievementType.FOCUS_MASTER);
  }

  data.achievements = Array.from(newAchievements);

  localStorage.setItem(STORAGE_KEYS.STREAKS, JSON.stringify(data));
};
