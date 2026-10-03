const BASE_URL = "https://openlibrary.org/search.json";

export async function searchBooks(query) {
  const url = `${BASE_URL}?q=${encodeURIComponent(query)}&limit=12`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("There was a problem getting the books.");
  }

  const data = await response.json();

  return data.docs;
}