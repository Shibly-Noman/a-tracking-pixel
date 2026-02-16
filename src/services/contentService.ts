import { SocialMediaContent, ContentFilters } from '../types';

export class ContentService {
    private contents: Map<string, SocialMediaContent> = new Map();

    /**
     * Create new content
     */
    create(content: SocialMediaContent): SocialMediaContent {
        // Validate content_id uniqueness
        if (this.contents.has(content.content_id)) {
            throw new Error(`Content with ID ${content.content_id} already exists`);
        }

        // Add timestamps
        const newContent: SocialMediaContent = {
            ...content,
            created_at: new Date(),
            updated_at: new Date(),
        };

        this.contents.set(content.content_id, newContent);
        console.log('Content created:', content.content_id);
        return newContent;
    }

    /**
     * Get content by ID
     */
    getById(contentId: string): SocialMediaContent | undefined {
        return this.contents.get(contentId);
    }

    /**
     * Get all content with optional filters
     */
    getAll(filters?: ContentFilters): SocialMediaContent[] {
        let contents = Array.from(this.contents.values());

        if (filters) {
            if (filters.platform) {
                contents = contents.filter(c => c.platform === filters.platform);
            }
            if (filters.status) {
                contents = contents.filter(c => c.status === filters.status);
            }
            if (filters.campaign_objective) {
                contents = contents.filter(c => c.campaign_mapping.objective === filters.campaign_objective);
            }
        }

        return contents;
    }

    /**
     * Update existing content
     */
    update(contentId: string, updates: Partial<SocialMediaContent>): SocialMediaContent {
        const existingContent = this.contents.get(contentId);
        
        if (!existingContent) {
            throw new Error(`Content with ID ${contentId} not found`);
        }

        // Prevent content_id from being changed
        if (updates.content_id && updates.content_id !== contentId) {
            throw new Error('Cannot change content_id');
        }

        const updatedContent: SocialMediaContent = {
            ...existingContent,
            ...updates,
            content_id: contentId, // Ensure content_id stays the same
            created_at: existingContent.created_at, // Preserve creation date
            updated_at: new Date(),
        };

        this.contents.set(contentId, updatedContent);
        console.log('Content updated:', contentId);
        return updatedContent;
    }

    /**
     * Delete content
     */
    delete(contentId: string): boolean {
        const deleted = this.contents.delete(contentId);
        if (deleted) {
            console.log('Content deleted:', contentId);
        }
        return deleted;
    }

    /**
     * Get content by platform
     */
    getByPlatform(platform: string): SocialMediaContent[] {
        return Array.from(this.contents.values()).filter(c => c.platform === platform);
    }

    /**
     * Get content by status
     */
    getByStatus(status: string): SocialMediaContent[] {
        return Array.from(this.contents.values()).filter(c => c.status === status);
    }

    /**
     * Get content by campaign objective
     */
    getByCampaignObjective(objective: string): SocialMediaContent[] {
        return Array.from(this.contents.values()).filter(
            c => c.campaign_mapping.objective === objective
        );
    }

    /**
     * Check if content exists
     */
    exists(contentId: string): boolean {
        return this.contents.has(contentId);
    }

    /**
     * Get total content count
     */
    getCount(): number {
        return this.contents.size;
    }

    /**
     * Clear all content (for testing)
     */
    clearAll(): void {
        this.contents.clear();
        console.log('All content cleared');
    }

    /**
     * Bulk create content (for seeding)
     */
    bulkCreate(contents: SocialMediaContent[]): SocialMediaContent[] {
        const created: SocialMediaContent[] = [];
        
        for (const content of contents) {
            try {
                const newContent = this.create(content);
                created.push(newContent);
            } catch (error) {
                console.error(`Failed to create content ${content.content_id}:`, error);
            }
        }
        
        return created;
    }
}
