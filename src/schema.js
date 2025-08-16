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
        "image": "https://www.nextlevelbd.store/assets/cards/netflix.webp",
        "url": "https://www.nextlevelbd.store/details.html?name=Netflix%20Premium",
        "description": "Buy Netflix Premium Subscription...",
        "offers": {
          "@type": "Offer",
          "price": "379",
          "priceCurrency": "BDT"
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
        "image": "https://www.nextlevelbd.store/assets/cards/prime-video.jpg",
        "url": "https://www.nextlevelbd.store/details.html?name=Amazon%20Prime%20Video",
        "description": "Buy an Amazon Prime Video subscription...",
        "offers": {
          "@type": "Offer",
          "price": "99",
          "priceCurrency": "BDT"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.6",
          "reviewCount": "85"
        }
      }
    }
    // You can add more products here following the same ListItem structure
  ]
};

// Dynamically inject JSON-LD into <head>
const script = document.createElement('script');
script.type = "application/ld+json";
script.text = JSON.stringify(schemaDataList);
document.head.appendChild(script);

// Dynamically inject JSON-LD into <head>
const script = document.createElement('script');
script.type = "application/ld+json";
script.text = JSON.stringify(schemaData);
document.head.appendChild(script);

