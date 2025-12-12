import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import BottomNav from '../components/BottomNav';
import { Calendar, PenLine, Lock, Unlock, Sparkles, Plus, Laugh, Smile, Meh, Frown, Zap, Brain, Moon } from 'lucide-react';
import { getJournals, saveJournal } from '../services/storage';
import { analyzeJournalEntry } from '../services/gemini';
import { JournalEntry } from '../types';

const TAGS = ['Stress', 'Study', 'Routine', 'Thoughts', 'Work', 'Family', 'Relationships', 'Gratitude'];

const MOOD_ICONS = [
  { label: 'Ecstatic', icon: Laugh, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { label: 'Happy', icon: Smile, color: 'text-teal-500', bg: 'bg-teal-50' },
  { label: 'Neutral', icon: Meh, color: 'text-gray-400', bg: 'bg-gray-50' },
  { label: 'Sad', icon: Frown, color: 'text-blue-400', bg: 'bg-blue-50' },
  { label: 'Anxious', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-50' },
  { label: 'Focused', icon: Brain, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { label: 'Sleepy', icon: Moon, color: 'text-indigo-300', bg: 'bg-indigo-50/50' },
];

const Journal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Today' | 'History'>('Today');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [entryMood, setEntryMood] = useState<string>('Neutral');
  const [isLocked, setIsLocked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pastEntries, setPastEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    setPastEntries(getJournals());
  }, []);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    setIsSaving(true);
    
    const analysis = await analyzeJournalEntry(content);
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toISOString(),
      tags: selectedTags,
      mood: entryMood,
      isLocked,
      aiAnalysis: analysis
    };
    
    saveJournal(newEntry);
    setPastEntries([newEntry, ...pastEntries]);
    setContent('');
    setSelectedTags([]);
    setEntryMood('Neutral');
    setIsSaving(false);
    setActiveTab('History');
  };

  return (
    <Layout className="bg-white dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="pt-12 px-6 pb-4 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-teal-400 to-teal-600 p-2.5 rounded-xl text-white shadow-lg shadow-teal-500/30">
               <PenLine size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Journal</h1>
          </div>
          <button className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
            <Calendar size={20} />
          </button>
        </div>
        
        {/* Modern Segmented Control */}
        <div className="flex p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-2">
          <button 
            onClick={() => setActiveTab('Today')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                activeTab === 'Today' 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
          >
            Write Today
          </button>
          <button 
            onClick={() => setActiveTab('History')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                activeTab === 'History' 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
          >
            Past Entries
          </button>
        </div>
      </div>

      <div className="px-6">
        {activeTab === 'Today' ? (
          <div className="space-y-6 animate-fade-in">
            {/* Editor */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-1 border border-teal-100 dark:border-teal-900/30 shadow-lg shadow-teal-500/5 focus-within:ring-2 focus-within:ring-teal-500 transition-all">
               <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[20px] p-4">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{new Date().toLocaleDateString()}</span>
                     <button 
                        onClick={() => setIsLocked(!isLocked)} 
                        className={`text-gray-400 p-1.5 rounded-full transition-colors ${isLocked ? 'text-teal-500 bg-teal-50 dark:bg-teal-900/30' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                     >
                       {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                     </button>
                   </div>
                   <textarea 
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full bg-transparent border-none outline-none focus:ring-0 text-gray-800 dark:text-gray-200 placeholder-gray-400 min-h-[180px] resize-none text-base leading-relaxed"
                      placeholder="What's on your mind?..."
                   />
               </div>
            </div>

            {/* Tags */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Tags</p>
              <div className="flex flex-wrap gap-2">
                {TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
                      selectedTags.includes(tag) 
                        ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/20 transform scale-105' 
                        : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700 hover:border-teal-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                <button className="px-3 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-400 border border-transparent">
                    <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving || !content}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all transform active:scale-[0.98] ${
                 isSaving || !content 
                 ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed' 
                 : 'bg-gradient-to-r from-teal-500 to-teal-400 shadow-teal-500/30 hover:shadow-teal-500/40'
              }`}
            >
              {isSaving ? 'AI Analyzing...' : 'Save & Analyze'}
            </button>
          </div>
        ) : (
          <div className="space-y-5 pb-8 animate-fade-in">
             {/* List of past entries */}
             {pastEntries.length === 0 && (
                 <div className="flex flex-col items-center justify-center mt-12 text-gray-400">
                     <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <PenLine size={24} />
                     </div>
                     <p>No journal entries yet.</p>
                 </div>
             )}
             
             {pastEntries.map(entry => {
               // Find icon for mood
               const MoodIconObj = MOOD_ICONS.find(m => m.label === entry.mood) || MOOD_ICONS[2];
               const MIcon = MoodIconObj.icon;
               
               return (
               <div key={entry.id} className="group bg-white dark:bg-gray-800 p-5 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md hover:border-teal-100 dark:hover:border-teal-900/30">
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${MoodIconObj.bg} ${MoodIconObj.color} bg-opacity-50`}>
                             <MIcon size={20} />
                         </div>
                         <div>
                             <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                {new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                             </h3>
                             <p className="text-[10px] text-gray-400 font-medium">{new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                         </div>
                     </div>
                     {entry.isLocked && <Lock size={14} className="text-teal-500" />}
                  </div>
                  
                  <div className="relative">
                    <p className={`text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 ${entry.isLocked ? 'blur-sm select-none' : ''}`}>
                        {entry.isLocked ? 'This entry is locked for privacy.' : entry.content}
                    </p>
                    {entry.isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-white dark:bg-gray-900 px-3 py-1 rounded-full text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">Locked</span>
                        </div>
                    )}
                  </div>

                  {/* Tags Row */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                      {entry.tags.map(t => (
                          <span key={t} className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-[10px] font-medium text-gray-500 dark:text-gray-300">#{t}</span>
                      ))}
                  </div>

                  {entry.aiAnalysis && !entry.isLocked && (
                    <div className="bg-teal-50 dark:bg-teal-900/10 p-4 rounded-2xl border border-teal-100 dark:border-teal-800/30 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-teal-400"></div>
                      <div className="flex items-center gap-2 mb-3 text-teal-700 dark:text-teal-400">
                        <Sparkles size={14} fill="currentColor" />
                        <span className="text-xs font-extrabold uppercase tracking-wide">AI Insight</span>
                      </div>
                      
                      <div className="space-y-3 pl-1">
                        <div>
                          <p className="text-[10px] text-teal-800 dark:text-teal-300 font-bold uppercase mb-0.5 opacity-70">Emotional Tone</p>
                          <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-snug">{entry.aiAnalysis.moodSummary}</p>
                        </div>
                        
                        {entry.aiAnalysis.recommendations && entry.aiAnalysis.recommendations.length > 0 && (
                          <div>
                            <p className="text-[10px] text-teal-800 dark:text-teal-300 font-bold uppercase mb-1 opacity-70">Suggestion</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug italic">"{entry.aiAnalysis.recommendations[0]}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
               </div>
             )})}
          </div>
        )}
      </div>
      <BottomNav />
    </Layout>
  );
};

export default Journal;