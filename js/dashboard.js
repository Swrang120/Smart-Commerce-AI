/* =========================================================
   SMART MONEY AI COMMERCE
   COMPLETE FUNCTIONAL DASHBOARD JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       APP CONFIG
    ===================================================== */

    const appConfig = window.SM_CONFIG || {};

    const STORAGE_KEYS = {
        products: "sm_ai_products",
        activities: "sm_ai_activities",
        stores: "sm_ai_stores",
        earnings: "sm_ai_earnings",
        priceHistory: "sm_ai_price_history",
        profile: "sm_ai_profile",
        automation: "sm_ai_automation"
    };


    /* =====================================================
       DASHBOARD STATE
    ===================================================== */

    const dashboardState = {

        products: [],

        activities: [],

        stores: [],

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
                .slice(2, 8)
        );

    }


    /* =====================================================
       LOAD DATA
    ===================================================== */

    function loadDashboardData() {

        try {

            const products =
                JSON.parse(
                    localStorage.getItem(
                        STORAGE_KEYS.products
                    ) || "[]"
                );


            const activities =
                JSON.parse(
                    localStorage.getItem(
                        STORAGE_KEYS.activities
                    ) || "[]"
                );


            const stores =
                JSON.parse(
                    localStorage.getItem(
                        STORAGE_KEYS.stores
                    ) || "[]"
                );


            const earnings =
                JSON.parse(
                    localStorage.getItem(
                        STORAGE_KEYS.earnings
                    ) || "{}"
                );


            const priceHistory =
                JSON.parse(
                    localStorage.getItem(
                        STORAGE_KEYS.priceHistory
                    ) || "[]"
                );


            const profile =
                JSON.parse(
                    localStorage.getItem(
                        STORAGE_KEYS.profile
                    ) || "{}"
                );


            const automation =
                JSON.parse(
                    localStorage.getItem(
                        STORAGE_KEYS.automation
                    ) || "{}"
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


            if (
                earnings &&
                typeof earnings === "object"
            ) {

                dashboardState.earnings = {

                    today:
                        Number(
                            earnings.today
                        ) || 0,

                    lifetime:
                        Number(
                            earnings.lifetime
                        ) || 0,

                    profit:
                        Number(
                            earnings.profit
                        ) || 0

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
        catch (error) {

            console.error(
                "Dashboard load error:",
                error
            );

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

        }
        catch (error) {

            console.error(
                "Dashboard save error:",
                error
            );

        }

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
                createId(
                    "activity"
                ),

            title,

            description,

            icon,

            createdAt:
                new Date()
                    .toISOString()

        });


        dashboardState.activities =
            dashboardState.activities
                .slice(0, 50);


        saveDashboardData();


        renderActivityList();

    }


    /* =====================================================
       UPDATE PROFILE
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


        if (connectedStores) {

            connectedStores.textContent =
                formatNumber(
                    dashboardState.stores.length
                );

        }


        if (storeSummaryCount) {

            storeSummaryCount.textContent =
                formatNumber(
                    dashboardState.stores.length
                );

        }

    }


    /* =====================================================
       SIDEBAR
    ===================================================== */

    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add(
            "open"
        );


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
            "My Stores",

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
       STORE HOME CONTENT
    ===================================================== */

    function ensureDashboardHome() {

        if (!dashboardContent) return null;

        let home =
            document.getElementById(
                "dashboardHomeContent"
            );


        if (!home) {

            home =
                document.createElement(
                    "div"
                );


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
                    item.dataset.section === section
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
       SHOW WORKSPACE SECTION
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

                renderAIHunter(
                    dynamic
                );

                break;


            case "product-research":

                renderProductResearch(
                    dynamic
                );

                break;


            case "stores":

                renderStores(
                    dynamic
                );

                break;


            case "automation":

                renderAutomation(
                    dynamic
                );

                break;


            case "earnings":

                renderEarnings(
                    dynamic
                );

                break;


            case "products":

                renderProducts(
                    dynamic
                );

                break;


            case "price-history":

                renderPriceHistory(
                    dynamic
                );

                break;


            case "activity":

                renderFullActivity(
                    dynamic
                );

                break;


            default:

                renderAIHunter(
                    dynamic
                );

        }

    }


    /* =====================================================
       PRODUCT RESEARCH
    ===================================================== */

    function analyzeProduct(productName) {

        const name =
            String(
                productName ||
                ""
            )
                .trim();


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
                        Math.random() *
                        40
                    ) + 60;


                const competition =
                    Math.floor(
                        Math.random() *
                        60
                    ) + 20;


                const estimatedPrice =
                    Math.floor(
                        Math.random() *
                        4000
                    ) + 299;


                const opportunity =
                    demand -
                    Math.floor(
                        competition / 2
                    );


                const product = {

                    id:
                        createId(
                            "product"
                        ),

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
                        createId(
                            "price"
                        ),

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

                    <span>
                        🔍
                    </span>

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

                            ₹${formatNumber(product.estimatedPrice)}

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

                    <span>
                        ⚡
                    </span>

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
                            ${escapeHTML(activity.icon || "⚡")}
                        </div>

                        <div class="workspace-item-content">

                            <strong>
                                ${escapeHTML(activity.title)}
                            </strong>

                            <small>
                                ${escapeHTML(activity.description || "")}
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
                                dashboardState.products[0];


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
                                                ${escapeHTML(latest.name)}
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
                                            Estimated Market Price:
                                            <strong>
                                                ₹${formatNumber(latest.estimatedPrice)}
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
       PRODUCT RESEARCH SECTION
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

                        <p class="card-description">
                            Add a product name and create a research
                            record inside your workspace.
                        </p>

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
                            product opportunities saved in your workspace.
                        </p>

                    </div>

                </div>


                <div
                    class="full-products-list"
                    id="fullProductsList"
                >

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
                                                ${escapeHTML(product.name)}
                                            </strong>

                                            <small>
                                                Demand ${product.demand}% ·
                                                Competition ${product.competition}% ·
                                                Opportunity ${product.opportunity}
                                            </small>

                                        </div>

                                        <div class="workspace-item-meta">

                                            <strong>
                                                ₹${formatNumber(product.estimatedPrice)}
                                            </strong>

                                            <button
                                                class="delete-product-btn"
                                                data-product-id="${escapeHTML(product.id)}"
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
                                        Start product research to add
                                        opportunities here.
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
                                        product.id !== id
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
       STORES
    ===================================================== */

    function renderStores(container) {

        const stores =
            dashboardState.stores;


        container.innerHTML = `

            <section class="dashboard-card">

                <div class="card-header">

                    <div>

                        <span class="card-eyebrow">
                            AUTHORIZED INTEGRATIONS
                        </span>

                        <h2>
                            My Stores
                        </h2>

                        <p class="card-description">
                            Add store connections that you personally
                            manage and authorize.
                        </p>

                    </div>

                </div>


                <div class="research-input-row">

                    <input
                        type="text"
                        id="storeNameInput"
                        placeholder="Example: My Shopify Store"
                    >

                    <button
                        class="primary-action"
                        id="addStoreBtn"
                    >
                        + Add Store
                    </button>

                </div>


                <div
                    class="full-stores-list"
                    id="fullStoresList"
                >

                    ${
                        stores.length
                            ? stores.map(
                                store => `

                                    <div class="workspace-list-item">

                                        <div class="workspace-item-icon">
                                            🏪
                                        </div>

                                        <div class="workspace-item-content">

                                            <strong>
                                                ${escapeHTML(store.name)}
                                            </strong>

                                            <small>
                                                Added ${formatDate(store.createdAt)}
                                            </small>

                                        </div>

                                        <div class="workspace-item-meta">

                                            <span>
                                                Connected
                                            </span>

                                        </div>

                                    </div>

                                `
                            ).join("")
                            : `

                                <div class="empty-state">

                                    <div class="empty-state-icon">
                                        🏪
                                    </div>

                                    <h3>
                                        No stores connected
                                    </h3>

                                    <p>
                                        Add a store workspace to track
                                        your commerce operations.
                                    </p>

                                </div>

                            `
                    }

                </div>

            </section>

        `;


        const addButton =
            document.getElementById(
                "addStoreBtn"
            );


        const storeInput =
            document.getElementById(
                "storeNameInput"
            );


        if (addButton) {

            addButton.addEventListener(
                "click",
                () => {

                    const name =
                        storeInput.value.trim();


                    if (!name) {

                        showToast(
                            "Enter your store name.",
                            "🏪"
                        );

                        return;

                    }


                    dashboardState.stores.push({

                        id:
                            createId(
                                "store"
                            ),

                        name,

                        createdAt:
                            new Date()
                                .toISOString()

                    });


                    saveDashboardData();


                    updateStatistics();


                    addActivity(
                        "Store workspace added",
                        name +
                        " was added to your dashboard.",
                        "🏪"
                    );


                    renderStores(
                        container
                    );


                    showToast(
                        "Store added successfully.",
                        "✓"
                    );

                }
            );

        }

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

                        <p class="card-description">
                            Configure local workspace reminders and
                            research preferences.
                        </p>

                    </div>

                </div>


                <div class="automation-list">

                    <label class="automation-option">

                        <input
                            type="checkbox"
                            id="dailyResearchToggle"
                            ${automation.dailyResearch ? "checked" : ""}
                        >

                        <span>
                            Daily product research reminder
                        </span>

                    </label>


                    <label class="automation-option">

                        <input
                            type="checkbox"
                            id="contentReminderToggle"
                            ${automation.contentReminder ? "checked" : ""}
                        >

                        <span>
                            Content publishing reminder
                        </span>

                    </label>


                    <label class="automation-option">

                        <input
                            type="checkbox"
                            id="automationToggle"
                            ${automation.enabled ? "checked" : ""}
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

                        dashboardState.automation[key] =
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

            <section class="stats-grid earnings-section-stats">

                <article class="stat-card">

                    <p>
                        Today Earnings
                    </p>

                    <h3>
                        ${formatCurrency(earnings.today)}
                    </h3>

                </article>


                <article class="stat-card">

                    <p>
                        Lifetime Revenue
                    </p>

                    <h3>
                        ${formatCurrency(earnings.lifetime)}
                    </h3>

                </article>


                <article class="stat-card">

                    <p>
                        Estimated Profit
                    </p>

                    <h3>
                        ${formatCurrency(earnings.profit)}
                    </h3>

                </article>

            </section>


            <section class="dashboard-card">

                <div class="card-header">

                    <div>

                        <span class="card-eyebrow">
                            MANUAL PERFORMANCE DATA
                        </span>

                        <h2>
                            Update Earnings
                        </h2>

                    </div>

                </div>


                <div class="earnings-form">

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
                            document.getElementById(
                                "todayEarningsInput"
                            ).value
                        ) || 0;


                    const lifetime =
                        Number(
                            document.getElementById(
                                "lifetimeEarningsInput"
                            ).value
                        ) || 0;


                    const profit =
                        Number(
                            document.getElementById(
                                "profitInput"
                            ).value
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
                                            ${escapeHTML(item.productName)}
                                        </strong>

                                        <small>
                                            ${formatDate(item.createdAt)}
                                        </small>

                                    </div>

                                    <div class="workspace-item-meta">

                                        ₹${formatNumber(item.price)}

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
                                    Product research results will create
                                    price observations here.
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

                                        ${escapeHTML(activity.icon)}

                                    </div>

                                    <div class="workspace-item-content">

                                        <strong>

                                            ${escapeHTML(activity.title)}

                                        </strong>

                                        <small>

                                            ${escapeHTML(activity.description)}

                                            ·

                                            ${formatDate(activity.createdAt)}

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
                    "AI workspace is ready for product research.",
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
                        dashboardState.profile.name
                    );


                if (
                    !name ||
                    !name.trim()
                ) return;


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


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initializeDashboard() {

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

    }


    initializeDashboard();

});