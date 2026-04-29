-- Backfill the existing workshop_children.first_name/last_name and
-- camp_children.first_name/last_name columns (added in 004 but never populated).
-- For rows linked to account_children, copy from there. Otherwise split child_name
-- on the first whitespace run.

UPDATE workshop_children wc
SET
  first_name = ac.first_name,
  last_name  = ac.last_name
FROM account_children ac
WHERE wc.account_child_id = ac.id
  AND wc.first_name IS NULL;

UPDATE workshop_children
SET
  first_name = (regexp_match(child_name, '^(\S+)'))[1],
  last_name  = NULLIF(TRIM(regexp_replace(child_name, '^\S+\s*', '')), '')
WHERE first_name IS NULL;

UPDATE camp_children cc
SET
  first_name = ac.first_name,
  last_name  = ac.last_name
FROM account_children ac
WHERE cc.account_child_id = ac.id
  AND cc.first_name IS NULL;

UPDATE camp_children
SET
  first_name = (regexp_match(child_name, '^(\S+)'))[1],
  last_name  = NULLIF(TRIM(regexp_replace(child_name, '^\S+\s*', '')), '')
WHERE first_name IS NULL;

ALTER TABLE workshop_children
  ALTER COLUMN first_name SET NOT NULL;

ALTER TABLE camp_children
  ALTER COLUMN first_name SET NOT NULL;
