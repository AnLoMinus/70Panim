export interface AnalysisSegment {
  title: string;
  level: number;
  content: string;
  tags?: string[];
}

export interface EssenceCardData {
  title: string;
  element: string;
  energy: string;
  score: number;
  sentences: string[];
  tags?: string[];
}

export interface HistoryItem {
  id: string;
  parentId: string | null;
  timestamp: number;
  query: string;
  selectedMethods: string[];
  analysis: AnalysisSegment[];
  cards: EssenceCardData[];
  contextSegments?: AnalysisSegment[]; // Segments used as context for this query
}

export interface SavedHistory {
  version: number;
  items: HistoryItem[];
}
