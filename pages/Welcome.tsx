import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Logo } from '../components/Logo';
import { getUser } from '../services/storage';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-login if session exists
    const user = getUser();
    if (user) {
      navigate('/home');
    }
  }, [navigate]);

  return (
    <Layout className="bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="flex flex-col h-full p-8 justify-center items-center relative overflow-hidden">
        
        {/* Background elements for uplifted feel */}
        <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-teal-50 dark:bg-teal-900/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-60"></div>

        <div className="flex flex-col items-center text-center z-10 max-w-sm w-full space-y-8">
           {/* Hero Logo */}
           <div className="mb-6 p-8 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-50 to-transparent dark:from-teal-900/20 dark:to-transparent rounded-full blur-2xl"></div>
              <Logo size={140} className="relative z-10 drop-shadow-2xl" />
           </div>

           <div className="space-y-4">
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Counsy
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed px-2">
                For the nights you feel overwhelmed, we’re here.
              </p>
           </div>

           <div className="w-full pt-8">
            <button
              onClick={() => navigate('/auth')}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-400 text-white text-lg font-bold rounded-2xl shadow-xl shadow-teal-500/20 hover:shadow-teal-500/30 hover:scale-[1.02] transition-all active:scale-[0.98]"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Welcome;