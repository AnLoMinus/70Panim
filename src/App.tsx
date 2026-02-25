import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Zap, Loader2, ChevronDown, 
  Menu, X, Layers,
  Copy, Check, Hexagon, Download,
  Wind, Flame, Droplets, Mountain, Activity,
  Star, Archive, Printer, Lightbulb, BookOpen,
  ArrowLeftRight, Type as TypeIcon, BarChart2, Eraser,
  Lock, Scroll, History, Save, Upload, FileJson, GitBranch, Tag
} from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import ReactMarkdown from 'react-markdown';
import { methodsData } from './data';
import { CreditsModal } from './components/CreditsModal';
import { HistoryItem, AnalysisSegment, EssenceCardData } from './types';

import { GematriaTool } from './tools/GematriaTool';
import { AtbashTool } from './tools/AtbashTool';
import { AcronymTool } from './tools/AcronymTool';
import { TextStatsTool } from './tools/TextStatsTool';
import { TextCleanerTool } from './tools/TextCleanerTool';
import { CipherTool } from './tools/CipherTool';
import { VerseFinderTool } from './tools/VerseFinderTool';

// Import guides
import examplesGuide from './guides/examples.md?raw';
import structureGuide from './guides/structure.md?raw';
import chronologicalGuide from './guides/chronological.md?raw';
import ordersGuide from './guides/orders.md?raw';
import additionalOrdersGuide from './guides/additional_orders.md?raw';
import recommendedUsesGuide from './guides/recommended_uses.md?raw';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- CONSTANTS & DATA ---
const VERSION = "79 השיטות";

const guides = [
  { id: 'examples', title: 'דוגמאות לשימוש', content: examplesGuide },
  { id: 'structure', title: 'מבנה המאגר', content: structureGuide },
  { id: 'chronological', title: 'סדר כרונולוגי', content: chronologicalGuide },
  { id: 'orders', title: 'מסדרים שונים', content: ordersGuide },
  { id: 'additional_orders', title: 'סדרים טבעיים', content: additionalOrdersGuide },
  { id: 'uses', title: 'שימושים מומלצים', content: recommendedUsesGuide },
];

const getColorClasses = (colorName: string) => {
  const map: Record<string, any> = {
    blue: { 
      text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', 
      glow: 'shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1),0_10px_40px_-10px_rgba(59,130,246,0.5)]', gradient: 'from-blue-600 to-blue-400',
      accent: 'bg-blue-500' 
    },
    green: { 
      text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', 
      glow: 'shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1),0_10px_40px_-10px_rgba(16,185,129,0.5)]', gradient: 'from-emerald-600 to-emerald-400',
      accent: 'bg-emerald-500'
    },
    purple: { 
      text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', 
      glow: 'shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1),0_10px_40px_-10px_rgba(168,85,247,0.5)]', gradient: 'from-purple-600 to-purple-400',
      accent: 'bg-purple-500'
    },
    cyan: { 
      text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', 
      glow: 'shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1),0_10px_40px_-10px_rgba(6,182,212,0.5)]', gradient: 'from-cyan-600 to-cyan-400',
      accent: 'bg-cyan-500'
    },
    gold: { 
      text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', 
      glow: 'shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1),0_10px_40px_-10px_rgba(245,158,11,0.5)]', gradient: 'from-amber-600 to-amber-400',
      accent: 'bg-amber-500'
    }
  };
  return map[colorName] || map.blue;
};

// --- UI COMPONENTS ---

const SpotlightWrapper: React.FC<{ children: React.ReactNode, className?: string, spotlightColor?: string }> = ({ children, className = '', spotlightColor = 'rgba(255,255,255,0.1)' }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={() => { setIsFocused(true); setOpacity(1); }}
      onBlur={() => { setIsFocused(false); setOpacity(0); }}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};

const Particles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 10 + 10}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.5 + 0.1,
          }}
        />
      ))}
    </div>
  );
};

