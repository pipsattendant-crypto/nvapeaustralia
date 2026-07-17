// Quick check for banner product images
const BASE = 'https://nvapeaustralia-snh4.onrender.com/assets';

const candidates = [
  // INGOT / ALIBARBAR style
  'INGOT-280x280.jpg','Ingot-280x280.jpg','Alibarbar-Ingot-280x280.jpg',
  'INR-280x280.jpg','Inr-280x280.jpg',
  // Banner specific images
  'banner.jpg','hero.jpg','hero-banner.jpg','banner-products.jpg',
  'banner-products.png','hero-products.png',
  // Other product assets
  'Watermelon-Ice-280x280.jpg','Lychee-Ice-280x280.jpg',
  'Mixed-Berry-280x280.jpg','Passionfruit-280x280.jpg',
  'Strawberry-Ice-280x280.jpg','Apple-Ice-280x280.jpg',
  'Menthol-280x280.jpg','Tobacco-280x280.jpg',
  // CHUPPA
  'Chuppa-Chupps-280x280.jpg','Chuppa-Chupps-247x296.jpg',
  'CuppaChupps-280x280.jpg','Chupa-Chups-280x280.jpg',
];

async function check() {
  const found = [];
  for (const f of candidates) {
    const res = await fetch(`${BASE}/${f}`, { method: 'HEAD' }).catch(() => ({ ok: false }));
    if (res.ok) { console.log(`✅ ${f}`); found.push(f); }
  }
  console.log('\nFound:', found.length ? found.join(', ') : 'none');
}
check();
