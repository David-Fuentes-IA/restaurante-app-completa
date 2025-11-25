const pool = require('../db');

const getMesas = async (req, res) => {
  try {
    // ESTA ES LA CLAVE: Buscamos la mesa Y su orden activa (si tiene una)
    const response = await pool.query(`
      SELECT 
        m.mesa_id, 
        m.numero_mesa, 
        m.capacidad, 
        m.estado, 
        o.orden_id  -- Ahora también pedimos el ID de la orden activa
      FROM Mesas m
      LEFT JOIN Ordenes o ON m.mesa_id = o.mesa_id AND o.estado = 'abierta'
      ORDER BY m.numero_mesa ASC
    `);
    
    res.json(response.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo mesas' });
  }
};

module.exports = { getMesas };