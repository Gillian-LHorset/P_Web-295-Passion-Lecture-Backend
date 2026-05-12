# Passion Lecture Backend - API Test Reference

## Authentication

### Register
**POST** `/api/register`
```json
{
  "pseudo": "testuser",
  "email": "test@example.com",
  "password": "Password123"
}
```

### Login
**POST** `/api/login`
```json
{
  "pseudo": "testuser",
  "password": "Password123"
}
```

### Logout
**POST** `/api/logout`
Header: `Authorization: Bearer {token}`

---

## Authors

### Get All Authors
**GET** `/api/autors`

### Get Authors (filter by name)
**GET** `/api/autors?nom=SearchTerm`

### Get Single Author
**GET** `/api/autor/{id}`

### Create Author
**POST** `/api/autor`
```json
{
  "nom": "Dupont",
  "prenom": "Jean"
}
```

### Update Author (Full)
**PUT** `/api/autor/{id}`
Header: `Authorization: Bearer {token}`
```json
{
  "nom": "Martin",
  "prenom": "Pierre"
}
```

### Update Author (Partial)
**PATCH** `/api/autor/{id}`
Header: `Authorization: Bearer {token}`
```json
{
  "nom": "UpdatedName"
}
```

### Delete Author
**DELETE** `/api/autor/{id}`
Header: `Authorization: Bearer {token}`

---

## Books

### Get All Books
**GET** `/api/books`

### Get Books (filter by title)
**GET** `/api/books?titre=SearchTerm`

### Get Single Book
**GET** `/api/book/{id}`

### Create Book
**POST** `/api/book`
Header: `Authorization: Bearer {token}`
```json
{
  "titre": "Book Title",
  "anneeEdition": 2024,
  "nombrePages": 300,
  "extrait": "Sample excerpt",
  "resume": "Book summary",
  "nomEditeur": "Publisher Name",
  "idUtilisateur": 1,
  "idCategorie": 1,
  "idAuteur": 1
}
```

### Update Book (Full)
**PUT** `/api/book/{id}`
Header: `Authorization: Bearer {token}`
```json
{
  "titre": "Updated Title",
  "anneeEdition": 2024,
  "nombrePages": 300,
  "extrait": "Updated excerpt",
  "resume": "Updated summary",
  "nomEditeur": "Publisher",
  "idUtilisateur": 1,
  "idCategorie": 1,
  "idAuteur": 1
}
```

### Update Book (Partial)
**PATCH** `/api/book/{id}`
```json
{
  "titre": "New Title"
}
```

### Delete Book
**DELETE** `/api/book/{id}`
Header: `Authorization: Bearer {token}`

---

## Categories

### Get All Categories
**GET** `/api/categories`

### Get Categories (filter by name)
**GET** `/api/categories?nom=SearchTerm`

---

## Protected Routes

### Get User Profile
**GET** `/profile`
Header: `Authorization: Bearer {token}`

### Get Dashboard
**GET** `/dashboard`
Header: `Authorization: Bearer {token}` (web guard)

---

## Base URL
`http://localhost:3333`
