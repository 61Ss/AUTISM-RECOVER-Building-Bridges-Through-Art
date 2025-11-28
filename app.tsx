import React, { useState, useRef, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Heart, 
  Menu, 
  X, 
  Palette, 
  MessageCircle, 
  Hand, 
  Sparkles, 
  ArrowRight, 
  Upload, 
  RefreshCcw, 
  Smile, 
  Clock, 
  Users, 
  Layers 
} from 'lucide-react';

/**
 * ==========================================
 * 1. TYPES & MOCK API
 * ==========================================
 */

type Message = {
  id: string;
  role: 'child' | 'character';
  text: string;
};

type Step = {
  id: number;
  title: string;
  description: string;
};

// Mock API logic
const mockApi = {
  generateCharacter: async (imageData: string): Promise<{ success: boolean; characterUrl: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          // Placeholder for a generated 3D character visualization
          characterUrl: "Generated 3D Model" 
        });
      }, 2500); // Simulate 2.5s network delay
    });
  },
  
  sendHighFive: async (): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Nice job! I'm here with you! ✨");
      }, 800);
    });
  }
};

/**
 * ==========================================
 * 2. SHARED COMPONENTS
 * ==========================================
 */

// Navbar Component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Try Demo', path: '/demo' },
    { name: 'Research', path: '/research' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-rose-400 p-2 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
              <Heart className="text-white w-6 h-6 fill-current" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">
              AutismRecover
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-rose-100 text-rose-600'
                    : 'text-slate-600 hover:text-rose-500 hover:bg-rose-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-rose-100 p-4 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl font-medium ${
                isActive(link.path)
                  ? 'bg-rose-100 text-rose-600'
                  : 'text-slate-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

// Layout for Demo Steps
const StepLayout: React.FC<{
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ step, totalSteps, title, description, children }) => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 font-bold text-sm mb-4 border border-amber-200 shadow-sm">
          Step {step} of {totalSteps}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">{title}</h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">{description}</p>
      </div>
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-rose-100/50 border border-white p-6 md:p-10">
        {children}
      </div>
    </div>
  );
};

/**
 * ==========================================
 * 3. DEMO COMPONENTS
 * ==========================================
 */

