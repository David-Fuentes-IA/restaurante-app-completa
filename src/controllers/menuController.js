const pool = require('../db');

// Función para obtener todos los platillos
const getPlatillos = async (req, res) => {
  try {
    // Consultamos la tabla MenuPlatillos y unimos con Categorias para saber el nombre de la categoría
    const response = await pool.query(`
      SELECT p.platillo_id, p.nombre, p.precio, p.descripcion, c.nombre as categoria
      FROM MenuPlatillos p
      JOIN Categorias c ON p.categoria_id = c.categoria_id
      WHERE p.esta_disponible = true
    `);
    
    // Enviamos la respuesta en formato JSON
    res.json(response.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el menú' });
  }
};

module.exports = {
  getPlatillos
};