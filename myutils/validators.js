const {body} = require('express-validator')
// const User = require('../models/user')


exports.registerValidators = [
    body('email')
        .isEmail()
        .normalizeEmail()//Санитайзер, убирающий верхние символы
        .withMessage('Введите  корректный Email')
    // .custom(async (value, {req}) => {
    //     try {
    //         const user = await User.findOne({email: value})

    //         if(user) {
    //             return Promise.reject('Такой Email уже занят')
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // })
        

    ,
    body('password', 'Пароль должен быть не менее 6 символов')
        .isLength({min: 6, max: 10})
        .isAlphanumeric()
        .trim(),//валидатор санитайзер
    // Пишем собственный валидатор
    body('confirm').custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Пароли должны совпадать')
        }
        return true
    })
        .trim() //необязательный
    ,
    body('name', 'Имя должно состоять не менее чем из 3 символов')
        .isLength({min: 3})
        .isAlphanumeric()
        .trim()
]


exports.courseValidators = [
    body('title')
        .isLength({min: 3})
        .withMessage('Минимальная длина названия - 3 символа')
        .trim(), //удаляем лишние пробелы

    body('price')
        .isNumeric()
        .withMessage('Введите корректную цену'),

    body('img', 'Введите корректный URL').isURL()

]