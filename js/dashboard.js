/* =========================================================
   SMART MONEY AI COMMERCE
   DASHBOARD JAVASCRIPT
   ========================================================= */


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           CONFIGURATION CHECK
        ================================================= */

        const appConfig =
            window.SM_CONFIG || null;


        const appName =
            appConfig?.appName ||
            "Smart Money AI Commerce";


        console.log(
            appName +
            " Dashboard Started"
        );


        /* =================================================
           DASHBOARD STATE
        ================================================= */

        const dashboardState = {


            products: [],


            activities: [],


            stores: [],


            notifications: [],


            earnings: {

                today: 0,

                lifetime: 0,

                profit: 0

            },


            selectedProduct: null,


            isAnalyzing: false

        };



        /* =================================================
           DOM ELEMENTS
        ================================================= */

        const sidebar =
            document.querySelector(
                ".sidebar"
            );


        const sidebarToggle =
            document.getElementById(
                "sidebarToggle"
            );


        const mobileMenuBtn =
            document.getElementById(
                "mobileMenuBtn"
            );


        const notificationBtn =
            document.getElementById(
                "notificationBtn"
            );


        const notificationPanel =
            document.getElementById(
                "notificationPanel"
            );


        const searchInput =
            document.getElementById(
                "productSearchInput"
            );


        const productSearchBtn =
            document.getElementById(
                "productSearchBtn"
            );


        const analyzeBtn =
            document.getElementById(
                "analyzeProductBtn"
            );


        const refreshBtn =
            document.getElementById(
                "refreshDashboardBtn"
            );


        const productTableBody =
            document.getElementById(
                "productTableBody"
            );


        const activityList =
            document.getElementById(
                "activityList"
            );


        const toast =
            document.getElementById(
                "toast"
            );


        const toastMessage =
            document.getElementById(
                "toastMessage"
            );


        const toastIcon =
            document.getElementById(
                "toastIcon"
            );


        const todayEarning =
            document.getElementById(
                "todayEarning"
            );


        const lifetimeEarning =
            document.getElementById(
                "lifetimeEarning"
            );


        const totalProfit =
            document.getElementById(
                "totalProfit"
            );


        const totalProducts =
            document.getElementById(
                "totalProducts"
            );


        const totalStores =
            document.getElementById(
                "totalStores"
            );


        const aiStatus =
            document.getElementById(
                "aiStatus"
            );



        /* =================================================
           TOAST SYSTEM
        ================================================= */

        let toastTimer;


        function showToast(
            message,
            icon = "✓"
        ) {

            if (!toast) {

                console.log(
                    message
                );

                return;

            }


            if (toastMessage) {

                toastMessage.textContent =
                    message;

            }


            if (toastIcon) {

                toastIcon.textContent =
                    icon;

            }


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
                    3000
                );

        }



        /* =================================================
           FORMAT CURRENCY
        ================================================= */

        function formatCurrency(
            amount
        ) {

            return new Intl.NumberFormat(
                "en-IN",
                {

                    style:
                        "currency",

                    currency:
                        "INR",

                    maximumFractionDigits:
                        0

                }
            ).format(
                Number(
                    amount || 0
                )
            );

        }



        /* =================================================
           FORMAT NUMBER
        ================================================= */

        function formatNumber(
            number
        ) {

            return new Intl.NumberFormat(
                "en-IN"
            ).format(
                Number(
                    number || 0
                )
            );

        }



        /* =================================================
           LOAD DASHBOARD DATA
        ================================================= */

        function loadDashboardData() {

            try {

                const savedProducts =
                    localStorage.getItem(
                        "sm_ai_products"
                    );


                const savedActivities =
                    localStorage.getItem(
                        "sm_ai_activities"
                    );


                const savedStores =
                    localStorage.getItem(
                        "sm_ai_stores"
                    );


                const savedEarnings =
                    localStorage.getItem(
                        "sm_ai_earnings"
                    );


                if (
                    savedProducts
                ) {

                    dashboardState.products =
                        JSON.parse(
                            savedProducts
                        );

                }


                if (
                    savedActivities
                ) {

                    dashboardState.activities =
                        JSON.parse(
                            savedActivities
                        );

                }


                if (
                    savedStores
                ) {

                    dashboardState.stores =
                        JSON.parse(
                            savedStores
                        );

                }


                if (
                    savedEarnings
                ) {

                    dashboardState.earnings =
                        JSON.parse(
                            savedEarnings
                        );

                }

            }
            catch (
                error
            ) {

                console.error(
                    "Dashboard data load error:",
                    error
                );

            }

        }



        /* =================================================
           SAVE DASHBOARD DATA
        ================================================= */

        function saveDashboardData() {

            localStorage.setItem(
                "sm_ai_products",
                JSON.stringify(
                    dashboardState.products
                )
            );


            localStorage.setItem(
                "sm_ai_activities",
                JSON.stringify(
                    dashboardState.activities
                )
            );


            localStorage.setItem(
                "sm_ai_stores",
                JSON.stringify(
                    dashboardState.stores
                )
            );


            localStorage.setItem(
                "sm_ai_earnings",
                JSON.stringify(
                    dashboardState.earnings
                )
            );

        }



        /* =================================================
           CREATE SAMPLE DATA
        ================================================= */

        function createInitialDemoData() {

            if (
                dashboardState.products.length ===
                0
            ) {

                dashboardState.products = [

                    {

                        id:
                            "demo_001",

                        name:
                            "Wireless Bluetooth Earbuds",

                        source:
                            "Market Research",

                        price:
                            1299,

                        estimatedCost:
                            650,

                        estimatedProfit:
                            649,

                        score:
                            92,

                        trend:
                            "High",

                        status:
                            "Research"

                    },


                    {

                        id:
                            "demo_002",

                        name:
                            "Smart LED Strip Light",

                        source:
                            "Market Research",

                        price:
                            899,

                        estimatedCost:
                            420,

                        estimatedProfit:
                            479,

                        score:
                            88,

                        trend:
                            "High",

                        status:
                            "Research"

                    },


                    {

                        id:
                            "demo_003",

                        name:
                            "Portable Mini Blender",

                        source:
                            "Market Research",

                        price:
                            1499,

                        estimatedCost:
                            850,

                        estimatedProfit:
                            649,

                        score:
                            84,

                        trend:
                            "Medium",

                        status:
                            "Research"

                    }

                ];

            }


            if (
                dashboardState.activities.length ===
                0
            ) {

                dashboardState.activities = [

                    {

                        icon:
                            "🤖",

                        title:
                            "AI Commerce system initialized",

                        time:
                            "Just now"

                    },


                    {

                        icon:
                            "🔍",

                        title:
                            "Product research engine ready",

                        time:
                            "Just now"

                    },


                    {

                        icon:
                            "📊",

                        title:
                            "Dashboard analytics enabled",

                        time:
                            "Just now"

                    }

                ];

            }


            saveDashboardData();

        }



        /* =================================================
           UPDATE STATISTICS
        ================================================= */

        function updateStatistics() {

            if (
                todayEarning
            ) {

                todayEarning.textContent =
                    formatCurrency(
                        dashboardState.earnings.today
                    );

            }


            if (
                lifetimeEarning
            ) {

                lifetimeEarning.textContent =
                    formatCurrency(
                        dashboardState.earnings.lifetime
                    );

            }


            if (
                totalProfit
            ) {

                totalProfit.textContent =
                    formatCurrency(
                        dashboardState.earnings.profit
                    );

            }


            if (
                totalProducts
            ) {

                totalProducts.textContent =
                    formatNumber(
                        dashboardState.products.length
                    );

            }


            if (
                totalStores
            ) {

                totalStores.textContent =
                    formatNumber(
                        dashboardState.stores.length
                    );

            }

        }



        /* =================================================
           PRODUCT SCORE CLASS
        ================================================= */

        function getScoreClass(
            score
        ) {

            if (
                score >= 85
            ) {

                return "excellent";

            }


            if (
                score >= 70
            ) {

                return "good";

            }


            if (
                score >= 50
            ) {

                return "average";

            }


            return "low";

        }



        /* =================================================
           PRODUCT STATUS CLASS
        ================================================= */

        function getStatusClass(
            status
        ) {

            const value =
                String(
                    status || ""
                ).toLowerCase();


            if (
                value === "live"
            ) {

                return "live";

            }


            if (
                value === "research"
            ) {

                return "research";

            }


            if (
                value === "paused"
            ) {

                return "paused";

            }


            return "research";

        }



        /* =================================================
           RENDER PRODUCTS
        ================================================= */

        function renderProducts(
            products =
                dashboardState.products
        ) {

            if (
                !productTableBody
            ) {

                return;

            }


            if (
                products.length === 0
            ) {

                productTableBody.innerHTML =
                    `
                    <tr>
                        <td
                            colspan="7"
                            class="empty-table"
                        >
                            <div>
                                <span>
                                    🔍
                                </span>

                                <strong>
                                    No products found
                                </strong>

                                <p>
                                    Search for a product to start AI analysis.
                                </p>
                            </div>
                        </td>
                    </tr>
                    `;


                return;

            }


            productTableBody.innerHTML =
                products
                    .map(
                        (
                            product
                        ) => {

                            return `
                            <tr
                                data-product-id="${product.id}"
                            >

                                <td>

                                    <div class="product-name-cell">

                                        <div class="product-avatar">
                                            🛍️
                                        </div>

                                        <div>

                                            <strong>
                                                ${escapeHTML(product.name)}
                                            </strong>

                                            <small>
                                                ${escapeHTML(product.source)}
                                            </small>

                                        </div>

                                    </div>

                                </td>


                                <td>
                                    ${formatCurrency(product.price)}
                                </td>


                                <td>
                                    ${formatCurrency(product.estimatedProfit)}
                                </td>


                                <td>

                                    <span
                                        class="score-badge ${getScoreClass(product.score)}"
                                    >
                                        ${product.score}/100
                                    </span>

                                </td>


                                <td>

                                    <span
                                        class="trend-badge"
                                    >
                                        📈 ${escapeHTML(product.trend)}
                                    </span>

                                </td>


                                <td>

                                    <span
                                        class="status-badge ${getStatusClass(product.status)}"
                                    >
                                        ${escapeHTML(product.status)}
                                    </span>

                                </td>


                                <td>

                                    <button
                                        type="button"
                                        class="table-action-btn"
                                        data-view-product="${product.id}"
                                    >
                                        View
                                    </button>

                                </td>

                            </tr>
                            `;

                        }
                    )
                    .join(
                        ""
                    );


            bindProductViewButtons();

        }



        /* =================================================
           HTML ESCAPE
        ================================================= */

        function escapeHTML(
            value
        ) {

            const div =
                document.createElement(
                    "div"
                );


            div.textContent =
                String(
                    value || ""
                );


            return div.innerHTML;

        }



        /* =================================================
           BIND PRODUCT BUTTONS
        ================================================= */

        function bindProductViewButtons() {

            const buttons =
                document.querySelectorAll(
                    "[data-view-product]"
                );


            buttons.forEach(
                (
                    button
                ) => {

                    button.addEventListener(
                        "click",
                        () => {

                            const productId =
                                button.dataset.viewProduct;


                            openProductDetails(
                                productId
                            );

                        }
                    );

                }
            );

        }



        /* =================================================
           PRODUCT DETAILS
        ================================================= */

        function openProductDetails(
            productId
        ) {

            const product =
                dashboardState.products.find(
                    (
                        item
                    ) =>
                        item.id ===
                        productId
                );


            if (
                !product
            ) {

                return;

            }


            dashboardState.selectedProduct =
                product;


            showToast(
                product.name +
                " selected. AI Score: " +
                product.score +
                "/100",
                "📦"
            );


            console.log(
                "Selected Product:",
                product
            );

        }



        /* =================================================
           RENDER ACTIVITIES
        ================================================= */

        function renderActivities() {

            if (
                !activityList
            ) {

                return;

            }


            if (
                dashboardState.activities.length ===
                0
            ) {

                activityList.innerHTML =
                    `
                    <div
                        class="empty-activity"
                    >
                        No recent activity
                    </div>
                    `;


                return;

            }


            activityList.innerHTML =
                dashboardState.activities
                    .slice(
                        0,
                        10
                    )
                    .map(
                        (
                            activity
                        ) => {

                            return `
                            <div
                                class="activity-item"
                            >

                                <div
                                    class="activity-icon"
                                >
                                    ${activity.icon}
                                </div>


                                <div
                                    class="activity-content"
                                >

                                    <strong>
                                        ${escapeHTML(activity.title)}
                                    </strong>


                                    <small>
                                        ${escapeHTML(activity.time)}
                                    </small>

                                </div>

                            </div>
                            `;

                        }
                    )
                    .join(
                        ""
                    );

        }



        /* =================================================
           ADD ACTIVITY
        ================================================= */

        function addActivity(
            title,
            icon = "🤖"
        ) {

            dashboardState.activities.unshift(
                {

                    title:
                        title,

                    icon:
                        icon,

                    time:
                        "Just now"

                }
            );


            dashboardState.activities =
                dashboardState.activities.slice(
                    0,
                    20
                );


            saveDashboardData();


            renderActivities();

        }



        /* =================================================
           PRODUCT SEARCH
        ================================================= */

        function searchProducts() {

            if (
                !searchInput
            ) {

                return;

            }


            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (
                !query
            ) {

                renderProducts();


                return;

            }


            const filteredProducts =
                dashboardState.products.filter(
                    (
                        product
                    ) => {

                        return (
                            product.name
                                .toLowerCase()
                                .includes(
                                    query
                                ) ||

                            product.source
                                .toLowerCase()
                                .includes(
                                    query
                                )
                        );

                    }
                );


            renderProducts(
                filteredProducts
            );

        }



        /* =================================================
           GENERATE PRODUCT SCORE
        ================================================= */

        function generateProductScore() {

            return Math.floor(
                Math.random() *
                30
            ) + 70;

        }



        /* =================================================
           GENERATE DEMO PRODUCT
        ================================================= */

        function generateProduct(
            productName
        ) {

            const score =
                generateProductScore();


            const price =
                Math.floor(
                    Math.random() *
                    2500
                ) + 500;


            const estimatedCost =
                Math.floor(
                    price *
                    (
                        0.40 +
                        Math.random() *
                        0.25
                    )
                );


            const profit =
                price -
                estimatedCost;


            return {

                id:
                    "product_" +
                    Date.now(),


                name:
                    productName,


                source:
                    "AI Market Research",


                price:
                    price,


                estimatedCost:
                    estimatedCost,


                estimatedProfit:
                    profit,


                score:
                    score,


                trend:
                    score >= 85
                        ? "High"
                        : "Medium",


                status:
                    "Research"

            };

        }



        /* =================================================
           AI PRODUCT ANALYSIS
        ================================================= */

        async function analyzeProduct() {

            if (
                dashboardState.isAnalyzing
            ) {

                return;

            }


            const query =
                searchInput
                    ? searchInput.value.trim()
                    : "";


            if (
                !query
            ) {

                showToast(
                    "Enter a product name first.",
                    "⚠️"
                );


                return;

            }


            dashboardState.isAnalyzing =
                true;


            setAIStatus(
                "Analyzing Product..."
            );


            const originalButtonHTML =
                analyzeBtn
                    ? analyzeBtn.innerHTML
                    : "";


            if (
                analyzeBtn
            ) {

                analyzeBtn.disabled =
                    true;


                analyzeBtn.innerHTML =
                    `
                    <span>
                        ⏳
                    </span>

                    AI Analyzing...
                    `;

            }


            try {

                /*
                   ------------------------------------------------
                   IMPORTANT
                   This is currently a safe dashboard analysis
                   placeholder.

                   RapidAPI calls should be performed through
                   your backend / Supabase Edge Functions.

                   Never put private API keys directly in
                   browser JavaScript.
                   ------------------------------------------------
                */


                await wait(
                    1800
                );


                const product =
                    generateProduct(
                        query
                    );


                dashboardState.products.unshift(
                    product
                );


                saveDashboardData();


                renderProducts();


                updateStatistics();


                addActivity(
                    "AI analyzed product: " +
                    product.name,
                    "🔍"
                );


                showToast(
                    product.name +
                    " analyzed successfully. Score: " +
                    product.score +
                    "/100",
                    "🤖"
                );

            }
            catch (
                error
            ) {

                console.error(
                    error
                );


                showToast(
                    "Product analysis failed.",
                    "⚠️"
                );

            }
            finally {

                dashboardState.isAnalyzing =
                    false;


                setAIStatus(
                    "AI Ready"
                );


                if (
                    analyzeBtn
                ) {

                    analyzeBtn.disabled =
                        false;


                    analyzeBtn.innerHTML =
                        originalButtonHTML;

                }

            }

        }



        /* =================================================
           WAIT HELPER
        ================================================= */

        function wait(
            milliseconds
        ) {

            return new Promise(
                (
                    resolve
                ) => {

                    setTimeout(
                        resolve,
                        milliseconds
                    );

                }
            );

        }



        /* =================================================
           AI STATUS
        ================================================= */

        function setAIStatus(
            status
        ) {

            if (
                !aiStatus
            ) {

                return;

            }


            aiStatus.textContent =
                status;

        }



        /* =================================================
           REFRESH DASHBOARD
        ================================================= */

        function refreshDashboard() {

            const originalHTML =
                refreshBtn
                    ? refreshBtn.innerHTML
                    : "";


            if (
                refreshBtn
            ) {

                refreshBtn.disabled =
                    true;


                refreshBtn.innerHTML =
                    "⏳ Refreshing";

            }


            setAIStatus(
                "Refreshing Data..."
            );


            setTimeout(
                () => {

                    loadDashboardData();


                    updateStatistics();


                    renderProducts();


                    renderActivities();


                    setAIStatus(
                        "AI Ready"
                    );


                    if (
                        refreshBtn
                    ) {

                        refreshBtn.disabled =
                            false;


                        refreshBtn.innerHTML =
                            originalHTML;

                    }


                    showToast(
                        "Dashboard refreshed successfully.",
                        "🔄"
                    );

                },
                900
            );

        }



        /* =================================================
           SIDEBAR TOGGLE
        ================================================= */

        function toggleSidebar() {

            if (
                !sidebar
            ) {

                return;

            }


            sidebar.classList.toggle(
                "collapsed"
            );


            localStorage.setItem(
                "sm_ai_sidebar_collapsed",
                sidebar.classList.contains(
                    "collapsed"
                )
                    ? "true"
                    : "false"
            );

        }



        /* =================================================
           LOAD SIDEBAR STATE
        ================================================= */

        function loadSidebarState() {

            if (
                !sidebar
            ) {

                return;

            }


            const isCollapsed =
                localStorage.getItem(
                    "sm_ai_sidebar_collapsed"
                );


            if (
                isCollapsed ===
                "true"
            ) {

                sidebar.classList.add(
                    "collapsed"
                );

            }

        }



        /* =================================================
           MOBILE MENU
        ================================================= */

        function toggleMobileMenu() {

            if (
                !sidebar
            ) {

                return;

            }


            sidebar.classList.toggle(
                "mobile-open"
            );

        }



        /* =================================================
           NOTIFICATION PANEL
        ================================================= */

        function toggleNotifications() {

            if (
                !notificationPanel
            ) {

                return;

            }


            notificationPanel.classList.toggle(
                "show"
            );

        }



        /* =================================================
           CLOSE PANELS OUTSIDE CLICK
        ================================================= */

        document.addEventListener(
            "click",
            (
                event
            ) => {

                if (
                    notificationPanel &&
                    notificationBtn &&
                    !notificationPanel.contains(
                        event.target
                    ) &&
                    !notificationBtn.contains(
                        event.target
                    )
                ) {

                    notificationPanel.classList.remove(
                        "show"
                    );

                }

            }
        );



        /* =================================================
           SEARCH EVENTS
        ================================================= */

        if (
            productSearchBtn
        ) {

            productSearchBtn.addEventListener(
                "click",
                searchProducts
            );

        }


        if (
            searchInput
        ) {

            searchInput.addEventListener(
                "input",
                searchProducts
            );


            searchInput.addEventListener(
                "keydown",
                (
                    event
                ) => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        analyzeProduct();

                    }

                }
            );

        }



        /* =================================================
           ANALYZE BUTTON
        ================================================= */

        if (
            analyzeBtn
        ) {

            analyzeBtn.addEventListener(
                "click",
                analyzeProduct
            );

        }



        /* =================================================
           REFRESH BUTTON
        ================================================= */

        if (
            refreshBtn
        ) {

            refreshBtn.addEventListener(
                "click",
                refreshDashboard
            );

        }



        /* =================================================
           SIDEBAR BUTTON
        ================================================= */

        if (
            sidebarToggle
        ) {

            sidebarToggle.addEventListener(
                "click",
                toggleSidebar
            );

        }



        /* =================================================
           MOBILE MENU BUTTON
        ================================================= */

        if (
            mobileMenuBtn
        ) {

            mobileMenuBtn.addEventListener(
                "click",
                toggleMobileMenu
            );

        }



        /* =================================================
           NOTIFICATION BUTTON
        ================================================= */

        if (
            notificationBtn
        ) {

            notificationBtn.addEventListener(
                "click",
                (
                    event
                ) => {

                    event.stopPropagation();


                    toggleNotifications();

                }
            );

        }



        /* =================================================
           KEYBOARD SHORTCUTS
        ================================================= */

        document.addEventListener(
            "keydown",
            (
                event
            ) => {

                /*
                   ESC
                */

                if (
                    event.key ===
                    "Escape"
                ) {

                    if (
                        notificationPanel
                    ) {

                        notificationPanel.classList.remove(
                            "show"
                        );

                    }


                    if (
                        sidebar
                    ) {

                        sidebar.classList.remove(
                            "mobile-open"
                        );

                    }

                }


                /*
                   Ctrl + K
                   Focus product search
                */

                if (
                    event.ctrlKey &&
                    event.key.toLowerCase() ===
                    "k"
                ) {

                    event.preventDefault();


                    if (
                        searchInput
                    ) {

                        searchInput.focus();

                    }

                }

            }
        );



        /* =================================================
           INITIALIZE DASHBOARD
        ================================================= */

        function initializeDashboard() {

            loadDashboardData();


            createInitialDemoData();


            loadSidebarState();


            updateStatistics();


            renderProducts();


            renderActivities();


            setAIStatus(
                "AI Ready"
            );


            console.log(
                "%cSMART MONEY AI COMMERCE READY",
                "font-size:16px;font-weight:bold;color:#38bdf8;"
            );


            console.log(
                "Environment:",
                appConfig?.environment ||
                "development"
            );

        }



        /* =================================================
           START APPLICATION
        ================================================= */

        initializeDashboard();


    }
);