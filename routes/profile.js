const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const User = require('../models/user')

router.get('/', auth, async (req, res) => {
    res.render('profile', {
        title: 'Профиль',
        isProfile: true,
        user: req.user.toObject()
    })
})

router.post('/', auth, async (req, res) => { 
    try {
        // console.log(req)
        const user = await User.findById(req.user._id)
        const toChange = {
            name: req.body.name
        }

        // console.log(req.file)
        if (req.file) {
            toChange.avatarUrl = req.file.path
        }

        Object.assign(user, toChange) //Добавляем поля созданного объекта в текущий
        await user.save()
        res.redirect('/profile')
    } catch (error) {
       console.log(error) 
    }
})

module.exports = router
