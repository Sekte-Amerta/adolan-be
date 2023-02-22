const multer = require('multer')
const path = require('path')

// management file
const multerUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images')
    },
    filename: (res, file, cb) => {
      const ext = path.extname(file.originalname)
      const filename = `${Date.now()}${ext}`
      cb(null, filename)
    }
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLocaleLowerCase()
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      cb(null, true)
    } else {
      const error = {
        responseCode: 422,
        message: 'file must be jpg, jpeg, and png'
      }
      cb(error, false)
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024
  }
})

// middleware
const upload = (req, res, next) => {
  const multerSingle = multerUpload.single('photo')
  multerSingle(req, res, (err) => {
    if (err) {
      res.status(500).json({
        responseCode: 500,
        message : err.message
      })
    } else {
      next()
    }
  })
}

module.exports = upload
