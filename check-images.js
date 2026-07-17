const BASE = 'https://nvapeaustralia-snh4.onrender.com/assets';

const candidates = [
  // Peach Ice variations
  'Peach-Ice-280x280.jpg', 'Peach-ice-280x280.jpg', 'peach-ice-280x280.jpg',
  'Peach-280x280.jpg', 'Peach-Ice-247x296.jpg', 'Peach-247x296.jpg',
  'Wala-Peach-Ice-280x280.jpg', 'WALA-Peach-Ice-280x280.jpg',
  // Raspberry Grape variations
  'Raspberry-Grape-280x280.jpg', 'Raspberry-grape-280x280.jpg',
  'JNR-Raspberry-Grape-280x280.jpg', 'Raspberry-Grape-600x600.jpg',
  'Raspberry-Grape.webp', 'Raspberry-Grape-280x280.webp',
  'JNR-280x280.jpg', 'Raspberry-280x280.jpg',
  // Cherry Pomegranate variations
  'Cherry-Pomegranate-280x280.jpg', 'Cherry-pom-280x280.jpg',
  'Cherry-Pom-280x280.jpg', 'CherryPomegranate-280x280.jpg',
  'Bang-Cherry-280x280.jpg', 'Cherry-280x280.jpg',
  // Try listing common other product images
  'Lychee-Ice-280x280.jpg', 'Watermelon-Ice-280x280.jpg',
  'Passion-Fruit-280x280.jpg', 'Tropical-280x280.jpg',
  'Mango-Peach-280x280.jpg', 'Lemon-Ice-280x280.jpg',
];

async function check() {
  const found = [];
  for (const f of candidates) {
    try {
      const res = await fetch(`${BASE}/${f}`, { method: 'HEAD' });
      if (res.ok) {
        console.log(`✅ FOUND: ${f}`);
        found.push(f);
      } else {
        process.stdout.write(`❌ ${f}\n`);
      }
    } catch (e) {
      console.log(`💥 ${f}`);
    }
  }
  console.log('\n✅ All found:', found.join(', '));
}
check();
