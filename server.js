const app = require('./app');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('⚡ Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('⚡ Cliente desconectado:', socket.id);
  });
});

const notificacionesRoutes = require('./app/routes/notificacionesRoutes')(io);
app.use('/api/notificaciones', notificacionesRoutes);

mongoose.connect(DB_URL)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
    server.listen(PORT + 1, () => {
      console.log(`Socket.IO escuchando en puerto ${PORT + 1}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  });
