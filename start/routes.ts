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
router.get('/books', [BooksController, 'getAllBooks']).as('getAllBooks')

router.get('/book/:id', [BooksController, 'getBook']).as('getBook')

router.post('/add-book', [BooksController, 'createBook']).as('createBook')

router.delete('/delete-book/:id', [BooksController, 'deleteBook']).as('delete-book')
