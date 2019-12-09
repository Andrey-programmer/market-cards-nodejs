const {Router} = require('express')
const router = Router()
const User = require('../models/user')

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true
    })
})

router.post('/login', async (req, res) => {
    const user = await User.findById('5de8ed8e40bf7d2220c3caba')
    req.session.user = user
    req.session.isAuthenticated = true  //создаем произвольное поле в сессии 
    req.session.save(err => { // Ждем сохранения сессии а потом делаем редирект
        if (err) {
            throw err
        } else {
            res.redirect('/')
        }
    })
})

router.get('/logout', async (req, res) => {
    // можно сделать так 
    /* req.session.isAuthenticated = false
    res.redirect('/auth/login#login') */
    
    // а можно так 
    req.session.destroy(() => {
        
        res.redirect('/auth/login#login')
            
    })

})
module.exports = router