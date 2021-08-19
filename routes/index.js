const express = require('express')
const router = express.Router()
const { v4: uuidV4 } = require('uuid')

router.get('/:roomId', (req, res) => {
    res.render('index', { title: "express", roomId: req.params.roomId })
})

router.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

module.exports = router