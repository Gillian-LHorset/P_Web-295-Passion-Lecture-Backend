/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import BooksController from '#controllers/books_controller'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/books', [BooksController, 'getAllBooks']).as('getAllBooks')

router.get('/book/:id', [BooksController, 'getBook']).as('getBook')

router.post('/add-book', [BooksController, 'createBook']).as('createBook')

router.delete('/delete-book/:id', [BooksController, 'deleteBook']).as('delete-book')
