ALTER TABLE cards  ADD CONSTRAINT chk_cards_priority  CHECK (priority BETWEEN 0 AND 3);
ALTER TABLE lists  ADD CONSTRAINT chk_lists_priority  CHECK (priority BETWEEN 0 AND 3);
