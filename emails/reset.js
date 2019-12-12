const keys = require('../keys')

module.exports = function (email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Восстановление пароля',
        html: `
            <h1>Восстановление пароля</h1>
            <p>Для восстановления пароля нажмите на ссылку ниже:</p>
            <p><a href="${keys.BASE_URL}/auth/password/${token}">Восстановить доступ</a></p>
            <hr />
            <a href="${keys.BASE_URL}">Магазин курсов</a>
        `
    }
}