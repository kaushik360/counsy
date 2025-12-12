import React from 'react';
import Layout from '../components/Layout';
import BottomNav from '../components/BottomNav';
import { ArrowLeft, User, Bell, Shield, Target, Link as LinkIcon, Sun, Moon, ChevronRight, HelpCircle, Phone, Info, LogOut, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUser, logoutUser } from '../services/storage';
import { useTheme } from '../context/ThemeContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    logoutUser();
    navigate('/auth');
  };

  if (!user) return null;

  const MenuItem = ({ icon: Icon, label, detail, toggle = false, onClick }: { icon: any, label: string, detail?: string, toggle?: boolean, onClick?: () => void }) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0 text-left"
    >
      <div className="flex items-center gap-4">
        <Icon className="text-teal-500 shrink-0" size={20} strokeWidth={1.5} />
        <div className="flex flex-col">
            <span className="text-gray-700 dark:text-gray-200 font-medium text-sm">{label}</span>
            {detail && <span className="text-xs text-gray-400 mt-0.5">{detail}</span>}
        </div>
      </div>
      {toggle ? (
         <div className={`w-10 h-6 rounded-full relative transition-colors ${isDark ? 'bg-teal-500' : 'bg-gray-200'}`}>
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${isDark ? 'left-5' : 'left-1'}`}></div>
         </div>
      ) : (
        <ChevronRight className="text-gray-300 dark:text-gray-600 shrink-0" size={18} />
      )}
    </button>
  );

  return (
    <Layout className="bg-white dark:bg-gray-900 pb-24">
      <div className="pt-8 px-6 pb-4 bg-white dark:bg-gray-900 sticky top-0 z-10 transition-colors duration-200">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)}>
             <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile & Settings</h1>
        </div>
      </div>

      <div className="flex flex-col items-center mb-8 px-6">
        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-teal-400 to-teal-100 mb-4">
           <img src={user.avatarUrl} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
        <p className="text-teal-500 font-medium text-sm">@{user.username}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 mt-1">
          Building a better mind <span className="text-yellow-500">✨</span>
        </p>
      </div>

      <div className="px-6 space-y-6">
        <div>
           <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-3">Account Settings</h3>
           <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
             <MenuItem icon={User} label="Edit Profile" onClick={() => navigate('/edit-profile')} />
             <MenuItem icon={isDark ? Moon : Sun} label="Appearance (Dark Mode)" toggle onClick={toggleTheme} />
           </div>
        </div>

        <div>
           <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-3">Support</h3>
           <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
             <MenuItem 
                icon={Mail} 
                label="Help Center" 
                detail="kaushikmendhe360@gmail.com" 
                onClick={() => window.open('mailto:kaushikmendhe360@gmail.com')} 
             />
             <MenuItem 
                icon={Phone} 
                label="Contact Support" 
                detail="+91 9579261713" 
                onClick={() => window.open('tel:9579261713')} 
             />
             <MenuItem icon={Info} label="About Counsy" onClick={() => navigate('/about')} />
           </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full py-4 bg-teal-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/20"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
      
      <BottomNav />
    </Layout>
  );
};

export default Profile;