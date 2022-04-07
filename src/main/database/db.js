const fs = require("fs")
const path = require("path")
const Sequelize = require("sequelize")
const initModel = require("./initModel")
const { config, modelPath } = require("./config")

const db = {}

const sequelize = new Sequelize(config.database, config.username, config.password, config)

fs.readdirSync(modelPath)
    .filter(file => {
        return file.indexOf(".") !== 0 && file.slice(-3) === ".js"
    })
    .forEach(file => {
        const modelOpts = require(path.join(modelPath, file))
        const model = initModel(sequelize, ...modelOpts)
        db[model.name] = model
    })

// Object.keys(db).forEach(modelName => {
//     if (db[modelName].associate) {
//         db[modelName].associate(db)
//     }
// })

// 数据库自动同步
sequelize.sync({ alert: true, force: true })
// SQLCipher config
// sequelize.query("PRAGMA cipher_compatibility = 4")
// sequelize.query("PRAGMA key = 'Trussan0115!'")

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
