const fs = require('fs');

async function extract() {
  console.log("Fetching JS bundle...");
  const res = await fetch("https://nvapeaustralia-snh4.onrender.com/assets/index-B8fFI2y8.js");
  const text = await res.text();
  console.log(`Fetched ${text.length} bytes.`);

  // Find the array of products. In minified code, it will be something like:
  // e=[{id:1,name:"...",brand:"..."...}] or const X=[{...}]
  // We can look for `name:`, `brand:`, `price:` to locate the JSON.
  
  // A regex to match an array of objects that have id, name, category, etc.
  // The JS bundle might not quote keys. We'll find the assignment `[{id:1,...`
  
  const match = text.match(/\[\{id:1,name:"[^"]+",brand:"[^"]+".+?\}\]/);
  
  if (match) {
    let rawStr = match[0];
    
    // We need to properly parse this JS object array into actual JSON.
    // Since it's raw JS, we can use `eval` securely enough just for this string if we wrap it,
    // or just construct the string.
    
    try {
      // Evaluate the raw array to a JS object
      const data = eval("(" + rawStr + ")");
      console.log(`Successfully extracted ${data.length} products!`);
      
      // Update the local products.js file
      let localCode = fs.readFileSync('src/data/products.js', 'utf8');
      
      // Replace the `export const products = [ ... ];` block
      const start = localCode.indexOf('export const products = [');
      const end = localCode.indexOf('];', start) + 2;
      
      if (start > -1 && end > -1) {
        // Format the new products array
        const newProductsStr = 'export const products = ' + JSON.stringify(data, null, 2) + ';';
        localCode = localCode.substring(0, start) + newProductsStr + localCode.substring(end);
        
        fs.writeFileSync('src/data/products.js', localCode);
        console.log("src/data/products.js has been updated!");
      } else {
        console.log("Could not find the products block in products.js to replace.");
        // If not found, just write to a tmp file
        fs.writeFileSync('extracted_products.json', JSON.stringify(data, null, 2));
      }
    } catch (e) {
      console.log("Failed to parse array with eval: ", e.message);
      fs.writeFileSync('extracted_products_raw.txt', rawStr);
    }
  } else {
    console.log("Could not find the products array pattern in the JS bundle.");
    // Write the JS bundle so we can investigate it
    fs.writeFileSync('bundle.js', text);
  }
}

extract();
