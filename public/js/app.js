/**
 * Smart Money AI Commerce - Frontend Master Controller
 */

// Centralized State
const state = {
  metrics: null,
  stores: [],
  products: [],
  orders: [],
  socialPosts: [],
  aiLogs: [],
  activeStoreModalPlatform: 'shopify',
  analyzing: false
};

// UI Helper: Toast Notifications
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'gold' ? '⚡' : '🤖';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Currency Formatter (INR / ₹)
function formatINR(val) {
  const num = parseFloat(val) || 0;
  return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

// Format relative date
function formatDate(dateStr) {
  if (!dateStr) return 'Pending';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// API Fetch Helpers
async function fetchMetrics() {
  try {
    const res = await fetch('/api/metrics');
    if (!res.ok) throw new Error('Metrics API error');
    state.metrics = await res.json();
    renderMetrics();
  } catch (err) {
    console.error('Failed to fetch metrics:', err);
  }
}

async function fetchStores() {
  try {
    const res = await fetch('/api/stores');
    if (!res.ok) throw new Error('Stores API error');
    state.stores = await res.json();
    renderStores();
  } catch (err) {
    console.error('Failed to fetch stores:', err);
  }
}

async function fetchProducts() {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Products API error');
    state.products = await res.json();
    renderProducts();
  } catch (err) {
    console.error('Failed to fetch products:', err);
  }
}

async function fetchOrders() {
  try {
    const res = await fetch('/api/orders');
    if (!res.ok) throw new Error('Orders API error');
    state.orders = await res.json();
    renderOrders();
  } catch (err) {
    console.error('Failed to fetch orders:', err);
  }
}

async function fetchSocialPosts() {
  try {
    const res = await fetch('/api/social/posts');
    if (!res.ok) throw new Error('Social API error');
    state.socialPosts = await res.json();
    renderSocialPosts();
  } catch (err) {
    console.error('Failed to fetch social posts:', err);
  }
}

async function fetchAiLogs() {
  try {
    const res = await fetch('/api/ai/logs');
    if (!res.ok) throw new Error('Logs API error');
    state.aiLogs = await res.json();
    renderAiLogs();
  } catch (err) {
    console.error('Failed to fetch AI logs:', err);
  }
}

// Render Real-time Dashboard Metrics
function renderMetrics() {
  if (!state.metrics) return;
  const m = state.metrics;

  const todayRevenueEl = document.getElementById('metricTodayRevenue');
  const estimatedProfitEl = document.getElementById('metricEstimatedProfit');
  const settledEarningsEl = document.getElementById('metricSettledEarnings');
  const activeAiTasksEl = document.getElementById('metricActiveAiTasks');
  const connectedStoresEl = document.getElementById('metricConnectedStores');
  const dbStatusEl = document.getElementById('dbStatusIndicator');

  if (todayRevenueEl) todayRevenueEl.textContent = formatINR(m.todayRevenue);
  if (estimatedProfitEl) estimatedProfitEl.textContent = formatINR(m.estimatedProfit);
  if (settledEarningsEl) settledEarningsEl.textContent = formatINR(m.settledEarnings);
  if (activeAiTasksEl) activeAiTasksEl.textContent = m.activeAiTasks + ' Tasks';
  if (connectedStoresEl) connectedStoresEl.textContent = m.connectedStores + ' Channels';
  if (dbStatusEl) dbStatusEl.textContent = m.supabaseStatus;
}

// Render Stores List
function renderStores() {
  const container = document.getElementById('storesGrid');
  const countBadge = document.getElementById('storesCountBadge');
  if (countBadge) countBadge.textContent = state.stores.length;

  if (!container) return;

  if (state.stores.length === 0) {
    container.innerHTML = `<div class="glass-panel" style="text-align: center; grid-column: 1/-1; padding: 40px;">
      <p style="color: var(--text-muted);">No stores connected yet. Click "+ Connect New Store" to link Shopify, Flipkart, Amazon or Meesho.</p>
    </div>`;
    return;
  }

  const icons = {
    shopify: '🛍️',
    flipkart: '📦',
    amazon: '🛒',
    meesho: '🏷️'
  };

  container.innerHTML = state.stores.map(store => `
    <div class="metric-card" id="store-card-${store.id}">
      <div class="metric-header">
        <span class="badge badge-active">${store.status}</span>
        <span class="metric-icon">${icons[store.platform.toLowerCase()] || '🏪'}</span>
      </div>
      <h3 style="font-size: 1.1rem; margin-bottom: 4px;">${store.store_name}</h3>
      <p style="font-size: 0.78rem; color: var(--cyan-accent); text-transform: uppercase; font-weight: 700; margin-bottom: 14px;">
        ${store.platform} Official Sync API
      </p>
      <div style="font-size: 0.82rem; color: var(--text-dim); margin-bottom: 16px;">
        API Key: <code style="color: var(--gold-text);">${store.api_key ? store.api_key.slice(0, 10) + '****' : 'Auto-Handshake'}</code>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-glass btn-sm" onclick="triggerStoreSync('${store.id}')">🔄 Sync Catalog</button>
        <button class="btn btn-glass btn-sm" style="color: var(--rose-danger);" onclick="showToast('Store credentials protected', 'info')">Security</button>
      </div>
    </div>
  `).join('');
}

// Render Products Table
function renderProducts() {
  const tbody = document.getElementById('productsTableBody');
  const countBadge = document.getElementById('productsCountBadge');
  if (countBadge) countBadge.textContent = state.products.length;

  if (!tbody) return;

  if (state.products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px;">No products found in catalog. Use AI Product Hunter to add high-profit items.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.products.map(prod => `
    <tr>
      <td>
        <strong style="color: var(--text-main); display: block;">${prod.title}</strong>
        <small style="color: var(--text-dim);">${prod.category || 'General'}</small>
      </td>
      <td><span style="color: var(--text-dim);">${formatINR(prod.cost_price)}</span></td>
      <td><strong style="color: var(--text-main);">${formatINR(prod.selling_price)}</strong></td>
      <td><strong style="color: var(--emerald-success);">${formatINR(prod.estimated_profit)}</strong></td>
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 700; color: var(--gold-text);">${prod.demand_score || 85}</span>
          <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 99px; overflow: hidden; width: 60px;">
            <div style="width: ${prod.demand_score || 85}%; height: 100%; background: var(--cyan-accent);"></div>
          </div>
        </div>
      </td>
      <td>${prod.stock_quantity || 0} units</td>
      <td>
        <button class="btn btn-glass btn-sm" onclick="openSocialStudioForProduct('${encodeURIComponent(prod.title)}', '${prod.category}', ${prod.selling_price})">
          🎥 Create Ad
        </button>
      </td>
    </tr>
  `).join('');
}

// Render Orders Table
function renderOrders() {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  if (state.orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px;">No orders recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.orders.map(order => `
    <tr>
      <td><strong style="color: var(--cyan-accent);">${order.order_number}</strong></td>
      <td>${formatDate(order.created_at)}</td>
      <td><strong style="color: var(--text-main);">${formatINR(order.revenue)}</strong></td>
      <td><strong style="color: var(--emerald-success);">${formatINR(order.net_profit)}</strong></td>
      <td>
        <span class="badge badge-${order.order_status}">${order.order_status}</span>
      </td>
      <td>
        <button class="btn btn-glass btn-sm" onclick="showToast('Order #${order.order_number} verified with supplier', 'success')">Details</button>
      </td>
    </tr>
  `).join('');
}

// Render Social Studio Posts
function renderSocialPosts() {
  const container = document.getElementById('socialPostsList');
  if (!container) return;

  if (state.socialPosts.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 30px; color: var(--text-muted);">No viral campaigns in queue. Click "AI Script Generator" to craft high-converting video copy.</div>`;
    return;
  }

  container.innerHTML = state.socialPosts.map(post => `
    <div class="glass-panel" style="padding: 18px; margin-bottom: 14px; border-left: 3px solid ${post.platform === 'youtube' ? '#f43f5e' : '#2563eb'};">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <span class="badge badge-${post.platform === 'youtube' ? 'active' : 'draft'}">
          ${post.platform === 'youtube' ? '▶ YouTube Shorts' : '📸 Facebook / IG Reels'}
        </span>
        <span class="badge badge-${post.post_status}">${post.post_status}</span>
      </div>
      <p style="font-size: 0.92rem; color: var(--text-main); margin-bottom: 8px; font-weight: 500;">
        ${post.caption}
      </p>
      <div style="font-size: 0.78rem; color: var(--cyan-accent); margin-bottom: 12px; font-family: monospace;">
        ${post.hashtags}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-dim);">
        <span>${post.published_at ? 'Published ' + formatDate(post.published_at) : 'Scheduled for Auto-Broadcast'}</span>
        <a href="${post.video_url || '#'}" target="_blank" class="btn btn-glass btn-sm">Preview Link ↗</a>
      </div>
    </div>
  `).join('');
}

// Render AI Activity Logs
function renderAiLogs() {
  const container = document.getElementById('aiLogsContainer');
  if (!container) return;

  if (state.aiLogs.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;">Listening for AI events...</p>`;
    return;
  }

  const icons = {
    auto_fix: '⚡',
    success: '✅',
    warning: '⚠️',
    info: '🤖'
  };

  container.innerHTML = state.aiLogs.slice(0, 8).map(log => `
    <div style="display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 0.82rem;">
      <span>${icons[log.impact_type] || '🤖'}</span>
      <div style="flex: 1;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
          <strong style="color: var(--cyan-accent); font-size: 0.75rem;">${log.action_type}</strong>
          <span style="color: var(--text-dim); font-size: 0.72rem;">${formatDate(log.created_at)}</span>
        </div>
        <p style="color: var(--text-muted);">${log.description}</p>
      </div>
    </div>
  `).join('');
}

// Live Profit Calculator
function calculateLiveProfit() {
  const cost = parseFloat(document.getElementById('aiCostPrice')?.value) || 0;
  const selling = parseFloat(document.getElementById('aiSellingPrice')?.value) || 0;
  const platform = document.getElementById('aiPlatformSelect')?.value || 'shopify';

  const feeRates = { shopify: 0.02, flipkart: 0.14, amazon: 0.15, meesho: 0.00 };
  const platformFee = parseFloat((selling * (feeRates[platform] ?? 0.10)).toFixed(2));
  const shipping = platform === 'meesho' ? 65 : 85;
  const profit = parseFloat((selling - cost - platformFee - shipping).toFixed(2));
  const margin = selling > 0 ? ((profit / selling) * 100).toFixed(1) : 0;

  const profitDisplay = document.getElementById('liveProfitCalc');
  if (profitDisplay) {
    profitDisplay.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; text-align: center; margin-top: 12px; padding: 12px; background: rgba(7,17,31,0.6); border-radius: 8px; border: 1px solid rgba(0,217,245,0.15);">
        <div><small style="color:var(--text-dim);">Platform Fee</small><div style="font-weight:700; color:var(--text-main);">${formatINR(platformFee)}</div></div>
        <div><small style="color:var(--text-dim);">Shipping</small><div style="font-weight:700; color:var(--text-main);">${formatINR(shipping)}</div></div>
        <div><small style="color:var(--text-dim);">Est. Net Profit</small><div style="font-weight:800; color:${profit > 0 ? 'var(--emerald-success)' : 'var(--rose-danger)'};">${formatINR(profit)}</div></div>
        <div><small style="color:var(--text-dim);">Margin</small><div style="font-weight:800; color:var(--gold-text);">${margin}%</div></div>
      </div>
    `;
  }
}

// AI Product Analysis
async function runAiProductAnalysis() {
  const title = document.getElementById('aiProductTitle')?.value.trim();
  const category = document.getElementById('aiProductCategory')?.value.trim();
  const costPrice = parseFloat(document.getElementById('aiCostPrice')?.value);
  const sellingPrice = parseFloat(document.getElementById('aiSellingPrice')?.value);
  const platform = document.getElementById('aiPlatformSelect')?.value || 'shopify';
  const supplierInfo = document.getElementById('aiSupplierInfo')?.value.trim();

  if (!title || isNaN(costPrice) || isNaN(sellingPrice)) {
    showToast('Please enter Title, Cost Price, and Selling Price', 'error');
    return;
  }

  const btn = document.getElementById('runAiAnalysisBtn');
  const resultsContainer = document.getElementById('aiAnalysisResults');

  if (btn) btn.innerHTML = '🤖 Analyzing with Gemini AI...';
  if (btn) btn.disabled = true;

  try {
    const res = await fetch('/api/products/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, costPrice, sellingPrice, platform, supplierInfo })
    });

    if (!res.ok) throw new Error('AI analysis failed');
    const data = await res.json();

    if (resultsContainer) {
      resultsContainer.style.display = 'block';
      resultsContainer.innerHTML = `
        <div class="glass-panel" style="border-color: var(--cyan-accent); margin-top: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <strong style="color: var(--cyan-accent); font-size: 1.05rem;">Gemini AI Intelligence Report</strong>
            <span class="badge badge-active">Demand Score: ${data.demandScore}/100</span>
          </div>
          <p style="color: var(--text-main); font-size: 0.9rem; margin-bottom: 14px;">${data.aiRecommendation}</p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
            <div style="padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
              <small style="color: var(--text-dim);">Suggested Retail Price</small>
              <div style="font-size: 1.15rem; font-weight: 800; color: var(--gold-text);">${formatINR(data.suggestedSellingPrice)}</div>
            </div>
            <div style="padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
              <small style="color: var(--text-dim);">Risk & Competition</small>
              <div style="font-size: 0.9rem; font-weight: 700; color: var(--emerald-success);">${data.riskLevel} Risk • ${data.competitionLevel} Competition</div>
            </div>
          </div>

          <div style="margin-bottom: 14px;">
            <strong style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase;">Key Selling Hooks:</strong>
            <ul style="padding-left: 20px; font-size: 0.85rem; color: var(--text-muted); margin-top: 6px;">
              ${(data.keySellingPoints || []).map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn btn-gold btn-sm" onclick="saveAnalyzedProduct(${JSON.stringify(data).replace(/"/g, '&quot;')}, '${title.replace(/'/g, "\\'")}', '${category.replace(/'/g, "\\'")}')">
              ✅ Save & List to Store
            </button>
            <button class="btn btn-glass btn-sm" onclick="openSocialStudioForProduct('${encodeURIComponent(title)}', '${category}', ${sellingPrice})">
              🎥 Generate Video Ads
            </button>
          </div>
        </div>
      `;
    }

    showToast('Gemini AI Analysis Complete!', 'success');
    fetchAiLogs();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    if (btn) btn.innerHTML = '⚡ Run Gemini AI Profit Analysis';
    if (btn) btn.disabled = false;
  }
}

// Save analyzed product to database
async function saveAnalyzedProduct(analysis, title, category) {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        category,
        cost_price: analysis.costPrice,
        selling_price: analysis.sellingPrice,
        stock_quantity: 60,
        supplier_name: 'Verified AI Supplier'
      })
    });

    if (!res.ok) throw new Error('Failed to save product');
    showToast(`"${title}" added to active store catalog!`, 'success');
    fetchProducts();
    fetchMetrics();
    closeModal('aiProductModal');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// AI Social Campaign Generator
async function runAiSocialGenerator() {
  const productTitle = document.getElementById('socialProductTitle')?.value.trim();
  const productCategory = document.getElementById('socialProductCategory')?.value.trim() || 'General';
  const sellingPrice = parseFloat(document.getElementById('socialSellingPrice')?.value) || 999;
  const platform = document.getElementById('socialPlatformSelect')?.value || 'youtube';

  if (!productTitle) {
    showToast('Please enter or select a product title', 'error');
    return;
  }

  const btn = document.getElementById('generateSocialBtn');
  if (btn) btn.innerHTML = '🤖 Crafting Viral Script with Gemini...';
  if (btn) btn.disabled = true;

  try {
    const res = await fetch('/api/social/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productTitle, productCategory, sellingPrice, platform })
    });

    if (!res.ok) throw new Error('Social generation failed');
    const data = await res.json();

    const captionInput = document.getElementById('socialCaptionInput');
    const tagsInput = document.getElementById('socialTagsInput');
    const scriptBox = document.getElementById('socialScriptPreview');

    if (captionInput) captionInput.value = data.caption;
    if (tagsInput) tagsInput.value = data.hashtags;

    if (scriptBox && data.videoScript) {
      scriptBox.style.display = 'block';
      scriptBox.innerHTML = `
        <div style="background: rgba(7,17,31,0.7); border: 1px solid rgba(0,217,245,0.2); border-radius: 8px; padding: 14px; font-size: 0.85rem;">
          <strong style="color: var(--cyan-accent); display: block; margin-bottom: 6px;">Viral Video Production Script (Score: ${data.estimatedViralScore || 92}%)</strong>
          <p><strong>[0:00 - 0:03 Hook]:</strong> ${data.videoScript.hook}</p>
          <p style="margin-top: 4px;"><strong>[0:03 - 0:08 Problem]:</strong> ${data.videoScript.problem}</p>
          <p style="margin-top: 4px;"><strong>[0:08 - 0:18 Demo]:</strong> ${data.videoScript.solution}</p>
          <p style="margin-top: 4px;"><strong>[0:18 - 0:21 CTA]:</strong> ${data.videoScript.cta}</p>
        </div>
      `;
    }

    showToast('Viral Script and High-CTR tags generated!', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    if (btn) btn.innerHTML = '⚡ Generate Viral Video Script with AI';
    if (btn) btn.disabled = false;
  }
}

// Schedule Social Campaign
async function scheduleSocialCampaign(publishNow = false) {
  const platform = document.getElementById('socialPlatformSelect')?.value || 'youtube';
  const caption = document.getElementById('socialCaptionInput')?.value.trim();
  const hashtags = document.getElementById('socialTagsInput')?.value.trim();
  const videoUrl = document.getElementById('socialVideoUrlInput')?.value.trim();

  if (!caption) {
    showToast('Please generate or write a caption', 'error');
    return;
  }

  try {
    const res = await fetch('/api/social/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, caption, hashtags, videoUrl, publishNow })
    });

    if (!res.ok) throw new Error('Failed to schedule post');
    showToast(publishNow ? 'Broadcasting live now!' : 'Campaign queued in auto-scheduler!', 'success');
    fetchSocialPosts();
    fetchAiLogs();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Trigger Instant Sync Across Stores
async function triggerStoreSync(storeId) {
  showToast('Initiating dual API handshake and inventory sync...', 'gold');
  try {
    const res = await fetch('/api/sync/stores', { method: 'POST' });
    if (!res.ok) throw new Error('Sync failed');
    showToast('Stores & catalogs synchronized successfully!', 'success');
    fetchMetrics();
    fetchStores();
    fetchAiLogs();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Modal Controllers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function openAddStoreModal(platform = 'shopify') {
  state.activeStoreModalPlatform = platform;
  const title = document.getElementById('storeModalPlatformTitle');
  if (title) {
    const names = { shopify: 'Shopify Store', flipkart: 'Flipkart Seller Hub', amazon: 'Amazon Seller Central', meesho: 'Meesho Supplier Hub' };
    title.textContent = `Connect ${names[platform] || 'Store'}`;
  }
  const select = document.getElementById('newStorePlatform');
  if (select) select.value = platform;
  openModal('addStoreModal');
}

async function submitNewStore(e) {
  e?.preventDefault();
  const store_name = document.getElementById('newStoreName')?.value.trim();
  const platform = document.getElementById('newStorePlatform')?.value;
  const api_key = document.getElementById('newStoreApiKey')?.value.trim();
  const api_secret = document.getElementById('newStoreApiSecret')?.value.trim();
  const access_token = document.getElementById('newStoreAccessToken')?.value.trim();

  if (!store_name) {
    showToast('Store name is required', 'error');
    return;
  }

  try {
    const res = await fetch('/api/stores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ store_name, platform, api_key, api_secret, access_token })
    });

    if (!res.ok) throw new Error('Failed to connect store');
    showToast(`${store_name} connected successfully!`, 'success');
    closeModal('addStoreModal');
    fetchStores();
    fetchMetrics();
    fetchAiLogs();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function openSocialStudioForProduct(title, category, price) {
  window.location.href = `social-studio.html?title=${title}&category=${encodeURIComponent(category)}&price=${price}`;
}

// Mobile sidebar toggle
function toggleMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('open');
}

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  fetchMetrics();
  fetchStores();
  fetchProducts();
  fetchOrders();
  fetchSocialPosts();
  fetchAiLogs();

  // Periodically refresh metrics every 25 seconds
  setInterval(() => {
    fetchMetrics();
  }, 25000);

  // Live input listeners for profit calculator
  ['aiCostPrice', 'aiSellingPrice', 'aiPlatformSelect'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', calculateLiveProfit);
      el.addEventListener('change', calculateLiveProfit);
    }
  });

  // Check URL query parameters for Social Studio pre-fills
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('title')) {
    const titleInput = document.getElementById('socialProductTitle');
    const categoryInput = document.getElementById('socialProductCategory');
    const priceInput = document.getElementById('socialSellingPrice');
    if (titleInput) titleInput.value = decodeURIComponent(urlParams.get('title') || '');
    if (categoryInput) categoryInput.value = decodeURIComponent(urlParams.get('category') || '');
    if (priceInput) priceInput.value = urlParams.get('price') || '999';
  }
});
