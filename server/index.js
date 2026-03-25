import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { xss } from 'express-xss-sanitizer';
import hpp from 'hpp';
import morgan from 'morgan';
import http from 'http';
import cookieParser from 'cookie-parser';
import { initSocket } from './socket.js';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import coreRoutes from './routes/coreRoutes.js';
import hierarchyRoutes from './routes/hierarchyRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { verifyCSRF } from './middleware/authMiddleware.js';

dotenv.config();
connectDB();

const app = express();

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "res.cloudinary.com"],
            connectSrc: ["'self'", "http://localhost:5000", "ws://localhost:5000"],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'"],
        },
    },
}));
app.disable('x-powered-by');
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(verifyCSRF);
// app.use(mongoSanitize()); // Prevent NoSQL Injection
// app.use(xss()); // Prevent Cross-Site Scripting (XSS)
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Request Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', { skip: (req, res) => res.statusCode < 400 }));
}

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

app.use('/api/users', userRoutes);
app.use('/api', coreRoutes);
app.use('/api/hierarchy', hierarchyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
