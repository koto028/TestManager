-- Task Manager initial schema

CREATE TABLE boards (
    id         BIGSERIAL PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lists (
    id         BIGSERIAL PRIMARY KEY,
    board_id   BIGINT       NOT NULL REFERENCES boards (id) ON DELETE CASCADE,
    title      VARCHAR(255) NOT NULL,
    sort_order INT          NOT NULL DEFAULT 0,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lists_board_sort ON lists (board_id, sort_order);

CREATE TABLE cards (
    id         BIGSERIAL PRIMARY KEY,
    list_id    BIGINT    NOT NULL REFERENCES lists (id) ON DELETE CASCADE,
    title      TEXT      NOT NULL,
    sort_order INT       NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cards_list_sort ON cards (list_id, sort_order);

-- Initial data
INSERT INTO boards (title) VALUES ('マイタスクボード');

INSERT INTO lists (board_id, title, sort_order)
VALUES (1, 'やること', 1),
       (1, '進行中', 2),
       (1, '完了', 3);

INSERT INTO cards (list_id, title, sort_order)
VALUES (1, 'はじめてのタスク', 1);
