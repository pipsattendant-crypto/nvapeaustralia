import { chromium } from '@playwright/test';
import fs from 'fs';

const BASE = 'https://nvapeaustralia-snh4.onrender.com';

const brandPages = [
  '/', '/?category=Disposables',
  '/?brand=IGET', '/?brand=GEEK+BAR', '/?brand=FUMOT',
  '/?brand=VOZOL', '/?brand=ALIBARBAR', '/?brand=ELF+BAR',
  '/?brand=WALA', '/?brand=NEXA', '/?brand=JNR',
  '/?brand=SMOK', '/?brand=BANG', '/?brand=INR',
  '/?brand=CHUPPA+CHUPPS', '/?brand=HQD', '/?brand=RANDM',
  '/?brand=SKE', '/?brand=LOST+MARY', '/?brand=HAYATI',
  '/?brand=GOLD+BAR', '/?brand=AIR+BAR', '/?brand=CRYSTAL+BAR', '/?brand=IVG',
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const allProducts = [];
  const seenNames = new Set();

  for (const path of brandPages) {
    const url = BASE + path;
    console.log('Scraping:', url);
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(2000);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);

      const products = await page.evaluate((baseUrl) => {
        const cards = Array.from(document.querySelectorAll('.product-card'));
        return cards.map((card) => {
          const nameEl = card.querySelector('.product-name, h3, h2');
          const name = nameEl ? nameEl.innerText.trim() : null;
          if (!name) return null;

          // Get all elements with price-like classes
          const priceEls = Array.from(card.querySelectorAll('[class*="price"]'));
          let price = null, originalPrice = null;
          priceEls.forEach(el => {
            const style = el.getAttribute('style') || '';
            const cls = el.className || '';
            const num = parseFloat(el.innerText.replace(/[^0-9.]/g, ''));
            if (!isNaN(num) && num > 0) {
              if (style.includes('line-through') || cls.includes('original') || cls.includes('old')) {
                if (!originalPrice) originalPrice = num;
              } else {
                if (!price) price = num;
              }
            }
          });

          const imgEl = card.querySelector('img');
          const image = imgEl ? (imgEl.src.startsWith('http') ? imgEl.src : baseUrl + imgEl.getAttribute('src')) : '';

          const brandEl = card.querySelector('.product-category, [class*="brand"], [class*="category"]');
          const brandRaw = brandEl ? brandEl.innerText.trim() : '';
          // "IGET · 10,000 TO 12,000 PUFFS" -> brand = "IGET", puffsText = "10,000 TO 12,000 PUFFS"
          const brandParts = brandRaw.split('·');
          const brand = brandParts[0].trim();
          const puffsText = brandParts[1] ? brandParts[1].trim() : '10,000 PUFFS';

          const badgeEl = card.querySelector('.product-badge, [class*="badge"]');
          const badge = badgeEl ? badgeEl.innerText.trim() : null;

          const flavourMatch = name.match(/[–\-]\s*(.+)$/);
          const flavour = flavourMatch ? flavourMatch[1].trim() : name;

          const puffsMatch = brandRaw.match(/(\d[\d,]+)\s*(?:TO\s*(\d[\d,]+))?\s*PUFFS/i);
          const puffs = puffsMatch ? parseInt((puffsMatch[2] || puffsMatch[1]).replace(/,/g, '')) : null;

          return {
            name,
            brand,
            brandFull: brandRaw,
            puffsText,
            category: 'Disposables',
            price: price || 24.99,
            originalPrice: originalPrice || null,
            puffs,
            flavour,
            image,
            badge: badge && badge.length < 25 ? badge : null,
            inStock: true,
            rating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
            reviews: Math.floor(Math.random() * 250) + 50,
            nicotine: '50mg',
            capacity: '12ml',
            battery: '650mAh',
            description: `Experience the amazing ${flavour} flavour from ${brand}. Premium quality, satisfying every puff.`,
          };
        }).filter(p => p && p.name);
      }, BASE);

      for (const p of products) {
        if (!seenNames.has(p.name)) {
          seenNames.add(p.name);
          allProducts.push({ ...p, id: allProducts.length + 1 });
        }
      }
      console.log(`  → ${products.length} found | ${seenNames.size} total unique`);
    } catch (e) {
      console.log(`  → Error: ${e.message.split('\n')[0]}`);
    }
  }

  console.log(`\n✅ Total unique products: ${allProducts.length}`);

  const extractedBrands = [...new Set(allProducts.map(p => p.brand).filter(b => b && b !== 'Unknown'))];

  const fileContent = `export const brands = ${JSON.stringify(extractedBrands, null, 2)};

export const products = ${JSON.stringify(allProducts, null, 2)};

export const reviews = [
  { id:1, name:"Sarah M.", location:"Sydney, NSW", rating:5, date:"2 days ago", text:"Absolutely love this store! Fast shipping and the products are exactly as described. My IGET Bar Plus arrived the next day!", product: "${allProducts[0]?.name || 'Vape'}" },
  { id:2, name:"James T.", location:"Melbourne, VIC", rating:5, date:"1 week ago", text:"Great prices and super quick delivery. Way better value than buying in store. Highly recommend NVape!", product: "${allProducts[1]?.name || 'Vape'}" },
  { id:3, name:"Emily R.", location:"Brisbane, QLD", rating:4, date:"2 weeks ago", text:"Really happy with my order. Packaging was discreet and professional. Will definitely be ordering again.", product: "${allProducts[2]?.name || 'Vape'}" },
  { id:4, name:"Mike D.", location:"Perth, WA", rating:5, date:"3 weeks ago", text:"Fastest delivery I have ever experienced from an online vape shop. 10/10 would recommend!", product: "${allProducts[3]?.name || 'Vape'}" }
];
`;

  fs.writeFileSync('src/data/products.js', fileContent);
  console.log('✅ src/data/products.js updated!');
  console.log('Brands:', extractedBrands.join(', '));

  await browser.close();
})();
