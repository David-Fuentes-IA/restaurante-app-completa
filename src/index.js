const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

// Importar rutas
const menuRoutes = require('./routes/menuRoutes');
const ordenesRoutes = require('./routes/ordenesRoutes');
const pagosRoutes = require('./routes/pagosRoutes');
const mesasRoutes = require('./routes/mesasRoutes');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const app = express();
// Railway asigna un puerto dinámico, usamos ese o el 3000
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- DIAGNÓSTICO DE CARPETA PÚBLICA ---
// Imprimimos la ruta exacta para ver si en la nube es diferente
const publicPath = path.join(__dirname, '../public');
console.log(`📂 Sirviendo archivos estáticos desde: ${publicPath}`);

app.use(express.static(publicPath));

// --- RUTA DE VIDA (PING) ---
// Si esta ruta funciona pero la página no, el problema es la carpeta public
app.get('/ping', (req, res) => {
  res.send('pong 🏓 - El servidor está vivo');
});

// Rutas de la API
app.use('/api', menuRoutes);
app.use('/api', ordenesRoutes);
app.use('/api', pagosRoutes);
app.use('/api', mesasRoutes);
app.use('/api', authRoutes);

// --- ARRANQUE ROBUSTO ---
// Escuchamos en 0.0.0.0 para que Railway nos encuentre sí o sí
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en el puerto ${port}`);
});