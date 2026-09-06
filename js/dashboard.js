/* =========================================================
   SMART MONEY AI COMMERCE
   COMPLETE DASHBOARD + SELLER CONNECTION SYSTEM
   dashboard.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       APP CONFIG
    ===================================================== */

    const appConfig = window.SM_CONFIG || {};


    /* =====================================================
       STORAGE KEYS
    ===================================================== */

    const STORAGE_KEYS = {

        products: "sm_ai_products",

        activities: "sm_ai_activities",

        stores: "sm_ai_stores",

        earnings: "sm_ai_earnings",

        priceHistory: "sm_ai_price_history",

        profile: "sm_ai_profile",

        automation: "sm_ai_automation",

        sellerConnections: "sm_seller_connections",

        sellerDrafts: "sm_seller_drafts",

        dashboardSession: "sm_dashboard_session"

    };


    /* =====================================================
       SELLER PLATFORM DIRECTORY

       IMPORTANT:
       Password, OTP or seller credentials are NEVER stored
       by this dashboard.

       User logs into the official seller portal themselves.
    ===================================================== */

    const SELLER_PLATFORMS = [

        {
            id: "amazon",
            name: "Amazon Seller",

            description:
                "Manage your Amazon seller business through the official seller portal.",

            icon: "🛒",

            category: "Marketplace",

            regions:
                ["India", "International"],

            loginUrl:
                "https://sellercentral.amazon.in/",

            signupUrl:
                "https://sellercentral.amazon.in/"

        },

        {
            id: "flipkart",
            name: "Flipkart Seller",

            description:
                "Open the official Flipkart seller portal to register or manage your seller account.",

            icon: "🛍️",

            category: "Marketplace",

            regions:
                ["India"],

            loginUrl:
                "https://seller.flipkart.com/",

            signupUrl:
                "https://seller.flipkart.com/"

        },

        {
            id: "meesho",
            name: "Meesho Supplier",

            description:
                "Access the official Meesho supplier portal for your seller operations.",

            icon: "📦",

            category: "Marketplace",

            regions:
                ["India"],

            loginUrl:
                "https://supplier.meesho.com/",

            signupUrl:
                "https://supplier.meesho.com/"

        },

        {
            id: "shopify",
            name: "Shopify",

            description:
                "Create and manage your own independent online store.",

            icon: "🏪",

            category: "Store Builder",

            regions:
                ["International"],

            loginUrl:
                "https://accounts.shopify.com/",

            signupUrl:
                "https://www.shopify.com/"

        },

        {
            id: "woocommerce",
            name: "WooCommerce",

            description:
                "Manage a self-hosted online store built with WooCommerce.",

            icon: "🛒",

            category: "Store Builder",

            regions:
                ["International"],

            loginUrl:
                "https://woocommerce.com/",

            signupUrl:
                "https://woocommerce.com/"

        },

        {
            id: "etsy",
            name: "Etsy Seller",

            description:
                "Open Etsy's official seller environment for your shop.",

            icon: "🎨",

            category: "Marketplace",

            regions:
                ["International"],

            loginUrl:
                "https://www.etsy.com/sell",

            signupUrl:
                "https://www.etsy.com/sell"

        },

        {
            id: "ebay",
            name: "eBay Seller",

            description:
                "Manage your eBay selling account through the official website.",

            icon: "🌐",

            category: "Marketplace",

            regions:
                ["International"],

            loginUrl:
                "https://www.ebay.com/",

            signupUrl:
                "https://www.ebay.com/"

        }

    ];


    /* =====================================================
       DASHBOARD STATE
    ===================================================== */

    const dashboardState = {

        products: [],

        activities: [],

        stores: [],

        sellerConnections: [],

        sellerDrafts: [],

        priceHistory: [],

        automation: {

            enabled: false,

            contentReminder: false,

            dailyResearch: false

        },

        earnings: {

            today: 0,

            lifetime: 0,

            profit: 0

        },

        profile: {

            name: "Owner",

            initials: "SM"

        },

        session: {

            active: true,

            createdAt: null,

            lastActiveAt: null

        },

        currentSection: "dashboard",

        selectedProduct: null,

        isAnalyzing: false

    };


    /* =====================================================
       DOM ELEMENTS
    ===================================================== */

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const menuToggle =
        document.getElementById("menuToggle");

    const sidebarClose =
        document.getElementById("sidebarClose");

    const pageTitle =
        document.getElementById("pageTitle");

    const dashboardContent =
        document.querySelector(".dashboard-content");

    const navItems =
        document.querySelectorAll(".nav-item");

    const globalSearch =
        document.getElementById("globalSearch");

    const productSearchInput =
        document.getElementById("productSearchInput");

    const analyzeProductBtn =
        document.getElementById("analyzeProductBtn");

    const productList =
        document.getElementById("productList");

    const activityList =
        document.getElementById("activityList");

    const todayEarnings =
        document.getElementById("todayEarnings");

    const lifetimeRevenue =
        document.getElementById("lifetimeRevenue");

    const estimatedProfit =
        document.getElementById("estimatedProfit");

    const connectedStores =
        document.getElementById("connectedStores");

    const storeSummaryCount =
        document.getElementById("storeSummaryCount");

    const connectStoreBtn =
        document.getElementById("connectStoreBtn");

    const startResearchBtn =
        document.getElementById("startResearchBtn");

    const viewAutomationBtn =
        document.getElementById("viewAutomationBtn");

    const viewProductsBtn =
        document.getElementById("viewProductsBtn");

    const refreshDashboardBtn =
        document.getElementById("refreshDashboardBtn");

    const settingsBtn =
        document.getElementById("settingsBtn");

    const profileButton =
        document.getElementById("profileButton");

    const profileName =
        document.getElementById("profileName");

    const profileAvatar =
        document.getElementById("profileAvatar");

    const aiStatusBtn =
        document.getElementById("aiStatusBtn");

    const aiStatus =
        document.getElementById("aiStatus");

    const sidebarAiStatus =
        document.getElementById("sidebarAiStatus");


    /* =====================================================
       SAFE HTML ESCAPE
    ===================================================== */

    function escapeHTML(value) {

        const element =
            document.createElement("div");

        element.textContent =
            String(value ?? "");

        return element.innerHTML;

    }


    /* =====================================================
       FORMATTERS
    ===================================================== */

    function formatCurrency(amount) {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ).format(
            Number(amount || 0)
        );

    }


    function formatNumber(value) {

        return new Intl.NumberFormat(
            "en-IN"
        ).format(
            Number(value || 0)
        );

    }


    function formatDate(value) {

        try {

            return new Intl.DateTimeFormat(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit"
                }
            ).format(
                new Date(value)
            );

        }
        catch (error) {

            return "Recently";

        }

    }


    function createId(prefix = "sm") {

        return (
            prefix +
            "_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .slice(2, 9)
        );

    }


    /* =====================================================
       SAFE STORAGE PARSER
    ===================================================== */

    function readStorage(key, fallback) {

        try {

            const value =
                localStorage.getItem(key);

            if (!value) {

                return fallback;

            }

            return JSON.parse(value);

        }
        catch (error) {

            console.error(
                "Storage read error:",
                key,
                error
            );

            return fallback;

        }

    }


    /* =====================================================
       SESSION PERSISTENCE

       Dashboard browser state remains active until the user
       explicitly clears/logout logic from their own auth system.
    ===================================================== */

    function initializePersistentSession() {

        const savedSession =
            readStorage(
                STORAGE_KEYS.dashboardSession,
                null
            );


        if (
            savedSession &&
            savedSession.active
        ) {

            dashboardState.session =
                savedSession;

        }
        else {

            dashboardState.session = {

                active: true,

                createdAt:
                    new Date()
                        .toISOString(),

                lastActiveAt:
                    new Date()
                        .toISOString()

            };

        }


        dashboardState.session.lastActiveAt =
            new Date()
                .toISOString();


        localStorage.setItem(
            STORAGE_KEYS.dashboardSession,
            JSON.stringify(
                dashboardState.session
            )
        );

    }


    function updateSessionActivity() {

        dashboardState.session.lastActiveAt =
            new Date()
                .toISOString();


        localStorage.setItem(
            STORAGE_KEYS.dashboardSession,
            JSON.stringify(
                dashboardState.session
            )
        );

    }


    /* =====================================================
       LOAD DATA
    ===================================================== */

    function loadDashboardData() {

        const products =
            readStorage(
                STORAGE_KEYS.products,
                []
            );

        const activities =
            readStorage(
                STORAGE_KEYS.activities,
                []
            );

        const stores =
            readStorage(
                STORAGE_KEYS.stores,
                []
            );

        const earnings =
            readStorage(
                STORAGE_KEYS.earnings,
                {}
            );

        const priceHistory =
            readStorage(
                STORAGE_KEYS.priceHistory,
                []
            );

        const profile =
            readStorage(
                STORAGE_KEYS.profile,
                {}
            );

        const automation =
            readStorage(
                STORAGE_KEYS.automation,
                {}
            );

        const sellerConnections =
            readStorage(
                STORAGE_KEYS.sellerConnections,
                []
            );

        const sellerDrafts =
            readStorage(
                STORAGE_KEYS.sellerDrafts,
                []
            );


        if (Array.isArray(products)) {

            dashboardState.products =
                products;

        }


        if (Array.isArray(activities)) {

            dashboardState.activities =
                activities;

        }


        if (Array.isArray(stores)) {

            dashboardState.stores =
                stores;

        }


        if (Array.isArray(priceHistory)) {

            dashboardState.priceHistory =
                priceHistory;

        }


        if (Array.isArray(sellerConnections)) {

            dashboardState.sellerConnections =
                sellerConnections;

        }


        if (Array.isArray(sellerDrafts)) {

            dashboardState.sellerDrafts =
                sellerDrafts;

        }


        if (
            earnings &&
            typeof earnings === "object"
        ) {

            dashboardState.earnings = {

                today:
                    Number(earnings.today) || 0,

                lifetime:
                    Number(earnings.lifetime) || 0,

                profit:
                    Number(earnings.profit) || 0

            };

        }


        if (
            profile &&
            typeof profile === "object"
        ) {

            dashboardState.profile = {

                ...dashboardState.profile,

                ...profile

            };

        }


        if (
            automation &&
            typeof automation === "object"
        ) {

            dashboardState.automation = {

                ...dashboardState.automation,

                ...automation

            };

        }

    }


    /* =====================================================
       SAVE DATA
    ===================================================== */

    function saveDashboardData() {

        try {

            localStorage.setItem(
                STORAGE_KEYS.products,
                JSON.stringify(
                    dashboardState.products
                )
            );


            localStorage.setItem(
                STORAGE_KEYS.activities,
                JSON.stringify(
                    dashboardState.activities
                )
            );


            localStorage.setItem(
                STORAGE_KEYS.stores,
                JSON.stringify(
                    dashboardState.stores
                )
            );


            localStorage.setItem(
                STORAGE_KEYS.earnings,
                JSON.stringify(
                    dashboardState.earnings
                )
            );


            localStorage.setItem(
                STORAGE_KEYS.priceHistory,
                JSON.stringify(
                    dashboardState.priceHistory
                )
            );


            localStorage.setItem(
                STORAGE_KEYS.profile,
                JSON.stringify(
                    dashboardState.profile
                )
            );


            localStorage.setItem(
                STORAGE_KEYS.automation,
                JSON.stringify(
                    dashboardState.automation
                )
            );


            localStorage.setItem(
                STORAGE_KEYS.sellerConnections,
                JSON.stringify(
                    dashboardState.sellerConnections
                )
            );


            localStorage.setItem(
                STORAGE_KEYS.sellerDrafts,
                JSON.stringify(
                    dashboardState.sellerDrafts
                )
            );


            updateSessionActivity();

        }
        catch (error) {

            console.error(
                "Dashboard save error:",
                error
            );

        }

    }


    /* =====================================================
       PLATFORM HELPERS
    ===================================================== */

    function getPlatform(platformId) {

        return SELLER_PLATFORMS.find(
            platform =>
                platform.id === platformId
        );

    }


    function getConnection(platformId) {

        return dashboardState
            .sellerConnections
            .find(
                connection =>
                    connection.platformId ===
                    platformId
            );

    }


    function isPlatformConnected(platformId) {

        return Boolean(
            getConnection(platformId)
        );

    }


    function getTotalConnectedStores() {

        return (
            dashboardState.stores.length +
            dashboardState.sellerConnections.length
        );

    }


    /* =====================================================
       ACTIVITY SYSTEM
    ===================================================== */

    function addActivity(
        title,
        description = "",
        icon = "⚡"
    ) {

        dashboardState.activities.unshift({

            id:
                createId("activity"),

            title,

            description,

            icon,

            createdAt:
                new Date()
                    .toISOString()

        });


        dashboardState.activities =
            dashboardState.activities
                .slice(0, 100);


        saveDashboardData();

        renderActivityList();

    }


    /* =====================================================
       PROFILE UI
    ===================================================== */

    function updateProfileUI() {

        const name =
            dashboardState.profile.name ||
            "Owner";


        const initials =
            dashboardState.profile.initials ||
            name
                .split(" ")
                .slice(0, 2)
                .map(
                    word =>
                        word.charAt(0)
                )
                .join("")
                .toUpperCase()
                .slice(0, 2);


        if (profileName) {

            profileName.textContent =
                name;

        }


        if (profileAvatar) {

            profileAvatar.textContent =
                initials;

        }

    }


    /* =====================================================
       UPDATE STATISTICS
    ===================================================== */

    function updateStatistics() {

        if (todayEarnings) {

            todayEarnings.textContent =
                formatCurrency(
                    dashboardState.earnings.today
                );

        }


        if (lifetimeRevenue) {

            lifetimeRevenue.textContent =
                formatCurrency(
                    dashboardState.earnings.lifetime
                );

        }


        if (estimatedProfit) {

            estimatedProfit.textContent =
                formatCurrency(
                    dashboardState.earnings.profit
                );

        }


        const totalStores =
            getTotalConnectedStores();


        if (connectedStores) {

            connectedStores.textContent =
                formatNumber(
                    totalStores
                );

        }


        if (storeSummaryCount) {

            storeSummaryCount.textContent =
                formatNumber(
                    totalStores
                );

        }

    }


    /* =====================================================
       SIDEBAR
    ===================================================== */

    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add("open");


        if (sidebarOverlay) {

            sidebarOverlay.classList.add(
                "show"
            );

        }


        document.body.classList.add(
            "sidebar-is-open"
        );

    }


    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove(
            "open"
        );


        if (sidebarOverlay) {

            sidebarOverlay.classList.remove(
                "show"
            );

        }


        document.body.classList.remove(
            "sidebar-is-open"
        );

    }


    function toggleSidebar() {

        if (!sidebar) return;

        if (
            sidebar.classList.contains(
                "open"
            )
        ) {

            closeSidebar();

        }
        else {

            openSidebar();

        }

    }


    /* =====================================================
       SECTION TITLES
    ===================================================== */

    const sectionTitles = {

        dashboard:
            "Dashboard",

        "ai-hunter":
            "AI Product Hunter",

        "product-research":
            "Product Research",

        stores:
            "Seller Connections",

        automation:
            "Automation",

        earnings:
            "Earnings",

        products:
            "Products",

        "price-history":
            "Price History",

        activity:
            "AI Activity"

    };


    /* =====================================================
       DASHBOARD HOME
    ===================================================== */

    function ensureDashboardHome() {

        if (!dashboardContent) return null;

        let home =
            document.getElementById(
                "dashboardHomeContent"
            );


        if (!home) {

            home =
                document.createElement("div");


            home.id =
                "dashboardHomeContent";


            while (
                dashboardContent.firstChild
            ) {

                home.appendChild(
                    dashboardContent.firstChild
                );

            }


            dashboardContent.appendChild(
                home
            );

        }


        return home;

    }


    /* =====================================================
       NAVIGATION
    ===================================================== */

    function navigateToSection(section) {

        if (!section) return;


        dashboardState.currentSection =
            section;


        navItems.forEach(
            item => {

                item.classList.toggle(
                    "active",
                    item.dataset.section ===
                    section
                );

            }
        );


        if (pageTitle) {

            pageTitle.textContent =
                sectionTitles[section] ||
                "Dashboard";

        }


        if (
            section ===
            "dashboard"
        ) {

            showDashboardSection();

        }
        else {

            showWorkspaceSection(
                section
            );

        }


        if (
            window.innerWidth <=
            900
        ) {

            closeSidebar();

        }


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    /* =====================================================
       SHOW DASHBOARD
    ===================================================== */

    function showDashboardSection() {

        const home =
            ensureDashboardHome();


        const dynamic =
            document.getElementById(
                "dynamicSection"
            );


        if (dynamic) {

            dynamic.remove();

        }


        if (home) {

            home.style.display =
                "block";

        }


        updateStatistics();

        renderProductList();

        renderActivityList();

    }


    /* =====================================================
       SHOW WORKSPACE
    ===================================================== */

    function showWorkspaceSection(section) {

        const home =
            ensureDashboardHome();


        if (home) {

            home.style.display =
                "none";

        }


        let dynamic =
            document.getElementById(
                "dynamicSection"
            );


        if (dynamic) {

            dynamic.remove();

        }


        dynamic =
            document.createElement(
                "section"
            );


        dynamic.id =
            "dynamicSection";


        dynamic.className =
            "dynamic-workspace";


        dashboardContent.appendChild(
            dynamic
        );


        switch (section) {

            case "ai-hunter":

                renderAIHunter(dynamic);

                break;


            case "product-research":

                renderProductResearch(dynamic);

                break;


            case "stores":

                renderStores(dynamic);

                break;


            case "automation":

                renderAutomation(dynamic);

                break;


            case "earnings":

                renderEarnings(dynamic);

                break;


            case "products":

                renderProducts(dynamic);

                break;


            case "price-history":

                renderPriceHistory(dynamic);

                break;


            case "activity":

                renderFullActivity(dynamic);

                break;


            default:

                renderAIHunter(dynamic);

        }

    }


    /* =====================================================
       PRODUCT RESEARCH
    ===================================================== */

    function analyzeProduct(productName) {

        const name =
            String(
                productName || ""
            ).trim();


        if (!name) {

            showToast(
                "Enter a product name first.",
                "🔍"
            );

            return;

        }


        if (
            dashboardState.isAnalyzing
        ) {

            showToast(
                "Analysis is already running.",
                "⏳"
            );

            return;

        }


        dashboardState.isAnalyzing =
            true;


        showToast(
            "Analyzing " +
            name +
            "...",
            "🤖"
        );


        const button =
            document.getElementById(
                "analyzeProductBtn"
            );


        if (button) {

            button.disabled =
                true;

            button.textContent =
                "Analyzing...";

        }


        setTimeout(
            () => {

                const demand =
                    Math.floor(
                        Math.random() * 40
                    ) + 60;


                const competition =
                    Math.floor(
                        Math.random() * 60
                    ) + 20;


                const estimatedPrice =
                    Math.floor(
                        Math.random() * 4000
                    ) + 299;


                const opportunity =
                    demand -
                    Math.floor(
                        competition / 2
                    );


                const product = {

                    id:
                        createId("product"),

                    name,

                    demand,

                    competition,

                    estimatedPrice,

                    opportunity,

                    status:
                        "Research Complete",

                    createdAt:
                        new Date()
                            .toISOString()

                };


                dashboardState.products.unshift(
                    product
                );


                dashboardState.priceHistory.unshift({

                    id:
                        createId("price"),

                    productName:
                        name,

                    price:
                        estimatedPrice,

                    createdAt:
                        new Date()
                            .toISOString()

                });


                dashboardState.isAnalyzing =
                    false;


                saveDashboardData();


                addActivity(

                    "Product research completed",

                    name +
                    " was added to your research workspace.",

                    "🔍"

                );


                updateStatistics();

                renderProductList();


                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        "🤖 Analyze";

                }


                if (productSearchInput) {

                    productSearchInput.value =
                        "";

                }


                showToast(
                    name +
                    " analysis completed.",
                    "✓"
                );


                if (
                    dashboardState.currentSection ===
                    "products"
                ) {

                    const dynamic =
                        document.getElementById(
                            "dynamicSection"
                        );


                    if (dynamic) {

                        renderProducts(
                            dynamic
                        );

                    }

                }

            },
            900
        );

    }


    /* =====================================================
       DASHBOARD PRODUCT LIST
    ===================================================== */

    function renderProductList() {

        if (!productList) return;


        const products =
            dashboardState.products
                .slice(0, 5);


        if (!products.length) {

            productList.innerHTML = `

                <div class="empty-state small-empty">

                    <span>🔍</span>

                    <strong>
                        No products researched yet
                    </strong>

                    <small>
                        Start product research to discover opportunities.
                    </small>

                </div>

            `;

            return;

        }


        productList.innerHTML =
            products.map(
                product => `

                    <div class="workspace-list-item">

                        <div class="workspace-item-icon">
                            📦
                        </div>

                        <div class="workspace-item-content">

                            <strong>
                                ${escapeHTML(product.name)}
                            </strong>

                            <small>
                                Demand ${product.demand}% ·
                                Competition ${product.competition}%
                            </small>

                        </div>

                        <div class="workspace-item-meta">

                            ₹${formatNumber(
                                product.estimatedPrice
                            )}

                        </div>

                    </div>

                `
            ).join("");

    }


    /* =====================================================
       ACTIVITY LIST
    ===================================================== */

    function renderActivityList() {

        if (!activityList) return;


        const activities =
            dashboardState.activities
                .slice(0, 6);


        if (!activities.length) {

            activityList.innerHTML = `

                <div class="empty-state small-empty">

                    <span>⚡</span>

                    <strong>
                        No recent activity
                    </strong>

                </div>

            `;

            return;

        }


        activityList.innerHTML =
            activities.map(
                activity => `

                    <div class="workspace-list-item">

                        <div class="workspace-item-icon">
                            ${escapeHTML(
                                activity.icon ||
                                "⚡"
                            )}
                        </div>

                        <div class="workspace-item-content">

                            <strong>
                                ${escapeHTML(
                                    activity.title
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    activity.description ||
                                    ""
                                )}
                            </small>

                        </div>

                    </div>

                `
            ).join("");

    }


    /* =====================================================
       AI HUNTER
    ===================================================== */

    function renderAIHunter(container) {

        container.innerHTML = `

            <section class="dashboard-card">

                <div class="card-header">

                    <div>

                        <span class="card-eyebrow">
                            AI RESEARCH ENGINE
                        </span>

                        <h2>
                            AI Product Hunter
                        </h2>

                        <p class="card-description">
                            Research product opportunities and save them
                            to your Smart Money workspace.
                        </p>

                    </div>

                </div>

                <div class="research-input-row">

                    <input
                        type="text"
                        id="hunterInput"
                        placeholder="Enter a product to research"
                    >

                    <button
                        type="button"
                        class="primary-action"
                        id="hunterAnalyzeBtn"
                    >
                        🤖 Start Analysis
                    </button>

                </div>

                <div
                    id="hunterResults"
                    class="hunter-results"
                ></div>

            </section>

        `;


        const input =
            document.getElementById(
                "hunterInput"
            );


        const button =
            document.getElementById(
                "hunterAnalyzeBtn"
            );


        if (button) {

            button.addEventListener(
                "click",
                () => {

                    analyzeProduct(
                        input.value
                    );


                    setTimeout(
                        () => {

                            const latest =
                                dashboardState
                                    .products[0];


                            const results =
                                document.getElementById(
                                    "hunterResults"
                                );


                            if (
                                latest &&
                                results
                            ) {

                                results.innerHTML = `

                                    <div class="dashboard-card">

                                        <h3>
                                            Research Result
                                        </h3>

                                        <p>
                                            Product:
                                            <strong>
                                                ${escapeHTML(
                                                    latest.name
                                                )}
                                            </strong>
                                        </p>

                                        <p>
                                            Market Demand:
                                            <strong>
                                                ${latest.demand}%
                                            </strong>
                                        </p>

                                        <p>
                                            Competition:
                                            <strong>
                                                ${latest.competition}%
                                            </strong>
                                        </p>

                                        <p>
                                            Estimated Price:
                                            <strong>
                                                ₹${formatNumber(
                                                    latest.estimatedPrice
                                                )}
                                            </strong>
                                        </p>

                                    </div>

                                `;

                            }

                        },
                        1100
                    );

                }
            );

        }

    }


    /* =====================================================
       PRODUCT RESEARCH
    ===================================================== */

    function renderProductResearch(container) {

        container.innerHTML = `

            <section class="dashboard-card">

                <div class="card-header">

                    <div>

                        <span class="card-eyebrow">
                            PRODUCT INTELLIGENCE
                        </span>

                        <h2>
                            Product Research
                        </h2>

                    </div>

                </div>

                <div class="research-input-row">

                    <input
                        type="text"
                        id="workspaceProductInput"
                        placeholder="Example: Wireless Earbuds"
                    >

                    <button
                        class="primary-action"
                        id="workspaceAnalyzeBtn"
                    >
                        🔍 Analyze Product
                    </button>

                </div>

            </section>

        `;


        const input =
            document.getElementById(
                "workspaceProductInput"
            );


        const button =
            document.getElementById(
                "workspaceAnalyzeBtn"
            );


        if (button) {

            button.addEventListener(
                "click",
                () => {

                    analyzeProduct(
                        input.value
                    );

                }
            );

        }

    }


    /* =====================================================
       PRODUCTS
    ===================================================== */

    function renderProducts(container) {

        const products =
            dashboardState.products;


        container.innerHTML = `

            <section class="dashboard-card">

                <div class="card-header">

                    <div>

                        <span class="card-eyebrow">
                            PRODUCT DATABASE
                        </span>

                        <h2>
                            Saved Products
                        </h2>

                        <p class="card-description">
                            ${formatNumber(products.length)}
                            product opportunities saved.
                        </p>

                    </div>

                </div>

                <div class="full-products-list">

                    ${
                        products.length

                            ? products.map(
                                product => `

                                <div class="workspace-list-item">

                                    <div class="workspace-item-icon">
                                        📦
                                    </div>

                                    <div class="workspace-item-content">

                                        <strong>
                                            ${escapeHTML(
                                                product.name
                                            )}
                                        </strong>

                                        <small>
                                            Demand ${product.demand}% ·
                                            Competition ${product.competition}% ·
                                            Opportunity ${product.opportunity}
                                        </small>

                                    </div>

                                    <div class="workspace-item-meta">

                                        <strong>
                                            ₹${formatNumber(
                                                product.estimatedPrice
                                            )}
                                        </strong>

                                        <button
                                            class="delete-product-btn"
                                            data-product-id="${escapeHTML(
                                                product.id
                                            )}"
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            `
                            ).join("")

                            : `

                            <div class="empty-state">

                                <div class="empty-state-icon">
                                    📦
                                </div>

                                <h3>
                                    No products saved
                                </h3>

                                <p>
                                    Start product research to add products.
                                </p>

                            </div>

                        `
                    }

                </div>

            </section>

        `;


        container
            .querySelectorAll(
                ".delete-product-btn"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const id =
                                button.dataset.productId;


                            dashboardState.products =
                                dashboardState.products.filter(
                                    product =>
                                        product.id !==
                                        id
                                );


                            saveDashboardData();


                            addActivity(
                                "Product removed",
                                "A product was removed from the workspace.",
                                "🗑️"
                            );


                            renderProducts(
                                container
                            );


                            renderProductList();


                            showToast(
                                "Product removed.",
                                "🗑️"
                            );

                        }
                    );

                }
            );

    }


    /* =====================================================
       SELLER CONNECTION SYSTEM
    ===================================================== */

    function renderStores(container) {

        const connections =
            dashboardState.sellerConnections;


        container.innerHTML = `

            <section class="dashboard-card">

                <div class="card-header">

                    <div>

                        <span class="card-eyebrow">
                            SELLER ACCOUNT HUB
                        </span>

                        <h2>
                            Connect Your Seller Accounts
                        </h2>

                        <p class="card-description">
                            Open an official seller portal, sign in or
                            create your account yourself, then confirm
                            the connection here.
                        </p>

                    </div>

                </div>

                <div class="seller-security-note">

                    <strong>
                        🔒 Secure connection notice
                    </strong>

                    <p>
                        Smart Money does not ask for or save your
                        seller password or OTP. Login is completed
                        directly on the official seller website.
                    </p>

                </div>

                <div class="seller-platform-grid">

                    ${
                        SELLER_PLATFORMS.map(
                            platform => {

                                const connection =
                                    getConnection(
                                        platform.id
                                    );


                                const isConnected =
                                    Boolean(
                                        connection
                                    );


                                return `

                                <article
                                    class="seller-platform-card"
                                >

                                    <div
                                        class="seller-platform-top"
                                    >

                                        <div
                                            class="seller-platform-icon"
                                        >
                                            ${platform.icon}
                                        </div>

                                        <span
                                            class="seller-status-badge ${isConnected ? "connected" : "not-connected"}"
                                        >
                                            ${
                                                isConnected
                                                    ? "Connected"
                                                    : "Not Connected"
                                            }
                                        </span>

                                    </div>

                                    <h3>
                                        ${escapeHTML(
                                            platform.name
                                        )}
                                    </h3>

                                    <p>
                                        ${escapeHTML(
                                            platform.description
                                        )}
                                    </p>

                                    <small>
                                        ${escapeHTML(
                                            platform.category
                                        )}
                                        ·
                                        ${escapeHTML(
                                            platform.regions.join(
                                                ", "
                                            )
                                        )}
                                    </small>

                                    ${
                                        isConnected

                                            ? `

                                            <div
                                                class="seller-connected-info"
                                            >

                                                <strong>
                                                    ✓ Connected
                                                </strong>

                                                <small>
                                                    ${connection.storeName
                                                        ? escapeHTML(
                                                            connection.storeName
                                                        )
                                                        : "Seller account"
                                                    }
                                                </small>

                                            </div>

                                            <div
                                                class="seller-action-row"
                                            >

                                                <button
                                                    class="secondary-action seller-open-btn"
                                                    data-platform-id="${platform.id}"
                                                >
                                                    Open Portal
                                                </button>

                                                <button
                                                    class="danger-action seller-disconnect-btn"
                                                    data-platform-id="${platform.id}"
                                                >
                                                    Disconnect
                                                </button>

                                            </div>

                                        `

                                            : `

                                            <div
                                                class="seller-action-row"
                                            >

                                                <button
                                                    class="secondary-action seller-signup-btn"
                                                    data-platform-id="${platform.id}"
                                                >
                                                    Create Account
                                                </button>

                                                <button
                                                    class="primary-action seller-connect-btn"
                                                    data-platform-id="${platform.id}"
                                                >
                                                    Login & Connect
                                                </button>

                                            </div>

                                        `
                                    }

                                </article>

                            `;

                            }
                        ).join("")
                    }

                </div>

            </section>


            <section class="dashboard-card">

                <div class="card-header">

                    <div>

                        <span class="card-eyebrow">
                            CONNECTED ACCOUNTS
                        </span>

                        <h2>
                            Your Seller Connections
                        </h2>

                    </div>

                </div>

                ${
                    connections.length

                        ? connections.map(
                            connection => {

                                const platform =
                                    getPlatform(
                                        connection.platformId
                                    );


                                if (!platform) {

                                    return "";

                                }


                                return `

                                    <div
                                        class="workspace-list-item"
                                    >

                                        <div
                                            class="workspace-item-icon"
                                        >
                                            ${platform.icon}
                                        </div>

                                        <div
                                            class="workspace-item-content"
                                        >

                                            <strong>
                                                ${escapeHTML(
                                                    platform.name
                                                )}
                                            </strong>

                                            <small>
                                                ${
                                                    connection.storeName
                                                        ? escapeHTML(
                                                            connection.storeName
                                                        )
                                                        : "Seller connection"
                                                }

                                                · Connected
                                                ${formatDate(
                                                    connection.connectedAt
                                                )}
                                            </small>

                                        </div>

                                        <div
                                            class="workspace-item-meta"
                                        >

                                            <span>
                                                Connected
                                            </span>

                                        </div>

                                    </div>

                                `;

                            }
                        ).join("")

                        : `

                            <div class="empty-state">

                                <div
                                    class="empty-state-icon"
                                >
                                    🏪
                                </div>

                                <h3>
                                    No seller account connected
                                </h3>

                                <p>
                                    Select a marketplace above and
                                    connect your own seller account.
                                </p>

                            </div>

                        `
                }

            </section>

        `;


        /* -----------------------------------------------
           CREATE ACCOUNT BUTTON
        ----------------------------------------------- */

        container
            .querySelectorAll(
                ".seller-signup-btn"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const platform =
                                getPlatform(
                                    button.dataset
                                        .platformId
                                );


                            if (!platform) return;


                            window.open(
                                platform.signupUrl,
                                "_blank",
                                "noopener,noreferrer"
                            );


                            showToast(
                                platform.name +
                                " registration portal opened.",
                                "🏪"
                            );


                            addActivity(
                                "Seller registration opened",
                                platform.name +
                                " official registration portal was opened.",
                                platform.icon
                            );

                        }
                    );

                }
            );


        /* -----------------------------------------------
           LOGIN & CONNECT
        ----------------------------------------------- */

        container
            .querySelectorAll(
                ".seller-connect-btn"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const platform =
                                getPlatform(
                                    button.dataset
                                        .platformId
                                );


                            if (!platform) return;


                            openSellerConnectionDialog(
                                platform,
                                container
                            );

                        }
                    );

                }
            );


        /* -----------------------------------------------
           OPEN CONNECTED PORTAL
        ----------------------------------------------- */

        container
            .querySelectorAll(
                ".seller-open-btn"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const platform =
                                getPlatform(
                                    button.dataset
                                        .platformId
                                );


                            if (!platform) return;


                            window.open(
                                platform.loginUrl,
                                "_blank",
                                "noopener,noreferrer"
                            );


                            showToast(
                                "Official seller portal opened.",
                                "🔗"
                            );

                        }
                    );

                }
            );


        /* -----------------------------------------------
           DISCONNECT
        ----------------------------------------------- */

        container
            .querySelectorAll(
                ".seller-disconnect-btn"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const platformId =
                                button.dataset
                                    .platformId;


                            const platform =
                                getPlatform(
                                    platformId
                                );


                            const confirmed =
                                window.confirm(
                                    "Disconnect " +
                                    (
                                        platform
                                            ? platform.name
                                            : "this seller account"
                                    ) +
                                    " from Smart Money?"
                                );


                            if (!confirmed) {

                                return;

                            }


                            dashboardState
                                .sellerConnections =
                                dashboardState
                                    .sellerConnections
                                    .filter(
                                        connection =>
                                            connection.platformId !==
                                            platformId
                                    );


                            saveDashboardData();

                            updateStatistics();


                            addActivity(
                                "Seller account disconnected",
                                (
                                    platform
                                        ? platform.name
                                        : "Seller platform"
                                ) +
                                " was removed from the dashboard.",
                                "🔌"
                            );


                            renderStores(
                                container
                            );


                            showToast(
                                "Seller account disconnected.",
                                "🔌"
                            );

                        }
                    );

                }
            );

    }


    /* =====================================================
       SELLER CONNECTION DIALOG
    ===================================================== */

    function openSellerConnectionDialog(
        platform,
        container
    ) {

        const oldModal =
            document.getElementById(
                "sellerConnectionModal"
            );


        if (oldModal) {

            oldModal.remove();

        }


        const modal =
            document.createElement(
                "div"
            );


        modal.id =
            "sellerConnectionModal";


        modal.className =
            "seller-connection-modal";


        modal.innerHTML = `

            <div
                class="seller-modal-backdrop"
            ></div>

            <div
                class="seller-modal-card"
            >

                <button
                    class="seller-modal-close"
                    id="closeSellerModal"
                    type="button"
                >
                    ×
                </button>

                <div
                    class="seller-modal-icon"
                >
                    ${platform.icon}
                </div>

                <h2>
                    Connect ${escapeHTML(
                        platform.name
                    )}
                </h2>

                <p>
                    Step 1: Open the official seller portal.
                    Complete login or account registration directly
                    on that website.
                </p>

                <button
                    class="primary-action"
                    id="openOfficialSellerPortal"
                >
                    Open Official Seller Portal
                </button>

                <div
                    class="seller-modal-divider"
                ></div>

                <p>
                    Step 2: After you have completed your login,
                    enter an optional display name for this seller
                    connection.
                </p>

                <input
                    type="text"
                    id="sellerStoreDisplayName"
                    placeholder="Example: My Main Store"
                >

                <label
                    class="seller-confirm-checkbox"
                >

                    <input
                        type="checkbox"
                        id="sellerLoginConfirmed"
                    >

                    <span>
                        I confirm that I personally completed login
                        or registration on the official seller website.
                    </span>

                </label>

                <button
                    class="primary-action"
                    id="confirmSellerConnection"
                >
                    ✓ Confirm Connection
                </button>

                <p
                    class="seller-modal-security"
                >
                    🔒 Never enter your password or OTP here.
                    Smart Money does not store seller login credentials.
                </p>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        const closeModal = () => {

            modal.remove();

        };


        document
            .getElementById(
                "closeSellerModal"
            )
            .addEventListener(
                "click",
                closeModal
            );


        modal
            .querySelector(
                ".seller-modal-backdrop"
            )
            .addEventListener(
                "click",
                closeModal
            );


        document
            .getElementById(
                "openOfficialSellerPortal"
            )
            .addEventListener(
                "click",
                () => {

                    window.open(
                        platform.loginUrl,
                        "_blank",
                        "noopener,noreferrer"
                    );


                    showToast(
                        "Complete your login in the official portal.",
                        "🔐"
                    );

                }
            );


        document
            .getElementById(
                "confirmSellerConnection"
            )
            .addEventListener(
                "click",
                () => {

                    const confirmed =
                        document
                            .getElementById(
                                "sellerLoginConfirmed"
                            )
                            .checked;


                    const storeName =
                        document
                            .getElementById(
                                "sellerStoreDisplayName"
                            )
                            .value
                            .trim();


                    if (!confirmed) {

                        showToast(
                            "Please confirm that login was completed on the official seller website.",
                            "⚠️"
                        );

                        return;

                    }


                    const existing =
                        getConnection(
                            platform.id
                        );


                    if (existing) {

                        showToast(
                            "This seller platform is already connected.",
                            "✓"
                        );

                        closeModal();

                        return;

                    }


                    dashboardState
                        .sellerConnections
                        .push({

                            id:
                                createId(
                                    "seller"
                                ),

                            platformId:
                                platform.id,

                            storeName:
                                storeName ||
                                platform.name,

                            status:
                                "connected",

                            connectedAt:
                                new Date()
                                    .toISOString(),

                            lastActiveAt:
                                new Date()
                                    .toISOString()

                        });


                    saveDashboardData();

                    updateStatistics();


                    addActivity(
                        "Seller account connected",
                        platform.name +
                        " was connected to your Smart Money workspace.",
                        platform.icon
                    );


                    closeModal();


                    renderStores(
                        container
                    );


                    showToast(
                        platform.name +
                        " connected successfully.",
                        "✓"
                    );

                }
            );

    }


    /* =====================================================
       AUTOMATION
    ===================================================== */

    function renderAutomation(container) {

        const automation =
            dashboardState.automation;


        container.innerHTML = `

            <section class="dashboard-card">

                <div class="card-header">

                    <div>

                        <span class="card-eyebrow">
                            WORKSPACE AUTOMATION
                        </span>

                        <h2>
                            Automation
                        </h2>

                    </div>

                </div>

                <div class="automation-list">

                    <label
                        class="automation-option"
                    >

                        <input
                            type="checkbox"
                            id="dailyResearchToggle"
                            ${
                                automation.dailyResearch
                                    ? "checked"
                                    : ""
                            }
                        >

                        <span>
                            Daily product research reminder
                        </span>

                    </label>

                    <label
                        class="automation-option"
                    >

                        <input
                            type="checkbox"
                            id="contentReminderToggle"
                            ${
                                automation.contentReminder
                                    ? "checked"
                                    : ""
                            }
                        >

                        <span>
                            Content publishing reminder
                        </span>

                    </label>

                    <label
                        class="automation-option"
                    >

                        <input
                            type="checkbox"
                            id="automationToggle"
                            ${
                                automation.enabled
                                    ? "checked"
                                    : ""
                            }
                        >

                        <span>
                            Enable workspace automation
                        </span>

                    </label>

                </div>

            </section>

        `;


        const toggles = {

            dailyResearch:
                document.getElementById(
                    "dailyResearchToggle"
                ),

            contentReminder:
                document.getElementById(
                    "contentReminderToggle"
                ),

            enabled:
                document.getElementById(
                    "automationToggle"
                )

        };


        Object.entries(
            toggles
        ).forEach(
            ([key, input]) => {

                if (!input) return;


                input.addEventListener(
                    "change",
                    () => {

                        dashboardState
                            .automation[key] =
                            input.checked;


                        saveDashboardData();


                        addActivity(
                            "Automation updated",
                            "Workspace automation preferences were changed.",
                            "⚙️"
                        );


                        showToast(
                            "Automation preference saved.",
                            "✓"
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       EARNINGS
    ===================================================== */

    function renderEarnings(container) {

        const earnings =
            dashboardState.earnings;


        container.innerHTML = `

            <section
                class="stats-grid earnings-section-stats"
            >

                <article
                    class="stat-card"
                >

                    <p>
                        Today Earnings
                    </p>

                    <h3>
                        ${formatCurrency(
                            earnings.today
                        )}
                    </h3>

                </article>

                <article
                    class="stat-card"
                >

                    <p>
                        Lifetime Revenue
                    </p>

                    <h3>
                        ${formatCurrency(
                            earnings.lifetime
                        )}
                    </h3>

                </article>

                <article
                    class="stat-card"
                >

                    <p>
                        Estimated Profit
                    </p>

                    <h3>
                        ${formatCurrency(
                            earnings.profit
                        )}
                    </h3>

                </article>

            </section>

            <section
                class="dashboard-card"
            >

                <div
                    class="card-header"
                >

                    <div>

                        <span
                            class="card-eyebrow"
                        >
                            MANUAL PERFORMANCE DATA
                        </span>

                        <h2>
                            Update Earnings
                        </h2>

                    </div>

                </div>

                <div
                    class="earnings-form"
                >

                    <input
                        type="number"
                        id="todayEarningsInput"
                        placeholder="Today's earnings"
                    >

                    <input
                        type="number"
                        id="lifetimeEarningsInput"
                        placeholder="Lifetime revenue"
                    >

                    <input
                        type="number"
                        id="profitInput"
                        placeholder="Estimated profit"
                    >

                    <button
                        class="primary-action"
                        id="saveEarningsBtn"
                    >
                        Save Earnings
                    </button>

                </div>

            </section>

        `;


        const saveButton =
            document.getElementById(
                "saveEarningsBtn"
            );


        if (saveButton) {

            saveButton.addEventListener(
                "click",
                () => {

                    const today =
                        Number(
                            document
                                .getElementById(
                                    "todayEarningsInput"
                                )
                                .value
                        ) || 0;


                    const lifetime =
                        Number(
                            document
                                .getElementById(
                                    "lifetimeEarningsInput"
                                )
                                .value
                        ) || 0;


                    const profit =
                        Number(
                            document
                                .getElementById(
                                    "profitInput"
                                )
                                .value
                        ) || 0;


                    dashboardState.earnings = {

                        today,

                        lifetime,

                        profit

                    };


                    saveDashboardData();

                    updateStatistics();


                    addActivity(
                        "Earnings updated",
                        "Revenue information was updated manually.",
                        "💰"
                    );


                    showToast(
                        "Earnings saved.",
                        "✓"
                    );

                }
            );

        }

    }


    /* =====================================================
       PRICE HISTORY
    ===================================================== */

    function renderPriceHistory(container) {

        const history =
            dashboardState.priceHistory;


        container.innerHTML = `

            <section class="dashboard-card">

                <div class="card-header">

                    <div>

                        <span class="card-eyebrow">
                            PRICE INTELLIGENCE
                        </span>

                        <h2>
                            Price History
                        </h2>

                    </div>

                </div>

                ${
                    history.length

                        ? history.map(
                            item => `

                            <div class="workspace-list-item">

                                <div class="workspace-item-icon">
                                    📉
                                </div>

                                <div class="workspace-item-content">

                                    <strong>
                                        ${escapeHTML(
                                            item.productName
                                        )}
                                    </strong>

                                    <small>
                                        ${formatDate(
                                            item.createdAt
                                        )}
                                    </small>

                                </div>

                                <div class="workspace-item-meta">

                                    ₹${formatNumber(
                                        item.price
                                    )}

                                </div>

                            </div>

                        `
                        ).join("")

                        : `

                        <div class="empty-state">

                            <div class="empty-state-icon">
                                📉
                            </div>

                            <h3>
                                No price history
                            </h3>

                            <p>
                                Product research results will appear here.
                            </p>

                        </div>

                    `
                }

            </section>

        `;

    }


    /* =====================================================
       FULL ACTIVITY
    ===================================================== */

    function renderFullActivity(container) {

        const activities =
            dashboardState.activities;


        container.innerHTML = `

            <section class="dashboard-card">

                <div class="card-header">

                    <div>

                        <span class="card-eyebrow">
                            SYSTEM LOG
                        </span>

                        <h2>
                            AI Activity
                        </h2>

                    </div>

                    <button
                        class="secondary-action"
                        id="clearActivityBtn"
                    >
                        Clear History
                    </button>

                </div>

                ${
                    activities.length

                        ? activities.map(
                            activity => `

                            <div class="workspace-list-item">

                                <div class="workspace-item-icon">

                                    ${escapeHTML(
                                        activity.icon
                                    )}

                                </div>

                                <div class="workspace-item-content">

                                    <strong>

                                        ${escapeHTML(
                                            activity.title
                                        )}

                                    </strong>

                                    <small>

                                        ${escapeHTML(
                                            activity.description
                                        )}

                                        ·

                                        ${formatDate(
                                            activity.createdAt
                                        )}

                                    </small>

                                </div>

                            </div>

                        `
                        ).join("")

                        : `

                        <div class="empty-state">

                            <div class="empty-state-icon">
                                ⚡
                            </div>

                            <h3>
                                No activity
                            </h3>

                        </div>

                    `
                }

            </section>

        `;


        const clearButton =
            document.getElementById(
                "clearActivityBtn"
            );


        if (clearButton) {

            clearButton.addEventListener(
                "click",
                () => {

                    dashboardState.activities =
                        [];


                    saveDashboardData();

                    renderActivityList();

                    renderFullActivity(
                        container
                    );


                    showToast(
                        "Activity history cleared.",
                        "🗑️"
                    );

                }
            );

        }

    }


    /* =====================================================
       CONNECT STORE BUTTON
    ===================================================== */

    if (connectStoreBtn) {

        connectStoreBtn.addEventListener(
            "click",
            () => {

                navigateToSection(
                    "stores"
                );

            }
        );

    }


    /* =====================================================
       MAIN PRODUCT ANALYZE BUTTON
    ===================================================== */

    if (analyzeProductBtn) {

        analyzeProductBtn.addEventListener(
            "click",
            () => {

                analyzeProduct(
                    productSearchInput
                        ? productSearchInput.value
                        : ""
                );

            }
        );

    }


    if (productSearchInput) {

        productSearchInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    analyzeProduct(
                        productSearchInput.value
                    );

                }

            }
        );

    }


    /* =====================================================
       NAVIGATION EVENTS
    ===================================================== */

    navItems.forEach(
        item => {

            item.addEventListener(
                "click",
                () => {

                    navigateToSection(
                        item.dataset.section
                    );

                }
            );

        }
    );


    /* =====================================================
       HEADER BUTTONS
    ===================================================== */

    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            toggleSidebar
        );

    }


    if (sidebarClose) {

        sidebarClose.addEventListener(
            "click",
            closeSidebar
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    if (startResearchBtn) {

        startResearchBtn.addEventListener(
            "click",
            () => {

                navigateToSection(
                    "product-research"
                );

            }
        );

    }


    if (viewAutomationBtn) {

        viewAutomationBtn.addEventListener(
            "click",
            () => {

                navigateToSection(
                    "automation"
                );

            }
        );

    }


    if (viewProductsBtn) {

        viewProductsBtn.addEventListener(
            "click",
            () => {

                navigateToSection(
                    "products"
                );

            }
        );

    }


    if (refreshDashboardBtn) {

        refreshDashboardBtn.addEventListener(
            "click",
            () => {

                updateStatistics();

                renderProductList();

                renderActivityList();

                updateSessionActivity();


                showToast(
                    "Dashboard refreshed.",
                    "↻"
                );

            }
        );

    }


    /* =====================================================
       GLOBAL SEARCH
    ===================================================== */

    if (globalSearch) {

        globalSearch.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !==
                    "Enter"
                ) return;


                const query =
                    globalSearch.value
                        .trim();


                if (!query) {

                    showToast(
                        "Enter a product name.",
                        "🔍"
                    );

                    return;

                }


                navigateToSection(
                    "product-research"
                );


                setTimeout(
                    () => {

                        const input =
                            document.getElementById(
                                "workspaceProductInput"
                            );


                        if (input) {

                            input.value =
                                query;

                            input.focus();

                        }

                    },
                    150
                );

            }
        );

    }


    /* =====================================================
       AI STATUS
    ===================================================== */

    if (aiStatusBtn) {

        aiStatusBtn.addEventListener(
            "click",
            () => {

                showToast(
                    "AI workspace is ready.",
                    "🤖"
                );

            }
        );

    }


    /* =====================================================
       PROFILE
    ===================================================== */

    if (profileButton) {

        profileButton.addEventListener(
            "click",
            () => {

                const name =
                    window.prompt(
                        "Enter workspace display name:",
                        dashboardState
                            .profile
                            .name
                    );


                if (
                    !name ||
                    !name.trim()
                ) {

                    return;

                }


                dashboardState.profile.name =
                    name.trim();


                dashboardState.profile.initials =
                    name
                        .trim()
                        .split(" ")
                        .slice(0, 2)
                        .map(
                            word =>
                                word[0]
                        )
                        .join("")
                        .toUpperCase();


                saveDashboardData();

                updateProfileUI();


                showToast(
                    "Profile updated.",
                    "✓"
                );

            }
        );

    }


    /* =====================================================
       SETTINGS
    ===================================================== */

    if (settingsBtn) {

        settingsBtn.addEventListener(
            "click",
            () => {

                navigateToSection(
                    "automation"
                );

            }
        );

    }


    /* =====================================================
       TOAST
    ===================================================== */

    let toastTimer = null;


    function showToast(
        message,
        icon = "✓"
    ) {

        let toast =
            document.getElementById(
                "smartMoneyToast"
            );


        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );


            toast.id =
                "smartMoneyToast";


            document.body.appendChild(
                toast
            );

        }


        toast.innerHTML = `

            <span class="toast-icon">
                ${escapeHTML(icon)}
            </span>

            <span class="toast-text">
                ${escapeHTML(message)}
            </span>

        `;


        toast.classList.add(
            "show"
        );


        clearTimeout(
            toastTimer
        );


        toastTimer =
            setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                3200
            );

    }


    /* =====================================================
       WINDOW EVENTS
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth >
                900
            ) {

                closeSidebar();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeSidebar();

            }

        }
    );


    window.addEventListener(
        "focus",
        () => {

            updateSessionActivity();

        }
    );


    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                !document.hidden
            ) {

                updateSessionActivity();

            }

        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initializeDashboard() {

        initializePersistentSession();

        loadDashboardData();

        updateProfileUI();

        updateStatistics();

        renderProductList();

        renderActivityList();


        if (aiStatus) {

            aiStatus.textContent =
                "AI Ready";

        }


        if (sidebarAiStatus) {

            sidebarAiStatus.textContent =
                "Ready for Analysis";

        }


        console.log(
            "SMART MONEY AI COMMERCE READY"
        );

        console.log(
            "Persistent dashboard session active"
        );

        console.log(
            "Seller connection hub ready"
        );

    }


    initializeDashboard();

});