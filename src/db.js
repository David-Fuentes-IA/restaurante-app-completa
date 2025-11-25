const { Pool } = require('pg');
require('dotenv').config();

// Creamos la conexión usando las variables de tu archivo .env
const pool = new Pool({
  user: 'admin',        // O el usuario que viste en el Paso 1
  password: 'password123', // O la contraseña que viste en el Paso 1
  host: 'localhost',
  port: process.env.DB_PORT,
  database: 'restaurante_db',
});

// Mensaje de éxito cuando se conecta
pool.on('connect', () => {
  console.log('✅ Conectado a la Base de Datos PostgreSQL');
});

module.exports = pool;