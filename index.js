const express = require('express') // Подключаем экспресс
const path = require('path')
const mongoose = require('mongoose')
// const path = require('path') // Добавляем модуль пути
const expressHandlebars = require('express-handlebars') // Подключаем движок
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const User = require('./models/user')

const app = express() // Создаём сервер

// создаём структуру движка
const hbs = expressHandlebars.create({
    defaultLayout: 'main', //Создаём деволтный слой
    extname: 'hbs' //короткое имя движка
})

app.engine('hbs', hbs.engine)//Регистрируем наличие движка
app.set('view engine', 'hbs')//Подключаем движок к экспресс
app.set('views', 'pages')//Указываем папку с шаблонами

app.use( async (req, res, next) => {
    try {
        const user = await User.findById('5de8ed8e40bf7d2220c3caba')
        req.user = user
        next()  // если всё хорошо продолжаем работу
    } catch (error) {
        console.log(error)
    }
    
})

app.use(express.static(path.join(__dirname, 'public'))) //Добавляем обработку статических
app.use(express.urlencoded({
    extended: true
})) 
app.use('/', homeRoutes)
app.use('/add',addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card',cardRoutes)

mongoose.set('useFindAndModify', false)
/* 
app.get('/', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, 'pages', 'index.html'))
}) */
 

/* app.get('/about', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, 'pages', 'about.html'))
}) */





const PORT = process.env.PORT || 3000

async function start() {
    try {
        const password = "Lak0sta_1302"
        const url = "mongodb+srv://Andrey_proogrammer:Lak0sta_1302@cluster0-t8bpi.mongodb.net/shop"
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        const candidate = await User.findOne() //метод вернет первого попавшегося пользователя если он есть
        if(!candidate) {
            const user = new User({
                email: 'andrey-1302@mail.ru',
                name: 'Andrey',
                cart: {
                    items:[]
                }
            })

            await user.save()
        }

        app.listen(PORT, () => {
            console.log(`Server is running on PORT ${PORT}`)
        })
    } catch (error) {
        console.log(console.error)    
    }
}

start()
