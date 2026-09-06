/* =========================================================
   AI STORE MANAGER
   DASHBOARD
========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    () => {


        const todaySales =
            document.getElementById(
                "todaySales"
            );


        const totalEarnings =
            document.getElementById(
                "totalEarnings"
            );


        const activeProducts =
            document.getElementById(
                "activeProducts"
            );


        const connectedStores =
            document.getElementById(
                "connectedStores"
            );



        /* =================================================
           PRODUCTS
        ================================================= */

        const products =
            JSON.parse(
                localStorage.getItem(
                    "ai_store_products"
                )
            ) || [];



        /* =================================================
           STORE CONNECTIONS
        ================================================= */

        const stores =
            JSON.parse(
                localStorage.getItem(
                    "ai_store_connections"
                )
            ) || [];



        /* =================================================
           EARNINGS
        ================================================= */

        const earnings =
            JSON.parse(
                localStorage.getItem(
                    "ai_store_earnings"
                )
            ) || {

                today:
                    0,

                lifetime:
                    0

            };



        /* =================================================
           UPDATE DASHBOARD
        ================================================= */

        if (todaySales) {

            todaySales.textContent =
                "₹" +
                Number(
                    earnings.today || 0
                ).toLocaleString(
                    "en-IN"
                );

        }



        if (totalEarnings) {

            totalEarnings.textContent =
                "₹" +
                Number(
                    earnings.lifetime || 0
                ).toLocaleString(
                    "en-IN"
                );

        }



        if (activeProducts) {

            activeProducts.textContent =
                products.length;

        }



        if (connectedStores) {

            connectedStores.textContent =
                stores.length;

        }



        console.log(
            "Dashboard loaded successfully"
        );


    }
);