/* =========================================================
   SMART MONEY AI COMMERCE
   STORES PAGE JAVASCRIPT
   File: js/stores.js
   ========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           DOM ELEMENTS
        ================================================= */

        const storesGrid =
            document.getElementById(
                "storesGrid"
            );


        const connectedStoresCount =
            document.getElementById(
                "connectedStoresCount"
            );


        const totalRevenue =
            document.getElementById(
                "totalRevenue"
            );


        const totalOrders =
            document.getElementById(
                "totalOrders"
            );


        const averageProfit =
            document.getElementById(
                "averageProfit"
            );


        const addStoreBtn =
            document.getElementById(
                "addStoreBtn"
            );


        const connectStoreBtn =
            document.getElementById(
                "connectStoreBtn"
            );


        const storeModal =
            document.getElementById(
                "storeModal"
            );


        const storeModalBackdrop =
            document.getElementById(
                "storeModalBackdrop"
            );


        const closeStoreModal =
            document.getElementById(
                "closeStoreModal"
            );


        const storeForm =
            document.getElementById(
                "storeForm"
            );


        const storeNameInput =
            document.getElementById(
                "storeName"
            );


        const storePlatformInput =
            document.getElementById(
                "storePlatform"
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


        const mobileMenuBtn =
            document.getElementById(
                "mobileMenuBtn"
            );


        const sidebar =
            document.getElementById(
                "sidebar"
            );



        /* =================================================
           STORAGE KEY
        ================================================= */

        const STORAGE_KEY =
            "sm_ai_commerce_stores";



        /* =================================================
           DEFAULT STORES
        ================================================= */

        const defaultStores = [

            {

                id:
                    "amazon-demo",

                name:
                    "Amazon Store",

                platform:
                    "Amazon",

                icon:
                    "🛒",

                status:
                    "Connected",

                revenue:
                    0,

                orders:
                    0,

                profit:
                    0,

                products:
                    0,

                lastSync:
                    "Not synced yet",

                demo:
                    true

            },


            {

                id:
                    "shopify-demo",

                name:
                    "Shopify Store",

                platform:
                    "Shopify",

                icon:
                    "🏪",

                status:
                    "Not Connected",

                revenue:
                    0,

                orders:
                    0,

                profit:
                    0,

                products:
                    0,

                lastSync:
                    "Not connected",

                demo:
                    true

            }


        ];



        /* =================================================
           GET STORES
        ================================================= */

        function getStores() {

            try {

                const savedStores =
                    localStorage.getItem(
                        STORAGE_KEY
                    );


                if (!savedStores) {

                    localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify(
                            defaultStores
                        )
                    );


                    return [
                        ...defaultStores
                    ];

                }


                const parsedStores =
                    JSON.parse(
                        savedStores
                    );


                if (
                    !Array.isArray(
                        parsedStores
                    )
                ) {

                    return [
                        ...defaultStores
                    ];

                }


                return parsedStores;

            }

            catch (error) {

                console.error(
                    "Store loading error:",
                    error
                );


                return [
                    ...defaultStores
                ];

            }

        }



        /* =================================================
           SAVE STORES
        ================================================= */

        function saveStores(
            stores
        ) {

            try {

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(
                        stores
                    )
                );

            }

            catch (error) {

                console.error(
                    "Store save error:",
                    error
                );

            }

        }



        /* =================================================
           CURRENT STORES
        ================================================= */

        let stores =
            getStores();



        /* =================================================
           FORMAT CURRENCY
        ================================================= */

        function formatCurrency(
            amount
        ) {

            const value =
                Number(
                    amount || 0
                );


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
                value
            );

        }



        /* =================================================
           ESCAPE HTML
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
                    value || ""
                );


            return element.innerHTML;

        }



        /* =================================================
           SHOW TOAST
        ================================================= */

        let toastTimer;


        function showToast(
            message,
            icon = "✓"
        ) {

            if (!toast) {

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
           CALCULATE SUMMARY
        ================================================= */

        function updateSummary() {

            const connectedStores =
                stores.filter(
                    (store) =>
                        store.status ===
                        "Connected"
                );


            const revenue =
                stores.reduce(
                    (
                        total,
                        store
                    ) => {

                        return (
                            total +
                            Number(
                                store.revenue ||
                                0
                            )
                        );

                    },
                    0
                );


            const orders =
                stores.reduce(
                    (
                        total,
                        store
                    ) => {

                        return (
                            total +
                            Number(
                                store.orders ||
                                0
                            )
                        );

                    },
                    0
                );


            const profit =
                stores.reduce(
                    (
                        total,
                        store
                    ) => {

                        return (
                            total +
                            Number(
                                store.profit ||
                                0
                            )
                        );

                    },
                    0
                );


            const profitPercentage =
                revenue > 0
                    ? (
                        profit /
                        revenue
                    ) * 100
                    : 0;


            if (
                connectedStoresCount
            ) {

                connectedStoresCount.textContent =
                    connectedStores.length;

            }


            if (
                totalRevenue
            ) {

                totalRevenue.textContent =
                    formatCurrency(
                        revenue
                    );

            }


            if (
                totalOrders
            ) {

                totalOrders.textContent =
                    orders;

            }


            if (
                averageProfit
            ) {

                averageProfit.textContent =
                    profitPercentage.toFixed(
                        1
                    ) + "%";

            }

        }



        /* =================================================
           GET STATUS CLASS
        ================================================= */

        function getStatusClass(
            status
        ) {

            if (
                status ===
                "Connected"
            ) {

                return (
                    "connected"
                );

            }


            if (
                status ===
                "Syncing"
            ) {

                return (
                    "syncing"
                );

            }


            return (
                "disconnected"
            );

        }



        /* =================================================
           RENDER STORES
        ================================================= */

        function renderStores() {

            if (
                !storesGrid
            ) {

                return;

            }


            if (
                stores.length === 0
            ) {

                storesGrid.innerHTML = `

                    <div class="stores-empty-state">

                        <div class="empty-icon">
                            🏪
                        </div>

                        <h3>
                            No Stores Added
                        </h3>

                        <p>
                            Add an authorized store to start
                            monitoring products, orders and
                            performance.
                        </p>

                    </div>

                `;


                updateSummary();

                return;

            }


            storesGrid.innerHTML =
                stores.map(
                    (
                        store
                    ) => {

                        const statusClass =
                            getStatusClass(
                                store.status
                            );


                        const isConnected =
                            store.status ===
                            "Connected";


                        return `

                            <article
                                class="store-card"
                                data-store-id="${escapeHTML(
                                    store.id
                                )}"
                            >


                                <div class="store-card-top">


                                    <div class="store-brand">


                                        <div class="store-brand-icon">

                                            ${escapeHTML(
                                                store.icon
                                            )}

                                        </div>


                                        <div>

                                            <h3>

                                                ${escapeHTML(
                                                    store.name
                                                )}

                                            </h3>


                                            <p>

                                                ${escapeHTML(
                                                    store.platform
                                                )}

                                            </p>

                                        </div>


                                    </div>


                                    <div
                                        class="store-status ${statusClass}"
                                    >

                                        <span></span>

                                        ${escapeHTML(
                                            store.status
                                        )}

                                    </div>


                                </div>



                                <div class="store-metrics">


                                    <div>

                                        <span>
                                            Revenue
                                        </span>

                                        <strong>

                                            ${formatCurrency(
                                                store.revenue
                                            )}

                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Orders
                                        </span>

                                        <strong>

                                            ${Number(
                                                store.orders ||
                                                0
                                            )}

                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Products
                                        </span>

                                        <strong>

                                            ${Number(
                                                store.products ||
                                                0
                                            )}

                                        </strong>

                                    </div>


                                </div>



                                <div class="store-card-footer">


                                    <small>

                                        Last sync:
                                        ${escapeHTML(
                                            store.lastSync
                                        )}

                                    </small>


                                    <div class="store-actions">


                                        <button
                                            class="store-action-btn sync-store-btn"
                                            data-store-id="${escapeHTML(
                                                store.id
                                            )}"
                                            type="button"
                                            ${!isConnected
                                                ? "disabled"
                                                : ""
                                            }
                                        >

                                            🔄 Sync

                                        </button>


                                        <button
                                            class="store-action-btn manage-store-btn"
                                            data-store-id="${escapeHTML(
                                                store.id
                                            )}"
                                            type="button"
                                        >

                                            Manage →

                                        </button>


                                    </div>


                                </div>


                            </article>

                        `;

                    }
                ).join(
                    ""
                );


            updateSummary();

            attachStoreEvents();

        }



        /* =================================================
           ATTACH STORE EVENTS
        ================================================= */

        function attachStoreEvents() {

            const syncButtons =
                document.querySelectorAll(
                    ".sync-store-btn"
                );


            const manageButtons =
                document.querySelectorAll(
                    ".manage-store-btn"
                );


            syncButtons.forEach(
                (
                    button
                ) => {

                    button.addEventListener(
                        "click",
                        () => {

                            const storeId =
                                button.dataset.storeId;


                            syncStore(
                                storeId
                            );

                        }
                    );

                }
            );


            manageButtons.forEach(
                (
                    button
                ) => {

                    button.addEventListener(
                        "click",
                        () => {

                            const storeId =
                                button.dataset.storeId;


                            manageStore(
                                storeId
                            );

                        }
                    );

                }
            );

        }



        /* =================================================
           SYNC STORE
        ================================================= */

        function syncStore(
            storeId
        ) {

            const store =
                stores.find(
                    (
                        item
                    ) =>
                        item.id ===
                        storeId
                );


            if (
                !store
            ) {

                return;

            }


            if (
                store.status !==
                "Connected"
            ) {

                showToast(
                    "Connect this store before syncing.",
                    "⚠️"
                );


                return;

            }


            store.status =
                "Syncing";


            renderStores();


            showToast(
                "Store sync started...",
                "🔄"
            );


            setTimeout(
                () => {

                    store.status =
                        "Connected";


                    store.lastSync =
                        new Date()
                            .toLocaleString(
                                "en-IN"
                            );


                    saveStores(
                        stores
                    );


                    renderStores();


                    showToast(
                        store.name +
                        " synced successfully.",
                        "✅"
                    );

                },
                1500
            );

        }



        /* =================================================
           MANAGE STORE
        ================================================= */

        function manageStore(
            storeId
        ) {

            const store =
                stores.find(
                    (
                        item
                    ) =>
                        item.id ===
                        storeId
                );


            if (
                !store
            ) {

                return;

            }


            showToast(
                store.name +
                " management panel will be added next.",
                "⚙️"
            );

        }



        /* =================================================
           OPEN MODAL
        ================================================= */

        function openModal() {

            if (
                !storeModal
            ) {

                return;

            }


            storeModal.classList.add(
                "show"
            );


            document.body.style.overflow =
                "hidden";


            setTimeout(
                () => {

                    if (
                        storeNameInput
                    ) {

                        storeNameInput.focus();

                    }

                },
                200
            );

        }



        /* =================================================
           CLOSE MODAL
        ================================================= */

        function closeModal() {

            if (
                !storeModal
            ) {

                return;

            }


            storeModal.classList.remove(
                "show"
            );


            document.body.style.overflow =
                "";


            if (
                storeForm
            ) {

                storeForm.reset();

            }

        }



        /* =================================================
           CREATE STORE
        ================================================= */

        function createStore(
            event
        ) {

            event.preventDefault();


            const name =
                storeNameInput
                    ? storeNameInput.value.trim()
                    : "";


            const platform =
                storePlatformInput
                    ? storePlatformInput.value
                    : "";


            if (
                !name ||
                !platform
            ) {

                showToast(
                    "Please enter store details.",
                    "⚠️"
                );


                return;

            }


            const duplicate =
                stores.some(
                    (
                        store
                    ) => {

                        return (
                            store.name
                                .toLowerCase() ===
                            name
                                .toLowerCase()
                        );

                    }
                );


            if (
                duplicate
            ) {

                showToast(
                    "This store already exists.",
                    "⚠️"
                );


                return;

            }


            const newStore = {

                id:
                    "store-" +
                    Date.now(),

                name:
                    name,

                platform:
                    platform,

                icon:
                    getPlatformIcon(
                        platform
                    ),

                status:
                    "Not Connected",

                revenue:
                    0,

                orders:
                    0,

                profit:
                    0,

                products:
                    0,

                lastSync:
                    "Not connected",

                demo:
                    false

            };


            stores.push(
                newStore
            );


            saveStores(
                stores
            );


            renderStores();


            closeModal();


            showToast(
                "Store added successfully.",
                "🏪"
            );

        }



        /* =================================================
           PLATFORM ICON
        ================================================= */

        function getPlatformIcon(
            platform
        ) {

            const icons = {

                Amazon:
                    "🛒",

                Shopify:
                    "🏪",

                Flipkart:
                    "🛍️",

                Meesho:
                    "📦",

                WooCommerce:
                    "🌐",

                Alibaba:
                    "🌍",

                Other:
                    "🏬"

            };


            return (
                icons[platform] ||
                "🏪"
            );

        }



        /* =================================================
           MOBILE SIDEBAR
        ================================================= */

        function toggleMobileSidebar() {

            if (
                !sidebar
            ) {

                return;

            }


            sidebar.classList.toggle(
                "show"
            );

        }



        /* =================================================
           BUTTON EVENTS
        ================================================= */

        if (
            addStoreBtn
        ) {

            addStoreBtn.addEventListener(
                "click",
                openModal
            );

        }


        if (
            connectStoreBtn
        ) {

            connectStoreBtn.addEventListener(
                "click",
                openModal
            );

        }


        if (
            closeStoreModal
        ) {

            closeStoreModal.addEventListener(
                "click",
                closeModal
            );

        }


        if (
            storeModalBackdrop
        ) {

            storeModalBackdrop.addEventListener(
                "click",
                closeModal
            );

        }


        if (
            storeForm
        ) {

            storeForm.addEventListener(
                "submit",
                createStore
            );

        }


        if (
            mobileMenuBtn
        ) {

            mobileMenuBtn.addEventListener(
                "click",
                toggleMobileSidebar
            );

        }



        /* =================================================
           ESCAPE KEY
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

                    closeModal();

                }

            }
        );



        /* =================================================
           INITIALIZE
        ================================================= */

        renderStores();


        console.log(
            "%cSMART MONEY AI COMMERCE STORES READY",
            "font-size:16px;font-weight:bold;color:#60a5fa;"
        );


    }
);