const STORAGE_KEY = "trello-app-data";

const defaultLists = [
  {
    id: "list-1",
    title: "やること",
    cards: [{ id: "card-1", title: "はじめてのタスク" }],
  },
  {
    id: "list-2",
    title: "進行中",
    cards: [],
  },
  {
    id: "list-3",
    title: "完了",
    cards: [],
  },
];

let lists = loadLists();

const boardEl = document.getElementById("board");

boardEl.addEventListener("click", handleBoardClick);
boardEl.addEventListener("submit", handleBoardSubmit);

render();

function loadLists() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return clone(defaultLists);
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return clone(defaultLists);
    }
    return parsed;
  } catch {
    return clone(defaultLists);
  }
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function saveLists() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function render() {
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

function handleBoardClick(event) {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

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
    deleteCard(listId, cardEl.dataset.cardId);
  }
}

function handleBoardSubmit(event) {
  const form = event.target.closest("[data-action='add-card-form']");
  if (!form) return;

  event.preventDefault();

  const listEl = form.closest(".list");
  const listId = listEl.dataset.listId;
  const input = form.querySelector(".add-card__input");
  const title = input.value.trim();

  if (!title) return;

  addCard(listId, title);
  input.value = "";
  hideAddForm(listEl);
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

function findList(listId) {
  return lists.find((list) => list.id === listId);
}

function addCard(listId, title) {
  const list = findList(listId);
  if (!list) return;

  list.cards.push({
    id: createId("card"),
    title,
  });

  saveLists();
  render();
}

function deleteCard(listId, cardId) {
  const list = findList(listId);
  if (!list) return;

  list.cards = list.cards.filter((card) => card.id !== cardId);
  saveLists();
  render();
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
