import express from 'express';
import path from 'path';
import { setPixelRoutes } from './routes/pixelRoutes';
import { logRequest } from './middleware/logging';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS headers for API requests from frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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

// Serve the dashboard at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Dashboard available at http://localhost:${PORT}`);
});