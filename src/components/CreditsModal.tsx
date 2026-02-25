import React, { useEffect, useState } from 'react';
import { X, Github, Sparkles, Code, Heart, Star } from 'lucide-react';

export const CreditsModal = ({ onClose }: { onClose: () => void }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay to allow CSS transitions to trigger after mount
    const timer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px] animate-spin-slow"></div>
      </div>

      <div className={`relative w-full max-w-3xl bg-slate-950/80 border border-white/10 rounded-3xl shadow-[0_0_100px_rgba(168,85,247,0.2)] overflow-hidden transition-all duration-700 transform ${mounted ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        
        {/* Top border gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-amber-400 to-cyan-500"></div>

        <button 
          onClick={onClose}
          className="absolute top-6 left-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10 border border-white/10"
        >
          <X className="text-slate-400 hover:text-white" size={24} />
        </button>

        <div className="p-10 md:p-16 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 mb-8 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <Sparkles className="text-amber-400 w-12 h-12" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 via-amber-400 to-cyan-400 bg-clip-text text-transparent">
            שבעים פנים
          </h2>
          <p className="text-xl text-slate-400 font-light mb-12 tracking-wide">
            ארגז הכלים לניתוח טקסטים בגישה יהודית
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
            {/* Leon's Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group relative overflow-hidden text-right">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400">
                    <Code size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">לאון יעקובוב</h3>
                    <p className="text-sm text-cyan-400">יוזם ומפתח הפרויקט</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  הוגה הרעיון, מאפיין המערכת ומוביל החזון של "שבעים פנים". יצירת גשר בין חכמת ישראל העתיקה לטכנולוגיה מודרנית.
                </p>
                <a 
                  href="https://github.com/AnLoMinus" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <Github size={16} />
                  <span>AnLoMinus</span>
                </a>
              </div>
            </div>

            {/* AI's Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group relative overflow-hidden text-right">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                    <Star size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Gemini AI</h3>
                    <p className="text-sm text-purple-400">שותף פיתוח ועיצוב</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  סיוע בקידוד, עיצוב הממשק, וארגון המידע. שיתוף פעולה טכנולוגי להפיכת החזון למציאות דיגיטלית מרהיבה.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300">
                  <Heart size={16} className="text-red-400" />
                  <span>נבנה באהבה</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-slate-500 text-sm flex flex-col items-center gap-2">
            <p>גרסה 79 השיטות • © {new Date().getFullYear()} כל הזכויות שמורות</p>
            <div className="flex gap-1 mt-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
