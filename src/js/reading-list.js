const STORAGE_KEY = "bookExplorerReadingList";

export function getReadingList() {
  const savedBooks = localStorage.getItem(STORAGE_KEY);

  return savedBooks ? JSON.parse(savedBooks) : [];
}

export function saveBook(book) {
  const readingList = getReadingList();

  const alreadySaved = readingList.some(
    (savedBook) => savedBook.key === book.key,
  );

  if (alreadySaved) {
    return false;
  }

  readingList.push(book);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(readingList));

  return true;
}

export function removeBook(bookKey) {
  const readingList = getReadingList();

  const updatedList = readingList.filter(
    (book) => book.key !== bookKey,
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
}

export function isBookSaved(bookKey) {
  const readingList = getReadingList();

  return readingList.some((book) => book.key === bookKey);
}