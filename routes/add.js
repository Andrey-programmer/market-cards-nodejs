const {Router} = require('express')
const router = Router()
const Course = require('../models/course')
const auth = require('../middleware/auth')


router.get('/', auth, (req, res) => {
    res.render(
        'add',
        {
            title: 'Добавить курс',
            isAdd: true
        }
    )
})
 
router.post('/', auth, async (req, res) => {
    // console.log(req.body)

    // const course = new Course(req.body.title, req.body.price, req.body.img)
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user._id
    })
    console.log('From add', course)

    try {
        await course.save()
        res.redirect('/courses')
    } catch (error) {
        console.log(error)
    }
    
}) 
module.exports = router