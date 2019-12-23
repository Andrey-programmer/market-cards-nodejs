if (process.env.NODE_ENV === 'production') { //Переменная NODE_ENV - обычно заполняется провайдером
    module.exports = require('./keys.prod')
} else {
    module.exports = require('./keys.dev')
}