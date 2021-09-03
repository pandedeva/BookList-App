// Book Class: Represents a Book
class Book {
  constructor(judul, penulis, kb) {
    this.judul = judul;
    this.penulis = penulis;
    this.kb = kb;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    // membuat tabel di booklist
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.judul}</td>
      <td>${book.penulis}</td>
      <td>${book.kb}</td>
      <td><a href="#" class="btn btn-danger btn-sm hapus">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("hapus")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    // tambahkan element pada sesudah form, dan div itu parent elementnya
    container.insertBefore(div, form);

    // Vanish in 2 seconds
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }

  static clearFields() {
    document.querySelector("#judul").value = "";
    document.querySelector("#penulis").value = "";
    document.querySelector("#kb").value = "";
  }
}
// memunculkan buku di tabel list, atau menghapus, atau memunculkan alert.

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(kb) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.kb === kb) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const judul = document.querySelector("#judul").value;
  const penulis = document.querySelector("#penulis").value;
  const kb = document.querySelector("#kb").value;

  // Validate
  if (judul === "" || penulis === "" || kb === "") {
    UI.showAlert("Tolong Lengkapi Semua Kolom", "danger");
  } else {
    // Instatiate book
    const book = new Book(judul, penulis, kb);

    // Add Book to UI
    UI.addBookToList(book);

    // Add book to store
    Store.addBook(book);

    // Show success message
    UI.showAlert("Buku Berhasil Ditambahkan", "success");

    // Clear fields
    UI.clearFields();
  }
});

// Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", (e) => {
  // Remove book from UI
  UI.deleteBook(e.target);

  // Remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show success message
  UI.showAlert("Buku Berhasil Dihapus", "warning");
});
