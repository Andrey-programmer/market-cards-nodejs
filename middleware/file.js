const multer = require('multer')

//storage - определяет место сохранения файлов на сервере
const storage = multer.diskStorage({
    // Путь куда складывать файл
    destination(req, file, callback) {
        callback(null, 'images') //(<ошибка>, <имя папки куда складывать файл>)
    },
    // Имя файла
    filename(req, file, callback) { 
        // callback(null, file.originalname) //(<ошибка>, <уникальное имя файла>)
        callback(null, new Date().toISOString().replace(/:/g,'') + '-' + file.originalname) //(<ошибка>, <уникальное имя файла>)
    }
})

//Перечисляем допустимые расширения
const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']

// fileFilter - определяет валидацию конфигурации файлов
const fileFilter = (req, file, callback) => {
    // Если тип находится в массиве то пропускаем
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true) //(<ошибка>, <успешная валидация>)
    } else {
        callback(null, false)
    }
    
}

module.exports = multer({storage, fileFilter})