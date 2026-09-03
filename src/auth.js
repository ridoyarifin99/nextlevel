"use strict";

/*
 * Compatibility entry for the legacy ./src/auth.js reference.
 * The real authentication implementation lives at ../js/auth.js
 * and is loaded explicitly by the page after Supabase initialization.
 * This file intentionally performs no authentication work so the
 * legacy reference cannot cause a 404 or duplicate auth initialization.
 */
