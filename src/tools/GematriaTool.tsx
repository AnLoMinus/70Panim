import React, { useState, useEffect } from 'react';
import { X, Calculator, Copy, Check } from 'lucide-react';

interface GematriaToolProps {
  onClose: () => void;
}

export const GematriaTool: React.FC<GematriaToolProps> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [value, setValue] = useState(0);
  const [copied, setCopied] = useState(false);

  const calculateGematria = (text: string) => {
    const gematriaMap: Record<string, number> = {
      'א': 1, 'b': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
      'י': 10, 'כ': 20, 'ך': 20, 'ל': 30, 'מ': 40, 'ם': 40, 'נ': 50, 'ן': 50,
      'ס': 60, 'ע': 70, 'פ': 80, 'ף': 80, 'צ': 90, 'ץ': 90, 'ק': 100, 'r': 200,
      'ש': 300, 'ת': 400
    };
    
    // Handle Hebrew letters specifically
    let sum = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      // Basic mapping
      if (gematriaMap[char]) {
        sum += gematriaMap[char];
      }
      // Handle 'ר' specifically if missed in map or special chars
      else if (char === 'ר') sum += 200;
      else if (char === 'ב') sum += 2;
    }
    return sum;
  };

  useEffect(() => {
    setValue(calculateGematria(input));
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Calculator className="text-cyan-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">מחשבון גימטריה</h2>
              <p className="text-xs text-slate-400">המרה מספרית של אותיות העברית</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Main Content */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
            
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 text-sm text-slate-300 leading-relaxed">
              <p>
                <strong>גימטריה</strong> היא שיטה לחישוב ערך מספרי של מילים, המבוססת על סכום ערכי האותיות המרכיבות אותן.
                כלי זה מחשב את הערך הגימטרי הרגיל (א=1, ת=400).
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-medium">הזן טקסט לחישוב:</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="הקלד כאן..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-lg text-white focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                dir="rtl"
              />
            </div>

            <div className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-white/10 rounded-xl p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 uppercase tracking-widest">ערך גימטרי</span>
                <div className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  {value.toLocaleString()}
                </div>
              </div>
              
              <button
                onClick={handleCopy}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all active:scale-95 group"
                title="העתק תוצאה"
              >
                {copied ? <Check className="text-green-400" /> : <Copy className="text-slate-400 group-hover:text-white" />}
              </button>
            </div>
          </div>

          {/* Sidebar Reference */}
          <div className="w-full md:w-48 bg-black/20 border-t md:border-t-0 md:border-r border-white/10 p-4 overflow-y-auto custom-scrollbar shrink-0">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">מפתח האותיות</h3>
            <div className="grid grid-cols-3 md:grid-cols-1 gap-2">
              {[
                {l:'א',v:1}, {l:'ב',v:2}, {l:'ג',v:3}, {l:'ד',v:4}, {l:'ה',v:5},
                {l:'ו',v:6}, {l:'ז',v:7}, {l:'ח',v:8}, {l:'ט',v:9}, {l:'י',v:10},
                {l:'כ',v:20}, {l:'ל',v:30}, {l:'מ',v:40}, {l:'נ',v:50}, {l:'ס',v:60},
                {l:'ע',v:70}, {l:'פ',v:80}, {l:'צ',v:90}, {l:'ק',v:100}, {l:'ר',v:200},
                {l:'ש',v:300}, {l:'ת',v:400}
              ].map((item) => (
                <div key={item.l} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5 text-xs">
                  <span className="font-bold text-slate-200">{item.l}</span>
                  <span className="font-mono text-cyan-400">{item.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
