import { chromium } from '@playwright/test';

const BASE = 'https://nvapeaustralia-snh4.onrender.com';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Navigating...');
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);

  // Get all img elements on the page
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      width: img.naturalWidth,
      height: img.naturalHeight,
    }));
  });

  console.log('\nAll images found on page:');
  images.forEach(img => console.log(`  ${img.alt || '(no alt)'}: ${img.src}`));

  // Also get all product cards with their full details
  const products = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.product-card')).map(card => {
      const img = card.querySelector('img');
      const name = card.querySelector('.product-name, h3, h2');
      return {
        name: name?.innerText?.trim(),
        imgSrc: img?.src,
        imgAlt: img?.alt,
      };
    });
  });

  console.log('\nProduct cards with images:');
  products.forEach(p => console.log(`  ${p.name}: ${p.imgSrc}`));

  await browser.close();
})();
