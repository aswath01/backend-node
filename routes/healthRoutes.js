import express from 'express';
import { HealthControllers } from '../controllers/health.js';

/**
 * Health class is responsible for defining and registering
 * health-related routes for the application.
 */
class Health {
    constructor() {
        this.router = express.Router(); 
        this.registerHealthRoutes(); 
    }
    /**
     * Registers health check routes for the application.
     * Each route corresponds to a method in the HealthControllers class.
     */
    registerHealthRoutes() {
        // Route to check the server health
        this.router.get('/server-health', HealthControllers.prototype.serverHealth);
        
        // Route to get server uptime
        this.router.get('/uptime', HealthControllers.prototype.uptime);
        
        // Route to get memory usage statistics
        this.router.get('/memory-usage', HealthControllers.prototype.memoryUsage);
        
        // Route to get CPU usage statistics
        this.router.get('/cpu-usage', HealthControllers.prototype.cpuUsage);
    }
}

export default new Health().router;