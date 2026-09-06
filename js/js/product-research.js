/* =========================================================
   SMART MONEY AI COMMERCE
   PRODUCT RESEARCH ENGINE
   FILE: js/product-research.js
   ========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           STATE
        ================================================= */

        const researchState = {

            products: [],

            filteredProducts: [],

            savedProducts: [],

            currentSource:
                "all",

            currentSort:
                "score",

            searchQuery:
                "",

            isLoading:
                false

        };



        /* =================================================
           DOM ELEMENTS
        ================================================= */

        const productSearchInput =
            document.getElementById(
                "productSearchInput"
            );


        const searchProductBtn =
            document.getElementById(
                "searchProductBtn"
            );


        const productSourceSelect =
            document.getElementById(
                "productSourceSelect"
            );


        const productSortSelect =
            document.getElementById(
                "productSortSelect"
            );


        const minProfitInput =
            document.getElementById(
                "minProfitInput"
            );


        const minScoreInput =
            document.getElementById(
                "minScoreInput"
            );


        const productsGrid =
            document.getElementById(
                "productsGrid"
            );


        const researchStatus =
            document.getElementById(
                "researchStatus"
            );


        const resultCount =
            document.getElementById(
                "resultCount"
            );


        const clearFiltersBtn =
            document.getElementById(
                "clearFiltersBtn"
            );


        const savedProductsBtn =
            document.getElementById(
                "savedProductsBtn"
            );


        const researchRefreshBtn =
            document.getElementById(
                "researchRefreshBtn"
            );


        const toast =
            document.getElementById(
                "toast"
            );


        const toastIcon =
            document.getElementById(
                "toastIcon"
            );


        const toastMessage =
            document.getElementById(
                "toastMessage"
            );



        /* =================================================
           LOAD SAVED PRODUCTS
        ================================================= */

        function loadSavedProducts() {

            try {

                const saved =
                    localStorage.getItem(
                        "sm_ai_saved_products"
                    );


                if (!saved) {

                    researchState.savedProducts =
                        [];

                    return;

                }


                const parsed =
                    JSON.parse(
                        saved
                    );


                if (
                    Array.isArray(
                        parsed
                    )
                ) {

                    researchState.savedProducts =
                        parsed;

                }

            }

            catch (
                error
            ) {

                console.error(
                    "Unable to load saved products:",
                    error
                );


                researchState.savedProducts =
                    [];

            }

        }



        /* =================================================
           SAVE PRODUCTS
        ================================================= */

        function persistSavedProducts() {

            try {

                localStorage.setItem(
                    "sm_ai_saved_products",

                    JSON.stringify(
                        researchState.savedProducts
                    )
                );

            }

            catch (
                error
            ) {

                console.error(
                    "Unable to save products:",
                    error
                );

            }

        }



        /* =================================================
           GENERATE PRODUCT ID
        ================================================= */

        function createProductId(
            product
        ) {

            if (
                product.id
            ) {

                return String(
                    product.id
                );

            }


            const source =
                product.source ||
                "unknown";


            const title =
                product.title ||
                product.name ||
                "product";


            return (
                source +
                "_" +
                title
                    .toLowerCase()
                    .replace(
                        /[^a-z0-9]+/g,
                        "_"
                    )
                    .slice(
                        0,
                        80
                    )
            );

        }



        /* =================================================
           NUMBER PARSER
        ================================================= */

        function toNumber(
            value
        ) {

            if (
                typeof value ===
                "number"
            ) {

                return (
                    Number.isFinite(
                        value
                    )
                        ? value
                        : 0
                );

            }


            if (
                value === null ||
                value === undefined
            ) {

                return 0;

            }


            const cleaned =
                String(
                    value
                )
                    .replace(
                        /[^0-9.-]/g,
                        ""
                    );


            const parsed =
                Number(
                    cleaned
                );


            return (
                Number.isFinite(
                    parsed
                )
                    ? parsed
                    : 0
            );

        }



        /* =================================================
           FORMAT MONEY
        ================================================= */

        function formatMoney(
            amount
        ) {

            const value =
                toNumber(
                    amount
                );


            return (
                "₹" +
                new Intl.NumberFormat(
                    "en-IN",
                    {

                        maximumFractionDigits:
                            0

                    }
                ).format(
                    value
                )
            );

        }



        /* =================================================
           ESCAPE HTML
        ================================================= */

        function escapeHTML(
            value
        ) {

            const div =
                document.createElement(
                    "div"
                );


            div.textContent =
                value === null ||
                value === undefined
                    ? ""
                    : String(
                        value
                    );


            return div.innerHTML;

        }



        /* =================================================
           NORMALIZE PRODUCT
        ================================================= */

        function normalizeProduct(
            rawProduct,
            source = "unknown"
        ) {

            const product =
                rawProduct || {};


            const title =
                product.title ||
                product.name ||
                product.product_title ||
                product.productName ||
                "Untitled Product";


            const image =
                product.image ||
                product.image_url ||
                product.thumbnail ||
                product.product_image ||
                product.main_image ||
                "";


            const productUrl =
                product.url ||
                product.product_url ||
                product.link ||
                product.product_link ||
                "";


            const sellingPrice =
                toNumber(
                    product.price ||
                    product.current_price ||
                    product.sale_price ||
                    product.product_price ||
                    product.price_amount
                );


            const originalPrice =
                toNumber(
                    product.original_price ||
                    product.mrp ||
                    product.list_price ||
                    product.old_price
                );


            const rating =
                toNumber(
                    product.rating ||
                    product.stars ||
                    product.review_rating
                );


            const reviews =
                toNumber(
                    product.reviews ||
                    product.review_count ||
                    product.ratings_count
                );


            const rank =
                toNumber(
                    product.rank ||
                    product.best_seller_rank ||
                    product.bsr
                );


            const estimatedCost =
                toNumber(
                    product.cost ||
                    product.estimated_cost ||
                    (
                        sellingPrice > 0
                            ? sellingPrice *
                              0.62
                            : 0
                    )
                );


            const platformFee =
                toNumber(
                    product.platform_fee ||
                    (
                        sellingPrice > 0
                            ? sellingPrice *
                              0.10
                            : 0
                    )
                );


            const shippingCost =
                toNumber(
                    product.shipping_cost ||
                    (
                        sellingPrice > 0
                            ? sellingPrice *
                              0.05
                            : 0
                    )
                );


            const estimatedProfit =
                sellingPrice -
                estimatedCost -
                platformFee -
                shippingCost;


            const profitMargin =
                sellingPrice > 0
                    ? (
                        estimatedProfit /
                        sellingPrice
                    ) *
                    100
                    : 0;


            const opportunityScore =
                calculateOpportunityScore(
                    {

                        sellingPrice,
                        estimatedProfit,
                        profitMargin,
                        rating,
                        reviews,
                        rank

                    }
                );


            return {

                id:
                    createProductId(
                        {
                            ...product,
                            title,
                            source
                        }
                    ),

                title,

                source,

                image,

                productUrl,

                sellingPrice,

                originalPrice,

                estimatedCost,

                platformFee,

                shippingCost,

                estimatedProfit,

                profitMargin,

                rating,

                reviews,

                rank,

                opportunityScore,

                raw:
                    product

            };

        }



        /* =================================================
           AI OPPORTUNITY SCORE

           NOTE:
           This is a transparent scoring model, not a
           guarantee of sales or profit.
        ================================================= */

        function calculateOpportunityScore(
            data
        ) {

            let score =
                0;


            /* PROFIT */

            if (
                data.profitMargin >=
                35
            ) {

                score +=
                    35;

            }

            else if (
                data.profitMargin >=
                25
            ) {

                score +=
                    27;

            }

            else if (
                data.profitMargin >=
                15
            ) {

                score +=
                    18;

            }

            else if (
                data.profitMargin >
                0
            ) {

                score +=
                    8;

            }


            /* RATING */

            if (
                data.rating >=
                4.5
            ) {

                score +=
                    20;

            }

            else if (
                data.rating >=
                4
            ) {

                score +=
                    15;

            }

            else if (
                data.rating >=
                3.5
            ) {

                score +=
                    8;

            }


            /* REVIEW SIGNAL */

            if (
                data.reviews >=
                1000
            ) {

                score +=
                    15;

            }

            else if (
                data.reviews >=
                250
            ) {

                score +=
                    10;

            }

            else if (
                data.reviews >=
                50
            ) {

                score +=
                    5;

            }


            /*
               LOWER RANK CAN INDICATE
               STRONGER MARKET ACTIVITY
            */

            if (
                data.rank > 0 &&
                data.rank <= 100
            ) {

                score +=
                    20;

            }

            else if (
                data.rank > 0 &&
                data.rank <= 1000
            ) {

                score +=
                    15;

            }

            else if (
                data.rank > 0 &&
                data.rank <= 10000
            ) {

                score +=
                    8;

            }


            /*
               PRICE RANGE SIGNAL
            */

            if (
                data.sellingPrice >= 300 &&
                data.sellingPrice <= 3000
            ) {

                score +=
                    10;

            }

            else if (
                data.sellingPrice > 0
            ) {

                score +=
                    5;

            }


            return Math.max(
                0,

                Math.min(
                    100,
                    Math.round(
                        score
                    )
                )
            );

        }



        /* =================================================
           PRODUCT SOURCE BADGE
        ================================================= */

        function getSourceLabel(
            source
        ) {

            const labels = {

                amazon:
                    "Amazon",

                amazon23:
                    "Amazon",

                alibaba:
                    "Alibaba",

                shopify:
                    "Shopify",

                flipkart:
                    "Flipkart",

                meesho:
                    "Meesho",

                manual:
                    "Manual",

                unknown:
                    "Unknown"

            };


            return (
                labels[source] ||
                source
            );

        }



        /* =================================================
           SCORE LABEL
        ================================================= */

        function getScoreLabel(
            score
        ) {

            if (
                score >= 80
            ) {

                return "High Opportunity";

            }


            if (
                score >= 60
            ) {

                return "Good Potential";

            }


            if (
                score >= 40
            ) {

                return "Needs Review";

            }


            return "Low Potential";

        }



        /* =================================================
           STATUS
        ================================================= */

        function setResearchStatus(
            message
        ) {

            if (
                researchStatus
            ) {

                researchStatus.textContent =
                    message;

            }

        }



        /* =================================================
           TOAST
        ================================================= */

        let toastTimer;


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

                    3000
                );

        }



        /* =================================================
           UPDATE RESULT COUNT
        ================================================= */

        function updateResultCount() {

            if (
                resultCount
            ) {

                resultCount.textContent =
                    researchState.filteredProducts.length +
                    " products";

            }

        }



        /* =================================================
           APPLY FILTERS
        ================================================= */

        function applyFilters() {

            const query =
                researchState.searchQuery
                    .toLowerCase()
                    .trim();


            const source =
                researchState.currentSource;


            const minProfit =
                minProfitInput
                    ? toNumber(
                        minProfitInput.value
                    )
                    : 0;


            const minScore =
                minScoreInput
                    ? toNumber(
                        minScoreInput.value
                    )
                    : 0;


            researchState.filteredProducts =
                researchState.products.filter(
                    (product) => {


                        const title =
                            String(
                                product.title
                            ).toLowerCase();


                        const matchesQuery =
                            !query ||
                            title.includes(
                                query
                            );


                        const matchesSource =
                            source === "all" ||
                            product.source ===
                            source;


                        const matchesProfit =
                            product.estimatedProfit >=
                            minProfit;


                        const matchesScore =
                            product.opportunityScore >=
                            minScore;


                        return (

                            matchesQuery &&

                            matchesSource &&

                            matchesProfit &&

                            matchesScore

                        );

                    }
                );


            sortProducts();


            renderProducts();


            updateResultCount();

        }



        /* =================================================
           SORT PRODUCTS
        ================================================= */

        function sortProducts() {

            const sort =
                researchState.currentSort;


            researchState.filteredProducts.sort(
                (
                    a,
                    b
                ) => {


                    if (
                        sort === "profit"
                    ) {

                        return (
                            b.estimatedProfit -
                            a.estimatedProfit
                        );

                    }


                    if (
                        sort === "margin"
                    ) {

                        return (
                            b.profitMargin -
                            a.profitMargin
                        );

                    }


                    if (
                        sort === "price-low"
                    ) {

                        return (
                            a.sellingPrice -
                            b.sellingPrice
                        );

                    }


                    if (
                        sort === "price-high"
                    ) {

                        return (
                            b.sellingPrice -
                            a.sellingPrice
                        );

                    }


                    if (
                        sort === "rating"
                    ) {

                        return (
                            b.rating -
                            a.rating
                        );

                    }


                    return (
                        b.opportunityScore -
                        a.opportunityScore
                    );

                }
            );

        }



        /* =================================================
           CHECK SAVED PRODUCT
        ================================================= */

        function isProductSaved(
            productId
        ) {

            return (
                researchState.savedProducts.some(
                    (product) =>
                        product.id ===
                        productId
                )
            );

        }



        /* =================================================
           TOGGLE SAVE PRODUCT
        ================================================= */

        function toggleSaveProduct(
            productId
        ) {

            const product =
                researchState.products.find(
                    (item) =>
                        item.id ===
                        productId
                );


            if (
                !product
            ) {

                return;

            }


            const existingIndex =
                researchState.savedProducts.findIndex(
                    (item) =>
                        item.id ===
                        productId
                );


            if (
                existingIndex >=
                0
            ) {

                researchState.savedProducts.splice(
                    existingIndex,
                    1
                );


                showToast(
                    "Product removed from saved list.",
                    "🗑️"
                );

            }

            else {

                researchState.savedProducts.push(
                    product
                );


                showToast(
                    "Product saved for review.",
                    "⭐"
                );

            }


            persistSavedProducts();


            renderProducts();

        }



        /* =================================================
           CREATE PRODUCT CARD
        ================================================= */

        function createProductCard(
            product
        ) {

            const saved =
                isProductSaved(
                    product.id
                );


            const safeTitle =
                escapeHTML(
                    product.title
                );


            const safeImage =
                escapeHTML(
                    product.image
                );


            const safeUrl =
                escapeHTML(
                    product.productUrl
                );


            const sourceLabel =
                escapeHTML(
                    getSourceLabel(
                        product.source
                    )
                );


            const imageHTML =
                safeImage
                    ? `<img
                        src="${safeImage}"
                        alt="${safeTitle}"
                        loading="lazy"
                    >`
                    : `<div class="product-image-placeholder">
                        📦
                       </div>`;


            const productLinkHTML =
                safeUrl
                    ? `<a
                        href="${safeUrl}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="product-view-link"
                    >
                        View Product ↗
                       </a>`
                    : "";


            return `

                <article
                    class="research-product-card"
                    data-product-id="${escapeHTML(product.id)}"
                >

                    <div class="product-image-wrap">

                        ${imageHTML}


                        <span
                            class="product-source-badge"
                        >
                            ${sourceLabel}
                        </span>


                        <button
                            type="button"
                            class="save-product-btn ${
                                saved
                                    ? "saved"
                                    : ""
                            }"
                            data-save-product="${escapeHTML(product.id)}"
                            aria-label="Save product"
                        >
                            ${
                                saved
                                    ? "★"
                                    : "☆"
                            }
                        </button>

                    </div>



                    <div
                        class="product-card-content"
                    >

                        <h3>
                            ${safeTitle}
                        </h3>


                        <div
                            class="product-price-row"
                        >

                            <strong>
                                ${formatMoney(
                                    product.sellingPrice
                                )}
                            </strong>


                            ${
                                product.originalPrice >
                                product.sellingPrice
                                    ? `<span>
                                        ${formatMoney(
                                            product.originalPrice
                                        )}
                                       </span>`
                                    : ""
                            }

                        </div>



                        <div
                            class="product-score-row"
                        >

                            <div>

                                <span>
                                    AI Opportunity Score
                                </span>


                                <strong>
                                    ${product.opportunityScore}/100
                                </strong>

                            </div>


                            <small>
                                ${getScoreLabel(
                                    product.opportunityScore
                                )}
                            </small>

                        </div>



                        <div
                            class="product-metrics"
                        >

                            <div>

                                <span>
                                    Est. Profit
                                </span>

                                <strong>
                                    ${formatMoney(
                                        product.estimatedProfit
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Margin
                                </span>

                                <strong>
                                    ${product.profitMargin.toFixed(
                                        1
                                    )}%
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Rating
                                </span>

                                <strong>
                                    ${
                                        product.rating
                                            ? product.rating.toFixed(
                                                1
                                            )
                                            : "—"
                                    }
                                </strong>

                            </div>

                        </div>


                        <div
                            class="product-card-actions"
                        >

                            <button
                                type="button"
                                class="research-save-btn"
                                data-save-product="${escapeHTML(product.id)}"
                            >

                                ${
                                    saved
                                        ? "Saved ✓"
                                        : "Save Product"
                                }

                            </button>


                            ${productLinkHTML}

                        </div>

                    </div>

                </article>

            `;

        }



        /* =================================================
           RENDER PRODUCTS
        ================================================= */

        function renderProducts() {

            if (
                !productsGrid
            ) {

                return;

            }


            if (
                researchState.isLoading
            ) {

                productsGrid.innerHTML =
                    `

                    <div
                        class="research-loading"
                    >

                        <div
                            class="loading-spinner"
                        ></div>


                        <strong>
                            AI is analyzing products...
                        </strong>


                        <span>
                            Collecting available product data
                        </span>

                    </div>

                    `;


                return;

            }


            if (
                researchState.filteredProducts.length ===
                0
            ) {

                productsGrid.innerHTML =
                    `

                    <div
                        class="research-empty"
                    >

                        <div>
                            🔍
                        </div>


                        <h3>
                            No products found
                        </h3>


                        <p>
                            Try another keyword or adjust
                            your filters.
                        </p>

                    </div>

                    `;


                return;

            }


            productsGrid.innerHTML =
                researchState.filteredProducts
                    .map(
                        createProductCard
                    )
                    .join(
                        ""
                    );


            bindProductCardEvents();

        }



        /* =================================================
           PRODUCT CARD EVENTS
        ================================================= */

        function bindProductCardEvents() {

            const saveButtons =
                document.querySelectorAll(
                    "[data-save-product]"
                );


            saveButtons.forEach(
                (button) => {

                    button.addEventListener(
                        "click",
                        () => {

                            toggleSaveProduct(
                                button.dataset
                                    .saveProduct
                            );

                        }
                    );

                }
            );

        }



        /* =================================================
           EXTRACT PRODUCT LIST

           Supports different API response structures.
        ================================================= */

        function extractProducts(
            response
        ) {

            if (
                !response
            ) {

                return [];

            }


            if (
                Array.isArray(
                    response
                )
            ) {

                return response;

            }


            const possibleKeys = [

                "products",

                "data",

                "results",

                "items",

                "product_list",

                "productList"

            ];


            for (
                const key of
                possibleKeys
            ) {

                if (
                    Array.isArray(
                        response[key]
                    )
                ) {

                    return response[key];

                }


                if (
                    response.data &&
                    Array.isArray(
                        response.data[key]
                    )
                ) {

                    return response.data[key];

                }

            }


            return [];

        }



        /* =================================================
           API RESEARCH ADAPTER

           This tries to use API functions exposed by
           js/api.js.

           Expected optional functions:

           window.SM_API.searchAmazon(query)
           window.SM_API.searchShopify(query)
           window.SM_API.searchAlibaba(query)

        ================================================= */

        async function fetchProductsFromAPI(
            query,
            source
        ) {

            if (
                !window.SM_API
            ) {

                console.warn(
                    "SM_API is not available."
                );


                return [];

            }


            const api =
                window.SM_API;


            try {

                if (
                    source === "amazon" &&
                    typeof api.searchAmazon ===
                    "function"
                ) {

                    const response =
                        await api.searchAmazon(
                            query
                        );


                    return extractProducts(
                        response
                    );

                }


                if (
                    source === "amazon23" &&
                    typeof api.searchAmazon23 ===
                    "function"
                ) {

                    const response =
                        await api.searchAmazon23(
                            query
                        );


                    return extractProducts(
                        response
                    );

                }


                if (
                    source === "shopify" &&
                    typeof api.searchShopify ===
                    "function"
                ) {

                    const response =
                        await api.searchShopify(
                            query
                        );


                    return extractProducts(
                        response
                    );

                }


                if (
                    source === "alibaba" &&
                    typeof api.searchAlibaba ===
                    "function"
                ) {

                    const response =
                        await api.searchAlibaba(
                            query
                        );


                    return extractProducts(
                        response
                    );

                }


                return [];

            }

            catch (
                error
            ) {

                console.error(
                    "Product API research failed:",
                    source,
                    error
                );


                return [];

            }

        }



        /* =================================================
           RUN PRODUCT RESEARCH
        ================================================= */

        async function runProductResearch() {

            if (
                researchState.isLoading
            ) {

                return;

            }


            const query =
                productSearchInput
                    ? productSearchInput.value
                        .trim()
                    : "";


            if (
                !query
            ) {

                showToast(
                    "Enter a product keyword first.",
                    "🔍"
                );


                if (
                    productSearchInput
                ) {

                    productSearchInput.focus();

                }


                return;

            }


            researchState.searchQuery =
                query;


            researchState.isLoading =
                true;


            setResearchStatus(
                "AI research is running..."
            );


            renderProducts();


            const selectedSource =
                researchState.currentSource;


            let sources =
                [];


            if (
                selectedSource ===
                "all"
            ) {

                sources = [

                    "amazon",

                    "amazon23",

                    "shopify",

                    "alibaba"

                ];

            }

            else {

                sources = [
                    selectedSource
                ];

            }


            const results =
                await Promise.allSettled(
                    sources.map(
                        async (
                            source
                        ) => {

                            const products =
                                await fetchProductsFromAPI(
                                    query,
                                    source
                                );


                            return products.map(
                                (
                                    product
                                ) =>
                                    normalizeProduct(
                                        product,
                                        source
                                    )
                            );

                        }
                    )
                );


            const collected =
                [];


            results.forEach(
                (result) => {

                    if (
                        result.status ===
                        "fulfilled"
                    ) {

                        collected.push(
                            ...result.value
                        );

                    }

                }
            );


            researchState.products =
                removeDuplicateProducts(
                    collected
                );


            researchState.isLoading =
                false;


            applyFilters();


            setResearchStatus(
                researchState.products.length +
                " products analyzed"
            );


            if (
                researchState.products.length >
                0
            ) {

                showToast(
                    researchState.products.length +
                    " products analyzed successfully.",
                    "🤖"
                );

            }

            else {

                showToast(
                    "No product data was returned. Check API configuration.",
                    "⚠️"
                );

            }

        }



        /* =================================================
           REMOVE DUPLICATE PRODUCTS
        ================================================= */

        function removeDuplicateProducts(
            products
        ) {

            const seen =
                new Set();


            return products.filter(
                (product) => {

                    const key =
                        String(
                            product.title
                        )
                            .toLowerCase()
                            .trim();


                    if (
                        seen.has(
                            key
                        )
                    ) {

                        return false;

                    }


                    seen.add(
                        key
                    );


                    return true;

                }
            );

        }



        /* =================================================
           SHOW SAVED PRODUCTS
        ================================================= */

        function showSavedProducts() {

            researchState.products =
                [
                    ...researchState.savedProducts
                ];


            researchState.searchQuery =
                "";


            if (
                productSearchInput
            ) {

                productSearchInput.value =
                    "";

            }


            applyFilters();


            setResearchStatus(
                researchState.savedProducts.length +
                " saved products"
            );


            showToast(
                "Showing saved products.",
                "⭐"
            );

        }



        /* =================================================
           CLEAR FILTERS
        ================================================= */

        function clearFilters() {

            researchState.currentSource =
                "all";


            researchState.currentSort =
                "score";


            researchState.searchQuery =
                "";


            if (
                productSearchInput
            ) {

                productSearchInput.value =
                    "";

            }


            if (
                productSourceSelect
            ) {

                productSourceSelect.value =
                    "all";

            }


            if (
                productSortSelect
            ) {

                productSortSelect.value =
                    "score";

            }


            if (
                minProfitInput
            ) {

                minProfitInput.value =
                    "";

            }


            if (
                minScoreInput
            ) {

                minScoreInput.value =
                    "";

            }


            applyFilters();


            showToast(
                "Filters cleared.",
                "✓"
            );

        }



        /* =================================================
           SEARCH EVENTS
        ================================================= */

        if (
            searchProductBtn
        ) {

            searchProductBtn.addEventListener(
                "click",
                runProductResearch
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
                        event.key ===
                        "Enter"
                    ) {

                        runProductResearch();

                    }

                }
            );

        }



        /* =================================================
           SOURCE FILTER
        ================================================= */

        if (
            productSourceSelect
        ) {

            productSourceSelect.addEventListener(
                "change",
                () => {

                    researchState.currentSource =
                        productSourceSelect.value;


                    applyFilters();

                }
            );

        }



        /* =================================================
           SORT FILTER
        ================================================= */

        if (
            productSortSelect
        ) {

            productSortSelect.addEventListener(
                "change",
                () => {

                    researchState.currentSort =
                        productSortSelect.value;


                    applyFilters();

                }
            );

        }



        /* =================================================
           PROFIT FILTER
        ================================================= */

        if (
            minProfitInput
        ) {

            minProfitInput.addEventListener(
                "input",
                applyFilters
            );

        }



        /* =================================================
           SCORE FILTER
        ================================================= */

        if (
            minScoreInput
        ) {

            minScoreInput.addEventListener(
                "input",
                applyFilters
            );

        }



        /* =================================================
           CLEAR FILTER EVENT
        ================================================= */

        if (
            clearFiltersBtn
        ) {

            clearFiltersBtn.addEventListener(
                "click",
                clearFilters
            );

        }



        /* =================================================
           SAVED PRODUCTS EVENT
        ================================================= */

        if (
            savedProductsBtn
        ) {

            savedProductsBtn.addEventListener(
                "click",
                showSavedProducts
            );

        }



        /* =================================================
           REFRESH EVENT
        ================================================= */

        if (
            researchRefreshBtn
        ) {

            researchRefreshBtn.addEventListener(
                "click",
                runProductResearch
            );

        }



        /* =================================================
           INITIALIZE
        ================================================= */

        loadSavedProducts();


        setResearchStatus(
            "Ready for product research"
        );


        researchState.filteredProducts =
            [];


        renderProducts();


        console.log(
            "%cSMART MONEY AI PRODUCT RESEARCH READY",

            "font-size:16px;" +
            "font-weight:bold;" +
            "color:#60a5fa;"
        );


        /* ================================================
           OPTIONAL GLOBAL ACCESS
        ================================================= */

        window.SM_PRODUCT_RESEARCH = {

            run:
                runProductResearch,

            getProducts:
                () =>
                    [
                        ...researchState.products
                    ],

            getSavedProducts:
                () =>
                    [
                        ...researchState.savedProducts
                    ],

            clearFilters

        };


    }
);