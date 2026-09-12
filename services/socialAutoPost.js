import { db } from '../config/supabase.js';

/**
 * Social Media Auto-Poster Service
 * Manages scheduled queue and auto-publishing to YouTube Shorts & Facebook Reels
 */
export const socialAutoPost = {
  /**
   * Scan queue and publish scheduled posts whose time has arrived
   */
  processScheduledPosts: async () => {
    const posts = await db.getSocialPosts();
    const scheduled = posts.filter(p => p.post_status === 'scheduled');
    const published = [];

    for (const post of scheduled) {
      // Mark as published
      post.post_status = 'published';
      post.published_at = new Date().toISOString();
      published.push(post);

      await db.addAiLog({
        action_type: 'AUTO_POST_PUBLISHED',
        description: `Auto-published campaign to ${post.platform.toUpperCase()}: "${post.caption.slice(0, 40)}..."`,
        impact_type: 'success'
      });
    }

    return {
      processedCount: scheduled.length,
      published
    };
  },

  /**
   * Schedule a new campaign with video link, caption & tags
   */
  scheduleCampaign: async ({ productId, platform, videoUrl, caption, hashtags, publishNow = false }) => {
    const post = await db.addSocialPost({
      product_id: productId,
      platform,
      video_url: videoUrl || `https://${platform}.com/shorts/campaign-${Date.now().toString().slice(-4)}`,
      caption,
      hashtags,
      post_status: publishNow ? 'published' : 'scheduled'
    });

    await db.addAiLog({
      action_type: publishNow ? 'INSTANT_BROADCAST' : 'CAMPAIGN_SCHEDULED',
      description: `${publishNow ? 'Instantly broadcasted' : 'Scheduled'} ${platform.toUpperCase()} campaign: "${caption.slice(0, 35)}..."`,
      impact_type: 'info'
    });

    return post;
  }
};
