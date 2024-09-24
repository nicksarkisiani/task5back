const router = require('express').Router()
const controller = require('./controller')


router.post('/generate-data', controller.generateData)

module.exports = router