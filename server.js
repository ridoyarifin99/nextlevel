const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  const host = req.headers.host;
  let file = 'index.html'; // default homepage

  if (host.startsWith('details.')) file = 'details.html';
  else if (host.startsWith('payments.')) file = 'checkout.html';

  const filePath = path.join(process.cwd(), file);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.status(500).send('Server Error');
      return;
    }
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content);
  });
}
