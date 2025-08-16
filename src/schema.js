// javascript/schema.js

const schemaData = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Netflix Premium Subscription",
  "image": "https://www.nextlevelbd.store/images/netflix.jpg",
  "description": "Buy Netflix Premium Subscription in Bangladesh at cheap prices. Instant delivery, secure payments, and 24/7 support.",
  "sku": "NETFLIX-BD-001",
  "brand": {
    "@type": "Brand",
    "name": "Netflix"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://www.nextlevelbd.store/netflix",
    "priceCurrency": "BDT",
    "price": "379",
    "priceValidUntil": "2025-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": {
      "@type": "Organization",
      "name": "Next Level Estore"
    }
  }
};

// Dynamically inject JSON-LD into <head>
const script = document.createElement('script');
script.type = "application/ld+json";
script.text = JSON.stringify(schemaData);
document.head.appendChild(script);
