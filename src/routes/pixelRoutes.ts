import { Router, Express } from 'express';
import PixelController from '../controllers/pixelController';

const router = Router();
const pixelController = new PixelController();

export function setPixelRoutes(app: Express) {
    app.post('/track-pixel', pixelController.trackPixel.bind(pixelController));
    app.get('/analytics', pixelController.getAnalytics.bind(pixelController));
}

export default router;