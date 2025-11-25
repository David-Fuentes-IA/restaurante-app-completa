const { Router } = require('express');
const router = Router();
const { getMesas } = require('../controllers/mesasController');
router.get('/mesas', getMesas);
module.exports = router;