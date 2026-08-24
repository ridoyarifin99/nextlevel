"use strict";

/*
============================================================
NEXT LEVEL SUBS
GLOBAL AUTHENTICATION SYSTEM
============================================================

Requires:
    1. Supabase JS v2
    2. /js/supabase-config.js

Your supabase-config.js must create:

    window.supabaseClient

This file handles:

    - Current session detection
    - Navbar login/logout state
    - Dashboard visibility
    - Logout
    - Auth state changes
    - Protected pages
    - Redirecting logged-in users
    - Getting current user
============================================================
*/


/* ============================================================
   GLOBAL AUTH OBJECT
============================================================ */

window.NextLevelAuth = {

    /* ========================================================
       GET SESSION
    ======================================================== */

    async getSession() {

        if (
            typeof window.supabaseClient === "undefined"
        ) {
            console.error(
                "Next Level Subs: supabaseClient is not available."
            );

            return null;
        }

        try {

            const {
                data,
                error
            } =
                await window.supabaseClient.auth.getSession();

            if (error) {
                console.error(
                    "Auth session error:",
                    error
                );

                return null;
            }

            return data?.session || null;

        }
        catch (error) {

            console.error(
                "Auth getSession error:",
                error
            );

            return null;
        }
    },


    /* ========================================================
       GET CURRENT USER
    ======================================================== */

    async getUser() {

        if (
            typeof window.supabaseClient === "undefined"
        ) {
            return null;
        }

        try {

            const {
                data,
                error
            } =
                await window.supabaseClient.auth.getUser();

            if (error) {

                console.error(
                    "Auth getUser error:",
                    error
                );

                return null;
            }

            return data?.user || null;

        }
        catch (error) {

            console.error(
                "Auth user error:",
                error
            );

            return null;
        }
    },


    /* ========================================================
       IS LOGGED IN
    ======================================================== */

    async isLoggedIn() {

        const session =
            await this.getSession();

        return !!session;
    },


    /* ========================================================
       LOGOUT
    ======================================================== */

    async logout() {

        if (
            typeof window.supabaseClient === "undefined"
        ) {
            console.error(
                "Next Level Subs: Supabase is unavailable."
            );

            return {
                success: false,
                error: new Error(
                    "Authentication service unavailable."
                )
            };
        }

        try {

            const {
                error
            } =
                await window.supabaseClient.auth.signOut();

            if (error) {

                console.error(
                    "Logout error:",
                    error
                );

                return {
                    success: false,
                    error
                };
            }

            /*
            ====================================================
            SUCCESSFUL LOGOUT
            ====================================================
            */

            window.NextLevelAuth.updateNavbar(
                null
            );

            return {
                success: true,
                error: null
            };

        }
        catch (error) {

            console.error(
                "Logout exception:",
                error
            );

            return {
                success: false,
                error
            };
        }
    },


    /* ========================================================
       UPDATE NAVBAR
    ======================================================== */

    updateNavbar(user) {

        /*
        --------------------------------------------------------
        Supported navbar selectors
        --------------------------------------------------------

        You can use any of these IDs/classes in your navbar:

            #loginLink
            #registerLink
            #dashboardLink
            #logoutButton

        Or:

            .auth-login
            .auth-register
            .auth-dashboard
            .auth-logout
        --------------------------------------------------------
        */


        const loginElements =
            document.querySelectorAll(
                "#loginLink, .auth-login"
            );

        const registerElements =
            document.querySelectorAll(
                "#registerLink, .auth-register"
            );

        const dashboardElements =
            document.querySelectorAll(
                "#dashboardLink, .auth-dashboard"
            );

        const logoutElements =
            document.querySelectorAll(
                "#logoutButton, .auth-logout"
            );


        const loggedIn =
            !!user;


        /* ====================================================
           LOGGED IN
        ==================================================== */

        if (loggedIn) {

            loginElements.forEach(
                function (element) {

                    element.style.display =
                        "none";
                }
            );


            registerElements.forEach(
                function (element) {

                    element.style.display =
                        "none";
                }
            );


            dashboardElements.forEach(
                function (element) {

                    element.style.display =
                        "";
                }
            );


            logoutElements.forEach(
                function (element) {

                    element.style.display =
                        "";
                }
            );


            /*
            ----------------------------------------------------
            Add user information to elements
            ----------------------------------------------------
            */

            document
                .querySelectorAll(
                    "[data-user-email]"
                )
                .forEach(
                    function (element) {

                        element.textContent =
                            user.email || "";
                    }
                );


            document
                .querySelectorAll(
                    "[data-user-id]"
                )
                .forEach(
                    function (element) {

                        element.textContent =
                            user.id || "";
                    }
                );


            /*
            ----------------------------------------------------
            Store a safe reference for UI use only
            ----------------------------------------------------
            */

            document.documentElement
                .setAttribute(
                    "data-authenticated",
                    "true"
                );

        }


        /* ====================================================
           LOGGED OUT
        ==================================================== */

        else {

            loginElements.forEach(
                function (element) {

                    element.style.display =
                        "";
                }
            );


            registerElements.forEach(
                function (element) {

                    element.style.display =
                        "";
                }
            );


            dashboardElements.forEach(
                function (element) {

                    element.style.display =
                        "none";
                }
            );


            logoutElements.forEach(
                function (element) {

                    element.style.display =
                        "none";
                }
            );


            document.documentElement
                .setAttribute(
                    "data-authenticated",
                    "false"
                );
        }
    },


    /* ========================================================
       INITIALIZE NAVBAR
    ======================================================== */

    async initNavbar() {

        if (
            typeof window.supabaseClient ===
            "undefined"
        ) {

            console.error(
                "Next Level Subs: Supabase client not found."
            );

            return;
        }


        /*
        --------------------------------------------------------
        Immediately hide authenticated-only items
        until session check finishes.
        --------------------------------------------------------
        */

        document
            .querySelectorAll(
                "#dashboardLink, .auth-dashboard, #logoutButton, .auth-logout"
            )
            .forEach(
                function (element) {

                    element.style.display =
                        "none";
                }
            );


        const session =
            await this.getSession();


        const user =
            session?.user || null;


        this.updateNavbar(user);


        /*
        --------------------------------------------------------
        Listen for future authentication changes
        --------------------------------------------------------
        */

        window.supabaseClient.auth
            .onAuthStateChange(
                function (
                    event,
                    session
                ) {

                    const user =
                        session?.user || null;

                    window.NextLevelAuth
                        .updateNavbar(
                            user
                        );

                    /*
                    --------------------------------------------
                    Custom event
                    --------------------------------------------
                    */

                    window.dispatchEvent(
                        new CustomEvent(
                            "nextlevelauthchange",
                            {
                                detail: {
                                    event,
                                    session,
                                    user
                                }
                            }
                        )
                    );
                }
            );


        /*
        --------------------------------------------------------
        Attach logout buttons
        --------------------------------------------------------
        */

        this.attachLogoutHandlers();
    },


    /* ========================================================
       LOGOUT BUTTON HANDLERS
    ======================================================== */

    attachLogoutHandlers() {

        document
            .querySelectorAll(
                "#logoutButton, .auth-logout"
            )
            .forEach(
                function (button) {

                    /*
                    Avoid attaching duplicate listeners.
                    */

                    if (
                        button.dataset.authLogoutBound ===
                        "true"
                    ) {
                        return;
                    }


                    button.dataset.authLogoutBound =
                        "true";


                    button.addEventListener(
                        "click",
                        async function (event) {

                            event.preventDefault();


                            /*
                            --------------------------------
                            Optional confirmation
                            --------------------------------
                            */

                            const confirmed =
                                window.confirm(
                                    "Are you sure you want to log out?"
                                );


                            if (!confirmed) {
                                return;
                            }


                            /*
                            --------------------------------
                            Loading state
                            --------------------------------
                            */

                            const originalHTML =
                                button.innerHTML;


                            button.disabled =
                                true;


                            button.innerHTML =
                                `
                                <i class="fas fa-spinner fa-spin"></i>
                                Logging out...
                                `;


                            const result =
                                await window.NextLevelAuth
                                    .logout();


                            if (
                                !result.success
                            ) {

                                button.disabled =
                                    false;

                                button.innerHTML =
                                    originalHTML;


                                alert(
                                    "Unable to log out. Please try again."
                                );

                                return;
                            }


                            /*
                            --------------------------------
                            Redirect home
                            --------------------------------
                            */

                            window.location.replace(
                                "index.html"
                            );
                        }
                    );
                }
            );
    },


    /* ========================================================
       PROTECT PAGE
    ========================================================

       Use on dashboard.html:

       await NextLevelAuth.requireAuth();

    ======================================================== */

    async requireAuth(
        redirect = "login.html"
    ) {

        const session =
            await this.getSession();


        if (
            !session ||
            !session.user
        ) {

            const currentPage =
                window.location.pathname +
                window.location.search;


            const separator =
                redirect.includes("?")
                    ? "&"
                    : "?";


            window.location.replace(
                redirect +
                separator +
                "redirect=" +
                encodeURIComponent(
                    currentPage
                )
            );


            return null;
        }


        return session.user;
    },


    /* ========================================================
       REDIRECT IF ALREADY LOGGED IN
    ========================================================

       Useful for:

           login.html
           register.html

    ======================================================== */

    async redirectIfAuthenticated(
        destination = "dashboard.html"
    ) {

        const session =
            await this.getSession();


        if (
            session &&
            session.user
        ) {

            window.location.replace(
                destination
            );


            return true;
        }


        return false;
    },


    /* ========================================================
       USER DISPLAY NAME
    ======================================================== */

    getUserDisplayName(user) {

        if (!user) {
            return "User";
        }


        /*
        Supabase user metadata
        */

        const metadata =
            user.user_metadata || {};


        const name =
            metadata.full_name ||
            metadata.name ||
            metadata.display_name;


        if (name) {
            return name;
        }


        /*
        Use email username if no name exists
        */

        if (user.email) {

            return user.email
                .split("@")[0];
        }


        return "User";
    },


    /* ========================================================
       GET USER EMAIL
    ======================================================== */

    getUserEmail(user) {

        return user?.email || "";
    },


    /* ========================================================
       WAIT FOR AUTH
    ======================================================== */

    waitForAuth() {

        return new Promise(
            function (resolve) {

                if (
                    typeof window.supabaseClient ===
                    "undefined"
                ) {

                    resolve(null);

                    return;
                }


                window.supabaseClient.auth
                    .getSession()
                    .then(
                        function ({
                            data
                        }) {

                            resolve(
                                data?.session ||
                                null
                            );
                        }
                    )
                    .catch(
                        function () {

                            resolve(null);
                        }
                    );
            }
        );
    }
};


/* ============================================================
   AUTOMATIC NAVBAR INITIALIZATION
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        window.NextLevelAuth
            .initNavbar();
    }
);