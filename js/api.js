/* =========================================================
   SMART MONEY AI COMMERCE
   API SERVICE LAYER
   FILE: js/api.js
   ========================================================= */


/* =========================================================
   GLOBAL API SERVICE
========================================================= */

window.SM_API = (function () {


    /* =====================================================
       CONFIGURATION
    ===================================================== */

    const config =
        window.SM_CONFIG || {};


    const API_CONFIG = {


        /*
           -------------------------------------------------
           BACKEND BASE URL

           Future examples:

           Supabase Edge Functions:
           https://YOUR_PROJECT.supabase.co/functions/v1

           Custom Backend:
           https://your-domain.com/api
           -------------------------------------------------
        */

        baseUrl:
            config.apiBaseUrl ||
            "",


        timeout:
            20000,


        retryAttempts:
            2


    };



    /* =====================================================
       API ENDPOINTS

       These are INTERNAL backend endpoints.

       Your backend will securely communicate with:

       - Amazon APIs
       - Shopify APIs
       - Alibaba APIs
       - Flipkart APIs
       - Meesho APIs

       RapidAPI keys must stay on the server.
    ===================================================== */

    const ENDPOINTS = {


        health:
            "/health",


        /*
           PRODUCT RESEARCH
        */

        productSearch:
            "/products/search",


        productDetails:
            "/products/details",


        productAnalyze:
            "/products/analyze",


        trendingProducts:
            "/products/trending",


        bestSellers:
            "/products/best-sellers",


        newReleases:
            "/products/new-releases",


        /*
           AMAZON
        */

        amazonSearch:
            "/amazon/search",


        amazonDetails:
            "/amazon/details",


        amazonBestSellers:
            "/amazon/best-sellers",


        amazonNewReleases:
            "/amazon/new-releases",


        /*
           SHOPIFY
        */

        shopifyProducts:
            "/shopify/products",


        /*
           ALIBABA
        */

        alibabaDetails:
            "/alibaba/details",


        /*
           FLIPKART
        */

        flipkartPriceHistory:
            "/flipkart/price-history",


        /*
           MEESHO
        */

        meeshoPriceHistory:
            "/meesho/price-history",


        /*
           DASHBOARD
        */

        dashboardStats:
            "/dashboard/stats",


        dashboardActivity:
            "/dashboard/activity",


        /*
           STORES

           These endpoints are for stores/accounts
           you own or are authorized to manage.
        */

        stores:
            "/stores",


        storeDetails:
            "/stores/details",


        storeProducts:
            "/stores/products",


        /*
           SALES & EARNINGS
        */

        sales:
            "/sales",


        earnings:
            "/earnings"


    };



    /* =====================================================
       API ERROR CLASS
    ===================================================== */

    class APIError extends Error {


        constructor(
            message,
            status = 0,
            data = null
        ) {

            super(
                message
            );


            this.name =
                "APIError";


            this.status =
                status;


            this.data =
                data;

        }


    }



    /* =====================================================
       BUILD URL
    ===================================================== */

    function buildUrl(
        endpoint,
        params = null
    ) {

        const base =
            API_CONFIG.baseUrl
                .replace(
                    /\/$/,
                    ""
                );


        const path =
            endpoint.startsWith(
                "/"
            )
                ? endpoint
                : "/" + endpoint;


        let url =
            base + path;


        if (
            params &&
            typeof params ===
            "object"
        ) {

            const searchParams =
                new URLSearchParams();


            Object.keys(
                params
            ).forEach(
                (
                    key
                ) => {

                    const value =
                        params[key];


                    if (
                        value !== undefined &&
                        value !== null &&
                        value !== ""
                    ) {

                        searchParams.append(
                            key,
                            value
                        );

                    }

                }
            );


            const query =
                searchParams.toString();


            if (
                query
            ) {

                url +=
                    "?" +
                    query;

            }

        }


        return url;

    }



    /* =====================================================
       CREATE TIMEOUT SIGNAL
    ===================================================== */

    function createTimeoutController() {

        const controller =
            new AbortController();


        const timeout =
            setTimeout(
                () => {

                    controller.abort();

                },
                API_CONFIG.timeout
            );


        return {

            controller:
                controller,


            clear:
                function () {

                    clearTimeout(
                        timeout
                    );

                }

        };

    }



    /* =====================================================
       GET AUTH TOKEN

       Future:
       Supabase Auth token can be automatically attached here.
    ===================================================== */

    async function getAuthToken() {

        /*
           Currently returns null.

           Later Supabase authentication
           will provide the active access token.
        */

        return null;

    }



    /* =====================================================
       REQUEST FUNCTION
    ===================================================== */

    async function request(
        endpoint,
        options = {}
    ) {

        /*
           Prevent accidental calls when backend
           is not configured.
        */

        if (
            !API_CONFIG.baseUrl
        ) {

            throw new APIError(
                "API backend is not configured. Set apiBaseUrl in js/config.js.",
                0
            );

        }


        const method =
            options.method ||
            "GET";


        const params =
            options.params ||
            null;


        const body =
            options.body ||
            null;


        const url =
            buildUrl(
                endpoint,
                params
            );


        const timeoutData =
            createTimeoutController();


        try {

            const token =
                await getAuthToken();


            const headers = {


                "Content-Type":
                    "application/json",


                "Accept":
                    "application/json"

            };


            if (
                token
            ) {

                headers[
                    "Authorization"
                ] =
                    "Bearer " +
                    token;

            }


            const response =
                await fetch(
                    url,
                    {

                        method:
                            method,


                        headers:
                            headers,


                        body:

                            method !== "GET" &&
                            method !== "HEAD" &&
                            body

                                ? JSON.stringify(
                                    body
                                )

                                : null,


                        signal:
                            timeoutData
                                .controller
                                .signal

                    }
                );


            const contentType =
                response.headers.get(
                    "content-type"
                ) || "";


            let responseData =
                null;


            if (
                contentType.includes(
                    "application/json"
                )
            ) {

                responseData =
                    await response.json();

            }
            else {

                responseData =
                    await response.text();

            }


            if (
                !response.ok
            ) {

                const errorMessage =

                    responseData?.message ||

                    responseData?.error ||

                    "API request failed";


                throw new APIError(
                    errorMessage,
                    response.status,
                    responseData
                );

            }


            return responseData;

        }
        catch (
            error
        ) {

            if (
                error.name ===
                "AbortError"
            ) {

                throw new APIError(
                    "Request timed out. Please try again.",
                    408
                );

            }


            if (
                error instanceof
                APIError
            ) {

                throw error;

            }


            throw new APIError(
                error.message ||
                "Network request failed.",
                0
            );

        }
        finally {

            timeoutData.clear();

        }

    }



    /* =====================================================
       RETRY REQUEST
    ===================================================== */

    async function requestWithRetry(
        endpoint,
        options = {}
    ) {

        let lastError =
            null;


        for (
            let attempt = 0;
            attempt <= API_CONFIG.retryAttempts;
            attempt++
        ) {

            try {

                return await request(
                    endpoint,
                    options
                );

            }
            catch (
                error
            ) {

                lastError =
                    error;


                /*
                   Don't retry normal client errors
                */

                if (
                    error.status >= 400 &&
                    error.status < 500 &&
                    error.status !== 408
                ) {

                    break;

                }


                if (
                    attempt <
                    API_CONFIG.retryAttempts
                ) {

                    await delay(
                        700 *
                        (
                            attempt + 1
                        )
                    );

                }

            }

        }


        throw lastError;

    }



    /* =====================================================
       DELAY
    ===================================================== */

    function delay(
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



    /* =====================================================
       API HEALTH CHECK
    ===================================================== */

    async function healthCheck() {

        return await requestWithRetry(
            ENDPOINTS.health
        );

    }



    /* =====================================================
       GENERAL PRODUCT SEARCH
    ===================================================== */

    async function searchProducts(
        query,
        options = {}
    ) {

        if (
            !query ||
            !query.trim()
        ) {

            throw new APIError(
                "Product search query is required."
            );

        }


        return await requestWithRetry(
            ENDPOINTS.productSearch,
            {

                params: {

                    query:
                        query.trim(),


                    source:
                        options.source ||
                        "all",


                    country:
                        options.country ||
                        "IN",


                    limit:
                        options.limit ||
                        20

                }

            }
        );

    }



    /* =====================================================
       PRODUCT DETAILS
    ===================================================== */

    async function getProductDetails(
        productUrl,
        source = "auto"
    ) {

        if (
            !productUrl
        ) {

            throw new APIError(
                "Product URL is required."
            );

        }


        return await requestWithRetry(
            ENDPOINTS.productDetails,
            {

                params: {

                    url:
                        productUrl,


                    source:
                        source

                }

            }
        );

    }



    /* =====================================================
       AI PRODUCT ANALYSIS
    ===================================================== */

    async function analyzeProduct(
        product
    ) {

        if (
            !product
        ) {

            throw new APIError(
                "Product data is required."
            );

        }


        return await requestWithRetry(
            ENDPOINTS.productAnalyze,
            {

                method:
                    "POST",


                body:
                    {

                        product:
                            product

                    }

            }
        );

    }



    /* =====================================================
       TRENDING PRODUCTS
    ===================================================== */

    async function getTrendingProducts(
        options = {}
    ) {

        return await requestWithRetry(
            ENDPOINTS.trendingProducts,
            {

                params: {

                    source:
                        options.source ||
                        "all",


                    country:
                        options.country ||
                        "IN",


                    category:
                        options.category ||
                        "",


                    limit:
                        options.limit ||
                        20

                }

            }
        );

    }



    /* =====================================================
       BEST SELLERS
    ===================================================== */

    async function getBestSellers(
        options = {}
    ) {

        return await requestWithRetry(
            ENDPOINTS.bestSellers,
            {

                params:
                    options

            }
        );

    }



    /* =====================================================
       NEW RELEASES
    ===================================================== */

    async function getNewReleases(
        options = {}
    ) {

        return await requestWithRetry(
            ENDPOINTS.newReleases,
            {

                params:
                    options

            }
        );

    }



    /* =====================================================
       AMAZON SEARCH
    ===================================================== */

    async function searchAmazon(
        query,
        options = {}
    ) {

        return await requestWithRetry(
            ENDPOINTS.amazonSearch,
            {

                params: {

                    query:
                        query,


                    country:
                        options.country ||
                        "IN",


                    page:
                        options.page ||
                        1

                }

            }
        );

    }



    /* =====================================================
       AMAZON PRODUCT DETAILS
    ===================================================== */

    async function getAmazonDetails(
        productUrl
    ) {

        return await requestWithRetry(
            ENDPOINTS.amazonDetails,
            {

                params: {

                    url:
                        productUrl

                }

            }
        );

    }



    /* =====================================================
       AMAZON BEST SELLERS
    ===================================================== */

    async function getAmazonBestSellers(
        options = {}
    ) {

        return await requestWithRetry(
            ENDPOINTS.amazonBestSellers,
            {

                params:
                    options

            }
        );

    }



    /* =====================================================
       AMAZON NEW RELEASES
    ===================================================== */

    async function getAmazonNewReleases(
        options = {}
    ) {

        return await requestWithRetry(
            ENDPOINTS.amazonNewReleases,
            {

                params:
                    options

            }
        );

    }



    /* =====================================================
       SHOPIFY PRODUCTS
    ===================================================== */

    async function getShopifyProducts(
        storeUrl,
        options = {}
    ) {

        return await requestWithRetry(
            ENDPOINTS.shopifyProducts,
            {

                params: {

                    storeUrl:
                        storeUrl,


                    limit:
                        options.limit ||
                        50

                }

            }
        );

    }



    /* =====================================================
       ALIBABA PRODUCT DETAILS
    ===================================================== */

    async function getAlibabaDetails(
        productUrl
    ) {

        return await requestWithRetry(
            ENDPOINTS.alibabaDetails,
            {

                params: {

                    url:
                        productUrl

                }

            }
        );

    }



    /* =====================================================
       FLIPKART PRICE HISTORY
    ===================================================== */

    async function getFlipkartPriceHistory(
        productUrl
    ) {

        return await requestWithRetry(
            ENDPOINTS.flipkartPriceHistory,
            {

                params: {

                    url:
                        productUrl

                }

            }
        );

    }



    /* =====================================================
       MEESHO PRICE HISTORY
    ===================================================== */

    async function getMeeshoPriceHistory(
        productUrl
    ) {

        return await requestWithRetry(
            ENDPOINTS.meeshoPriceHistory,
            {

                params: {

                    url:
                        productUrl

                }

            }
        );

    }



    /* =====================================================
       DASHBOARD STATISTICS
    ===================================================== */

    async function getDashboardStats() {

        return await requestWithRetry(
            ENDPOINTS.dashboardStats
        );

    }



    /* =====================================================
       DASHBOARD ACTIVITY
    ===================================================== */

    async function getDashboardActivity() {

        return await requestWithRetry(
            ENDPOINTS.dashboardActivity
        );

    }



    /* =====================================================
       STORES
    ===================================================== */

    async function getStores() {

        return await requestWithRetry(
            ENDPOINTS.stores
        );

    }



    /* =====================================================
       GET STORE DETAILS
    ===================================================== */

    async function getStoreDetails(
        storeId
    ) {

        return await requestWithRetry(
            ENDPOINTS.storeDetails,
            {

                params: {

                    storeId:
                        storeId

                }

            }
        );

    }



    /* =====================================================
       GET STORE PRODUCTS
    ===================================================== */

    async function getStoreProducts(
        storeId,
        options = {}
    ) {

        return await requestWithRetry(
            ENDPOINTS.storeProducts,
            {

                params: {

                    storeId:
                        storeId,


                    limit:
                        options.limit ||
                        50

                }

            }
        );

    }



    /* =====================================================
       SALES
    ===================================================== */

    async function getSales(
        options = {}
    ) {

        return await requestWithRetry(
            ENDPOINTS.sales,
            {

                params:
                    options

            }
        );

    }



    /* =====================================================
       EARNINGS
    ===================================================== */

    async function getEarnings(
        options = {}
    ) {

        return await requestWithRetry(
            ENDPOINTS.earnings,
            {

                params:
                    options

            }
        );

    }



    /* =====================================================
       CHECK API CONFIGURATION
    ===================================================== */

    function isConfigured() {

        return Boolean(
            API_CONFIG.baseUrl
        );

    }



    /* =====================================================
       GET API CONFIG
    ===================================================== */

    function getConfiguration() {

        return {

            configured:
                isConfigured(),


            baseUrl:
                API_CONFIG.baseUrl ||
                null,


            timeout:
                API_CONFIG.timeout,


            retryAttempts:
                API_CONFIG.retryAttempts

        };

    }



    /* =====================================================
       PUBLIC API
    ===================================================== */

    return {


        /*
           CORE
        */

        request:
            requestWithRetry,


        healthCheck:
            healthCheck,


        isConfigured:
            isConfigured,


        getConfiguration:
            getConfiguration,


        /*
           PRODUCT RESEARCH
        */

        searchProducts:
            searchProducts,


        getProductDetails:
            getProductDetails,


        analyzeProduct:
            analyzeProduct,


        getTrendingProducts:
            getTrendingProducts,


        getBestSellers:
            getBestSellers,


        getNewReleases:
            getNewReleases,


        /*
           AMAZON
        */

        searchAmazon:
            searchAmazon,


        getAmazonDetails:
            getAmazonDetails,


        getAmazonBestSellers:
            getAmazonBestSellers,


        getAmazonNewReleases:
            getAmazonNewReleases,


        /*
           SHOPIFY
        */

        getShopifyProducts:
            getShopifyProducts,


        /*
           ALIBABA
        */

        getAlibabaDetails:
            getAlibabaDetails,


        /*
           FLIPKART
        */

        getFlipkartPriceHistory:
            getFlipkartPriceHistory,


        /*
           MEESHO
        */

        getMeeshoPriceHistory:
            getMeeshoPriceHistory,


        /*
           DASHBOARD
        */

        getDashboardStats:
            getDashboardStats,


        getDashboardActivity:
            getDashboardActivity,


        /*
           STORES
        */

        getStores:
            getStores,


        getStoreDetails:
            getStoreDetails,


        getStoreProducts:
            getStoreProducts,


        /*
           BUSINESS DATA
        */

        getSales:
            getSales,


        getEarnings:
            getEarnings,


        /*
           ERROR CLASS
        */

        APIError:
            APIError


    };


})();


/* =========================================================
   API READY LOG
========================================================= */

console.log(
    "%cSMART MONEY AI COMMERCE API SERVICE READY",
    "font-size:14px;font-weight:bold;color:#22c55e;"
);