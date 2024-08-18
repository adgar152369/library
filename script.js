import { Library, Book } from "./Library.js";

// load user library
(() => {
  // display the UI
  document.addEventListener("DOMContentLoaded", () => {
    const addBookBtn = document.querySelector('.add-book-btn');
    addBookBtn.addEventListener('click', () => openBookDialog(null, addBookBtn));
    
    const testBook = new Book('The Hobbit', 'Tolkien', 300, true);
    const testBook2 = new Book('The Hobbit', 'Tolkien', 300, false);
    const testBook3 = new Book('Game of Rizz Gods', 'Dennis', 1000, true);
    Library.addBook(testBook);
    Library.addBook(testBook2);
    Library.addBook(testBook3);
    
    displayBooks();
  });
})();

function displayBooks() {
  const bookTable = document.querySelector("#book-list-table tbody");
  // clear bookTable
  bookTable.innerHTML = "";

  // create book table elements for tbody
  for (let bookData of Library.getBooks()) {    
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

    bookRow.addEventListener("click", openBookDialog.bind(bookData, bookData, bookRow));
  }
}

function createNewForm(parent, child) {
  // check if form element already exists, if so remove it
  const existingForm = parent.querySelector('form');
  if (existingForm) existingForm.remove();

  const form = document.createElement('form');
  parent.appendChild(form);
  form.appendChild(child);
  return form;
}

function createDialogBtns(btnTypes) {
  const bookDialogBtns = document.querySelector('.action-btns');

  // Check if buttons already exist
  const existingButtons = bookDialogBtns.querySelectorAll('button');
  if (existingButtons.length > 0) existingButtons.forEach(button => button.remove());

  for (let i = 0; i < btnTypes.length; i++) {
    const newBtn = document.createElement('button');
    newBtn.type = 'submit';
    newBtn.textContent = btnTypes[i].replace('-btn', '');
    newBtn.setAttribute('data-action', btnTypes[i].replace('-btn', ''))
    newBtn.classList.add(btnTypes[i]);
    bookDialogBtns.appendChild(newBtn);
  }

  return bookDialogBtns;
}

function openBookDialog(book, element) {  
  const bookDialog = document.querySelector('.book-dialog');
  const bookDialogHeader = document.querySelector('.book-dialog h3');
  const bookDialogClose = document.querySelector('.close-dialog');
  const bookDialogInputs = document.querySelectorAll('.book-dialog input:not([type="radio"])');
  const bookDialogRadioInputs = document.querySelectorAll('.book-dialog input[type="radio"]');
  const bookDialogContainer = document.querySelector('#dialog-container');

  // create new form element
  const newForm = createNewForm(bookDialogContainer, bookDialog)
  
  // clear inputs
  bookDialogInputs.forEach((input) => {
    input.value = "";
    input.required = true;
  });
  
  if (book && element.nodeName !== "BUTTON") {    
    // set isEditing to true
    book.isEditing = true;
    // create dialog btns based off event trigger
    const dialogBtns = createDialogBtns(['save-btn', 'delete-btn']);    
    
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
    // pre-fill radio inputs
    bookDialogRadioInputs.forEach((radio) => {
      if (book.hasRead && radio.value === 'yes') {
        radio.checked = true;
      } else if (!book.hasRead && radio.value === 'no') {
        radio.checked = true;
      }
    });

  }
  else {
    const addBtn = createDialogBtns(['add-btn']);
    bookDialogHeader.textContent = "Add new book";
    bookDialog.showModal();    
  }

  // add event listener to form submit
  newForm.addEventListener('submit', (e) => {
    e.preventDefault();    
    const actions = newForm.querySelectorAll('button[type="submit"]');
    // get btn that submitted the event on click
    const clickedButton = e.submitter;

    actions.forEach((action) => {
      const dataAction = action.getAttribute('data-action');
      if (action === clickedButton) {
        if (dataAction === 'save') {
          saveBook(book, bookDialogInputs, bookDialogRadioInputs, bookDialog);
        } else if (dataAction === 'delete') {
          console.log(action);
          // handle delete action
        } else if (dataAction === 'add') {
          addBook(bookDialogInputs, bookDialogRadioInputs, bookDialog)
        }
      }
    });
  });

  // Close dialog without saving
  bookDialogClose.addEventListener('click', (e) => {
    e.preventDefault();
    if (book) book.isEditing = false;
    bookDialog.close();
    return;
  }, { once: true });
  
  // newForm.addEventListener('submit', (e) => {
  //   e.preventDefault();
  //   submitNewBookForm(book, bookDialogInputs, bookDialog), {once: true}
  // });
  // // set isEditing to false after modal closes:
  // bookDialogClose.addEventListener('click', (e) => {
  //   e.preventDefault();
  //   bookDialog.close();
  // });
}
function saveBook(book, inputs, radios, bookDialog) {  
  const radioChecked = Array.from(radios).find((radio) => radio.checked);
  const updatedBooks = Library.getBooks().map((existingBook) => {
    if (existingBook.id === book.id) {
      existingBook.title = inputs[0].value;
      existingBook.author = inputs[1].value;
      existingBook.pages = parseInt(inputs[2].value);
      existingBook.hasRead = radioChecked.value === "yes";
    }
    return existingBook;
  });
  Library.setBooks(updatedBooks); // Update the library with the updated books
  displayBooks(); // Refresh the display of books
  bookDialog.close(); // Close the book dialog
}

function addBook(inputs, radios, bookDialog) {
  const radioChecked = Array.from(radios).find((radio) => radio.checked);
  // gather inputs and make new book when form submits
  const newBook = new Book (
    inputs[0].value, // title
    inputs[1].value, // author
    parseInt(inputs[2].value), // pages,
    radioChecked.value === "yes" // TODO: make dynamic
  );
  bookDialog.close();
  Library.addBook(newBook);
  displayBooks(Library.getBooks());
}