const baseRepository = require('./base-repository')
const { model: UserModel } = require('../schemas/user')
const { model: ProductModel } = require('../schemas/product')

const userRepository = baseRepository(UserModel)
const productRepository = baseRepository(ProductModel)

module.exports = Object.freeze({
    userRepository,
    productRepository,
})
