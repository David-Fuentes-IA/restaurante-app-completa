const pool = require('../db');

// Crear una nueva orden (Abrir mesa)
const createOrden = async (req, res) => {
  // Recibimos los datos del "cuerpo" (body) de la petición
  const { mesa_id, empleado_id } = req.body;

  try {
    // 1. Insertamos la orden con estado 'abierta'
    // RETURNING * nos devuelve la fila que acabamos de crear (útil para tener el ID)
    const response = await pool.query(
      `INSERT INTO Ordenes (mesa_id, empleado_id, estado) 
       VALUES ($1, $2, 'abierta') 
       RETURNING *`,
      [mesa_id, empleado_id]
    );
    
    // 2. (Opcional pero recomendado) Actualizamos el estado de la mesa a 'ocupada'
    await pool.query(
      `UPDATE Mesas SET estado = 'ocupada' WHERE mesa_id = $1`,
      [mesa_id]
    );

    res.json({
      mensaje: 'Orden creada exitosamente',
      orden: response.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
};

module.exports = {
  createOrden
};

// ... (tu código anterior de createOrden) ...

// Agregar un platillo a una orden existente
const addItemToOrden = async (req, res) => {
  const { orden_id } = req.params; // Viene de la URL (ej: /ordenes/2/items)
  const { platillo_id, cantidad, notas } = req.body; // Viene del JSON

  try {
    // 1. Buscamos el precio actual del platillo
    const platilloInfo = await pool.query(
      'SELECT precio FROM MenuPlatillos WHERE platillo_id = $1',
      [platillo_id]
    );

    if (platilloInfo.rows.length === 0) {
      return res.status(404).json({ error: 'Platillo no encontrado' });
    }

    const precioActual = platilloInfo.rows[0].precio;

    // 2. Insertamos el detalle usando ese precio
    const response = await pool.query(
      `INSERT INTO OrdenDetalles (orden_id, platillo_id, cantidad, precio_en_orden, notas)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [orden_id, platillo_id, cantidad, precioActual, notas]
    );

    res.json({
      mensaje: 'Platillo agregado correctamente',
      detalle: response.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar platillo' });
  }
};

// ¡IMPORTANTE! Agrega la nueva función a la lista de exportaciones
module.exports = {
  createOrden,
  addItemToOrden  // <--- Agregada aquí con una coma antes
};