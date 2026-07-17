import { chromium } from '@playwright/test';
import fs from 'fs';

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log("Navigating to site...");
  await page.goto('https://nvapeaustralia-snh4.onrender.com/', { waitUntil: 'networkidle' });
  
  console.log("Extracting products...");
  
  // Give it a moment to render
  await page.waitForTimeout(2000);
  
  // Scroll down to load all items
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  
  const products = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.product-card'));
    
    return cards.map((card, i) => {
      const nameEl = card.querySelector('.product-name, h3, h2');
      const name = nameEl ? nameEl.innerText.trim() : `Unknown Product ${i}`;
      
      const priceEl = card.querySelector('.product-price');
      let price = priceEl ? parseFloat(priceEl.innerText.replace(/[^0-9.]/g, '')) : 20.00;
      
      const origPriceEl = card.querySelector('[style*="line-through"]');
      let originalPrice = origPriceEl ? parseFloat(origPriceEl.innerText.replace(/[^0-9.]/g, '')) : null;
      
      const imgEl = card.querySelector('img');
      const image = imgEl ? imgEl.src : '';
      
      const brandEl = card.querySelector('.product-category');
      const brand = brandEl ? brandEl.innerText.trim() : 'Unknown';
      
      const badgeEl = card.querySelector('.product-badge');
      const badge = badgeEl ? badgeEl.innerText.trim() : null;

      return {
        id: i + 1,
        name,
        brand,
        category: "Disposables", // default
        price,
        originalPrice,
        puffs: name.match(/(\d+00+)/) ? parseInt(name.match(/(\d+00+)/)[1]) : null,
        flavour: "Assorted", 
        image,
        badge,
        inStock: true,
        rating: 4.8,
        reviews: Math.floor(Math.random() * 200) + 50,
        description: `Experience the amazing flavour of ${name}. High-quality and satisfying.`,
        nicotine: "50mg",
        capacity: "12ml",
        battery: "600mAh"
      };
    }).filter(p => p.name !== `Unknown Product ${p.id - 1}`);
  });
  
  console.log(`Extracted ${products.length} products.`);
  
  if (products.length > 0) {
    const fileContent = `export const brands = ["ELFBAR","LOST MARY","VOZOL","RANDM","SKE","CRYSTAL BAR","IVG","HAYATI","GOLD BAR","AIR BAR"];

export const products = ${JSON.stringify(products, null, 2)};

export const reviews = [
  { id:1, name:"Sarah M.", location:"Sydney, NSW", rating:5, date:"2 days ago", text:"Absolutely love this store! Fast shipping and the products are exactly as described.", product: products[0]?.name || "Vape" },
  { id:2, name:"James T.", location:"Melbourne, VIC", rating:5, date:"1 week ago", text:"Great prices and super quick delivery.", product: products[1]?.name || "Vape" },
  { id:3, name:"Emily R.", location:"Brisbane, QLD", rating:4, date:"2 weeks ago", text:"Really happy with my order. Highly recommend!", product: products[2]?.name || "Vape" }
];
`;
    fs.writeFileSync('src/data/products.js', fileContent);
    console.log("Successfully updated src/data/products.js");
  } else {
    console.log("No products found, DOM structure might be different.");
  }
  
  await browser.close();
})();
