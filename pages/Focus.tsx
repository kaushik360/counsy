import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle, Coffee, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { completeFocusSession } from '../services/storage';

const FOCUS_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60; // 5 minutes

const Focus: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [showCompletion, setShowCompletion] = useState(false);
  const timerRef = useRef<number | null>(null);

  const totalTime = mode === 'focus' ? FOCUS_TIME : BREAK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Audio cue (simple beep)
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.type = 'sine';
        oscillator.frequency.value = mode === 'focus' ? 880 : 500;
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        // Audio might be blocked, ignore
    }

    if (mode === 'focus') {
      completeFocusSession();
      setShowCompletion(true);
    } else {
        // Break over, reset to focus
        setMode('focus');
        setTimeLeft(FOCUS_TIME);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
    setShowCompletion(false);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? FOCUS_TIME : BREAK_TIME);
    setShowCompletion(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Dimensions for SVG
  const size = 280;
  const strokeWidth = 8;
  const center = size / 2;
  const radius = center - strokeWidth * 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <Layout className="bg-white dark:bg-gray-900">
      <div className="pt-8 px-6 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
             <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Focus Session</h1>
        </div>
      </div>

      <div className="px-6 flex flex-col items-center flex-1 justify-center pb-24 min-h-[500px]">
        
        {/* Mode Toggles */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl mb-12 w-64 shadow-inner">
            <button 
                onClick={() => switchMode('focus')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'focus' ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
                <Brain size={16} strokeWidth={2.5} /> Focus
            </button>
            <button 
                onClick={() => switchMode('break')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'break' ? 'bg-white dark:bg-gray-700 text-blue-500 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
                <Coffee size={16} strokeWidth={2.5} /> Break
            </button>
        </div>

        {/* Timer Circle */}
        <div className="relative mb-14" style={{ width: size, height: size }}>
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox={`0 0 ${size} ${size}`}>
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-gray-100 dark:text-gray-800"
                />
                {/* Progress Circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress / 100)}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ease-linear ${mode === 'focus' ? 'text-teal-500' : 'text-blue-500'}`}
                />
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {showCompletion ? (
                    <div className="animate-fade-in flex flex-col items-center">
                        <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4 text-teal-500">
                           <CheckCircle size={32} />
                        </div>
                        <span className="text-gray-900 dark:text-white font-bold text-2xl">Well Done!</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">+1 Focus Streak</span>
                    </div>
                ) : (
                    <>
                        <span className="text-6xl font-mono font-bold text-gray-900 dark:text-white tracking-tighter tabular-nums">
                            {formatTime(timeLeft)}
                        </span>
                        <span className={`font-bold mt-4 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest transition-colors ${isActive ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                            {isActive ? 'Active' : 'Paused'}
                        </span>
                    </>
                )}
            </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
             <button 
                onClick={resetTimer}
                className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95"
                title="Reset Timer"
             >
                 <RotateCcw size={22} />
             </button>

             {!showCompletion ? (
                 <button 
                    onClick={toggleTimer}
                    className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl transform transition-all active:scale-95 ${
                        isActive 
                        ? 'bg-amber-400 text-white shadow-amber-400/30 rotate-0' 
                        : 'bg-teal-500 text-white shadow-teal-500/30 hover:rotate-3'
                    }`}
                 >
                     {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                 </button>
             ) : (
                <button 
                    onClick={() => {
                        setShowCompletion(false);
                        switchMode('break');
                    }}
                    className="px-8 py-4 bg-teal-500 text-white rounded-2xl font-bold shadow-lg shadow-teal-500/30 active:scale-95 transition-transform"
                >
                    Start Break
                </button>
             )}
        </div>
      </div>
    </Layout>
  );
};

export default Focus;