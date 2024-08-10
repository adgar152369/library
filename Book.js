// Book model:
/**
 * id: string,
 * title: string,
 * author: string,
 * pages: string,
 * hasRead: boolean
 */

function Book(title, author, pages, hasRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.hasRead = hasRead;
  this.id = Math.floor(Math.random() * 100);
  this.isEditing = false;

  this.info = function () {
    return `${title} by ${author}, ${pages} pages, ${
      hasRead ? "already read" : "not read yet"
    }`;
  };

  this.toggleReadStatus = function () {
    this.hasRead = !this.hasRead;
  };

  this.toggleEditing = function () {
    this.isEditing = !this.isEditing;
  };

  this.editBook = function (
    newTitle,
    newAuthor,
    newPages = this.pages,
    newReadStatus = this.hasRead
  ) {
    this.title = newTitle;
    this.author = newAuthor;
    this.pages = newPages;
    this.hasRead = newReadStatus;
  };
}

// add toggle read status to Book prototype
Book.prototype.toggleReadStatus = function () {
  this.hasRead = !this.hasRead;
};

// store all book in an Array (a library)
let myLibrary = [
  new Book("Harry Potter and The Sorcerer's Stone", "JK Rowling", 455, true),
  new Book("IT", "Stephen King", 677, false),
];

const bookTitle = document.querySelector("input#title");
const bookAuthor = document.querySelector("input#author");
const bookPages = document.querySelector("input#pages");
const bookHasRead = document.getElementsByName("hasRead");
const addNewBookBtn = document.querySelector("#addNewBookBtn");
const booksDisplay = document.querySelector(".booksDisplay");
const addBookBtn = document.querySelector(".addBookBtn");
const newBookDialog = document.querySelector("dialog");
const newBookForm = document.querySelector("dialog form");
const newBookFormCloseBtn = document.querySelector("dialog button");

addBookBtn.addEventListener("click", () => {
  newBookForm.reset();
  newBookDialog.showModal();
});

newBookFormCloseBtn.addEventListener("click", () => newBookDialog.close());
addNewBookBtn.addEventListener("click", (e) => onAddBook(e));

function displayBooks() {
  if (myLibrary.length === 0) {
    booksDisplay.innerHTML = "<p>No books to display.</p>";
  } else {
    booksDisplay.innerHTML = "";

    for (let i = 0; i < myLibrary.length; i++) {
      const book = myLibrary[i];
      const bookElement = document.createElement("li");
      bookElement.className = "book-item";
      bookElement.setAttribute("data-book-id", book.id);
      bookElement.innerHTML = `
        <h2 class="title">${book.title}</h2>
        <p class="author">${book.author}</p>
        ${book.hasRead ? "<p class='hasRead'>&check; Have read</p>" : ""}
        <div>
          <button class="hasReadToggle toggle">${
            book.hasRead ? "Unread" : "Read"
          }</button>
          <button class="deleteBookBtn delete">Delete</button>
        </div>
        <hr>
      `;
      booksDisplay.appendChild(bookElement);
    }

    selectButtons();
  }
}

function selectButtons() {
  // const editBookBtns = document.querySelectorAll(".editBookBtn");
  const deleteBookBtns = document.querySelectorAll(".deleteBookBtn");
  const hasReadToggleBtns = document.querySelectorAll(".hasReadToggle");

  hasReadToggleBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => onToggleReadStatus(e));
  });
  deleteBookBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => onRemoveBook(e));
  });
}

function onToggleReadStatus(e) {
  let bookToToggleReadStatus = e.target.parentElement.parentElement;
  let bookId = bookToToggleReadStatus.dataset.bookId;

  const book = myLibrary.find((book) => book.id == bookId);
  book.toggleReadStatus();

  displayBooks();
}

// LATER
function openEditBookDialog(e) {
  const book = myLibrary.find((book) => book.id == e.target.parentElement.parentElement.getAttribute('data-book-id'));
  const editBookDialog = document.createElement("dialog");
  editBookDialog.innerHTML = `
    <button autofocus>X</button>
    <form>
      <fieldset>
        <p>
          <label for="title">Book Title:</label>
          <input type="text" name="title" id="title" value="${book.title}" placeholder="Book title">
        </p>
        <p>
          <label for="author">Author:</label>
          <input type="text" name="author" id="author" value="${book.author}" placeholder="Book author">
        </p>
        <p>
          <label for="pages">Number of pages:</label>
          <input type="number" name="pages" id="pages" value="${book.pages}" placeholder="# of pages">
        </p>
        <p>
      </fieldset>
        <fieldset>
          <legend>Have you read this book?</legend>
          <p>
            <label for="yes">Yes</label>
            <input type="radio" name="hasRead" value="yes" id="yes">
          </p>
          <p>
            <label for="no">No</label>
            <input type="radio" name="hasRead" value="no" id="no">
          </p>
        </fieldset>
      </p>
      <button id="saveBookBtn" type="submit">Save</button>
    </form>
  `;

  document.body.appendChild(editBookDialog);

  editBookDialog.showModal();
}
// END LATER

function onRemoveBook(e) {
  const bookToRemove = e.target.parentElement.parentElement;
  const bookId = bookToRemove.getAttribute("data-book-id");
  myLibrary = myLibrary.filter((book) => book.id != bookId);

  displayBooks();
}

function onAddBook(e) {
  e.preventDefault();

  let title = bookTitle.value;
  let author = bookAuthor.value;
  let pages = bookPages.value;
  let hasReadValue = false;

  for (let i = 0; i < Array.from(bookHasRead).length; i++) {
    const element = Array.from(bookHasRead)[i];
    if (element.checked && element.value === "yes") {
      hasReadValue = true;
    }
  }

  const newBook = new Book(title, author, pages, hasReadValue);
  myLibrary.push(newBook);

  newBookDialog.close();

  displayBooks();
}

displayBooks();
