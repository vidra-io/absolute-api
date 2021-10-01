#!/usr/bin/env node

// https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/separateexpress.md

const app = require('../app/app')

process.on('unhandledRejection', (up) => {
    throw up
})
app.listen(process.env.PORT || 80, '0.0.0.0')
