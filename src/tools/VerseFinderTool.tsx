import React, { useState } from 'react';
import { X, Scroll, Search, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface VerseFinderToolProps {
  onClose: () => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const VerseFinderTool: React.FC<VerseFinderToolProps> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'name' | 'gematria'>('name');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const calculateGematria = (text: string) => {
    const gematriaMap: Record<string, number> = {
      'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
      'י': 10, 'כ': 20, 'ך': 20, 'ל': 30, 'מ': 40, 'ם': 40, 'נ': 50, 'ן': 50,
      'ס': 60, 'ע': 70, 'פ': 80, 'ף': 80, 'צ': 90, 'ץ': 90, 'ק': 100, 'ר': 200,
      'ש': 300, 'ת': 400
    };
    let sum = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (gematriaMap[char]) sum += gematriaMap[char];
    }
    return sum;
  };

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      let prompt = '';
      if (mode === 'name') {
        const cleanInput = input.trim().replace(/[^א-ת]/g, '');
        if (cleanInput.length < 2) {
          setError('נא להזין שם עם לפחות 2 אותיות');
          setLoading(false);
          return;
        }
        const first = cleanInput[0];
        const last = cleanInput[cleanInput.length - 1];
        prompt = `Find 5 verses from the Tanakh (Hebrew Bible) that start with the letter '${first}' and end with the letter '${last}'. 
        Return ONLY the Hebrew verses, one per line. Do not include translation or citation.
        Example format:
        פסוק א
        פסוק ב
        `;
      } else {
        const val = calculateGematria(input);
        prompt = `Find 5 verses from the Tanakh (Hebrew Bible) that have a Gematria value (numerical value) of exactly ${val}.
        If exact matches are hard to find, find verses with a value close to ${val} and mention the difference.
        Return the Hebrew verses and their citation.
        `;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = response.text || '';
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      setResults(lines);

    } catch (err) {
      console.error(err);
      setError('אירעה שגיאה בחיפוש הפסוקים. נסה שנית.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500/10 rounded-lg">
              <Scroll className="text-pink-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">מאתר פסוקים אישי</h2>
              <p className="text-xs text-slate-400">פסוקים לשם האדם או לערך גימטרי</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          
          <div className="bg-pink-500/5 border border-pink-500/10 rounded-xl p-4 text-sm text-slate-300 leading-relaxed">
            <p>
              כלי זה נעזר בבינה מלאכותית כדי למצוא פסוקים מהתנ"ך המתאימים ל<strong>שם האדם</strong> (מתחיל באות הראשונה ומסתיים באחרונה) או בעלי <strong>ערך גימטרי</strong> זהה.
            </p>
          </div>

          <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => setMode('name')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'name' 
                  ? 'bg-pink-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              לפי שם (אות ראשונה ואחרונה)
            </button>
            <button
              onClick={() => setMode('gematria')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'gematria' 
                  ? 'bg-pink-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              לפי ערך גימטרי
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'name' ? "הזן שם מלא או פרטי..." : "הזן מילה או מספר..."}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors"
              dir="rtl"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !input}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              חפש
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">תוצאות החיפוש:</h3>
              {results.map((verse, idx) => (
                <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group relative">
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles size={16} className="text-pink-400" />
                  </div>
                  <p className="text-lg font-serif text-slate-200 leading-relaxed pl-8">
                    {verse.replace(/[*#]/g, '')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
