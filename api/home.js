const fs = require('node:fs');
const path = require('node:path');

module.exports = function handler(req, res) {
  try {
    let html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');

    // Render the product grid immediately. Keep AOS animations; remove only the
    // artificial 1500ms startup delay that made the mobile grid look empty.
    html = html.replace(
      /\s*setTimeout\(\(\) => \{\s*fSubs=\[\.\.\.subs\];\s*renderCats\(\);\s*updateCartUI\(\);\s*if\(typeof AOS!==['\"]undefined['\"]\) setTimeout\(\(\)=>AOS\.refresh\(\), 50\);\s*\}, 1500\);/,
      "\n        fSubs=[...subs];\n        renderCats();\n        updateCartUI();\n        if(typeof AOS!=='undefined') requestAnimationFrame(()=>AOS.refresh());"
    );

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.status(200).send(html);
  } catch (error) {
    console.error('Homepage render error:', error);
    res.status(500).send('Homepage unavailable');
  }
};
