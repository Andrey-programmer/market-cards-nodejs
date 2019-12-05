const fs = require('fs')
const path = require('path')


const p = path.join(
    path.dirname(process.mainModule.filename), //относительно корневой директории
    'data',
    'card.json'
)
class Card {
   
    static async add(course) {
        const card = await Card.fetch()

        const index = card.courses.findIndex(crs => crs.id === course.id)
        const candidate = card.courses[index]
        if (candidate) {
            //если курс уже есть
            candidate.count++
            card.courses[index] = candidate
        } else {
            //нужно добавить курс
            course.count = 1
            card.courses.push(course)
        }

        card.price += +course.price
        return new Promise((resolve, reject) => {
            fs.writeFile(/* path.join(__dirname, '..', 'data', 'card.json') */p, JSON.stringify(card), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    static async remove(id) {
        const card = await Card.fetch()

        const index = card.courses.findIndex(cardd => cardd.id === id)
        const course = card.courses[index]
        
        if (course.count === 1) {
            //удалить
            card.courses = card.courses.filter(course_ => course_.id !== id)
        } else {
            // уменьшить количество на 1
            card.courses[index].count--
        }

        card.price -= course.price  

        return new Promise((resolve, reject) => {
            fs.writeFile(/* path.join(__dirname, '..', 'data', 'card.json') */p, JSON.stringify(card), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve(card)
                }
            })
        })
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                // path.join(__dirname, '..', 'data', 'card.json'), 
                p,
                'utf-8', 
                (err, content) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(content))
                }
            })
        })
    }
}

module.exports = Card