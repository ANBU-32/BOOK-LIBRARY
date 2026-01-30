const myLibrary =  [];

// Constructor
function Book(title, author, pages, isRead) {
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

// Prototype
Book.prototype.toggleRead = function () {
  this.isRead = !this.isRead;
};

// Save to LocalStorage
function saveLibrary() {
  localStorage.setItem("library", JSON.stringify(myLibrary));
}

// Add Book
function addBookToLibrary(title, author, pages, isRead) {
  const book = new Book(title, author, pages, isRead);
  myLibrary.push(book);
  saveLibrary();
  displayBooks();
}

// Update Book
function updateBook(id, title, author, pages, isRead) {
  const book = myLibrary.find(b => b.id === id);
  book.title = title;
  book.author = author;
  book.pages = pages;
  book.isRead = isRead;
  saveLibrary();
  displayBooks();
}

// Remove Book
function removeBook(id) {
  const index = myLibrary.findIndex(book => book.id === id);
  myLibrary.splice(index, 1);
  saveLibrary();
  displayBooks();
}

// Toggle Status
function toggleBookStatus(id) {
  const book = myLibrary.find(book => book.id === id);
  book.toggleRead();
  saveLibrary();
  displayBooks();
}

// Dashboard Stats
function updateStats() {
  const total = myLibrary.length;
  const read = myLibrary.filter(b => b.isRead).length;
  const unread = total - read;

  document.getElementById("totalBooks").textContent = total;
  document.getElementById("readBooks").textContent = read;
  document.getElementById("unreadBooks").textContent = unread;
}

// Display Books
function displayBooks() {
  const bookList = document.querySelector(".book-list");
  const searchText = document.getElementById("searchInput").value.toLowerCase();
  const filter = document.getElementById("filterSelect").value;

  bookList.innerHTML = "";

  myLibrary
    .filter(book => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchText) ||
        book.author.toLowerCase().includes(searchText);

      const matchesFilter =
        filter === "all" ||
        (filter === "read" && book.isRead) ||
        (filter === "unread" && !book.isRead);

      return matchesSearch && matchesFilter;
    })
    .forEach(book => {
      const card = document.createElement("div");
      card.classList.add("book-card");
      card.dataset.id = book.id;

      const statusClass = book.isRead ? "status-read" : "status-unread";

      card.innerHTML = `
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Pages: ${book.pages}</p>
        <span class="status-badge ${statusClass}">
          ${book.isRead ? "Read" : "Not Read"}
        </span>

        <div class="card-actions">
          <button data-action="toggle-status">Toggle Status</button>
          <button data-action="edit">Edit</button>
          <button data-action="delete">Delete</button>
        </div>
      `;

      bookList.appendChild(card);
    });

  updateStats();
}

// DOM Elements
const dialog = document.getElementById("addBookDialog");
const form = document.getElementById("addBookForm");
const addBookBtn = document.getElementById("addBookBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Open Dialog
addBookBtn.addEventListener("click", () => {
  editBookId = null;
  form.reset();
  document.getElementById("formTitle").textContent = "Add Book";
  dialog.showModal();
});

// Close Dialog
cancelBtn.addEventListener("click", () => dialog.close());

// Form Submit
form.addEventListener("submit", e => {
  e.preventDefault();

  const title = titleInput.value;
  const author = authorInput.value;
  const pages = pagesInput.value;
  const isRead = isReadInput.checked;

  if (editBookId) {
    updateBook(editBookId, title, author, pages, isRead);
  } else {
    addBookToLibrary(title, author, pages, isRead);
  }

  dialog.close();
});

// Inputs
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const pagesInput = document.getElementById("pages");
const isReadInput = document.getElementById("isRead");

// Event Delegation
document.addEventListener("click", e => {
  const card = e.target.closest(".book-card");
  if (!card) return;

  const id = card.dataset.id;

  if (e.target.dataset.action === "delete") removeBook(id);
  if (e.target.dataset.action === "toggle-status") toggleBookStatus(id);

  if (e.target.dataset.action === "edit") {
    const book = myLibrary.find(b => b.id === id);
    editBookId = id;

    titleInput.value = book.title;
    authorInput.value = book.author;
    pagesInput.value = book.pages;
    isReadInput.checked = book.isRead;

    document.getElementById("formTitle").textContent = "Edit Book";
    dialog.showModal();
  }
});

// Search & Filter
document.getElementById("searchInput").addEventListener("input", displayBooks);
document.getElementById("filterSelect").addEventListener("change", displayBooks);

// Initial Display
displayBooks();
