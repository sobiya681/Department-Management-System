const express = require('express')
const mongoose = require('mongoose')
const connectDB = require('./config/db');
const cors = require('cors')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const user=require('./routes/user')
const ugFormRoutes = require('./routes/ugForm');
const projectRoutes = require('./routes/projects');
const courseRoutes = require('./routes/courses');
const documentRequestRoutes = require('./routes/documentRequest');

const fs = require('fs');

const PORT = 8000

// Load environment variables
dotenv.config();
const app = express();

// Connect to database
connectDB();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())

// Add after other route imports

// Serve static files for uploaded images
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API URL: http://localhost:${PORT}/api`);
});
// Make sure to create uploads directory
if (!fs.existsSync('uploads/projects')) {
    fs.mkdirSync('uploads/projects', { recursive: true });
}

// 🔥 USER ROUTES
app.use('/api/user', user)
app.use('/api/admin', user)
app.use('/api/ugform', ugFormRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/document-requests', documentRequestRoutes);


app.listen(PORT, () => {
    console.log(`APP IS RUNNING ON PORT ${PORT}`)
})
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`❌ Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});