/* =========================================================
   SMART MONEY AI COMMERCE
   DASHBOARD STYLES
   ========================================================= */


/* =========================================================
   ROOT
   ========================================================= */

:root {

    --bg-primary:
        #07111f;

    --bg-secondary:
        #0b1728;

    --bg-card:
        rgba(15, 31, 52, 0.88);

    --bg-card-solid:
        #0e1d31;

    --bg-hover:
        #132842;

    --border-color:
        rgba(148, 163, 184, 0.14);

    --border-light:
        rgba(255, 255, 255, 0.08);

    --text-primary:
        #f8fafc;

    --text-secondary:
        #94a3b8;

    --text-muted:
        #64748b;

    --blue:
        #3b82f6;

    --blue-light:
        #60a5fa;

    --blue-dark:
        #1d4ed8;

    --cyan:
        #22d3ee;

    --green:
        #22c55e;

    --green-light:
        #4ade80;

    --orange:
        #f59e0b;

    --red:
        #ef4444;

    --purple:
        #8b5cf6;

    --radius-sm:
        10px;

    --radius:
        16px;

    --radius-lg:
        24px;

    --shadow:
        0 18px 50px
        rgba(0, 0, 0, 0.28);

    --transition:
        all 0.25s ease;

}


/* =========================================================
   GLOBAL RESET
   ========================================================= */

* {

    margin:
        0;

    padding:
        0;

    box-sizing:
        border-box;

}


html {

    scroll-behavior:
        smooth;

}


body {

    min-height:
        100vh;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    background:
        var(--bg-primary);

    color:
        var(--text-primary);

    overflow-x:
        hidden;

}


button,
input,
select,
textarea {

    font:
        inherit;

}


button {

    border:
        none;

    outline:
        none;

}


a {

    text-decoration:
        none;

    color:
        inherit;

}


/* =========================================================
   DASHBOARD LAYOUT
   ========================================================= */

.dashboard-layout {

    min-height:
        100vh;

    display:
        flex;

}


/* =========================================================
   SIDEBAR
   ========================================================= */

.sidebar {

    width:
        270px;

    min-height:
        100vh;

    position:
        fixed;

    top:
        0;

    left:
        0;

    z-index:
        100;

    display:
        flex;

    flex-direction:
        column;

    background:
        linear-gradient(
            180deg,
            #081524 0%,
            #07111f 100%
        );

    border-right:
        1px solid
        var(--border-color);

}


/* =========================================================
   SIDEBAR BRAND
   ========================================================= */

.sidebar-brand {

    min-height:
        86px;

    padding:
        18px 20px;

    display:
        flex;

    align-items:
        center;

    gap:
        12px;

    border-bottom:
        1px solid
        var(--border-color);

}


.brand-logo {

    width:
        46px;

    height:
        46px;

    flex:
        0 0 46px;

    border-radius:
        14px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    font-size:
        18px;

    font-weight:
        800;

    letter-spacing:
        1px;

    color:
        #ffffff;

    background:
        linear-gradient(
            135deg,
            var(--blue),
            var(--purple)
        );

    box-shadow:
        0 10px 30px
        rgba(59, 130, 246, 0.25);

}


.sidebar-brand h1 {

    font-size:
        16px;

    line-height:
        1.2;

    font-weight:
        700;

}


.sidebar-brand p {

    margin-top:
        4px;

    font-size:
        11px;

    color:
        var(--text-secondary);

}


/* =========================================================
   SIDEBAR NAVIGATION
   ========================================================= */

.sidebar-nav {

    padding:
        20px 12px;

    flex:
        1;

}


.nav-label {

    padding:
        0 12px;

    margin:
        0 0 10px;

    font-size:
        10px;

    font-weight:
        700;

    letter-spacing:
        1.4px;

    color:
        var(--text-muted);

}


.nav-item {

    width:
        100%;

    min-height:
        50px;

    margin-bottom:
        7px;

    padding:
        0 13px;

    border-radius:
        12px;

    display:
        flex;

    align-items:
        center;

    gap:
        12px;

    color:
        var(--text-secondary);

    transition:
        var(--transition);

    cursor:
        pointer;

}


