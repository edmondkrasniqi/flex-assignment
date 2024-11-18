export interface Category {
  id: number;
  name: string;
  notes: Note[];
}

export interface Note {
  id: number;
  title: string;
  content: string;
}
