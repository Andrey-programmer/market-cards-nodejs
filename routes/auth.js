const {Router} = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true
    })
})

router.post('/login', async (req, res) => {
    try {
        // const user = await User.findById('5de8ed8e40bf7d2220c3caba')
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if(candidate) {
            //Сравниваем два пароля
            const equilPass = await bcrypt.compare(password, candidate.password)

            if(equilPass) {
                req.session.user = candidate
                req.session.isAuthenticated = true  //создаем произвольное поле в сессии 
                req.session.save(err => { // Ждем сохранения сессии а потом делаем редирект
                    if (err) {
                        throw err
                    } else {
                        res.redirect('/')
                    }
                })

            } else {
                res.redirect('/auth/login#login')
            }
       
        }   else {
            res.redirect('/auth/login#login')
        }

    } catch (error) {
        console.log(error)
    }
    // req.session.user = user
    // req.session.isAuthenticated = true  //создаем произвольное поле в сессии 
    // req.session.save(err => { // Ждем сохранения сессии а потом делаем редирект
    //     if (err) {
    //         throw err
    //     } else {
    //         res.redirect('/')
    //     }
    // })
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

router.post('/register', async (req, res) => {
    try {
        const {email, password, repeat, name} = req.body
        const hashPassword = await bcrypt.hash(password, 10) //10 символов шифрования

        const candidate = await User.findOne({email})
        if(candidate) {
            res.redirect('/auth/login#register')
        } else {
            const user = new User({email, name, password: hashPassword, cart: {items: []}}) //Создаем нового пользователя
            await user.save() //Ждём пока пользователь сохранится
            res.redirect('/auth/login#login')
        }
    } catch (error) {
        console.log(error)
    }
})
module.exports = router