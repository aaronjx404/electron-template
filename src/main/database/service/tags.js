const db = require("../db")

const Tags = {
    list: async () => {
        return db.Tags.findAll({ raw: true })
    },
    destroy: async (filter = {}) => db.Tags.destroy({ where: { ...filter }, truncate: true }),
    update: async values => {
        await db.Tags.destroy({ where: {}, truncate: true })
        return db.Tags.bulkCreate(values)
    },
}

module.exports = Tags