// Step 1: Drawing Canvas
const DrawingCanvas: React.FC<{ onComplete: (data: string) => void }> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#fb7185'); // default rose-400

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 600;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 5;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleNext = () => {
    if (canvasRef.current) {
      onComplete(canvasRef.current.toDataURL());
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Canvas Area */}
      <div className="flex-1 w-full relative">
        <div className="border-4 border-dashed border-slate-200 rounded-3xl overflow-hidden cursor-crosshair shadow-inner bg-slate-50 touch-none">
          <canvas
            ref={canvasRef}
            className="w-full h-auto block"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
        <div className="mt-4 flex gap-4 items-center justify-center">
          <div className="flex bg-slate-100 p-2 rounded-full gap-2">
            {['#fb7185', '#fcd34d', '#a78bfa', '#38bdf8'].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-slate-600 scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <button 
            onClick={clearCanvas} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-full text-sm font-semibold transition-colors"
          >
            <RefreshCcw size={16} /> Clear
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="md:w-64 flex flex-col gap-6">
        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
          <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
            <Palette size={18} /> Tip
          </h4>
          <p className="text-amber-700/80 text-sm leading-relaxed">
            Draw a simple outline of a character or animal. Simple shapes work best for our AI to recognize!
          </p>
        </div>
        <button 
          onClick={handleNext}
          className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-rose-200 transition-all active:scale-95 flex justify-center items-center gap-2"
        >
          Create Character <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

// Step 2: 3D Preview
const CharacterPreview: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate generation time
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      {loading ? (
        <div className="text-center space-y-6">
          <div className="relative w-32 h-32 mx-auto">
             <div className="absolute inset-0 border-4 border-rose-200 rounded-full animate-ping opacity-25"></div>
             <div className="absolute inset-2 border-4 border-t-rose-500 border-r-rose-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
               <Sparkles className="text-rose-400 animate-pulse" size={32}/>
             </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-700">Making Magic Happen...</h3>
            <p className="text-slate-500">Transforming your 2D sketch into a 3D friend.</p>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center animate-fade-in">
          {/* Simulated 3D Viewport */}
          <div className="relative w-full max-w-lg aspect-square bg-gradient-to-b from-indigo-50 to-white rounded-[2rem] border-2 border-indigo-100 shadow-inner flex items-center justify-center overflow-hidden mb-8 group">
             {/* Abstract representation of a 3D character using CSS */}
             <div className="relative transition-transform duration-700 transform group-hover:scale-110 cursor-pointer">
                {/* Body */}
                <div className="w-32 h-40 bg-rose-400 rounded-[3rem] shadow-xl relative z-10 animate-bounce-slow">
                  {/* Face */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-16 bg-white/90 rounded-2xl flex items-center justify-center gap-2">
                     <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
                     <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
                  </div>
                  {/* Smile */}
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 w-8 h-4 border-b-4 border-rose-800 rounded-full"></div>
                </div>
                {/* Shadow */}
                <div className="w-24 h-4 bg-black/10 rounded-full mx-auto mt-4 blur-sm animate-pulse"></div>
             </div>
             
             {/* AR Badges */}
             <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm border border-indigo-50">
               AR Ready
             </div>
          </div>

          <div className="text-center max-w-md space-y-6">
            <p className="text-lg text-slate-600">
              "Hi! I'm your new friend. I look just like your drawing, but now I can move and talk with you!"
            </p>
            <button 
              onClick={onNext}
              className="px-8 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-violet-200 transition-all active:scale-95"
            >
              Start Conversation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Step 3: Chat Panel
const ChatPanel: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'character', text: 'Hello! I am so happy to meet you. What should we do today?' }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleReply = (text: string) => {
    // Add child message
    const newMsg: Message = { id: Date.now().toString(), role: 'child', text };
    setMessages(prev => [...prev, newMsg]);

    // Simulate Character response
    setTimeout(() => {
      let response = "That sounds wonderful! Tell me more!";
      if (text.includes('Hi')) response = "Hi there! *Waves happily*";
      if (text.includes('sad')) response = "Oh no, don't be sad. I am here with you. Would a high-five help?";
      if (text.includes('story')) response = "Once upon a time, there was a drawing that came to life... that's me!";
      
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'character', text: response }]);
    }, 1000);
  };

  return (
    <div className="h-[500px] flex flex-col bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100">
      {/* Header */}
      <div className="bg-white p-4 border-b border-slate-100 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
             <Smile className="text-rose-500" size={20} />
           </div>
           <div>
             <h4 className="font-bold text-slate-800">My Friend</h4>
             <p className="text-xs text-green-500 font-medium flex items-center gap-1">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
             </p>
           </div>
        </div>
        <button onClick={onNext} className="text-sm font-bold text-violet-500 hover:bg-violet-50 px-3 py-1 rounded-lg transition-colors">
           Skip to Interaction
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'child' ? 'justify-end' : 'justify-start'}`}>
             <div className={`max-w-[80%] p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm ${
               msg.role === 'child' 
                 ? 'bg-violet-500 text-white rounded-tr-none' 
                 : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
             }`}>
               {msg.text}
             </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-2">
          {['Say Hi 👋', 'Tell me a story 📖', 'I feel sad 😢', 'Let\'s play! 🎮'].map(opt => (
            <button 
              key={opt}
              onClick={() => handleReply(opt)}
              className="whitespace-nowrap px-4 py-2 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-600 rounded-full text-sm font-medium transition-colors border border-slate-200"
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200"
            disabled
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors">
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 4: High Five & Loading
const InteractionCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'highfive' | 'loading'>('highfive');
  const [feedback, setFeedback] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(1);
  const [isLoadingActive, setIsLoadingActive] = useState(false);

  // High Five Logic
  const triggerHighFive = async () => {
    setFeedback("Wait for it...");
    const res = await mockApi.sendHighFive();
    setFeedback(res);
    setTimeout(() => setFeedback(''), 3000);
  };

  // Loading Logic
  const startLoadingSim = () => {
    if (isLoadingActive) return;
    setIsLoadingActive(true);
    setLoadingProgress(0);
    setLoadingStep(1);

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoadingActive(false);
          return 100;
        }
        // Update Step text based on progress
        if (prev > 30 && prev < 60) setLoadingStep(2);
        if (prev > 60 && prev < 90) setLoadingStep(3);
        if (prev > 90) setLoadingStep(4);
        return prev + 2;
      });
    }, 100);
  };

  return (
    <div className="min-h-[400px]">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-6 w-fit mx-auto">
        <button
          onClick={() => setActiveTab('highfive')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'highfive' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          High-Five Interaction
        </button>
        <button
          onClick={() => setActiveTab('loading')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'loading' ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Anxiety-Free Loading
        </button>
      </div>

      {/* Content */}
      <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 relative overflow-hidden min-h-[300px] flex items-center justify-center">
        
        {/* High Five Scenario */}
        {activeTab === 'highfive' && (
          <div className="text-center animate-fade-in w-full">
            <div className="relative inline-block mb-6">
               <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-rose-100">
                  <Hand className="text-rose-400 w-16 h-16" />
               </div>
               {feedback && (
                 <div className="absolute -top-4 -right-12 bg-white px-4 py-2 rounded-xl shadow-lg border border-rose-100 animate-bounce-short">
                   <p className="text-rose-600 font-bold text-sm whitespace-nowrap">{feedback}</p>
                 </div>
               )}
            </div>
            
            <p className="text-slate-600 mb-6 max-w-sm mx-auto">
              Click the button to high-five your friend! This physical interaction builds a bond without needing words.
            </p>

            <button
              onClick={triggerHighFive}
              className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-rose-500 font-lg rounded-2xl hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-200 hover:-translate-y-1 active:scale-95"
            >
              <span className="mr-2 text-xl group-hover:rotate-12 transition-transform">✋</span> High Five!
            </button>
          </div>
        )}

        {/* Loading Scenario */}
        {activeTab === 'loading' && (
          <div className="w-full max-w-md animate-fade-in">
             {!isLoadingActive && loadingProgress === 0 ? (
               <div className="text-center">
                 <p className="text-slate-500 mb-4">See how we reduce anxiety during waiting times.</p>
                 <button onClick={startLoadingSim} className="px-6 py-3 bg-amber-400 text-white rounded-xl font-bold shadow-lg hover:bg-amber-500 transition-all">
                   Simulate Loading
                 </button>
               </div>
             ) : (
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                  {/* Anxiety Reducing Copy */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Clock size={20} className="text-amber-600 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">
                        {loadingStep === 1 && "Looking at your drawing..."}
                        {loadingStep === 2 && "Preparing the magic..."}
                        {loadingStep === 3 && "Waking up your friend..."}
                        {loadingStep === 4 && "Almost ready!"}
                      </h4>
                      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Step {Math.min(loadingStep, 4)} of 4</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-amber-400 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>

                  {/* Comforting Text */}
                  <p className="text-slate-600 text-sm italic text-center bg-slate-50 py-2 rounded-lg">
                    "I'm getting ready, just a few seconds left!"
                  </p>
                  
                  {loadingProgress === 100 && (
                    <div className="mt-4 text-center">
                       <button onClick={() => {setLoadingProgress(0); setIsLoadingActive(false);}} className="text-amber-500 font-bold text-sm hover:underline">
                         Reset Simulation
                       </button>
                    </div>
                  )}
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ==========================================
 * 4. PAGES
 * ==========================================
 */

// Home Page
const HomePage = () => {
  return (
    <div className="bg-orange-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
         {/* Background Decoration */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
           <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-rose-200/40 rounded-full blur-[80px]"></div>
           <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-amber-200/40 rounded-full blur-[80px]"></div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-rose-100 text-rose-500 font-semibold text-sm mb-6 shadow-sm">
              CPT208 Group 35 Project
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 tracking-tight mb-6">
              AutismRecover:<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">
                Building Bridges Through Art
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              An AR-based therapeutic system powered by Generative AI. We transform autistic children's drawings into interactive 3D companions, using art as a safe bridge for communication and emotional support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/demo" className="px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-rose-200/50 transition-all hover:-translate-y-1">
                Try the Demo
              </Link>
              <Link to="/research" className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg shadow-sm transition-all">
                Learn the Research
              </Link>
            </div>
         </div>
      </section>

      {/* Value Props */}
      <section className="py-20 bg-white rounded-t-[3rem] shadow-top">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Heart className="w-8 h-8 text-rose-500" />, 
                title: 'Emotional Support', 
                desc: 'Reduces anxiety through supportive dialogues and non-verbal interactions like high-fives.' 
              },
              { 
                icon: <Sparkles className="w-8 h-8 text-amber-500" />, 
                title: 'Personalized Companions', 
                desc: 'Uses Generative AI to turn children’s own sketches into unique, familiar 3D friends.' 
              },
              { 
                icon: <Layers className="w-8 h-8 text-violet-500" />, 
                title: 'AR-Based Interaction', 
                desc: 'Brings the digital friend into the real world via AR glasses for an immersive experience.' 
              }
            ].map((card, idx) => (
              <div key={idx} className="bg-orange-50/50 p-8 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-orange-100/50 transition-all border border-transparent hover:border-orange-100 group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{card.title}</h3>
                <p className="text-slate-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 border-t border-slate-100 pt-12 text-center">
          <div className="inline-flex items-center gap-2 text-slate-400 font-semibold uppercase tracking-widest text-sm mb-6">
            <Users size={16} /> Created by Group 35
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-slate-600 font-medium">
            <span>Tonghui Wu</span>
            <span>Zihan Yu</span>
            <span>Yize Liu</span>
            <span>Liwei Xu</span>
            <span>Haotian Zeng</span>
          </div>
        </div>
      </section>
    </div>
  );
};

// Demo Page
const DemoPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { id: 1, title: "Draw or Upload", desc: "Start by drawing a simple character outline." },
    { id: 2, title: "3D Character Preview", desc: "Watch AI transform your 2D sketch into a 3D model." },
    { id: 3, title: "Emotional Conversation", desc: "Chat with your new friend in a safe environment." },
    { id: 4, title: "Interaction & Loading", desc: "Experience the supportive waiting and high-five features." }
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const renderContent = () => {
    switch(currentStep) {
      case 1: return <DrawingCanvas onComplete={() => handleNext()} />;
      case 2: return <CharacterPreview onNext={() => handleNext()} />;
      case 3: return <ChatPanel onNext={() => handleNext()} />;
      case 4: return <InteractionCard />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 pb-20 pt-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Stepper Navigation */}
        <div className="flex justify-between items-center mb-12 relative max-w-3xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-0 -translate-y-1/2 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-rose-400 -z-0 -translate-y-1/2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          ></div>
          
          {steps.map((step) => (
             <button 
               key={step.id} 
               onClick={() => setCurrentStep(step.id)}
               className={`relative z-10 flex flex-col items-center gap-2 group`}
             >
               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 border-4 ${
                 currentStep >= step.id 
                   ? 'bg-rose-500 border-rose-200 text-white shadow-lg shadow-rose-200' 
                   : 'bg-white border-slate-200 text-slate-400'
               }`}>
                 {currentStep > step.id ? '✓' : step.id}
               </div>
               <span className={`text-xs font-bold absolute top-12 w-32 text-center transition-colors ${
                 currentStep === step.id ? 'text-rose-600' : 'text-slate-400'
               }`}>
                 {step.title}
               </span>
             </button>
          ))}
        </div>
        
        {/* Content Wrapper */}
        <div className="mt-16">
          <StepLayout 
            step={currentStep} 
            totalSteps={4}
            title={steps[currentStep-1].title} 
            description={steps[currentStep-1].desc}
          >
            {renderContent()}
          </StepLayout>
        </div>
      </div>
    </div>
  );
};

