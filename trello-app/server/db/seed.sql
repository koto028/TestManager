-- 初期データ（schema.sql 実行後）
-- ボード 1 件 + リスト 3 列 + サンプルカード 1 件

INSERT INTO boards (id, title) VALUES (1, 'マイタスクボード');

INSERT INTO lists (id, board_id, title, sort_order) VALUES
  (1, 1, 'やること', 1),
  (2, 1, '進行中', 2),
  (3, 1, '完了', 3);

INSERT INTO cards (list_id, title, sort_order) VALUES
  (1, 'はじめてのタスク', 1);
