const GOOGLE_BOOKS_URL =
  "https://www.googleapis.com/books/v1/volumes";

const GOOGLE_BOOKS_API_KEY =
  import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

export async function getBookDetails(isbn, title, author) {
  let details = null;

  if (isbn) {
    details = await searchGoogleBooks(`isbn:${isbn}`);
  }

  if (!details) {
    details = await searchGoogleBooks(
      `intitle:${title} inauthor:${author}`
    );
  }

  return details;
}

async function searchGoogleBooks(query) {
  const params = new URLSearchParams({
    q: query,
    maxResults: "1",
  });

  if (GOOGLE_BOOKS_API_KEY) {
    params.set("key", GOOGLE_BOOKS_API_KEY);
  }

  const url = `${GOOGLE_BOOKS_URL}?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Google Books request failed: ${response.status}`
    );
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    return null;
  }

  return data.items[0].volumeInfo;
}