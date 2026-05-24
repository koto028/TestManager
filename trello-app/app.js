const API_BASE = "";
const BYPASS_STORAGE_KEY = "trello-app-bypass-lists";

let lists = [];
let isLoading = false;
let loadError = null;
let bypassMode = false;
let nextCardId = 100;

const boardEl = document.getElementById("board");

boardEl.addEventListener("click", handleBoardClick);
boardEl.addEventListener("submit", handleBoardSubmit);

init();

function isBypassModeRequested() {
  if (window.location.protocol === "file:") return true;

  const params = new URLSearchParams(window.location.search);
  if (params.get("bypass") === "1") return true;

  return localStorage.getItem("trello-bypass-mode") === "1";
}

function enableBypassMode() {
  bypassMode = true;
  localStorage.setItem("trello-bypass-mode", "1");
}

function getDefaultBypassLists() {
  return [
    {
      id: "1",
      title: "やること",
      cards: [
        { id: "c1", title: "はじめてのタスク" },
        { id: "c2", title: "レポート提出" },
      ],
    },
    {
      id: "2",
      title: "進行中",
      cards: [{ id: "c3", title: "API 設計を読む" }],
    },
    {
      id: "3",
      title: "完了",
      cards: [{ id: "c4", title: "環境構築" }],
    },
  ];
}

function loadBypassLists() {
  const raw = localStorage.getItem(BYPASS_STORAGE_KEY);
  if (!raw) return getDefaultBypassLists();

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      syncNextCardId(parsed);
      return parsed;
    }
  } catch {
    // fall through to defaults
  }

  return getDefaultBypassLists();
}

function saveBypassLists() {
  localStorage.setItem(BYPASS_STORAGE_KEY, JSON.stringify(lists));
}

function syncNextCardId(sourceLists) {
  let maxId = 99;
  for (const list of sourceLists) {
    for (const card of list.cards || []) {
      const match = String(card.id).match(/^c(\d+)$/);
      if (match) maxId = Math.max(maxId, Number(match[1]));
    }
  }
  nextCardId = maxId + 1;
}

function showBypassBanner() {
  const hint = document.querySelector(".board-header__hint");
  if (!hint) return;

  hint.textContent =
    "バイパスモード：API / MySQL を使わず localStorage に保存しています";
  hint.classList.add("board-header__hint--bypass");
}

function initBypass() {
  enableBypassMode();
  showBypassBanner();
  lists = loadBypassLists();
  isLoading = false;
  loadError = null;
  render();
}

async function init() {
  if (isBypassModeRequested()) {
    initBypass();
    return;
  }

  showLoading();
  try {
    await loadBoard();
    render();
  } catch (error) {
    showError(error.message);
  }
}

function showLoading() {
  isLoading = true;
  loadError = null;
  boardEl.innerHTML = `<p class="board-status">データを読み込み中…</p>`;
}

function showError(message) {
  isLoading = false;
  loadError = message;
  boardEl.innerHTML = `
    <div class="board-status board-status--error">
      <p>データの読み込みに失敗しました。</p>
      <p>${escapeHtml(message)}</p>
      <p>次を確認してください:</p>
      <ul class="board-status__steps">
        <li><code>trello-app/server</code> で <code>npm start</code> が動いているか</li>
        <li>MySQL が起動し、<code>trello_app</code> DB が作成済みか</li>
        <li><code>.env</code> の DB 接続情報が正しいか</li>
        <li><a href="http://localhost:3000/index.html">http://localhost:3000/index.html</a> で開いているか</li>
      </ul>
      <button type="button" class="btn btn--primary" data-action="retry-load">再読み込み</button>
      <button type="button" class="btn btn--ghost board-status__bypass" data-action="enable-bypass">
        バイパスモードで表示
      </button>
    </div>
  `;
}

async function loadBoard() {
  if (bypassMode) {
    lists = loadBypassLists();
    isLoading = false;
    loadError = null;
    return;
  }

  const response = await fetch(`${API_BASE}/api/board`);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  lists = data.lists || [];
  isLoading = false;
  loadError = null;
}

