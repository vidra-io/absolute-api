const mongoose = require('mongoose')

const name = 'User'

const schema = new mongoose.Schema({
    tenant_id: { type: String, required: true, index: true },
    created_at: { type: Date, default: Date.now },
    last_update_at: { type: Date, default: Date.now },
    registration_date: Date,
    username: String,
    password: String,
})

const Model = mongoose.model(name, schema)

module.exports = {
    name,
    schema,
    model: Model,
}
