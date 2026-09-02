"use strict";

// Backwards-compatible entry point for old /api/product routes.
// Keep one product renderer so /product/* cannot accidentally hit the legacy
// SEO handler and produce "Requested product: undefined".
const productView = require("./product-view");

module.exports = function handler(req, res) {
  return productView(req, res);
};
