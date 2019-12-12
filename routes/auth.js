const {Router} = require('express')
const router = Router()
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const User = require('../models/user')
const keys = require('../keys/index')
const regEmail = require('../emails/registration')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const resetEmail = require('../emails/reset')

const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.SENDGRID_API_KEY}
}))

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'), // передаём с сервера ошибку
        registerError: req.flash('registerError')
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
                req.flash('loginError', 'Неверный пароль')
                res.redirect('/auth/login#login')
            }
            
        }   else {
            req.flash('loginError', 'Пользователь не найден')
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
            req.flash('registerError', 'Пользователь с таким email уже зарегистрирован')
            res.redirect('/auth/login#register')
        } else {
            const user = new User({email, name, password: hashPassword, cart: {items: []}}) //Создаем нового пользователя
            await user.save() //Ждём пока пользователь сохранится
            res.redirect('/auth/login#login')
            await transporter.sendMail(regEmail(email))
        }
    } catch (error) {
        console.log(error)
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Восстановление пароля',
        error: req.flash('error')
    })
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Что-то пошло не так, повторите попытку позже') 
                return res.redirect('/auth/reset')
            }

            const token = buffer.toString('hex')

            const candidate = await User.findOne({email: req.body.email})

            if(candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000 //Время жизни токена
                await candidate.save()
                await transporter.sendMail(resetEmail(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'Такой email не зарегистрирован')
                res.redirect('/auth/reset')
            }

        })
    } catch (error) {
        console.log(error)
    }
})

router.get('/password/:token', async (req, res) => {
    if(!req.params.token) {
        return res.redirect('/auth/login')
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {
                $gt: Date.now() // проверка на то что время токена ещё не превышено
            }
        })

        if(!user) {
            return res.redirect('/auth/login')
        } else {
            res.render('auth/password', {
                title: 'Восстановить доступ',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            })
        }
        
        res.render('auth/password', {
            title: 'Новый пароль',
            error: req.flash('error')
        })
    } catch (error) {
        console.log(error)
    }

})

module.exports = router