const pool = require('../db');

const procesarPago = async (req, res) => {
  const { orden_id, metodo_pago_id, monto_propina } = req.body;

  // Iniciamos una conexión "cliente" dedicada para poder hacer una transacción
  const client = await pool.connect();

  try {
    // 1. INICIAR TRANSACCIÓN (Todo lo que sigue es un solo bloque)
    await client.query('BEGIN');

    // Paso A: Calcular cuánto debe pagar (Sumar los platillos de la orden)
    const resTotal = await client.query(
      `SELECT SUM(cantidad * precio_en_orden) as subtotal 
       FROM OrdenDetalles WHERE orden_id = $1`,
      [orden_id]
    );
    
    const subtotal = parseFloat(resTotal.rows[0].subtotal || 0);
    const impuesto = subtotal * 0.16; // 16% IVA
    const total = subtotal + impuesto + (monto_propina || 0);

    // Paso B: Registrar el Pago
    const resPago = await client.query(
      `INSERT INTO Pagos (subtotal, monto_propina, monto_impuesto, monto_total, orden_id, metodo_pago_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [subtotal, monto_propina || 0, impuesto, total, orden_id, metodo_pago_id]
    );

    // Paso C: Cerrar la Orden
    await client.query(
      `UPDATE Ordenes SET estado = 'cerrada', fecha_cierre = CURRENT_TIMESTAMP 
       WHERE orden_id = $1`,
      [orden_id]
    );

    // Paso D: Liberar la Mesa (Obtenemos el ID de la mesa desde la orden y la actualizamos)
    await client.query(
      `UPDATE Mesas SET estado = 'disponible' 
       FROM Ordenes 
       WHERE Mesas.mesa_id = Ordenes.mesa_id AND Ordenes.orden_id = $1`,
      [orden_id]
    );

    // 2. CONFIRMAR TRANSACCIÓN (Si llegamos aquí, guardamos todo permanentemente)
    await client.query('COMMIT');

    res.json({
      mensaje: 'Pago procesado y orden cerrada',
      ticket: resPago.rows[0]
    });

  } catch (error) {
    // 3. REVERTIR TRANSACCIÓN (Si algo falló, deshacemos todo como si nada hubiera pasado)
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Error al procesar el pago' });
  } finally {
    // Liberamos la conexión
    client.release();
  }
};

module.exports = { procesarPago };