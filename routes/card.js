const {Router} = require('express')
const Course = require('../models/course')
const router = Router()
const auth = require('../middleware/auth')


router.post('/add', auth, async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)
    res.redirect('/card')
})

router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.courseId').execPopulate()

    const courses = user.cart.items.map(item => ({
        ...item.courseId._doc, //окончание _doc - вытаскивает все данные по id
        count: item.count,
        id: item.courseId.id
    }))
    const cart = {
        courses,
        price: courses.reduce((total, course) => {
            return total += course.price * course.count
        }, 0) //Возвращаем суммарную стоимость
    }

    res.status(200).json(cart)
})

router.get('/', auth, async (req, res) => {
    
    const user = await req.user.populate('cart.items.courseId').execPopulate()
    // console.log(user.cart.items)
 
    const courses = user.cart.items.map(item => ({
        ...item.courseId._doc, //окончание _doc - вытаскивает все данные по id,
        id: item.courseId.id,
        count: item.count
    }))

    res.render('card', 
    {
        title: 'Корзина',
        isCard: true,
        courses: courses,
        price: courses.reduce((total, course) => {
            return total += course.price * course.count
        }, 0) //Возвращаем суммарную стоимость
    })
    // res.json({
        //     test: true
    // })
})

module.exports = router