import { PixelData } from '../types';

export class TrackerService {
    private pixelData: PixelData[] = [];

    logPixel(data: PixelData): void {
        this.pixelData.push({
            ...data,
            timestamp: new Date(data.timestamp),
        });
        console.log('Pixel logged:', data);
    }

    getPixelData(): PixelData[] {
        return this.pixelData;
    }

    getPixelsByUser(userId: string): PixelData[] {
        return this.pixelData.filter((pixel) => pixel.userId === userId);
    }

    getPixelsByDeviceType(deviceType: 'mobile' | 'desktop'): PixelData[] {
        return this.pixelData.filter((pixel) => pixel.deviceType === deviceType);
    }

    getPixelsByBrowser(browserType: string): PixelData[] {
        return this.pixelData.filter(
            (pixel) => pixel.browserType === browserType
        );
    }

    getPixelsByOS(operatingSystem: string): PixelData[] {
        return this.pixelData.filter(
            (pixel) => pixel.operatingSystem === operatingSystem
        );
    }

    clearPixelData(): void {
        this.pixelData = [];
    }
}