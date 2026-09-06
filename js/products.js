/* =========================================================
   SMART MONEY AI COMMERCE
   PRODUCTS PAGE CONTROLLER
   FILE: js/products.js
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           DOM ELEMENTS
        ================================================= */

        const productSearchInput =
            document.getElementById(
                "productSearchInput"
            );


        const productSearchBtn =
            document.getElementById(
                "productSearchBtn"
            );


        const productResults =
            document.getElementById(
                "productResults"
            );


        const productResultCount =
            document.getElementById(
                "productResultCount"
            );


        const marketplaceFilter =
            document.getElementById(
                "marketplaceFilter"
            );


        const categoryFilter =
            document.getElementById(
                "categoryFilter"
            );


        const minPriceFilter =
            document.getElementById(
                "minPriceFilter"
            );


        const maxPriceFilter =
            document.getElementById(
                "maxPriceFilter"
            );


        const clearFiltersBtn =
            document.getElementById(
                "clearFiltersBtn"
            );


        const sortProducts =
            document.getElementById(
                "sortProducts"
            );


        const quickSearchButtons =
            document.querySelectorAll(
                ".quick-search-btn"
            );


        const researchStatusText =
            document.getElementById(
                "researchStatusText"
            );


        const researchSourceCount =
            document.getElementById(
                "researchSourceCount"
            );


        const aiResearchStatus =
            document.getElementById(
                "aiResearchStatus"
            );


        const productAnalysisPanel =
            document.getElementById(
                "productAnalysisPanel"
            );


        const analysisProductName =
            document.getElementById(
                "analysisProductName"
            );


        const analysisScore =
            document.getElementById(
                "analysisScore"
            );


        const analysisScoreLabel =
            document.getElementById(
                "analysisScoreLabel"
            );


        const analysisMarketSignal =
            document.getElementById(
                "analysisMarketSignal"
            );


        const analysisPriceRange =
            document.getElementById(
                "analysisPriceRange"
            );


        const analysisMargin =
            document.getElementById(
                "analysisMargin"
            );


        const analysisAiNote =
            document.getElementById(
                "analysisAiNote"
            );


        const closeAnalysisBtn =
            document.getElementById(
                "closeAnalysisBtn"
            );


        const researchAgainBtn =
            document.getElementById(
                "researchAgainBtn"
            );


        const saveProductBtn =
            document.getElementById(
                "saveProductBtn"
            );


        const mobileMenuBtn =
            document.getElementById(
                "mobileMenuBtn"
            );


        const sidebar =
            document.getElementById(
                "sidebar"
            );


        const appToast =
            document.getElementById(
                "appToast"
            );


        const appToastIcon =
            document.getElementById(
                "appToastIcon"
            );


        const appToastMessage =
            document.getElementById(
                "appToastMessage"
            );



        /* =================================================
           APPLICATION STATE
        ================================================= */

        let allProducts = [];


        let filteredProducts = [];


        let selectedProduct = null;


        let isSearching = false;


        const SAVED_PRODUCTS_KEY =
            "sm_ai_commerce_saved_products";


        const LAST_SEARCH_KEY =
            "sm_ai_commerce_last_search";



        /* =================================================
           BASIC SAFETY CHECK
        ================================================= */

        if (
            !productSearchInput ||
            !productSearchBtn ||
            !productResults
        ) {

            console.error(
                "Products page required elements were not found."
            );


            return;

        }



        /* =================================================
           TOAST SYSTEM
        ================================================= */

        let toastTimer;


        function showToast(
            message,
            icon = "✓"
        ) {

            if (!appToast) {

                return;

            }


            if (appToastMessage) {

                appToastMessage.textContent =
                    message;

            }


            if (appToastIcon) {

                appToastIcon.textContent =
                    icon;

            }


            appToast.classList.add(
                "show"
            );


            clearTimeout(
                toastTimer
            );


            toastTimer =
                setTimeout(
                    () => {

                        appToast.classList.remove(
                            "show"
                        );

                    },
                    3000
                );

        }



        /* =================================================
           UPDATE RESEARCH STATUS
        ================================================= */

        function setResearchStatus(
            message,
            sourceCount = 0
        ) {

            if (researchStatusText) {

                researchStatusText.textContent =
                    message;

            }


            if (researchSourceCount) {

                const sourceText =
                    sourceCount === 1
                        ? "1 source"
                        : sourceCount + " sources";


                researchSourceCount.textContent =
                    sourceText;

            }

        }



        /* =================================================
           ESCAPE HTML
        ================================================= */

        function escapeHTML(
            value
        ) {

            if (
                value === null ||
                value === undefined
            ) {

                return "";

            }


            const div =
                document.createElement(
                    "div"
                );


            div.textContent =
                String(value);


            return div.innerHTML;

        }



        /* =================================================
           FORMAT NUMBER
        ================================================= */

        function formatNumber(
            value
        ) {

            const number =
                Number(value);


            if (
                Number.isNaN(number)
            ) {

                return "0";

            }


            return number.toLocaleString(
                "en-IN"
            );

        }



        /* =================================================
           FORMAT PRICE
        ================================================= */

        function formatPrice(
            value,
            currency = "₹"
        ) {

            if (
                value === null ||
                value === undefined ||
                value === ""
            ) {

                return "Price unavailable";

            }


            let numericValue =
                value;


            if (
                typeof value ===
                "string"
            ) {

                numericValue =
                    value
                        .replace(
                            /[^0-9.]/g,
                            ""
                        );

            }


            const number =
                Number(
                    numericValue
                );


            if (
                Number.isNaN(
                    number
                )
            ) {

                return String(
                    value
                );

            }


            return (
                currency +
                formatNumber(
                    Math.round(
                        number
                    )
                )
            );

        }



        /* =================================================
           NORMALIZE PRODUCT
           
           Different APIs can return data using different
           property names. This creates one common format.
        ================================================= */

        function normalizeProduct(
            product,
            index = 0,
            source = "Unknown"
        ) {

            const title =
                product.title ||
                product.name ||
                product.product_title ||
                product.productName ||
                product.product_name ||
                "Unnamed Product";


            const image =
                product.image ||
                product.image_url ||
                product.thumbnail ||
                product.product_image ||
                product.imageUrl ||
                "";


            let price =
                product.price ||
                product.current_price ||
                product.product_price ||
                product.sale_price ||
                product.amount ||
                0;


            if (
                typeof price ===
                "object"
            ) {

                price =
                    price.value ||
                    price.amount ||
                    price.current ||
                    0;

            }


            const rating =
                Number(
                    product.rating ||
                    product.stars ||
                    product.review_rating ||
                    0
                );


            const reviews =
                Number(
                    product.reviews ||
                    product.review_count ||
                    product.ratings_count ||
                    0
                );


            const url =
                product.url ||
                product.product_url ||
                product.link ||
                product.product_link ||
                "";


            const marketplace =
                product.marketplace ||
                product.source ||
                source ||
                "Unknown";


            const category =
                product.category ||
                product.product_category ||
                "general";


            const numericPrice =
                extractNumericPrice(
                    price
                );


            const normalizedProduct = {

                id:
                    product.id ||
                    product.asin ||
                    product.product_id ||
                    (
                        Date.now() +
                        "-" +
                        index +
                        "-" +
                        Math.random()
                            .toString(36)
                            .slice(2, 8)
                    ),


                title:
                    title,


                image:
                    image,


                price:
                    numericPrice,


                originalPrice:
                    price,


                rating:
                    rating,


                reviews:
                    reviews,


                url:
                    url,


                marketplace:
                    marketplace,


                category:
                    String(
                        category
                    ).toLowerCase(),


                raw:
                    product

            };


            normalizedProduct.analysis =
                analyzeProduct(
                    normalizedProduct
                );


            return normalizedProduct;

        }



        /* =================================================
           EXTRACT NUMERIC PRICE
        ================================================= */

        function extractNumericPrice(
            value
        ) {

            if (
                value === null ||
                value === undefined
            ) {

                return 0;

            }


            if (
                typeof value ===
                "number"
            ) {

                return value;

            }


            if (
                typeof value ===
                "object"
            ) {

                return extractNumericPrice(
                    value.value ||
                    value.amount ||
                    value.price ||
                    0
                );

            }


            const cleaned =
                String(value)
                    .replace(
                        /[^0-9.]/g,
                        ""
                    );


            const number =
                Number(cleaned);


            if (
                Number.isNaN(
                    number
                )
            ) {

                return 0;

            }


            return number;

        }



        /* =================================================
           PRODUCT OPPORTUNITY ANALYSIS
           
           This is an estimate only. It does not guarantee
           sales, profit or marketplace performance.
        ================================================= */

        function analyzeProduct(
            product
        ) {

            let score = 50;


            /*
               Rating
            */

            if (
                product.rating >= 4.5
            ) {

                score += 15;

            }

            else if (
                product.rating >= 4
            ) {

                score += 10;

            }

            else if (
                product.rating >= 3.5
            ) {

                score += 5;

            }


            /*
               Reviews
            */

            if (
                product.reviews >= 10000
            ) {

                score += 12;

            }

            else if (
                product.reviews >= 1000
            ) {

                score += 8;

            }

            else if (
                product.reviews >= 100
            ) {

                score += 4;

            }


            /*
               Price opportunity
            */

            if (
                product.price >= 300 &&
                product.price <= 3000
            ) {

                score += 10;

            }

            else if (
                product.price > 0 &&
                product.price <= 10000
            ) {

                score += 5;

            }


            /*
               Clamp score
            */

            score =
                Math.max(
                    1,
                    Math.min(
                        100,
                        Math.round(
                            score
                        )
                    )
                );


            let label =
                "Moderate Opportunity";


            let marketSignal =
                "Needs validation";


            if (
                score >= 85
            ) {

                label =
                    "High Opportunity";


                marketSignal =
                    "Strong market signal";

            }

            else if (
                score >= 70
            ) {

                label =
                    "Good Opportunity";


                marketSignal =
                    "Positive market signal";

            }

            else if (
                score < 55
            ) {

                label =
                    "Low Opportunity";


                marketSignal =
                    "Weak data signal";

            }


            /*
               Estimated margin is only an estimate.
            */

            let estimatedMargin =
                15;


            if (
                score >= 85
            ) {

                estimatedMargin =
                    30;

            }

            else if (
                score >= 70
            ) {

                estimatedMargin =
                    25;

            }

            else if (
                score >= 55
            ) {

                estimatedMargin =
                    20;

            }


            return {

                score:
                    score,


                label:
                    label,


                marketSignal:
                    marketSignal,


                estimatedMargin:
                    estimatedMargin

            };

        }



        /* =================================================
           GET SCORE CLASS
        ================================================= */

        function getScoreClass(
            score
        ) {

            if (
                score >= 85
            ) {

                return "score-excellent";

            }


            if (
                score >= 70
            ) {

                return "score-good";

            }


            if (
                score >= 55
            ) {

                return "score-medium";

            }


            return "score-low";

        }



        /* =================================================
           RENDER LOADING STATE
        ================================================= */

        function renderLoadingState() {

            productResults.innerHTML =
                `

                <div class="research-loading-state">

                    <div class="research-spinner"></div>

                    <h3>
                        AI is researching products...
                    </h3>

                    <p>
                        Checking available product data
                        and analyzing market signals.
                    </p>

                </div>

                `;

        }



        /* =================================================
           RENDER ERROR STATE
        ================================================= */

        function renderErrorState(
            message
        ) {

            productResults.innerHTML =
                `

                <div class="research-empty-state error-state">

                    <div class="empty-state-icon">
                        ⚠️
                    </div>

                    <h3>
                        Research unavailable
                    </h3>

                    <p>
                        ${escapeHTML(message)}
                    </p>

                    <button
                        type="button"
                        class="retry-research-btn"
                        id="retryResearchBtn"
                    >
                        Try Again
                    </button>

                </div>

                `;


            const retryButton =
                document.getElementById(
                    "retryResearchBtn"
                );


            if (
                retryButton
            ) {

                retryButton.addEventListener(
                    "click",
                    () => {

                        startProductResearch();

                    }
                );

            }

        }



        /* =================================================
           RENDER EMPTY STATE
        ================================================= */

        function renderEmptyState(
            message =
                "No products found with the selected filters."
        ) {

            productResults.innerHTML =
                `

                <div class="research-empty-state">

                    <div class="empty-state-icon">
                        🔎
                    </div>

                    <h3>
                        No Products Found
                    </h3>

                    <p>
                        ${escapeHTML(message)}
                    </p>

                </div>

                `;

        }



        /* =================================================
           GET PRODUCT IMAGE HTML
        ================================================= */

        function getProductImageHTML(
            product
        ) {

            if (
                product.image
            ) {

                return `
                    <img
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.title)}"
                        loading="lazy"
                        onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
                    >

                    <div
                        class="product-image-fallback"
                        style="display:none;"
                    >
                        📦
                    </div>
                `;

            }


            return `
                <div
                    class="product-image-fallback"
                >
                    📦
                </div>
            `;

        }



        /* =================================================
           RENDER PRODUCTS
        ================================================= */

        function renderProducts(
            products
        ) {

            if (
                !Array.isArray(
                    products
                ) ||
                products.length === 0
            ) {

                renderEmptyState();

                return;

            }


            productResults.innerHTML =
                products
                    .map(
                        (
                            product
                        ) => {

                            const analysis =
                                product.analysis ||
                                analyzeProduct(
                                    product
                                );


                            const scoreClass =
                                getScoreClass(
                                    analysis.score
                                );


                            const marketplace =
                                escapeHTML(
                                    product.marketplace
                                );


                            return `

                            <article
                                class="product-result-card"
                                data-product-id="${escapeHTML(product.id)}"
                            >


                                <div
                                    class="product-image-area"
                                >

                                    ${getProductImageHTML(product)}


                                    <div
                                        class="opportunity-badge ${scoreClass}"
                                    >

                                        ${analysis.score}/100

                                    </div>


                                </div>



                                <div
                                    class="product-card-content"
                                >


                                    <div
                                        class="product-source-row"
                                    >

                                        <span
                                            class="product-marketplace"
                                        >

                                            ${marketplace}

                                        </span>


                                        <span
                                            class="product-rating"
                                        >

                                            ⭐ ${product.rating || "N/A"}

                                        </span>


                                    </div>



                                    <h3>
                                        ${escapeHTML(product.title)}
                                    </h3>



                                    <div
                                        class="product-price-row"
                                    >

                                        <strong>

                                            ${formatPrice(
                                                product.price
                                            )}

                                        </strong>


                                        <span>

                                            ${formatNumber(
                                                product.reviews
                                            )} reviews

                                        </span>


                                    </div>



                                    <div
                                        class="product-analysis-mini"
                                    >


                                        <div>

                                            <small>
                                                OPPORTUNITY
                                            </small>


                                            <strong>
                                                ${analysis.label}
                                            </strong>

                                        </div>


                                        <div>

                                            <small>
                                                EST. MARGIN
                                            </small>


                                            <strong>
                                                ~${analysis.estimatedMargin}%
                                            </strong>

                                        </div>


                                    </div>



                                    <div
                                        class="product-card-actions"
                                    >


                                        <button
                                            type="button"
                                            class="analyze-product-btn"
                                            data-analyze-product="${escapeHTML(product.id)}"
                                        >

                                            Analyze

                                        </button>


                                        <button
                                            type="button"
                                            class="save-product-mini-btn"
                                            data-save-product="${escapeHTML(product.id)}"
                                            aria-label="Save product"
                                        >

                                            ⭐

                                        </button>


                                    </div>


                                </div>


                            </article>

                            `;

                        }
                    )
                    .join(
                        ""
                    );


            attachProductCardEvents();

        }



        /* =================================================
           ATTACH PRODUCT CARD EVENTS
        ================================================= */

        function attachProductCardEvents() {

            const analyzeButtons =
                document.querySelectorAll(
                    "[data-analyze-product]"
                );


            const saveButtons =
                document.querySelectorAll(
                    "[data-save-product]"
                );


            analyzeButtons.forEach(
                (
                    button
                ) => {

                    button.addEventListener(
                        "click",
                        () => {

                            const productId =
                                button.dataset.analyzeProduct;


                            openProductAnalysis(
                                productId
                            );

                        }
                    );

                }
            );


            saveButtons.forEach(
                (
                    button
                ) => {

                    button.addEventListener(
                        "click",
                        () => {

                            const productId =
                                button.dataset.saveProduct;


                            saveProductById(
                                productId
                            );

                        }
                    );

                }
            );

        }



        /* =================================================
           UPDATE RESULT COUNT
        ================================================= */

        function updateResultCount() {

            if (
                !productResultCount
            ) {

                return;

            }


            const count =
                filteredProducts.length;


            productResultCount.textContent =
                count === 1
                    ? "1 Product"
                    : count + " Products";

        }



        /* =================================================
           FILTER PRODUCTS
        ================================================= */

        function applyFilters() {

            const marketplaceValue =
                marketplaceFilter
                    ? marketplaceFilter.value
                    : "all";


            const categoryValue =
                categoryFilter
                    ? categoryFilter.value
                    : "all";


            const minPrice =
                minPriceFilter &&
                minPriceFilter.value
                    ? Number(
                        minPriceFilter.value
                    )
                    : 0;


            const maxPrice =
                maxPriceFilter &&
                maxPriceFilter.value
                    ? Number(
                        maxPriceFilter.value
                    )
                    : Infinity;


            filteredProducts =
                allProducts.filter(
                    (
                        product
                    ) => {

                        const marketplace =
                            String(
                                product.marketplace
                            ).toLowerCase();


                        const category =
                            String(
                                product.category
                            ).toLowerCase();


                        const marketplaceMatch =
                            marketplaceValue ===
                            "all"
                                ||
                            marketplace.includes(
                                marketplaceValue.toLowerCase()
                            );


                        const categoryMatch =
                            categoryValue ===
                            "all"
                                ||
                            category.includes(
                                categoryValue.toLowerCase()
                            );


                        const priceMatch =
                            product.price >=
                            minPrice
                            &&
                            product.price <=
                            maxPrice;


                        return (
                            marketplaceMatch
                            &&
                            categoryMatch
                            &&
                            priceMatch
                        );

                    }
                );


            sortProductResults();


            updateResultCount();


            renderProducts(
                filteredProducts
            );

        }



        /* =================================================
           SORT PRODUCTS
        ================================================= */

        function sortProductResults() {

            if (
                !sortProducts
            ) {

                return;

            }


            const sortType =
                sortProducts.value;


            filteredProducts.sort(
                (
                    a,
                    b
                ) => {

                    const aScore =
                        a.analysis?.score ||
                        0;


                    const bScore =
                        b.analysis?.score ||
                        0;


                    if (
                        sortType ===
                        "price-low"
                    ) {

                        return (
                            a.price -
                            b.price
                        );

                    }


                    if (
                        sortType ===
                        "price-high"
                    ) {

                        return (
                            b.price -
                            a.price
                        );

                    }


                    if (
                        sortType ===
                        "profit"
                    ) {

                        return (
                            (
                                b.analysis?.estimatedMargin ||
                                0
                            )
                            -
                            (
                                a.analysis?.estimatedMargin ||
                                0
                            )
                        );

                    }


                    return (
                        bScore -
                        aScore
                    );

                }
            );

        }



        /* =================================================
           CLEAR FILTERS
        ================================================= */

        function clearFilters() {

            if (
                marketplaceFilter
            ) {

                marketplaceFilter.value =
                    "all";

            }


            if (
                categoryFilter
            ) {

                categoryFilter.value =
                    "all";

            }


            if (
                minPriceFilter
            ) {

                minPriceFilter.value =
                    "";

            }


            if (
                maxPriceFilter
            ) {

                maxPriceFilter.value =
                    "";

            }


            if (
                sortProducts
            ) {

                sortProducts.value =
                    "score";

            }


            applyFilters();


            showToast(
                "Filters cleared.",
                "🧹"
            );

        }



        /* =================================================
           OPEN PRODUCT ANALYSIS
        ================================================= */

        function openProductAnalysis(
            productId
        ) {

            const product =
                allProducts.find(
                    (
                        item
                    ) =>
                        String(
                            item.id
                        )
                        ===
                        String(
                            productId
                        )
                );


            if (
                !product
            ) {

                showToast(
                    "Product information not found.",
                    "⚠️"
                );


                return;

            }


            selectedProduct =
                product;


            const analysis =
                product.analysis ||
                analyzeProduct(
                    product
                );


            if (
                analysisProductName
            ) {

                analysisProductName.textContent =
                    product.title;

            }


            if (
                analysisScore
            ) {

                analysisScore.textContent =
                    analysis.score +
                    "/100";

            }


            if (
                analysisScoreLabel
            ) {

                analysisScoreLabel.textContent =
                    analysis.label;

            }


            if (
                analysisMarketSignal
            ) {

                analysisMarketSignal.textContent =
                    analysis.marketSignal;

            }


            if (
                analysisPriceRange
            ) {

                analysisPriceRange.textContent =
                    formatPrice(
                        product.price
                    );

            }


            if (
                analysisMargin
            ) {

                analysisMargin.textContent =
                    "~" +
                    analysis.estimatedMargin +
                    "%";

            }


            if (
                analysisAiNote
            ) {

                analysisAiNote.textContent =
                    createAnalysisNote(
                        product,
                        analysis
                    );

            }


            if (
                productAnalysisPanel
            ) {

                productAnalysisPanel.classList.add(
                    "show"
                );


                setTimeout(
                    () => {

                        productAnalysisPanel.scrollIntoView(
                            {
                                behavior:
                                    "smooth",
                                block:
                                    "start"
                            }
                        );

                    },
                    100
                );

            }

        }



        /* =================================================
           CREATE AI ANALYSIS NOTE
        ================================================= */

        function createAnalysisNote(
            product,
            analysis
        ) {

            let note =
                "This product has an opportunity score of " +
                analysis.score +
                "/100 based on the available product data.";


            if (
                product.rating >= 4
            ) {

                note +=
                    " Its available rating signal is positive.";

            }


            if (
                product.reviews >= 1000
            ) {

                note +=
                    " The review volume indicates existing customer activity.";

            }


            note +=
                " Estimated margin is only a planning estimate and should be verified using supplier cost, marketplace fees, shipping, taxes, returns and advertising costs before making a listing decision.";


            return note;

        }



        /* =================================================
           CLOSE ANALYSIS
        ================================================= */

        function closeProductAnalysis() {

            if (
                productAnalysisPanel
            ) {

                productAnalysisPanel.classList.remove(
                    "show"
                );

            }


            selectedProduct =
                null;

        }



        /* =================================================
           SAVE PRODUCT
        ================================================= */

        function saveProductById(
            productId
        ) {

            const product =
                allProducts.find(
                    (
                        item
                    ) =>
                        String(
                            item.id
                        )
                        ===
                        String(
                            productId
                        )
                );


            if (
                !product
            ) {

                showToast(
                    "Product not found.",
                    "⚠️"
                );


                return;

            }


            saveProduct(
                product
            );

        }



        /* =================================================
           SAVE PRODUCT TO LOCAL STORAGE
        ================================================= */

        function saveProduct(
            product
        ) {

            let savedProducts =
                [];


            try {

                savedProducts =
                    JSON.parse(
                        localStorage.getItem(
                            SAVED_PRODUCTS_KEY
                        )
                    ) || [];

            }

            catch (
                error
            ) {

                savedProducts =
                    [];

            }


            const alreadySaved =
                savedProducts.some(
                    (
                        item
                    ) =>
                        String(
                            item.id
                        )
                        ===
                        String(
                            product.id
                        )
                );


            if (
                alreadySaved
            ) {

                showToast(
                    "This product is already saved.",
                    "⭐"
                );


                return;

            }


            savedProducts.push(
                {
                    ...product,

                    savedAt:
                        new Date()
                            .toISOString()
                }
            );


            localStorage.setItem(
                SAVED_PRODUCTS_KEY,
                JSON.stringify(
                    savedProducts
                )
            );


            showToast(
                "Product saved successfully.",
                "⭐"
            );

        }



        /* =================================================
           RESEARCH PRODUCT
           
           This function supports multiple possible
           structures from product-research.js.
        ================================================= */

        async function getResearchData(
            query
        ) {

            /*
               Option 1:
               window.SMProductResearch.searchProducts()
            */

            if (
                window.SMProductResearch &&
                typeof window.SMProductResearch
                    .searchProducts ===
                    "function"
            ) {

                return await
                    window.SMProductResearch
                        .searchProducts(
                            query
                        );

            }


            /*
               Option 2:
               window.productResearch.search()
            */

            if (
                window.productResearch &&
                typeof window.productResearch
                    .search ===
                    "function"
            ) {

                return await
                    window.productResearch
                        .search(
                            query
                        );

            }


            /*
               Option 3:
               window.searchProducts()
            */

            if (
                typeof window.searchProducts ===
                "function"
            ) {

                return await
                    window.searchProducts(
                        query
                    );

            }


            /*
               Option 4:
               window.SM_API.searchProducts()
            */

            if (
                window.SM_API &&
                typeof window.SM_API
                    .searchProducts ===
                    "function"
            ) {

                return await
                    window.SM_API.searchProducts(
                        query
                    );

            }


            throw new Error(
                "Product research engine is not available. Check js/product-research.js."
            );

        }



        /* =================================================
           EXTRACT PRODUCTS FROM API RESPONSE
        ================================================= */

        function extractProductsFromResponse(
            response
        ) {

            if (
                Array.isArray(
                    response
                )
            ) {

                return response;

            }


            if (
                !response
            ) {

                return [];

            }


            if (
                Array.isArray(
                    response.products
                )
            ) {

                return response.products;

            }


            if (
                Array.isArray(
                    response.data
                )
            ) {

                return response.data;

            }


            if (
                Array.isArray(
                    response.results
                )
            ) {

                return response.results;

            }


            if (
                Array.isArray(
                    response.items
                )
            ) {

                return response.items;

            }


            return [];

        }



        /* =================================================
           EXTRACT SOURCE COUNT
        ================================================= */

        function getSourceCount(
            response
        ) {

            if (
                response &&
                typeof response ===
                "object"
            ) {

                if (
                    Array.isArray(
                        response.sources
                    )
                ) {

                    return response.sources.length;

                }


                if (
                    typeof response.sourceCount ===
                    "number"
                ) {

                    return response.sourceCount;

                }


                if (
                    typeof response.sourcesUsed ===
                    "number"
                ) {

                    return response.sourcesUsed;

                }

            }


            const uniqueSources =
                new Set(
                    allProducts.map(
                        (
                            product
                        ) =>
                            product.marketplace
                    )
                );


            return uniqueSources.size;

        }



        /* =================================================
           START PRODUCT RESEARCH
        ================================================= */

        async function startProductResearch(
            customQuery = null
        ) {

            if (
                isSearching
            ) {

                return;

            }


            const query =
                (
                    customQuery ||
                    productSearchInput.value
                )
                    .trim();


            if (
                !query
            ) {

                showToast(
                    "Please enter a product name or keyword.",
                    "🔍"
                );


                productSearchInput.focus();


                return;

            }


            isSearching =
                true;


            productSearchBtn.disabled =
                true;


            productSearchBtn.classList.add(
                "loading"
            );


            productSearchBtn.innerHTML =
                `
                    <span>
                        Researching...
                    </span>
                    <span>
                        ⏳
                    </span>
                `;


            setResearchStatus(
                "AI is researching: " +
                query,
                0
            );


            if (
                aiResearchStatus
            ) {

                aiResearchStatus.classList.add(
                    "researching"
                );

            }


            renderLoadingState();


            try {

                const response =
                    await getResearchData(
                        query
                    );


                const rawProducts =
                    extractProductsFromResponse(
                        response
                    );


                allProducts =
                    rawProducts.map(
                        (
                            product,
                            index
                        ) =>
                            normalizeProduct(
                                product,
                                index,
                                response?.source ||
                                "Marketplace"
                            )
                    );


                localStorage.setItem(
                    LAST_SEARCH_KEY,
                    query
                );


                const sourceCount =
                    getSourceCount(
                        response
                    );


                setResearchStatus(
                    allProducts.length +
                    " products analyzed",
                    sourceCount
                );


                applyFilters();


                if (
                    allProducts.length === 0
                ) {

                    setResearchStatus(
                        "No products found for this search",
                        sourceCount
                    );

                }

                else {

                    showToast(
                        allProducts.length +
                        " products analyzed successfully.",
                        "🤖"
                    );

                }

            }

            catch (
                error
            ) {

                console.error(
                    "Product research error:",
                    error
                );


                allProducts =
                    [];


                filteredProducts =
                    [];


                updateResultCount();


                setResearchStatus(
                    "Research could not be completed",
                    0
                );


                renderErrorState(
                    error.message ||
                    "Unable to retrieve product data."
                );


                showToast(
                    "Research failed. Check API configuration.",
                    "⚠️"
                );

            }

            finally {

                isSearching =
                    false;


                productSearchBtn.disabled =
                    false;


                productSearchBtn.classList.remove(
                    "loading"
                );


                productSearchBtn.innerHTML =
                    `
                        <span>
                            Search Products
                        </span>

                        <span>
                            →
                        </span>
                    `;


                if (
                    aiResearchStatus
                ) {

                    aiResearchStatus.classList.remove(
                        "researching"
                    );

                }

            }

        }



        /* =================================================
           SEARCH BUTTON EVENT
        ================================================= */

        productSearchBtn.addEventListener(
            "click",
            () => {

                startProductResearch();

            }
        );



        /* =================================================
           ENTER KEY SEARCH
        ================================================= */

        productSearchInput.addEventListener(
            "keydown",
            (
                event
            ) => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();


                    startProductResearch();

                }

            }
        );



        /* =================================================
           QUICK SEARCH EVENTS
        ================================================= */

        quickSearchButtons.forEach(
            (
                button
            ) => {

                button.addEventListener(
                    "click",
                    () => {

                        const query =
                            button.dataset.search;


                        if (
                            !query
                        ) {

                            return;

                        }


                        productSearchInput.value =
                            query;


                        startProductResearch(
                            query
                        );

                    }
                );

            }
        );



        /* =================================================
           FILTER EVENTS
        ================================================= */

        if (
            marketplaceFilter
        ) {

            marketplaceFilter.addEventListener(
                "change",
                applyFilters
            );

        }


        if (
            categoryFilter
        ) {

            categoryFilter.addEventListener(
                "change",
                applyFilters
            );

        }


        if (
            minPriceFilter
        ) {

            minPriceFilter.addEventListener(
                "input",
                () => {

                    if (
                        allProducts.length
                    ) {

                        applyFilters();

                    }

                }
            );

        }


        if (
            maxPriceFilter
        ) {

            maxPriceFilter.addEventListener(
                "input",
                () => {

                    if (
                        allProducts.length
                    ) {

                        applyFilters();

                    }

                }
            );

        }



        /* =================================================
           SORT EVENT
        ================================================= */

        if (
            sortProducts
        ) {

            sortProducts.addEventListener(
                "change",
                () => {

                    if (
                        allProducts.length
                    ) {

                        applyFilters();

                    }

                }
            );

        }



        /* =================================================
           CLEAR FILTERS EVENT
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
           CLOSE ANALYSIS EVENT
        ================================================= */

        if (
            closeAnalysisBtn
        ) {

            closeAnalysisBtn.addEventListener(
                "click",
                closeProductAnalysis
            );

        }



        /* =================================================
           SAVE SELECTED PRODUCT
        ================================================= */

        if (
            saveProductBtn
        ) {

            saveProductBtn.addEventListener(
                "click",
                () => {

                    if (
                        !selectedProduct
                    ) {

                        showToast(
                            "Select a product first.",
                            "⚠️"
                        );


                        return;

                    }


                    saveProduct(
                        selectedProduct
                    );

                }
            );

        }



        /* =================================================
           RESEARCH AGAIN
        ================================================= */

        if (
            researchAgainBtn
        ) {

            researchAgainBtn.addEventListener(
                "click",
                () => {

                    if (
                        selectedProduct
                    ) {

                        productSearchInput.value =
                            selectedProduct.title;


                        closeProductAnalysis();


                        startProductResearch(
                            selectedProduct.title
                        );

                    }

                    else {

                        startProductResearch();

                    }

                }
            );

        }



        /* =================================================
           MOBILE SIDEBAR
        ================================================= */

        if (
            mobileMenuBtn &&
            sidebar
        ) {

            mobileMenuBtn.addEventListener(
                "click",
                () => {

                    sidebar.classList.toggle(
                        "show"
                    );

                }
            );


            document.addEventListener(
                "click",
                (
                    event
                ) => {

                    const clickedInsideSidebar =
                        sidebar.contains(
                            event.target
                        );


                    const clickedMenuButton =
                        mobileMenuBtn.contains(
                            event.target
                        );


                    if (
                        !clickedInsideSidebar &&
                        !clickedMenuButton
                    ) {

                        sidebar.classList.remove(
                            "show"
                        );

                    }

                }
            );

        }



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

                    closeProductAnalysis();


                    if (
                        sidebar
                    ) {

                        sidebar.classList.remove(
                            "show"
                        );

                    }

                }

            }
        );



        /* =================================================
           RESTORE LAST SEARCH
        ================================================= */

        function restoreLastSearch() {

            const lastSearch =
                localStorage.getItem(
                    LAST_SEARCH_KEY
                );


            if (
                lastSearch
            ) {

                productSearchInput.value =
                    lastSearch;

            }

        }



        /* =================================================
           INITIAL LOAD
        ================================================= */

        restoreLastSearch();


        setResearchStatus(
            "Ready to analyze products",
            0
        );


        updateResultCount();


        console.log(
            "%cSMART MONEY AI COMMERCE - PRODUCTS READY",
            "font-size:16px;font-weight:bold;color:#60a5fa;"
        );


    }
);