import path from 'node:path'
import url from 'node:url'

export default {
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../',
  tagIndex: 2,
  info: {
    title: 'Passion Lecture API',
    version: '0.0.0',
    description:
      'API de gestion de livres - Authentification, catalogue de livres, auteurs et catégories',
    contact: {
      name: 'Support API',
      email: 'support@passionlecture.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3333',
      description: 'Serveur de développement',
    },
  ],
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'Bearer',
    },
  },
  defaultSecurityScheme: 'bearerAuth',
  snakeCase: true,
  ignore: ['/docs', '/swagger'],
  preferredPutPatch: 'PUT',
  common: {
    headers: [],
    parameters: [],
  },
}
