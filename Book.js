/**
 * class Book:
 *  public title;
 *  public author;
 *  public pages;
 *  public hasRead;
 *  public isEditing;
 *  private id;
 *
 *  // Accessors
 *  get bookTitle(): this.title;
 *  get bookAuthor(): this.author;
 *  get numberOfPages(): this.pages;
 *  get hasRead(): this.hasRead;
 *  set hasRead(value): this.hasRead = value;
 *  set isEditing(value): this.isEditing = value;
 */

class Book {
  title = "";
  author = "";
  pages = 0;
  hasRead = "";
  id = Math.random().toString(36).substr(2, 9);

  constructor(title, author, pages, hasRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.hasReadStatus = hasRead;
  }

  get bookTitle() {
    return this.title;
  }
  get bookAuthor() {
    return this.author;
  }
  get numPages() {
    return this.pages;
  }
  get hasReadStatus() {
    return this.hasRead;
  }
  set hasReadStatus(value) {
    if (value === true) {
      this.hasRead = "Yes";
    } else {
      this.hasRead = "No";
    }
  }
  set isEditing(value) {
    this.isEditing = value;
  }
}

let myLibrary = [
  new Book("Harry Potter and The Sorcerer's Stone", "JK Rowling", 455, true),
  new Book("IT", "Stephen King", 677, false),
  new Book("Lord of The Rings", "Tolkien", 1000, false),
  new Book("Problem Solving in Code", "Unknown", 200, false),
];

class BookUI {
  
  constructor() {
    const addBookBtn = document.querySelector('.addBookBtn');
    addBookBtn.addEventListener('click', BookUI.addNewBook);
  }

  static displayBooks() {
    const bookList = document.querySelector("#book-list-table");
    const bookListFooter = document.querySelector("#table-footer");
    let bookReadCount = myLibrary.reduce((sum, book) => {
      if (book.hasRead === "Yes") {
        return sum + 1;
      } else {
        return sum;
      }
    }, 0);

    // create book table html
    let tableBody = bookList.querySelector("tbody");
    // Clear the table body if it is not empty
    if (tableBody.hasChildNodes()) {
      tableBody.innerHTML = "";
    }
    myLibrary.forEach((book) => {
      tableBody.innerHTML += BookUI.createBookTableRow(book);
    });
    bookListFooter.innerHTML = BookUI.createBookTableFooter(bookReadCount);

    // add event listener to books
    const booksEls = tableBody.querySelectorAll("tr");
    booksEls.forEach((bookEl) => {
      bookEl.addEventListener("click", (e) => BookUI.openEditBookDialog(e.target));
    });
  }

  static addNewBook() {
    // get DOM elements
    const addNewBookDialog = document.querySelector('.add-book-dialog');
    const addNewBookSubmit = document.querySelector('.add-book-dialog form');
    const closeDialogBtn = document.querySelector('.close-dialog');
    const allInputs = document.querySelectorAll('.add-book-dialog input');

    // create close event listener for dialog
    addNewBookDialog.showModal();
    closeDialogBtn.addEventListener('click', () => addNewBookDialog.close());

    // clear all inputs
    allInputs.forEach((input) => {
      input.value = '';
      input.checked = false;
    });

    // create and push book to myLibrary
    addNewBookSubmit.addEventListener('submit', (e) => {
      e.preventDefault();
      let bookTitle, bookAuthor, bookPages, bookHasRead;
      allInputs.forEach((input) => {
      if (input.id === 'new-title') {
        bookTitle = input.value;
      } else if (input.id === 'new-author') {
        bookAuthor = input.value;
      } else if (input.id === 'new-pages') {
        bookPages = parseInt(input.value);
      } else if (input.type === 'radio' && input.checked) {
        bookHasRead = input.value === 'yes';
      }
      });
      myLibrary.push(new Book(bookTitle, bookAuthor, bookPages, bookHasRead));
      addNewBookDialog.close();
      BookUI.displayBooks();
    });
  }

  static createBookTableRow(book) {
    return `
      <tr class="book-item" data-id=${book.id}>
        <td scope="col">${book.bookTitle}</td>
        <td scope="col">${book.bookAuthor}</td>
        <td scope="col">${book.numPages}</td>
        <td scope="col">${book.hasReadStatus}</td>
      </tr>
    `;
  }

  static createBookTableFooter(bookReadCount) {
    return `
      <tr>
        <th scope="row" colspan="3">
          Books Read
          <td>${((bookReadCount / myLibrary.length) * 100).toFixed(2)}%</td>
        </th>
      </tr>`;
  }

  static openEditBookDialog(bookToEdit) {
    const editBookDialog = document.querySelector(".edit-book-dialog");
    editBookDialog.showModal();
    const closeEditBookDialog = editBookDialog.querySelector(".close-dialog");
    const editForm = editBookDialog.querySelector("form");

    closeEditBookDialog.addEventListener("click", () => editBookDialog.close());

    // fill in dialog inputs
    let bookTitleInput = document.querySelector("input#title");
    let bookAuthorInput = document.querySelector("input#author");
    let bookPagesInput = document.querySelector("input#pages");
    let bookHasReadInput = document.querySelectorAll('input[type="radio"]');
    let bookHasRead = bookToEdit.parentElement.children[3].innerText;
    const bookId = bookToEdit.parentElement.getAttribute("data-id");
    // prefill inputs
    bookTitleInput.value = Array.from(bookToEdit.parentElement.children)[0].innerText;
    bookAuthorInput.value = Array.from(bookToEdit.parentElement.children)[1].innerText;
    bookPagesInput.value = Array.from(bookToEdit.parentElement.children)[2].innerText;
    bookHasReadInput.forEach((book) => {
      book.checked = false;
      if (book.value === bookHasRead.toLowerCase()) {
        book.checked = true;
      }
    });

    // create new book and replace in myLibrary array
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      editBookDialog.close();
      let bookHasReadInputValue = Array.from(bookHasReadInput).find((book) => book.checked);

      myLibrary = myLibrary.map((book, i) => {
        if (book && book.id == bookId) {
          return new Book(
            bookTitleInput.value,
            bookAuthorInput.value,
            parseInt(bookPagesInput.value),
            bookHasReadInputValue.value === "yes"
          );
        } else {
          return book;
        }
      });

      BookUI.displayBooks();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new BookUI();
  BookUI.displayBooks();
});
