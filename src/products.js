export const products = [
  { slug: 'netflix-premium', name: 'Netflix Premium', category: 'streaming', price: 379, duration: '1 Month', image: '/assets/cards/netflix-vs-amazon.jpg', description: 'Premium entertainment with movies, series and Netflix Originals.' },
  { slug: 'amazon-prime-video', name: 'Amazon Prime Video', category: 'streaming', price: 129, duration: '1 Month', image: '/assets/cards/Prime_Video.png', description: 'Movies, series and Prime Originals.' },
  { slug: 'hbo-max', name: 'HBO Max', category: 'streaming', price: 199, duration: '1 Month', image: '/assets/cards/hbo_max.svg', description: 'HBO, Warner Bros., DC and Max Originals.' },
  { slug: 'crunchyroll-mega', name: 'Crunchyroll Mega', category: 'streaming', price: 149, duration: '1 Month', image: '/assets/cards/crunchy.png', description: 'Anime streaming with a large library of popular titles.' },
  { slug: 'apple-tv', name: 'Apple TV+', category: 'streaming', price: 199, duration: '1 Month', image: '/assets/cards/apple_tv.jpg', description: 'Apple Originals, movies and premium series.' },
  { slug: 'apple-music', name: 'Apple Music', category: 'music', price: 149, duration: '1 Month', image: '/assets/cards/apple_music.jpg', description: 'Millions of songs with an ad-free listening experience.' },
  { slug: 'amazon-music-unlimited', name: 'Amazon Music Unlimited', category: 'music', price: 199, duration: '1 Month', image: '/assets/cards/amazon-music-unlimited.jpeg', description: 'Unlimited music streaming across your devices.' },
  { slug: 'canva-pro', name: 'Canva Pro', category: 'ai-design', price: 299, duration: '1 Month', image: '/assets/cards/canva.png', description: 'Premium design tools, templates and creative assets.' },
  { slug: 'perplexity-pro', name: 'Perplexity Pro', category: 'ai-design', price: 499, duration: '1 Month', image: '/assets/cards/Perplexity.svg', description: 'Advanced AI search and research capabilities.' },
  { slug: 'linkedin-premium', name: 'LinkedIn Premium', category: 'education', price: 499, duration: '1 Month', image: '/assets/cards/LinkedIn.png', description: 'Premium professional networking and career features.' }
];

export function getProduct(slug) {
  const key = String(slug || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return products.find((product) => product.slug === key) || null;
}
