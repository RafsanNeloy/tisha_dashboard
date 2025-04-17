require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const stockRoutes = require('./routes/stockRoutes');

// Verify the environment variable is loaded
console.log('MongoDB URI:', process.env.MONGO_URI ? 'Found' : 'Not Found');

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:5000"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Socket.IO connection handling
io.on('connection', socket => {
    socket.on('disconnect', () => {});
});

// Make io accessible to our routes
app.set('io', io);

// Middleware
app.use(cors({
    origin: ['http://localhost:5001', 'http://localhost:3000', 'http://localhost:5000'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/bills', require('./routes/billRoutes'));
app.use('/api/stock', stockRoutes);

// Error Handler
app.use(errorHandler);

httpServer.listen(5001, () => {
    console.log('Server running on port 5001');
});

console.log('Environment Variables:', {
    MONGO_URI: process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT
}); 