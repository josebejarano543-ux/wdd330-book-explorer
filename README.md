# Book Explorer & Reading List

Book Explorer is my WDD 330 final project. It is a web application that allows users to search for books, view book details, and save books to a personal reading list.

## Live Site

https://jose-wdd330-book-explorer.netlify.app

## Features

- Search for books by title, author, subject, or all fields
- Display book covers, titles, authors, and publication years
- View additional book details
- Save books to a personal Reading List
- Remove books from the Reading List
- Store saved books using localStorage
- Display the number of saved books
- Display the number of search results
- Loading and error messages
- Responsive design for desktop and mobile

## APIs Used

### Open Library API

Used to search for books and retrieve:

- Title
- Author
- Publication year
- Cover image
- ISBN

### Google Books API

Used to retrieve additional book information such as:

- Description
- Publisher
- Publication date
- Page count
- Categories
- Book cover

## Technologies

- HTML
- CSS
- JavaScript
- Vite
- Open Library API
- Google Books API
- localStorage
- Git
- GitHub
- Netlify
- Trello

## Project Structure

```text
wdd330-book-explorer/
├── public/
├── src/
│   ├── js/
│   │   ├── BookData.js
│   │   ├── BookDetails.js
│   │   └── ReadingList.js
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
└── README.md