.nav-item:hover {

    color:
        var(--text-primary);

    background:
        rgba(255, 255, 255, 0.05);

}


.nav-item.active {

    color:
        #ffffff;

    background:
        linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.9),
            rgba(37, 99, 235, 0.72)
        );

    box-shadow:
        0 12px 28px
        rgba(37, 99, 235, 0.16);

}


.nav-icon {

    width:
        22px;

    text-align:
        center;

    font-size:
        17px;

}


.nav-item span:last-child {

    font-size:
        14px;

    font-weight:
        600;

}


/* =========================================================
   SIDEBAR FOOTER
   ========================================================= */

.sidebar-footer {

    padding:
        18px 16px;

    border-top:
        1px solid
        var(--border-color);

}


.system-status {

    padding:
        14px;

    border:
        1px solid
        rgba(34, 197, 94, 0.14);

    border-radius:
        14px;

    background:
        rgba(34, 197, 94, 0.05);

}


.system-status-top {

    display:
        flex;

    align-items:
        center;

    gap:
        8px;

    font-size:
        12px;

    font-weight:
        700;

}


.status-dot {

    width:
        8px;

    height:
        8px;

    border-radius:
        50%;

    background:
        var(--green);

    box-shadow:
        0 0 0 5px
        rgba(34, 197, 94, 0.1);

}


.system-status p {

    margin-top:
        7px;

    font-size:
        11px;

    line-height:
        1.5;

    color:
        var(--text-secondary);

}


/* =========================================================
   MAIN CONTENT
   ========================================================= */

.dashboard-main {

    width:
        calc(100% - 270px);

    min-height:
        100vh;

    margin-left:
        270px;

    background:
        radial-gradient(
            circle at top right,
            rgba(59, 130, 246, 0.08),
            transparent 32%
        ),
        var(--bg-primary);

}


/* =========================================================
   TOP HEADER
   ========================================================= */

.dashboard-header {

    min-height:
        86px;

    padding:
        0 32px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        20px;

    border-bottom:
        1px solid
        var(--border-color);

    background:
        rgba(7, 17, 31, 0.84);

    backdrop-filter:
        blur(16px);

    position:
        sticky;

    top:
        0;

    z-index:
        50;

}


.header-left {

    display:
        flex;

    flex-direction:
        column;

    gap:
        5px;

}


.header-left h2 {

    font-size:
        22px;

    font-weight:
        750;

}


.header-left p {

    font-size:
        13px;

    color:
        var(--text-secondary);

}


.header-right {

    display:
        flex;

    align-items:
        center;

    gap:
        14px;

}


.header-date {

    font-size:
        12px;

    color:
        var(--text-secondary);

}


.profile-button {

    display:
        flex;

    align-items:
        center;

    gap:
        10px;

    padding:
        7px 12px 7px 8px;

    border:
        1px solid
        var(--border-color);

    border-radius:
        14px;

    background:
        rgba(255, 255, 255, 0.03);

    cursor:
        pointer;

    transition:
        var(--transition);

}


.profile-button:hover {

    border-color:
        rgba(96, 165, 250, 0.4);

    background:
        rgba(59, 130, 246, 0.08);

}


.profile-avatar {

    width:
        34px;

    height:
        34px;

    border-radius:
        10px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    font-size:
        13px;

    font-weight:
        800;

    background:
        linear-gradient(
            135deg,
            var(--cyan),
            var(--blue)
        );

}


.profile-text {

    display:
        flex;

    flex-direction:
        column;

    text-align:
        left;

}


.profile-text strong {

    font-size:
        12px;

}


.profile-text small {

    margin-top:
        2px;

    font-size:
        10px;

    color:
        var(--text-secondary);

}


/* =========================================================
   CONTENT WRAPPER
   ========================================================= */

.dashboard-content {

    max-width:
        1600px;

    margin:
        0 auto;

    padding:
        32px;

}


/* =========================================================
   WELCOME SECTION
   ========================================================= */

