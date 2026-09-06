/* =========================================================
   SMART MONEY AI COMMERCE
   SETTINGS JAVASCRIPT
   ========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           DOM ELEMENTS
        ================================================= */

        const settingsTabs =
            document.querySelectorAll(
                ".settings-tab"
            );


        const settingsPanels =
            document.querySelectorAll(
                ".settings-panel"
            );


        const saveButtons =
            document.querySelectorAll(
                "[data-save-settings]"
            );


        const resetButtons =
            document.querySelectorAll(
                "[data-reset-settings]"
            );


        const apiToggleButtons =
            document.querySelectorAll(
                ".api-toggle-btn"
            );


        const toast =
            document.getElementById(
                "settingsToast"
            );


        const toastMessage =
            document.getElementById(
                "settingsToastMessage"
            );


        const toastIcon =
            document.getElementById(
                "settingsToastIcon"
            );



        /* =================================================
           SETTINGS STORAGE KEY
        ================================================= */

        const STORAGE_PREFIX =
            "sm_ai_commerce_settings_";



        /* =================================================
           TOAST
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
                    2800
                );

        }



        /* =================================================
           TAB SYSTEM
        ================================================= */

        function selectTab(
            tabName
        ) {

            if (!tabName) {

                return;

            }


            settingsTabs.forEach(
                (tab) => {

                    tab.classList.remove(
                        "active"
                    );


                    if (
                        tab.dataset.settingsTab ===
                        tabName
                    ) {

                        tab.classList.add(
                            "active"
                        );

                    }

                }
            );


            settingsPanels.forEach(
                (panel) => {

                    panel.classList.remove(
                        "active"
                    );


                    if (
                        panel.dataset.settingsPanel ===
                        tabName
                    ) {

                        panel.classList.add(
                            "active"
                        );

                    }

                }
            );


            localStorage.setItem(
                "sm_ai_commerce_active_settings_tab",
                tabName
            );

        }



        settingsTabs.forEach(
            (tab) => {

                tab.addEventListener(
                    "click",
                    () => {

                        selectTab(
                            tab.dataset.settingsTab
                        );

                    }
                );

            }
        );



        /* =================================================
           LOAD SAVED FORM VALUES
        ================================================= */

        function loadSavedSettings() {

            const fields =
                document.querySelectorAll(
                    "[data-setting-key]"
                );


            fields.forEach(
                (field) => {

                    const key =
                        field.dataset.settingKey;


                    if (!key) {

                        return;

                    }


                    const savedValue =
                        localStorage.getItem(
                            STORAGE_PREFIX +
                            key
                        );


                    if (
                        savedValue === null
                    ) {

                        return;

                    }


                    if (
                        field.type ===
                        "checkbox"
                    ) {

                        field.checked =
                            savedValue ===
                            "true";

                    }

                    else {

                        field.value =
                            savedValue;

                    }

                }
            );

        }



        /* =================================================
           SAVE SETTINGS SECTION
        ================================================= */

        function saveSettings(
            section
        ) {

            const fields =
                document.querySelectorAll(
                    `[data-setting-section="${section}"]`
                );


            if (
                fields.length === 0
            ) {

                showToast(
                    "No settings found to save.",
                    "⚠️"
                );

                return;

            }


            fields.forEach(
                (field) => {

                    const key =
                        field.dataset.settingKey;


                    if (!key) {

                        return;

                    }


                    let value;


                    if (
                        field.type ===
                        "checkbox"
                    ) {

                        value =
                            field.checked;

                    }

                    else {

                        value =
                            field.value.trim();

                    }


                    localStorage.setItem(
                        STORAGE_PREFIX +
                        key,
                        value
                    );

                }
            );


            showToast(
                "Settings saved successfully.",
                "💾"
            );


            updateConfigPreview();

        }



        /* =================================================
           RESET SETTINGS SECTION
        ================================================= */

        function resetSettings(
            section
        ) {

            const fields =
                document.querySelectorAll(
                    `[data-setting-section="${section}"]`
                );


            if (
                fields.length === 0
            ) {

                return;

            }


            const confirmed =
                window.confirm(
                    "Reset all settings in this section?"
                );


            if (!confirmed) {

                return;

            }


            fields.forEach(
                (field) => {

                    const key =
                        field.dataset.settingKey;


                    if (
                        key
                    ) {

                        localStorage.removeItem(
                            STORAGE_PREFIX +
                            key
                        );

                    }


                    if (
                        field.type ===
                        "checkbox"
                    ) {

                        field.checked =
                            field.defaultChecked;

                    }

                    else {

                        field.value =
                            field.defaultValue;

                    }

                }
            );


            showToast(
                "Settings reset successfully.",
                "↻"
            );


            updateConfigPreview();

        }



        /* =================================================
           SAVE BUTTON EVENTS
        ================================================= */

        saveButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const section =
                            button.dataset.saveSettings;


                        saveSettings(
                            section
                        );

                    }
                );

            }
        );



        /* =================================================
           RESET BUTTON EVENTS
        ================================================= */

        resetButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const section =
                            button.dataset.resetSettings;


                        resetSettings(
                            section
                        );

                    }
                );

            }
        );



        /* =================================================
           API KEY SHOW / HIDE
        ================================================= */

        apiToggleButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const targetId =
                            button.dataset.target;


                        if (
                            !targetId
                        ) {

                            return;

                        }


                        const input =
                            document.getElementById(
                                targetId
                            );


                        if (
                            !input
                        ) {

                            return;

                        }


                        if (
                            input.type ===
                            "password"
                        ) {

                            input.type =
                                "text";


                            button.textContent =
                                "HIDE";

                        }

                        else {

                            input.type =
                                "password";


                            button.textContent =
                                "SHOW";

                        }

                    }
                );

            }
        );



        /* =================================================
           API STATUS CHECK
        ================================================= */

        function updateApiStatus() {

            const apiFields =
                document.querySelectorAll(
                    "[data-api-status]"
                );


            apiFields.forEach(
                (field) => {

                    const inputId =
                        field.dataset.apiStatus;


                    const input =
                        document.getElementById(
                            inputId
                        );


                    if (
                        !input
                    ) {

                        return;

                    }


                    const hasValue =
                        input.value.trim().length > 0;


                    const dot =
                        field.querySelector(
                            ".api-status-dot"
                        );


                    const text =
                        field.querySelector(
                            ".api-status-text"
                        );


                    if (
                        hasValue
                    ) {

                        if (dot) {

                            dot.classList.remove(
                                "disconnected"
                            );


                            dot.classList.add(
                                "connected"
                            );

                        }


                        if (text) {

                            text.textContent =
                                "API key configured locally.";

                        }

                    }

                    else {

                        if (dot) {

                            dot.classList.remove(
                                "connected"
                            );


                            dot.classList.add(
                                "disconnected"
                            );

                        }


                        if (text) {

                            text.textContent =
                                "API key not configured.";

                        }

                    }

                }
            );

        }



        /* =================================================
           CONFIG PREVIEW
        ================================================= */

        function updateConfigPreview() {

            if (
                !window.SM_CONFIG
            ) {

                return;

            }


            const supabaseUrl =
                localStorage.getItem(
                    STORAGE_PREFIX +
                    "supabase_url"
                );


            const supabaseAnonKey =
                localStorage.getItem(
                    STORAGE_PREFIX +
                    "supabase_anon_key"
                );


            if (
                supabaseUrl
            ) {

                window.SM_CONFIG.supabase.url =
                    supabaseUrl;

            }


            if (
                supabaseAnonKey
            ) {

                window.SM_CONFIG.supabase.anonKey =
                    supabaseAnonKey;

            }

        }



        /* =================================================
           AUTO SAVE TOGGLE VALUES
        ================================================= */

        const toggles =
            document.querySelectorAll(
                'input[type="checkbox"][data-setting-key]'
            );


        toggles.forEach(
            (toggle) => {

                toggle.addEventListener(
                    "change",
                    () => {

                        const key =
                            toggle.dataset.settingKey;


                        if (!key) {

                            return;

                        }


                        localStorage.setItem(
                            STORAGE_PREFIX +
                            key,
                            toggle.checked
                        );

                    }
                );

            }
        );



        /* =================================================
           ACTIVE TAB LOAD
        ================================================= */

        const savedActiveTab =
            localStorage.getItem(
                "sm_ai_commerce_active_settings_tab"
            );


        if (
            savedActiveTab &&
            document.querySelector(
                `[data-settings-tab="${savedActiveTab}"]`
            )
        ) {

            selectTab(
                savedActiveTab
            );

        }

        else {

            const firstTab =
                document.querySelector(
                    ".settings-tab"
                );


            if (
                firstTab
            ) {

                selectTab(
                    firstTab.dataset.settingsTab
                );

            }

        }



        /* =================================================
           INITIAL LOAD
        ================================================= */

        loadSavedSettings();


        updateConfigPreview();


        updateApiStatus();



        /* =================================================
           API INPUT LIVE STATUS
        ================================================= */

        const apiInputs =
            document.querySelectorAll(
                "[data-api-input]"
            );


        apiInputs.forEach(
            (input) => {

                input.addEventListener(
                    "input",
                    updateApiStatus
                );

            }
        );



        /* =================================================
           CLEAR LOCAL DATA BUTTON
        ================================================= */

        const clearLocalDataBtn =
            document.getElementById(
                "clearLocalDataBtn"
            );


        if (
            clearLocalDataBtn
        ) {

            clearLocalDataBtn.addEventListener(
                "click",
                () => {

                    const confirmed =
                        window.confirm(
                            "This will remove locally saved application settings. Continue?"
                        );


                    if (
                        !confirmed
                    ) {

                        return;

                    }


                    const keysToRemove =
                        [];


                    for (
                        let i = 0;
                        i < localStorage.length;
                        i++
                    ) {

                        const key =
                            localStorage.key(
                                i
                            );


                        if (
                            key &&
                            key.startsWith(
                                STORAGE_PREFIX
                            )
                        ) {

                            keysToRemove.push(
                                key
                            );

                        }

                    }


                    keysToRemove.forEach(
                        (key) => {

                            localStorage.removeItem(
                                key
                            );

                        }
                    );


                    window.location.reload();

                }
            );

        }



        console.log(
            "%cSMART MONEY AI COMMERCE SETTINGS READY",
            "font-size:15px;font-weight:bold;color:#60a5fa;"
        );


    }
);