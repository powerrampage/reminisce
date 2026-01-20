-- Supabase Migration Script
-- Run this in your Supabase SQL Editor to set up the database schema

-- Create saved_words table
CREATE TABLE IF NOT EXISTS saved_words (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, word)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_saved_words_user_id ON saved_words(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_words_word ON saved_words(word);

-- Enable Row Level Security (RLS)
ALTER TABLE saved_words ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Policy: Users can only see their own saved words
CREATE POLICY "Users can view their own saved words"
    ON saved_words
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can only insert their own saved words
CREATE POLICY "Users can insert their own saved words"
    ON saved_words
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own saved words
CREATE POLICY "Users can delete their own saved words"
    ON saved_words
    FOR DELETE
    USING (auth.uid() = user_id);

-- Policy: Users can only update their own saved words
CREATE POLICY "Users can update their own saved words"
    ON saved_words
    FOR UPDATE
    USING (auth.uid() = user_id);

