"use strict";

/*
 * Remove the legacy hard-coded customerReviews arrays from the product
 * objects once details.js has initialized window.products.
 * Supabase product_reviews is the single source of truth for reviews.
 */
(() => {
  const cleanup = () => {
    if (!Array.isArray(window.products)) return false;

    let removed = 0;
    for (const product of window.products) {
      if (product && Object.prototype.hasOwnProperty.call(product, "customerReviews")) {
        delete product.customerReviews;
        removed++;
      }
    }

    return removed > 0 || window.__nlsLegacyReviewsCleaned === true;
  };

  if (cleanup()) {
    window.__nlsLegacyReviewsCleaned = true;
    return;
  }

  const timer = setInterval(() => {
    if (cleanup()) {
      window.__nlsLegacyReviewsCleaned = true;
      clearInterval(timer);
    }
  }, 25);

  setTimeout(() => clearInterval(timer), 10000);
})();
