const mongoose = require('mongoose')

mongoose.Promise = Promise
let connection = null

function init(mongodbUrl) {
    connection = mongoose.connect(mongodbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    return connection
}

function load() {
    return connection
}

module.exports = {
    init,
    load,
}
