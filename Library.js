export class Library {
  static books = [];

  static getBooks() {
    return Library.books;
  }

  static addBook(book) {
    const wordsToIgnore = ["the", "and", "of"];
    const titleWords = book.title.toLowerCase().split(" ");
    const capitalizedTitleWords = titleWords.map((word, index) => {
      if (index === 0 || !wordsToIgnore.includes(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
      return word;
      }
    });
    const capitalizedTitle = capitalizedTitleWords.join(" ");
    book.title = capitalizedTitle;

    const authorWords = book.author.toLowerCase().split(" ");
    const capitalizedAuthorWords = authorWords.map((word, index) => {
      if (index === 0 || !wordsToIgnore.includes(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
      return word;
      }
    });
    const capitalizedAuthor = capitalizedAuthorWords.join(" ");
    book.author = capitalizedAuthor;
    Library.books.push(book);
  }

  static deleteBook(book) {
    console.log(Library.getBooks())
    const index = Library.getBooks().indexOf(book);
    if (index !== -1) {
      Library.books.splice(index, 1);
    }
  }

  static setBooks(book) {
    const updatedBooks = Library.getBooks().map((existingBook) => {
      if (existingBook._id === book._id) {
        existingBook._title = book._title;
        existingBook._author = book._author;
        existingBook._pages = book._pages;
        existingBook._hasRead = book._hasRead;
      }
      return existingBook;
    });
    Library.books = updatedBooks;
  }
}

export class Book {
  constructor(title, author, pages, hasRead) {
    this._title = title;
    this._author = author;
    this._pages = pages;
    this._hasRead = Boolean(hasRead);
    this._isEditing = false;
    this._id = Math.random().toString(36).substr(2, 9);
  }

  get title() {
    return this._title;
  }
  get author() {
    return this._author;
  }
  get pages() {
    return this._pages;
  }
  get hasRead() {
    return this._hasRead;
  }
  get isEditing() {
    return this._isEditing;
  }
  get id() {
    return this._id;
  }
  set title(value) {
    this._title = value;
  }
  set author(value) {
    this._author = value;
  }
  set pages(value) {
    this._pages = value;
  }
  set hasRead(value) {
    this._hasRead = Boolean(value);
  }
  set isEditing(value) {
    this._isEditing = Boolean(value);
  }
}
