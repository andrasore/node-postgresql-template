import { Sequelize, DataTypes, Optional } from 'sequelize'

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
