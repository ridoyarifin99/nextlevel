// javascript/schema.js

const schemaData = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Netflix Premium Subscription in Bangladesh",
  "image": "https://www.nextlevelbd.store/assets/cards/netflix.webp",
  "url": "https://www.nextlevelbd.store/details.html?name=Netflix%20Premium",
  "description": "Buy Netflix Premium Subscription in Bangladesh at the lowest price. Enjoy instant delivery, secure payments, and 24/7 customer support from Next Level Estore.",
  "sku": "NETFLIX-BD-001",
  "mpn": "NETFLIX-BD-001",
  "brand": {
    "@type": "Brand",
    "name": "Netflix"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://www.nextlevelbd.store/details.html?name=Netflix%20Premium",
    "priceCurrency": "BDT",
    "price": "379",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": {
      "@type": "Organization",
      "name": "Next Level Estore",
      "url": "https://www.nextlevelbd.store"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "125"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Sajid Khan"
      },
      "reviewBody": "Fast service and a great price. Highly recommended!",
      "datePublished": "2025-08-16"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Nisha Ahmed"
      },
      "reviewBody": "Quick delivery and reliable support. Will buy again.",
      "datePublished": "2025-08-15"
    }
  ]
};

// Dynamically inject JSON-LD into <head>
const script = document.createElement('script');
script.type = "application/ld+json";
script.text = JSON.stringify(schemaData);
document.head.appendChild(script);

