const mongoose = require('mongoose')

const name = 'Product'

const schema = new mongoose.Schema({
    tenant_id: { type: String, required: true, index: true },
    created_at: { type: Date, default: Date.now },
    last_update_at: { type: Date, default: Date.now },
    code: String,
    price: Number,
})

const Model = mongoose.model(name, schema)

module.exports = {
    name,
    schema,
    model: Model,
}
