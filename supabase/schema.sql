CREATE TABLE friends_birthdays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT  auth.jwt()->>'sub',
  name TEXT NOT NULL,
  date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE friends_birthdays ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own friends' birthdays
CREATE POLICY "User can view their own friends' birthdays" 
ON "public"."friends_birthdays"
FOR SELECT
TO authenticated
USING (
  user_id = (auth.jwt()->>'sub')
);

-- Policy: Users can insert only their own friends' birthdays
CREATE POLICY "User can insert their own friends' birthdays"
ON "public"."friends_birthdays"
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = (auth.jwt()->>'sub')
);

-- Policy: Users can update only their own friends' birthdays
CREATE POLICY "User can update their own friends' birthdays"
ON "public"."friends_birthdays"
FOR UPDATE
TO authenticated
USING (
  user_id = (auth.jwt()->>'sub')
)
WITH CHECK (
  user_id = (auth.jwt()->>'sub')
);

-- Policy: Users can delete only their own friends' birthdays
CREATE POLICY "User can delete their own friends' birthdays"
ON "public"."friends_birthdays"
FOR DELETE
TO authenticated
USING (
  user_id = (auth.jwt()->>'sub')
);