.welcome-section {

    margin-bottom:
        28px;

    padding:
        30px;

    border:
        1px solid
        var(--border-color);

    border-radius:
        var(--radius-lg);

    position:
        relative;

    overflow:
        hidden;

    background:
        linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.16),
            rgba(14, 29, 49, 0.95)
        );

}


.welcome-section::after {

    content:
        "";

    width:
        280px;

    height:
        280px;

    position:
        absolute;

    top:
        -150px;

    right:
        -80px;

    border-radius:
        50%;

    background:
        rgba(34, 211, 238, 0.08);

    filter:
        blur(10px);

}


.welcome-content {

    position:
        relative;

    z-index:
        2;

}


.welcome-badge {

    display:
        inline-flex;

    align-items:
        center;

    gap:
        7px;

    margin-bottom:
        14px;

    padding:
        7px 12px;

    border-radius:
        999px;

    font-size:
        10px;

    font-weight:
        800;

    letter-spacing:
        0.7px;

    color:
        var(--blue-light);

    background:
        rgba(59, 130, 246, 0.1);

    border:
        1px solid
        rgba(96, 165, 250, 0.15);

}


.welcome-section h1 {

    max-width:
        720px;

    font-size:
        clamp(26px, 4vw, 42px);

    line-height:
        1.15;

    font-weight:
        800;

}


.welcome-section h1 span {

    color:
        var(--blue-light);

}


.welcome-section p {

    max-width:
        720px;

    margin-top:
        14px;

    font-size:
        14px;

    line-height:
        1.7;

    color:
        var(--text-secondary);

}


/* =========================================================
   OVERVIEW CARDS
   ========================================================= */

.stats-grid {

    display:
        grid;

    grid-template-columns:
        repeat(4, minmax(0, 1fr));

    gap:
        18px;

    margin-bottom:
        28px;

}


.stat-card {

    min-height:
        155px;

    padding:
        20px;

    border:
        1px solid
        var(--border-color);

    border-radius:
        var(--radius);

    position:
        relative;

    overflow:
        hidden;

    background:
        var(--bg-card);

    transition:
        var(--transition);

}


.stat-card:hover {

    transform:
        translateY(-4px);

    border-color:
        rgba(96, 165, 250, 0.28);

    box-shadow:
        var(--shadow);

}


.stat-card-top {

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        12px;

}


.stat-card-label {

    font-size:
        11px;

    font-weight:
        700;

    letter-spacing:
        0.6px;

    color:
        var(--text-secondary);

    text-transform:
        uppercase;

}


.stat-icon {

    width:
        42px;

    height:
        42px;

    border-radius:
        12px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    font-size:
        19px;

    background:
        rgba(59, 130, 246, 0.1);

}


.stat-value {

    margin-top:
        22px;

    font-size:
        28px;

    font-weight:
        800;

    letter-spacing:
        -0.5px;

}


.stat-footer {

    margin-top:
        10px;

    display:
        flex;

    align-items:
        center;

    gap:
        7px;

    font-size:
        11px;

    color:
        var(--text-secondary);

}


.stat-change {

    color:
        var(--green-light);

    font-weight:
        700;

}


/* =========================================================
   SECTION HEADER
   ========================================================= */

.section-header {

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        20px;

    margin-bottom:
        18px;

}


.section-title {

    display:
        flex;

    flex-direction:
        column;

    gap:
        5px;

}


.section-title h3 {

    font-size:
        19px;

    font-weight:
        750;

}


.section-title p {

    font-size:
        12px;

    color:
        var(--text-secondary);

}


.section-action {

    padding:
        10px 15px;

    border:
        1px solid
        var(--border-color);

    border-radius:
        10px;

    font-size:
        12px;

    font-weight:
        700;

    color:
        var(--blue-light);

    background:
        rgba(59, 130, 246, 0.07);

    cursor:
        pointer;

    transition:
        var(--transition);

}


.section-action:hover {

    border-color:
        var(--blue);

    background:
        rgba(59, 130, 246, 0.14);

}


/* =========================================================
   DASHBOARD GRID
   ========================================================= */

