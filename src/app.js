import { products } from './products.js';

const app = document.querySelector('#app');
const path = window.location.pathname.replace(/\/+$/, '') || '/';
const match = path.match(/^\/product\/([^/]+)$/i);

function money(value) {
  return `৳${Number(value).toLocaleString('en-BD')}`;
}

function card(product) {
  return `<article class="card">
    <a class="card-image" href="/product/${product.slug}"><img src="${product.image}" alt="${product.name}" loading="lazy"></a>
    <div class="card-body">
      <span class="tag">${product.category}</span>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="card-bottom"><strong>${money(product.price)}</strong><a class="button small" href="/product/${product.slug}">View</a></div>
    </div>
  </article>`;
}

function shell(content) {
  app.innerHTML = `<header class="header"><div class="nav wrap"><a class="brand" href="/">NEXT LEVEL <span>SUBS</span></a><nav><a href="/#products">Products</a><a href="/#categories">Categories</a><a href="/login.html">Login</a><a class="cart" href="/checkout.html">Cart</a></nav></div></header>${content}<footer><div class="wrap"><strong>NEXT LEVEL SUBS</strong><p>Premium digital subscriptions in Bangladesh.</p></div></footer>`;
}

function home() {
  shell(`<main>
    <section class="hero"><div class="wrap hero-inner"><div><span class="eyebrow">Trusted since 2019</span><h1>Premium subscriptions.<br><span>Simple & reliable.</span></h1><p>Streaming, music, cloud, VPN and digital services at competitive prices.</p><div class="actions"><a class="button" href="#products">Browse products</a><a class="button ghost" href="/checkout.html">Go to checkout</a></div></div><div class="hero-card"><strong>20K+</strong><span>customers served</span><strong>Fast</strong><span>digital delivery</span></div></div></section>
    <section id="categories" class="section"><div class="wrap"><div class="section-head"><span class="eyebrow">Shop by category</span><h2>Everything in one place</h2></div><div class="chips"><a href="#products">Streaming</a><a href="#products">Music</a><a href="#products">Cloud Storage</a><a href="#products">VPN</a><a href="#products">AI & Design</a><a href="#products">Education</a></div></div></section>
    <section id="products" class="section"><div class="wrap"><div class="section-head"><span class="eyebrow">Featured</span><h2>Popular products</h2></div><div class="grid">${products.map(card).join('')}</div></div></section>
  </main>`);
}

function productPage(product) {
  if (!product) { shell('<main class="empty wrap"><h1>Product not found</h1><a class="button" href="/">Back to home</a></main>'); return; }
  shell(`<main class="section"><div class="wrap product"><div class="product-media"><img src="${product.image}" alt="${product.name}"></div><div class="product-info"><span class="eyebrow">${product.category}</span><h1>${product.name}</h1><p>${product.description}</p><div class="price">${money(product.price)} <small>/ ${product.duration}</small></div><div class="notice">Secure your order through our checkout flow.</div><a class="button" href="/checkout.html?product=${product.slug}">Buy now</a><a class="back" href="/">← Back to products</a></div></div></main>`);
}

if (match) productPage(products.find((p) => p.slug === match[1].toLowerCase())); else home();
