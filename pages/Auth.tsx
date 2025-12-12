import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Logo } from '../components/Logo';
import { Mail, Lock, ArrowLeft, User, Check, X, AlertCircle } from 'lucide-react';
import { registerUser, loginUser, checkUsernameAvailability } from '../services/storage';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form Fields
  const [email, setEmail] = useState(''); // Serves as "identifier" (email or username) in login mode
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');

  // Validation States
  const [error, setError] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);

  // Clear states when switching modes
  useEffect(() => {
    setError(null);
    setUsernameAvailable(null);
    setEmail('');
    setPassword('');
    setUsername('');
    setName('');
  }, [isLogin]);

  // Real-time username availability check (only for registration)
  useEffect(() => {
    if (isLogin || !username) {
      setUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(() => {
      setIsCheckingUser(true);
      const available = checkUsernameAvailability(username);
      setUsernameAvailable(available);
      setIsCheckingUser(false);
    }, 500); // Debounce

    return () => clearTimeout(timer);
  }, [username, isLogin]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      // Login Logic
      const result = loginUser(email, password);
      if (result.success) {
        navigate('/home');
      } else {
        setError(result.message || 'Login failed');
      }
    } else {
      // Registration Logic
      if (!usernameAvailable) {
        setError("Username is not available");
        return;
      }

      const result = registerUser({
        id: Date.now().toString(),
        name: name || username,
        email,
        username,
        password,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        joinedDate: new Date().toISOString()
      });

      if (result.success) {
        navigate('/home');
      } else {
        setError(result.message || 'Registration failed');
      }
    }
  };

  return (
    <Layout>
      <div className="relative h-full p-8 flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
        {/* Background Blob */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-teal-50 dark:bg-teal-900/20 rounded-br-[100px] -z-0"></div>

        {/* Back Button */}
        <button onClick={() => navigate('/')} className="absolute top-12 left-8 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-600 dark:text-gray-300">
           <ArrowLeft size={20} />
        </button>

        <div className="mt-24 z-10">
          <div className="mb-2">
            <Logo size={50} showText />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {isLogin ? 'Your journey to peace continues here.' : 'Start your mental wellness journey.'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2 text-sm font-medium">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            
            {!isLogin && (
              <>
                 {/* Name Field */}
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Username Field */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Username</label>
                       {username && !isCheckingUser && (
                         <span className={`text-xs font-bold ${usernameAvailable ? 'text-teal-500' : 'text-red-500'}`}>
                           {usernameAvailable ? 'Available' : 'Taken'}
                         </span>
                       )}
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))}
                        placeholder="username"
                        className={`w-full pl-12 pr-10 py-3.5 border rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 ${username && usernameAvailable === false ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                        required
                        minLength={3}
                      />
                      {username && (
                         <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {isCheckingUser ? (
                              <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : usernameAvailable ? (
                              <Check size={18} className="text-teal-500" />
                            ) : (
                              <X size={18} className="text-red-500" />
                            )}
                         </div>
                      )}
                    </div>
                  </div>
              </>
            )}

            {/* Email / Username Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {isLogin ? "Email or Username" : "Email Address"}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={isLogin ? "text" : "email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isLogin ? "username or email@example.com" : "your@example.com"}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={!isLogin && !usernameAvailable}
              className={`w-full py-4 font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] ${
                !isLogin && !usernameAvailable 
                 ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                 : 'bg-gradient-to-r from-teal-500 to-teal-400 text-white shadow-teal-500/30 hover:shadow-teal-500/40'
              }`}
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-400">OR</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full py-3.5 border-2 border-teal-500 text-teal-600 dark:text-teal-400 font-bold rounded-2xl hover:bg-teal-50 dark:hover:bg-gray-800 transition-colors"
          >
            {isLogin ? 'Create Account' : 'Login Instead'}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;