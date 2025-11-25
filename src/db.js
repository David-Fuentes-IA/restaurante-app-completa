const { Pool } = require('pg');
require('dotenv').config();

// CONFIGURACIÓN DE CONEXIÓN
// Opción A: Si existe DATABASE_URL (Nube), usamos esa.
// Opción B: Si no, usamos las variables sueltas (Local).
const connectionConfig = process.env.DATABASE_URL 
  ? { 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // SSL Obligatorio para Railway
    }
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      ssl: false // Sin SSL en local
    };

const pool = new Pool(connectionConfig);

// Eventos de monitoreo
pool.on('connect', () => {
  console.log('✅ Conectado a la Base de Datos PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error CRÍTICO en la base de datos:', err);
});

module.exports = pool;