const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String
    },
    resetTokenExp: {
        type: Date
    },
    avatarUrl: {
        type: String
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId, //указываем тип id с которым работает mongoose
                    ref: 'Course', //Связываем с таблицей курсов
                    required: true
                }
            }
        ]
    }
})

//При создании в mongoose() собственных методов обязательно используем слово function
userSchema.methods.addToCart = function(course) {
    const items = [...this.cart.items] //забираем данные массива
    const index = items.findIndex(crs => {
        return crs.courseId.toString() === course._id.toString() //Приводим id курса к строке и сравниваем
    })

    if(index >= 0) {
        items[index].count += 1
    } else {
        items.push({
            courseId: course._id,
            count: 1
        })
    }

    this.cart = {items}  //Заносим обновлённый массив items в модель

    return this.save() // Возвращаем сохранённую схему
}

userSchema.methods.removeFromCart = function(id) {
    let items = [...this.cart.items]
    const index = items.findIndex(course => {
        return course.courseId.toString() === id.toString()
    })

    if(items[index].count === 1) {
         items = items.filter(course => {
             return course.courseId.toString() !== id.toString()
         })
    }   else {
        items[index].count--
    }

    this.cart = {items}
    return this.save()
}

userSchema.methods.clearCart = function() {
    this.cart = {items: []} // чистим корзину
    return this.save()
}


module.exports = model('User', userSchema)