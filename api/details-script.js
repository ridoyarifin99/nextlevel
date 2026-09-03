"use strict";

const fs = require("fs");
const path = require("path");

module.exports = function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    return res.end("Method Not Allowed");
  }

  try {
    const file = path.join(__dirname, "..", "js", "details.js");
    let source = fs.readFileSync(file, "utf8");

    // Repair accidental duplicate commas in the large product-data array.
    source = source.replace(/,\s*,/g, ",");

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=3600");
    res.setHeader("X-Content-Type-Options", "nosniff");

    if (req.method === "HEAD") return res.end();
    return res.end(source);
  } catch (error) {
    console.error("DETAILS SCRIPT ERROR:", error && error.stack ? error.stack : error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.end("Internal Server Error");
  }
};
