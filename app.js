var books = [
  { id: "RB-1001", title: "Persuasion", author: "Jane Austen", stock: 6 },
  { id: "RB-1002", title: "The Amazing Adventures of Kavalier & Clay", author: "Michael Chabon", stock: 2 },
  { id: "RB-1003", title: "Housekeeping", author: "Marilynne Robinson", stock: 0 },
  { id: "RB-1004", title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", stock: 9 },
  { id: "RB-1005", title: "Stoner", author: "John Williams", stock: 3 },
  { id: "RB-1006", title: "The Bluest Eye", author: "Toni Morrison", stock: 1 },
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderCatalog(list) {
  var container = document.getElementById("catalog-list");
  var status = document.getElementById("catalog-status");

  if (list.length === 0) {
    container.innerHTML = "";
    status.textContent = "No titles found. Try a different search.";
    return;
  }

  status.textContent = "";

  var html = "";
  for (var i = 0; i < list.length; i++) {
    var book = list[i];
    var lowStockClass = book.stock <= 2 ? "is-low" : "";

    html += '<article class="card">';
    html += '<h3 class="card__title">' + escapeHtml(book.title) + "</h3>";
    html += '<p class="card__author">' + escapeHtml(book.author) + "</p>";
    html += '<div class="card__meta">';
    html += "<span>" + escapeHtml(book.id) + "</span>";
    html += '<span class="card__stock ' + lowStockClass + '">' + book.stock + " in stock</span>";
    html += "</div>";
    html += "</article>";
  }

  container.innerHTML = html;
}

function filterBooks(query) {
  var normalized = query.trim().toLowerCase();
  if (normalized === "") {
    return books;
  }

  var results = [];
  for (var i = 0; i < books.length; i++) {
    var book = books[i];
    if (book.title.toLowerCase().indexOf(normalized) !== -1 || book.author.toLowerCase().indexOf(normalized) !== -1) {
      results.push(book);
    }
  }
  return results;
}

function showLoading() {
  var status = document.getElementById("catalog-status");
  var container = document.getElementById("catalog-list");
  container.innerHTML = "";
  status.innerHTML = '<span class="loading">Searching the shelves…</span>';
}

var searchTimer = null;

function setupSearch() {
  var input = document.getElementById("search-input");

  input.addEventListener("input", function () {
    var query = input.value;
    showLoading();

    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(function () {
      var results = filterBooks(query);
      renderCatalog(results);
    }, 600);
  });
}

function setupTabs() {
  var buttons = document.querySelectorAll(".tabs__button");

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      for (var j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove("is-active");
        buttons[j].setAttribute("aria-pressed", "false");
      }
      this.classList.add("is-active");
      this.setAttribute("aria-pressed", "true");

      var tabName = this.getAttribute("data-tab");
      var panels = document.querySelectorAll(".panel");
      for (var k = 0; k < panels.length; k++) {
        panels[k].hidden = panels[k].getAttribute("data-panel") !== tabName;
      }
    });
  }
}

function setupAddBookForm() {
  var form = document.getElementById("add-book-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var titleInput = document.getElementById("field-title");
    var authorInput = document.getElementById("field-author");
    var stockInput = document.getElementById("field-stock");

    var titleError = document.getElementById("error-title");
    var authorError = document.getElementById("error-author");
    var stockError = document.getElementById("error-stock");

    titleInput.classList.remove("is-invalid");
    authorInput.classList.remove("is-invalid");
    stockInput.classList.remove("is-invalid");
    titleInput.removeAttribute("aria-invalid");
    authorInput.removeAttribute("aria-invalid");
    stockInput.removeAttribute("aria-invalid");
    titleError.textContent = "";
    authorError.textContent = "";
    stockError.textContent = "";

    var hasError = false;

    if (titleInput.value.trim() === "") {
      titleInput.classList.add("is-invalid");
      titleInput.setAttribute("aria-invalid", "true");
      titleError.textContent = "Enter a title.";
      hasError = true;
    }

    if (authorInput.value.trim() === "") {
      authorInput.classList.add("is-invalid");
      authorInput.setAttribute("aria-invalid", "true");
      authorError.textContent = "Enter an author.";
      hasError = true;
    }

    var stockValue = stockInput.value.trim();
    if (stockValue === "" || isNaN(stockValue) || Number(stockValue) < 0) {
      stockInput.classList.add("is-invalid");
      stockInput.setAttribute("aria-invalid", "true");
      stockError.textContent = "Enter a stock count of 0 or more.";
      hasError = true;
    }

    if (hasError) {
      return;
    }

    var newBook = {
      id: "RB-" + (1000 + books.length + 1),
      title: escapeHtml(titleInput.value.trim()),
      author: escapeHtml(authorInput.value.trim()),
      stock: Number(stockValue),
    };

    books.push(newBook);

    var confirmation = document.getElementById("add-book-confirmation");
    confirmation.textContent = newBook.title + " was added to the catalog.";

    form.reset();
    console.log("[Analytics] User interacted with Static Landing Page");
  });
}

setupTabs();
setupSearch();
setupAddBookForm();
renderCatalog(books);