import React, { useState } from 'react';
import { X, ArrowLeftRight, Copy, Check } from 'lucide-react';

interface AtbashToolProps {
  onClose: () => void;
}

export const AtbashTool: React.FC<AtbashToolProps> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const calculateAtbash = (text: string) => {
    const map: Record<string, string> = {
      'א': 'ת', 'b': 'ש', 'ג': 'r', 'ד': 'ק', 'ה': 'צ', 'ו': 'פ', 'ז': 'ע', 'ח': 'ס', 'ט': 'נ', 'י': 'מ', 'כ': 'ל',
      'ל': 'כ', 'מ': 'י', 'נ': 'ט', 'ס': 'ח', 'ע': 'ז', 'פ': 'ו', 'צ': 'ה', 'ק': 'ד', 'r': 'ג', 'ש': 'b', 'ת': 'א',
      'ך': 'ל', 'ם': 'י', 'ן': 'ט', 'ף': 'ו', 'ץ': 'ה' // Sofiot handling (often mapped to regular or specific pairs, here mapping to regular counterpart's pair)
    };
    
    return text.split('').map(char => map[char] || char).join('');
  };

  const output = calculateAtbash(input);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <ArrowLeftRight className="text-purple-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">צופן אתב"ש</h2>
              <p className="text-xs text-slate-400">החלפת אותיות סימטרית (א-ת, ב-ש)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
            
            <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-4 text-sm text-slate-300 leading-relaxed">
              <p>
                <strong>אתב"ש</strong> הוא צופן החלפה עתיק שבו האות הראשונה באלפבית מוחלפת באחרונה, השנייה בלקפני-אחרונה, וכן הלאה.
                <br/>
                השם נגזר מהחלפת האותיות הראשונות: <strong>א</strong>-<strong>ת</strong>, <strong>ב</strong>-<strong>ש</strong>.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-medium">הזן טקסט להמרה:</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="הקלד כאן..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-medium">תוצאה:</label>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 min-h-[80px] flex items-start justify-between gap-4">
                <p className="text-lg text-purple-200 font-mono break-words w-full">{output || '...'}</p>
                <button
                  onClick={handleCopy}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all active:scale-95 shrink-0"
                  title="העתק תוצאה"
                >
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-slate-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Reference */}
          <div className="w-full md:w-40 bg-black/20 border-t md:border-t-0 md:border-r border-white/10 p-4 overflow-y-auto custom-scrollbar shrink-0">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">לוח המרה</h3>
            <div className="grid grid-cols-4 md:grid-cols-1 gap-2">
              {[
                ['א','ת'], ['ב','ש'], ['ג','ר'], ['ד','ק'], ['ה','צ'], ['ו','פ'],
                ['ז','ע'], ['ח','ס'], ['ט','נ'], ['י','מ'], ['כ','ל']
              ].map(([a, b]) => (
                <div key={a} className="flex items-center justify-center gap-2 p-2 rounded bg-white/5 border border-white/5 text-xs">
                  <span className="font-bold text-slate-200">{a}</span>
                  <ArrowLeftRight size={10} className="text-slate-500" />
                  <span className="font-bold text-purple-400">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
