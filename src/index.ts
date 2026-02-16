import express from 'express';
import path from 'path';
import { setPixelRoutes } from './routes/pixelRoutes';
import { setContentRoutes } from './routes/contentRoutes';
import { logRequest } from './middleware/logging';
import { seedDemoData } from './utils/seedData';
import { contentService, trackerService } from './services';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS headers for API requests from frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Expose-Headers', '*');
    
    // Disable caching for API responses to prevent 304 Not Modified issues
    res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.header('Surrogate-Control', 'no-store');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(logRequest);

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

// Routes
setPixelRoutes(app);
setContentRoutes(app);

// Serve the dashboard at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Seed demo data on startup using shared service instances
seedDemoData(contentService, trackerService);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Dashboard available at http://localhost:${PORT}`);
    console.log(`\nAPI Endpoints:`);
    console.log(`  - POST /track-pixel - Track generic pixel event`);
    console.log(`  - GET  /analytics - Get overall analytics`);
    console.log(`  - POST /api/track-content-event - Track content event`);
    console.log(`  - POST /api/content - Create content`);
    console.log(`  - GET  /api/content - Get all content`);
    console.log(`  - GET  /api/content/:id - Get specific content`);
    console.log(`  - PUT  /api/content/:id - Update content`);
    console.log(`  - DELETE /api/content/:id - Delete content`);
    console.log(`  - GET  /api/content-analytics/:id - Get content analytics`);
    console.log(`  - GET  /api/content-analytics - Get aggregated analytics`);
    console.log(`  - GET  /api/content/:id/events - Get content events`);
});