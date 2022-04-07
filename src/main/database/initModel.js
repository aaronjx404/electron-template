const { Model, DataTypes } = require("sequelize")

// 驼峰转换下划线
function toLine(name) {
    return name.replace(/([A-Z])/g, "_$1").toLowerCase()
}

// 首字母小写
function toFirstLower(str) {
    return str.replace(str[0], str[0].toLowerCase())
}

// 生成 n 位长度的随机字符串
function randomString(
    length,
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
) {
    var result = ""
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
    return result
}

const initModel = (sequelize, attributes, config) => {
    const model = class extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    // const attr = Object.keys(attributes).reduce(
    //     (result, key) => {
    //         const attrItem = attributes[key]

    //         result[key] = attrItem
    //         if (!attrItem.field) {
    //             result[key].field = toLine(key)
    //         }
    //         return result
    //     },
    //     {
    //         id: {
    //             type: DataTypes.STRING,
    //             allowNull: false,
    //             unique: true,
    //             primaryKey: true,
    //             defaultValue: Date.now() + randomString(10),
    //         },
    //     }
    // )

    model.init(attributes, {
        sequelize,
        tableName: toLine(toFirstLower(config.modelName)),
        timestamps: true,
        ...config,
    })

    return model
}

module.exports = initModel
