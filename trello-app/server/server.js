require("dotenv").config();

const path = require("path");
const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DEFAULT_BOARD_ID = 1;

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "trello_app",
  waitForConnections: true,
  connectionLimit: 10,
});

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

const staticRoot = path.join(__dirname, "..");
app.use(express.static(staticRoot));

async function fetchBoardLists(boardId) {
  const [lists] = await pool.query(
    `SELECT id, title, sort_order
     FROM lists
     WHERE board_id = ?
     ORDER BY sort_order ASC, id ASC`,
    [boardId]
  );

  if (lists.length === 0) {
    return [];
  }

  const listIds = lists.map((list) => list.id);
  const placeholders = listIds.map(() => "?").join(", ");
  const [cards] = await pool.query(
    `SELECT id, list_id, title, sort_order
     FROM cards
     WHERE list_id IN (${placeholders})
     ORDER BY sort_order ASC, id ASC`,
    listIds
  );

  const cardsByList = new Map();
  for (const card of cards) {
    if (!cardsByList.has(card.list_id)) {
      cardsByList.set(card.list_id, []);
    }
    cardsByList.get(card.list_id).push({
      id: String(card.id),
      title: card.title,
    });
  }

  return lists.map((list) => ({
    id: String(list.id),
    title: list.title,
    cards: cardsByList.get(list.id) || [],
  }));
}

async function ensureDefaultBoard() {
  const [boards] = await pool.query("SELECT id FROM boards WHERE id = ?", [
    DEFAULT_BOARD_ID,
  ]);

  if (boards.length > 0) {
    return;
  }

  await pool.query("INSERT INTO boards (id, title) VALUES (?, ?)", [
    DEFAULT_BOARD_ID,
    "マイタスクボード",
  ]);

  await pool.query(
    `INSERT INTO lists (board_id, title, sort_order) VALUES
     (?, 'やること', 1),
     (?, '進行中', 2),
     (?, '完了', 3)`,
    [DEFAULT_BOARD_ID, DEFAULT_BOARD_ID, DEFAULT_BOARD_ID]
  );

  const [todoLists] = await pool.query(
    "SELECT id FROM lists WHERE board_id = ? AND sort_order = 1 LIMIT 1",
    [DEFAULT_BOARD_ID]
  );

  if (todoLists.length > 0) {
    await pool.query(
      "INSERT INTO cards (list_id, title, sort_order) VALUES (?, ?, 1)",
      [todoLists[0].id, "はじめてのタスク"]
    );
  }
}

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (error) {
    res.status(503).json({ ok: false, message: error.message });
  }
});

app.get("/api/board", async (_req, res) => {
  try {
    await ensureDefaultBoard();
    const [boards] = await pool.query(
      "SELECT id, title FROM boards WHERE id = ? LIMIT 1",
      [DEFAULT_BOARD_ID]
    );
    const lists = await fetchBoardLists(DEFAULT_BOARD_ID);

    res.json({
      board: {
        id: String(boards[0].id),
        title: boards[0].title,
      },
      lists,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/lists/:listId/cards", async (req, res) => {
  const listId = Number(req.params.listId);
  const title = String(req.body?.title || "").trim();

  if (!listId || !title) {
    res.status(400).json({ message: "listId と title は必須です" });
    return;
  }

  try {
    const [lists] = await pool.query("SELECT id FROM lists WHERE id = ?", [
      listId,
    ]);
    if (lists.length === 0) {
      res.status(404).json({ message: "リストが見つかりません" });
      return;
    }

    const [rows] = await pool.query(
      "SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM cards WHERE list_id = ?",
      [listId]
    );
    const sortOrder = rows[0].next_order;

    const [result] = await pool.query(
      "INSERT INTO cards (list_id, title, sort_order) VALUES (?, ?, ?)",
      [listId, title, sortOrder]
    );

    res.status(201).json({
      id: String(result.insertId),
      title,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/cards/:cardId", async (req, res) => {
  const cardId = Number(req.params.cardId);

  if (!cardId) {
    res.status(400).json({ message: "cardId が不正です" });
    return;
  }

  try {
    const [result] = await pool.query("DELETE FROM cards WHERE id = ?", [
      cardId,
    ]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "カードが見つかりません" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use((_req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT}/index.html`);
});