// Research Page
const ResearchPage = () => {
  const iterations = [
    {
      title: "Iteration 1: From Sketch to 3D",
      desc: "Validated the technical feasibility of the '2D Drawing → 3D Character' pipeline.",
      insight: "Key Discovery: Children were excited to see their art come to life, but static models lacked engagement.",
      color: "bg-blue-100 text-blue-800"
    },
    {
      title: "Iteration 2: High-Five Interaction",
      desc: "Introduced gesture-based interaction to transform the model into a 'friend'.",
      insight: "Key Change: Added AR gesture recognition. Children preferred physical interaction (high-fives) over passive viewing.",
      color: "bg-emerald-100 text-emerald-800"
    },
    {
      title: "Iteration 3: Dialogue UI",
      desc: "Evolved from a confusing left-panel chat to immersive speech bubbles.",
      insight: "Design Shift: Moving text closer to the avatar's face (Bubbles + Bottom Bar) significantly improved speaker attribution.",
      color: "bg-violet-100 text-violet-800"
    },
    {
      title: "Iteration 4: Waiting & Loading",
      desc: "Optimized the empty 'loading' state which caused anxiety.",
      insight: "Result: Adding progress bars and comforting voice prompts ('I'm almost here!') reduced anxiety scores by 35%.",
      color: "bg-amber-100 text-amber-800",
      hasChart: true
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Design Process & Iterations</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Our user-centered design process involved 4 major iterations, constantly refining based on feedback from children and experts.
          </p>
        </div>

        <div className="space-y-12">
          {/* Motivation Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
               <h3 className="text-2xl font-bold text-slate-800 mb-4">Problem Statement</h3>
               <p className="text-slate-600 leading-relaxed">
                 Autistic children often struggle with social interaction and initiating communication. Traditional therapy tools can be rigid, failing to engage their creativity or provide a "safe" bridge to the outside world.
               </p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
               <h3 className="text-2xl font-bold text-slate-800 mb-4">Target Users</h3>
               <p className="text-slate-600 leading-relaxed">
                 Children with autism spectrum disorder (ASD) aged 6-12 who show an interest in drawing but experience anxiety in face-to-face social scenarios.
               </p>
            </div>
          </div>

          {/* Iteration Timeline */}
          <div className="relative border-l-4 border-slate-200 ml-4 md:ml-0 md:pl-0 space-y-12">
            {iterations.map((iter, idx) => (
              <div key={idx} className="relative md:ml-12 pl-8 md:pl-0">
                {/* Timeline Dot */}
                <div className="absolute -left-[22px] md:-left-[52px] top-0 w-10 h-10 rounded-full bg-white border-4 border-slate-200 flex items-center justify-center font-bold text-slate-400 z-10">
                  {idx + 1}
                </div>
                
                <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${iter.color}`}>
                    {iter.title}
                  </div>
                  <p className="text-lg text-slate-700 font-medium mb-2">{iter.desc}</p>
                  <p className="text-slate-500 italic mb-4">{iter.insight}</p>
                  
                  {/* Specific chart for Iteration 4 */}
                  {iter.hasChart && (
                    <div className="mt-6 bg-slate-50 rounded-xl p-6 border border-slate-100">
                       <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">User Anxiety Levels (Lower is Better)</h4>
                       <div className="space-y-4">
                         <div>
                           <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                             <span>Before Optimization</span>
                             <span>High (8.5/10)</span>
                           </div>
                           <div className="w-full bg-slate-200 rounded-full h-4">
                             <div className="bg-slate-400 h-4 rounded-full w-[85%]"></div>
                           </div>
                         </div>
                         <div>
                           <div className="flex justify-between text-xs font-bold text-amber-600 mb-1">
                             <span>After (With Progress UI)</span>
                             <span>Low (3.2/10)</span>
                           </div>
                           <div className="w-full bg-slate-200 rounded-full h-4">
                             <div className="bg-amber-400 h-4 rounded-full w-[32%] transition-all duration-1000 animate-pulse"></div>
                           </div>
                         </div>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Layout
const App = () => {
  return (
    <Router>
      <div className="font-sans text-slate-900 selection:bg-rose-200 selection:text-rose-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/research" element={<ResearchPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;