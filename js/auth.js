"use strict";

window.NextLevelAuth = {
    async getSession() {
        if (!window.supabaseClient) return null;
        try {
            const { data, error } = await window.supabaseClient.auth.getSession();
            if (error) { console.error("NEXT LEVEL SUBS: Session error:", error); return null; }
            return data?.session || null;
        } catch (error) {
            console.error("NEXT LEVEL SUBS: getSession error:", error);
            return null;
        }
    },

    async getUser() {
        if (!window.supabaseClient) return null;
        try {
            const { data, error } = await window.supabaseClient.auth.getUser();
            if (error) { console.error("NEXT LEVEL SUBS: User error:", error); return null; }
            return data?.user || null;
        } catch (error) {
            console.error("NEXT LEVEL SUBS: getUser error:", error);
            return null;
        }
    },

    getUserDisplayName(user) {
        if (!user) return "User";
        const metadata = user.user_metadata || {};
        const name = metadata.username || metadata.full_name || metadata.name || metadata.display_name;
        if (name && String(name).trim()) return String(name).trim();
        if (user.email) return user.email.split("@")[0] || "User";
        return "User";
    },

    cleanAuthUrl() {
        try {
            const hash = window.location.hash;
            if (!hash) return;
            const hashParams = new URLSearchParams(hash.substring(1));
            const isSupabaseAuthHash =
                hashParams.has("access_token") || hashParams.has("refresh_token") ||
                hashParams.has("expires_at") || hashParams.has("expires_in") ||
                hashParams.has("token_type") || hashParams.has("type") ||
                hashParams.has("error") || hashParams.has("error_code") ||
                hashParams.has("error_description");
            if (!isSupabaseAuthHash) return;
            window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
        } catch (error) {
            console.warn("NEXT LEVEL SUBS: Could not clean auth URL:", error);
        }
    },

    setupUsernameNavigation() {
        const userAccount = document.getElementById("userAccountArea");
        if (!userAccount || userAccount.dataset.authNavigationBound === "true") return;
        userAccount.dataset.authNavigationBound = "true";
        userAccount.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            window.location.href = "/dashboard.html";
        });
    },

    updateNavbar(user) {
        const loginLink = document.getElementById("loginLink");
        const userAccount = document.getElementById("userAccountArea");
        if (!loginLink && !userAccount) return;

        if (user) {
            /*
             * The existing #loginLink is now the desktop account button.
             * desktop-profile-nav.js upgrades this same element with the
             * profile avatar/name/dropdown. Keep it visible after login.
             */
            if (loginLink) {
                loginLink.style.display = "inline-flex";
                loginLink.href = "/dashboard.html";
                loginLink.setAttribute("aria-label", "Account menu");
            }

            /* Legacy account element is kept in the DOM for compatibility,
               but must not create a second desktop account button. */
            if (userAccount) userAccount.style.display = "none";

            const displayName = this.getUserDisplayName(user);
            document.querySelectorAll("[data-user-name]").forEach(element => element.textContent = displayName);
            document.querySelectorAll("[data-user-email]").forEach(element => element.textContent = user.email || "");
            document.querySelectorAll("[data-user-id]").forEach(element => element.textContent = user.id || "");
            document.documentElement.setAttribute("data-authenticated", "true");
        } else {
            if (loginLink) {
                loginLink.style.display = "inline-flex";
                loginLink.href = "/login.html?redirect=/";
                loginLink.setAttribute("aria-label", "Login");
            }
            if (userAccount) userAccount.style.display = "none";
            document.documentElement.setAttribute("data-authenticated", "false");
        }
    },

    handleAuthStateChange(event, session) {
        const user = session?.user || null;
        if (event === "SIGNED_IN" || event === "INITIAL_SESSION") this.cleanAuthUrl();
        setTimeout(() => this.updateNavbar(user), 0);
        window.dispatchEvent(new CustomEvent("nextlevelauthchange", {
            detail: { event, session, user }
        }));
    },

    async init() {
        if (!window.supabaseClient) return;
        this.setupUsernameNavigation();
        window.supabaseClient.auth.onAuthStateChange((event, session) => this.handleAuthStateChange(event, session));
        const session = await this.getSession();
        this.updateNavbar(session?.user || null);
        if (session) this.cleanAuthUrl();
    },

    async logout() {
        if (!window.supabaseClient) return { success: false, error: new Error("Supabase unavailable.") };
        try {
            const { error } = await window.supabaseClient.auth.signOut();
            if (error) return { success: false, error };
            this.updateNavbar(null);
            return { success: true, error: null };
        } catch (error) {
            return { success: false, error };
        }
    },

    async isLoggedIn() {
        return !!(await this.getSession());
    },

    async requireAuth(redirect = "/login.html") {
        const session = await this.getSession();
        if (!session?.user) {
            const currentPage = window.location.pathname + window.location.search;
            const separator = redirect.includes("?") ? "&" : "?";
            window.location.replace(redirect + separator + "redirect=" + encodeURIComponent(currentPage));
            return null;
        }
        return session.user;
    },

    async redirectIfAuthenticated(destination = "/dashboard.html") {
        const session = await this.getSession();
        if (session?.user) {
            window.location.replace(destination);
            return true;
        }
        return false;
    }
};

document.addEventListener("DOMContentLoaded", () => window.NextLevelAuth.init());
