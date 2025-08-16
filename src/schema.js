// javascript/schema-list.js

const schemaDataList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Digital Entertainment Subscriptions",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Product",
        "name": "Netflix Premium Subscription in Bangladesh",
        "image": "https://www.nextlevelbd.store/images/netflix.png",
        "url": "https://www.nextlevelbd.store/details.html?name=Netflix%20Premium",
        "description": "Buy Netflix Premium Subscription in Bangladesh at a low price. Get instant delivery, secure payments, and 24/7 support.",
        "offers": {
          "@type": "Offer",
          "price": "379",
          "priceCurrency": "BDT",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2026-12-31"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "125"
        }
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "Product",
        "name": "Amazon Prime Video Subscription in Bangladesh",
        "image": "https://www.nextlevelbd.store/images/prime-video.png",
        "url": "https://www.nextlevelbd.store/details.html?name=Amazon%20Prime%20Video",
        "description": "Buy an Amazon Prime Video subscription in Bangladesh at the best price. Get instant account delivery and access to thousands of movies and TV shows.",
        "offers": {
          "@type": "Offer",
          "price": "99",
          "priceCurrency": "BDT",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2026-12-31"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.6",
          "reviewCount": "85"
        }
      }
    }
  ]
};

// Dynamically inject JSON-LD into <head>
const script = document.createElement('script');
script.type = "application/ld+json";
script.text = JSON.stringify(schemaDataList);
document.head.appendChild(script);

