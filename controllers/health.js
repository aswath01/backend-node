import moment from 'moment';
import os from 'os';

/**
 * HealthControllers class provides various endpoints to monitor
 * the health status of the server instance.
 */
export class HealthControllers {
    
    /**
     * Checks the health status of the server instance.
     *
     * @param {Object} req - The incoming request object.
     * @param {Object} res - The response object with a custom success method.
     * @returns {Object} - Success response with health information.
     */
    serverHealth(req, res) {
        return res.success({
            message: `Health: Server instance is healthy with process id ${process.pid} on ${moment().format('LL')}`
        });
    }

    /**
     * Retrieves the uptime of the server instance.
     *
     * @param {Object} req - The incoming request object.
     * @param {Object} res - The response object with a custom success method.
     * @returns {Object} - Success response with the server uptime.
     */
    uptime(req, res) {
        const uptimeInSeconds = process.uptime(); // Get server uptime in seconds
        const uptime = moment.duration(uptimeInSeconds, 'seconds').humanize(); // Convert to human-readable format
        return res.success({
            message: `Server has been running for ${uptime}`
        });
    }

    /**
     * Provides the current memory usage of the server.
     *
     * @param {Object} req - The incoming request object.
     * @param {Object} res - The response object with a custom success method.
     * @returns {Object} - Success response with formatted memory usage.
     */
    memoryUsage(req, res) {
        const memoryUsage = process.memoryUsage(); // Get memory usage details
        const formattedMemoryUsage = {
            rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`, // Resident Set Size
            heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`, // Total heap size
            heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`, // Heap used
            external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB` // C++ objects outside of V8's heap
        };
        return res.success({
            message: formattedMemoryUsage
        });
    }

    /**
     * Retrieves CPU usage statistics for each CPU core.
     *
     * @param {Object} req - The incoming request object.
     * @param {Object} res - The response object with a custom success method.
     * @returns {Object} - Success response with CPU usage details.
     */
    cpuUsage(req, res) {
        const cpus = os.cpus(); // Get CPU information
        const cpuUsage = cpus.map((cpu, index) => {
            const times = cpu.times; // CPU time stats
            const total = Object.values(times).reduce((acc, time) => acc + time, 0); // Total time used
            const usage = {
                model: cpu.model, // CPU model
                speed: cpu.speed, // CPU speed in MHz
                usage: {
                    user: `${((times.user / total) * 100).toFixed(2)}%`, // User time usage
                    nice: `${((times.nice / total) * 100).toFixed(2)}%`, // Nice time usage
                    sys: `${((times.sys / total) * 100).toFixed(2)}%`, // System time usage
                    idle: `${((times.idle / total) * 100).toFixed(2)}%`, // Idle time
                    irq: `${((times.irq / total) * 100).toFixed(2)}%` // Interrupt time usage
                }
            };
            return { cpu: index + 1, ...usage }; // Return CPU index and usage
        });
        return res.success({
            message: cpuUsage // Send back CPU usage information
        });
    }
}