import "./style.css";
import { searchBooks } from "./js/BookData.js";
import { getBookDetails } from "./js/BookDetails.js";
import {
  getReadingList,
  saveBook,
  removeBook,
  isBookSaved,
} from "./js/ReadingList.js";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchType = document.querySelector("#search-type");
const bookResults = document.querySelector("#book-results");

const heroSection = document.querySelector(".hero");
const resultsSection = document.querySelector(".results-section");

const bookDetailsSection = document.querySelector("#book-details-section");
const bookDetails = document.querySelector("#book-details");
const closeDetails = document.querySelector("#close-details");

const readingListLink = document.querySelector("#reading-list-link");
const readingListSection = document.querySelector("#reading-list-section");
const readingListContainer = document.querySelector("#reading-list");
const closeReadingList = document.querySelector("#close-reading-list");

let currentBooks = [];

function getBookCover(book, size = "M") {
  if (book.cover_i) {
    return `https://covers.openlibrary.org/b/id/${book.cover_i}-${size}.jpg`;
  }

  if (book.isbn?.[0]) {
    return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-${size}.jpg`;
  }

  return "https://placehold.co/180x260?text=No+Cover";
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    return;
  }

  bookResults.innerHTML = "<p>Loading books...</p>";

  try {
    const books = await searchBooks(searchTerm, searchType.value);

    currentBooks = books;

    displayBooks(books);
  } catch (error) {
    console.error(error);

    bookResults.innerHTML =
      "<p>Sorry, there was a problem loading the books.</p>";
  }
});

function displayBooks(books) {
  if (books.length === 0) {
    bookResults.innerHTML = "<p>No books found.</p>";
    return;
  }

  bookResults.innerHTML = books
    .map((book, index) => {
      const title = book.title || "Unknown Title";
      const author = book.author_name?.[0] || "Unknown Author";
      const year = book.first_publish_year || "Unknown Year";

      const cover = getBookCover(book);

      const saved = isBookSaved(book.key);

      return `
        <article class="book-card">
          <img
            src="${cover}"
            alt="Cover of ${title}"
            onerror="this.src='https://placehold.co/180x260?text=No+Cover'"
          >

          <h3>${title}</h3>

          <p>${author}</p>

          <p>${year}</p>

          <button
            class="details-button"
            data-action="details"
            data-index="${index}"
          >
            View Details
          </button>

          <button
            class="save-button"
            data-action="save"
            data-index="${index}"
            ${saved ? "disabled" : ""}
          >
            ${saved ? "Saved ✓" : "Add to Reading List"}
          </button>
        </article>
      `;
    })
    .join("");
}

bookResults.addEventListener("click", async (event) => {
  const action = event.target.dataset.action;

  if (!action) {
    return;
  }

  const index = Number(event.target.dataset.index);
  const book = currentBooks[index];

  if (!book) {
    return;
  }

  if (action === "save") {
    const saved = saveBook(book);

    if (saved) {
      event.target.textContent = "Saved ✓";
      event.target.disabled = true;
    }

    return;
  }

  if (action === "details") {
    await showBookDetails(book);
  }
});

async function showBookDetails(book) {
  const title = book.title || "Unknown Title";
  const author = book.author_name?.[0] || "Unknown Author";
  const isbn = book.isbn?.[0] || null;

  bookDetails.innerHTML = "<p>Loading book details...</p>";

  heroSection.classList.add("hidden");
  resultsSection.classList.add("hidden");
  readingListSection.classList.add("hidden");
  bookDetailsSection.classList.remove("hidden");

  try {
    const details = await getBookDetails(isbn, title, author);

    displayBookDetails(book, details);
  } catch (error) {
    console.error(error);

    const cover = getBookCover(book, "L");

    bookDetails.innerHTML = `
      <article class="details-card">
        <img
          src="${cover}"
          alt="Cover of ${title}"
          onerror="this.src='https://placehold.co/250x350?text=No+Cover'"
        >

        <div class="details-info">
          <h2>${title}</h2>
          <h3>${author}</h3>

          <p>Extra details are not available right now.</p>

          <p>
            <strong>Published:</strong>
            ${book.first_publish_year || "Unknown date"}
          </p>
        </div>
      </article>
    `;
  }
}

function displayBookDetails(book, details) {
  const title =
    details?.title ||
    book.title ||
    "Unknown Title";

  const author =
    details?.authors?.join(", ") ||
    book.author_name?.[0] ||
    "Unknown Author";

  const description =
    details?.description ||
    "No description available.";

  const publisher =
    details?.publisher ||
    "Unknown publisher";

  const publishedDate =
    details?.publishedDate ||
    book.first_publish_year ||
    "Unknown date";

  const pageCount =
    details?.pageCount ||
    "Unknown";

  const categories =
    details?.categories?.join(", ") ||
    book.subject?.slice(0, 3).join(", ") ||
    "No category available";

  const cover =
    details?.imageLinks?.thumbnail ||
    getBookCover(book, "L");

  bookDetails.innerHTML = `
    <article class="details-card">
      <img
        src="${cover}"
        alt="Cover of ${title}"
        onerror="this.src='https://placehold.co/250x350?text=No+Cover'"
      >

      <div class="details-info">
        <h2>${title}</h2>
        <h3>${author}</h3>

        <p>${description}</p>

        <p>
          <strong>Publisher:</strong>
          ${publisher}
        </p>

        <p>
          <strong>Published:</strong>
          ${publishedDate}
        </p>

        <p>
          <strong>Pages:</strong>
          ${pageCount}
        </p>

        <p>
          <strong>Category:</strong>
          ${categories}
        </p>
      </div>
    </article>
  `;
}

closeDetails.addEventListener("click", () => {
  bookDetailsSection.classList.add("hidden");
  readingListSection.classList.add("hidden");

  heroSection.classList.remove("hidden");
  resultsSection.classList.remove("hidden");
});

readingListLink.addEventListener("click", (event) => {
  event.preventDefault();

  heroSection.classList.add("hidden");
  resultsSection.classList.add("hidden");
  bookDetailsSection.classList.add("hidden");

  readingListSection.classList.remove("hidden");

  displayReadingList();
});

function displayReadingList() {
  const books = getReadingList();

  if (books.length === 0) {
    readingListContainer.innerHTML =
      "<p>Your reading list is empty.</p>";

    return;
  }

  readingListContainer.innerHTML = books
    .map((book) => {
      const title = book.title || "Unknown Title";
      const author = book.author_name?.[0] || "Unknown Author";
      const year = book.first_publish_year || "Unknown Year";

      const cover = getBookCover(book);

      return `
        <article class="book-card">
          <img
            src="${cover}"
            alt="Cover of ${title}"
            onerror="this.src='https://placehold.co/180x260?text=No+Cover'"
          >

          <h3>${title}</h3>

          <p>${author}</p>

          <p>${year}</p>

          <button
            class="remove-button"
            data-key="${book.key}"
          >
            Remove
          </button>
        </article>
      `;
    })
    .join("");
}

readingListContainer.addEventListener("click", (event) => {
  if (!event.target.classList.contains("remove-button")) {
    return;
  }

  const bookKey = event.target.dataset.key;

  removeBook(bookKey);

  displayReadingList();
});

closeReadingList.addEventListener("click", () => {
  readingListSection.classList.add("hidden");
  bookDetailsSection.classList.add("hidden");

  heroSection.classList.remove("hidden");
  resultsSection.classList.remove("hidden");

  if (currentBooks.length > 0) {
    displayBooks(currentBooks);
  }
});