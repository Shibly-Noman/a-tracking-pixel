import { Router, Express } from 'express';
import PixelController from '../controllers/pixelController';
import { contentService } from '../services';

const router = Router();

// Use shared service instances
const pixelController = new PixelController();

export function setPixelRoutes(app: Express) {
    // Existing pixel tracking routes
    app.post('/track-pixel', pixelController.trackPixel.bind(pixelController));
    app.get('/analytics', pixelController.getAnalytics.bind(pixelController));
    
    // Content tracking route
    app.post('/api/track-content-event', pixelController.trackContentEvent.bind(pixelController));
}

export default router;
export { pixelController, contentService };