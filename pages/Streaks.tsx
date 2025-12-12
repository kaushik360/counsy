import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import BottomNav from '../components/BottomNav';
import { Flame, BookOpen, Smile, Zap, Trophy, Calendar } from 'lucide-react';
import { getStreakData } from '../services/storage';
import { StreakData } from '../types';

const Streaks: React.FC = () => {
  const [data, setData] = useState<StreakData | null>(null);

  useEffect(() => {
    setData(getStreakData());
  }, []);

  if (!data) return null;

  return (
    <Layout className="bg-white dark:bg-gray-900 pb-24">
      <div className="pt-12 px-6">
        <div className="flex items-center gap-2 mb-8">
           <Flame className="text-teal-500" size={28} fill="currentColor" />
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Streaks</h1>
        </div>

        {/* Main Streak Circle */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-48 h-48 rounded-full border-8 border-teal-50 dark:border-gray-800 flex items-center justify-center relative shadow-soft">
            <div className="w-40 h-40 rounded-full bg-teal-700 flex flex-col items-center justify-center text-white shadow-inner">
               <span className="text-5xl font-bold">{data.currentStreak}</span>
               <span className="text-sm font-medium opacity-90">Days</span>
            </div>
             {/* Decorative particles */}
            <div className="absolute -top-2 right-6 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
          </div>
          <p className="mt-4 text-gray-700 dark:text-gray-300 font-semibold text-lg">Current Streak</p>
        </div>

        {/* Metric Streaks */}
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Metric Streaks</h2>
        <div className="space-y-4 mb-10">
           {/* Journal Streak */}
           <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                 <div className="bg-teal-50 dark:bg-gray-700 p-3 rounded-full text-teal-600 dark:text-teal-400">
                    <BookOpen size={20} />
                 </div>
                 <span className="text-gray-700 dark:text-gray-300 font-medium">Journaling Streak</span>
              </div>
              <span className="text-xl font-bold text-teal-600 dark:text-teal-400">{data.journalStreak} Days</span>
           </div>

            {/* Mood Streak */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                 <div className="bg-teal-50 dark:bg-gray-700 p-3 rounded-full text-teal-600 dark:text-teal-400">
                    <Smile size={20} />
                 </div>
                 <span className="text-gray-700 dark:text-gray-300 font-medium">Mood Check-in Streak</span>
              </div>
              <span className="text-xl font-bold text-teal-600 dark:text-teal-400">{data.moodStreak} Days</span>
           </div>

           {/* Focus Streak */}
           <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                 <div className="bg-teal-50 dark:bg-gray-700 p-3 rounded-full text-teal-600 dark:text-teal-400">
                    <Zap size={20} />
                 </div>
                 <span className="text-gray-700 dark:text-gray-300 font-medium">Focus Mode Streak</span>
              </div>
              <span className="text-xl font-bold text-teal-600 dark:text-teal-400">{data.focusStreak} Days</span>
           </div>
        </div>

        {/* Achievements */}
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Achievements</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
            {/* Achieved Item */}
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 rounded-full border-2 border-teal-500 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-2">
                 <Zap size={24} fill={data.achievements.includes("Calm Starter") ? "currentColor" : "none"} />
               </div>
               <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Calm Starter</span>
            </div>

             {/* Locked/Achieved Item */}
             <div className="flex flex-col items-center">
               <div className={`w-16 h-16 rounded-full border-2 ${data.achievements.includes("7-Day Mindful") ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600'} flex items-center justify-center mb-2`}>
                 <Calendar size={24} />
               </div>
               <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">7-Day Mindful</span>
            </div>

            <div className="flex flex-col items-center">
               <div className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 flex items-center justify-center mb-2">
                 <Trophy size={24} />
               </div>
               <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Consistency Champ</span>
            </div>
        </div>
      </div>
      
       {/* Background Blob */}
       <div className="fixed bottom-0 right-0 w-40 h-40 bg-teal-50 dark:bg-teal-900/20 rounded-tl-[100px] -z-10 pointer-events-none mb-16"></div>
      
      <BottomNav />
    </Layout>
  );
};

export default Streaks;