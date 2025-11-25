const pool = require('../db');

const login = async (req, res) => {
  const { pin } = req.body;

  try {
    // Buscamos al empleado por su PIN y verificamos que esté activo
    const response = await pool.query(
      'SELECT empleado_id, nombre, rol_id FROM Empleados WHERE codigo_pin = $1 AND esta_activo = true',
      [pin]
    );

    if (response.rows.length === 0) {
      return res.status(401).json({ error: 'PIN incorrecto o usuario inactivo' });
    }

    // Si existe, devolvemos los datos del usuario (¡PERO NO EL PIN!)
    res.json({
      mensaje: 'Login exitoso',
      usuario: response.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = { login };