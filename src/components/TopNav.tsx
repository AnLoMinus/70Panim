import React, { useState, useRef } from 'react';
import { ChevronDown, Check, Layers, Layout } from 'lucide-react';
import { methodsData } from '../data';

interface TopNavProps {
  selectedMethods: string[];
  setSelectedMethods: React.Dispatch<React.SetStateAction<string[]>>;
  getColorClasses: (color: string) => any;
}

export const TopNav: React.FC<TopNavProps> = ({ selectedMethods, setSelectedMethods, getColorClasses }) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border-b border-white/10 p-4 animate-in slide-in-from-top-4 z-30 relative print:hidden">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4" ref={dropdownRef}>
        
        <div className="flex items-center gap-2 text-slate-400 shrink-0">
          <Layout size={18} />
          <span className="text-sm font-bold hidden md:inline">שיטות ניתוח:</span>
        </div>

        <div className="flex-1 flex flex-wrap items-center justify-end gap-3">
          {methodsData.map((level) => {
            const styles = getColorClasses(level.baseColor);
            const isOpen = openDropdown === level.level;
            const activeCount = level.methods.filter(m => selectedMethods.includes(m.id)).length;

            return (
              <div key={level.level} className="relative group">
                <button
                  onClick={() => setOpenDropdown(isOpen ? null : level.level)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                    isOpen || activeCount > 0
                      ? `${styles.bg} ${styles.border} ${styles.text} shadow-[0_0_15px_rgba(0,0,0,0.2)]`
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-xs font-bold">{level.title}</span>
                  {activeCount > 0 && (
                    <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${styles.accent} text-white`}>
                      {activeCount}
                    </span>
                  )}
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 p-2 animate-in fade-in zoom-in-95 origin-top-right">
                    <div className="space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
                      {level.methods.map((method) => {
                        const isSelected = selectedMethods.includes(method.id);
                        return (
                          <button
                            key={method.id}
                            onClick={() => {
                              setSelectedMethods(prev => 
                                isSelected ? prev.filter(id => id !== method.id) : [...prev, method.id]
                              );
                            }}
                            className={`w-full flex items-center justify-between p-3 rounded-lg text-xs transition-all ${
                              isSelected 
                                ? `${styles.bg} ${styles.text}` 
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <span className="text-right">{method.name}</span>
                            {isSelected && <Check size={14} className={styles.text} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
