import { UserAgentInfo } from '../types';

export function formatDate(date: Date): string {
    return date.toISOString();
}

export function generateUniqueId(): string {
    return 'id-' + Math.random().toString(36).substr(2, 9);
}

export function getIpAddress(req: any): string {
    // Check for IP from various proxy headers first
    let ip =
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.headers['x-real-ip'] ||
        req.headers['cf-connecting-ip'] ||
        req.socket?.remoteAddress ||
        'unknown';

    // Remove IPv6 prefix if present
    if (ip.includes('::ffff:')) {
        ip = ip.replace('::ffff:', '');
    }

    return ip;
}

export function parseUserAgent(userAgent: string): UserAgentInfo {
    const isMobile =
        /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(
            userAgent
        );
    const deviceType = isMobile ? 'mobile' : 'desktop';

    let browserType = 'Unknown';
    let browserVersion = undefined;
    let operatingSystem = 'Unknown';
    let osVersion = undefined;

    // Browser detection
    if (/edg/i.test(userAgent)) {
        browserType = 'Edge';
        const match = userAgent.match(/edg[e]?\/(\d+(\.\d+)?)/i);
        browserVersion = match ? match[1] : undefined;
    } else if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) {
        browserType = 'Chrome';
        const match = userAgent.match(/chrome\/(\d+(\.\d+)?)/i);
        browserVersion = match ? match[1] : undefined;
    } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
        browserType = 'Safari';
        const match = userAgent.match(/version\/(\d+(\.\d+)?)/i);
        browserVersion = match ? match[1] : undefined;
    } else if (/firefox/i.test(userAgent)) {
        browserType = 'Firefox';
        const match = userAgent.match(/firefox\/(\d+(\.\d+)?)/i);
        browserVersion = match ? match[1] : undefined;
    } else if (/msie|trident/i.test(userAgent)) {
        browserType = 'Internet Explorer';
        const match = userAgent.match(/(?:msie |rv:)(\d+(\.\d+)?)/i);
        browserVersion = match ? match[1] : undefined;
    }

    // OS detection - check mobile OSes first
    if (/iphone|ipad|ipod/i.test(userAgent)) {
        operatingSystem = 'iOS';
        const match = userAgent.match(/os (\d+(_\d+)?)/i);
        osVersion = match ? match[1].replace(/_/g, '.') : undefined;
    } else if (/android/i.test(userAgent)) {
        operatingSystem = 'Android';
        const match = userAgent.match(/android (\d+(\.\d+)?)/i);
        osVersion = match ? match[1] : undefined;
    } else if (/windows/i.test(userAgent)) {
        operatingSystem = 'Windows';
        const match = userAgent.match(/windows nt (\d+\.\d+)/i);
        if (match) {
            const version = match[1];
            osVersion = versionToWindowsName(version);
        }
    } else if (/macintosh|mac os x/i.test(userAgent)) {
        operatingSystem = 'macOS';
        const match = userAgent.match(/mac os x ([\d_]+)/i);
        osVersion = match ? match[1].replace(/_/g, '.') : undefined;
    } else if (/linux/i.test(userAgent)) {
        operatingSystem = 'Linux';
    }

    return {
        browserType,
        browserVersion,
        operatingSystem,
        osVersion,
        deviceType,
    };
}

function versionToWindowsName(version: string): string {
    const versions: Record<string, string> = {
        '10.0': 'Windows 10',
        '6.3': 'Windows 8.1',
        '6.2': 'Windows 8',
        '6.1': 'Windows 7',
        '6.0': 'Windows Vista',
        '5.2': 'Windows XP x64',
        '5.1': 'Windows XP',
    };
    return versions[version] || `Windows ${version}`;
}