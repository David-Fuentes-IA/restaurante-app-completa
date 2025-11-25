const { Router } = require('express');
const router = Router();
const { getPlatillos } = require('../controllers/menuController');

// Definimos la ruta GET /platillos
router.get('/platillos', getPlatillos);

module.exports = router;