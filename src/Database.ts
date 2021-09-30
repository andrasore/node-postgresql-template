import { Sequelize, DataTypes } from 'sequelize'

const USE_SQLITE = process.env.USE_SQLITE === 'true'

export class Database {
  constructor (dbUrl: string) {
    this.dbUrl = dbUrl
  }

  async init (): Promise<void> {
    const sequelize = USE_SQLITE
      ? new Sequelize('sqlite::memory')
      : new Sequelize(this.dbUrl)

    await sequelize.authenticate()

    const ShortUrl = sequelize.define('ShortUrl', {
      longUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      shortUrl: {
        type: DataTypes.STRING
      }
    })

    await ShortUrl.sync({ force: true })
  }

  private readonly dbUrl: string

  async tryGetIdByUrl (url: string): Promise<number | null> {

  }

  async insertUrl (url: string): Promise<number> {

  }

  async updateUrl (id: number, shortUrl: string): Promise<void> {

  }
}
