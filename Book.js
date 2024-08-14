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
  id = Math.floor(Math.random() * 100);

  constructor(title, author, pages, hasRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.hasRead = hasRead;
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
    this.hasRead = value;
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
      if (book.hasRead) {
      return sum + 1;
      } else {
      return sum;
      }
    }, 0);

    myLibrary.forEach((book) => {
      let tableBody = bookList.querySelector("tbody");

      tableBody.innerHTML += `
        <tr>
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
  }
}

document.addEventListener("DOMContentLoaded", () => {
  BookUI.displayBooks();
});
