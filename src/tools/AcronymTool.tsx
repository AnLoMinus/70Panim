import React, { useState } from 'react';
import { X, Type, Copy, Check } from 'lucide-react';

interface AcronymToolProps {
  onClose: () => void;
}

export const AcronymTool: React.FC<AcronymToolProps> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const extractAcronyms = (text: string) => {
    return text
      .split(/[\s\n]+/)
      .map(word => {
        const cleanWord = word.replace(/[^א-ת]/g, '');
        return cleanWord ? cleanWord[0] : '';
      })
      .join('');
  };

  const output = extractAcronyms(input);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Type className="text-green-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">מחלץ ראשי תיבות</h2>
              <p className="text-xs text-slate-400">יצירת נוטריקון מטקסט</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar max-h-[80vh]">
          
          <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-4 text-sm text-slate-300 leading-relaxed">
            <p>
              כלי זה מחלץ את האות הראשונה מכל מילה בטקסט כדי ליצור <strong>ראשי תיבות</strong> (נוטריקון).
              שימושי למציאת רמזים נסתרים או ליצירת סימני זיכרון.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-medium">הזן טקסט:</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="למשל: בראשית ברא אלוהים..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-lg text-white focus:outline-none focus:border-green-500/50 transition-colors resize-none"
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-medium">ראשי תיבות:</label>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 min-h-[80px] flex items-start justify-between gap-4">
              <p className="text-2xl text-green-200 font-serif tracking-widest break-words w-full">{output || '...'}</p>
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
      </div>
    </div>
  );
};
