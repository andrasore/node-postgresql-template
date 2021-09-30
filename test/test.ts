import { Sequelize, DataTypes } from 'sequelize'
import assert from 'assert'
import { UrlToIdConverter } from '../src/UrlToIdConverter'

async function sequelizeTests (sequelize: Sequelize): Promise<void> {
  await sequelize.authenticate()

  const User = sequelize.define('User', {
    // Model attributes are defined here
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING
      // allowNull defaults to true
    }
  }, {
    // Other model options go here
  })

  await User.sync({ force: true })

  await User.create({ firstName: 'foo', lastName: 'bar' })
}

describe('tests', function () {
  it('sequelize should work with sqlite', async function () {
    const sequelize = new Sequelize('sqlite::memory')
    await sequelizeTests(sequelize)
  })

  it('sequelize should work with postgres', async function () {
    const sequelize = new Sequelize('postgres://user:pass@db:5432/test')
    await sequelizeTests(sequelize)
  })
})

describe.only('URL Shortener', function () {
  it('Should return the hexadecimal representation for an id', async function () {
    const converter = new UrlToIdConverter('http://foo.bar')

    const result = converter.idToUrl(16)

    assert.deepStrictEqual(result.href, 'http://foo.bar/00000010')
  })

  it('Should return the id for a shortened url', async function () {
    const converter = new UrlToIdConverter('http://foo.bar')

    const result = converter.urlToId(new URL('http://foo.bar/00000010'))

    assert.deepStrictEqual(result, 16)
  })

  it('Should throw for too large shortened url', async function () {
    const converter = new UrlToIdConverter('http://foo.bar')

    assert.throws(() => converter.urlToId(new URL('http://foo.bar/FFFFFFFFF')), RangeError)
  })
})
