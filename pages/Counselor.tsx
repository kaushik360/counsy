import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, HeartHandshake, Info, Mic, Send, MicOff, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage } from '../types';
import { getChatHistory, saveChatMessage, getUser } from '../services/storage';
import { getCounselorResponse, isDemoMode } from '../services/gemini';

const Counselor: React.FC = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const user = getUser();
    const history = getChatHistory();
    
    if (history.length === 0) {
        // Initial greeting with proper naming
        const initialMsg: ChatMessage = {
            id: 'init',
            role: 'model',
            text: `Hello ${user ? user.name : 'there'}! I'm Counsy AI, here to support you. How are you feeling today?`,
            timestamp: new Date().toISOString()
        };
        saveChatMessage(initialMsg);
        setMessages([initialMsg]);
    } else {
        setMessages(history);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? prev + ' ' : '') + transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: input,
        timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    saveChatMessage(userMsg);
    setInput('');
    setIsTyping(true);

    const user = getUser();
    // Pass the user's full name to the AI service
    const replyText = await getCounselorResponse(messages, input, user?.name || 'Friend');

    const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: replyText,
        timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, modelMsg]);
    saveChatMessage(modelMsg);
    setIsTyping(false);
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout className="bg-[#F8F9FB] dark:bg-gray-900 flex flex-col h-screen overflow-hidden">
        {/* Header - Glassmorphism */}
        <div className="absolute top-0 w-full z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
            <div className="px-6 pt-12 pb-4 flex justify-between items-center">
                <button onClick={() => navigate('/home')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-gray-700 dark:text-gray-200" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="font-bold text-gray-900 dark:text-white">Counsy AI</span>
                    <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isDemoMode() ? 'bg-yellow-500' : 'bg-teal-500 animate-pulse'}`}></span>
                        <span className="text-[10px] font-medium text-teal-600 dark:text-teal-400">
                            {isDemoMode() ? 'Demo Mode' : 'Online'}
                        </span>
                    </div>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <MoreVertical size={20} className="text-gray-700 dark:text-gray-200" />
                </button>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto pt-28 pb-4 px-4 space-y-6" ref={scrollRef}>
            <div className="text-center text-xs text-gray-400 my-4">Today</div>
            
            {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                    <div key={msg.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                        {!isUser && (
                            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mr-2 self-end mb-1 border border-teal-200 dark:border-teal-700">
                                <HeartHandshake size={16} className="text-teal-600 dark:text-teal-400" />
                            </div>
                        )}
                        
                        <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
                            <div 
                                className={`px-4 py-3 text-sm leading-relaxed shadow-sm relative ${
                                    isUser 
                                    ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-2xl rounded-br-none' 
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-700'
                                }`}
                            >
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 px-1">
                                {formatTime(msg.timestamp)}
                            </span>
                        </div>
                    </div>
                );
            })}
            
            {isTyping && (
                 <div className="flex justify-start w-full animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mr-2 self-end mb-1">
                        <HeartHandshake size={16} className="text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-bl-none flex space-x-1 items-center shadow-sm">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                 </div>
            )}
             {/* Spacer for bottom input */}
             <div className="h-20"></div> 
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg p-4 pb-6 border-t border-gray-100 dark:border-gray-800 z-20">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-teal-500/50 focus-within:border-teal-500 transition-all shadow-inner">
                <button 
                  onClick={toggleListening}
                  className={`p-2.5 rounded-full transition-all duration-300 ${
                    isListening 
                      ? 'bg-red-500 text-white shadow-md animate-pulse' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isListening ? "Listening..." : "Message..."}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 appearance-none outline-none"
                    style={{ backgroundColor: 'transparent' }}
                    autoFocus
                />
                
                <button 
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className={`p-2.5 rounded-full transition-all ${
                        input.trim() 
                        ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20 transform hover:scale-105 active:scale-95' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <Send size={18} fill={input.trim() ? "currentColor" : "none"} />
                </button>
            </div>
        </div>
    </Layout>
  );
};

export default Counselor;