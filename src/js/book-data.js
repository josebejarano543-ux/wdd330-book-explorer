const BASE_URL = "https://openlibrary.org/search.json";

export async function searchBooks(query, type = "all") {
  const params = new URLSearchParams();

  if (type === "title") {
    params.set("title", query);
  } else if (type === "author") {
    params.set("author", query);
  } else if (type === "subject") {
    params.set("subject", query);
  } else {
    params.set("q", query);
  }

  // Ask for more results so we can remove books without covers
  params.set("limit", "30");

  const url = `${BASE_URL}?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("There was a problem getting the books.");
  }

  const data = await response.json();

  // Only keep books that have a real cover
  const booksWithCovers = data.docs.filter((book) => book.cover_i);

  // Display a maximum of 12 books
  return booksWithCovers.slice(0, 12);
}