.dashboard-grid {

    display:
        grid;

    grid-template-columns:
        minmax(0, 1.5fr)
        minmax(320px, 0.8fr);

    gap:
        22px;

    margin-bottom:
        28px;

}


/* =========================================================
   CARD
   ========================================================= */

.dashboard-card {

    border:
        1px solid
        var(--border-color);

    border-radius:
        var(--radius-lg);

    background:
        var(--bg-card);

    overflow:
        hidden;

}


.card-header {

    padding:
        22px 22px 16px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        15px;

    border-bottom:
        1px solid
        var(--border-light);

}


.card-header h3 {

    font-size:
        16px;

    font-weight:
        750;

}


.card-header p {

    margin-top:
        4px;

    font-size:
        11px;

    color:
        var(--text-secondary);

}


/* =========================================================
   ACTIVITY
   ========================================================= */

.activity-list {

    padding:
        8px 18px 18px;

}


.activity-item {

    padding:
        17px 4px;

    display:
        flex;

    align-items:
        center;

    gap:
        14px;

    border-bottom:
        1px solid
        var(--border-light);

}


.activity-item:last-child {

    border-bottom:
        none;

}


.activity-icon {

    width:
        42px;

    height:
        42px;

    flex:
        0 0 42px;

    border-radius:
        12px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    background:
        rgba(59, 130, 246, 0.08);

    font-size:
        17px;

}


.activity-content {

    min-width:
        0;

    flex:
        1;

}


.activity-content strong {

    display:
        block;

    overflow:
        hidden;

    text-overflow:
        ellipsis;

    white-space:
        nowrap;

    font-size:
        13px;

}


.activity-content p {

    margin-top:
        5px;

    font-size:
        11px;

    color:
        var(--text-secondary);

}


.activity-time {

    font-size:
        10px;

    color:
        var(--text-muted);

    white-space:
        nowrap;

}


/* =========================================================
   AI STATUS CARD
   ========================================================= */

.ai-status-card {

    padding:
        22px;

}


.ai-visual {

    min-height:
        210px;

    border-radius:
        18px;

    display:
        flex;

    flex-direction:
        column;

    align-items:
        center;

    justify-content:
        center;

    text-align:
        center;

    background:
        radial-gradient(
            circle,
            rgba(59, 130, 246, 0.17),
            rgba(59, 130, 246, 0.03) 45%,
            transparent 70%
        );

}


.ai-orb {

    width:
        100px;

    height:
        100px;

    border-radius:
        50%;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    margin-bottom:
        18px;

    font-size:
        38px;

    border:
        1px solid
        rgba(96, 165, 250, 0.3);

    background:
        rgba(59, 130, 246, 0.1);

    box-shadow:
        0 0 50px
        rgba(59, 130, 246, 0.16);

}


.ai-visual h3 {

    font-size:
        17px;

}


.ai-visual p {

    margin-top:
        7px;

    max-width:
        260px;

    font-size:
        11px;

    line-height:
        1.6;

    color:
        var(--text-secondary);

}


.ai-status-list {

    margin-top:
        20px;

    display:
        flex;

    flex-direction:
        column;

    gap:
        12px;

}


.ai-status-row {

    padding:
        12px 13px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        15px;

    border:
        1px solid
        var(--border-light);

    border-radius:
        12px;

    background:
        rgba(255, 255, 255, 0.02);

}


.ai-status-row span {

    font-size:
        12px;

    color:
        var(--text-secondary);

}


.status-online {

    display:
        inline-flex;

    align-items:
        center;

    gap:
        6px;

    font-size:
        11px;

    font-weight:
        700;

    color:
        var(--green-light);

}


/* =========================================================
   QUICK ACTIONS
   ========================================================= */

.quick-actions-grid {

    display:
        grid;

    grid-template-columns:
        repeat(4, minmax(0, 1fr));

    gap:
        16px;

    margin-bottom:
        28px;

}


.quick-action {

    min-height:
        130px;

    padding:
        20px;

    border:
        1px solid
        var(--border-color);

    border-radius:
        var(--radius);

    display:
        flex;

    flex-direction:
        column;

    justify-content:
        space-between;

    background:
        var(--bg-card);

    cursor:
        pointer;

    transition:
        var(--transition);

}


