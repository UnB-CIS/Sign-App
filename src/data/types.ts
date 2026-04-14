export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface GrammarPoint {
  id: string;
  title: string;
  explanation: string;
  examples: string[];
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'video_record' | 'multiple_choice_video';
  prompt: string;
  options?: string[];
  correctAnswer?: string;
  videoUrl?: string;
  url_video?: string;
  url_videos?: string[];
  targetWord?: string;
  instruction?: string;
}

export interface Activity {
  id: string;
  type: 'vocabulary' | 'grammar' | 'practice' | 'quiz';
  title: string;
  description: string;
  questions: Question[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  vocabulary: VocabularyItem[];
  expressions: string[];
  grammar: GrammarPoint[];
  activities: Activity[];
  xpReward: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  objective: string;
  order: number;
  lessons: Lesson[];
  iconName: string;
}
