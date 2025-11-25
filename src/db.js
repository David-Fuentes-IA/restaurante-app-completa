const { Pool } = require('pg');
require('dotenv').config();

// --- DIAGNÓSTICO (ESTO SALDRÁ EN LOS LOGS) ---
console.log("--- INICIO DE DIAGNÓSTICO DE DB ---");
console.log("¿Existe DATABASE_URL?", !!process.env.DATABASE_URL); // Dirá true o false
console.log("DB_HOST:", process.env.DB_HOST);
console.log("--- FIN DE DIAGNÓSTICO ---");

// CONFIGURACIÓN DE CONEXIÓN
const connectionConfig = process.env.DATABASE_URL 
  ? { 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } 
    }
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      ssl: false
    };

const pool = new Pool(connectionConfig);

pool.on('connect', () => {
  console.log('✅ Conectado a la Base de Datos PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error CRÍTICO en la base de datos:', err);
});

module.exports = pool;
module.exports = pool;