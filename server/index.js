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

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'https://lecture-management-system-eta.vercel.app',
    process.env.CLIENT_URL
].filter(Boolean);

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "res.cloudinary.com"],
            connectSrc: ["'self'", ...allowedOrigins, "ws://localhost:5000", "wss://lecture-management-system-npia.onrender.com"],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'"],
        },
    },
}));
app.disable('x-powered-by');
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
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
