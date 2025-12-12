import React from 'react';
import Layout from '../components/Layout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout className="bg-white dark:bg-gray-900 pb-12">
       {/* Header */}
       <div className="pt-8 px-6 pb-4 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
             <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">About Counsy</h1>
        </div>
      </div>

      <div className="px-6 flex flex-col items-center animate-fade-in overflow-y-auto">
        <div className="my-6">
            <Logo size={80} showText={false} />
        </div>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed max-w-sm">
            <section className="bg-teal-50 dark:bg-teal-900/10 p-5 rounded-2xl border border-teal-100 dark:border-teal-800/30">
                <h2 className="text-lg font-bold text-teal-700 dark:text-teal-400 mb-3 flex items-center gap-2">
                    <span className="text-xl">🌿</span> About Counsy
                </h2>
                <p className="text-sm leading-6">
                    Counsy is a student-first mental wellness companion built for one simple purpose — to support you through the pressure, loneliness, and confusion that come with competitive exam prep.
                </p>
                <p className="text-sm mt-3 leading-6">
                    In a world where students are expected to handle everything alone, Counsy becomes the gentle presence that listens, guides, and lifts you when the journey gets overwhelming.
                </p>
            </section>

            <section>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="text-xl">❤️</span> Why Counsy Exists
                </h2>
                <p className="text-sm leading-6 mb-3">
                    Thousands of students struggle silently under the weight of expectations. Many go through burnout, anxiety, and isolation without support. Counsy is built to change that.
                </p>
                <ul className="space-y-2">
                    <li className="flex gap-3 text-sm">
                        <span className="text-teal-500 font-bold">•</span>
                        <span>Because your mental health matters as much as your marks.</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                        <span className="text-teal-500 font-bold">•</span>
                        <span>Because you deserve to feel seen, heard, and supported.</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                        <span className="text-teal-500 font-bold">•</span>
                        <span>Because no student should face their toughest days alone.</span>
                    </li>
                </ul>
            </section>

             <section className="bg-gradient-to-br from-teal-500 to-teal-600 p-6 rounded-2xl text-white shadow-lg shadow-teal-500/20">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span className="text-xl">🌟</span> Our Promise
                </h2>
                <p className="text-sm font-medium mb-2 opacity-90">
                    Counsy is more than an app.
                </p>
                <p className="text-sm opacity-90 leading-6">
                    It’s a companion for your late-night study sessions, your moments of doubt, your small wins, and your journey forward.
                </p>
                <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-sm font-bold">
                        With Counsy, every student gets the emotional support they deserve.
                    </p>
                </div>
            </section>
        </div>
        
        <div className="mt-12 mb-8 text-center">
            <p className="text-xs text-gray-400">Version 1.0.0</p>
            <p className="text-xs text-gray-400 mt-1">Made with ❤️ for Students</p>
        </div>
      </div>
    </Layout>
  );
};

export default About;