/* =========================================================
   SMART MONEY AI COMMERCE
   COMPLETE DASHBOARD JAVASCRIPT
   FIXED FOR CURRENT dashboard.html
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           APP CONFIG
        ================================================= */

        const appConfig =
            window.SM_CONFIG ||
            {};


        const appName =
            appConfig.appName ||
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

            earnings: {

                today: 0,

                lifetime: 0,

                profit: 0

            },

            currentSection:
                "dashboard",

            selectedProduct:
                null,

            isAnalyzing:
                false

        };



        /* =================================================
           DOM ELEMENTS
        ================================================= */

        const sidebar =
            document.getElementById(
                "sidebar"
            );


        const sidebarOverlay =
            document.getElementById(
                "sidebarOverlay"
            );


        const menuToggle =
            document.getElementById(
                "menuToggle"
            );


        const sidebarClose =
            document.getElementById(
                "sidebarClose"
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


        const profileButton =
            document.getElementById(
                "profileButton"
            );


        const aiStatusBtn =
            document.getElementById(
                "aiStatusBtn"
            );


        const settingsBtn =
            document.getElementById(
                "settingsBtn"
            );


        const startResearchBtn =
            document.getElementById(
                "startResearchBtn"
            );


        const viewAutomationBtn =
            document.getElementById(
                "viewAutomationBtn"
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


        const dashboardContent =
            document.querySelector(
                ".dashboard-content"
            );



        /* =================================================
           SAFE HTML ESCAPE
        ================================================= */

        function escapeHTML(
            value
        ) {

            const element =
                document.createElement(
                    "div"
                );


            element.textContent =
                String(
                    value ??
                    ""
                );


            return element.innerHTML;

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

                    minimumFractionDigits:
                        2,

                    maximumFractionDigits:
                        2

                }
            ).format(
                Number(
                    amount ||
                    0
                )
            );

        }



        /* =================================================
           FORMAT NUMBER
        ================================================= */

        function formatNumber(
            value
        ) {

            return new Intl.NumberFormat(
                "en-IN"
            ).format(
                Number(
                    value ||
                    0
                )
            );

        }



        /* =================================================
           LOAD DATA
        ================================================= */

        function loadDashboardData() {

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

                    const parsedProducts =
                        JSON.parse(
                            products
                        );


                    if (
                        Array.isArray(
                            parsedProducts
                        )
                    ) {

                        dashboardState.products =
                            parsedProducts;

                    }

                }


                if (
                    activities
                ) {

                    const parsedActivities =
                        JSON.parse(
                            activities
                        );


                    if (
                        Array.isArray(
                            parsedActivities
                        )
                    ) {

                        dashboardState.activities =
                            parsedActivities;

                    }

                }


                if (
                    stores
                ) {

                    const parsedStores =
                        JSON.parse(
                            stores
                        );


                    if (
                        Array.isArray(
                            parsedStores
                        )
                    ) {

                        dashboardState.stores =
                            parsedStores;

                    }

                }


                if (
                    earnings
                ) {

                    const parsedEarnings =
                        JSON.parse(
                            earnings
                        );


                    if (
                        parsedEarnings &&
                        typeof parsedEarnings ===
                        "object"
                    ) {

                        dashboardState.earnings = {

                            today:
                                Number(
                                    parsedEarnings.today
                                ) ||
                                0,

                            lifetime:
                                Number(
                                    parsedEarnings.lifetime
                                ) ||
                                0,

                            profit:
                                Number(
                                    parsedEarnings.profit
                                ) ||
                                0

                        };

                    }

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



        /* =================================================
           SAVE DATA
        ================================================= */

        function saveDashboardData() {

            try {

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
            catch (
                error
            ) {

                console.error(
                    "Dashboard save error:",
                    error
                );

            }

        }



        /* =================================================
           CREATE INITIAL DATA
        ================================================= */

        function createInitialData() {

            if (
                !Array.isArray(
                    dashboardState.products
                )
            ) {

                dashboardState.products =
                    [];

            }


            if (
                !Array.isArray(
                    dashboardState.activities
                )
            ) {

                dashboardState.activities =
                    [];

            }


            if (
                !Array.isArray(
                    dashboardState.stores
                )
            ) {

                dashboardState.stores =
                    [];

            }


            saveDashboardData();

        }



        /* =================================================
           UPDATE STATISTICS
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


            if (
                connectedStores
            ) {

                connectedStores.textContent =
                    formatNumber(
                        dashboardState.stores.length
                    );

            }

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

            }


            document.body.classList.add(
                "sidebar-is-open"
            );

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

            }


            document.body.classList.remove(
                "sidebar-is-open"
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
           PAGE TITLES
        ================================================= */

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



        /* =================================================
           SECTION NAVIGATION
        ================================================= */

        function navigateToSection(
            section
        ) {

            if (
                !section
            ) {

                return;

            }


            dashboardState.currentSection =
                section;


            navItems.forEach(
                (
                    item
                ) => {

                    item.classList.toggle(
                        "active",
                        item.dataset.section ===
                        section
                    );

                }
            );


            const title =
                sectionTitles[
                    section
                ] ||
                "Dashboard";


            if (
                pageTitle
            ) {

                pageTitle.textContent =
                    title;

            }


            if (
                section ===
                "dashboard"
            ) {

                showDashboardSection();

            }
            else {

                showSectionPlaceholder(
                    section,
                    title
                );

            }


            if (
                window.innerWidth <=
                900
            ) {

                closeSidebar();

            }


            window.scrollTo(
                {

                    top: 0,

                    behavior:
                        "smooth"

                }
            );

        }



        /* =================================================
           RESTORE DASHBOARD
        ================================================= */

        function showDashboardSection() {

            const originalDashboard =
                document.getElementById(
                    "dashboardHomeContent"
                );


            const dynamicSection =
                document.getElementById(
                    "dynamicSection"
                );


            if (
                dynamicSection
            ) {

                dynamicSection.remove();

            }


            if (
                originalDashboard
            ) {

                originalDashboard.style.display =
                    "";

            }


            updateStatistics();

        }



        /* =================================================
           SHOW PLACEHOLDER SECTION
        ================================================= */

        function showSectionPlaceholder(
            section,
            title
        ) {

            if (
                !dashboardContent
            ) {

                return;

            }


            let homeContent =
                document.getElementById(
                    "dashboardHomeContent"
                );


            if (
                !homeContent
            ) {

                homeContent =
                    document.createElement(
                        "div"
                    );


                homeContent.id =
                    "dashboardHomeContent";


                while (
                    dashboardContent.firstChild
                ) {

                    homeContent.appendChild(
                        dashboardContent.firstChild
                    );

                }


                dashboardContent.appendChild(
                    homeContent
                );

            }


            homeContent.style.display =
                "none";


            let dynamicSection =
                document.getElementById(
                    "dynamicSection"
                );


            if (
                dynamicSection
            ) {

                dynamicSection.remove();

            }


            dynamicSection =
                document.createElement(
                    "section"
                );


            dynamicSection.id =
                "dynamicSection";


            dynamicSection.className =
                "dashboard-card";


            dynamicSection.innerHTML =
                createSectionContent(
                    section,
                    title
                );


            dashboardContent.appendChild(
                dynamicSection
            );


            bindDynamicButtons(
                section
            );

        }



        /* =================================================
           CREATE SECTION CONTENT
        ================================================= */

        function createSectionContent(
            section,
            title
        ) {

            const contentMap = {

                "ai-hunter":
                    {
                        icon: "🤖",
                        text:
                            "Discover products and organize product opportunities in your workspace.",
                        action:
                            "Start Research",
                        actionId:
                            "dynamicResearchBtn"
                    },


                "product-research":
                    {
                        icon: "🔍",
                        text:
                            "Research products, save ideas and track opportunities for later review.",
                        action:
                            "Open Product Research",
                        actionId:
                            "dynamicResearchBtn"
                    },


                stores:
                    {
                        icon: "🏪",
                        text:
                            "Manage your authorized store integrations and connected commerce accounts.",
                        action:
                            "Manage Stores",
                        actionId:
                            "dynamicStoresBtn"
                    },


                automation:
                    {
                        icon: "⚙️",
                        text:
                            "Configure automation workflows for approved services and connected accounts.",
                        action:
                            "View Automation",
                        actionId:
                            "dynamicAutomationBtn"
                    },


                earnings:
                    {
                        icon: "💰",
                        text:
                            "Review revenue, profit and connected store performance.",
                        action:
                            "Refresh Earnings",
                        actionId:
                            "dynamicEarningsBtn"
                    },


                products:
                    {
                        icon: "📦",
                        text:
                            "View and manage products saved in your Smart Money workspace.",
                        action:
                            "View Products",
                        actionId:
                            "dynamicProductsBtn"
                    },


                "price-history":
                    {
                        icon: "📉",
                        text:
                            "Track price observations and organize product market history.",
                        action:
                            "View Price History",
                        actionId:
                            "dynamicPriceBtn"
                    },


                activity:
                    {
                        icon: "⚡",
                        text:
                            "Review recent AI workspace activity and system events.",
                        action:
                            "Refresh Activity",
                        actionId:
                            "dynamicActivityBtn"
                    }

            };


            const data =
                contentMap[
                    section
                ] ||
                {

                    icon:
                        "📊",

                    text:
                        "This section is ready for configuration.",

                    action:
                        "Go Back",

                    actionId:
                        "dynamicBackBtn"

                };


            return `

                <div class="card-header">

                    <div>

                        <span class="card-eyebrow">
                            SMART MONEY WORKSPACE
                        </span>

                        <h2 class="card-title">
                            ${escapeHTML(title)}
                        </h2>

                        <p class="card-description">
                            ${escapeHTML(data.text)}
                        </p>

                    </div>

                </div>


                <div
                    class="empty-state"
                    style="margin-top:20px;"
                >

                    <div class="empty-state-icon">

                        ${data.icon}

                    </div>


                    <h3>

                        ${escapeHTML(title)}

                    </h3>


                    <p>

                        This workspace section is active.
                        The dashboard navigation is now connected
                        and ready for the next module.

                    </p>


                    <button
                        type="button"
                        class="primary-action"
                        id="${data.actionId}"
                        style="margin-top:18px;"
                    >

                        ${escapeHTML(data.action)}

                    </button>

                </div>

            `;

        }



        /* =================================================
           DYNAMIC SECTION BUTTONS
        ================================================= */

        function bindDynamicButtons(
            section
        ) {

            const researchBtn =
                document.getElementById(
                    "dynamicResearchBtn"
                );


            if (
                researchBtn
            ) {

                researchBtn.addEventListener(
                    "click",
                    () => {

                        showToast(
                            "Product research workspace selected.",
                            "🔍"
                        );

                    }
                );

            }


            const storesBtn =
                document.getElementById(
                    "dynamicStoresBtn"
                );


            if (
                storesBtn
            ) {

                storesBtn.addEventListener(
                    "click",
                    () => {

                        showToast(
                            "Store management module selected.",
                            "🏪"
                        );

                    }
                );

            }


            const automationBtn =
                document.getElementById(
                    "dynamicAutomationBtn"
                );


            if (
                automationBtn
            ) {

                automationBtn.addEventListener(
                    "click",
                    () => {

                        showToast(
                            "Automation workspace selected.",
                            "⚙️"
                        );

                    }
                );

            }


            const earningsBtn =
                document.getElementById(
                    "dynamicEarningsBtn"
                );


            if (
                earningsBtn
            ) {

                earningsBtn.addEventListener(
                    "click",
                    () => {

                        updateStatistics();


                        showToast(
                            "Earnings data refreshed.",
                            "💰"
                        );

                    }
                );

            }


            const productsBtn =
                document.getElementById(
                    "dynamicProductsBtn"
                );


            if (
                productsBtn
            ) {

                productsBtn.addEventListener(
                    "click",
                    () => {

                        showToast(
                            formatNumber(
                                dashboardState.products.length
                            ) +
                            " products found in workspace.",
                            "📦"
                        );

                    }
                );

            }


            const priceBtn =
                document.getElementById(
                    "dynamicPriceBtn"
                );


            if (
                priceBtn
            ) {

                priceBtn.addEventListener(
                    "click",
                    () => {

                        showToast(
                            "Price history module selected.",
                            "📉"
                        );

                    }
                );

            }


            const activityBtn =
                document.getElementById(
                    "dynamicActivityBtn"
                );


            if (
                activityBtn
            ) {

                activityBtn.addEventListener(
                    "click",
                    () => {

                        showToast(
                            "AI activity refreshed.",
                            "⚡"
                        );

                    }
                );

            }

        }



        /* =================================================
           TOAST SYSTEM
        ================================================= */

        let toastTimer =
            null;


        function showToast(
            message,
            icon = "✓"
        ) {

            let toast =
                document.getElementById(
                    "smartMoneyToast"
                );


            if (
                !toast
            ) {

                toast =
                    document.createElement(
                        "div"
                    );


                toast.id =
                    "smartMoneyToast";


                toast.style.position =
                    "fixed";


                toast.style.right =
                    "20px";


                toast.style.bottom =
                    "20px";


                toast.style.zIndex =
                    "9999";


                toast.style.maxWidth =
                    "320px";


                toast.style.padding =
                    "14px 18px";


                toast.style.borderRadius =
                    "14px";


                toast.style.background =
                    "#0e1d31";


                toast.style.border =
                    "1px solid rgba(96,165,250,0.35)";


                toast.style.boxShadow =
                    "0 18px 50px rgba(0,0,0,.35)";


                toast.style.color =
                    "#f8fafc";


                toast.style.display =
                    "flex";


                toast.style.alignItems =
                    "center";


                toast.style.gap =
                    "10px";


                toast.style.transform =
                    "translateY(30px)";


                toast.style.opacity =
                    "0";


                toast.style.transition =
                    "all .25s ease";


                document.body.appendChild(
                    toast
                );

            }


            toast.innerHTML =
                `

                <span
                    style="
                        font-size:20px;
                    "
                >
                    ${escapeHTML(icon)}
                </span>

                <span>

                    ${escapeHTML(message)}

                </span>

                `;


            requestAnimationFrame(
                () => {

                    toast.style.opacity =
                        "1";


                    toast.style.transform =
                        "translateY(0)";

                }
            );


            clearTimeout(
                toastTimer
            );


            toastTimer =
                setTimeout(
                    () => {

                        toast.style.opacity =
                            "0";


                        toast.style.transform =
                            "translateY(30px)";

                    },
                    3000
                );

        }



        /* =================================================
           NAV ITEM EVENTS
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


                        navigateToSection(
                            section
                        );

                    }
                );

            }
        );



        /* =================================================
           MENU TOGGLE
        ================================================= */

        if (
            menuToggle
        ) {

            menuToggle.addEventListener(
                "click",
                (
                    event
                ) => {

                    event.preventDefault();


                    event.stopPropagation();


                    toggleSidebar();

                }
            );

        }



        /* =================================================
           SIDEBAR CLOSE BUTTON
        ================================================= */

        if (
            sidebarClose
        ) {

            sidebarClose.addEventListener(
                "click",
                (
                    event
                ) => {

                    event.preventDefault();


                    closeSidebar();

                }
            );

        }



        /* =================================================
           OVERLAY CLICK
        ================================================= */

        if (
            sidebarOverlay
        ) {

            sidebarOverlay.addEventListener(
                "click",
                () => {

                    closeSidebar();

                }
            );

        }



        /* =================================================
           START PRODUCT RESEARCH
        ================================================= */

        if (
            startResearchBtn
        ) {

            startResearchBtn.addEventListener(
                "click",
                () => {

                    navigateToSection(
                        "product-research"
                    );

                }
            );

        }



        /* =================================================
           VIEW AUTOMATION
        ================================================= */

        if (
            viewAutomationBtn
        ) {

            viewAutomationBtn.addEventListener(
                "click",
                () => {

                    navigateToSection(
                        "automation"
                    );

                }
            );

        }



        /* =================================================
           SETTINGS
        ================================================= */

        if (
            settingsBtn
        ) {

            settingsBtn.addEventListener(
                "click",
                () => {

                    showToast(
                        "Settings panel will be added next.",
                        "⚙️"
                    );

                }
            );

        }



        /* =================================================
           AI STATUS BUTTON
        ================================================= */

        if (
            aiStatusBtn
        ) {

            aiStatusBtn.addEventListener(
                "click",
                () => {

                    showToast(
                        "AI system is online and ready.",
                        "🤖"
                    );

                }
            );

        }



        /* =================================================
           PROFILE BUTTON
        ================================================= */

        if (
            profileButton
        ) {

            profileButton.addEventListener(
                "click",
                () => {

                    showToast(
                        "Profile settings module will be connected here.",
                        "👤"
                    );

                }
            );

        }



        /* =================================================
           GLOBAL SEARCH
        ================================================= */

        if (
            globalSearch
        ) {

            globalSearch.addEventListener(
                "keydown",
                (
                    event
                ) => {

                    if (
                        event.key !==
                        "Enter"
                    ) {

                        return;

                    }


                    const query =
                        globalSearch.value
                            .trim();


                    if (
                        !query
                    ) {

                        showToast(
                            "Enter a product name to search.",
                            "🔍"
                        );


                        return;

                    }


                    navigateToSection(
                        "product-research"
                    );


                    showToast(
                        "Searching workspace for: " +
                        query,
                        "🔍"
                    );

                }
            );

        }



        /* =================================================
           WINDOW RESIZE FIX
        ================================================= */

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



        /* =================================================
           ESC KEY
        ================================================= */

        document.addEventListener(
            "keydown",
            (
                event
            ) => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeSidebar();

                }

            }
        );



        /* =================================================
           INITIALIZE
        ================================================= */

        function initializeDashboard() {

            loadDashboardData();


            createInitialData();


            updateStatistics();


            console.log(
                "%cSMART MONEY AI COMMERCE READY",
                "font-size:16px;font-weight:bold;color:#38bdf8;"
            );


            console.log(
                "Environment:",
                appConfig.environment ||
                "development"
            );

        }



        /* =================================================
           START APPLICATION
        ================================================= */

        initializeDashboard();


    }
);