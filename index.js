const express = require('express') // Подключаем экспресс
// const path = require('path') // Добавляем модуль пути
const expressHandlebars = require('express-handlebars') // Подключаем движок
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')

const app = express() // Создаём сервер

// создаём структуру движка
const hbs = expressHandlebars.create({
    defaultLayout: 'main', //Создаём деволтный слой
    extname: 'hbs' //короткое имя движка
})

app.engine('hbs', hbs.engine)//Регистрируем наличие движка
app.set('view engine', 'hbs')//Подключаем движок к экспресс
app.set('views', 'pages')//Указываем папку с шаблонами
app.use(express.static('public')) //Добавляем обработку статических
app.use(express.urlencoded({
    extanded: true
})) 
app.use('/', homeRoutes)
app.use('/add',addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card',cardRoutes)

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


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})