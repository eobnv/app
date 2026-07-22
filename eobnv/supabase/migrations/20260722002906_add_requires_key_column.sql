/*
# Add requires_key column to scripts

1. Modified Tables
- `scripts`
  - `requires_key` (boolean, default false) - whether the script requires a key to use
2. Data Updates
- Set requires_key=true for scripts that need keys, false for keyless ones
3. Security
- No RLS changes needed
*/

ALTER TABLE scripts ADD COLUMN IF NOT EXISTS requires_key boolean NOT NULL DEFAULT false;

-- Update existing scripts: some require keys, most are keyless
UPDATE scripts SET requires_key = CASE
  WHEN title LIKE '%Redz Hub%' THEN true
  WHEN title LIKE '%Vexon Hub%' THEN true
  WHEN title LIKE '%FourHub%' THEN true
  WHEN title LIKE '%Pet Sim X%' THEN true
  ELSE false
END;