async function addCard(listId, title) {
  if (bypassMode) {
    const list = lists.find((item) => String(item.id) === String(listId));
    if (!list) return;

    list.cards.push({ id: `c${nextCardId++}`, title });
    saveBypassLists();
    render();
    return;
  }

  const response = await fetch(`${API_BASE}/api/lists/${listId}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "カードの追加に失敗しました");
  }

  await loadBoard();
  render();
}

async function deleteCard(cardId) {
  if (bypassMode) {
    for (const list of lists) {
      list.cards = list.cards.filter((card) => String(card.id) !== String(cardId));
    }
    saveBypassLists();
    render();
    return;
  }

  const response = await fetch(`${API_BASE}/api/cards/${cardId}`, {
    method: "DELETE",
  });

  if (!response.ok && response.status !== 204) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "カードの削除に失敗しました");
  }

  await loadBoard();
  render();
}

function render() {
  if (isLoading) return;
  boardEl.innerHTML = lists.map(renderList).join("");
}

function renderList(list) {
  const cardsHtml = list.cards.map(renderCard).join("");

  return `
    <section class="list" data-list-id="${list.id}">
      <h2 class="list__title">${escapeHtml(list.title)}</h2>
      <div class="list__cards">${cardsHtml}</div>
      <div class="add-card">
        <button type="button" class="btn add-card__toggle" data-action="show-form">
          ＋ カードを追加
        </button>
        <form class="add-card__form is-hidden" data-action="add-card-form">
          <textarea
            class="add-card__input"
            placeholder="タスク名を入力"
            rows="2"
            required
            aria-label="新しいカードのタイトル"
          ></textarea>
          <div class="add-card__actions">
            <button type="submit" class="btn btn--primary">追加</button>
            <button type="button" class="btn btn--ghost" data-action="hide-form">キャンセル</button>
          </div>
        </form>
      </div>
    </section>
  `;
}

function renderCard(card) {
  return `
    <article class="card" data-card-id="${card.id}">
      <p class="card__title">${escapeHtml(card.title)}</p>
      <button
        type="button"
        class="card__delete"
        data-action="delete-card"
        aria-label="カードを削除"
      >×</button>
    </article>
  `;
}

async function handleBoardClick(event) {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

  if (action === "retry-load") {
    showLoading();
    try {
      await loadBoard();
      render();
    } catch (error) {
      showError(error.message);
    }
    return;
  }

  if (action === "enable-bypass") {
    initBypass();
    return;
  }

  const listEl = event.target.closest(".list");
  if (!listEl) return;

  const listId = listEl.dataset.listId;

  if (action === "show-form") {
    showAddForm(listEl);
    return;
  }

  if (action === "hide-form") {
    hideAddForm(listEl);
    return;
  }

  if (action === "delete-card") {
    const cardEl = event.target.closest(".card");
    if (!cardEl) return;

    try {
      await deleteCard(cardEl.dataset.cardId);
    } catch (error) {
      alert(error.message);
    }
  }
}

async function handleBoardSubmit(event) {
  const form = event.target.closest("[data-action='add-card-form']");
  if (!form) return;

  event.preventDefault();

  const listEl = form.closest(".list");
  const listId = listEl.dataset.listId;
  const input = form.querySelector(".add-card__input");
  const title = input.value.trim();

  if (!title) return;

  try {
    await addCard(listId, title);
    input.value = "";
    hideAddForm(listEl);
  } catch (error) {
    alert(error.message);
  }
}

function showAddForm(listEl) {
  const toggle = listEl.querySelector("[data-action='show-form']");
  const form = listEl.querySelector(".add-card__form");
  toggle.classList.add("is-hidden");
  form.classList.remove("is-hidden");
  form.querySelector(".add-card__input").focus();
}

function hideAddForm(listEl) {
  const toggle = listEl.querySelector("[data-action='show-form']");
  const form = listEl.querySelector(".add-card__form");
  toggle.classList.remove("is-hidden");
  form.classList.add("is-hidden");
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
