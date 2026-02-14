-- Migration: Add new features to bookmarks table
-- Run this if you already have the bookmarks table created

-- Add new columns
alter table bookmarks add column if not exists description text;
alter table bookmarks add column if not exists tags text[] default '{}';
alter table bookmarks add column if not exists is_favorite boolean default false;
alter table bookmarks add column if not exists favicon_url text;

-- Create index for favorites
create index if not exists bookmarks_is_favorite_idx on bookmarks(is_favorite);

-- Create index for tags (GIN index for array search)
create index if not exists bookmarks_tags_idx on bookmarks using gin(tags);
