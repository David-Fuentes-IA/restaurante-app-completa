const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  // --- CORRECCIÓN CRÍTICA PARA LA NUBE ---
  // Si estamos en localhost (PC), SSL es falso.
  // Si estamos en la nube (Railway), SSL es obligatorio y "permisivo".
  ssl: {
    rejectUnauthorized: false
  }

pool.on('connect', () => {
  console.log('✅ Conectado a la Base de Datos PostgreSQL');
});

// Manejo de errores de conexión para que no tumbe el servidor
pool.on('error', (err) => {
  console.error('❌ Error inesperado en el cliente de PG', err);
});

module.exports = pool;