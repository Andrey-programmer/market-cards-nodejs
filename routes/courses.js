const {Router} = require('express')
const Course = require('../models/course')
const router = Router()
const auth = require('../middleware/auth')
const {courseValidators} = require('../myutils/validators')
const {validationResult} = require('express-validator')

router.get('/', async (req, res) => {

    try {
        const courses = await Course.find().populate('userId', 'email name').select('price title img') //Забираем все курсы в базе данных
        //метод populate() - получаем пользователя по его  id через userId и указываем поля которые хотим достать(email name)
        //метод select() - выбирает какие поля нужно достать из объекта
        // console.log(courses)

        res.render(
            'courses',
            {
                title: 'Список курсов',
                isCourses: true,
                userId: req.user ? req.user._id.toString(): null,
                courses
            }
        )
    } catch (error) {
        console.log(error)
    }

   
})



router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) { 
        return res.redirect('/')
    }
    
    
    try {
        // const course = await Course.getById(req.params.id)
        const course = await Course.findById(req.params.id)

        //Защищаем страницу редактирования курса от нежелательного пользователя знающего id
        if(course.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/courses')
        }
        
        res.render('course-edit', {
            title: `Редактировать ${course.title}`,
            course
        }) 
    } catch (error) {
        console.log(errror)
    }

})


router.post('/edit', auth, courseValidators, async (req, res) => {
    // await Course.update(req.body)
    const errors = validationResult(req)
    const {id} = req.body

    if(!errors.isEmpty()) {
        return res.status(422).redirect(`/courses/${id}/edit?allow=true`)
    }

    try {

        const course = await Course.findById(id)
        //Защищаем страницу редактирования курса от нежелательного пользователя знающего id
        if(course.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/courses')
        }

        delete req.body.id
        await Course.findByIdAndUpdate(id, req.body)
        res.redirect('/courses')
    } catch (error) {
        console.log(error)
    }
   
})


router.get('/:id', async (req, res) => {

    try {
        // const course = await Course.getById(req.params.id)
        const course = await Course.findById(req.params.id)
        
        res.render('course',
        {
            layout: 'empty',
        title: `Курс ${course.title}`,
        course
        })
    } catch (error) {
        console.log(error)
    }
    
})

router.post('/remove', auth, async(req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        })
        res.redirect('/courses')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router