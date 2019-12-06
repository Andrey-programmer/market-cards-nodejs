const {Router} = require('express')
const Order = require('../models/order')
const router = Router()


router.get('/', async (req, res) => {

    try {
        const orders = await Order.find({
            'user.userId': req.user._id
        }).populate('user.userId')
    
        res.render('orders', {
            isOrder: true,
            title: 'Заказы',
            orders: orders.map(order => {
                return {
                    ...order._doc,
                    price: order.courses.reduce((total, course) => {
                        return total += course.count * course.course.price
                    }, 0)
                }
            })
        })
    } catch (error) {
        
    }

})

router.post('/', async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.courseId').execPopulate()
    
        const courses = user.cart.items.map(item => ({
            count: item.count,
            course: {...item.courseId._doc}
        }))
    
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user //id - вкладывает сам mongoose
            },
            courses: courses
        })
        await order.save() // сохраняем заказ
        await req.user.clearCart()// чистим корзину
    
    
        res.redirect('/orders')
    } catch (error) {
        console.log(error)
    }
   
})

module.exports = router 