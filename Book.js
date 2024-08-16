class Book {
  constructor(title, author, pages, hasRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.hasRead = hasRead ? "Yes" : "No";
    this.id = Math.random().toString(36).substr(2, 9);
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
    this.addBookBtn = document.querySelector('.addBookBtn');
    this.addNewBookDialog = document.querySelector('.add-book-dialog');
    this.closeDialogBtn = document.querySelector('.close-dialog');
    this.allInputs = document.querySelectorAll('.add-book-dialog input');
    this.bookList = document.querySelector("#book-list-table");
    this.bookListFooter = document.querySelector("#table-footer");

    this.addBookBtn.addEventListener('click', this.addNewBook.bind(this));
    this.addNewBookDialog.querySelector('form').addEventListener('submit', this.handleNewBookSubmit.bind(this));
    this.closeDialogBtn.addEventListener('click', () => this.addNewBookDialog.close());

    document.addEventListener("DOMContentLoaded", () => {
      this.displayBooks();
    });
  }

  displayBooks() {
    const tableBody = this.bookList.querySelector("tbody");
    tableBody.innerHTML = ""; // Clear the table body

    let bookReadCount = 0;
    myLibrary.forEach((book) => {
      tableBody.innerHTML += this.createBookTableRow(book);
      if (book.hasRead === "Yes") bookReadCount++;
    });

    this.bookListFooter.innerHTML = this.createBookTableFooter(bookReadCount);

    // Use event delegation for book item clicks
    tableBody.addEventListener("click", (e) => {
      if (e.target.closest('.book-item')) {
        this.openEditBookDialog(e.target.closest('.book-item'));
      }
    });
  }

  addNewBook() {
    this.addNewBookDialog.showModal();
    this.allInputs.forEach((input) => {
      input.value = '';
      input.checked = false;
    });
  }

  handleNewBookSubmit(e) {
    e.preventDefault();

    let bookTitle, bookAuthor, bookPages, bookHasRead;
    this.allInputs.forEach((input) => {
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
    this.addNewBookDialog.close();
    this.displayBooks();
  }

  createBookTableRow(book) {
    return `
      <tr class="book-item" data-id=${book.id}>
        <td scope="col">${book.title}</td>
        <td scope="col">${book.author}</td>
        <td scope="col">${book.pages}</td>
        <td scope="col">${book.hasRead}</td>
      </tr>
    `;
  }

  createBookTableFooter(bookReadCount) {
    return `
      <tr>
        <th scope="row" colspan="3">
          Books Read
          <td>${((bookReadCount / myLibrary.length) * 100).toFixed(2)}%</td>
        </th>
      </tr>`;
  }

  openEditBookDialog(bookToEdit) {
    const editBookDialog = document.querySelector(".edit-book-dialog");
    editBookDialog.showModal();
    const closeEditBookDialog = editBookDialog.querySelector(".close-dialog");
    const editForm = editBookDialog.querySelector("form");

    closeEditBookDialog.addEventListener("click", () => editBookDialog.close());

    const bookTitleInput = document.querySelector("input#title");
    const bookAuthorInput = document.querySelector("input#author");
    const bookPagesInput = document.querySelector("input#pages");
    const bookHasReadInput = document.querySelectorAll('input[type="radio"]');
    const bookHasRead = bookToEdit.querySelector('td:nth-child(4)').innerText;
    const bookId = bookToEdit.getAttribute("data-id");

    bookTitleInput.value = bookToEdit.querySelector('td:nth-child(1)').innerText;
    bookAuthorInput.value = bookToEdit.querySelector('td:nth-child(2)').innerText;
    bookPagesInput.value = bookToEdit.querySelector('td:nth-child(3)').innerText;
    bookHasReadInput.forEach((input) => {
      input.checked = input.value === bookHasRead.toLowerCase();
    });

    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      editBookDialog.close();

      const bookHasReadInputValue = Array.from(bookHasReadInput).find((input) => input.checked).value;

      myLibrary = myLibrary.map((book) => {
        if (book.id === bookId) {
          return new Book(
            bookTitleInput.value,
            bookAuthorInput.value,
            parseInt(bookPagesInput.value),
            bookHasReadInputValue === "yes"
          );
        }
        return book;
      });

      this.displayBooks();
    });
  }
}

new BookUI();