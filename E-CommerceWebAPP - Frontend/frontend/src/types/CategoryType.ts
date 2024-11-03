
interface Category {
    _id: string;
    name: string;
    level: number;
    parent: string | null;
    children: Category[] | null;
  }

export type { Category };