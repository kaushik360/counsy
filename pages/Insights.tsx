import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import BottomNav from '../components/BottomNav';
import { BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getMoods } from '../services/storage';

// Mood mapping to numeric values for graph
const MOOD_SCORES: Record<string, number> = {
  'Ecstatic': 6,
  'Happy': 5,
  'Focused': 4,
  'Neutral': 3,
  'Sleepy': 2,
  'Sad': 1,
  'Anxious': 0
};

// Helper to get name from score
const getMoodName = (score: number) => {
  return Object.keys(MOOD_SCORES).find(key => MOOD_SCORES[key] === score) || '';
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const score = payload[0].value;
    const moodName = getMoodName(score);
    
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 outline-none">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {moodName}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const Insights: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [topMood, setTopMood] = useState<string>('N/A');
  const [totalCheckins, setTotalCheckins] = useState<number>(0);

  useEffect(() => {
    const moods = getMoods();
    setTotalCheckins(moods.length);

    // Calculate Top Mood
    if (moods.length > 0) {
      const moodCounts: Record<string, number> = {};
      moods.forEach(m => {
        moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
      });
      const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
      setTopMood(sortedMoods[0][0]);
    }

    // Generate Last 7 Days Data
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];

      // Find average or latest mood for this day
      // Simple approach: find the latest mood entry for this specific date
      const entry = moods.find(m => m.timestamp.startsWith(dateString));
      
      last7Days.push({
        name: dayName,
        mood: entry ? MOOD_SCORES[entry.mood] : null // null means no data for that day
      });
    }

    setChartData(last7Days);
  }, []);

  return (
    <Layout className="bg-white dark:bg-gray-900 pb-24">
      <div className="pt-12 px-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BarChart2 className="text-teal-500" /> Insights
        </h1>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 mb-6">
            <h2 className="font-bold text-gray-700 dark:text-gray-200 mb-4">Mood History</h2>
            <div className="h-48 w-full">
                {chartData.every(d => d.mood === null) ? (
                   <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                     No mood data available for this week.
                   </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                          <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis hide domain={[0, 6]} />
                          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#14b8a6', strokeWidth: 1, strokeDasharray: '4 4' }} />
                          <Line 
                            type="monotone" 
                            dataKey="mood" 
                            stroke="#14b8a6" 
                            strokeWidth={3} 
                            connectNulls
                            dot={{ fill: '#14b8a6', strokeWidth: 2, r: 4, stroke: '#fff' }} 
                            activeDot={{ r: 6, strokeWidth: 0 }}
                          />
                      </LineChart>
                  </ResponsiveContainer>
                )}
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">Last 7 Days</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-2xl border border-teal-100 dark:border-teal-800/30">
                <p className="text-teal-600 dark:text-teal-400 text-sm font-medium">Top Mood</p>
                <p className="text-2xl font-bold text-teal-800 dark:text-teal-200">{topMood}</p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">Check-ins</p>
                <p className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">{totalCheckins}</p>
            </div>
        </div>
      </div>
      <BottomNav />
    </Layout>
  );
};

export default Insights;