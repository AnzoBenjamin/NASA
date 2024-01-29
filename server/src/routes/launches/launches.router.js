const express = require("express")
const {httpGetAllLaunches, httpSetNewLaunch, httpAbortLaunch} = require('./launches.controller')
const router = express.Router()

router.route('/').get(httpGetAllLaunches).post(httpSetNewLaunch)
router.route('/:id').delete(httpAbortLaunch)

module.exports = router