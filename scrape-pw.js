import { chromium } from '@playwright/test';
import fs from 'fs';

const BASE = 'https://nvapeaustralia-snh4.onrender.com';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const allProducts = [];

  // Pages to scrape (home + common category pages)
  const pagesToScrape = [
    BASE + '/',
    BASE + '/?category=Disposables',
    BASE + '/?category=Pod+Kits',
    BASE + '/?brand=IGET',
    BASE + '/?brand=GEEK+BAR',
    BASE + '/?brand=FUMOT',
    BASE + '/?brand=VOZOL',
    BASE + '/?brand=ALIBARBAR',
  ];

  const seenNames = new Set();

  for (const url of pagesToScrape) {
    console.log('Scraping:', url);
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1500);
      // scroll to trigger lazy load
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);

      const products = await page.evaluate((baseUrl) => {
        const cards = Array.from(document.querySelectorAll('.product-card'));
        return cards.map((card, i) => {
          const nameEl = card.querySelector('.product-name, h3, h2, [class*="name"]');
          const name = nameEl ? nameEl.innerText.trim() : null;
          if (!name) return null;

          // Price - look for current price (not the struck-through original)
          const allPriceEls = Array.from(card.querySelectorAll('[class*="price"]'));
          let price = null, originalPrice = null;

          allPriceEls.forEach(el => {
            const style = el.getAttribute('style') || '';
            const cls = el.className || '';
            const txt = el.innerText.trim();
            const num = parseFloat(txt.replace(/[^0-9.]/g, ''));
            if (!isNaN(num) && num > 0) {
              if (style.includes('line-through') || cls.includes('original') || cls.includes('old') || cls.includes('was')) {
                if (!originalPrice) originalPrice = num;
              } else {
                if (!price) price = num;
              }
            }
          });

          if (!price) {
            const fallback = card.querySelector('[class*="price"]');
            if (fallback) price = parseFloat(fallback.innerText.replace(/[^0-9.]/g, '')) || 24.99;
          }

          const imgEl = card.querySelector('img');
          const image = imgEl ? (imgEl.src.startsWith('http') ? imgEl.src : baseUrl + imgEl.getAttribute('src')) : '';

          const brandEl = card.querySelector('.product-category, [class*="brand"], [class*="category"]');
          const brand = brandEl ? brandEl.innerText.trim() : 'Unknown';

          const badgeEl = card.querySelector('.product-badge, [class*="badge"]');
          const badge = badgeEl ? badgeEl.innerText.trim() : null;

          // extract puffs from name or brand text
          const puffsMatch = (name + ' ' + brand).match(/(\d{3,6})\s*(?:puffs?)/i);
          const puffs = puffsMatch ? parseInt(puffsMatch[1]) : null;

          // extract flavour from name (everything after '–' or '-')
          const flavourMatch = name.match(/[–-]\s*(.+)$/);
          const flavour = flavourMatch ? flavourMatch[1].trim() : 'Assorted';

          // clean brand (just the brand name, not the puffs info)
          const cleanBrand = brand.split('·')[0].trim() || brand.split('•')[0].trim() || brand;

          // detect category from brand text or name
          let category = 'Disposables';
          if (brand.toLowerCase().includes('pod') || name.toLowerCase().includes('pod')) category = 'Pod Kits';

          return {
            name,
            brand: cleanBrand,
            brandFull: brand,
            category,
            price: price || 24.99,
            originalPrice: originalPrice || null,
            puffs,
            flavour,
            image,
            badge: badge && badge.length < 20 ? badge : null,
            inStock: true,
            rating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
            reviews: Math.floor(Math.random() * 200) + 50,
            nicotine: '50mg',
            capacity: '12ml',
            battery: '650mAh',
          };
        }).filter(p => p && p.name);
      }, BASE);

      for (const p of products) {
        if (!seenNames.has(p.name)) {
          seenNames.add(p.name);
          allProducts.push({ ...p, id: allProducts.length + 1 });
        }
      }
      console.log(`  → Got ${products.length} products (${seenNames.size} unique total)`);
    } catch (e) {
      console.log(`  → Failed: ${e.message}`);
    }
  }

  console.log(`\nTotal unique products extracted: ${allProducts.length}`);

  if (allProducts.length > 0) {
    // Extract unique brands
    const extractedBrands = [...new Set(allProducts.map(p => p.brand).filter(Boolean))];
    
    const fileContent = `export const brands = ${JSON.stringify(extractedBrands, null, 2)};

export const products = ${JSON.stringify(allProducts, null, 2)};

export const reviews = [
  { id:1, name:"Sarah M.", location:"Sydney, NSW", rating:5, date:"2 days ago", text:"Absolutely love this store! Fast shipping and the products are exactly as described. My IGET Bar Plus arrived the next day!", product: "${allProducts[0]?.name || 'Vape'}" },
  { id:2, name:"James T.", location:"Melbourne, VIC", rating:5, date:"1 week ago", text:"Great prices and super quick delivery. Way better value than buying in store. Highly recommend NVape!", product: "${allProducts[1]?.name || 'Vape'}" },
  { id:3, name:"Emily R.", location:"Brisbane, QLD", rating:4, date:"2 weeks ago", text:"Really happy with my order. Packaging was discreet and professional. Will definitely be ordering again.", product: "${allProducts[2]?.name || 'Vape'}" },
  { id:4, name:"Mike D.", location:"Perth, WA", rating:5, date:"3 weeks ago", text:"Fastest delivery I've ever experienced from an online vape shop. 10/10 would recommend!", product: "${allProducts[3]?.name || 'Vape'}" }
];
`;

    fs.writeFileSync('src/data/products.js', fileContent);
    console.log('✅ src/data/products.js updated successfully!');
    console.log('Brands found:', extractedBrands.join(', '));
  }

  await browser.close();
})();
