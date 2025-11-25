const { Router } = require('express');
const router = Router();
const { procesarPago } = require('../controllers/pagosController');

// Ruta para pagar una orden
router.post('/pagos', procesarPago);

module.exports = router;