import { Sequelize, DataTypes, ModelCtor } from 'sequelize'
import { ShortUrl } from './ShortUrl'

export class Database {
  constructor (dbUrl: string, useSqlite = false) {
    this.dbUrl = dbUrl
    this.useSqlite = useSqlite
  }

  private readonly useSqlite: boolean
  private readonly dbUrl: string
  private ShortUrl!: ModelCtor<any>

  async init (): Promise<void> {
    const sequelize = this.useSqlite
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

    this.ShortUrl = ShortUrl
  }

  async tryGetByUrl (url: string): Promise<ShortUrl | null> {
    return await this.ShortUrl.findOne({ where: { longUrl: url } })
  }

  async tryGetByShortUrl (shortUrl: string): Promise<ShortUrl | null> {
    return await this.ShortUrl.findOne({ where: { shortUrl: shortUrl } })
  }

  async insertUrl (url: string): Promise<string> {
    const result = await this.ShortUrl.create({ longUrl: url })
    return result.id
  }

  async updateUrl (id: string, shortUrl: string): Promise<void> {
    const result = await this.ShortUrl.findByPk(id)
    result.shortUrl = shortUrl
    await result.save()
  }
}
