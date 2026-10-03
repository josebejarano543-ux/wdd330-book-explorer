const GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes";

export async function getBookDetails(isbn, title, author) {
  let query;

  if (isbn) {
    query = `isbn:${isbn}`;
  } else {
    query = `intitle:${title} inauthor:${author}`;
  }

  const url = `${GOOGLE_BOOKS_URL}?q=${encodeURIComponent(query)}&maxResults=1`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("There was a problem getting the book details.");
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    return null;
  }

  return data.items[0].volumeInfo;
}
