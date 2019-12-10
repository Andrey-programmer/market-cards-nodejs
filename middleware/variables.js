module.exports = function(req, res, next) {
    res.locals.isAuth = req.session.isAuthenticated //Названия полей произвольные
    // Добавляем новую переменную шифрования
    res.locals.csrf = req.csrfToken()
    next()
}