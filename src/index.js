const express = require('express');
const cors = require('cors');
const path = require('path'); // <--- NUEVO: Para manejar rutas de carpetas
const pool = require('./db');

const menuRoutes = require('./routes/menuRoutes');
const ordenesRoutes = require('./routes/ordenesRoutes');
const pagosRoutes = require('./routes/pagosRoutes');
const mesasRoutes = require('./routes/mesasRoutes'); // <--- 1. Importar ruta de mesas
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 2. CONFIGURAR CARPETA PÚBLICA (Frontend)
// Esto dice: "Cuando entren a la raíz, muestra los archivos de la carpeta 'public'"
app.use(express.static(path.join(__dirname, '../public')));

// Rutas API
app.use('/api', menuRoutes);
app.use('/api', ordenesRoutes);
app.use('/api', pagosRoutes);
app.use('/api', mesasRoutes); // <--- 3. Usar ruta de mesas

app.use('/api', authRoutes);

// ... (todo tu código anterior de rutas) ...

// --- PRUEBA DE CONEXIÓN AL INICIAR ---
// Esto obligará a la BD a responder o fallar inmediatamente
pool.query('SELECT NOW()')
  .then(res => {
    console.log('✅ ¡CONEXIÓN EXITOSA A LA BD! Hora:', res.rows[0].now);
    
    // Solo iniciamos el servidor si la BD funciona
    app.listen(port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('❌ ERROR FATAL AL CONECTAR A LA BD:');
    console.error(err); // <-- Esto nos dirá EXACTAMENTE qué está mal
    process.exit(1); // Apagar el servidor si no hay BD
  });