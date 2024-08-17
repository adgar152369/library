/**
 * class Book:
 *  public title;
 *  public author;
 *  public pages;
 *  public hasRead;
 *  public isEditing;
 *  private id;
 */

function Library() {
  this.books = [];
}

function Book(title, author, pages, hasRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.hasRead = hasRead ? true : false;
  this.isEditing = false;
  this.id = Math.random().toString(36).substr(2, 9)
}

// add methods to constructors
Library.prototype.addBook = function(book) {
  this.books.push(book);
}
Library.prototype.deleteBook = function(book) {
  const index = this.books.indexOf(book);
  if (index !== -1) {
    this.books.splice(index, 1);
  }
}

Library.prototype.getBooks = function() {
  return this.books;
}

Book.prototype.setIsEditing = function(value) {
  this.isEditing = value;
}

const loadUserLibrary = (() => {
  const myLibrary = new Library();
  
  const book1 = new Book("Harry Potter and the Sorcerer's Stone", 'JK Rowling', 200, true);
  const book2 = new Book("IT", 'Stephen King', 500, false);
  // add books to library
  myLibrary.addBook(book1);
  myLibrary.addBook(book2);

  // display the UI
  document.addEventListener("DOMContentLoaded", () => {
    displayBooks(myLibrary);

    const addBookBtn = document.querySelector('.add-book-btn');
    addBookBtn.addEventListener('click', () => openBookDialog(null, addBookBtn, myLibrary));
    // addBookBtn.removeEventListener('click', openBookDialog);
  });
})();

function displayBooks(library) {
  const bookTable = document.querySelector("#book-list-table tbody");
  // clear bookTable
  bookTable.innerHTML = "";

  // create book table elements for tbody
  for (let bookData of library.getBooks()) {
    const bookRow = document.createElement("tr");
    bookRow.classList.add("book-item");
    bookRow.setAttribute("data-id", bookData.id);

    const titleCell = document.createElement("td");
    titleCell.setAttribute("scope", "col");
    titleCell.textContent = bookData.title;
    bookRow.appendChild(titleCell);

    const authorCell = document.createElement("td");
    authorCell.setAttribute("scope", "col");
    authorCell.textContent = bookData.author;
    bookRow.appendChild(authorCell);

    const pagesCell = document.createElement("td");
    pagesCell.setAttribute("scope", "col");
    pagesCell.textContent = bookData.pages;
    bookRow.appendChild(pagesCell);

    const hasReadCell = document.createElement("td");
    hasReadCell.setAttribute("scope", "col");
    hasReadCell.textContent = bookData.hasRead ? "Yes" : "No";
    bookRow.appendChild(hasReadCell);

    bookTable.appendChild(bookRow);

    bookRow.addEventListener("click", openBookDialog.bind(bookData, bookData, bookRow, library));
  }

}

function openBookDialog(book, element, library) {
  // console.log(element)
  const bookDialog = document.querySelector('.book-dialog');
  const bookDialogHeader = document.querySelector('.book-dialog h3');
  const bookDialogClose = document.querySelector('.close-dialog');
  const bookDialogInputs = document.querySelectorAll('.book-dialog input:not([type="radio"])');
  const bookDialogRadios = document.querySelectorAll('.book-dialog input[type="radio"]');
  const bookDialogBtns = document.querySelector('.action-btns');
  const bookDialogContainer = document.querySelector('#dialog-container');

  // check if form element already exists, if so remove it
  const existingForm = bookDialogContainer.querySelector('form');
  if (existingForm) {
    existingForm.remove();
  }

  // create new form element
  const form = document.createElement('form');
  form.appendChild(bookDialog);
  bookDialogContainer.appendChild(form);
  
  // clear inputs
  bookDialogInputs.forEach((input) => {
    input.value = "";
    input.required = true;
  });
  
  form.removeEventListener('submit', submitNewBookForm)

  if (element.nodeName !== "BUTTON") {
    // set isEditing to true
    book.setIsEditing(true);
    
    bookDialogBtns.innerHTML = `
      <button>Save</button>
      <button class='deleteBookBtn'>Delete</button>
    `;
    bookDialogHeader.textContent = "Edit book";
    bookDialog.showModal();

    // pre-fill inputs
    bookDialogInputs.forEach((input, i) => {
      switch (input.id) {
        case "title":
          input.value = book.title;
          break;
        case "author":
          input.value = book.author;
          break;
        case "pages":
          input.value = book.pages;
          break;
        default:
          break;
      }
    });

    // check if deleteBookBtn exists
    const deleteBookBtn = document.querySelector('.deleteBookBtn');
    // const readStatusBtn = document.querySelector('.readStatusBtn');
    
    
    if (deleteBookBtn) {
      deleteBookBtn.addEventListener('click', (e) => {
        e.preventDefault();
        bookDialog.close();
        deleteBook(book, library);
      });
    }

    // TODO: save book
    // Close dialog without saving
    bookDialogClose.addEventListener('click', (e) => {
      e.preventDefault();
      book.setIsEditing(false);
      bookDialog.close();
      return;
    }, { once: true });
  }
  else {
    bookDialogHeader.textContent = "Add new book";
    bookDialogBtns.innerHTML = "<button type='submit'>Add Book</button>"
    bookDialog.showModal();    

  }
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitNewBookForm(book,library, bookDialogInputs, bookDialog), {once: true}
  });
  // set isEditing to false after modal closes:
  bookDialogClose.addEventListener('click', (e) => {
    e.preventDefault();
    bookDialog.close();
  });
}

function deleteBook(book, library) {
  library.deleteBook(book);
  displayBooks(library);
}

function submitNewBookForm(book, library, bookInputs, bookDialog) {
  console.log(book);


  
  const bookDialogRadioInputs = document.querySelectorAll('.book-dialog input[type="radio"]');
  const radioChecked = Array.from(bookDialogRadioInputs).find((radio) => radio.checked);

  if (book) {
    const existingBookIndex = library.getBooks().findIndex(existingBook => existingBook ? existingBook.id === book.id : null);
    if (existingBookIndex && existingBookIndex !== -1) {
      const updatedBooks = library.getBooks().map(existingBook => {
        if (existingBook.id === book.id) {
          return {
            ...existingBook,
            title: bookInputs[0].value,
            author: bookInputs[1].value,
            pages: parseInt(bookInputs[2].value),
            hasRead: radioChecked.value === "yes"
          };
        }
        return existingBook;
      });
      library.books = updatedBooks;
      displayBooks(library);
      bookDialog.close();
      return;
    }
  }


  // gather inputs and make new book when form submits
  const newBook = new Book (
    bookInputs[0].value, // title
    bookInputs[1].value, // author
    parseInt(bookInputs[2].value), // pages,
    radioChecked.value === "yes" // TODO: make dynamic
  );
  bookDialog.close();
  handleAddBook(newBook, library);
}

function handleAddBook(bookToAdd, library) {
  library.addBook(bookToAdd);
  displayBooks(library);
}

function handleReadStatus(book, library) {
  book.hasRead = !book.hasRead;
  console.log(book)
  displayBooks(library);
}