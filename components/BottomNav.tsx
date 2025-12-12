import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Sparkles, BarChart2, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/journal', icon: BookOpen, label: 'Journal' },
    { path: '/counselor', icon: Sparkles, label: 'Counselor' },
    { path: '/insights', icon: BarChart2, label: 'Insights' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-safe z-50 transition-colors duration-200">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-16 transition-colors duration-200 ${
                active ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300'
              }`}
            >
              <Icon size={24} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[10px] mt-1 font-medium ${active ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;