const TypewriterSuggestions = () => {
  const suggestions = [
    "טקסט פילוסופי עמוק...",
    "חלום שחלמת בלילה...",
    "רעיון למיזם חדש...",
    "קונפליקט אישי שדורש פתרון...",
    "פסוק או ציטוט מעורר השראה..."
  ];
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % suggestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 overflow-hidden relative mt-6 w-full max-w-md mx-auto">
      {suggestions.map((text, i) => (
        <div 
          key={i} 
          className={`absolute w-full text-center transition-all duration-700 ${i === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <span className="text-purple-300/60 font-light text-lg tracking-wide flex items-center justify-center gap-2">
            <Lightbulb size={16} className="text-amber-400/60" /> נסה לנתח: {text}
          </span>
        </div>
      ))}
    </div>
  );
};

// --- RENDERERS ---

const TextCompiler: React.FC<{ content: string, styles: any }> = ({ content, styles }) => {
  if (!content) return null;
  return (
    <div className="markdown-body space-y-4 text-slate-300/90 font-light print:text-black leading-relaxed">
      <ReactMarkdown
        components={{
          h3: ({node, ...props}) => <h3 className={`text-xl font-black mt-10 mb-5 border-b-2 ${styles.border} pb-2 tracking-tight ${styles.text} print:text-black print:border-black`} {...props} />,
          h4: ({node, ...props}) => <h4 className={`text-lg font-bold mt-8 mb-3 flex items-center gap-2 ${styles.text} print:text-black`}><div className={`w-1.5 h-1.5 rounded-full ${styles.accent}`}></div>{props.children}</h4>,
          ul: ({node, ...props}) => <ul className="space-y-3" {...props} />,
          li: ({node, ...props}) => <li className="mr-4 list-none flex items-start gap-2 mb-3 text-slate-300 print:text-black"><span className={`${styles.text} mt-1`}>✦</span><span>{props.children}</span></li>,
          strong: ({node, ...props}) => <strong className={`${styles.text} font-bold bg-white/5 px-1 rounded`} {...props} />,
          p: ({node, ...props}) => <p className="mb-5 leading-relaxed text-slate-300/90 font-light print:text-black" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

// --- ENHANCED CARD COMPONENT ---

const EssenceCard: React.FC<{ card: any }> = ({ card }) => {
  const isFire = card.element.includes('אש');
  const isWater = card.element.includes('מים');
  const isAir = card.element.includes('רוח') || card.element.includes('אוויר');
  const isEarth = card.element.includes('אדמה');

  const theme = isFire ? { border: 'border-orange-500/40', shadow: 'shadow-orange-500/20', text: 'text-orange-600', grad: 'from-orange-50 to-white', icon: <Flame className="text-orange-500" /> } :
                isWater ? { border: 'border-blue-500/40', shadow: 'shadow-blue-500/20', text: 'text-blue-600', grad: 'from-blue-50 to-white', icon: <Droplets className="text-blue-500" /> } :
                isAir ? { border: 'border-cyan-500/40', shadow: 'shadow-cyan-500/20', text: 'text-cyan-600', grad: 'from-cyan-50 to-white', icon: <Wind className="text-cyan-500" /> } :
                isEarth ? { border: 'border-amber-700/40', shadow: 'shadow-amber-700/20', text: 'text-amber-800', grad: 'from-amber-50 to-white', icon: <Mountain className="text-amber-700" /> } :
                { border: 'border-purple-500/40', shadow: 'shadow-purple-500/20', text: 'text-purple-600', grad: 'from-purple-50 to-white', icon: <Sparkles className="text-purple-500" /> };

  return (
    <SpotlightWrapper className={`capture-card
      relative h-full bg-gradient-to-br ${theme.grad} rounded-2xl border border-white/40 
      p-5 flex flex-col justify-between overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.8)]
      hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,1)]
      hover:-translate-y-1 transition-all duration-500 group print:shadow-none print:border-black
    `}>
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity pointer-events-none">
        <Hexagon size={120} strokeWidth={1} />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className={`text-xl font-black ${theme.text} leading-tight mb-0.5`}>{card.title}</h3>
            {card.tags && (
              <div className="flex flex-wrap gap-1 mb-1">
                {card.tags.map((tag: string, i: number) => (
                  <span key={i} className="text-[8px] px-1.5 py-0.5 bg-black/5 rounded-full text-slate-500 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 px-1.5 py-0.5 bg-slate-100 rounded">{card.energy}</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-1 h-1 rounded-full ${i < card.score ? theme.text.replace('text', 'bg') : 'bg-slate-200'}`}></div>
                ))}
              </div>
            </div>
          </div>
          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
            {theme.icon}
          </div>
        </div>

        <div className="space-y-3">
          {card.sentences.map((s: string, idx: number) => (
            <div key={idx} className="relative pr-3 border-r-2 border-slate-200">
              <span className="text-[8px] font-bold text-slate-400 uppercase block mb-0.5 tracking-tighter">
                {["הוראה", "מיקוד", "יישום", "זכירה"][idx] || "מידע"}
              </span>
              <p className="text-[13px] text-slate-800 font-serif leading-snug">{s}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center border-t border-slate-200/50 pt-3 relative z-10">
        <span className="text-[9px] font-mono text-slate-400">#70P-{card.element}</span>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div>
          <span className="text-[8px] font-black text-slate-500">70 PANIM GOLD</span>
        </div>
      </div>
    </SpotlightWrapper>
  );
};

// --- ENHANCED RESULT CARD ---

const ResultCard: React.FC<{ 
  segment: any; 
  isSelected?: boolean; 
  onSelect?: () => void;
  isSelectable?: boolean;
}> = ({ segment, isSelected, onSelect, isSelectable }) => {
  const [copied, setCopied] = useState(false);
  let colorKey = segment.level === 1 ? 'blue' : segment.level === 2 ? 'green' : segment.level === 3 ? 'purple' : segment.level === 4 ? 'cyan' : 'gold';
  const styles = getColorClasses(colorKey);

  return (
    <SpotlightWrapper spotlightColor={colorKey === 'gold' ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.08)'} className={`capture-segment
      relative group overflow-hidden rounded-2xl border-t border-l border-white/10 border-b border-r border-black/20 ${styles.bg} ${styles.glow}
      backdrop-blur-xl transition-all duration-700 mb-10 print:border-none print:bg-white print:shadow-none
      animate-in fade-in slide-in-from-bottom-4
      ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-black' : ''}
    `}>
      {/* Dynamic Animated Border Glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none`}>
        <div className={`absolute -inset-[2px] rounded-2xl border-2 ${styles.border} animate-pulse`}></div>
      </div>

      <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/10 relative z-10">
        <div className="flex items-center gap-5">
          {isSelectable && (
            <button
              onClick={onSelect}
              className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-purple-500 border-purple-500 text-white' : 'border-white/20 hover:border-white/40'}`}
            >
              {isSelected && <Check size={14} />}
            </button>
          )}
          <div className={`w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center border ${styles.border} ${styles.text}`}>
            {segment.level === 99 ? <Star className="animate-spin-slow" /> : <Hexagon strokeWidth={1.5} />}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className={`text-2xl font-black tracking-tight ${styles.text} print:text-black`}>{segment.title}</h3>
              {segment.tags && segment.tags.map((tag: string, i: number) => (
                <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[10px] text-slate-400 flex items-center gap-1">
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-slate-500">
                {segment.level === 99 ? 'INTEGRATION ARCHITECTURE' : `PHASE 0${segment.level}`}
              </span>
              <div className={`h-1 w-12 rounded-full ${styles.accent} opacity-30`}></div>
            </div>
          </div>
        </div>
        <button 
          onClick={() => { navigator.clipboard.writeText(segment.content); setCopied(true); setTimeout(()=>setCopied(false), 2000); }}
          className="copy-btn p-3 rounded-xl hover:bg-white/10 text-slate-400 transition-all border border-transparent hover:border-white/10"
        >
          {copied ? <Check className="text-green-400" /> : <Copy size={20} />}
        </button>
      </div>

      <div className="p-8 md:p-10 relative z-10">
        <TextCompiler content={segment.content} styles={styles} />
      </div>

      {/* Modern Background Texture */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </SpotlightWrapper>
  );
};

// --- APP COMPONENT ---

export default function App() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any[] | null>(null);
  const [cardsData, setCardsData] = useState<any[] | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hoveredMethod, setHoveredMethod] = useState<string | null>(null);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [expandedLevels, setExpandedLevels] = useState<Record<number, boolean>>({1: true, 2: false, 3: false, 4: false});
  const [isZipping, setIsZipping] = useState(false);
  const [activeGuide, setActiveGuide] = useState<string | null>(null);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [isGuidesMenuOpen, setIsGuidesMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  
  // History & Branching State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [selectedSegments, setSelectedSegments] = useState<AnalysisSegment[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('70panim_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('70panim_history', JSON.stringify(history));
  }, [history]);

  const handleExportHistory = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `70panim_history_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportHistory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          setHistory(prev => [...prev, ...parsed]); // Merge or replace? Let's merge for now
          alert('היסטוריה נטענה בהצלחה');
        }
      } catch (err) {
        alert('שגיאה בטעינת הקובץ');
      }
    };
    reader.readAsText(file);
  };

  const handleSelectSegment = (segment: AnalysisSegment) => {
    setSelectedSegments(prev => {
      const exists = prev.some(s => s.title === segment.title && s.content === segment.content);
      if (exists) return prev.filter(s => s.title !== segment.title || s.content !== segment.content);
      return [...prev, segment];
    });
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    
    try {
      const zip = new JSZip();

      // Capture segments
      const segments = document.querySelectorAll('.capture-segment');
      for (let i = 0; i < segments.length; i++) {
        const el = segments[i] as HTMLElement;
        const dataUrl = await toPng(el, { 
          cacheBust: true, 
          backgroundColor: '#020208',
          pixelRatio: 2,
          width: el.offsetWidth,
          height: el.offsetHeight,
          style: { transform: 'scale(1)', transformOrigin: 'top left', margin: '0' },
          filter: (node) => {
            if (node instanceof HTMLElement) {
              return !node.classList.contains('copy-btn');
            }
            return true;
          }
        });
        const imgData = dataUrl.split(',')[1];
        zip.file(`Segment_${i + 1}.png`, imgData, { base64: true });
      }

      // Capture cards
      const cards = document.querySelectorAll('.capture-card');
      for (let i = 0; i < cards.length; i++) {
        const el = cards[i] as HTMLElement;
        const dataUrl = await toPng(el, { 
          cacheBust: true, 
          backgroundColor: '#ffffff',
          pixelRatio: 2,
          width: el.offsetWidth,
          height: el.offsetHeight,
          style: { transform: 'scale(1)', transformOrigin: 'top left', margin: '0' }
        });
        const imgData = dataUrl.split(',')[1];
        zip.file(`EssenceCard_${i + 1}.png`, imgData, { base64: true });
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `70Panim_Assets_${new Date().getTime()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating ZIP archive:', error);
    } finally {
      setIsZipping(false);
    }
  };

  const handleAnalyze = async () => {
    if (!inputText || selectedMethods.length === 0) return;
    setLoading(true);
    
    // Don't clear immediately, we want to show loading state while keeping old data if needed
    // setAnalysisData(null); 
    // setCardsData(null);
    
    const activeMethods: any[] = [];
    methodsData.forEach(l => l.methods.forEach(m => selectedMethods.includes(m.id) && activeMethods.push({ ...m, level: l.level, details: m.description || m.name })));

    let promptContext = "";
    if (selectedSegments.length > 0) {
      promptContext = `
      CONTEXT FROM PREVIOUS ANALYSIS:
      The user is continuing a conversation based on the following segments:
      ${selectedSegments.map(s => `[Title: ${s.title}]\n${s.content}`).join('\n---\n')}
      
      Please answer the new query: "${inputText}" taking into account the context above.
      `;
    }

    const systemInstruction = `Analyze the user input using the following selected methods:\n${activeMethods.map(m => `- ${m.name}: ${m.details}`).join('\n')}\n
    ${promptContext ? promptContext : ""}
    
    Return JSON with "analysis" (array of {title, level, content, tags: string[]}) and "cards" (exactly 9 {title, element, energy, score, sentences:[4], tags: string[]}) keys. 
    Use Nikud in cards sentences. Format content with markdown.
    "tags" should be a short list of keywords (1-3) related to the specific content of the segment/card.
    `;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: inputText,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              analysis: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    level: { type: Type.NUMBER },
                    content: { type: Type.STRING },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["title", "level", "content"]
                }
              },
              cards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    element: { type: Type.STRING },
                    energy: { type: Type.STRING },
                    score: { type: Type.NUMBER },
                    sentences: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["title", "element", "energy", "score", "sentences"]
                }
              }
            },
            required: ["analysis", "cards"]
          }
        }
      });
      
      const parsed = JSON.parse(response.text || "{}");
      const newAnalysis = parsed.analysis || [];
      const newCards = parsed.cards || [];

      setAnalysisData(newAnalysis);
      setCardsData(newCards);

      // Save to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        parentId: currentHistoryId, // If we are viewing a history item, this is the parent
        timestamp: Date.now(),
        query: inputText,
        selectedMethods,
        analysis: newAnalysis,
        cards: newCards,
        contextSegments: selectedSegments
      };

      setHistory(prev => [newItem, ...prev]);
      setCurrentHistoryId(newItem.id);
      setSelectedSegments([]); // Clear selection after use

    } catch (e) {
      console.error(e);
      setAnalysisData([{ title: "שגיאה", level: 1, content: "אירעה שגיאה בעיבוד הנתונים." }]);
    }
    setLoading(false);
  };

  // Load history item
  const loadHistoryItem = (id: string) => {
    const item = history.find(h => h.id === id);
    if (item) {
      setAnalysisData(item.analysis);
      setCardsData(item.cards);
      setInputText(item.query);
      setSelectedMethods(item.selectedMethods);
      setCurrentHistoryId(item.id);
      setIsHistoryOpen(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#020208] text-slate-200 font-sans flex flex-col dir-rtl relative" dir="rtl">
      {/* Global Noise Texture */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      
      {/* History Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-slate-900/95 backdrop-blur-2xl border-l border-white/10 z-[80] transform transition-transform duration-300 ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <History size={18} className="text-amber-400" />
            היסטוריה
          </h2>
          <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4 flex gap-2 border-b border-white/10">
          <button onClick={handleExportHistory} className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-slate-300 transition-colors" title="ייצוא לקובץ">
            <Save size={14} /> ייצוא
          </button>
          <label className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-slate-300 transition-colors cursor-pointer" title="ייבוא מקובץ">
            <Upload size={14} /> ייבוא
            <input type="file" onChange={handleImportHistory} accept=".json" className="hidden" />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center text-slate-500 py-10 text-sm">
              אין היסטוריה שמורה
            </div>
          ) : (
            history.map(item => (
              <div 
                key={item.id} 
                onClick={() => loadHistoryItem(item.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${currentHistoryId === item.id ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500">{new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString().slice(0,5)}</span>
                  {item.parentId && <GitBranch size={12} className="text-purple-400" />}
                </div>
                <p className="text-sm text-slate-200 line-clamp-2 font-medium">{item.query}</p>
                <div className="mt-2 flex gap-1 flex-wrap">
                  {item.selectedMethods.slice(0, 3).map(m => (
                    <span key={m} className="px-1.5 py-0.5 bg-black/30 rounded text-[9px] text-slate-400">{methodsData.flatMap(l=>l.methods).find(x=>x.id===m)?.name}</span>
                  ))}
                  {item.selectedMethods.length > 3 && <span className="px-1.5 py-0.5 bg-black/30 rounded text-[9px] text-slate-400">+{item.selectedMethods.length - 3}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Continue Bar */}
      {selectedSegments.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 z-40 flex items-center justify-between animate-in slide-in-from-bottom-full">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2 space-x-reverse">
              {selectedSegments.map((s, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-[10px] font-bold text-purple-300">
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="text-sm text-slate-300">
              <span className="font-bold text-white">{selectedSegments.length}</span> מקטעים נבחרו להמשך שיחה
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedSegments([])}
              className="px-4 py-2 rounded-lg hover:bg-white/10 text-slate-400 text-sm transition-colors"
            >
              ביטול
            </button>
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Focus input?
                const input = document.querySelector('textarea') as HTMLTextAreaElement;
                if (input) input.focus();
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-purple-500/20 transition-all"
            >
              המשך שיחה עם המקטעים שנבחרו
            </button>
          </div>
        </div>
      )}

      {/* Glass Header */}
      <header className="sticky top-0 z-50 h-20 border-b border-white/5 bg-black/40 backdrop-blur-2xl flex items-center justify-between px-6 print:hidden">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all">
            {isSidebarOpen ? <X /> : <Menu className="text-purple-400" />}
          </button>
          <button onClick={() => setIsCreditsOpen(true)} className="flex flex-col text-right hover:opacity-80 transition-opacity">
            <h1 className="text-xl font-black bg-gradient-to-r from-purple-400 via-amber-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
              שבעים פנים <span className="text-[10px] text-slate-500 font-mono tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">{VERSION}</span>
            </h1>
            <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">ארגז הכלים לניתוח טקסטים בגישה יהודית</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          {/* History Toggle */}
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all text-xs"
          >
            <History size={14} className="text-amber-400" />
            היסטוריה
          </button>

          {/* Tools Menu */}
          <div className="relative">
            <button
              onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all text-xs"
            >
              <Zap size={14} className="text-cyan-400" />
              כלים
              <ChevronDown size={14} className={`transition-transform duration-300 ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isToolsMenuOpen && (
              <>
                <div className="fixed inset-0 z-[65]" onClick={() => setIsToolsMenuOpen(false)}></div>
                <div className="absolute top-full left-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[70] flex flex-col p-1 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                  <button
                    onClick={() => {
                      setActiveTool('cipher');
                      setIsToolsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white text-xs text-right w-full transition-colors"
                  >
                    <div className="p-1 bg-white/5 rounded-md">
                      <Lock size={12} className="text-indigo-400" />
                    </div>
                    מפענח צפנים
                  </button>

                  <button
                    onClick={() => {
                      setActiveTool('verse');
                      setIsToolsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white text-xs text-right w-full transition-colors"
                  >
                    <div className="p-1 bg-white/5 rounded-md">
                      <Scroll size={12} className="text-pink-400" />
                    </div>
                    מאתר פסוקים אישי
                  </button>

                  <button
                    onClick={() => {
                      setActiveTool('gematria');
                      setIsToolsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white text-xs text-right w-full transition-colors"
                  >
                    <div className="p-1 bg-white/5 rounded-md">
                      <Hexagon size={12} className="text-cyan-400" />
                    </div>
                    מחשבון גימטריה
                  </button>

                  <button
                    onClick={() => {
                      setActiveTool('atbash');
                      setIsToolsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white text-xs text-right w-full transition-colors"
                  >
                    <div className="p-1 bg-white/5 rounded-md">
                      <ArrowLeftRight size={12} className="text-purple-400" />
                    </div>
                    צופן אתב"ש
                  </button>

                  <button
                    onClick={() => {
                      setActiveTool('acronym');
                      setIsToolsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white text-xs text-right w-full transition-colors"
                  >
                    <div className="p-1 bg-white/5 rounded-md">
                      <TypeIcon size={12} className="text-green-400" />
                    </div>
                    מחלץ ראשי תיבות
                  </button>

                  <button
                    onClick={() => {
                      setActiveTool('stats');
                      setIsToolsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white text-xs text-right w-full transition-colors"
                  >
                    <div className="p-1 bg-white/5 rounded-md">
                      <Activity size={12} className="text-amber-400" />
                    </div>
                    ניתוח סטטיסטי
                  </button>

                  <button
                    onClick={() => {
                      setActiveTool('cleaner');
                      setIsToolsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white text-xs text-right w-full transition-colors"
                  >
                    <div className="p-1 bg-white/5 rounded-md">
                      <Wind size={12} className="text-blue-400" />
                    </div>
                    ניקוי ניקוד
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Guides Menu */}
          <div className="relative">
            <button
              onClick={() => setIsGuidesMenuOpen(!isGuidesMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all text-xs"
            >
              <BookOpen size={14} className="text-purple-400" />
              מדריכים
              <ChevronDown size={14} className={`transition-transform duration-300 ${isGuidesMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isGuidesMenuOpen && (
              <>
                <div className="fixed inset-0 z-[65]" onClick={() => setIsGuidesMenuOpen(false)}></div>
                <div className="absolute top-full left-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[70] flex flex-col p-1 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                  {guides.map(guide => (
                    <button
                      key={guide.id}
                      onClick={() => {
                        setActiveGuide(guide.id);
                        setIsGuidesMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white text-xs text-right w-full transition-colors"
                    >
                      <div className="p-1 bg-white/5 rounded-md">
                        <BookOpen size={12} className="text-purple-400" />
                      </div>
                      {guide.title}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          {analysisData && (
            <>
              <button 
                onClick={handleDownloadZip} 
                disabled={isZipping}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-xs shadow-lg shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {isZipping ? <Loader2 size={14} className="animate-spin" /> : <Archive size={14} />}
                {isZipping ? 'מייצר ארכיון...' : 'הורד תמונות (ZIP)'}
              </button>
              <button 
                onClick={() => window.print()} 
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white font-bold text-xs hover:bg-white/20 active:scale-95 transition-all"
              >
                <Printer size={14} /> הדפס דוח
              </button>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden print:block">
        
        {/* Credits Modal */}
        {isCreditsOpen && <CreditsModal onClose={() => setIsCreditsOpen(false)} />}

        {/* Tools Modals */}
        {activeTool === 'gematria' && <GematriaTool onClose={() => setActiveTool(null)} />}
        {activeTool === 'atbash' && <AtbashTool onClose={() => setActiveTool(null)} />}
        {activeTool === 'acronym' && <AcronymTool onClose={() => setActiveTool(null)} />}
        {activeTool === 'stats' && <TextStatsTool onClose={() => setActiveTool(null)} />}
        {activeTool === 'cleaner' && <TextCleanerTool onClose={() => setActiveTool(null)} />}
        {activeTool === 'cipher' && <CipherTool onClose={() => setActiveTool(null)} />}
        {activeTool === 'verse' && <VerseFinderTool onClose={() => setActiveTool(null)} />}

        {/* Guides Modal */}
        {activeGuide && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-full overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="text-purple-400" />
                  {guides.find(g => g.id === activeGuide)?.title}
                </h2>
                <button 
                  onClick={() => setActiveGuide(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="text-slate-400 hover:text-white" />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <div className="markdown-body prose prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-3xl font-black mt-8 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-4 border-b border-white/10 pb-2 text-white" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-6 mb-3 text-slate-200" {...props} />,
                      h4: ({node, ...props}) => <h4 className="text-lg font-bold mt-4 mb-2 text-slate-300" {...props} />,
                      p: ({node, ...props}) => <p className="mb-4 text-slate-300 leading-relaxed" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2 text-slate-300" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2 text-slate-300" {...props} />,
                      li: ({node, ...props}) => <li className="ml-4" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-white bg-white/5 px-1 rounded" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-r-4 border-purple-500 pr-4 py-1 my-4 bg-purple-500/5 rounded-l-lg italic text-slate-300" {...props} />,
                    }}
                  >
                    {guides.find(g => g.id === activeGuide)?.content || ''}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar - Methods */}
        <aside className={`fixed inset-y-0 right-0 z-40 w-80 bg-slate-950 border-l border-white/5 transform transition-transform duration-500 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0 ${isSidebarOpen ? 'md:w-80' : 'md:w-0 md:opacity-0 md:p-0'} overflow-hidden`}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-8">
              <Layers className="text-purple-500" />
              <h2 className="font-bold text-lg">ארכיטקטורת ניתוח</h2>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
              {methodsData.map(l => {
                const styles = getColorClasses(l.baseColor);
                return (
                <div key={l.level} className="space-y-2 mb-4">
                  <SpotlightWrapper 
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-t border-l border-white/10 border-b border-r border-black/20 ${styles.bg} ${styles.glow} shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-xl transition-all duration-700 group relative overflow-hidden cursor-pointer`}
                  >
                    <div onClick={() => setExpandedLevels(prev => ({...prev, [l.level]: !prev[l.level]}))} className="absolute inset-0 z-20"></div>
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-0`}>
                      <div className={`absolute -inset-[2px] rounded-xl border-2 ${styles.border} animate-pulse`}></div>
                    </div>
                    <span className={`text-sm font-bold relative z-10 ${styles.text}`}>{l.title}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform relative z-10 ${styles.text} ${expandedLevels[l.level] ? 'rotate-180' : ''}`} />
                  </SpotlightWrapper>
                  {expandedLevels[l.level] && (
                    <div className="grid grid-cols-1 gap-2 p-1">
                      {l.methods.map(m => {
                        const isSelected = selectedMethods.includes(m.id);
                        return (
                        <div 
                          key={m.id} 
                          onMouseEnter={() => setHoveredMethod(m.id)}
                          onMouseLeave={() => setHoveredMethod(null)}
                          onClick={() => setSelectedMethods(prev => isSelected ? prev.filter(x=>x!==m.id) : [...prev, m.id])} 
                          className={`p-3 rounded-lg text-xs cursor-pointer border transition-all duration-500 flex items-center gap-3 relative overflow-hidden group ${isSelected ? `${styles.bg} ${styles.border} ${styles.text} ${styles.glow} backdrop-blur-md` : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20 hover:bg-white/10'}`}
                        >
                          {isSelected && (
                            <div className={`absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none`}>
                              <div className={`absolute -inset-[1px] rounded-lg border ${styles.border} animate-pulse`}></div>
                            </div>
                          )}
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all relative z-10 ${isSelected ? `${styles.accent} border-transparent` : 'border-slate-600 group-hover:border-slate-400'}`}>
                            {isSelected && <Check size={10} className="text-white" />}
                          </div>
                          <span className="relative z-10">{m.name}</span>
                        </div>
                      )})}
                    </div>
                  )}
                </div>
              )})}
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar bg-[radial-gradient(circle_at_top_right,_#101025_0%,_#020208_100%)] print:bg-white relative">
          
          {/* Tooltip Overlay */}
          {hoveredMethod && methodsData.flatMap(l => l.methods).find(m => m.id === hoveredMethod)?.description && (
            <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-8">
              <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl max-w-2xl w-full animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-4">
                  {methodsData.flatMap(l => l.methods).find(m => m.id === hoveredMethod)?.name}
                </h3>
                <div className="text-slate-300 text-lg leading-relaxed space-y-2 markdown-body">
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                    }}
                  >
                    {methodsData.flatMap(l => l.methods).find(m => m.id === hoveredMethod)?.description || ''}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-5xl mx-auto space-y-12">
            
            {/* Elegant Input Area */}
            <section className="relative group print:hidden z-10">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-slate-900/60 backdrop-blur-xl border-t border-l border-white/10 border-b border-r border-black/20 rounded-3xl p-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden">
                <Particles />
                <textarea 
                  value={inputText} onChange={(e) => setInputText(e.target.value)}
                  placeholder="הזן את הטקסט או הנושא לניתוח עומק..."
                  className="w-full h-48 bg-transparent p-6 text-xl font-light text-slate-100 focus:outline-none placeholder:text-slate-600 resize-none relative z-10"
                />
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border-t border-white/5 relative z-10">
                  <div className="flex items-center gap-3 text-slate-500 px-4">
                    <Activity size={16} />
                    <span className="text-[10px] font-mono uppercase tracking-widest">{selectedMethods.length} Methods active</span>
                  </div>
                  <button 
                    onClick={handleAnalyze} disabled={loading || !inputText || selectedMethods.length === 0}
                    className="px-10 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 rounded-xl text-white font-black tracking-tighter hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] disabled:opacity-30 transition-all active:scale-95 flex items-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Zap size={18} className="fill-white" />}
                    נתח עכשיו
                  </button>
                </div>
              </div>
            </section>

            {/* Analysis Feed */}
            <div className="space-y-10 relative z-10">
              {loading ? (
                <div className="py-32 flex flex-col items-center gap-8">
                  <div className="relative flex items-center justify-center w-32 h-32">
                    <div className="absolute inset-0 border-2 border-purple-500/20 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    <div className="absolute inset-4 border-2 border-cyan-500/30 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]"></div>
                    <Hexagon className="text-purple-400 animate-pulse relative z-10" size={48} strokeWidth={1.5} />
                    <div className="absolute inset-0 flex items-center justify-center animate-spin-slow opacity-50">
                      <Hexagon className="text-cyan-400" size={64} strokeWidth={0.5} />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-mono tracking-[0.3em] uppercase animate-pulse font-bold">Processing 70 Faces</p>
                    <p className="text-slate-500 text-xs font-mono tracking-widest">SYNTHESIZING DATA STREAMS...</p>
                  </div>
                </div>
              ) : analysisData ? (
                <>
                  <div className="hidden print:block text-center border-b-2 border-black pb-8 mb-12">
                    <h1 className="text-4xl font-black text-black">שבעים פנים - דוח ניתוח</h1>
                    <p className="text-gray-500 mt-2">v{VERSION} • ארגז הכלים לניתוח טקסטים בגישה יהודית</p>
                  </div>

                  {analysisData.map((seg, i) => (
                    <ResultCard 
                      key={i} 
                      segment={seg} 
                      isSelectable={true}
                      isSelected={selectedSegments.some(s => s.title === seg.title && s.content === seg.content)}
                      onSelect={() => handleSelectSegment(seg)}
                    />
                  ))}

                  {/* Essence Cards Grid */}
                  {cardsData && (
                    <div className="mt-20 space-y-10 print:break-before-page">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                        <h2 className="text-3xl font-black text-center bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">רשת המהויות: הלכה למעשה</h2>
                        <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                        {cardsData.map((c, i) => <div key={i} className="aspect-[3/4]"><EssenceCard card={c} /></div>)}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-32 flex flex-col items-center text-slate-700 select-none relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent blur-3xl -z-10 rounded-full"></div>
                  <Hexagon size={100} strokeWidth={0.5} className="mb-8 text-slate-600/50" />
                  <h3 className="text-2xl font-light text-slate-400 mb-2">ממתין לפקודת ניתוח</h3>
                  <p className="text-slate-500 font-light max-w-md text-center">הזן טקסט למעלה ובחר את שיטות הניתוח הרצויות מתפריט הצד כדי להתחיל.</p>
                  <TypewriterSuggestions />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .animate-float { animation: float 15s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
        @media print {
          @page { size: A4; margin: 1cm; }
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
