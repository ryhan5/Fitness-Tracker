import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from './src/config/db.js';
import mainAPI from './src/routes/main.route.js'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser()); 
app.use(cors({
  origin: 'http://localhost:5173', // your React frontend port
  credentials: true
}));
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('API is running');
})

app.use('/api', mainAPI)

app.listen(PORT, ()=>{
    connectDB();
    console.log(`server running on the port number ${PORT}`);
});


// -----------------------------------------------------------
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import rateLimit from 'express-rate-limit';
// import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';

// // Import routes
// import authRoutes from './src/routes/auth.routes.js';

// // Load environment variables
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Security middleware
// app.use(helmet());

// // CORS configuration
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:3000',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
//   max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
//   message: {
//     success: false,
//     message: 'Too many requests from this IP, please try again later.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// app.use(limiter);

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(cookieParser());

// // Logging middleware
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// } else {
//   app.use(morgan('combined'));
// }

// // Database connection
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error('Database connection error:', error);
//     process.exit(1);
//   }
// };

// // Routes
// app.use('/api/auth', authRoutes);

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Server is running',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV
//   });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found'
//   });
// });

// // Global error handler
// app.use((error, req, res, next) => {
//   console.error('Unhandled error:', error);
  
//   if (error.name === 'ValidationError') {
//     return res.status(400).json({
//       success: false,
//       message: 'Validation error',
//       errors: Object.values(error.errors).map(err => err.message)
//     });
//   }

//   if (error.code === 11000) {
//     return res.status(400).json({
//       success: false,
//       message: 'Duplicate field value',
//       field: Object.keys(error.keyValue)[0]
//     });
//   }

//   res.status(500).json({
//     success: false,
//     message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//   });
// });

// // Start server
// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
//     });
//   } catch (error) {
//     console.error('Failed to start server:', error);
//     process.exit(1);
//   }
// };

// startServer();

// export default app;