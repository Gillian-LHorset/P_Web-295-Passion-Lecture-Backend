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
const CategoriesController = () => import('#controllers/categories_controller')
const AutorsController = () => import('#controllers/autors_controller')

import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

// Swagger documentation endpoint
router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

// Swagger UI endpoint
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

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
router.post('/api/login', [AuthController, 'loginApi'])
router.post('/api/register', [AuthController, 'registerApi'])
router.post('/api/logout', [AuthController, 'logoutApi'])
router.group(() => {
  router.get('/api/books', [BooksController, 'index']).as('books.index')

  router.get('/api/book/:id', [BooksController, 'show']).as('books.show')

  router.post('/api/book', [BooksController, 'store']).as('books.store')

  router.put('/api/book/:id', [BooksController, 'update']).as('books.updateComplete')
  router.patch('/api/book/:id', [BooksController, 'updatePartial']).as('books.updatePartial')

  router.delete('/api/book/:id', [BooksController, 'destroy']).as('books.destroy')
})

router.group(() => {
  router.get('/api/autors', [AutorsController, 'index']).as('autor.index')
  router.get('/api/autor/:id', [AutorsController, 'show']).as('autor.show')

  router.post('/api/autor', [AutorsController, 'store']).as('autor.store')

  router.put('/api/autor/:id', [AutorsController, 'update']).as('autor.updateComplet')
  router.patch('/api/autor/:id', [AutorsController, 'updatePartial']).as('autor.updatePartial')

  router.delete('/api/autor/:id', [AutorsController, 'destroy']).as('autor.destroy')
})

router.get('/api/categories', [CategoriesController, 'index']).as('category.index')
