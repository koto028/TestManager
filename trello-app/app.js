const API_BASE = "";

let lists = [];
let isLoading = false;
let loadError = null;

const boardEl = document.getElementById("board");

boardEl.addEventListener("click", handleBoardClick);
boardEl.addEventListener("submit", handleBoardSubmit);

init();

async function init() {
  if (window.location.protocol === "file:") {
    showSetupGuide();
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

function showSetupGuide() {
  boardEl.innerHTML = `
    <div class="board-status board-status--error">
      <p><strong>index.html を直接開いているため、表示できません。</strong></p>
      <p>Phase 2（MySQL 版）では API サーバー経由で開く必要があります。</p>
      <ol class="board-status__steps">
        <li><a href="https://nodejs.org/" target="_blank" rel="noopener">Node.js LTS</a> をインストール（npm 付属）</li>
        <li>MySQL を起動し、<code>trello_app</code> DB と schema / seed を適用</li>
        <li><code>trello-app/server</code> で <code>npm install</code> → <code>npm start</code></li>
        <li>ブラウザで <a href="http://localhost:3000/index.html">http://localhost:3000/index.html</a> を開く</li>
      </ol>
    </div>
  `;
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
    </div>
  `;
}

async function loadBoard() {
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
