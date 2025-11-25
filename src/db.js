const { Pool } = require('pg');
require('dotenv').config();

// LÓGICA INTELIGENTE DE CONEXIÓN
// Si el host es 'localhost', estamos en Docker (PC) -> NO usar SSL.
// Si el host es cualquier otra cosa (Railway), estamos en Nube -> SÍ usar SSL.
const isLocal = process.env.DB_HOST === 'localhost';

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  // Configuración de Seguridad (SSL)
  ssl: isLocal ? false : { rejectUnauthorized: false }
});

// Eventos para monitorear la salud de la conexión
pool.on('connect', () => {
  console.log('✅ Conectado a la Base de Datos PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error CRÍTICO en la base de datos:', err);
});

module.exports = pool;