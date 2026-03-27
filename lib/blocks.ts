// ============================================================
// Block Types – Classics Coaching Block-Based Builder
// ============================================================

export type BlockType =
  | 'heading'
  | 'text'
  | 'exercise'
  | 'table'
  | 'callout'
  | 'divider';

export interface HeadingBlock {
  type: 'heading';
  id: string;
  level: 1 | 2 | 3;
  content: string;
}

export interface TextBlock {
  type: 'text';
  id: string;
  content: string;
}

export interface ExerciseBlock {
  type: 'exercise';
  id: string;
  name: string;
  gifUrl: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  restTime: string;
  description: string;
  imageAlign: 'left' | 'right';
}

export interface TableBlock {
  type: 'table';
  id: string;
  headers: string[];
  rows: string[][];
}

export interface CalloutBlock {
  type: 'callout';
  id: string;
  emoji: string;
  title: string;
  content: string;
  color: 'pink' | 'cyan' | 'purple' | 'yellow';
}

export interface DividerBlock {
  type: 'divider';
  id: string;
}

export type Block =
  | HeadingBlock
  | TextBlock
  | ExerciseBlock
  | TableBlock
  | CalloutBlock
  | DividerBlock;

// Helper to create a new blank block of a given type
export function createBlock(type: BlockType): Block {
  const id = crypto.randomUUID();
  switch (type) {
    case 'heading':
      return { type, id, level: 2, content: '' };
    case 'text':
      return { type, id, content: '' };
    case 'exercise':
      return {
        type, id,
        name: '', gifUrl: '', muscleGroup: '',
        sets: 3, reps: '10', restTime: '60s',
        description: '', imageAlign: 'left',
      };
    case 'table':
      return { type, id, headers: ['Colonne 1', 'Colonne 2'], rows: [['', '']] };
    case 'callout':
      return { type, id, emoji: '💡', title: 'Conseil', content: '', color: 'cyan' };
    case 'divider':
      return { type, id };
  }
}
