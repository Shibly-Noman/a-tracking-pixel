import { Router, Express } from 'express';
import ContentController from '../controllers/contentController';

const router = Router();
const contentController = new ContentController();

export function setContentRoutes(app: Express) {
    // Content Management Routes
    app.post('/api/content', contentController.createContent.bind(contentController));
    app.get('/api/content', contentController.getAllContent.bind(contentController));
    app.get('/api/content/:contentId', contentController.getContentById.bind(contentController));
    app.put('/api/content/:contentId', contentController.updateContent.bind(contentController));
    app.delete('/api/content/:contentId', contentController.deleteContent.bind(contentController));

    // Content Analytics Routes
    app.get('/api/content-analytics/:contentId', contentController.getContentAnalytics.bind(contentController));
    app.get('/api/content-analytics', contentController.getAggregatedAnalytics.bind(contentController));
    
    // Content Events Route
    app.get('/api/content/:contentId/events', contentController.getContentEvents.bind(contentController));
}

export default router;
export { contentController };
