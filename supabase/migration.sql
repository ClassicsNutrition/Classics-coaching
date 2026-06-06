-- ============================================================
-- Classics Coaching – Supabase SQL Migration
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  banned_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    'client'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- 2. EXERCISES (Global library)
-- ============================================================
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  gif_url TEXT,
  muscle_group TEXT,
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. EBOOKS
-- ============================================================
CREATE TABLE IF NOT EXISTS ebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  sections JSONB DEFAULT '[]',
  pdf_url TEXT,
  theme_primary TEXT DEFAULT '#FF2D78',
  theme_accent TEXT DEFAULT '#00F5FF',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 4. PROGRAMS
-- ============================================================
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  sections JSONB DEFAULT '[]',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 5. RESERVATIONS (Access management)
-- ============================================================
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('ebook', 'program')),
  content_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'granted', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, content_type, content_id)
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ebooks_updated_at ON ebooks;
CREATE TRIGGER ebooks_updated_at BEFORE UPDATE ON ebooks FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
DROP TRIGGER IF EXISTS programs_updated_at ON programs;
CREATE TRIGGER programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
DROP TRIGGER IF EXISTS reservations_updated_at ON reservations;
CREATE TRIGGER reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- ============================================================
-- 6. ROW LEVEL SECURITY & HELPER FUNCTIONS
-- ============================================================

-- Create function to check if the current user is admin without recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (public.is_admin());

-- Ebooks: public read if published
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published ebooks are public" ON ebooks FOR SELECT USING (published = true);
CREATE POLICY "Admins can do everything on ebooks" ON ebooks FOR ALL USING (public.is_admin());

-- Programs: public read if published
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published programs are public" ON programs FOR SELECT USING (published = true);
CREATE POLICY "Admins can do everything on programs" ON programs FOR ALL USING (public.is_admin());

-- Exercises: public read
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Exercises are public" ON exercises FOR SELECT USING (true);
CREATE POLICY "Admins manage exercises" ON exercises FOR ALL USING (public.is_admin());

-- Reservations
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own reservations" ON reservations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create reservations" ON reservations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage all reservations" ON reservations FOR ALL USING (public.is_admin());

-- ============================================================
-- 7. MAKE YOURSELF ADMIN (replace with your email)
-- ============================================================
-- UPDATE profiles SET role = 'admin'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'votre@email.com');

-- ============================================================
-- 8. FAVORITE EXERCISES
-- ============================================================
CREATE TABLE IF NOT EXISTS favorite_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, exercise_id)
);

ALTER TABLE favorite_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own favorites" ON favorite_exercises FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create favorites" ON favorite_exercises FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON favorite_exercises FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage all favorites" ON favorite_exercises FOR ALL USING (public.is_admin());

-- ============================================================
-- 9. MESSAGERIE (CHAT ADMIN / CLIENT)
-- ============================================================

CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  admin_unread_count INT NOT NULL DEFAULT 0,
  user_unread_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable triggers to update updated_at on chat_rooms
DROP TRIGGER IF EXISTS chat_rooms_updated_at ON chat_rooms;
CREATE TRIGGER chat_rooms_updated_at BEFORE UPDATE ON chat_rooms FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- Enable RLS
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for chat_rooms
CREATE POLICY "Users can view their own chat room" 
  ON chat_rooms FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all chat rooms" 
  ON chat_rooms FOR ALL 
  USING (public.is_admin());

-- Policies for chat_messages
CREATE POLICY "Users can view messages in their own chat room" 
  ON chat_messages FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM chat_rooms 
    WHERE chat_rooms.id = chat_messages.room_id 
    AND chat_rooms.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert messages in their own chat room" 
  ON chat_messages FOR INSERT 
  WITH CHECK (
    auth.uid() = sender_id 
    AND EXISTS (
      SELECT 1 FROM chat_rooms 
      WHERE chat_rooms.id = chat_messages.room_id 
      AND chat_rooms.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all messages" 
  ON chat_messages FOR ALL 
  USING (public.is_admin());

-- ============================================================
-- 10. USER NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  type TEXT DEFAULT 'general',
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- Policies for user_notifications
CREATE POLICY "Users can view their own notifications" 
  ON user_notifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON user_notifications FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" 
  ON user_notifications FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications" 
  ON user_notifications FOR ALL 
  USING (public.is_admin());

-- ============================================================
-- 11. PUSH SUBSCRIPTIONS (Web Push device tokens)
-- ============================================================
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  keys JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for push_subscriptions
CREATE POLICY "Users can manage their own subscriptions" 
  ON push_subscriptions FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions" 
  ON push_subscriptions FOR SELECT 
  USING (public.is_admin());

-- ============================================================
-- 12. ROLE PROTECTION TRIGGER (Prevents privilege escalation)
-- ============================================================

-- Déclencheur pour empêcher l'élévation de privilèges ou la modification du statut de bannissement par des clients
CREATE OR REPLACE FUNCTION check_profile_role_update()
RETURNS TRIGGER AS $$
BEGIN
  IF (auth.role() = 'authenticated' OR auth.role() = 'anon') THEN
    IF OLD.role IS DISTINCT FROM NEW.role THEN
      RAISE EXCEPTION 'Modification du rôle non autorisée.';
    END IF;
    IF OLD.banned_until IS DISTINCT FROM NEW.banned_until THEN
      RAISE EXCEPTION 'Modification du statut de bannissement non autorisée.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS check_profile_role_update_trigger ON public.profiles;
CREATE TRIGGER check_profile_role_update_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE check_profile_role_update();

-- ============================================================
-- 13. MORPHOLOGICAL USER PROFILE COLUMNS
-- ============================================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS height NUMERIC,
ADD COLUMN IF NOT EXISTS weight NUMERIC,
ADD COLUMN IF NOT EXISTS objective TEXT,
ADD COLUMN IF NOT EXISTS medical_history TEXT,
ADD COLUMN IF NOT EXISTS sports_history TEXT;


