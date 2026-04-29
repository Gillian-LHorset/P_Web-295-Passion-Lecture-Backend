import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
export default class extends BaseSeeder {
  async run() {
    const count = await User.query()
      .count('* as total')
      .then((res) => res[0].$extras.total)
    if (count === 0) {
      await User.createMany([
        {
          pseudo: 'Gilian',
          password: '67',
        },
        {
          pseudo: 'Oleksandr',
          password: '67',
        },
        {
          pseudo: 'Jamal',
          password: '67',
        },
      ])
    }
  }
}
