import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let client = null;
let isConfigured = false;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('example.com') && !supabaseKey.includes('your-anon-key')) {
  try {
    client = createClient(supabaseUrl, supabaseKey);
    isConfigured = true;
    console.log('✅ Supabase Client Initialized with provided credentials');
  } catch (err) {
    console.warn('⚠️ Supabase Client init error, falling back to local store:', err.message);
  }
} else {
  console.log('ℹ️ Supabase not configured in .env. Running in interactive resilient mode.');
}

// In-Memory fallback store seeded with realistic initial data matching the Supabase SQL schema
const localStore = {
  stores: [
    {
      id: 'store-1',
      user_id: 'user-001',
      store_name: 'SmartTrend Shopify Pro',
      platform: 'shopify',
      api_key: 'shpat_live_9921****',
      api_secret: 'shpss_live_8831****',
      access_token: 'shpat_tok_live_active',
      status: 'active',
      created_at: new Date(Date.now() - 86400000 * 14).toISOString()
    },
    {
      id: 'store-2',
      user_id: 'user-001',
      store_name: 'Smart Commerce Flipkart Hub',
      platform: 'flipkart',
      api_key: 'fk_app_7741****',
      api_secret: 'fk_sec_6631****',
      access_token: 'fk_tok_active',
      status: 'active',
      created_at: new Date(Date.now() - 86400000 * 7).toISOString()
    },
    {
      id: 'store-3',
      user_id: 'user-001',
      store_name: 'Prime Retail Amazon Store',
      platform: 'amazon',
      api_key: 'amz_seller_5541****',
      api_secret: 'amz_sec_9912****',
      access_token: 'amz_tok_active',
      status: 'active',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ],
  products: [
    {
      id: 'prod-1',
      store_id: 'store-1',
      title: 'Ergonomic Magnetic Wireless Car Charger 15W',
      category: 'Electronics & Auto',
      cost_price: 320.00,
      selling_price: 1199.00,
      estimated_profit: 649.00,
      demand_score: 94,
      stock_quantity: 140,
      listing_status: 'active',
      supplier_name: 'Shenzhen FastTech Supplies',
      platform_fees: 110.00,
      shipping_cost: 120.00,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 'prod-2',
      store_id: 'store-2',
      title: 'Smart LED Sunset Atmosphere Lamp with App Control',
      category: 'Home & Decor',
      cost_price: 180.00,
      selling_price: 749.00,
      estimated_profit: 399.00,
      demand_score: 88,
      stock_quantity: 85,
      listing_status: 'active',
      supplier_name: 'Global Decor Dropship Ltd',
      platform_fees: 85.00,
      shipping_cost: 85.00,
      created_at: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    {
      id: 'prod-3',
      store_id: 'store-1',
      title: 'Portable Ultrasonic Travel Garment Steamer',
      category: 'Lifestyle & Travel',
      cost_price: 450.00,
      selling_price: 1599.00,
      estimated_profit: 829.00,
      demand_score: 91,
      stock_quantity: 60,
      listing_status: 'active',
      supplier_name: 'ModernLiving Logistics Hub',
      platform_fees: 160.00,
      shipping_cost: 160.00,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'prod-4',
      store_id: 'store-3',
      title: 'Titanium Acoustic Noise-Cancelling Earbuds Pro',
      category: 'Audio & Tech',
      cost_price: 650.00,
      selling_price: 2299.00,
      estimated_profit: 1189.00,
      demand_score: 96,
      stock_quantity: 42,
      listing_status: 'active',
      supplier_name: 'AudioPulse Direct Factory',
      platform_fees: 230.00,
      shipping_cost: 230.00,
      created_at: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ],
  orders: [
    {
      id: 'ord-1',
      store_id: 'store-1',
      product_id: 'prod-1',
      order_number: 'ORD-2026-9041',
      revenue: 1199.00,
      net_profit: 649.00,
      order_status: 'settled',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'ord-2',
      store_id: 'store-2',
      product_id: 'prod-2',
      order_number: 'ORD-2026-9042',
      revenue: 749.00,
      net_profit: 399.00,
      order_status: 'shipped',
      created_at: new Date(Date.now() - 3600000 * 7).toISOString()
    },
    {
      id: 'ord-3',
      store_id: 'store-3',
      product_id: 'prod-4',
      order_number: 'ORD-2026-9043',
      revenue: 2299.00,
      net_profit: 1189.00,
      order_status: 'settled',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: 'ord-4',
      store_id: 'store-1',
      product_id: 'prod-3',
      order_number: 'ORD-2026-9044',
      revenue: 1599.00,
      net_profit: 829.00,
      order_status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ],
  social_posts: [
    {
      id: 'post-1',
      product_id: 'prod-1',
      platform: 'youtube',
      video_url: 'https://youtube.com/shorts/ai-demo-car-charger-2026',
      caption: '🔥 Stop dropping your phone while driving! This 15W Magnetic Car Mount locks instantly and charges superfast.',
      hashtags: '#ViralTech #CarGadgets #AmazonFinds #SmartCommerce #Shorts',
      post_status: 'published',
      published_at: new Date(Date.now() - 3600000 * 10).toISOString()
    },
    {
      id: 'post-2',
      product_id: 'prod-2',
      platform: 'facebook',
      video_url: 'https://fb.watch/sunset-lamp-reels-trend',
      caption: 'Turn your bedroom into a golden hour aesthetic studio with just one tap 🌅✨ 50% Off Flash Sale this weekend only!',
      hashtags: '#AestheticRoom #SunsetLamp #HomeDecor #ReelsViral #SmartMoneyStore',
      post_status: 'published',
      published_at: new Date(Date.now() - 3600000 * 18).toISOString()
    },
    {
      id: 'post-3',
      product_id: 'prod-4',
      platform: 'youtube',
      video_url: 'https://youtube.com/shorts/titanium-earbuds-review',
      caption: 'Studio-grade acoustic noise cancelling under ₹2500? We tested the Titanium Pro in busy metro traffic! 🎧⚡',
      hashtags: '#AudioTech #NoiseCancelling #Earbuds #GadgetReview #TrendingShorts',
      post_status: 'scheduled',
      published_at: null
    }
  ],
  ai_logs: [
    {
      id: 'log-1',
      action_type: 'PRICE_OPTIMIZATION',
      description: 'Auto-adjusted selling price for Magnetic Wireless Charger to ₹1199 based on competitor benchmark (+18% margin).',
      impact_type: 'auto_fix',
      created_at: new Date(Date.now() - 3600000 * 1).toISOString()
    },
    {
      id: 'log-2',
      action_type: 'CONTENT_GENERATION',
      description: 'Generated viral script and high-CTR caption for Sunset Lamp targeted to Instagram Reels & YouTube Shorts.',
      impact_type: 'success',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: 'log-3',
      action_type: 'CATALOG_SYNC',
      description: 'Synchronized 4 supplier inventory feeds across Shopify & Flipkart with zero stockout discrepancy.',
      impact_type: 'info',
      created_at: new Date(Date.now() - 3600000 * 6).toISOString()
    }
  ]
};

// Unified Database Provider
export const db = {
  isSupabaseConnected: () => isConfigured,

  updateConfig: (url, key) => {
    if (url && key) {
      try {
        client = createClient(url, key);
        isConfigured = true;
        return { success: true, message: 'Supabase connected successfully' };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }
    return { success: false, error: 'Missing URL or Key' };
  },

  // STORES
  getStores: async () => {
    if (isConfigured && client) {
      const { data, error } = await client.from('stores').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return localStore.stores;
  },

  addStore: async (store) => {
    const newStore = {
      id: store.id || `store-${Date.now()}`,
      user_id: store.user_id || 'user-001',
      store_name: store.store_name,
      platform: store.platform,
      api_key: store.api_key || '',
      api_secret: store.api_secret || '',
      access_token: store.access_token || '',
      status: store.status || 'active',
      created_at: new Date().toISOString()
    };
    if (isConfigured && client) {
      const { data, error } = await client.from('stores').insert([newStore]).select();
      if (!error && data) return data[0];
    }
    localStore.stores.unshift(newStore);
    return newStore;
  },

  // PRODUCTS
  getProducts: async () => {
    if (isConfigured && client) {
      const { data, error } = await client.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return localStore.products;
  },

  addProduct: async (product) => {
    const cost = parseFloat(product.cost_price) || 0;
    const selling = parseFloat(product.selling_price) || 0;
    const platformFees = parseFloat(product.platform_fees) || (selling * 0.12);
    const shipping = parseFloat(product.shipping_cost) || 75;
    const netProfit = selling - cost - platformFees - shipping;

    const newProd = {
      id: product.id || `prod-${Date.now()}`,
      store_id: product.store_id || (localStore.stores[0] ? localStore.stores[0].id : 'store-1'),
      title: product.title,
      category: product.category || 'General Electronics',
      cost_price: cost,
      selling_price: selling,
      estimated_profit: parseFloat(netProfit.toFixed(2)),
      demand_score: product.demand_score || Math.floor(Math.random() * 25 + 75),
      stock_quantity: parseInt(product.stock_quantity, 10) || 50,
      listing_status: product.listing_status || 'active',
      supplier_name: product.supplier_name || 'Verified Direct Supplier',
      created_at: new Date().toISOString()
    };
    if (isConfigured && client) {
      const { data, error } = await client.from('products').insert([newProd]).select();
      if (!error && data) return data[0];
    }
    localStore.products.unshift(newProd);
    return newProd;
  },

  // ORDERS
  getOrders: async () => {
    if (isConfigured && client) {
      const { data, error } = await client.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return localStore.orders;
  },

  addOrder: async (order) => {
    const newOrder = {
      id: order.id || `ord-${Date.now()}`,
      store_id: order.store_id || 'store-1',
      product_id: order.product_id || (localStore.products[0]?.id || 'prod-1'),
      order_number: order.order_number || `ORD-${Date.now().toString().slice(-6)}`,
      revenue: parseFloat(order.revenue) || 999.00,
      net_profit: parseFloat(order.net_profit) || 450.00,
      order_status: order.order_status || 'pending',
      created_at: new Date().toISOString()
    };
    if (isConfigured && client) {
      const { data, error } = await client.from('orders').insert([newOrder]).select();
      if (!error && data) return data[0];
    }
    localStore.orders.unshift(newOrder);
    return newOrder;
  },

  // SOCIAL POSTS
  getSocialPosts: async () => {
    if (isConfigured && client) {
      const { data, error } = await client.from('social_posts').select('*').order('published_at', { ascending: false, nullsFirst: true });
      if (!error && data) return data;
    }
    return localStore.social_posts;
  },

  addSocialPost: async (post) => {
    const newPost = {
      id: post.id || `post-${Date.now()}`,
      product_id: post.product_id || null,
      platform: post.platform || 'youtube',
      video_url: post.video_url || '',
      caption: post.caption || '',
      hashtags: post.hashtags || '',
      post_status: post.post_status || 'scheduled',
      published_at: post.post_status === 'published' ? new Date().toISOString() : null
    };
    if (isConfigured && client) {
      const { data, error } = await client.from('social_posts').insert([newPost]).select();
      if (!error && data) return data[0];
    }
    localStore.social_posts.unshift(newPost);
    return newPost;
  },

  // AI LOGS
  getAiLogs: async () => {
    if (isConfigured && client) {
      const { data, error } = await client.from('ai_logs').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return localStore.ai_logs;
  },

  addAiLog: async (log) => {
    const newLog = {
      id: `log-${Date.now()}`,
      action_type: log.action_type || 'AI_EVENT',
      description: log.description,
      impact_type: log.impact_type || 'info',
      created_at: new Date().toISOString()
    };
    if (isConfigured && client) {
      const { data, error } = await client.from('ai_logs').insert([newLog]).select();
      if (!error && data) return data[0];
    }
    localStore.ai_logs.unshift(newLog);
    return newLog;
  }
};