.quick-action:hover {

    transform:
        translateY(-4px);

    border-color:
        rgba(96, 165, 250, 0.35);

    background:
        var(--bg-hover);

}


.quick-action-icon {

    width:
        44px;

    height:
        44px;

    border-radius:
        12px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    font-size:
        19px;

    background:
        rgba(59, 130, 246, 0.1);

}


.quick-action strong {

    margin-top:
        15px;

    font-size:
        14px;

}


.quick-action small {

    margin-top:
        5px;

    display:
        block;

    font-size:
        11px;

    line-height:
        1.5;

    color:
        var(--text-secondary);

}


/* =========================================================
   STORE PERFORMANCE
   ========================================================= */

.performance-card {

    padding:
        22px;

    margin-bottom:
        28px;

    border:
        1px solid
        var(--border-color);

    border-radius:
        var(--radius-lg);

    background:
        var(--bg-card);

}


.performance-grid {

    margin-top:
        22px;

    display:
        grid;

    grid-template-columns:
        repeat(3, minmax(0, 1fr));

    gap:
        16px;

}


.performance-item {

    padding:
        18px;

    border:
        1px solid
        var(--border-light);

    border-radius:
        16px;

    background:
        rgba(255, 255, 255, 0.02);

}


.performance-item-header {

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        10px;

}


.store-name {

    display:
        flex;

    align-items:
        center;

    gap:
        9px;

    font-size:
        13px;

    font-weight:
        700;

}


.store-icon {

    width:
        32px;

    height:
        32px;

    border-radius:
        9px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    background:
        rgba(59, 130, 246, 0.1);

}


.performance-value {

    margin-top:
        20px;

    font-size:
        22px;

    font-weight:
        800;

}


.performance-label {

    margin-top:
        5px;

    font-size:
        11px;

    color:
        var(--text-secondary);

}


.progress-track {

    width:
        100%;

    height:
        6px;

    margin-top:
        18px;

    overflow:
        hidden;

    border-radius:
        999px;

    background:
        rgba(148, 163, 184, 0.1);

}


.progress-fill {

    height:
        100%;

    border-radius:
        inherit;

    background:
        linear-gradient(
            90deg,
            var(--blue),
            var(--cyan)
        );

}


/* =========================================================
   EMPTY STATE
   ========================================================= */

.empty-state {

    padding:
        42px 25px;

    text-align:
        center;

    color:
        var(--text-secondary);

}


.empty-state-icon {

    width:
        60px;

    height:
        60px;

    margin:
        0 auto 15px;

    border-radius:
        18px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    font-size:
        25px;

    background:
        rgba(59, 130, 246, 0.08);

}


.empty-state h4 {

    font-size:
        15px;

    color:
        var(--text-primary);

}


.empty-state p {

    margin-top:
        8px;

    font-size:
        12px;

    line-height:
        1.6;

}


/* =========================================================
   BUTTONS
   ========================================================= */

.primary-btn {

    min-height:
        46px;

    padding:
        0 18px;

    border-radius:
        12px;

    display:
        inline-flex;

    align-items:
        center;

    justify-content:
        center;

    gap:
        9px;

    color:
        #ffffff;

    font-size:
        13px;

    font-weight:
        750;

    cursor:
        pointer;

    background:
        linear-gradient(
            135deg,
            var(--blue),
            var(--blue-dark)
        );

    box-shadow:
        0 12px 25px
        rgba(37, 99, 235, 0.18);

    transition:
        var(--transition);

}


.primary-btn:hover {

    transform:
        translateY(-2px);

    box-shadow:
        0 16px 35px
        rgba(37, 99, 235, 0.28);

}


.secondary-btn {

    min-height:
        42px;

    padding:
        0 16px;

    border:
        1px solid
        var(--border-color);

    border-radius:
        11px;

    color:
        var(--text-primary);

    font-size:
        12px;

    font-weight:
        700;

    background:
        rgba(255, 255, 255, 0.03);

    cursor:
        pointer;

    transition:
        var(--transition);

}


