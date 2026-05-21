const express = require('express');
const path = require('path');
const client = require('prom-client');

const app = express();

const PORT = 3000;

/**
 * -----------------------------
 * Prometheus Metrics Setup
 * -----------------------------
 */

// Collect default system metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics();

// Custom counter (optional example metric)
const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
});

// Middleware to count requests
app.use((req, res, next) => {
    httpRequestsTotal.inc();
    next();
});

/**
 * -----------------------------
 * Routes
 * -----------------------------
 */

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

// Health check endpoint (useful for Kubernetes probes)
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * -----------------------------
 * Start Server
 * -----------------------------
 */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
