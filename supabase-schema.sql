-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create categories table for hierarchical structure
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('once', 'humans')),
  parent_id UUID REFERENCES categories(id),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pages table
CREATE TABLE pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  type TEXT NOT NULL CHECK (type IN ('once', 'humans')),
  approved BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  content TEXT,
  media_urls TEXT[],
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial categories
INSERT INTO categories (name, type, description) VALUES
('Inventions', 'once', 'Human inventions and innovations'),
('Art', 'once', 'Artistic creations and movements'),
('Music', 'once', 'Musical compositions and genres'),
('Literature', 'once', 'Written works and authors'),
('Performance', 'once', 'Theatrical and performative arts'),
('Science', 'once', 'Scientific discoveries and theories'),
('Technology', 'once', 'Technological advancements'),
('Philosophy', 'once', 'Philosophical ideas and thinkers'),
('Architecture', 'once', 'Architectural designs and structures'),
('Social Structures', 'once', 'Social systems and organizations'),
('Creators', 'humans', 'Creative individuals'),
('Artists', 'humans', 'Visual and performing artists'),
('Engineers', 'humans', 'Engineering innovators'),
('Scientists', 'humans', 'Scientific researchers'),
('Writers', 'humans', 'Authors and writers'),
('Performers', 'humans', 'Actors and performers'),
('Philosophers', 'humans', 'Philosophical thinkers'),
('Builders', 'humans', 'Architects and constructors'),
('Innovators', 'humans', 'Inventors and innovators'),
('Thinkers', 'humans', 'Intellectuals and theorists');

-- RLS policies
CREATE POLICY "Users can view their own data" ON auth.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Pages are viewable by everyone" ON pages FOR SELECT USING (true);
CREATE POLICY "Approved pages only" ON pages FOR SELECT USING (approved = true);
CREATE POLICY "Users can create pages" ON pages FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Approved comments only" ON comments FOR SELECT USING (approved = true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);