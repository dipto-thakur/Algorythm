export type AdminRow = {
    id: string;
    name: string;
    email: string | null;
    college: string;
    department: string;
    semester: number;
    calling: string;
    whatsapp: string;
    query: string | null;
    createdAt: string;
    /** event slug -> that event's answers */
    entries: Record<string, Record<string, unknown>>;
  };