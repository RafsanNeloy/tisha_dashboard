const express = require('express')
const cors = require('cors')
const app = express()

// Enable CORS for all routes
app.use(cors({
    origin: '*',  // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}))

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/bills', require('./routes/billRoutes'))
// ... other routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Something went wrong!' })
}) 