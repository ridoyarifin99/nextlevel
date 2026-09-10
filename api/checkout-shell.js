"use strict";
const fs=require("fs"),path=require("path");
module.exports=async function handler(req,res){
  if(req.method!=="GET"&&req.method!=="HEAD"){res.statusCode=405;res.setHeader("Allow","GET, HEAD");return res.end("Method Not Allowed")}
  try{let html=fs.readFileSync(path.join(__dirname,"..","checkout.html"),"utf8");if(!/promo-checkout\.js/i.test(html))html=html.replace(/<\/body>/i,'<script src="/js/promo-checkout.js"></script></body>');res.statusCode=200;res.setHeader("Content-Type","text/html; charset=utf-8");res.setHeader("Cache-Control","no-store, max-age=0");return res.end(html)}catch(e){res.statusCode=500;return res.end("Checkout unavailable")}
};
