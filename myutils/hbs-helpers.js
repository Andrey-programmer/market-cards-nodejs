module.exports = {
    ifequil(a, b, options) { // ifequil - придуманное имя. задаю сам
        if (a == b) {
            return options.fn(this)
        } else {
            return options.inverse(this)
        }
    }
}