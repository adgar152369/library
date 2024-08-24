import { Library, Book } from "./Library.js";

// load user library
(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const addBookBtn = document.querySelector('.add-book-btn');
    const sortBySelect = document.querySelector('.sort-btns select');

    const book1 = new Book('harry potter', 'jk rowling', 300, true);
    const book2 = new Book('the lord of the rings', 'tolkien', 1000, false);
    const book3 = new Book('game of rizz gods', 'dennis smith', 20, false);
    Library.addBook(book1)
    Library.addBook(book2)
    Library.addBook(book3)

    addBookBtn.addEventListener('click', () => openBookDialog(null, addBookBtn));
    sortBySelect.addEventListener('change', (e) => sortBy(e));

    displayBooks();
  });
})();

function displayBooks() {
  const bookTable = document.querySelector("#book-list-table tbody");
  let emptyTableHeader = document.querySelector('body .empty-table-header');
  bookTable.innerHTML = "";

  if (emptyTableHeader) emptyTableHeader.remove();

  if (Library.getBooks().length !== 0) {
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
  } else {
    emptyTableHeader = document.createElement('h4');
    emptyTableHeader.textContent = "You don't have any books yet!";
    emptyTableHeader.classList.add("empty-table-header");
    document.body.appendChild(emptyTableHeader);
  }
}


/**
 * Creates a new form element inside the parent element and appends the child element to it.
 * 
 * @param {HTMLElement} parent - The parent element where the form will be created.
 * @param {HTMLElement} child - The child element to be appended to the form.
 * @returns {HTMLElement} - The newly created form element.
 */
function createNewForm(parent, child) {
  const existingForm = parent.querySelector('form');
  if (existingForm) existingForm.remove();

  const form = document.createElement('form');
  parent.appendChild(form);
  form.appendChild(child);
  return form;
}

/**
 * Creates new button(s) inside parent
 * 
 * @param {string[]} btnTypes - array of strings that describe the action of a button(s)
 * @returns {HTMLButtonElement} - new button(s) w/ data-action attr
 */
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
  const bookDialogInputs = document.querySelectorAll('.book-dialog input')
  const bookDialogContainer = document.querySelector('#dialog-container');

  const newForm = createNewForm(bookDialogContainer, bookDialog)

  // clear inputs
  bookDialogInputs.forEach((input) => {
    if (input.type === "radio") input.checked = false;
    else input.value = "";
    input.required = true;
  });

  if (book && element.nodeName !== "BUTTON") {
    book.isEditing = true;
    const dialogBtns = createDialogBtns(['save-btn', 'delete-btn']); // keep 

    bookDialogHeader.textContent = "Edit book";
    bookDialog.showModal();

    // pre-fill inputs
    bookDialogInputs.forEach((input) => {
      if (book.hasRead && input.value === 'yes') {
        input.checked = true;
      } else if (!book.hasRead && input.value === 'no') {
        input.checked = true;
      }

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
  } else {
    const addBtn = createDialogBtns(['add-btn']);
    bookDialogHeader.textContent = "Add new book";
    bookDialog.showModal();
  }

  newForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const clickedButton = e.submitter;
    submitForm(
      book,
      bookDialogInputs,
      bookDialog,
      clickedButton);
  });

  bookDialogClose.addEventListener('click', (e) => {
    e.preventDefault();
    if (book) book.isEditing = false;
    bookDialog.close();
    return;
  }, { once: true });
}

function submitForm(book, inputs, dialog, btn) {
  const actions = document.querySelectorAll('form button[type="submit"]');

  actions.forEach((action) => {
    const dataAction = action.getAttribute('data-action');

    if (action === btn) {
      if (dataAction === 'save') {
        updateBook(book, inputs, dialog);
      } else if (dataAction === 'delete') {
        deleteBook(book);
      } else if (dataAction === 'add') {
        addBook(inputs, dialog)
      }
    }
  });
  displayBooks();
}

function deleteBook(book) {
  const isCancel = window.confirm(`Are you sure you want to delete this book? \n "${book.title}"`);
  if (isCancel) {
    Library.deleteBook(book);
    document.querySelector('dialog').close();
    displayBooks();
  }
  return;
}

function updateBook(book, inputs, bookDialog) {
  const updatedBooks = Library.getBooks().map((existingBook) => {
    if (existingBook.id === book.id) {
      existingBook.title = inputs[0].value;
      existingBook.author = inputs[1].value;
      existingBook.pages = parseInt(inputs[2].value);
      existingBook.hasRead = inputs[3].checked === true;
    }
    return existingBook;
  });
  Library.setBooks(updatedBooks);
  bookDialog.close();
}

function addBook(inputs, bookDialog) {
  // gather inputs and make new book when form submits
  const newBook = new Book(
    inputs[0].value, // title
    inputs[1].value, // author
    parseInt(inputs[2].value), // pages,
    inputs[3].checked === true,
  );
  bookDialog.close();
  Library.addBook(newBook);
}

const sortBy = (e) => {
  if (e.target.value === 'title') Library.sortByTitle()
  else if (e.target.value === 'author') Library.sortByAuthor()
  else if (e.target.value === 'pages-highest') sortByPagesHighest(e);
  else if (e.target.value === 'pages-lowest') sortByPagesLowest(e);
  else if (e.target.value === 'has-read') sortByHasRead(e);
  else if (e.target.value === 'has-not-read') sortByHasNotRead(e);
  displayBooks();
}