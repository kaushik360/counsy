import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import BottomNav from '../components/BottomNav';
import { getUser, saveMood, getMoods } from '../services/storage';
import { getMoodInsight } from '../services/gemini';
import { User, MoodEntry } from '../types';
import { PenTool, Brain, Zap, Target, Laugh, Smile, Meh, Frown, Moon, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOODS = [
  { label: 'Ecstatic', icon: Laugh, color: 'text-yellow-500' },
  { label: 'Happy', icon: Smile, color: 'text-teal-500' },
  { label: 'Neutral', icon: Meh, color: 'text-gray-400' },
  { label: 'Sad', icon: Frown, color: 'text-blue-400' },
  { label: 'Anxious', icon: Zap, color: 'text-purple-400' },
  { label: 'Focused', icon: Brain, color: 'text-indigo-500' },
  { label: 'Sleepy', icon: Moon, color: 'text-indigo-300' },
];

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInsight, setSubmittedInsight] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = getUser();
    if (u) setUser(u);
    else navigate('/auth');

    // Check if already checked in today
    const moods = getMoods();
    if (moods.length > 0) {
      const latest = moods[0]; // moods are sorted new -> old
      const todayStr = new Date().toISOString().split('T')[0];
      const latestStr = latest.timestamp.split('T')[0];

      if (todayStr === latestStr) {
        setSelectedMood(latest.mood);
        setSubmittedInsight(latest.aiInsight || "You've already checked in today. Great job keeping track!");
      }
    }
  }, [navigate]);

  const handleMoodSelect = (moodLabel: string) => {
    // Only allow selection if not already submitted today
    if (!submittedInsight) {
      setSelectedMood(moodLabel);
    }
  };

  const submitMood = async () => {
    if (!selectedMood) return;
    setIsSubmitting(true);
    
    // Get AI insight first
    const insight = await getMoodInsight(selectedMood);
    
    const entry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood as any,
      timestamp: new Date().toISOString(),
      aiInsight: insight
    };

    saveMood(entry);
    setSubmittedInsight(insight);
    setIsSubmitting(false);
  };

  const resetCheckIn = () => {
    // Optional: Only used if we want to force re-entry, but for now we keep it locked per requirement
    // setSelectedMood(null);
    // setSubmittedInsight(null);
    navigate('/journal'); // Redirect to journal if they try to close
  };

  if (!user) return null;

  return (
    <Layout className="bg-gray-50/50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Good Morning, {user.name}</h1>
          <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-sm" />
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Mood Check-in Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          {!submittedInsight ? (
            <>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center">How are you feeling today?</h2>
              <div className="grid grid-cols-3 gap-y-6 gap-x-2">
                {MOODS.map((mood) => {
                   const Icon = mood.icon;
                   const isSelected = selectedMood === mood.label;
                   return (
                     <button
                      key={mood.label}
                      onClick={() => handleMoodSelect(mood.label)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                        isSelected ? 'bg-teal-50 dark:bg-teal-900/50 scale-105 ring-2 ring-teal-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                     >
                       <Icon size={32} className={`mb-2 ${mood.color}`} strokeWidth={1.5} />
                       <span className={`text-xs font-medium ${isSelected ? 'text-teal-700 dark:text-teal-300' : 'text-gray-500 dark:text-gray-400'}`}>
                         {mood.label}
                       </span>
                     </button>
                   )
                })}
              </div>
              <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                <button
                  disabled={!selectedMood || isSubmitting}
                  onClick={submitMood}
                  className={`w-full py-3.5 rounded-2xl font-bold text-white transition-all shadow-lg shadow-teal-500/20 ${
                    selectedMood 
                      ? 'bg-gradient-to-r from-teal-500 to-teal-400 hover:shadow-teal-500/30' 
                      : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Saving...' : 'Log Check-in'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-center animate-fade-in">
              <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mb-4 text-teal-600 dark:text-teal-400">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check-in Complete!</h2>
              <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-2xl border border-teal-100 dark:border-teal-800 mb-6 w-full">
                <p className="text-sm text-teal-800 dark:text-teal-200 font-medium leading-relaxed">
                  "{submittedInsight}"
                </p>
              </div>
              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={() => navigate('/journal')}
                  className="w-full py-3.5 bg-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/20 hover:bg-teal-600"
                >
                  Continue to Journal
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/journal')}
              className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center hover:border-teal-200 dark:hover:border-teal-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-3 text-teal-600 dark:text-teal-400">
                <PenTool size={24} />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">Journal</h4>
              <p className="text-xs text-gray-400 mt-1">Write down your thoughts</p>
            </button>

            <button 
               onClick={() => navigate('/focus')}
               className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center hover:border-teal-200 dark:hover:border-teal-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-3 text-teal-600 dark:text-teal-400">
                <Target size={24} />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">Focus Mode</h4>
              <p className="text-xs text-gray-400 mt-1">Minimize distractions</p>
            </button>

            <button 
               onClick={() => navigate('/counselor')}
               className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center hover:border-teal-200 dark:hover:border-teal-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-3 text-teal-600 dark:text-teal-400">
                <Brain size={24} />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">Counsy AI</h4>
              <p className="text-xs text-gray-400 mt-1">Get instant support</p>
            </button>

            <button 
               onClick={() => navigate('/streaks')}
               className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center hover:border-teal-200 dark:hover:border-teal-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-3 text-teal-600 dark:text-teal-400">
                <Zap size={24} />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">Streaks</h4>
              <p className="text-xs text-gray-400 mt-1">Track your progress</p>
            </button>
          </div>
        </div>

      </div>
      <BottomNav />
    </Layout>
  );
};

export default Home;