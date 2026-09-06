/* =========================================================
   AI STORE MANAGER
   PRODUCT RESEARCH SYSTEM
========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    () => {


        const productSearch =
            document.getElementById(
                "productSearch"
            );


        const researchBtn =
            document.getElementById(
                "researchBtn"
            );


        const productResults =
            document.getElementById(
                "productResults"
            );



        function researchProduct() {


            const query =
                productSearch.value.trim();



            if (!query) {

                alert(
                    "Please enter a product category first."
                );

                return;

            }



            productResults.innerHTML = `

                <div class="empty-icon">
                    🤖
                </div>

                <h3>
                    Research Request Created
                </h3>

                <p>
                    AI research query:
                    <strong>${escapeHtml(query)}</strong>
                </p>

                <p>
                    The next development step will connect
                    this research system with approved
                    marketplace data sources and APIs.
                </p>

            `;



            saveResearchQuery(
                query
            );


        }



        function saveResearchQuery(
            query
        ) {


            const savedProducts =
                JSON.parse(
                    localStorage.getItem(
                        "ai_store_products"
                    )
                ) || [];



            const newResearch = {

                id:
                    Date.now(),

                query:
                    query,

                createdAt:
                    new Date().toISOString()

            };



            savedProducts.push(
                newResearch
            );



            localStorage.setItem(
                "ai_store_products",
                JSON.stringify(
                    savedProducts
                )
            );


        }



        function escapeHtml(
            text
        ) {


            const div =
                document.createElement(
                    "div"
                );


            div.textContent =
                text;


            return (
                div.innerHTML
            );


        }



        researchBtn.addEventListener(
            "click",
            researchProduct
        );



        productSearch.addEventListener(
            "keydown",
            (event) => {


                if (
                    event.key === "Enter"
                ) {

                    researchProduct();

                }


            }
        );


    }
);