import React, { useState } from 'react';
import { X, BarChart2 } from 'lucide-react';

interface TextStatsToolProps {
  onClose: () => void;
}

export const TextStatsTool: React.FC<TextStatsToolProps> = ({ onClose }) => {
  const [input, setInput] = useState('');

  const stats = {
    chars: input.length,
    charsNoSpaces: input.replace(/\s/g, '').length,
    words: input.trim() ? input.trim().split(/\s+/).length : 0,
    lines: input.trim() ? input.split(/\n/).length : 0,
    sentences: input.split(/[.?!]+/).filter(s => s.trim().length > 0).length
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <BarChart2 className="text-amber-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">ניתוח סטטיסטי</h2>
              <p className="text-xs text-slate-400">נתונים כמותיים על הטקסט</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar max-h-[80vh]">
          
          <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 text-sm text-slate-300 leading-relaxed">
            <p>
              כלי זה מספק <strong>ניתוח כמותי</strong> של הטקסט המוזן: ספירת מילים, תווים, שורות ומשפטים.
              נתונים אלו יכולים לסייע בהבנת היקף הטקסט ומבנהו.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-medium">הזן טקסט לניתוח:</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="הקלד כאן..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-lg text-white focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
              dir="rtl"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label="מילים" value={stats.words} />
            <StatBox label="תווים (כולל רווחים)" value={stats.chars} />
            <StatBox label="תווים (ללא רווחים)" value={stats.charsNoSpaces} />
            <StatBox label="שורות" value={stats.lines} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value }: { label: string, value: number }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center">
    <span className="text-3xl font-bold text-amber-400 mb-1">{value.toLocaleString()}</span>
    <span className="text-xs text-slate-400 uppercase tracking-wide">{label}</span>
  </div>
);
