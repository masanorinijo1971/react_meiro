import Sequelize from 'sequelize'

process.on = function () { }
global.Buffer = { isBuffer: () => { return false } }

if (!Error.captureStackTrace) {
    Error.captureStackTrace = () => { }
}
const sequelize = new Sequelize(
    'database', '', '', {
    dialect: 'sqlite',
    storage: 'main.db',
    logging: () => { }
}
)

export { sequelize }