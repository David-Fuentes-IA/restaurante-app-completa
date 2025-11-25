const { Router } = require('express');
const router = Router();
// Importamos AMBAS funciones ahora
const { createOrden, addItemToOrden } = require('../controllers/ordenesController');

// 1. Crear orden (Ya la tenías)
router.post('/ordenes', createOrden);

// 2. Agregar ítems a una orden específica (NUEVA)
// :orden_id es una variable, puede ser 1, 2, 50, etc.
router.post('/ordenes/:orden_id/items', addItemToOrden);

module.exports = router;