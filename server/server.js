const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/apiRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Enable CORS for frontend Vite dev server (port 5173 / 3000 / any origin)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Pass io to Express app instance so controllers can emit real-time events
app.set('io', io);

// API Routes
app.use('/api', apiRoutes);

// Base Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    system: 'Real-Time Property Rental, Maintenance & Amenity Management API',
    kpis: {
      maintenanceResolutionTimeTarget: '<= 48 hours',
      requestCompletionRateTarget: '>= 90%',
      amenityBookingConflicts: '0',
      systemResponseTime: '<= 2 seconds'
    },
    timestamp: new Date().toISOString()
  });
});

// Socket.io Real-Time Event Connections
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('join:room', (room) => {
    socket.join(room);
    console.log(`[Socket.io] ${socket.id} joined room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🏡 Property Management Platform API Server running on port ${PORT}`);
  console.log(`🔗 REST Base: http://localhost:${PORT}/api`);
  console.log(`⚡ WebSocket Server: Ready for Socket.io events`);
  console.log(`==================================================\n`);
});
