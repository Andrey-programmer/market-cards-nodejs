const {Router} = require('express')
const Course = require('../models/course')
const router = Router()

router.get('/', async (req, res) => {

    const courses = await Course.find().populate('userId', 'email name').select('price title img') //Забираем все курсы в базе данных
    //метод populate() - получаем пользователя по его  id через userId и указываем поля которые хотим достать(email name)
    //метод select() - выбирает какие поля нужно достать из объекта
    console.log(courses)

    res.render(
        'courses',
        {
            title: 'Список курсов',
            isCourses: true,
            courses
        }
    )
})



router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) { 
        return res.redirect('/')
    }
    
    // const course = await Course.getById(req.params.id)
    const course = await Course.findById(req.params.id)
    
    res.render('course-edit', {
        title: `Редактировать ${course.title}`,
        course
    })
})


router.post('/edit', async (req, res) => {
    // await Course.update(req.body)

    const {id} = req.body
    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body)
    res.redirect('/courses')
})


router.get('/:id', async (req, res) => {
    // const course = await Course.getById(req.params.id)
    const course = await Course.findById(req.params.id)
    
    res.render('course',
    {
        layout: 'empty',
       title: `Курс ${course.title}`,
       course
    })
})

router.post('/remove', async(req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id
        })
        res.redirect('/courses')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router