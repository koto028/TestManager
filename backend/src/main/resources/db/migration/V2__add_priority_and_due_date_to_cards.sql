-- Add priority and due_date columns to cards table
-- priority: 0=none, 1=low, 2=medium, 3=high
ALTER TABLE cards ADD COLUMN priority INT NOT NULL DEFAULT 0;
ALTER TABLE cards ADD COLUMN due_date DATE;
