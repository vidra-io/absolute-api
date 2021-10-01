const { productRepository } = require('../../app/data-access/repositories')

async function postUnstructured(request, response) {
    const productData = request.body
    if (!productData.code) {
        return response.status(400).send()
    }
    const product = await productRepository.create(request.headers['x-tenant-id'], request.body)
    response.send(product)
}

module.exports = postUnstructured
