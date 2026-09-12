import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';

import { db } from './config/supabase.js';
import { analyzeProductWithAI, generateSocialCampaignWithAI } from './services/aiEngine.js';
import { storeSync } from './services/storeSync.js';
import { socialAutoPost } from './services/socialAutoPost.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Default to 3000 in container environment, or fallback to process.env.PORT
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static assets from public folder
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// --- BACKGROUND AUTOMATION WORKERS (CRON JOBS) ---
// 1. Inventory & Supplier Sync: Runs every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  try {
    console.log('⏰ [Cron] Running automated store & supplier inventory sync...');
    await storeSync.syncAllStores();
    await storeSync.syncSupplierCatalog();
  } catch (err) {
    console.error('❌ [Cron Error] Store sync failed:', err.message);
  }
});

// 2. Social Auto-Posting Worker: Runs every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  try {
    console.log('⏰ [Cron] Checking scheduled social media viral campaigns...');
    await socialAutoPost.processScheduledPosts();
  } catch (err) {
    console.error('❌ [Cron Error] Social auto-post failed:', err.message);
  }
});

// --- REST API ROUTES ---

// Health & System Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Smart Money AI Commerce',
    version: '1.0.0',
    port: PORT,
    supabaseConnected: db.isSupabaseConnected(),
    geminiActive: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Dashboard Real-time Metrics
app.get('/api/metrics', async (req, res) => {
  try {
    const orders = await db.getOrders();
    const products = await db.getProducts();
    const stores = await db.getStores();
    const logs = await db.getAiLogs();

    const totalRevenue = orders.reduce((acc, curr) => acc + (parseFloat(curr.revenue) || 0), 0);
    const totalProfit = orders.reduce((acc, curr) => acc + (parseFloat(curr.net_profit) || 0), 0);
    const settledEarnings = orders
      .filter(o => o.order_status === 'settled')
      .reduce((acc, curr) => acc + (parseFloat(curr.net_profit) || 0), 0);

    const activeStores = stores.filter(s => s.status === 'active').length;
    const activeAiTasks = logs.filter(l => l.impact_type === 'auto_fix' || l.impact_type === 'success').length + 3;

    res.json({
      todayRevenue: totalRevenue,
      estimatedProfit: totalProfit,
      settledEarnings,
      activeAiTasks,
      connectedStores: activeStores,
      totalProducts: products.length,
      totalOrders: orders.length,
      supabaseStatus: db.isSupabaseConnected() ? 'Cloud Supabase Connected' : 'Resilient Interactive Store'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stores Management
app.get('/api/stores', async (req, res) => {
  try {
    const stores = await db.getStores();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/stores', async (req, res) => {
  try {
    const { store_name, platform, api_key, api_secret, access_token } = req.body;
    if (!store_name || !platform) {
      return res.status(400).json({ error: 'Store name and platform are required' });
    }

    const created = await db.addStore({
      store_name,
      platform,
      api_key,
      api_secret,
      access_token,
      status: 'active'
    });

    await db.addAiLog({
      action_type: 'STORE_INTEGRATION',
      description: `Integrated ${platform.toUpperCase()} store: "${store_name}" with automated API synchronization.`,
      impact_type: 'success'
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Products Management
app.get('/api/products', async (req, res) => {
  try {
    const products = await db.getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { title, category, cost_price, selling_price, stock_quantity, store_id, supplier_name } = req.body;
    if (!title || !cost_price || !selling_price) {
      return res.status(400).json({ error: 'Title, cost price, and selling price are required' });
    }

    const created = await db.addProduct({
      title,
      category,
      cost_price,
      selling_price,
      stock_quantity,
      store_id,
      supplier_name
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Product Evaluation & Profit Engine
app.post('/api/products/analyze', async (req, res) => {
  try {
    const { title, category, costPrice, sellingPrice, platform, supplierInfo } = req.body;
    if (!title || !costPrice || !sellingPrice) {
      return res.status(400).json({ error: 'Title, cost price, and selling price are required for AI analysis' });
    }

    const analysis = await analyzeProductWithAI({
      title,
      category,
      costPrice,
      sellingPrice,
      platform,
      supplierInfo
    });

    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Push / Publish Product to Store
app.post('/api/products/publish', async (req, res) => {
  try {
    const { storeId, productData } = req.body;
    const result = await storeSync.publishProductToStore(storeId, productData);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders Management
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await db.getOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { store_id, product_id, order_number, revenue, net_profit, order_status } = req.body;
    const created = await db.addOrder({
      store_id,
      product_id,
      order_number,
      revenue,
      net_profit,
      order_status
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Social Marketing Studio
app.get('/api/social/posts', async (req, res) => {
  try {
    const posts = await db.getSocialPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Social Campaign Script Generator
app.post('/api/social/generate', async (req, res) => {
  try {
    const { productTitle, productCategory, sellingPrice, platform } = req.body;
    if (!productTitle) {
      return res.status(400).json({ error: 'Product title is required' });
    }

    const script = await generateSocialCampaignWithAI({
      productTitle,
      productCategory: productCategory || 'E-commerce',
      sellingPrice: sellingPrice || 999,
      platform: platform || 'youtube'
    });

    res.json(script);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Schedule Social Post
app.post('/api/social/schedule', async (req, res) => {
  try {
    const { productId, platform, videoUrl, caption, hashtags, publishNow } = req.body;
    if (!caption) {
      return res.status(400).json({ error: 'Post caption is required' });
    }

    const post = await socialAutoPost.scheduleCampaign({
      productId,
      platform,
      videoUrl,
      caption,
      hashtags,
      publishNow
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Trigger Instant Social Queue Processing
app.post('/api/social/auto-publish-now', async (req, res) => {
  try {
    const result = await socialAutoPost.processScheduledPosts();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Logs
app.get('/api/ai/logs', async (req, res) => {
  try {
    const logs = await db.getAiLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Manual Sync Triggers
app.post('/api/sync/stores', async (req, res) => {
  try {
    const results = await storeSync.syncAllStores();
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sync/suppliers', async (req, res) => {
  try {
    const results = await storeSync.syncSupplierCatalog();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Settings: Dynamic Supabase Configuration
app.post('/api/settings/supabase', async (req, res) => {
  try {
    const { url, key } = req.body;
    const result = db.updateConfig(url, key);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// HTML page routing fallbacks
const htmlPages = [
  'index',
  'dashboard',
  'products',
  'stores',
  'orders',
  'social-studio',
  'settings'
];

htmlPages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(publicDir, `${page}.html`));
  });
});

app.use((req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Smart Money AI Commerce Server running at http://0.0.0.0:${PORT}`);
});
