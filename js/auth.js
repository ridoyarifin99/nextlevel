"use strict";

/*
============================================================
NEXT LEVEL SUBS
GLOBAL SUPABASE AUTHENTICATION
============================================================

LOGGED OUT:
    Login

LOGGED IN:
    Username

USERNAME CLICK:
    /dashboard.html

EMAIL VERIFICATION:
    Supabase processes the confirmation URL
    -> Session created
    -> SIGNED_IN event
    -> Authentication URL cleaned

No dropdown.
No account settings.
No logout button.
============================================================
*/


window.NextLevelAuth = {

    /* ========================================================
       GET SESSION
    ======================================================== */

    async getSession() {

        if (!window.supabaseClient) {

            console.error(
                "NEXT LEVEL SUBS: supabaseClient not found."
            );

            return null;
        }

        try {

            const {
                data,
                error
            } = await window.supabaseClient.auth.getSession();

            if (error) {

                console.error(
                    "NEXT LEVEL SUBS: Session error:",
                    error
                );

                return null;
            }

            return data?.session || null;

        } catch (error) {

            console.error(
                "NEXT LEVEL SUBS: getSession error:",
                error
            );

            return null;
        }
    },


    /* ========================================================
       GET USER
    ======================================================== */

    async getUser() {

        if (!window.supabaseClient) {
            return null;
        }

        try {

            const {
                data,
                error
            } = await window.supabaseClient.auth.getUser();

            if (error) {

                console.error(
                    "NEXT LEVEL SUBS: User error:",
                    error
                );

                return null;
            }

            return data?.user || null;

        } catch (error) {

            console.error(
                "NEXT LEVEL SUBS: getUser error:",
                error
            );

            return null;
        }
    },


    /* ========================================================
       GET USERNAME
    ======================================================== */

    getUserDisplayName(user) {

        if (!user) {
            return "User";
        }

        const metadata =
            user.user_metadata || {};

        const name =
            metadata.username ||
            metadata.full_name ||
            metadata.name ||
            metadata.display_name;

        if (
            name &&
            String(name).trim()
        ) {

            return String(name).trim();
        }


        /*
        --------------------------------------------------------
        FALLBACK TO EMAIL USERNAME
        --------------------------------------------------------
        */

        if (user.email) {

            const emailName =
                user.email.split("@")[0];

            if (emailName) {
                return emailName;
            }
        }

        return "User";
    },


    /* ========================================================
       CLEAN SUPABASE AUTH URL
    ======================================================== */

    cleanAuthUrl() {

        try {

            const hash =
                window.location.hash;

            /*
            ----------------------------------------------------
            Nothing to clean
            ----------------------------------------------------
            */

            if (!hash) {
                return;
            }


            /*
            ----------------------------------------------------
            Read hash parameters.
            ----------------------------------------------------
            */

            const hashParams =
                new URLSearchParams(
                    hash.substring(1)
                );


            /*
            ----------------------------------------------------
            Detect Supabase authentication hash.
            ----------------------------------------------------
            */

            const isSupabaseAuthHash =
                hashParams.has("access_token") ||
                hashParams.has("refresh_token") ||
                hashParams.has("expires_at") ||
                hashParams.has("expires_in") ||
                hashParams.has("token_type") ||
                hashParams.has("type") ||
                hashParams.has("error") ||
                hashParams.has("error_code") ||
                hashParams.has("error_description");


            /*
            ----------------------------------------------------
            Do not remove normal website hashes.
            ----------------------------------------------------
            */

            if (!isSupabaseAuthHash) {
                return;
            }


            /*
            ----------------------------------------------------
            Keep pathname and query string.
            Remove only authentication hash.
            ----------------------------------------------------
            */

            const cleanUrl =
                window.location.pathname +
                window.location.search;

            window.history.replaceState(
                null,
                document.title,
                cleanUrl
            );


            console.log(
                "NEXT LEVEL SUBS: Authentication URL cleaned."
            );

        } catch (error) {

            console.warn(
                "NEXT LEVEL SUBS: Could not clean auth URL:",
                error
            );
        }
    },


    /* ========================================================
       SET USERNAME NAVIGATION
    ======================================================== */

    setupUsernameNavigation() {

        const userAccount =
            document.getElementById(
                "userAccountArea"
            );

        if (!userAccount) {
            return;
        }


        /*
        --------------------------------------------------------
        Prevent duplicate listener.
        --------------------------------------------------------
        */

        if (
            userAccount.dataset.authNavigationBound ===
            "true"
        ) {
            return;
        }

        userAccount.dataset.authNavigationBound =
            "true";


        /*
        --------------------------------------------------------
        Dashboard navigation.
        --------------------------------------------------------
        */

        userAccount.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                window.location.href =
                    "/dashboard.html";
            }
        );
    },


    /* ========================================================
       UPDATE NAVBAR
    ======================================================== */

    updateNavbar(user) {

        const loginLink =
            document.getElementById(
                "loginLink"
            );

        const userAccount =
            document.getElementById(
                "userAccountArea"
            );

        const userName =
            document.getElementById(
                "navUserName"
            );


        /*
        --------------------------------------------------------
        No authentication elements.
        --------------------------------------------------------
        */

        if (
            !loginLink &&
            !userAccount
        ) {
            return;
        }


        /* ====================================================
           LOGGED IN
        ==================================================== */

        if (user) {

            const displayName =
                this.getUserDisplayName(user);


            /*
            ----------------------------------------------------
            Hide Login
            ----------------------------------------------------
            */

            if (loginLink) {

                loginLink.style.display =
                    "none";
            }


            /*
            ----------------------------------------------------
            Show Username
            ----------------------------------------------------
            */

            if (userAccount) {

                userAccount.style.display =
                    "inline-flex";

                userAccount.href =
                    "/dashboard.html";

                userAccount.setAttribute(
                    "aria-label",
                    "Open dashboard"
                );
            }


            /*
            ----------------------------------------------------
            Display Username
            ----------------------------------------------------
            */

            if (userName) {

                userName.textContent =
                    displayName;
            }


            /*
            ----------------------------------------------------
            Generic user elements.
            ----------------------------------------------------
            */

            document
                .querySelectorAll(
                    "[data-user-name]"
                )
                .forEach(
                    function (element) {

                        element.textContent =
                            displayName;
                    }
                );


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
            Authentication state.
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

            /*
            ----------------------------------------------------
            Show Login
            ----------------------------------------------------
            */

            if (loginLink) {

                loginLink.style.display =
                    "inline-flex";
            }


            /*
            ----------------------------------------------------
            Hide Username
            ----------------------------------------------------
            */

            if (userAccount) {

                userAccount.style.display =
                    "none";
            }


            /*
            ----------------------------------------------------
            Reset Username
            ----------------------------------------------------
            */

            if (userName) {

                userName.textContent =
                    "User";
            }


            /*
            ----------------------------------------------------
            Authentication state.
            ----------------------------------------------------
            */

            document.documentElement
                .setAttribute(
                    "data-authenticated",
                    "false"
                );
        }
    },


    /* ========================================================
       HANDLE AUTH STATE CHANGE
    ======================================================== */

    handleAuthStateChange(
        event,
        session
    ) {

        const user =
            session?.user || null;


        console.log(
            "NEXT LEVEL SUBS AUTH EVENT:",
            event
        );


        /*
        --------------------------------------------------------
        Authentication events.
        --------------------------------------------------------
        */

        if (
            event === "SIGNED_IN" ||
            event === "INITIAL_SESSION" ||
            event === "TOKEN_REFRESHED"
        ) {

            if (session?.user) {

                console.log(
                    "NEXT LEVEL SUBS: Authenticated:",
                    session.user.email
                );
            }
        }


        /*
        --------------------------------------------------------
        Clean Supabase authentication hash.

        This removes:

        #access_token=...
        #refresh_token=...
        #type=signup

        from the browser URL.
        --------------------------------------------------------
        */

        if (
            event === "SIGNED_IN" ||
            event === "INITIAL_SESSION"
        ) {

            this.cleanAuthUrl();
        }


        /*
        --------------------------------------------------------
        Update navbar.
        --------------------------------------------------------
        */

        setTimeout(
            function () {

                window.NextLevelAuth
                    .updateNavbar(user);

            },
            0
        );


        /*
        --------------------------------------------------------
        Custom application event.
        --------------------------------------------------------
        */

        window.dispatchEvent(
            new CustomEvent(
                "nextlevelauthchange",
                {
                    detail: {
                        event: event,
                        session: session,
                        user: user
                    }
                }
            )
        );
    },


    /* ========================================================
       INITIALIZE
    ======================================================== */

    async init() {

        if (!window.supabaseClient) {

            console.error(
                "NEXT LEVEL SUBS: Supabase client is missing."
            );

            return;
        }


        /*
        --------------------------------------------------------
        Username navigation.
        --------------------------------------------------------
        */

        this.setupUsernameNavigation();


        /*
        --------------------------------------------------------
        IMPORTANT:
        Register auth listener BEFORE getting the session.

        This ensures we don't miss the authentication event
        generated when Supabase processes the confirmation URL.
        --------------------------------------------------------
        */

        window.supabaseClient.auth
            .onAuthStateChange(
                (
                    event,
                    session
                ) => {

                    this.handleAuthStateChange(
                        event,
                        session
                    );
                }
            );


        /*
        --------------------------------------------------------
        Get current session.
        --------------------------------------------------------
        */

        const session =
            await this.getSession();

        const user =
            session?.user || null;


        /*
        --------------------------------------------------------
        Update navbar.
        --------------------------------------------------------
        */

        this.updateNavbar(user);


        /*
        --------------------------------------------------------
        If an authenticated session already exists,
        remove any leftover Supabase authentication hash.
        --------------------------------------------------------
        */

        if (session) {

            this.cleanAuthUrl();
        }
    },


    /* ========================================================
       LOGOUT
    ======================================================== */

    async logout() {

        if (!window.supabaseClient) {

            return {
                success: false,
                error: new Error(
                    "Supabase unavailable."
                )
            };
        }

        try {

            const {
                error
            } =
                await window.supabaseClient.auth.signOut();

            if (error) {

                return {
                    success: false,
                    error: error
                };
            }

            this.updateNavbar(null);

            return {
                success: true,
                error: null
            };

        } catch (error) {

            return {
                success: false,
                error: error
            };
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
       PROTECT PAGE
    ======================================================== */

    async requireAuth(
        redirect = "/login.html"
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
    ======================================================== */

    async redirectIfAuthenticated(
        destination = "/dashboard.html"
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
    }
};


/* ============================================================
   INITIALIZE AFTER DOM
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        window.NextLevelAuth.init();

    }
);