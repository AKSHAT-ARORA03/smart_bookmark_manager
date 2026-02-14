-- Smart Bookmark Manager Database Schema
-- Run this in your Supabase SQL Editor

-- Create bookmarks table
create table if not exists bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  description text,
  tags text[] default '{}',
  is_favorite boolean default false,
  favicon_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for better query performance
create index bookmarks_user_id_idx on bookmarks(user_id);
create index bookmarks_created_at_idx on bookmarks(created_at desc);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Create RLS policies
create policy "Users can insert their own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can update their own bookmarks"
  on bookmarks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);

-- Enable Realtime
alter publication supabase_realtime add table bookmarks;

-- Create function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger to call the function
create trigger update_bookmarks_updated_at
  before update on bookmarks
  for each row
  execute function update_updated_at_column();
