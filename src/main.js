import "./style.css";
import { searchBooks } from "./js/BookData.js";
import { getBookDetails } from "./js/BookDetails.js";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const bookResults = document.querySelector("#book-results");

const resultsSection = document.querySelector(".results-section");
const bookDetailsSection = document.querySelector("#book-details-section");
const bookDetails = document.querySelector("#book-details");
const closeDetails = document.querySelector("#close-details");

let currentBooks = [];

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    return;
  }

  bookResults.innerHTML = "<p>Loading books...</p>";

  try {
    const books = await searchBooks(searchTerm);

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

      const cover = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "https://placehold.co/180x260?text=No+Cover";

      return `
        <article class="book-card">
          <img src="${cover}" alt="Cover of ${title}">
          <h3>${title}</h3>
          <p>${author}</p>
          <p>${year}</p>

          <button class="details-button" data-index="${index}">
            View Details
          </button>
        </article>
      `;
    })
    .join("");
}

bookResults.addEventListener("click", async (event) => {
  if (!event.target.classList.contains("details-button")) {
    return;
  }

  const index = Number(event.target.dataset.index);
  const book = currentBooks[index];

  const title = book.title || "Unknown Title";
  const author = book.author_name?.[0] || "Unknown Author";
  const isbn = book.isbn?.[0] || null;

  bookDetails.innerHTML = "<p>Loading book details...</p>";

  resultsSection.classList.add("hidden");
  bookDetailsSection.classList.remove("hidden");

  try {
    const details = await getBookDetails(isbn, title, author);

    displayBookDetails(book, details);
  } catch (error) {
    console.error(error);

    bookDetails.innerHTML =
      "<p>Sorry, there was a problem loading the book details.</p>";
  }
});

function displayBookDetails(book, details) {
  const title = details?.title || book.title || "Unknown Title";
  const author =
    details?.authors?.join(", ") ||
    book.author_name?.[0] ||
    "Unknown Author";

  const description =
    details?.description || "No description available.";

  const publisher = details?.publisher || "Unknown publisher";
  const publishedDate =
    details?.publishedDate ||
    book.first_publish_year ||
    "Unknown date";

  const pageCount = details?.pageCount || "Unknown";
  const categories =
    details?.categories?.join(", ") || "No category available";

  const cover =
    details?.imageLinks?.thumbnail ||
    (book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      : "https://placehold.co/250x350?text=No+Cover");

  bookDetails.innerHTML = `
    <article class="details-card">
      <img src="${cover}" alt="Cover of ${title}">

      <div class="details-info">
        <h2>${title}</h2>
        <h3>${author}</h3>

        <p>${description}</p>

        <p><strong>Publisher:</strong> ${publisher}</p>
        <p><strong>Published:</strong> ${publishedDate}</p>
        <p><strong>Pages:</strong> ${pageCount}</p>
        <p><strong>Category:</strong> ${categories}</p>
      </div>
    </article>
  `;
}

closeDetails.addEventListener("click", () => {
  bookDetailsSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");
});