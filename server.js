#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use((req, res, next) => {
    // Security headers
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; connect-src 'self' https://api.trusted.com; img-src 'self' data: https:; font-src 'self' https://cdnjs.cloudflare.com;");
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname), {
    maxAge: '1y',
    etag: true,
    lastModified: true
}));

// Special handling for service worker and manifest
app.get('/service-worker.js', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, 'service-worker.js'));
});

app.get('/manifest.json', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, 'manifest.json'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('healthy');
});

// SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Smart Unit Converter server running on port ${PORT}`);
    console.log(`📱 PWA ready at http://localhost:${PORT}`);
});
