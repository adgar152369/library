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
      tableBody.innerHTML += `
        <tr class="book-item" data-id=${book.id}>
          <td scope="col">${book.title}</td>
          <td scope="col">${book.author}</td>
          <td scope="col">${book.pages}</td>
          <td scope="col">${book.hasRead}</td>
        </tr>
      `;
    });
    bookListFooter.innerHTML = `
      <tr>
        <th scope="row" colspan="3">
          Books Read
          <td>${((bookReadCount / myLibrary.length) * 100).toFixed(2)}%</td>
        </th>
      </tr>`;

    // add event listener to books
    const booksEls = tableBody.querySelectorAll("tr");
    booksEls.forEach((bookEl) => {
      bookEl.addEventListener("click", (e) => BookUI.editBook(e));
    });
  }

  static editBook(e) {
    BookUI.openEditBookDialog(e.target);
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
  BookUI.displayBooks();
});