.secondary-btn:hover {

    border-color:
        rgba(96, 165, 250, 0.4);

    background:
        rgba(59, 130, 246, 0.08);

}


/* =========================================================
   LOADING
   ========================================================= */

.loading {

    position:
        relative;

    overflow:
        hidden;

}


.loading::after {

    content:
        "";

    position:
        absolute;

    inset:
        0;

    transform:
        translateX(-100%);

    background:
        linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.04),
            transparent
        );

    animation:
        shimmer 1.5s infinite;

}


@keyframes shimmer {

    100% {

        transform:
            translateX(100%);

    }

}


/* =========================================================
   SCROLLBAR
   ========================================================= */

::-webkit-scrollbar {

    width:
        7px;

}


::-webkit-scrollbar-track {

    background:
        var(--bg-primary);

}


::-webkit-scrollbar-thumb {

    border-radius:
        10px;

    background:
        #20354f;

}


::-webkit-scrollbar-thumb:hover {

    background:
        #2d4b6e;

}


/* =========================================================
   TABLET RESPONSIVE
   ========================================================= */

@media (
    max-width: 1200px
) {

    .stats-grid {

        grid-template-columns:
            repeat(2, minmax(0, 1fr));

    }


    .quick-actions-grid {

        grid-template-columns:
            repeat(2, minmax(0, 1fr));

    }


    .performance-grid {

        grid-template-columns:
            1fr;

    }


    .dashboard-grid {

        grid-template-columns:
            1fr;

    }

}


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

.mobile-menu-btn {

    display:
        none;

}


@media (
    max-width: 900px
) {

    .sidebar {

        width:
            250px;

        transform:
            translateX(-100%);

        transition:
            transform 0.3s ease;

        box-shadow:
            20px 0 50px
            rgba(0, 0, 0, 0.3);

    }


    .sidebar.show {

        transform:
            translateX(0);

    }


    .dashboard-main {

        width:
            100%;

        margin-left:
            0;

    }


    .mobile-menu-btn {

        width:
            42px;

        height:
            42px;

        display:
            inline-flex;

        align-items:
            center;

        justify-content:
            center;

        border:
            1px solid
            var(--border-color);

        border-radius:
            10px;

        color:
            var(--text-primary);

        background:
            rgba(255, 255, 255, 0.04);

        cursor:
            pointer;

    }


    .dashboard-header {

        padding:
            0 20px;

    }


    .dashboard-content {

        padding:
            22px 20px;

    }


    .header-date {

        display:
            none;

    }

}


/* =========================================================
   SMALL MOBILE
   ========================================================= */

@media (
    max-width: 620px
) {

    .dashboard-header {

        min-height:
            72px;

    }


    .header-left h2 {

        font-size:
            17px;

    }


    .header-left p {

        display:
            none;

    }


    .profile-text {

        display:
            none;

    }


    .profile-button {

        padding:
            6px;

    }


    .stats-grid {

        grid-template-columns:
            1fr;

    }


    .quick-actions-grid {

        grid-template-columns:
            1fr;

    }


    .welcome-section {

        padding:
            24px 20px;

    }


    .welcome-section h1 {

        font-size:
            27px;

    }


    .welcome-section p {

        font-size:
            13px;

    }


    .dashboard-content {

        padding:
            18px 14px;

    }


    .section-header {

        align-items:
            flex-start;

        flex-direction:
            column;

    }


    .section-action {

        width:
            100%;

        text-align:
            center;

    }


    .card-header {

        padding:
            18px 16px;

    }


    .activity-list {

        padding:
            8px 14px 14px;

    }


    .activity-time {

        display:
            none;

    }


    .stat-value {

        font-size:
            25px;

    }

}


/* =========================================================
   EXTRA SMALL MOBILE
   ========================================================= */

@media (
    max-width: 380px
) {

    .welcome-section h1 {

        font-size:
            23px;

    }


    .stat-card {

        padding:
            16px;

    }


    .profile-avatar {

        width:
            32px;

        height:
            32px;

    }

}