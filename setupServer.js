import express, { json, urlencoded } from 'express';
import compression from 'compression';
import cookieSession from 'cookie-session';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import applicationRoutes from './routes/index.js';
import responseHandler from './utils/responses/responseHandler.js';

const PORT = 4001;

/**
 * BackendServer class handles the initialization and configuration of the Express server,
 * including middleware, socket.io, and routing.
 */
export class BackendServer {
    /**
     * Creates an instance of the BackendServer.
     * @param {Object} app - An instance of the Express application.
     */
    constructor(app) {
        this.app = app; // Assign the Express application to this instance
        this.server = http.createServer(app); // Create an HTTP server using the Express app
        this.io = new Server(this.server, {
            cors: {
                origin: process.env.CLIENT_URL || '*', // Allow CORS from the specified client URL
                methods: ['GET', 'POST'], // Allow only specific HTTP methods
                credentials: true // Allow credentials in CORS requests
            }
        });
    }

    /**
     * Starts the backend server by initializing middleware, socket server, and routes.
     */
    start() {
        this.startServer(); // Start the HTTP server
        this.securityMiddleware(); // Set up security-related middleware
        this.standardMiddleware(); // Set up standard middleware
        this.startSocketServer(); // Initialize the socket.io server
        this.routesMiddleware(this.app); // Register application routes
    }

    /**
     * Starts the HTTP server and listens on the specified port.
     */
    startServer() {
        this.server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`); // Log the server start message
        });
    }

    /**
     * Registers application routes using the provided Express app.
     * @param {Object} app - An instance of the Express application.
     */
    routesMiddleware(app) {
        applicationRoutes(app); // Load the application routes
    }

    /**
     * Initializes the socket.io server and sets up event listeners.
     */
    startSocketServer() {
        // Listen for new client connections
        this.io.on('connection', (socket) => {
            console.log('New client connected:', socket.id); // Log the new client ID
            // Listen for incoming messages from clients
            socket.on('message', (msg) => {
                console.log('Message received:', msg); // Log the received message
                this.io.emit('message', msg); // Broadcast the message to all connected clients
            });
            // Listen for client disconnection
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id); // Log the disconnected client ID
            });
        });
    }

    /**
     * Sets up security-related middleware to protect the application.
     */
    securityMiddleware() {
        this.app.set('trust proxy', 1); // Trust the first proxy (for secure cookies)
        this.app.use(
            cookieSession({
                name: 'session', // Name of the cookie
                keys: ["secret-1", "secret-2"], // Secret keys for signing cookies
                maxAge: 24 * 7 * 3600000, // Set cookie expiration to 1 week
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'none' // Allow cross-site cookie use
            })
        );
        this.app.use(hpp()); // Prevent HTTP parameter pollution
        this.app.use(helmet()); // Set various HTTP headers for security
        this.app.use(
            cors({
                origin: process.env.CLIENT_URL || '*', // Allow CORS from the specified client URL
                credentials: true, // Allow credentials in CORS requests
                optionsSuccessStatus: 200, // Set success status for older browsers
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // Allow specific HTTP methods
            })
        );
    }

    /**
     * Sets up standard middleware for request processing and response handling.
     */
    standardMiddleware() {
        this.app.use(responseHandler); // Use a custom response handler for API responses
        this.app.use(compression()); // Enable response compression
        this.app.use(json({ limit: '50mb' })); // Parse incoming JSON requests with a limit of 50 MB
        this.app.use(urlencoded({ extended: true, limit: '50mb' })); // Parse incoming URL-encoded requests with a limit of 50 MB
    }
}