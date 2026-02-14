export interface Bookmark {
  id: string;
  user_id: string;
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  is_favorite?: boolean;
  favicon_url?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    name?: string;
  };
}

export interface Database {
  public: {
    Tables: {
      bookmarks: {
        Row: Bookmark;
        Insert: Omit<Bookmark, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Bookmark, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
