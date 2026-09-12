import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { db } from '../config/supabase.js';

dotenv.config();

let aiClient = null;

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

/**
 * AI Product Evaluation & Profit Calculation Engine
 * Profit Formula: Selling Price - Cost Price - Platform Fees - Shipping Cost
 */
export async function analyzeProductWithAI({ title, category, costPrice, sellingPrice, platform = 'shopify', supplierInfo = '' }) {
  const cost = parseFloat(costPrice) || 0;
  const selling = parseFloat(sellingPrice) || 0;
  
  // Platform fee rules
  const feeRates = {
    shopify: 0.02, // 2% transaction fee + gateway
    flipkart: 0.14, // 14% marketplace commission + collection
    amazon: 0.15, // 15% referral fee
    meesho: 0.00 // 0% commission (standard Meesho policy, with minor fulfillment)
  };
  const platformFee = parseFloat((selling * (feeRates[platform.toLowerCase()] ?? 0.10)).toFixed(2));
  const shippingCost = platform.toLowerCase() === 'meesho' ? 65 : 85;
  const netProfit = parseFloat((selling - cost - platformFee - shippingCost).toFixed(2));
  const marginPercentage = selling > 0 ? parseFloat(((netProfit / selling) * 100).toFixed(1)) : 0;

  const client = getAiClient();

  if (client) {
    try {
      const prompt = `You are a Senior E-commerce AI Specialist for Smart Money AI Commerce.
Analyze this dropshipping/retail product:
- Product Title: ${title}
- Category: ${category || 'General'}
- Target Platform: ${platform}
- Cost Price: ₹${cost}
- Selling Price: ₹${selling}
- Estimated Platform Fees: ₹${platformFee}
- Shipping Cost: ₹${shippingCost}
- Net Profit: ₹${netProfit} (${marginPercentage}%)
- Supplier Info: ${supplierInfo || 'Direct Manufacturer'}

Return ONLY a valid JSON object with:
{
  "demandScore": <number between 70 and 99>,
  "riskLevel": "<Low|Medium|High>",
  "targetAudience": "<target demographic>",
  "competitionLevel": "<Low|Medium|High>",
  "suggestedSellingPrice": <number>,
  "aiRecommendation": "<actionable 2-sentence advice for maximum sales>",
  "keySellingPoints": ["<point 1>", "<point 2>", "<point 3>"],
  "trendingKeywords": ["<kw1>", "<kw2>", "<kw3>", "<kw4>"]
}`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text.trim());
      
      // Log AI Action
      await db.addAiLog({
        action_type: 'PRODUCT_EVALUATION',
        description: `Evaluated "${title}" for ${platform.toUpperCase()}: Profit ₹${netProfit} (${marginPercentage}%), Demand Score ${parsed.demandScore}/100`,
        impact_type: netProfit > 0 ? 'success' : 'warning'
      });

      return {
        ...parsed,
        costPrice: cost,
        sellingPrice: selling,
        platformFees: platformFee,
        shippingCost,
        netProfit,
        marginPercentage
      };
    } catch (err) {
      console.warn('Gemini API call failed, using heuristic engine:', err.message);
    }
  }

  // Resilient heuristic engine if Gemini API key not present or network issues
  const estimatedDemand = Math.min(96, Math.max(72, Math.floor(82 + (marginPercentage > 30 ? 10 : -5))));
  const suggestedSelling = Math.round(cost * 2.8);

  await db.addAiLog({
    action_type: 'PRODUCT_EVALUATION',
    description: `Analyzed "${title}": Estimated Net Profit ₹${netProfit} with ${marginPercentage}% margin.`,
    impact_type: 'info'
  });

  return {
    demandScore: estimatedDemand,
    riskLevel: marginPercentage < 20 ? 'High' : marginPercentage < 35 ? 'Medium' : 'Low',
    targetAudience: 'Tech-savvy millennials, online shoppers seeking value and trending lifestyle goods',
    competitionLevel: 'Medium',
    suggestedSellingPrice: suggestedSelling,
    aiRecommendation: `Promising margins of ${marginPercentage}%. We recommend bundling or running short-form video ads on YouTube Shorts & FB Reels to capture initial impulse buyers.`,
    keySellingPoints: [
      'High perceived value with solid supplier markup',
      'Compact lightweight dimensions minimizing shipping overhead',
      'Strong visual appeal suitable for viral video demonstrations'
    ],
    trendingKeywords: ['Trending Finds', 'Gadget Life', 'Must Have 2026', 'Smart Shopper'],
    costPrice: cost,
    sellingPrice: selling,
    platformFees: platformFee,
    shippingCost,
    netProfit,
    marginPercentage
  };
}

/**
 * AI Social Studio Generator: YouTube Shorts, Instagram Reels, Facebook Video Ads
 */
export async function generateSocialCampaignWithAI({ productTitle, productCategory, sellingPrice, platform = 'youtube' }) {
  const client = getAiClient();

  if (client) {
    try {
      const prompt = `You are a viral social media marketing director for Smart Money AI Commerce.
Create a high-CTR, viral video ad script and posting metadata for:
- Product: ${productTitle}
- Category: ${productCategory}
- Price: ₹${sellingPrice}
- Channel: ${platform === 'youtube' ? 'YouTube Shorts' : 'Facebook & Instagram Reels'}

Return ONLY a valid JSON object with:
{
  "caption": "<Engaging hook caption with call to action (max 150 chars)>",
  "hashtags": "<5-7 trending viral tags starting with #>",
  "videoScript": {
    "hook": "<3-second visual and audio hook>",
    "problem": "<5-second pain point>",
    "solution": "<10-second product demonstration>",
    "cta": "<3-second urgency call to action>"
  },
  "estimatedViralScore": <number between 80 and 99>
}`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text.trim());

      await db.addAiLog({
        action_type: 'VIRAL_CONTENT_CREATION',
        description: `Generated ${platform.toUpperCase()} viral campaign for "${productTitle}" (Viral Score: ${parsed.estimatedViralScore}%)`,
        impact_type: 'success'
      });

      return parsed;
    } catch (err) {
      console.warn('Gemini content generation failed, using template engine:', err.message);
    }
  }

  // Fallback intelligent templates
  const fallbackCaptions = {
    youtube: `🔥 NEVER thought this ₹${sellingPrice} gadget would replace my ₹5000 setup! Watch until the end 😱 Link in bio for 40% OFF!`,
    facebook: `Viral Alert 🚨 Everyone is obsessed with this! Grab yours before stock runs out at Smart Money Store. Free Cash On Delivery available! 🛒✨`
  };

  const hashtags = platform === 'youtube' 
    ? '#Shorts #TrendingTech #AmazonFinds #ShopifyStore #SmartCommerce #ViralGadgets'
    : '#ReelsViral #MustHave #OnlineShopping #DealsOfTheDay #FacebookShop #DropshipIndia';

  await db.addAiLog({
    action_type: 'VIRAL_CONTENT_CREATION',
    description: `Generated AI marketing template for ${platform.toUpperCase()}: "${productTitle.slice(0, 30)}..."`,
    impact_type: 'info'
  });

  return {
    caption: fallbackCaptions[platform] || fallbackCaptions.youtube,
    hashtags,
    videoScript: {
      hook: 'Stop scrolling! If you do online shopping in 2026, you NEED to see this...',
      problem: 'Tired of overpaying for branded accessories that break in two weeks?',
      solution: `Check out the ${productTitle} — direct from verified manufacturer with premium build and instant utility.`,
      cta: `Tap the link to lock in the ₹${sellingPrice} launch discount today!`
    },
    estimatedViralScore: 91
  };
}
