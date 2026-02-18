-- Add status column to events table if it doesn't exist
ALTER TABLE events ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'upcoming';

-- Update existing events to set status based on date
UPDATE events SET status = CASE
    WHEN date < CURRENT_DATE THEN 'past'
    ELSE 'upcoming'
END
WHERE status IS NULL OR status = '';
