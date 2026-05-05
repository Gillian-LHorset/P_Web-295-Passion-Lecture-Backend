/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
const AuthController = () => import('#controllers/auth_controller')
const BooksController = () => import('#controllers/books_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import CategoriesController from '#controllers/categories_controller'
const AutorsController = () => import('#controllers/autors_controller')
router
  .group(() => {
    router.get('profile', async ({ auth }) => {
      return auth.user
    })
  })
  .use(middleware.auth({ guards: ['api'] }))

router
  .group(() => {
    router.get('dashboard', async ({ auth }) => {
      return `Hello ${auth.user?.pseudo}`
    })
  })
  .use(middleware.auth({ guards: ['web'] }))

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router.post('login/api', [AuthController, 'loginApi'])
router.post('register/api', [AuthController, 'registerApi'])
router.post('register/web', [AuthController, 'registerWeb'])

router.group(() => {
  router.get('/books', [BooksController, 'getAllBooks']).as('getAllBooks')

  router.get('/book/:id', [BooksController, 'getBook']).as('getBook')
  router.get('/get-books', [BooksController, 'getBooksByName']).as('getBooksByName')

  router.post('/add-book', [BooksController, 'createBook']).as('createBook')

  router.put('/put-book/:id', [BooksController, 'putBook'])
  router.patch('/patch-book/:id', [BooksController, 'patchBook'])

  router.delete('/delete-book/:id', [BooksController, 'deleteBook']).as('deleteBook')
})

router.group(() => {
  router.get('/autors', [AutorsController, 'getAllAutors'])
  router.get('/autor/:id', [AutorsController, 'getAutor'])
  router.get('/get-autors', [AutorsController, 'getAutorsByName']).as('getAutorsByName')

  router.post('/add-autor', [AutorsController, 'createAutor']).as('createAutor')

  router.put('/put-autor/:id', [AutorsController, 'putAutor'])
  router.patch('/patch-autor/:id', [AutorsController, 'patchAutor'])

  router.delete('/delete-autor/:id', [AutorsController, 'deleteAutor']).as('deleteAutor')
})

router.get('/get-categories', [CategoriesController, 'getCategorysByName']).as('getCategorysByName')
