import request from 'supertest';
import express from 'express';
import { setPixelRoutes } from '../src/routes/pixelRoutes';
import { parseUserAgent, getIpAddress } from '../src/utils/helpers';
import { TrackerService } from '../src/services/trackerService';
import { AnalyticsService } from '../src/services/analyticsService';

const app = express();
app.use(express.json());
setPixelRoutes(app);

describe('Pixel Tracking API', () => {
    describe('POST /track-pixel', () => {
        it('should track a pixel with basic information', async () => {
            const response = await request(app)
                .post('/track-pixel')
                .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36')
                .send({
                    userId: 'user1',
                    eventType: 'page_view',
                    metadata: { page: '/home' },
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body).toHaveProperty('pixelId');
            expect(response.body).toHaveProperty('timestamp');
        });

        it('should capture browser information', async () => {
            const response = await request(app)
                .post('/track-pixel')
                .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36')
                .send({
                    userId: 'user2',
                    eventType: 'click',
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should capture mobile device information', async () => {
            const response = await request(app)
                .post('/track-pixel')
                .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15')
                .send({
                    userId: 'mobile_user',
                    eventType: 'page_view',
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should capture Android device information', async () => {
            const response = await request(app)
                .post('/track-pixel')
                .set('User-Agent', 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 Chrome/91.0.4472.120')
                .send({
                    userId: 'android_user',
                    eventType: 'click',
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should handle missing required fields', async () => {
            const response = await request(app)
                .post('/track-pixel')
                .send({
                    userId: 'user3',
                });

            // Should still succeed but with undefined eventType
            expect(response.status).toBe(200);
        });
    });

    describe('GET /analytics', () => {
        it('should retrieve analytics with no data', async () => {
            const response = await request(app).get('/analytics');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should retrieve analytics after tracking pixels', async () => {
            // Track multiple pixels
            await request(app)
                .post('/track-pixel')
                .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0 Safari/537.36')
                .send({
                    userId: 'user1',
                    eventType: 'page_view',
                });

            await request(app)
                .post('/track-pixel')
                .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6) AppleWebKit/605.1.15')
                .send({
                    userId: 'user2',
                    eventType: 'click',
                });

            const response = await request(app).get('/analytics');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('totalPixelsTracked');
            expect(response.body.data).toHaveProperty('uniqueUsers');
            expect(response.body.data).toHaveProperty('eventsByType');
            expect(response.body.data).toHaveProperty('deviceTypeBreakdown');
            expect(response.body.data).toHaveProperty('topBrowsers');
            expect(response.body.data).toHaveProperty('topOperatingSystems');
            expect(response.body.data).toHaveProperty('timestampRange');
        });

        it('should report device type breakdown', async () => {
            const response = await request(app).get('/analytics');

            expect(response.status).toBe(200);
            if (response.body.data.totalPixelsTracked > 0) {
                expect(response.body.data.deviceTypeBreakdown).toHaveProperty('mobile');
                expect(response.body.data.deviceTypeBreakdown).toHaveProperty('desktop');
            }
        });

        it('should report top browsers', async () => {
            const response = await request(app).get('/analytics');

            expect(response.status).toBe(200);
            if (response.body.data.totalPixelsTracked > 0) {
                expect(Array.isArray(response.body.data.topBrowsers)).toBe(true);
                if (response.body.data.topBrowsers.length > 0) {
                    expect(response.body.data.topBrowsers[0]).toHaveProperty('browser');
                    expect(response.body.data.topBrowsers[0]).toHaveProperty('count');
                }
            }
        });

        it('should report top operating systems', async () => {
            const response = await request(app).get('/analytics');

            expect(response.status).toBe(200);
            if (response.body.data.totalPixelsTracked > 0) {
                expect(Array.isArray(response.body.data.topOperatingSystems)).toBe(true);
                if (response.body.data.topOperatingSystems.length > 0) {
                    expect(response.body.data.topOperatingSystems[0]).toHaveProperty('os');
                    expect(response.body.data.topOperatingSystems[0]).toHaveProperty('count');
                }
            }
        });
    });
});

describe('User Agent Parsing', () => {
    it('should detect Chrome browser on Windows', () => {
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36';
        const info = parseUserAgent(userAgent);

        expect(info.browserType).toBe('Chrome');
        expect(info.operatingSystem).toBe('Windows');
        expect(info.deviceType).toBe('desktop');
        expect(info.browserVersion).toBeDefined();
    });

    it('should detect Safari browser on macOS', () => {
        const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15';
        const info = parseUserAgent(userAgent);

        expect(info.browserType).toBe('Safari');
        expect(info.operatingSystem).toBe('macOS');
        expect(info.deviceType).toBe('desktop');
    });

    it('should detect Firefox browser', () => {
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0';
        const info = parseUserAgent(userAgent);

        expect(info.browserType).toBe('Firefox');
        expect(info.operatingSystem).toBe('Windows');
        expect(info.deviceType).toBe('desktop');
    });

    it('should detect Edge browser', () => {
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59';
        const info = parseUserAgent(userAgent);

        expect(info.browserType).toBe('Edge');
        expect(info.operatingSystem).toBe('Windows');
        expect(info.deviceType).toBe('desktop');
    });

    it('should detect iOS device', () => {
        const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1';
        const info = parseUserAgent(userAgent);

        expect(info.deviceType).toBe('mobile');
        expect(info.operatingSystem).toBe('iOS');
    });

    it('should detect Android device', () => {
        const userAgent = 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36';
        const info = parseUserAgent(userAgent);

        expect(info.deviceType).toBe('mobile');
        expect(info.operatingSystem).toBe('Android');
    });

    it('should detect Linux OS', () => {
        const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
        const info = parseUserAgent(userAgent);

        expect(info.operatingSystem).toBe('Linux');
        expect(info.deviceType).toBe('desktop');
    });

    it('should handle unknown user agents gracefully', () => {
        const userAgent = 'Custom Bot 1.0';
        const info = parseUserAgent(userAgent);

        expect(info.browserType).toBe('Unknown');
        expect(info.operatingSystem).toBe('Unknown');
        expect(info.deviceType).toBe('desktop');
    });
});

describe('TrackerService', () => {
    let trackerService: TrackerService;

    beforeEach(() => {
        trackerService = new TrackerService();
    });

    it('should log pixel data', () => {
        const pixelData = {
            id: 'test-id',
            timestamp: new Date(),
            userId: 'user1',
            eventType: 'click',
            ipAddress: '192.168.1.1',
            browserType: 'Chrome',
            browserVersion: '91.0',
            deviceType: 'desktop' as const,
            operatingSystem: 'Windows',
            osVersion: 'Windows 10',
            userAgent: 'Mozilla/5.0...',
        };

        trackerService.logPixel(pixelData);
        const data = trackerService.getPixelData();

        expect(data).toHaveLength(1);
        expect(data[0].id).toBe('test-id');
    });

    it('should filter pixels by user', () => {
        trackerService.logPixel({
            id: 'id1',
            timestamp: new Date(),
            userId: 'user1',
            eventType: 'click',
            ipAddress: '192.168.1.1',
            browserType: 'Chrome',
            deviceType: 'desktop',
            operatingSystem: 'Windows',
            userAgent: 'Mozilla/5.0...',
        });

        trackerService.logPixel({
            id: 'id2',
            timestamp: new Date(),
            userId: 'user2',
            eventType: 'view',
            ipAddress: '192.168.1.2',
            browserType: 'Firefox',
            deviceType: 'mobile',
            operatingSystem: 'iOS',
            userAgent: 'Mozilla/5.0...',
        });

        const user1Pixels = trackerService.getPixelsByUser('user1');
        expect(user1Pixels).toHaveLength(1);
        expect(user1Pixels[0].userId).toBe('user1');
    });

    it('should filter pixels by device type', () => {
        trackerService.logPixel({
            id: 'id1',
            timestamp: new Date(),
            userId: 'user1',
            eventType: 'click',
            ipAddress: '192.168.1.1',
            browserType: 'Chrome',
            deviceType: 'desktop',
            operatingSystem: 'Windows',
            userAgent: 'Mozilla/5.0...',
        });

        trackerService.logPixel({
            id: 'id2',
            timestamp: new Date(),
            userId: 'user2',
            eventType: 'view',
            ipAddress: '192.168.1.2',
            browserType: 'Safari',
            deviceType: 'mobile',
            operatingSystem: 'iOS',
            userAgent: 'Mozilla/5.0...',
        });

        const mobilePixels = trackerService.getPixelsByDeviceType('mobile');
        expect(mobilePixels).toHaveLength(1);
        expect(mobilePixels[0].deviceType).toBe('mobile');
    });

    it('should filter pixels by browser', () => {
        trackerService.logPixel({
            id: 'id1',
            timestamp: new Date(),
            userId: 'user1',
            eventType: 'click',
            ipAddress: '192.168.1.1',
            browserType: 'Chrome',
            deviceType: 'desktop',
            operatingSystem: 'Windows',
            userAgent: 'Mozilla/5.0...',
        });

        trackerService.logPixel({
            id: 'id2',
            timestamp: new Date(),
            userId: 'user2',
            eventType: 'view',
            ipAddress: '192.168.1.2',
            browserType: 'Firefox',
            deviceType: 'desktop',
            operatingSystem: 'Windows',
            userAgent: 'Mozilla/5.0...',
        });

        const chromePixels = trackerService.getPixelsByBrowser('Chrome');
        expect(chromePixels).toHaveLength(1);
        expect(chromePixels[0].browserType).toBe('Chrome');
    });

    it('should filter pixels by operating system', () => {
        trackerService.logPixel({
            id: 'id1',
            timestamp: new Date(),
            userId: 'user1',
            eventType: 'click',
            ipAddress: '192.168.1.1',
            browserType: 'Chrome',
            deviceType: 'desktop',
            operatingSystem: 'Windows',
            userAgent: 'Mozilla/5.0...',
        });

        trackerService.logPixel({
            id: 'id2',
            timestamp: new Date(),
            userId: 'user2',
            eventType: 'view',
            ipAddress: '192.168.1.2',
            browserType: 'Safari',
            deviceType: 'desktop',
            operatingSystem: 'macOS',
            userAgent: 'Mozilla/5.0...',
        });

        const windowsPixels = trackerService.getPixelsByOS('Windows');
        expect(windowsPixels).toHaveLength(1);
        expect(windowsPixels[0].operatingSystem).toBe('Windows');
    });

    it('should clear pixel data', () => {
        trackerService.logPixel({
            id: 'id1',
            timestamp: new Date(),
            userId: 'user1',
            eventType: 'click',
            ipAddress: '192.168.1.1',
            browserType: 'Chrome',
            deviceType: 'desktop',
            operatingSystem: 'Windows',
            userAgent: 'Mozilla/5.0...',
        });

        expect(trackerService.getPixelData()).toHaveLength(1);
        trackerService.clearPixelData();
        expect(trackerService.getPixelData()).toHaveLength(0);
    });
});

describe('AnalyticsService', () => {
    let analyticsService: AnalyticsService;

    beforeEach(() => {
        analyticsService = new AnalyticsService();
    });

    it('should analyze empty data', () => {
        const report = analyticsService.analyzeData([]);

        expect(report.totalPixelsTracked).toBe(0);
        expect(report.uniqueUsers).toBe(0);
        expect(report.eventsByType).toEqual({});
    });

    it('should analyze pixel data correctly', () => {
        const pixelData = [
            {
                id: 'id1',
                timestamp: new Date(),
                userId: 'user1',
                eventType: 'click',
                ipAddress: '192.168.1.1',
                browserType: 'Chrome',
                deviceType: 'desktop' as const,
                operatingSystem: 'Windows',
                userAgent: 'Mozilla/5.0...',
            },
            {
                id: 'id2',
                timestamp: new Date(),
                userId: 'user2',
                eventType: 'view',
                ipAddress: '192.168.1.2',
                browserType: 'Safari',
                deviceType: 'mobile' as const,
                operatingSystem: 'iOS',
                userAgent: 'Mozilla/5.0...',
            },
        ];

        const report = analyticsService.analyzeData(pixelData);

        expect(report.totalPixelsTracked).toBe(2);
        expect(report.uniqueUsers).toBe(2);
        expect(report.eventsByType['click']).toBe(1);
        expect(report.eventsByType['view']).toBe(1);
        expect(report.deviceTypeBreakdown.mobile).toBe(1);
        expect(report.deviceTypeBreakdown.desktop).toBe(1);
    });

    it('should generate a report', () => {
        const pixelData = [
            {
                id: 'id1',
                timestamp: new Date(),
                userId: 'user1',
                eventType: 'click',
                ipAddress: '192.168.1.1',
                browserType: 'Chrome',
                deviceType: 'desktop' as const,
                operatingSystem: 'Windows',
                userAgent: 'Mozilla/5.0...',
            },
        ];

        const report = analyticsService.analyzeData(pixelData);
        const reportString = analyticsService.generateReport(report);

        expect(typeof reportString).toBe('string');
        expect(reportString).toContain('Pixel Tracking Analytics Report');
        expect(reportString).toContain('Chrome');
        expect(reportString).toContain('Windows');
    });
});