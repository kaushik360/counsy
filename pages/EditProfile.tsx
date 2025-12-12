import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Check, RefreshCw, User, Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUser, updateUserProfile } from '../services/storage';
import { User as UserType } from '../types';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [name, setName] = useState('');
  // We now track the full URL for preview, whether it's an upload or a generated avatar
  const [previewUrl, setPreviewUrl] = useState('');
  // We keep the seed just in case they want to switch back to generated
  const [avatarSeed, setAvatarSeed] = useState(''); 
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const u = getUser();
    if (u) {
      setUser(u);
      setName(u.name);
      setPreviewUrl(u.avatarUrl);
      
      // Try to extract seed if it was a dicebear url
      try {
        const url = new URL(u.avatarUrl);
        if (url.hostname.includes('dicebear')) {
            const seed = url.searchParams.get('seed') || u.username;
            setAvatarSeed(seed);
        } else {
            setAvatarSeed(u.username);
        }
      } catch (e) {
        setAvatarSeed(u.username);
      }
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  const handleSave = () => {
    if (!user) return;
    setIsSaving(true);
    
    const updatedUser: UserType = {
      ...user,
      name,
      avatarUrl: previewUrl
    };
    
    updateUserProfile(updatedUser);
    
    setTimeout(() => {
        setIsSaving(false);
        navigate('/profile');
    }, 500);
  };

  const regenerateAvatar = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setAvatarSeed(newSeed);
    setPreviewUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Show loading spinner instead of null
  if (!user) {
    return (
      <Layout className="bg-white dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </Layout>
    );
  }

  return (
    <Layout className="bg-white dark:bg-gray-900 pb-24">
      <div className="pt-8 px-6 pb-4 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
             <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
        </div>
      </div>

      <div className="px-6 flex flex-col items-center mt-4">
        <div className="relative mb-8 group">
            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-teal-400 to-teal-100 shadow-xl">
                <img 
                    src={previewUrl} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 bg-white" 
                />
            </div>
            
            {/* Action Buttons Row */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
                    title="Upload Photo"
                >
                    <ImageIcon size={16} />
                </button>
                <button 
                    onClick={regenerateAvatar}
                    className="p-2 bg-teal-500 text-white rounded-full shadow-lg hover:bg-teal-600 transition-colors"
                    title="Generate Cartoon"
                >
                    <RefreshCw size={16} />
                </button>
            </div>
            
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload}
            />
        </div>

        <div className="w-full space-y-6 mt-6">
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Your Name"
                    />
                </div>
            </div>

            <div>
                 <label className="block text-sm font-semibold text-gray-400 dark:text-gray-500 mb-2">Username (Cannot be changed)</label>
                 <div className="w-full px-4 py-3.5 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-500 cursor-not-allowed">
                    @{user.username}
                 </div>
            </div>

             <div>
                 <label className="block text-sm font-semibold text-gray-400 dark:text-gray-500 mb-2">Email Address (Cannot be changed)</label>
                 <div className="w-full px-4 py-3.5 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-500 cursor-not-allowed">
                    {user.email}
                 </div>
            </div>
        </div>

        <button
            onClick={handleSave}
            disabled={!name || isSaving}
            className={`w-full mt-10 py-4 font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all ${
                !name || isSaving
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-teal-500 text-white hover:bg-teal-600 shadow-teal-500/20 active:scale-[0.98]'
            }`}
        >
            {isSaving ? (
                <>Saving...</>
            ) : (
                <>
                    <Check size={20} />
                    Save Changes
                </>
            )}
        </button>
      </div>
    </Layout>
  );
};

export default EditProfile;