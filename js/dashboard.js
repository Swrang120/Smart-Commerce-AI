/* =========================================================
   SMART MONEY AI COMMERCE
   COMPLETE DASHBOARD JAVASCRIPT
   ========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           CONFIG
        ================================================= */

        const appConfig =
            window.SM_CONFIG || {};


        /* =================================================
           DOM
        ================================================= */

        const sidebar =
            document.getElementById(
                "sidebar"
            );


        const menuToggle =
            document.getElementById(
                "menuToggle"
            );


        const sidebarClose =
            document.getElementById(
                "sidebarClose"
            );


        const sidebarOverlay =
            document.getElementById(
                "sidebarOverlay"
            );


        const sidebarNav =
            document.getElementById(
                "sidebarNav"
            );


        const navItems =
            document.querySelectorAll(
                ".nav-item"
            );


        const pageTitle =
            document.getElementById(
                "pageTitle"
            );


        const globalSearch =
            document.getElementById(
                "globalSearch"
            );


        const productSearchInput =
            document.getElementById(
                "productSearchInput"
            );


        const analyzeProductBtn =
            document.getElementById(
                "analyzeProductBtn"
            );


        const startResearchBtn =
            document.getElementById(
                "startResearchBtn"
            );


        const viewAutomationBtn =
            document.getElementById(
                "viewAutomationBtn"
            );


        const settingsBtn =
            document.getElementById(
                "settingsBtn"
            );


        const viewProductsBtn =
            document.getElementById(
                "viewProductsBtn"
            );


        const refreshDashboardBtn =
            document.getElementById(
                "refreshDashboardBtn"
            );


        const connectStoreBtn =
            document.getElementById(
                "connectStoreBtn"
            );


        const productList =
            document.getElementById(
                "productList"
            );


        const activityList =
            document.getElementById(
                "activityList"
            );


        const todayEarnings =
            document.getElementById(
                "todayEarnings"
            );


        const lifetimeRevenue =
            document.getElementById(
                "lifetimeRevenue"
            );


        const estimatedProfit =
            document.getElementById(
                "estimatedProfit"
            );


        const connectedStores =
            document.getElementById(
                "connectedStores"
            );


        const storeSummaryCount =
            document.getElementById(
                "storeSummaryCount"
            );


        const aiStatus =
            document.getElementById(
                "aiStatus"
            );


        const sidebarAiStatus =
            document.getElementById(
                "sidebarAiStatus"
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


        /* =================================================
           STATE
        ================================================= */

        const dashboardState = {

            products: [],

            activities: [],

            stores: [],

            earnings: {

                today: 0,

                lifetime: 0,

                profit: 0

            },

            isAnalyzing: false

        };


        let toastTimer = null;


        /* =================================================
           HELPERS
        ================================================= */

        function isMobile() {

            return window.innerWidth <= 900;

        }


        function escapeHTML(
            value
        ) {

            const element =
                document.createElement(
                    "div"
                );


            element.textContent =
                String(
                    value || ""
                );


            return element.innerHTML;

        }


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

                    minimumFractionDigits:
                        2,

                    maximumFractionDigits:
                        2

                }
            ).format(
                Number(
                    amount || 0
                )
            );

        }


        /* =================================================
           TOAST
        ================================================= */

        function showToast(
            message,
            icon = "✓"
        ) {

            if (
                !toast
            ) {

                return;

            }


            if (
                toastMessage
            ) {

                toastMessage.textContent =
                    message;

            }


            if (
                toastIcon
            ) {

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
                    3500
                );

        }


        /* =================================================
           SIDEBAR OPEN
        ================================================= */

        function openSidebar() {

            if (
                !sidebar
            ) {

                return;

            }


            sidebar.classList.add(
                "open"
            );


            if (
                sidebarOverlay
            ) {

                sidebarOverlay.classList.add(
                    "show"
                );

                sidebarOverlay.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }


            if (
                menuToggle
            ) {

                menuToggle.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }


            document.body.style.overflow =
                "hidden";

        }


        /* =================================================
           SIDEBAR CLOSE
        ================================================= */

        function closeSidebar() {

            if (
                !sidebar
            ) {

                return;

            }


            sidebar.classList.remove(
                "open"
            );


            if (
                sidebarOverlay
            ) {

                sidebarOverlay.classList.remove(
                    "show"
                );

                sidebarOverlay.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }


            if (
                menuToggle
            ) {

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }


            document.body.style.overflow =
                "";

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


        /* =================================================
           MOBILE MENU EVENTS
        ================================================= */

        if (
            menuToggle
        ) {

            menuToggle.addEventListener(
                "click",
                toggleSidebar
            );

        }


        if (
            sidebarClose
        ) {

            sidebarClose.addEventListener(
                "click",
                closeSidebar
            );

        }


        if (
            sidebarOverlay
        ) {

            sidebarOverlay.addEventListener(
                "click",
                closeSidebar
            );

        }


        /* =================================================
           NAVIGATION
        ================================================= */

        navItems.forEach(
            (
                item
            ) => {

                item.addEventListener(
                    "click",
                    () => {

                        const section =
                            item.dataset.section;


                        navItems.forEach(
                            (
                                navItem
                            ) => {

                                navItem.classList.remove(
                                    "active"
                                );

                            }
                        );


                        item.classList.add(
                            "active"
                        );


                        handleNavigation(
                            section
                        );


                        if (
                            isMobile()
                        ) {

                            closeSidebar();

                        }

                    }
                );

            }
        );


        function handleNavigation(
            section
        ) {

            const pageNames = {

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


            if (
                pageTitle
            ) {

                pageTitle.textContent =
                    pageNames[
                        section
                    ] ||
                    "Dashboard";

            }


            switch (
                section
            ) {

                case "dashboard":

                    window.scrollTo(
                        {

                            top: 0,

                            behavior:
                                "smooth"

                        }
                    );

                    break;


                case "product-research":

                    scrollToResearch();

                    break;


                case "products":

                    scrollToProducts();

                    break;


                case "activity":

                    scrollToActivity();

                    break;


                case "stores":

                    showToast(
                        "Store management will open here.",
                        "🏪"
                    );

                    break;


                case "automation":

                    showToast(
                        "Automation center selected.",
                        "⚙️"
                    );

                    break;


                case "ai-hunter":

                    showToast(
                        "AI Product Hunter selected.",
                        "🤖"
                    );

                    break;


                case "earnings":

                    showToast(
                        "Earnings analytics selected.",
                        "💰"
                    );

                    break;


                case "price-history":

                    showToast(
                        "Price history selected.",
                        "📉"
                    );

                    break;

            }

        }


        /* =================================================
           SCROLL HELPERS
        ================================================= */

        function scrollToResearch() {

            const target =
                document.querySelector(
                    ".research-card"
                );


            if (
                target
            ) {

                target.scrollIntoView(
                    {

                        behavior:
                            "smooth",

                        block:
                            "center"

                    }
                );

            }


            setTimeout(
                () => {

                    if (
                        productSearchInput
                    ) {

                        productSearchInput.focus();

                    }

                },
                500
            );

        }


        function scrollToProducts() {

            const target =
                document.querySelector(
                    ".trending-card"
                );


            if (
                target
            ) {

                target.scrollIntoView(
                    {

                        behavior:
                            "smooth"

                    }
                );

            }

        }


        function scrollToActivity() {

            const target =
                document.querySelector(
                    ".activity-card"
                );


            if (
                target
            ) {

                target.scrollIntoView(
                    {

                        behavior:
                            "smooth"

                    }
                );

            }

        }


        /* =================================================
           LOCAL STORAGE
        ================================================= */

        function loadData() {

            try {

                const products =
                    localStorage.getItem(
                        "sm_ai_products"
                    );


                const activities =
                    localStorage.getItem(
                        "sm_ai_activities"
                    );


                const stores =
                    localStorage.getItem(
                        "sm_ai_stores"
                    );


                const earnings =
                    localStorage.getItem(
                        "sm_ai_earnings"
                    );


                if (
                    products
                ) {

                    dashboardState.products =
                        JSON.parse(
                            products
                        );

                }


                if (
                    activities
                ) {

                    dashboardState.activities =
                        JSON.parse(
                            activities
                        );

                }


                if (
                    stores
                ) {

                    dashboardState.stores =
                        JSON.parse(
                            stores
                        );

                }


                if (
                    earnings
                ) {

                    dashboardState.earnings =
                        JSON.parse(
                            earnings
                        );

                }

            }
            catch (
                error
            ) {

                console.error(
                    "Dashboard load error:",
                    error
                );

            }

        }


        function saveData() {

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
           DEMO DATA
        ================================================= */

        function createDemoData() {

            if (
                dashboardState.products.length === 0
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

                        estimatedProfit:
                            649,

                        score:
                            92

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

                        estimatedProfit:
                            479,

                        score:
                            88

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

                        estimatedProfit:
                            649,

                        score:
                            84

                    }

                ];

            }


            if (
                dashboardState.activities.length === 0
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


            saveData();

        }


        /* =================================================
           RENDER STATISTICS
        ================================================= */

        function updateStatistics() {

            if (
                todayEarnings
            ) {

                todayEarnings.textContent =
                    formatCurrency(
                        dashboardState.earnings.today
                    );

            }


            if (
                lifetimeRevenue
            ) {

                lifetimeRevenue.textContent =
                    formatCurrency(
                        dashboardState.earnings.lifetime
                    );

            }


            if (
                estimatedProfit
            ) {

                estimatedProfit.textContent =
                    formatCurrency(
                        dashboardState.earnings.profit
                    );

            }


            const storeCount =
                dashboardState.stores.length;


            if (
                connectedStores
            ) {

                connectedStores.textContent =
                    storeCount;

            }


            if (
                storeSummaryCount
            ) {

                storeSummaryCount.textContent =
                    storeCount;

            }

        }


        /* =================================================
           RENDER PRODUCTS
        ================================================= */

        function renderProducts(
            products =
                dashboardState.products
        ) {

            if (
                !productList
            ) {

                return;

            }


            if (
                products.length === 0
            ) {

                productList.innerHTML =
                    `
                    <div class="empty-state">
                        <span>🔍</span>
                        <strong>No products found</strong>
                    </div>
                    `;


                return;

            }


            productList.innerHTML =
                products
                    .slice(
                        0,
                        5
                    )
                    .map(
                        (
                            product
                        ) => {

                            return `
                            <div class="product-item">

                                <div class="product-info">

                                    <div class="product-icon">
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

                                <div class="product-score">
                                    ${product.score}/100
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
           RENDER ACTIVITY
        ================================================= */

        function renderActivities() {

            if (
                !activityList
            ) {

                return;

            }


            activityList.innerHTML =
                dashboardState.activities
                    .slice(
                        0,
                        6
                    )
                    .map(
                        (
                            activity
                        ) => {

                            return `
                            <div class="activity-item">

                                <div class="activity-icon">
                                    ${activity.icon}
                                </div>

                                <div class="activity-content">

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


            saveData();

            renderActivities();

        }


        /* =================================================
           AI STATUS
        ================================================= */

        function setAIStatus(
            text
        ) {

            if (
                aiStatus
            ) {

                aiStatus.textContent =
                    text;

            }


            if (
                sidebarAiStatus
            ) {

                sidebarAiStatus.textContent =
                    text;

            }

        }


        /* =================================================
           PRODUCT ANALYSIS
        ================================================= */

        async function analyzeProduct() {

            if (
                dashboardState.isAnalyzing
            ) {

                return;

            }


            const productName =
                productSearchInput
                    ? productSearchInput.value.trim()
                    : "";


            if (
                !productName
            ) {

                showToast(
                    "Please enter a product name first.",
                    "⚠️"
                );


                if (
                    productSearchInput
                ) {

                    productSearchInput.focus();

                }


                return;

            }


            dashboardState.isAnalyzing =
                true;


            const originalText =
                analyzeProductBtn
                    ? analyzeProductBtn.innerHTML
                    : "";


            if (
                analyzeProductBtn
            ) {

                analyzeProductBtn.disabled =
                    true;

                analyzeProductBtn.innerHTML =
                    "⏳ Analyzing...";

            }


            setAIStatus(
                "AI Analyzing..."
            );


            await new Promise(
                (
                    resolve
                ) => {

                    setTimeout(
                        resolve,
                        1500
                    );

                }
            );


            const price =
                Math.floor(
                    Math.random() *
                    2500
                ) + 500;


            const cost =
                Math.floor(
                    price *
                    0.55
                );


            const product = {

                id:
                    "product_" +
                    Date.now(),

                name:
                    productName,

                source:
                    "AI Market Research",

                price:
                    price,

                estimatedProfit:
                    price - cost,

                score:
                    Math.floor(
                        Math.random() *
                        25
                    ) + 75

            };


            dashboardState.products.unshift(
                product
            );


            dashboardState.earnings.profit +=
                product.estimatedProfit;


            saveData();


            renderProducts();

            updateStatistics();


            addActivity(
                "AI analyzed product: " +
                product.name,
                "🔍"
            );


            showToast(
                product.name +
                " analyzed successfully.",
                "🤖"
            );


            if (
                productSearchInput
            ) {

                productSearchInput.value =
                    "";

            }


            setAIStatus(
                "Ready for Analysis"
            );


            dashboardState.isAnalyzing =
                false;


            if (
                analyzeProductBtn
            ) {

                analyzeProductBtn.disabled =
                    false;

                analyzeProductBtn.innerHTML =
                    originalText;

            }

        }


        /* =================================================
           GLOBAL SEARCH
        ================================================= */

        function searchProducts(
            query
        ) {

            const value =
                String(
                    query || ""
                )
                    .trim()
                    .toLowerCase();


            if (
                !value
            ) {

                renderProducts();

                return;

            }


            const filtered =
                dashboardState.products.filter(
                    (
                        product
                    ) => {

                        return (
                            product.name
                                .toLowerCase()
                                .includes(
                                    value
                                )
                        );

                    }
                );


            renderProducts(
                filtered
            );

        }


        /* =================================================
           EVENTS
        ================================================= */

        if (
            analyzeProductBtn
        ) {

            analyzeProductBtn.addEventListener(
                "click",
                analyzeProduct
            );

        }


        if (
            productSearchInput
        ) {

            productSearchInput.addEventListener(
                "keydown",
                (
                    event
                ) => {

                    if (
                        event.key === "Enter"
                    ) {

                        analyzeProduct();

                    }

                }
            );

        }


        if (
            globalSearch
        ) {

            globalSearch.addEventListener(
                "input",
                (
                    event
                ) => {

                    searchProducts(
                        event.target.value
                    );

                }
            );

        }


        if (
            startResearchBtn
        ) {

            startResearchBtn.addEventListener(
                "click",
                scrollToResearch
            );

        }


        if (
            viewAutomationBtn
        ) {

            viewAutomationBtn.addEventListener(
                "click",
                () => {

                    showToast(
                        "Automation center selected.",
                        "⚙️"
                    );

                }
            );

        }


        if (
            settingsBtn
        ) {

            settingsBtn.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "settings.html";

                }
            );

        }


        if (
            viewProductsBtn
        ) {

            viewProductsBtn.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "products.html";

                }
            );

        }


        if (
            connectStoreBtn
        ) {

            connectStoreBtn.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "stores.html";

                }
            );

        }


        if (
            refreshDashboardBtn
        ) {

            refreshDashboardBtn.addEventListener(
                "click",
                () => {

                    refreshDashboard();

                }
            );

        }


        function refreshDashboard() {

            setAIStatus(
                "Refreshing..."
            );


            const originalText =
                refreshDashboardBtn.innerHTML;


            refreshDashboardBtn.disabled =
                true;

            refreshDashboardBtn.innerHTML =
                "⏳ Refreshing";


            setTimeout(
                () => {

                    loadData();

                    updateStatistics();

                    renderProducts();

                    renderActivities();

                    setAIStatus(
                        "Ready for Analysis"
                    );


                    refreshDashboardBtn.disabled =
                        false;

                    refreshDashboardBtn.innerHTML =
                        originalText;


                    showToast(
                        "Dashboard refreshed.",
                        "🔄"
                    );

                },
                800
            );

        }


        /* =================================================
           ESC CLOSE
        ================================================= */

        document.addEventListener(
            "keydown",
            (
                event
            ) => {

                if (
                    event.key === "Escape"
                ) {

                    closeSidebar();

                }

            }
        );


        /* =================================================
           WINDOW RESIZE
        ================================================= */

        window.addEventListener(
            "resize",
            () => {

                if (
                    !isMobile()
                ) {

                    closeSidebar();

                }

            }
        );


        /* =================================================
           INITIALIZE
        ================================================= */

        function initializeDashboard() {

            loadData();

            createDemoData();

            updateStatistics();

            renderProducts();

            renderActivities();

            setAIStatus(
                "Ready for Analysis"
            );


            console.log(
                "SMART MONEY AI COMMERCE DASHBOARD READY"
            );


            console.log(
                "Environment:",
                appConfig.environment ||
                "development"
            );

        }


        initializeDashboard();


    }
);