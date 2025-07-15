const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT;

mongoose.connect(DB_URL)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  });
