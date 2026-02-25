import React, { useState } from 'react';
import { X, Lock, Copy, Check, RefreshCw } from 'lucide-react';

interface CipherToolProps {
  onClose: () => void;
}

type CipherType = 'atbash' | 'albam' | 'atbah';

export const CipherTool: React.FC<CipherToolProps> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [cipherType, setCipherType] = useState<CipherType>('atbash');
  const [copied, setCopied] = useState(false);

  const calculateCipher = (text: string, type: CipherType) => {
    let map: Record<string, string> = {};
    const alephBet = 'אבגדהוזחטיכלמנסעפצקרשת';
    
    if (type === 'atbash') {
      // Aleph-Tav, Bet-Shin...
      for (let i = 0; i < 22; i++) {
        map[alephBet[i]] = alephBet[21 - i];
      }
      // Sofiot
      map['ך'] = 'ל'; map['ם'] = 'י'; map['ן'] = 'ט'; map['ף'] = 'ו'; map['ץ'] = 'ה';
    } 
    else if (type === 'albam') {
      // Aleph-Lamed (Offset 11)
      // 0-10 mapped to 11-21
      for (let i = 0; i < 11; i++) {
        map[alephBet[i]] = alephBet[i + 11];
        map[alephBet[i + 11]] = alephBet[i];
      }
      // Sofiot handling (mapping to regular counterpart's pair)
      map['ך'] = map['כ']; map['ם'] = map['מ']; map['ן'] = map['נ']; map['ף'] = map['פ']; map['ץ'] = map['צ'];
    }
    else if (type === 'atbah') {
      // Atbah: Sums to 10, 100, 500
      // Ones (Sum 10): 1-9, 2-8, 3-7, 4-6. 5 stays.
      map['א'] = 'ט'; map['ט'] = 'א';
      map['ב'] = 'ח'; map['ח'] = 'ב';
      map['ג'] = 'ז'; map['ז'] = 'ג';
      map['ד'] = 'ו'; map['ו'] = 'ד';
      map['ה'] = 'ה';

      // Tens (Sum 100): 10-90, 20-80, 30-70, 40-60. 50 stays.
      map['י'] = 'צ'; map['צ'] = 'י';
      map['כ'] = 'פ'; map['פ'] = 'כ'; map['ך'] = 'ף'; map['ף'] = 'ך'; // Sofiot approx
      map['ל'] = 'ע'; map['ע'] = 'ל';
      map['מ'] = 'ס'; map['ס'] = 'מ'; map['ם'] = 'ס';
      map['נ'] = 'נ'; map['ן'] = 'נ';

      // Hundreds (Sum 500): 100-400, 200-300.
      map['ק'] = 'ת'; map['ת'] = 'ק';
      map['ר'] = 'ש'; map['ש'] = 'ר';
      
      // Sofiot explicit if not covered
      map['ץ'] = 'י'; // Tzadi Sofit -> Yod
    }

    return text.split('').map(char => map[char] || char).join('');
  };

  const output = calculateCipher(input, cipherType);

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
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Lock className="text-indigo-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">מפענח צפנים</h2>
              <p className="text-xs text-slate-400">המרה לשיטות הצפנה מסורתיות</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
            
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4 text-sm text-slate-300 leading-relaxed">
              <p>
                כלי זה מאפשר להמיר טקסט באמצעות צפנים קבליים ומסורתיים.
                בחר את סוג הצופן הרצוי וראה את התוצאה בזמן אמת.
              </p>
            </div>

            <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
              {(['atbash', 'albam', 'atbah'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setCipherType(type)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    cipherType === type 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {type === 'atbash' ? 'אתב"ש' : type === 'albam' ? 'אלב"ם' : 'אטב"ח'}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-medium">הזן טקסט:</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="הקלד כאן..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-lg text-white focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-medium">תוצאה:</label>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 min-h-[80px] flex items-start justify-between gap-4">
                <p className="text-lg text-indigo-200 font-mono break-words w-full">{output || '...'}</p>
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
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              {cipherType === 'atbash' ? 'מפתח אתב"ש' : cipherType === 'albam' ? 'מפתח אלב"ם' : 'מפתח אטב"ח'}
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-1 gap-2">
              {/* Dynamic Legend based on selected cipher */}
              {(() => {
                const pairs = [];
                const alephBet = 'אבגדהוזחטיכלמנסעפצקרשת';
                if (cipherType === 'atbash') {
                  for (let i = 0; i < 11; i++) pairs.push([alephBet[i], alephBet[21-i]]);
                } else if (cipherType === 'albam') {
                  for (let i = 0; i < 11; i++) pairs.push([alephBet[i], alephBet[i+11]]);
                } else {
                  // Atbah partial legend
                  pairs.push(['א','ט'], ['ב','ח'], ['ג','ז'], ['ד','ו'], ['י','צ'], ['כ','פ'], ['ל','ע'], ['מ','ס'], ['ק','ת'], ['ר','ש']);
                }
                return pairs.map(([a, b]) => (
                  <div key={a} className="flex items-center justify-center gap-2 p-2 rounded bg-white/5 border border-white/5 text-xs">
                    <span className="font-bold text-slate-200">{a}</span>
                    <RefreshCw size={10} className="text-slate-500" />
                    <span className="font-bold text-indigo-400">{b}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
