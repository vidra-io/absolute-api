const problemMap = {
    'validation-error': { statusCode: 400, title: 'Invalid data' },
    'not-found': { statusCode: 404, title: 'Resource not found' },
    'payment-already-paid': { statusCode: 409, title: 'Payment already paid' },
    'invalid-plan': { statusCode: 409, title: 'Invalid plan' },
    'service-conflict': { statusCode: 409, title: 'Service conflict' },
    'customer-already-exists': { statusCode: 409, title: 'Customer already exists' },
    'invalid-credentials': { statusCode: 400, title: 'Invalid credentials' },
}
function problemJson(type, data) {
    return {
        statusCode: problemMap[type].statusCode,
        body: {
            type: `https://github.com/vidra-io/problem-types/blob/master/${type}`,
            title: problemMap[type].title,
            status_code: problemMap[type].statusCode,
            more_data: data,
        },
    }
}

module.exports = problemJson
