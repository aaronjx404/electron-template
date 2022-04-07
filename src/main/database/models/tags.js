const { DataTypes } = require("sequelize")

module.exports = [
    // attributes
    {
        label_id: {
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true,
        },
        level: {
            type: DataTypes.INTEGER,
        },
        name: {
            type: DataTypes.STRING,
        },
        super_id: {
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.INTEGER,
        },
    },
    //   otherOptions
    {
        modelName: "Tags",
    },
]
